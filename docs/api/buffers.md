# Buffers API

## Buffer Creation

### createBuffer

Low-level buffer creation.

```typescript
function createBuffer(
  device: GPUDevice,
  size: number,
  options: {
    label?: string;
    usage: GPUBufferUsageFlags;
    mappedAtCreation?: boolean;
  }
): GPUBuffer;
```

### createUniformBuffer

Create a uniform buffer with standard usage flags.

```typescript
function createUniformBuffer(device: GPUDevice, size: number, label?: string): GPUBuffer;
// Usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
```

### createVertexBuffer

Create and upload vertex buffer data.

```typescript
function createVertexBuffer(device: GPUDevice, data: BufferSource, label?: string): GPUBuffer;
// Usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
```

### createIndexBuffer

Create and upload index buffer data.

```typescript
function createIndexBuffer(device: GPUDevice, data: BufferSource, label?: string): GPUBuffer;
// Usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
```

### createStorageBuffer

Create a storage buffer for compute/large data.

```typescript
function createStorageBuffer(device: GPUDevice, size: number, label?: string): GPUBuffer;
// Usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
```

## Buffer Writing

### writeBuffer

Write data to a buffer.

```typescript
function writeBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  data: BufferSource,
  bufferOffset: number = 0
): void;
```

## Uniform Layout Helpers

### createUniformLayout

Create a uniform buffer layout with automatic 16-byte alignment.

```typescript
function createUniformLayout(
  fields: { name: string; size: number }[]
): Record<string, UniformLayout>;

interface UniformLayout {
  offset: number;
  size: number;
}
```

**Example:**

```typescript
const layout = createUniformLayout([
  { name: 'color', size: 16 }, // vec4f
  { name: 'matrix', size: 64 }, // mat4x4f
  { name: 'time', size: 4 }, // f32
]);
// Returns: { color: { offset: 0, size: 16 }, matrix: { offset: 16, size: 64 }, time: { offset: 80, size: 4 } }
```

### createUniformValues

Create a Float32Array sized for the layout.

```typescript
function createUniformValues(layout: Record<string, UniformLayout>): Float32Array;
```

### setUniformValue / getUniformValue

Set/get values in a uniform buffer array.

```typescript
function setUniformValue(
  values: Float32Array,
  layout: Record<string, UniformLayout>,
  fieldName: string,
  data: number | number[]
): void;

function getUniformValue(
  values: Float32Array,
  layout: Record<string, UniformLayout>,
  fieldName: string
): Float32Array;
```

**Example:**

```typescript
const values = createUniformValues(layout);
setUniformValue(values, layout, 'color', [1, 0, 0, 1]);
setUniformValue(values, layout, 'matrix', matrixArray);
setUniformValue(values, layout, 'time', 1.5);
device.queue.writeBuffer(buffer, 0, values);
```

### createBufferWithLayout

Convenience function combining all of the above.

```typescript
function createBufferWithLayout(
  device: GPUDevice,
  layout: Record<string, UniformLayout>,
  label?: string
): BufferWithLayout;

interface BufferWithLayout {
  buffer: GPUBuffer;
  layout: Record<string, UniformLayout>;
  values: Float32Array;
}
```
