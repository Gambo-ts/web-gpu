import type { TextureSourceOptions } from '../types.js';

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

type BufferSource = ArrayBuffer | TypedArray;

export async function loadImageBitmap(url: string | URL): Promise<ImageBitmap> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load image: ${url} (${response.status})`);
  }
  const blob = await response.blob();
  return createImageBitmap(blob, { colorSpaceConversion: 'none' });
}

export function createTexture(device: GPUDevice, options: GPUTextureDescriptor): GPUTexture {
  return device.createTexture(options);
}

export function createTextureFromData(
  device: GPUDevice,
  data: BufferSource,
  width: number,
  height: number,
  options: Partial<GPUTextureDescriptor> = {}
): GPUTexture {
  const texture = device.createTexture({
    size: [width, height],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    ...options,
  });

  device.queue.writeTexture(
    { texture },
    data as unknown as GPUAllowSharedBufferSource,
    { bytesPerRow: width * 4 },
    { width, height }
  );

  return texture;
}

export function numMipLevels(...sizes: number[]): number {
  const maxSize = Math.max(...sizes);
  return 1 + Math.floor(Math.log2(maxSize));
}

export async function createTextureFromImage(
  device: GPUDevice,
  url: string | URL,
  options: TextureSourceOptions = {}
): Promise<GPUTexture> {
  const imageBitmap = await loadImageBitmap(url);
  return createTextureFromSource(device, imageBitmap, options);
}

export function createTextureFromSource(
  device: GPUDevice,
  source: ImageBitmap,
  options: TextureSourceOptions = {}
): GPUTexture {
  const mipLevelCount = options.mips ? numMipLevels(source.width, source.height) : 1;

  const texture = device.createTexture({
    format: 'rgba8unorm',
    mipLevelCount,
    size: [source.width, source.height],
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
  });

  copySourceToTexture(device, texture, source, options);

  if (texture.mipLevelCount > 1) {
    generateMips(device, texture);
  }

  return texture;
}

function copySourceToTexture(
  device: GPUDevice,
  texture: GPUTexture,
  source: ImageBitmap,
  options: TextureSourceOptions
): void {
  const { width, height } = source;
  device.queue.copyExternalImageToTexture(
    { source, flipY: options.flipY ?? true },
    { texture },
    { width, height }
  );
}

const generateMips = (() => {
  let sampler: GPUSampler | null = null;
  let module: GPUShaderModule | null = null;
  const pipelineByFormat: Map<GPUTextureFormat, GPURenderPipeline> = new Map();

  return function generateMips(device: GPUDevice, texture: GPUTexture): void {
    if (!module) {
      module = device.createShaderModule({
        label: 'Mip level generation shaders',
        code: /* wgsl */ `
          struct VSOutput {
            @builtin(position) position: vec4f,
            @location(0) texcoord: vec2f,
          };

          @vertex fn vs(@builtin(vertex_index) vertexIndex: u32) -> VSOutput {
            let pos = array(
              vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0),
              vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0),
            );
            var vsOutput: VSOutput;
            let xy = pos[vertexIndex];
            vsOutput.position = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
            vsOutput.texcoord = vec2f(xy.x, 1.0 - xy.y);
            return vsOutput;
          }

          @group(0) @binding(0) var ourSampler: sampler;
          @group(0) @binding(1) var ourTexture: texture_2d<f32>;

          @fragment fn fs(fsInput: VSOutput) -> @location(0) vec4f {
            return textureSample(ourTexture, ourSampler, fsInput.texcoord);
          }
        `,
      });

      sampler = device.createSampler({ minFilter: 'linear' });
    }

    if (!pipelineByFormat.has(texture.format)) {
      pipelineByFormat.set(
        texture.format,
        device.createRenderPipeline({
          layout: 'auto',
          vertex: { module: module!, entryPoint: 'vs' },
          fragment: { module: module!, entryPoint: 'fs', targets: [{ format: texture.format }] },
        })
      );
    }

    const pipeline = pipelineByFormat.get(texture.format)!;
    const encoder = device.createCommandEncoder({ label: 'Mip gen encoder' });

    for (let baseMipLevel = 1; baseMipLevel < texture.mipLevelCount; baseMipLevel++) {
      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: sampler! },
          {
            binding: 1,
            resource: texture.createView({
              baseMipLevel: baseMipLevel - 1,
              mipLevelCount: 1,
            }),
          },
        ],
      });

      const renderPassDesc: GPURenderPassDescriptor = {
        label: `Mip level ${baseMipLevel}`,
        colorAttachments: [
          {
            view: texture.createView({ baseMipLevel, mipLevelCount: 1 }),
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      };

      const pass = encoder.beginRenderPass(renderPassDesc);
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(6);
      pass.end();
    }

    device.queue.submit([encoder.finish()]);
  };
})();

export function createSampler(device: GPUDevice, options: GPUSamplerDescriptor = {}): GPUSampler {
  return device.createSampler(options);
}

export function createBindGroupForTexture(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  sampler: GPUSampler,
  texture: GPUTexture,
  uniformBuffer?: GPUBuffer
): GPUBindGroup {
  const entries: GPUBindGroupEntry[] = [
    { binding: 0, resource: sampler },
    { binding: 1, resource: texture.createView() },
  ];

  if (uniformBuffer) {
    entries.push({ binding: 2, resource: { buffer: uniformBuffer } });
  }

  return device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries,
  });
}
