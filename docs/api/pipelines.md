# Pipelines API

## createRenderPipeline

Create a render pipeline with flexible configuration.

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

### Primitive State

```typescript
interface GPUPrimitiveState {
  topology?: 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triangle-strip';
  stripIndexFormat?: 'uint16' | 'uint32';
  frontFace?: 'ccw' | 'cw';
  cullMode?: 'none' | 'front' | 'back';
  unclippedDepth?: boolean;
}
```

### Depth Stencil State

```typescript
interface GPUDepthStencilState {
  format: GPUTextureFormat;
  depthWriteEnabled: boolean;
  depthCompare: GPUCompareFunction;
  depthBias?: number;
  depthBiasSlopeScale?: number;
  depthBiasClamp?: number;
  stencilFront?: GPUStencilFaceState;
  stencilBack?: GPUStencilFaceState;
  stencilReadMask?: number;
  stencilWriteMask?: number;
}
```

### Multisample State

```typescript
interface GPUMultisampleState {
  count?: number;
  mask?: number;
  alphaToCoverageEnabled?: boolean;
}
```

### Example: Basic Pipeline

```typescript
const pipeline = createRenderPipeline(device, {
  label: 'Triangle Pipeline',
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 20,
        attributes: [
          { shaderLocation: 0, format: 'float32x2', offset: 0 },
          { shaderLocation: 1, format: 'float32x3', offset: 8 },
        ],
      },
    ],
  },
  fragment: {
    module,
    entryPoint: 'fs',
    targets: [{ format }],
  },
  primitive: { cullMode: 'back' },
});
```

### Example: Depth-Enabled Pipeline

```typescript
const pipeline = createRenderPipeline(device, {
  label: '3D Pipeline',
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 32,
        attributes: [
          { shaderLocation: 0, format: 'float32x3', offset: 0 },
          { shaderLocation: 1, format: 'float32x2', offset: 12 },
          { shaderLocation: 2, format: 'float32x3', offset: 20 },
        ],
      },
    ],
  },
  fragment: {
    module,
    entryPoint: 'fs',
    targets: [{ format }],
  },
  primitive: { cullMode: 'back' },
  depthStencil: {
    format: 'depth24plus',
    depthWriteEnabled: true,
    depthCompare: 'less',
  },
});
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

### Example: Compute Pipeline

```typescript
const pipeline = createComputePipeline(device, {
  label: 'Particle Update',
  layout: 'auto',
  compute: {
    module,
    entryPoint: 'updateParticles',
    constants: { PARTICLE_COUNT: 10000 },
  },
});
```

## Pipeline Layout

### createPipelineLayout

Create an explicit pipeline layout.

```typescript
function createPipelineLayout(
  device: GPUDevice,
  options?: {
    bindGroupLayouts?: GPUBindGroupLayout[];
    label?: string;
  }
): GPUPipelineLayout;
```

### createBindGroupLayout

Create a bind group layout.

```typescript
function createBindGroupLayout(
  device: GPUDevice,
  entries: GPUBindGroupLayoutEntry[],
  label?: string
): GPUBindGroupLayout;
```

### createBindGroup

Create a bind group.

```typescript
function createBindGroup(
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  entries: GPUBindGroupEntry[],
  label?: string
): GPUBindGroup;
```

### Example: Explicit Layout

```typescript
// Define bind group layout
const bindGroupLayout = createBindGroupLayout(device, [
  { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: "uniform" } },
  { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
  { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } },
], "Scene Layout");

// Create pipeline layout
const pipelineLayout = createPipelineLayout(device, {
  bindGroupLayouts: [bindGroupLayout],
  label: "Scene Pipeline Layout",
});

// Create pipeline with explicit layout
const pipeline = createRenderPipeline(device, {
  label: "Scene Pipeline",
  layout: pipelineLayout,
  vertex: { module, entryPoint: "vs", buffers: [...] },
  fragment: { module, entryPoint: "fs", targets: [...] },
});

// Create bind group
const bindGroup = createBindGroup(device, bindGroupLayout, [
  { binding: 0, resource: { buffer: uniformBuffer } },
  { binding: 1, resource: sampler },
  { binding: 2, resource: texture.createView() },
], "Scene Bind Group");
```

## Pipeline Constants

Pipeline constants allow compile-time specialization.

```typescript
const pipeline = createRenderPipeline(device, {
  label: 'Specialized Pipeline',
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    constants: { MAX_LIGHTS: 8, SHADOW_MAP_SIZE: 2048 },
  },
  fragment: {
    module,
    entryPoint: 'fs',
    constants: { MAX_LIGHTS: 8, SHADOW_MAP_SIZE: 2048 },
    targets: [{ format }],
  },
});
```

In WGSL:

```wgsl
override MAX_LIGHTS: u32 = 4;
override SHADOW_MAP_SIZE: u32 = 1024;

fn fragment() {
  // MAX_LIGHTS is 8 at compile time
}
```

## Best Practices

1. **Use "auto" layout** for simple pipelines
2. **Explicit layouts** for complex scenes with multiple bind groups
3. **Constants** for values known at pipeline creation time
4. **Label everything** for debugging
5. **Reuse pipelines** when possible - creation is expensive
