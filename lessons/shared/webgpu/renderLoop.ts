import type { WebGPUContext, RenderPassContext } from '../types.js';
// GPURenderPassDescriptor is globally available via @webgpu/types

export interface RenderLoopOptions {
  context: WebGPUContext;
  renderPassDesc: GPURenderPassDescriptor;
  onRender: (pass: GPURenderPassEncoder, context: RenderPassContext) => void;
  onResize?: (width: number, height: number) => void;
  useRequestAnimationFrame?: boolean;
}

export interface RenderLoopHandle {
  start(): void;
  stop(): void;
  render(): void;
}

export function createRenderLoop(options: RenderLoopOptions): RenderLoopHandle {
  const { context, renderPassDesc, onRender, onResize, useRequestAnimationFrame = false } = options;
  let animationFrameId: number | null = null;
  let isRunning = false;

  function render() {
    if (!isRunning) return;

    const canvasTexture = context.context.getCurrentTexture();
    renderPassDesc.colorAttachments[0].view = canvasTexture.createView();

    const renderContext: RenderPassContext = {
      device: context.device,
      context: context.context,
      renderPassDesc,
      canvas: context.canvas,
    };

    const encoder = context.device.createCommandEncoder({ label: 'Render encoder' });
    const pass = encoder.beginRenderPass(renderPassDesc);
    onRender(pass, renderContext);
    pass.end();

    const commandBuffer = encoder.finish();
    context.device.queue.submit([commandBuffer]);

    if (useRequestAnimationFrame) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  function handleResize() {
    const width = Math.max(
      1,
      Math.min(context.canvas.clientWidth, context.device.limits.maxTextureDimension2D)
    );
    const height = Math.max(
      1,
      Math.min(context.canvas.clientHeight, context.device.limits.maxTextureDimension2D)
    );

    if (context.canvas.width !== width || context.canvas.height !== height) {
      context.canvas.width = width;
      context.canvas.height = height;
      if (onResize) {
        onResize(width, height);
      }
    }
    render();
  }

  const resizeObserver = new ResizeObserver(() => {
    handleResize();
  });

  resizeObserver.observe(context.canvas);

  return {
    start() {
      if (isRunning) return;
      isRunning = true;
      handleResize();
      if (useRequestAnimationFrame) {
        animationFrameId = requestAnimationFrame(render);
      }
    },

    stop() {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      resizeObserver.disconnect();
    },

    render() {
      handleResize();
    },
  };
}

export function createDepthTexture(
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat = 'depth24plus'
): GPUTexture {
  return device.createTexture({
    size: [width, height],
    format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
}

export function updateDepthTexture(
  device: GPUDevice,
  depthTexture: GPUTexture | null,
  canvasTexture: GPUTexture,
  format: GPUTextureFormat = 'depth24plus'
): GPUTexture {
  if (
    !depthTexture ||
    depthTexture.width !== canvasTexture.width ||
    depthTexture.height !== canvasTexture.height
  ) {
    if (depthTexture) {
      depthTexture.destroy();
    }
    return createDepthTexture(device, canvasTexture.width, canvasTexture.height, format);
  }
  return depthTexture;
}
