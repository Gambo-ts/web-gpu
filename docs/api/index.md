# API Reference

Complete API documentation for the Gambo Starter shared modules.

## @shared/webgpu

### initWebGPU

Initialize WebGPU adapter, device, canvas context, and format.

```typescript
interface WebGPUInitOptions {
  canvas?: HTMLCanvasElement;
  canvasSelector?: string;
  alphaMode?: GPUCanvasConfiguration['alphaMode'];
  requiredFeatures?: string[];
  requiredLimits?: GPUSupportedLimits;
}

interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

async function initWebGPU(options?: WebGPUInitOptions): Promise<WebGPUContext>;
```

**Example:**

```typescript
const context = await initWebGPU({
  canvasSelector: 'canvas',
  alphaMode: 'premultiplied',
  requiredFeatures: ['depth-clip-control'],
});
```

### createShaderModule

Create a shader module with labeled WGSL code.

```typescript
function createShaderModule(device: GPUDevice, label: string, code: string): GPUShaderModule;
```

### createRenderPipeline

Create a render pipeline with sensible defaults.

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

function createRenderPipeline(device: GPUDevice, options: RenderPipelineOptions): GPURenderPipeline;
```

### createComputePipeline

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

function createComputePipeline(
  device: GPUDevice,
  options: ComputePipelineOptions
): GPUComputePipeline;
```

### createRenderLoop

Create a managed render loop with resize handling.

```typescript
interface RenderLoopOptions {
  context: WebGPUContext;
  renderPassDesc: GPURenderPassDescriptor;
  onRender: (pass: GPURenderPassEncoder, context: RenderPassContext) => void;
  onResize?: (width: number, height: number) => void;
  useRequestAnimationFrame?: boolean;
}

interface RenderLoopHandle {
  start(): void;
  stop(): void;
  render(): void;
}

function createRenderLoop(options: RenderLoopOptions): RenderLoopHandle;
```

### Buffer Utilities

```typescript
function createBuffer(
  device: GPUDevice,
  size: number,
  options: { label?: string; usage: GPUBufferUsageFlags; mappedAtCreation?: boolean }
): GPUBuffer;

function createUniformBuffer(device: GPUDevice, size: number, label?: string): GPUBuffer;
function createVertexBuffer(device: GPUDevice, data: BufferSource, label?: string): GPUBuffer;
function createIndexBuffer(device: GPUDevice, data: BufferSource, label?: string): GPUBuffer;
function createStorageBuffer(device: GPUDevice, size: number, label?: string): GPUBuffer;
function writeBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  data: BufferSource,
  offset?: number
): void;

function createUniformLayout(
  fields: { name: string; size: number }[]
): Record<string, UniformLayout>;
function createUniformValues(layout: Record<string, UniformLayout>): Float32Array;
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
function createBufferWithLayout(
  device: GPUDevice,
  layout: Record<string, UniformLayout>,
  label?: string
): BufferWithLayout;
```

### Texture Utilities

```typescript
async function loadImageBitmap(url: string | URL): Promise<ImageBitmap>;
function createTexture(device: GPUDevice, options: GPUTextureDescriptor): GPUTexture;
function createTextureFromData(
  device: GPUDevice,
  data: BufferSource,
  width: number,
  height: number,
  options?: Partial<GPUTextureDescriptor>
): GPUTexture;
function numMipLevels(...sizes: number[]): number;
async function createTextureFromImage(
  device: GPUDevice,
  url: string | URL,
  options?: TextureSourceOptions
): Promise<GPUTexture>;
function createTextureFromSource(
  device: GPUDevice,
  source: ImageBitmap,
  options?: TextureSourceOptions
): GPUTexture;
function createSampler(device: GPUDevice, options?: GPUSamplerDescriptor): GPUSampler;
function createBindGroupForTexture(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  sampler: GPUSampler,
  texture: GPUTexture,
  uniformBuffer?: GPUBuffer
): GPUBindGroup;
```

### Pipeline Utilities

```typescript
function createPipelineLayout(
  device: GPUDevice,
  options?: { bindGroupLayouts?: GPUBindGroupLayout[]; label?: string }
): GPUPipelineLayout;
function createBindGroup(
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  entries: GPUBindGroupEntry[],
  label?: string
): GPUBindGroup;
function createBindGroupLayout(
  device: GPUDevice,
  entries: GPUBindGroupLayoutEntry[],
  label?: string
): GPUBindGroupLayout;
```

## @shared/math

### mat3

3x3 matrix operations (wraps wgpu-matrix).

```typescript
const mat3 = {
  create(): Mat3,
  identity(): Mat3,
  copy(a: Mat3, out?: Mat3): Mat3,
  translation(t: [number, number], out?: Mat3): Mat3,
  rotation(radians: number, out?: Mat3): Mat3,
  scaling(s: [number, number], out?: Mat3): Mat3,
  multiply(a: Mat3, b: Mat3, out?: Mat3): Mat3,
  translate(m: Mat3, t: [number, number], out?: Mat3): Mat3,
  rotate(m: Mat3, radians: number, out?: Mat3): Mat3,
  scale(m: Mat3, s: [number, number], out?: Mat3): Mat3,
  invert(m: Mat3, out?: Mat3): Mat3,
  transpose(m: Mat3, out?: Mat3): Mat3,
  projection(width: number, height: number, out?: Mat3): Mat3,
  orthographic(left: number, right: number, bottom: number, top: number, out?: Mat3): Mat3,
};

function createTransformMatrix(translation?: [number, number], rotation?: number, scale?: [number, number], out?: Mat3): Mat3
function createClipSpaceMatrix(canvas: HTMLCanvasElement, out?: Mat3): Mat3
```

