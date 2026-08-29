export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Mat3 extends Float32Array {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
}

export interface Mat4 extends Float32Array {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
  12: number;
  13: number;
  14: number;
  15: number;
}

export interface VertexData {
  vertexData: Float32Array;
  indexData?: Uint32Array;
  numVertices: number;
}

export interface UniformLayout {
  offset: number;
  size: number;
}

export interface BufferWithLayout {
  buffer: GPUBuffer;
  layout: Record<string, UniformLayout>;
  values: Float32Array;
}

export interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

export interface WebGPUInitOptions {
  canvas?: HTMLCanvasElement;
  canvasSelector?: string;
  alphaMode?: GPUCanvasConfiguration['alphaMode'];
  requiredFeatures?: string[];
  requiredLimits?: GPUSupportedLimits;
}

export interface RenderPassContext {
  device: GPUDevice;
  context: GPUCanvasContext;
  renderPassDesc: GPURenderPassDescriptor;
  canvas: HTMLCanvasElement;
}

export interface LessonSettings {
  [key: string]: number | number[] | boolean | string;
}

export interface TextureSourceOptions {
  mips?: boolean;
  flipY?: boolean;
}

export interface GUIController {
  onChange(callback: () => void): GUIController;
  name(label: string): GUIController;
  step(step: number): GUIController;
}

export interface GUI {
  add(object: any, property: string, min?: number, max?: number): GUIController;
  add(object: any, property: string, options: string[]): GUIController;
  addFolder(name: string): GUI;
  destroy(): void;
  domElement: HTMLElement;
}
