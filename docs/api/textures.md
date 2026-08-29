# Textures API

## Loading Images

### loadImageBitmap

Load an image from URL and create an ImageBitmap.

```typescript
async function loadImageBitmap(url: string | URL): Promise<ImageBitmap>;
```

### createTextureFromImage

Load image and create GPU texture in one call.

```typescript
interface TextureSourceOptions {
  mips?: boolean; // default: false
  flipY?: boolean; // default: true
}

async function createTextureFromImage(
  device: GPUDevice,
  url: string | URL,
  options?: TextureSourceOptions
): Promise<GPUTexture>;
```

### createTextureFromSource

Create texture from existing ImageBitmap.

```typescript
function createTextureFromSource(
  device: GPUDevice,
  source: ImageBitmap,
  options?: TextureSourceOptions
): GPUTexture;
```

## Texture Creation

### createTexture

Create a GPU texture with custom descriptor.

```typescript
function createTexture(device: GPUDevice, options: GPUTextureDescriptor): GPUTexture;
```

### createTextureFromData

Create texture from raw pixel data.

```typescript
type BufferSource = ArrayBuffer | TypedArray;

function createTextureFromData(
  device: GPUDevice,
  data: BufferSource,
  width: number,
  height: number,
  options?: Partial<GPUTextureDescriptor>
): GPUTexture;
```

### numMipLevels

Calculate number of mip levels for given dimensions.

```typescript
function numMipLevels(...sizes: number[]): number;
// Returns: 1 + floor(log2(max(sizes)))
```

## Mipmap Generation

### generateMips (internal)

Automatically generates mipmaps for textures with `mipLevelCount > 1`. Uses a render pass to downsample each level.

```typescript
// Called automatically by createTextureFromSource when options.mips = true
```

## Samplers

### createSampler

Create a GPU sampler.

```typescript
function createSampler(device: GPUDevice, options?: GPUSamplerDescriptor): GPUSampler;
```

**Common options:**

```typescript
{
  addressModeU: "clamp-to-edge" | "repeat" | "mirror-repeat",
  addressModeV: "clamp-to-edge" | "repeat" | "mirror-repeat",
  addressModeW: "clamp-to-edge" | "repeat" | "mirror-repeat",
  magFilter: "nearest" | "linear",
  minFilter: "nearest" | "linear",
  mipmapFilter: "nearest" | "linear",
  lodMinClamp: number,
  lodMaxClamp: number,
  compare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always",
  maxAnisotropy: number,
}
```

## Bind Groups

### createBindGroupForTexture

Create a bind group for texture + sampler (+ optional uniform buffer).

```typescript
function createBindGroupForTexture(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  sampler: GPUSampler,
  texture: GPUTexture,
  uniformBuffer?: GPUBuffer
): GPUBindGroup;

// Binding layout:
// @group(0) @binding(0) var sampler: sampler;
// @group(0) @binding(1) var texture: texture_2d<f32>;
// @group(0) @binding(2) var<uniform> uniform: Uniforms; // if uniformBuffer provided
```

## Complete Example

```typescript
import {
  initWebGPU,
  createShaderModule,
  createRenderPipeline,
  createRenderLoop,
  createSampler,
  createTextureFromImage,
  createBindGroupForTexture,
} from '@shared/webgpu/index.js';

async function main() {
  const context = await initWebGPU();

  // Load texture
  const texture = await createTextureFromImage(context.device, '/assets/my-texture.png', {
    mips: true,
  });
  const sampler = createSampler(context.device, { magFilter: 'linear', minFilter: 'linear' });

  // Shader
  const module = createShaderModule(
    context.device,
    'Textured Quad',
    /* wgsl */ `
    struct VSOutput { @builtin(position) position: vec4f, @location(0) texcoord: vec2f };
    @vertex fn vs(@builtin(vertex_index) i: u32) -> VSOutput {
      let pos = array(vec2f(0,0), vec2f(1,0), vec2f(0,1), vec2f(0,1), vec2f(1,0), vec2f(1,1));
      var out: VSOutput; out.position = vec4f(pos[i]*2.0-1.0, 0, 1); out.texcoord = pos[i]; return out;
    }
    @group(0) @binding(0) var s: sampler;
    @group(0) @binding(1) var t: texture_2d<f32>;
    @fragment fn fs(in: VSOutput) -> @location(0) vec4f { return textureSample(t, s, in.texcoord); }
  `
  );

  const pipeline = createRenderPipeline(context.device, {
    label: 'Texture Pipeline',
    layout: 'auto',
    vertex: { entryPoint: 'vs', module },
    fragment: { entryPoint: 'fs', module, targets: [{ format: context.format }] },
  });

  const bindGroup = createBindGroupForTexture(context.device, pipeline, sampler, texture);

  const renderPassDesc: GPURenderPassDescriptor = {
    label: 'Texture Pass',
    colorAttachments: [
      {
        view: null as unknown as GPUTextureView,
        clearValue: [0.1, 0.1, 0.15, 1],
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  };

  const renderLoop = createRenderLoop({
    context,
    renderPassDesc,
    onRender: pass => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(6);
    },
  });

  renderLoop.start();
}

main();
```
