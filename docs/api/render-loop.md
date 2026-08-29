# Render Loop API

## createRenderLoop

Create a managed render loop with automatic resize handling and cleanup.

### Signature

```typescript
function createRenderLoop(options: RenderLoopOptions): RenderLoopHandle;
```

### Options

```typescript
interface RenderLoopOptions {
  context: WebGPUContext;
  renderPassDesc: GPURenderPassDescriptor;
  onRender: (pass: GPURenderPassEncoder, context: RenderPassContext) => void;
  onResize?: (width: number, height: number) => void;
  useRequestAnimationFrame?: boolean; // default: false
}

interface RenderPassContext {
  device: GPUDevice;
  context: GPUCanvasContext;
  renderPassDesc: GPURenderPassDescriptor;
  canvas: HTMLCanvasElement;
}
```

### Returns

```typescript
interface RenderLoopHandle {
  start(): void;
  stop(): void;
  render(): void;
}
```

### Behavior

- **Automatic resize handling**: Uses ResizeObserver to detect canvas size changes
- **High-DPI support**: Clamps to `device.limits.maxTextureDimension2D`
- **Frame synchronization**: By default renders on resize; set `useRequestAnimationFrame: true` for continuous animation
- **Cleanup**: Call `stop()` to disconnect ResizeObserver and cancel animation frames

### Example: Event-Driven Rendering (Default)

```typescript
const renderLoop = createRenderLoop({
  context,
  renderPassDesc,
  onRender: pass => {
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(3);
  },
  onResize: (width, height) => {
    // Update uniforms, recreation of depth textures, etc.
    updateProjectionMatrix(width, height);
  },
});

renderLoop.start(); // Renders once, then on each resize
```

### Example: Continuous Animation

```typescript
const renderLoop = createRenderLoop({
  context,
  renderPassDesc,
  onRender: (pass, renderContext) => {
    const time = performance.now() * 0.001;
    updateTimeUniform(time);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(3);
  },
  useRequestAnimationFrame: true,
});

renderLoop.start(); // Renders at display refresh rate
```

### Example: Manual Control

```typescript
const renderLoop = createRenderLoop({ context, renderPassDesc, onRender });

// Render once
renderLoop.render();

// Start/stop as needed
button.addEventListener('click', () => {
  if (isRunning) renderLoop.stop();
  else renderLoop.start();
});
```

## Depth Texture Utilities

### createDepthTexture

Create a depth texture for a render pass.

```typescript
function createDepthTexture(
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat = 'depth24plus'
): GPUTexture;
```

### updateDepthTexture

Update or recreate depth texture to match canvas size.

```typescript
function updateDepthTexture(
  device: GPUDevice,
  depthTexture: GPUTexture | null,
  canvasTexture: GPUTexture,
  format: GPUTextureFormat = 'depth24plus'
): GPUTexture;
```

### Example: Depth Buffer Management

```typescript
let depthTexture: GPUTexture | null = null;

const renderPassDesc: GPURenderPassDescriptor = {
  colorAttachments: [...],
  depthStencilAttachment: {
    view: null as unknown as GPUTextureView,
    depthClearValue: 1.0,
    depthLoadOp: "clear",
    depthStoreOp: "store",
  },
};

const renderLoop = createRenderLoop({
  context,
  renderPassDesc,
  onRender: (pass, renderContext) => {
    // Update depth texture to match canvas
    const canvasTexture = renderContext.context.getCurrentTexture();
    depthTexture = updateDepthTexture(renderContext.device, depthTexture, canvasTexture);
    renderPassDesc.depthStencilAttachment.view = depthTexture.createView();

    pass.setPipeline(pipeline);
    pass.draw(...);
  },
  onResize: (width, height) => {
    // Depth texture will be recreated on next render
  },
});
```
