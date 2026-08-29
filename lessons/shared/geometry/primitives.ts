import type { VertexData } from '../types.js';

export function createFVertices(): VertexData {
  const vertexData = new Float32Array([
    0, 0, 30, 0, 0, 150, 30, 150, 30, 0, 100, 0, 30, 30, 100, 30, 30, 60, 70, 60, 30, 90, 70, 90,
  ]);

  const indexData = new Uint32Array([0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11]);

  return {
    vertexData,
    indexData,
    numVertices: indexData.length,
  };
}

export function createFVertices3D(): VertexData {
  const positions = [
    0, 0, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 30, 60, 0,
    70, 60, 0, 30, 90, 0, 70, 90, 0, 0, 0, 30, 30, 0, 30, 0, 150, 30, 30, 150, 30, 30, 0, 30, 100,
    0, 30, 30, 30, 30, 100, 30, 30, 30, 60, 30, 70, 60, 30, 30, 90, 30, 70, 90, 30,
  ];

  const indices = [
    0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 14, 13, 14, 15, 13, 16, 18, 17, 18,
    19, 17, 20, 22, 21, 22, 23, 21, 0, 12, 5, 12, 17, 5, 5, 17, 7, 17, 19, 7, 6, 7, 18, 18, 7, 19,
    6, 18, 8, 18, 20, 8, 8, 20, 9, 20, 21, 9, 9, 21, 11, 21, 23, 11, 10, 11, 22, 22, 11, 23, 10, 22,
    3, 22, 15, 3, 2, 3, 14, 14, 3, 15, 0, 2, 12, 12, 2, 14,
  ];

  const quadColors = [
    200, 70, 120, 200, 70, 120, 200, 70, 120, 80, 70, 200, 80, 70, 200, 80, 70, 200, 70, 200, 210,
    160, 160, 220, 90, 130, 110, 200, 200, 70, 210, 100, 70, 210, 160, 70, 70, 180, 210, 100, 70,
    210, 76, 210, 100, 140, 210, 80,
  ];

  const numVertices = indices.length;
  const vertexData = new Float32Array(numVertices * 4);
  const colorData = new Uint8Array(vertexData.buffer);

  for (let i = 0; i < indices.length; ++i) {
    const positionNdx = indices[i] * 3;
    const position = positions.slice(positionNdx, positionNdx + 3);
    vertexData.set(position, i * 4);

    const quadNdx = ((i / 6) | 0) * 3;
    const color = quadColors.slice(quadNdx, quadNdx + 3);
    colorData.set(color, i * 16 + 12);
    colorData[i * 16 + 15] = 255;
  }

  return {
    vertexData,
    numVertices,
  };
}

export interface CircleOptions {
  radius?: number;
  numSubdivisions?: number;
  innerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}

export function createCircleVertices(options: CircleOptions = {}): VertexData {
  const {
    radius = 1,
    numSubdivisions = 24,
    innerRadius = 0,
    startAngle = 0,
    endAngle = Math.PI * 2,
  } = options;

  const numVertices = numSubdivisions * 3 * 2;
  const vertexData = new Float32Array(numVertices * 5);

  let offset = 0;
  function addVertex(x: number, y: number, r: number, g: number, b: number) {
    vertexData[offset++] = x;
    vertexData[offset++] = y;
    vertexData[offset++] = r;
    vertexData[offset++] = g;
    vertexData[offset++] = b;
  }

  const innerColor: [number, number, number] = [1, 1, 1];
  const outerColor: [number, number, number] = [0.1, 0.1, 0.1];

  for (let i = 0; i < numSubdivisions; i++) {
    const angle1 = startAngle + ((i + 0) * (endAngle - startAngle)) / numSubdivisions;
    const angle2 = startAngle + ((i + 1) * (endAngle - startAngle)) / numSubdivisions;

    const c1 = Math.cos(angle1);
    const c2 = Math.cos(angle2);
    const s1 = Math.sin(angle1);
    const s2 = Math.sin(angle2);

    addVertex(c1 * radius, s1 * radius, ...outerColor);
    addVertex(c2 * radius, s2 * radius, ...outerColor);
    addVertex(c1 * innerRadius, s1 * innerRadius, ...innerColor);

    addVertex(c1 * innerRadius, s1 * innerRadius, ...innerColor);
    addVertex(c2 * radius, s2 * radius, ...outerColor);
    addVertex(c2 * innerRadius, s2 * innerRadius, ...innerColor);
  }

  return {
    vertexData,
    numVertices,
  };
}

export function createQuadVertices(): VertexData {
  const vertexData = new Float32Array([
    0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0,
  ]);

  return {
    vertexData,
    numVertices: 6,
  };
}

export function createCubeVertices(): VertexData {
  const positions = new Float32Array([
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1,
    -1, -1, 1, -1, 1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1,
    1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
  ]);

  const texcoords = new Float32Array([
    0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1,
  ]);

  const normals = new Float32Array([
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1, 0, 0,
    -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  ]);

  const indices = new Uint32Array([
    0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4, 8, 9, 10, 10, 11, 8, 12, 13, 14, 14, 15, 12, 16, 17, 18, 18,
    19, 16, 20, 21, 22, 22, 23, 20,
  ]);

  const vertexData = new Float32Array(positions.length + texcoords.length + normals.length);
  vertexData.set(positions, 0);
  vertexData.set(texcoords, positions.length);
  vertexData.set(normals, positions.length + texcoords.length);

  return {
    vertexData,
    indexData: indices,
    numVertices: indices.length,
  };
}

export interface PlaneOptions {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export function createPlaneVertices(options: PlaneOptions = {}): VertexData {
  const { width = 1, height = 1, widthSegments = 1, heightSegments = 1 } = options;

  const positions: number[] = [];
  const texcoords: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments;
      const v = y / heightSegments;
      positions.push((u - 0.5) * width, (v - 0.5) * height, 0);
      texcoords.push(u, 1 - v);
      normals.push(0, 0, 1);
    }
  }

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const a = y * (widthSegments + 1) + x;
      const b = a + 1;
      const c = a + widthSegments + 1;
      const d = c + 1;
      indices.push(a, b, d, d, c, a);
    }
  }

  const vertexData = new Float32Array(positions.length + texcoords.length + normals.length);
  vertexData.set(positions, 0);
  vertexData.set(texcoords, positions.length);
  vertexData.set(normals, positions.length + texcoords.length);

  return {
    vertexData,
    indexData: new Uint32Array(indices),
    numVertices: indices.length,
  };
}
