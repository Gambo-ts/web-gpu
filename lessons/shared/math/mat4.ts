import { mat4 as wgpuMat4 } from 'wgpu-matrix';
import type { Mat4 } from '../types.js';

export const mat4 = {
  create(): Mat4 {
    return wgpuMat4.create() as Mat4;
  },

  identity(): Mat4 {
    return wgpuMat4.identity() as Mat4;
  },

  copy(a: Mat4, out?: Mat4): Mat4 {
    return wgpuMat4.copy(a, out as any) as Mat4;
  },

  translation(t: [number, number, number], out?: Mat4): Mat4 {
    return wgpuMat4.translation(t, out as any) as Mat4;
  },

  rotationX(radians: number, out?: Mat4): Mat4 {
    return wgpuMat4.rotationX(radians, out as any) as Mat4;
  },

  rotationY(radians: number, out?: Mat4): Mat4 {
    return wgpuMat4.rotationY(radians, out as any) as Mat4;
  },

  rotationZ(radians: number, out?: Mat4): Mat4 {
    return wgpuMat4.rotationZ(radians, out as any) as Mat4;
  },

  scaling(s: [number, number, number], out?: Mat4): Mat4 {
    return wgpuMat4.scaling(s, out as any) as Mat4;
  },

  multiply(a: Mat4, b: Mat4, out?: Mat4): Mat4 {
    return wgpuMat4.multiply(a, b, out as any) as Mat4;
  },

  translate(m: Mat4, t: [number, number, number], out?: Mat4): Mat4 {
    return wgpuMat4.translate(m, t, out as any) as Mat4;
  },

  rotateX(m: Mat4, radians: number, out?: Mat4): Mat4 {
    return wgpuMat4.rotateX(m, radians, out as any) as Mat4;
  },

  rotateY(m: Mat4, radians: number, out?: Mat4): Mat4 {
    return wgpuMat4.rotateY(m, radians, out as any) as Mat4;
  },

  rotateZ(m: Mat4, radians: number, out?: Mat4): Mat4 {
    return wgpuMat4.rotateZ(m, radians, out as any) as Mat4;
  },

  scale(m: Mat4, s: [number, number, number], out?: Mat4): Mat4 {
    return wgpuMat4.scale(m, s, out as any) as Mat4;
  },

  invert(m: Mat4, out?: Mat4): Mat4 {
    return wgpuMat4.invert(m, out as any) as Mat4;
  },

  transpose(m: Mat4, out?: Mat4): Mat4 {
    return wgpuMat4.transpose(m, out as any) as Mat4;
  },

  perspective(fov: number, aspect: number, near: number, far: number, out?: Mat4): Mat4 {
    return wgpuMat4.perspective(fov, aspect, near, far, out as any) as Mat4;
  },

  orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
    out?: Mat4
  ): Mat4 {
    return wgpuMat4.orthographic(left, right, bottom, top, near, far, out as any) as Mat4;
  },

  lookAt(
    eye: [number, number, number],
    target: [number, number, number],
    up: [number, number, number],
    out?: Mat4
  ): Mat4 {
    return wgpuMat4.lookAt(eye, target, up, out as any) as Mat4;
  },
};

export function createViewProjectionMatrix(
  canvas: HTMLCanvasElement,
  cameraPosition: [number, number, number] = [0, 0, 2],
  target: [number, number, number] = [0, 0, 0],
  up: [number, number, number] = [0, 1, 0],
  fov: number = (60 * Math.PI) / 180,
  near: number = 1,
  far: number = 2000,
  out?: Mat4
): Mat4 {
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projectionMatrix = mat4.perspective(fov, aspect, near, far);
  const viewMatrix = mat4.lookAt(cameraPosition, target, up);
  return mat4.multiply(projectionMatrix, viewMatrix, out);
}
