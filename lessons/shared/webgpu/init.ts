import type { WebGPUContext, WebGPUInitOptions } from '../types.js';

export async function initWebGPU(options: WebGPUInitOptions = {}): Promise<WebGPUContext> {
  const {
    canvas: providedCanvas,
    canvasSelector = 'canvas',
    alphaMode = 'premultiplied',
    requiredFeatures = [],
    requiredLimits = {},
  } = options;

  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported in this browser');
  }

  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) {
    throw new Error('No WebGPU adapter found');
  }

  for (const feature of requiredFeatures) {
    if (!adapter.features.has(feature as GPUFeatureName)) {
      throw new Error(`Required feature "${feature}" not supported`);
    }
  }

  const device = await adapter.requestDevice({
    requiredFeatures: requiredFeatures as GPUFeatureName[],
    requiredLimits,
  });

  device.lost.then(info => {
    console.error(`WebGPU device lost: ${info.reason} - ${info.message}`);
  });

  const canvas = providedCanvas ?? document.querySelector(canvasSelector);
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Canvas not found: ${canvasSelector}`);
  }

  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('Failed to get WebGPU context from canvas');
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode,
  });

  return {
    adapter,
    device,
    canvas,
    context,
    format,
  };
}

export function createShaderModule(
  device: GPUDevice,
  label: string,
  code: string
): GPUShaderModule {
  return device.createShaderModule({ label, code });
}

export function createBasicRenderPipeline(
  device: GPUDevice,
  options: GPURenderPipelineDescriptor
): GPURenderPipeline {
  return device.createRenderPipeline(options);
}

export function createBasicComputePipeline(
  device: GPUDevice,
  options: GPUComputePipelineDescriptor
): GPUComputePipeline {
  return device.createComputePipeline(options);
}