### mat4

4x4 matrix operations (wraps wgpu-matrix).

```typescript
const mat4 = {
  create(): Mat4,
  identity(): Mat4,
  copy(a: Mat4, out?: Mat4): Mat4,
  translation(t: [number, number, number], out?: Mat4): Mat4,
  rotationX(radians: number, out?: Mat4): Mat4,
  rotationY(radians: number, out?: Mat4): Mat4,
  rotationZ(radians: number, out?: Mat4): Mat4,
  scaling(s: [number, number, number], out?: Mat4): Mat4,
  multiply(a: Mat4, b: Mat4, out?: Mat4): Mat4,
  translate(m: Mat4, t: [number, number, number], out?: Mat4): Mat4,
  rotateX(m: Mat4, radians: number, out?: Mat4): Mat4,
  rotateY(m: Mat4, radians: number, out?: Mat4): Mat4,
  rotateZ(m: Mat4, radians: number, out?: Mat4): Mat4,
  scale(m: Mat4, s: [number, number, number], out?: Mat4): Mat4,
  invert(m: Mat4, out?: Mat4): Mat4,
  transpose(m: Mat4, out?: Mat4): Mat4,
  perspective(fov: number, aspect: number, near: number, far: number, out?: Mat4): Mat4,
  orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: Mat4): Mat4,
  lookAt(eye: [number, number, number], target: [number, number, number], up: [number, number, number], out?: Mat4): Mat4,
};

function createViewProjectionMatrix(canvas: HTMLCanvasElement, cameraPosition?: [number, number, number], target?: [number, number, number], up?: [number, number, number], fov?: number, near?: number, far?: number, out?: Mat4): Mat4
```

### Utils

```typescript
function degToRad(degrees: number): number;
function radToDeg(radians: number): number;
function rand(min?: number, max?: number): number;
function lerp(a: number, b: number, t: number): number;
function mix<T extends number[]>(a: T, b: T, t: number): T;
function clamp(value: number, min: number, max: number): number;
function smoothstep(edge0: number, edge1: number, x: number): number;
```

## @shared/geometry

### Primitives

```typescript
function createFVertices(): VertexData;
function createFVertices3D(): VertexData;
function createCircleVertices(options?: CircleOptions): VertexData;
function createQuadVertices(): VertexData;
function createCubeVertices(): VertexData;
function createPlaneVertices(options?: PlaneOptions): VertexData;

interface CircleOptions {
  radius?: number;
  numSubdivisions?: number;
  innerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}

interface PlaneOptions {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

interface VertexData {
  vertexData: Float32Array;
  indexData?: Uint32Array;
  numVertices: number;
}
```

### Vertex Layouts

```typescript
const vertexLayouts = {
  position2D: GPUVertexBufferLayout,
  position2DColor3: GPUVertexBufferLayout,
  position3DColor3: GPUVertexBufferLayout,
  position3DTexcoord2: GPUVertexBufferLayout,
  position3DTexcoord2Normal3: GPUVertexBufferLayout,
  instanceColor4Offset2D: GPUVertexBufferLayout,
  instanceScale2D: GPUVertexBufferLayout,
};

function createInterleavedLayout(
  attributes: { format: GPUVertexFormat; shaderLocation: number }[],
  stepMode?: 'vertex' | 'instance'
): GPUVertexBufferLayout;
```

## @shared/ui

### GUI

```typescript
async function createGUI(options?: {
  autoPlace?: boolean;
  container?: HTMLElement;
  width?: number;
}): Promise<GUI>;
function addFolder(gui: GUI, name: string): GUI;
function addSlider(
  gui: GUI,
  object: any,
  property: string,
  min: number,
  max: number,
  step?: number
): GUIController;
function addVector2(
  gui: GUI,
  object: any,
  property: string,
  min: number,
  max: number,
  labels?: [string, string]
): [GUIController, GUIController];
function addVector3(
  gui: GUI,
  object: any,
  property: string,
  min: number,
  max: number,
  labels?: [string, string, string]
): [GUIController, GUIController, GUIController];
function addSelect(gui: GUI, object: any, property: string, options: string[]): GUIController;
function addCheckbox(gui: GUI, object: any, property: string): GUIController;
function addButton(gui: GUI, object: any, property: string): GUIController;
function destroyGUI(gui: GUI): void;
```

### Error Overlay

```typescript
function showError(message: string, details?: string): void;
function hideError(): void;
function handleWebGPUError(error: unknown): void;
```

## @shared/shaders

### WGSL Helpers

```typescript
function wgsl(strings: TemplateStringsArray, ...values: any[]): string;

const shaderTemplates = {
  vertexPosition2D: string,
  vertexPosition2DColor3: string,
  vertexPosition3DColor3: string,
  vertexPosition3DTexcoord2: string,
  vertexPosition3DTexcoord2Normal3: string,
  fragmentColor: string,
  fragmentTexture: string,
  fragmentTextureWithUniforms: string,
  computeDoubling: string,
};

function createShaderCode(vertexSrc: string, fragmentSrc: string): string;
function createUniformStruct(name: string, fields: { name: string; type: string }[]): string;
function createVertexStruct(
  name: string,
  fields: { location: number; name: string; type: string }[]
): string;
function createVSOutputStruct(
  name: string,
  fields: { location?: number; builtin?: string; name: string; type: string }[]
): string;
```
