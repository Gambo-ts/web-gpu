import { mat3 as wgpuMat3 } from 'wgpu-matrix';
import type { Mat3 } from '../types.js';

export const mat3 = {
  create(): Mat3 {
    return wgpuMat3.create() as Mat3;
  },

  identity(): Mat3 {
    return wgpuMat3.identity() as Mat3;
  },

  copy(a: Mat3, out?: Mat3): Mat3 {
    return wgpuMat3.copy(a, out as any) as Mat3;
  },

  translation(t: [number, number], out?: Mat3): Mat3 {
    return wgpuMat3.translation(t, out as any) as Mat3;
  },

  rotation(radians: number, out?: Mat3): Mat3 {
    return wgpuMat3.rotation(radians, out as any) as Mat3;
  },

  scaling(s: [number, number], out?: Mat3): Mat3 {
    return wgpuMat3.scaling(s, out as any) as Mat3;
  },

  multiply(a: Mat3, b: Mat3, out?: Mat3): Mat3 {
    return wgpuMat3.multiply(a, b, out as any) as Mat3;
  },

  translate(m: Mat3, t: [number, number], out?: Mat3): Mat3 {
    return wgpuMat3.translate(m, t, out as any) as Mat3;
  },

  rotate(m: Mat3, radians: number, out?: Mat3): Mat3 {
    return wgpuMat3.rotate(m, radians, out as any) as Mat3;
  },

  scale(m: Mat3, s: [number, number], out?: Mat3): Mat3 {
    return wgpuMat3.scale(m, s, out as any) as Mat3;
  },

  invert(m: Mat3, out?: Mat3): Mat3 {
    return wgpuMat3.invert(m, out as any) as Mat3;
  },

  transpose(m: Mat3, out?: Mat3): Mat3 {
    return wgpuMat3.transpose(m, out as any) as Mat3;
  },

  fromMat4(m: Float32Array, out?: Mat3): Mat3 {
    return wgpuMat3.fromMat4(m, out as any) as Mat3;
  },
};

export function createTransformMatrix(
  translation: [number, number] = [0, 0],
  rotation: number = 0,
  scale: [number, number] = [1, 1],
  out?: Mat3
): Mat3 {
  const matrix = mat3.identity();
  mat3.translate(matrix, translation, matrix);
  mat3.rotate(matrix, rotation, matrix);
  mat3.scale(matrix, scale, matrix);
  if (out) {
    mat3.copy(matrix, out);
    return out;
  }
  return matrix;
}

export function createClipSpaceMatrix(canvas: HTMLCanvasElement, out?: Mat3): Mat3 {
  const toClipSpace = mat3.multiply(
    mat3.multiply(mat3.scaling([1, -1]), mat3.translation([-1, -1])),
    mat3.scaling([2 / canvas.clientWidth, 2 / canvas.clientHeight]),
    out
  );
  return toClipSpace;
}
