import {
  initWebGPU,
  createShaderModule,
  createRenderPipeline,
  createRenderLoop,
} from '@shared/webgpu/index.js';

async function main() {
  try {
    const context = await initWebGPU({
      canvasSelector: 'canvas',
      alphaMode: 'premultiplied',
    });

    const module = createShaderModule(
      context.device,
      'Green Triangle Shader',
      /* wgsl */ `
      @vertex fn vs(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
        let pos = array(
          vec2f(0.0, 0.5),
          vec2f(-0.5, -0.5),
          vec2f(0.5, -0.5),
        );
        return vec4f(pos[vertexIndex], 0.0, 1.0);
      }

      @fragment fn fs() -> @location(0) vec4f {
        return vec4f(0.0, 1.0, 0.0, 1.0);
      }
    `
    );

    const pipeline = createRenderPipeline(context.device, {
      label: 'Green Triangle Pipeline',
      layout: 'auto',
      vertex: { entryPoint: 'vs', module },
      fragment: { entryPoint: 'fs', module, targets: [{ format: context.format }] },
    });

    const renderPassDesc: GPURenderPassDescriptor = {
      label: 'Render Pass',
      colorAttachments: [
        {
          view: null as unknown as GPUTextureView,
          clearValue: [0.3, 0.3, 0.3, 1.0],
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
        pass.draw(3);
      },
    });

    renderLoop.start();
  } catch (error) {
    console.error('Failed to initialize WebGPU:', error);
  }
}

main();
