# Geometry API

## Primitive Generators

### createFVertices

Creates the classic "F" shape vertices (2D).

```typescript
function createFVertices(): VertexData;
// Returns: { vertexData: Float32Array(24), indexData: Uint32Array(18), numVertices: 18 }
// Format: position (x, y) - 2 floats per vertex
```

### createFVertices3D

Creates 3D "F" shape with depth and per-face colors.

```typescript
function createFVertices3D(): VertexData;
// Returns: { vertexData: Float32Array(104), numVertices: 104 }
// Format: position (x, y, z) + color (r, g, b, a) - 4 floats per vertex
// Colors encoded as unorm8x4 in the 4th component
```

### createCircleVertices

Create a circle/ring with configurable parameters.

```typescript
interface CircleOptions {
  radius?: number; // default: 1
  numSubdivisions?: number; // default: 24
  innerRadius?: number; // default: 0 (filled circle)
  startAngle?: number; // default: 0
  endAngle?: number; // default: 2π
}

function createCircleVertices(options?: CircleOptions): VertexData;
// Format: position (x, y) + color (r, g, b) - 5 floats per vertex
// Outer vertices: dark color, Inner vertices: white
```

### createQuadVertices

Create a full-screen quad (0 to 1 UV coordinates).

```typescript
function createQuadVertices(): VertexData;
// Returns: { vertexData: Float32Array(24), numVertices: 6 }
// Format: position (x, y) + texcoord (u, v) - 4 floats per vertex
// Two triangles covering [0,1] x [0,1]
```

### createCubeVertices

Create a unit cube centered at origin.

```typescript
function createCubeVertices(): VertexData;
// Returns: { vertexData: Float32Array(144), indexData: Uint32Array(36), numVertices: 36 }
// Format: position (x, y, z) + texcoord (u, v) + normal (x, y, z) - 8 floats per vertex
// 6 faces, 2 triangles each, proper normals and UVs
```

### createPlaneVertices

Create a subdivided plane.

```typescript
interface PlaneOptions {
  width?: number; // default: 1
  height?: number; // default: 1
  widthSegments?: number; // default: 1
  heightSegments?: number; // default: 1
}

function createPlaneVertices(options?: PlaneOptions): VertexData;
// Format: position (x, y, z) + texcoord (u, v) + normal (0, 0, 1)
// Centered at origin, UVs from (0,0) to (1,1)
```

### VertexData Interface

```typescript
interface VertexData {
  vertexData: Float32Array;
  indexData?: Uint32Array;
  numVertices: number;
}
```

## Vertex Layouts

Pre-defined vertex buffer layouts for common formats.

```typescript
const vertexLayouts = {
  // 2D position only
  position2D: {
    arrayStride: 8,
    attributes: [{ shaderLocation: 0, format: 'float32x2', offset: 0 }],
  },

  // 2D position + 3D color
  position2DColor3: {
    arrayStride: 20,
    attributes: [
      { shaderLocation: 0, format: 'float32x2', offset: 0 },
      { shaderLocation: 1, format: 'float32x3', offset: 8 },
    ],
  },

  // 3D position + 3D color
  position3DColor3: {
    arrayStride: 24,
    attributes: [
      { shaderLocation: 0, format: 'float32x3', offset: 0 },
      { shaderLocation: 1, format: 'float32x3', offset: 12 },
    ],
  },

  // 3D position + 2D texcoord
  position3DTexcoord2: {
    arrayStride: 20,
    attributes: [
      { shaderLocation: 0, format: 'float32x3', offset: 0 },
      { shaderLocation: 1, format: 'float32x2', offset: 12 },
    ],
  },

  // 3D position + 2D texcoord + 3D normal
  position3DTexcoord2Normal3: {
    arrayStride: 32,
    attributes: [
      { shaderLocation: 0, format: 'float32x3', offset: 0 },
      { shaderLocation: 1, format: 'float32x2', offset: 12 },
      { shaderLocation: 2, format: 'float32x3', offset: 20 },
    ],
  },

  // Instanced: color + offset per instance
  instanceColor4Offset2D: {
    arrayStride: 24,
    stepMode: 'instance',
    attributes: [
      { shaderLocation: 1, format: 'float32x4', offset: 0 },
      { shaderLocation: 2, format: 'float32x2', offset: 16 },
    ],
  },

  // Instanced: scale per instance
  instanceScale2D: {
    arrayStride: 8,
    stepMode: 'instance',
    attributes: [{ shaderLocation: 3, format: 'float32x2', offset: 0 }],
  },
};
```

## Dynamic Layout Creation

```typescript
function createInterleavedLayout(
  attributes: { format: GPUVertexFormat; shaderLocation: number }[],
  stepMode: 'vertex' | 'instance' = 'vertex'
): GPUVertexBufferLayout;
```

### Example

```typescript
import { createInterleavedLayout } from '@shared/geometry/index.js';

const layout = createInterleavedLayout([
  { format: 'float32x3', shaderLocation: 0 }, // position
  { format: 'float32x3', shaderLocation: 1 }, // normal
  { format: 'float32x2', shaderLocation: 2 }, // texcoord
]);
// Automatically calculates offsets and stride
```

## Usage Examples

### Basic Triangle

```typescript
import { createFVertices, createVertexBuffer } from '@shared/index.js';

const { vertexData, indexData, numVertices } = createFVertices();
const vertexBuffer = createVertexBuffer(device, vertexData);
const indexBuffer = createIndexBuffer(device, indexData);

// In render pass:
pass.setVertexBuffer(0, vertexBuffer);
pass.setIndexBuffer(indexBuffer, 'uint32');
pass.drawIndexed(numVertices);
```

### Instanced Rendering

```typescript
import { createCircleVertices, vertexLayouts, createVertexBuffer } from '@shared/index.js';

const { vertexData, numVertices } = createCircleVertices({ radius: 0.5 });
const geometryBuffer = createVertexBuffer(device, vertexData);

// Instance data: color + offset
const instanceData = new Float32Array(instances * 6); // vec4 + vec2
for (let i = 0; i < instances; i++) {
  instanceData.set([r, g, b, 1], i * 6);
  instanceData.set([x, y], i * 6 + 4);
}
const instanceBuffer = createVertexBuffer(device, instanceData);

// In render pass:
pass.setVertexBuffer(0, geometryBuffer);
pass.setVertexBuffer(1, instanceBuffer);
pass.draw(numVertices, instances);
```

### 3D Cube with Lighting

```typescript
import {
  createCubeVertices,
  vertexLayouts,
  createVertexBuffer,
  createIndexBuffer,
} from '@shared/index.js';

const { vertexData, indexData, numVertices } = createCubeVertices();
const vertexBuffer = createVertexBuffer(device, vertexData);
const indexBuffer = createIndexBuffer(device, indexData);

// Pipeline uses position3DTexcoord2Normal3 layout
// Shader has: position, texcoord, normal attributes
```
