# Math Utilities API

## mat3 - 3x3 Matrices

Wrapper around wgpu-matrix mat3 with TypeScript types.

### Creation

```typescript
mat3.create(): Mat3
mat3.identity(): Mat3
mat3.copy(a: Mat3, out?: Mat3): Mat3
```

### Transformations

```typescript
mat3.translation(t: [number, number], out?: Mat3): Mat3
mat3.rotation(radians: number, out?: Mat3): Mat3
mat3.scaling(s: [number, number], out?: Mat3): Mat3
```

### Composition

```typescript
mat3.multiply(a: Mat3, b: Mat3, out?: Mat3): Mat3
mat3.translate(m: Mat3, t: [number, number], out?: Mat3): Mat3
mat3.rotate(m: Mat3, radians: number, out?: Mat3): Mat3
mat3.scale(m: Mat3, s: [number, number], out?: Mat3): Mat3
```

### Utilities

```typescript
mat3.invert(m: Mat3, out?: Mat3): Mat3
mat3.transpose(m: Mat3, out?: Mat3): Mat3
mat3.fromMat4(m: Float32Array, out?: Mat3): Mat3
mat3.projection(width: number, height: number, out?: Mat3): Mat3
mat3.orthographic(left: number, right: number, bottom: number, top: number, out?: Mat3): Mat3
```

### Helpers

```typescript
function createTransformMatrix(
  translation: [number, number] = [0, 0],
  rotation: number = 0,
  scale: [number, number] = [1, 1],
  out?: Mat3
): Mat3;

function createClipSpaceMatrix(canvas: HTMLCanvasElement, out?: Mat3): Mat3;
```

### Example

```typescript
import { mat3, degToRad } from '@shared/math/index.js';

const matrix = mat3.identity();
mat3.translate(matrix, [100, 100], matrix);
mat3.rotate(matrix, degToRad(45), matrix);
mat3.scale(matrix, [2, 2], matrix);

// Or use the helper
const matrix = createTransformMatrix([100, 100], degToRad(45), [2, 2]);

// For canvas clip space
const clipMatrix = createClipSpaceMatrix(canvas);
```

## mat4 - 4x4 Matrices

Wrapper around wgpu-matrix mat4.

### Creation

```typescript
mat4.create(): Mat4
mat4.identity(): Mat4
mat4.copy(a: Mat4, out?: Mat4): Mat4
```

### Transformations

```typescript
mat4.translation(t: [number, number, number], out?: Mat4): Mat4
mat4.rotationX(radians: number, out?: Mat4): Mat4
mat4.rotationY(radians: number, out?: Mat4): Mat4
mat4.rotationZ(radians: number, out?: Mat4): Mat4
mat4.scaling(s: [number, number, number], out?: Mat4): Mat4
```

### Composition

```typescript
mat4.multiply(a: Mat4, b: Mat4, out?: Mat4): Mat4
mat4.translate(m: Mat4, t: [number, number, number], out?: Mat4): Mat4
mat4.rotateX(m: Mat4, radians: number, out?: Mat4): Mat4
mat4.rotateY(m: Mat4, radians: number, out?: Mat4): Mat4
mat4.rotateZ(m: Mat4, radians: number, out?: Mat4): Mat4
mat4.scale(m: Mat4, s: [number, number, number], out?: Mat4): Mat4
```

### Utilities

```typescript
mat4.invert(m: Mat4, out?: Mat4): Mat4
mat4.transpose(m: Mat4, out?: Mat4): Mat4
mat4.perspective(fov: number, aspect: number, near: number, far: number, out?: Mat4): Mat4
mat4.orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: Mat4): Mat4
mat4.lookAt(eye: [number, number, number], target: [number, number, number], up: [number, number, number], out?: Mat4): Mat4
```

### Helper

```typescript
function createViewProjectionMatrix(
  canvas: HTMLCanvasElement,
  cameraPosition: [number, number, number] = [0, 0, 2],
  target: [number, number, number] = [0, 0, 0],
  up: [number, number, number] = [0, 1, 0],
  fov: number = Math.PI / 3,
  near: number = 1,
  far: number = 2000,
  out?: Mat4
): Mat4;
```

### Example: 3D Camera

```typescript
import { mat4, degToRad } from '@shared/math/index.js';

const viewProj = mat4.createViewProjectionMatrix(
  canvas,
  [0, 0, 5], // camera position
  [0, 0, 0], // look at target
  [0, 1, 0], // up vector
  degToRad(60), // 60 degree FOV
  0.1, // near
  1000 // far
);

// Model matrix
const model = mat4.identity();
mat4.translate(model, [0, 0, -2], model);
mat4.rotateY(model, time, model);
```

## Utils

### Angle Conversion

```typescript
function degToRad(degrees: number): number;
function radToDeg(radians: number): number;
```

### Random Numbers

```typescript
function rand(min?: number, max?: number): number;
// rand()           -> [0, 1)
// rand(5)          -> [0, 5)
// rand(2, 5)       -> [2, 5)
```

### Interpolation

```typescript
function lerp(a: number, b: number, t: number): number;
function mix<T extends number[]>(a: T, b: T, t: number): T;
function clamp(value: number, min: number, max: number): number;
function smoothstep(edge0: number, edge1: number, x: number): number;

function lerpVec2(a: [number, number], b: [number, number], t: number): [number, number];
function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number];
```

### Example: Animation

```typescript
import { lerp, lerpVec2, smoothstep, rand } from '@shared/math/index.js';

const startPos: [number, number] = [0, 0];
const endPos: [number, number] = [400, 300];

function animate(t: number) {
  const eased = smoothstep(0, 1, t);
  const pos = lerpVec2(startPos, endPos, eased);
  // pos interpolates smoothly
}
```
