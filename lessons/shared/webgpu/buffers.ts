import type { BufferWithLayout, UniformLayout } from '../types.js';

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

type BufferSource = ArrayBuffer | TypedArray;

export interface BufferOptions {
  label?: string;
  usage: GPUBufferUsageFlags;
  mappedAtCreation?: boolean;
}

export function createBuffer(device: GPUDevice, size: number, options: BufferOptions): GPUBuffer {
  return device.createBuffer({
    size,
    usage: options.usage,
    label: options.label,
    mappedAtCreation: options.mappedAtCreation ?? false,
  });
}

export function createUniformBuffer(device: GPUDevice, size: number, label?: string): GPUBuffer {
  return createBuffer(device, size, {
    label: label ?? 'Uniform Buffer',
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
}

export function createVertexBuffer(
  device: GPUDevice,
  data: BufferSource,
  label?: string
): GPUBuffer {
  const buffer = createBuffer(device, byteLength(data), {
    label: label ?? 'Vertex Buffer',
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data as unknown as GPUAllowSharedBufferSource);
  return buffer;
}

export function createIndexBuffer(
  device: GPUDevice,
  data: BufferSource,
  label?: string
): GPUBuffer {
  const buffer = createBuffer(device, byteLength(data), {
    label: label ?? 'Index Buffer',
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data as unknown as GPUAllowSharedBufferSource);
  return buffer;
}

function byteLength(data: BufferSource): number {
  if (data instanceof ArrayBuffer) return data.byteLength;
  return data.byteLength;
}

export function createStorageBuffer(device: GPUDevice, size: number, label?: string): GPUBuffer {
  return createBuffer(device, size, {
    label: label ?? 'Storage Buffer',
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
  });
}

export function writeBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  data: BufferSource,
  bufferOffset: number = 0
): void {
  device.queue.writeBuffer(buffer, bufferOffset, data as unknown as GPUAllowSharedBufferSource);
}

export function createUniformLayout(
  fields: { name: string; size: number }[]
): Record<string, UniformLayout> {
  const layout: Record<string, UniformLayout> = {};
  let offset = 0;

  for (const field of fields) {
    const alignedOffset = alignOffset(offset);
    layout[field.name] = { offset: alignedOffset, size: field.size };
    offset = alignedOffset + field.size;
  }

  return layout;
}

function alignOffset(offset: number): number {
  const alignment = 16;
  return Math.ceil(offset / alignment) * alignment;
}

export function createUniformValues(layout: Record<string, UniformLayout>): Float32Array {
  let maxOffset = 0;
  for (const { offset, size } of Object.values(layout)) {
    maxOffset = Math.max(maxOffset, offset + size);
  }
  return new Float32Array(maxOffset / Float32Array.BYTES_PER_ELEMENT);
}

export function setUniformValue(
  values: Float32Array,
  layout: Record<string, UniformLayout>,
  fieldName: string,
  data: number | number[]
): void {
  const field = layout[fieldName];
  if (!field) {
    throw new Error(`Uniform field "${fieldName}" not found in layout`);
  }
  const arrayData = Array.isArray(data) ? data : [data];
  values.set(arrayData, field.offset / Float32Array.BYTES_PER_ELEMENT);
}

export function getUniformValue(
  values: Float32Array,
  layout: Record<string, UniformLayout>,
  fieldName: string
): Float32Array {
  const field = layout[fieldName];
  if (!field) {
    throw new Error(`Uniform field "${fieldName}" not found in layout`);
  }
  return values.subarray(
    field.offset / Float32Array.BYTES_PER_ELEMENT,
    (field.offset + field.size) / Float32Array.BYTES_PER_ELEMENT
  );
}

export function createBufferWithLayout(
  device: GPUDevice,
  layout: Record<string, UniformLayout>,
  label?: string
): BufferWithLayout {
  const values = createUniformValues(layout);
  const buffer = createUniformBuffer(device, values.byteLength, label);
  return { buffer, layout, values };
}
