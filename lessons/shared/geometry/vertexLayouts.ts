// Types are globally available via @webgpu/types in tsconfig

export const vertexLayouts = {
  position2D: {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [{ shaderLocation: 0, format: 'float32x2', offset: 0 }],
  } as GPUVertexBufferLayout,

  position2DColor3: {
    arrayStride: 5 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [
      { shaderLocation: 0, format: 'float32x2', offset: 0 },
      { shaderLocation: 1, format: 'float32x3', offset: 2 * Float32Array.BYTES_PER_ELEMENT },
    ],
  } as GPUVertexBufferLayout,

  position3DColor3: {
    arrayStride: 6 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [
      { shaderLocation: 0, format: 'float32x3', offset: 0 },
      { shaderLocation: 1, format: 'float32x3', offset: 3 * Float32Array.BYTES_PER_ELEMENT },
    ],
  } as GPUVertexBufferLayout,

  position3DTexcoord2: {
    arrayStride: 5 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [
      { shaderLocation: 0, format: 'float32x3', offset: 0 },
      { shaderLocation: 1, format: 'float32x2', offset: 3 * Float32Array.BYTES_PER_ELEMENT },
    ],
  } as GPUVertexBufferLayout,

  position3DTexcoord2Normal3: {
    arrayStride: 8 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [
      { shaderLocation: 0, format: 'float32x3', offset: 0 },
      { shaderLocation: 1, format: 'float32x2', offset: 3 * Float32Array.BYTES_PER_ELEMENT },
      { shaderLocation: 2, format: 'float32x3', offset: 5 * Float32Array.BYTES_PER_ELEMENT },
    ],
  } as GPUVertexBufferLayout,

  position2DColor4Offset2DScale2D: {
    arrayStride: 5 * Float32Array.BYTES_PER_ELEMENT,
    attributes: [
      { shaderLocation: 0, format: 'float32x2', offset: 0 },
      { shaderLocation: 4, format: 'float32x3', offset: 2 * Float32Array.BYTES_PER_ELEMENT },
    ],
  } as GPUVertexBufferLayout,

  instanceColor4Offset2D: {
    arrayStride: 6 * Float32Array.BYTES_PER_ELEMENT,
    stepMode: 'instance' as const,
    attributes: [
      { shaderLocation: 1, format: 'float32x4', offset: 0 },
      { shaderLocation: 2, format: 'float32x2', offset: 4 * Float32Array.BYTES_PER_ELEMENT },
    ],
  } as GPUVertexBufferLayout,

  instanceScale2D: {
    arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
    stepMode: 'instance' as const,
    attributes: [{ shaderLocation: 3, format: 'float32x2', offset: 0 }],
  } as GPUVertexBufferLayout,
};

export function createInterleavedLayout(
  attributes: { format: GPUVertexFormat; shaderLocation: number }[],
  stepMode: 'vertex' | 'instance' = 'vertex'
): GPUVertexBufferLayout {
  let offset = 0;
  const vertexAttributes = attributes.map(attr => {
    const formatSize = getFormatSize(attr.format);
    const result = { ...attr, offset };
    offset += formatSize;
    return result;
  });

  return {
    arrayStride: offset,
    stepMode,
    attributes: vertexAttributes,
  };
}

function getFormatSize(format: GPUVertexFormat): number {
  const sizes: Record<string, number> = {
    uint8: 1,
    uint8x2: 2,
    uint8x4: 4,
    sint8: 1,
    sint8x2: 2,
    sint8x4: 4,
    unorm8: 1,
    unorm8x2: 2,
    unorm8x4: 4,
    snorm8: 1,
    snorm8x2: 2,
    snorm8x4: 4,
    uint16x2: 4,
    uint16x4: 8,
    sint16x2: 4,
    sint16x4: 8,
    unorm16x2: 4,
    unorm16x4: 8,
    snorm16x2: 4,
    snorm16x4: 8,
    float16x2: 4,
    float16x4: 8,
    float32: 4,
    float32x2: 8,
    float32x3: 12,
    float32x4: 16,
    uint32: 4,
    uint32x2: 8,
    uint32x3: 12,
    uint32x4: 16,
    sint32: 4,
    sint32x2: 8,
    sint32x3: 12,
    sint32x4: 16,
  };
  return sizes[format] ?? 4;
}
