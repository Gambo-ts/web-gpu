# Best Practices

Guidelines for writing effective WebGPU lessons and applications.

## WebGPU Initialization

### Always Check for WebGPU Support

```typescript
if (!navigator.gpu) {
  throw new Error('WebGPU is not supported in this browser');
}
```

### Handle Adapter/Device Loss

```typescript
const device = await adapter.requestDevice();
device.lost.then(info => {
  console.error(`Device lost: ${info.reason} - ${info.message}`);
  // Attempt recovery or notify user
});
```

### Request Only Required Features/Limits

```typescript
const device = await adapter.requestDevice({
  requiredFeatures: ['timestamp-query'],
  requiredLimits: {
    maxTextureDimension2D: 8192,
    maxUniformBufferBindingSize: 65536,
  },
});
```

## Buffer Management

### Use Proper Buffer Usage Flags

```typescript
// ✅ Good: Specific usage
const uniformBuffer = device.createBuffer({
  size: 256,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ❌ Bad: Over-permissioned
const buffer = device.createBuffer({
  size: 256,
  usage:
    GPUBufferUsage.UNIFORM | GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX,
});
```

### Align Uniform Buffer Offsets

```typescript
// WebGPU requires 16-byte alignment for uniform buffer offsets
const layout = {
  vec4: { offset: 0, size: 16 },
  mat4: { offset: 16, size: 64 }, // 16-byte aligned
};
```

### Reuse Buffers When Possible

```typescript
// ✅ Good: Create once, update each frame
const uniformBuffer = createUniformBuffer(device, size);
function render() {
  device.queue.writeBuffer(uniformBuffer, 0, newData);
}

// ❌ Bad: Create new buffer each frame
function render() {
  const buffer = device.createBuffer({ size, usage: GPUBufferUsage.UNIFORM });
  device.queue.writeBuffer(buffer, 0, data);
}
```

## Pipeline Creation

### Use "auto" Layout for Simplicity

```typescript
const pipeline = device.createRenderPipeline({
  layout: "auto", // Let WebGPU derive bind group layouts
  vertex: { module, entryPoint: "vs", buffers: [...] },
  fragment: { module, entryPoint: "fs", targets: [...] },
});
```

### Explicit Layouts for Performance

```typescript
// For hot paths, create explicit layouts
const bindGroupLayout = device.createBindGroupLayout({
  entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
});

const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [bindGroupLayout],
});

const pipeline = device.createRenderPipeline({
  layout: pipelineLayout,
  // ...
});
```

## Render Passes

### Clear Depth/Stencil When Using

```typescript
const renderPassDesc: GPURenderPassDescriptor = {
  colorAttachments: [...],
  depthStencilAttachment: {
    view: depthTextureView,
    depthClearValue: 1.0,
    depthLoadOp: "clear",
    depthStoreOp: "store",
  },
};
```

### Reuse Render Pass Descriptors

```typescript
// ✅ Good: Create once, update view each frame
const renderPassDesc = {
  colorAttachments: [{ view: null, loadOp: 'clear', storeOp: 'store' }],
  depthStencilAttachment: { view: null, depthLoadOp: 'clear', depthStoreOp: 'store' },
};

function render() {
  renderPassDesc.colorAttachments[0].view = context.getCurrentTexture().createView();
  renderPassDesc.depthStencilAttachment.view = depthTexture.createView();
  // ...
}
```

## Shader Best Practices

### Use Structured Uniforms

```wgsl
// ✅ Good: Organized, aligned
struct Uniforms {
  viewProjection: mat4x4f,
  cameraPosition: vec3f,
  time: f32,
  _padding: f32,  // Explicit padding for alignment
};

// ❌ Bad: Scattered, hard to maintain
@group(0) @binding(0) var<uniform> viewProjection: mat4x4f;
@group(0) @binding(1) var<uniform> cameraPosition: vec3f;
@group(0) @binding(2) var<uniform> time: f32;
```

### Use Constants for Magic Numbers

```wgsl
// ✅ Good
const PI: f32 = 3.14159265359;
const DEG2RAD: f32 = PI / 180.0;

// ❌ Bad
let angle = 3.14159 / 180.0 * degrees;
```

## Resource Cleanup

### Destroy Resources When Done

```typescript
window.addEventListener('beforeunload', () => {
  vertexBuffer.destroy();
  indexBuffer.destroy();
  uniformBuffer.destroy();
  texture.destroy();
  sampler.destroy();
  pipeline.destroy();
  bindGroupLayout.destroy();
});
```

### Handle Canvas Resize Properly

```typescript
const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    const canvas = entry.target as HTMLCanvasElement;
    canvas.width = Math.max(
      1,
      Math.min(entry.contentBoxSize[0].inlineSize, device.limits.maxTextureDimension2D)
    );
    canvas.height = Math.max(
      1,
      Math.min(entry.contentBoxSize[0].blockSize, device.limits.maxTextureDimension2D)
    );
  }
  render();
});
observer.observe(canvas);
```

## Performance Tips

### Minimize State Changes

```typescript
// ✅ Good: Group draws by pipeline
pass.setPipeline(pipelineA);
for (const obj of objectsA) { pass.setBindGroup(0, obj.bindGroup); pass.draw(...); }

pass.setPipeline(pipelineB);
for (const obj of objectsB) { pass.setBindGroup(0, obj.bindGroup); pass.draw(...); }

// ❌ Bad: Alternate pipelines
for (const obj of allObjects) {
  pass.setPipeline(obj.pipeline);
  pass.setBindGroup(0, obj.bindGroup);
  pass.draw(...);
}
```

### Use Instancing for Repeated Geometry

```typescript
// Single draw call for multiple instances
pass.draw(vertexCount, instanceCount, 0, 0);
```

### Batch Uniform Updates

```typescript
// ✅ Good: Single writeBuffer per frame
const allUniforms = new Float32Array(totalSize);
for (let i = 0; i < count; i++) {
  allUniforms.set(objectUniforms[i], i * stride);
}
device.queue.writeBuffer(uniformBuffer, 0, allUniforms);

// ❌ Bad: Multiple writeBuffer calls
for (const obj of objects) {
  device.queue.writeBuffer(obj.uniformBuffer, 0, obj.uniforms);
}
```

## Error Handling

### Wrap Async Operations

```typescript
async function initWebGPU() {
  try {
    const adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) throw new Error('No adapter');
    const device = await adapter.requestDevice();
    return device;
  } catch (error) {
    showErrorUI('WebGPU initialization failed', error);
    throw error;
  }
}
```

### Validate Shader Compilation

```typescript
const module = device.createShaderModule({ code: wgslCode });
const compilationInfo = await module.getCompilationInfo();
if (compilationInfo.messages.some(m => m.type === 'error')) {
  throw new Error(
    `Shader compilation failed: ${compilationInfo.messages.map(m => m.message).join('\n')}`
  );
}
```

## Lesson Writing Guidelines

### Progressive Complexity

1. Start with minimal working example
2. Add one concept at a time
3. Show before/after comparisons
4. Provide interactive controls (dat.GUI)

### Clear Comments

```typescript
// Explain WHY, not WHAT
// The orthographic projection maps canvas coordinates directly to clip space
// without perspective division, making 1 unit = 1 pixel
mat4.ortho(0, width, height, 0, -100, 100, matrix);
```

### Visual Feedback

- Show coordinate systems (grid, axes)
- Highlight active elements
- Animate transitions
- Provide reset buttons

### Exercise-Driven Learning

- End each lesson with a challenge
- Provide hints, not solutions
- Show expected outcome visually
