# WebGPU Init API

## initWebGPU

Main entry point for initializing WebGPU.

### Signature

```typescript
async function initWebGPU(options?: WebGPUInitOptions): Promise<WebGPUContext>;
```

### Options

| Option             | Type                          | Default                            | Description             |
| ------------------ | ----------------------------- | ---------------------------------- | ----------------------- |
| `canvas`           | `HTMLCanvasElement`           | `document.querySelector("canvas")` | Canvas element to use   |
| `canvasSelector`   | `string`                      | `"canvas"`                         | CSS selector for canvas |
| `alphaMode`        | `"premultiplied" \| "opaque"` | `"premultiplied"`                  | Canvas alpha mode       |
| `requiredFeatures` | `string[]`                    | `[]`                               | Required GPU features   |
| `requiredLimits`   | `GPUSupportedLimits`          | `{}`                               | Required GPU limits     |

### Returns

```typescript
interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}
```

### Errors

Throws `Error` if:

- WebGPU is not supported
- No adapter found
- Required feature not supported
- Canvas not found
- Context creation failed

### Example

```typescript
const context = await initWebGPU({
  canvasSelector: '#my-canvas',
  alphaMode: 'premultiplied',
  requiredFeatures: ['timestamp-query'],
  requiredLimits: {
    maxTextureDimension2D: 8192,
    maxUniformBufferBindingSize: 65536,
  },
});
```

## createShaderModule

Create a shader module with optional label.

```typescript
function createShaderModule(device: GPUDevice, label: string, code: string): GPUShaderModule;
```

## createRenderPipeline

Create a render pipeline with flexible options.

### Options

```typescript
interface RenderPipelineOptions {
  label?: string;
  layout?: GPUPipelineLayout | 'auto';
  vertex: {
    module: GPUShaderModule;
    entryPoint: string;
    buffers?: GPUVertexBufferLayout[];
    constants?: Record<string, number>;
  };
  fragment?: {
    module: GPUShaderModule;
    entryPoint: string;
    targets: GPUColorTargetState[];
    constants?: Record<string, number>;
  };
  primitive?: GPUPrimitiveState;
  depthStencil?: GPUDepthStencilState;
  multisample?: GPUMultisampleState;
}
```

## createComputePipeline

Create a compute pipeline.

```typescript
interface ComputePipelineOptions {
  label?: string;
  layout?: GPUPipelineLayout | 'auto';
  compute: {
    module: GPUShaderModule;
    entryPoint: string;
    constants?: Record<string, number>;
  };
}
```

## createRenderLoop

Managed render loop with automatic resize handling.

```typescript
interface RenderLoopOptions {
  context: WebGPUContext;
  renderPassDesc: GPURenderPassDescriptor;
  onRender: (pass: GPURenderPassEncoder, context: RenderPassContext) => void;
  onResize?: (width: number, height: number) => void;
  useRequestAnimationFrame?: boolean; // default: false
}

interface RenderLoopHandle {
  start(): void;
  stop(): void;
  render(): void;
}
```

### Example

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
    console.log(`Resized to ${width}x${height}`);
  },
});

renderLoop.start();
// Later: renderLoop.stop();
```
