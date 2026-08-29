// Types are globally available via @webgpu/types in tsconfig

export interface PipelineLayoutOptions {
  bindGroupLayouts?: GPUBindGroupLayout[];
  label?: string;
}

export function createPipelineLayout(
  device: GPUDevice,
  options: PipelineLayoutOptions = {}
): GPUPipelineLayout {
  return device.createPipelineLayout({
    bindGroupLayouts: options.bindGroupLayouts ?? [],
    label: options.label,
  });
}

export interface RenderPipelineOptions {
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

export function createRenderPipeline(
  device: GPUDevice,
  options: RenderPipelineOptions
): GPURenderPipeline {
  return device.createRenderPipeline({
    label: options.label,
    layout: options.layout ?? 'auto',
    vertex: {
      module: options.vertex.module,
      entryPoint: options.vertex.entryPoint,
      buffers: options.vertex.buffers,
      constants: options.vertex.constants,
    },
    fragment: options.fragment
      ? {
          module: options.fragment.module,
          entryPoint: options.fragment.entryPoint,
          targets: options.fragment.targets,
          constants: options.fragment.constants,
        }
      : undefined,
    primitive: options.primitive ?? { cullMode: 'back' },
    depthStencil: options.depthStencil,
    multisample: options.multisample,
  });
}

export interface ComputePipelineOptions {
  label?: string;
  layout?: GPUPipelineLayout | 'auto';
  compute: {
    module: GPUShaderModule;
    entryPoint: string;
    constants?: Record<string, number>;
  };
}

export function createComputePipeline(
  device: GPUDevice,
  options: ComputePipelineOptions
): GPUComputePipeline {
  return device.createComputePipeline({
    label: options.label,
    layout: options.layout ?? 'auto',
    compute: {
      module: options.compute.module,
      entryPoint: options.compute.entryPoint,
      constants: options.compute.constants,
    },
  });
}

export function createBindGroup(
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  entries: GPUBindGroupEntry[],
  label?: string
): GPUBindGroup {
  return device.createBindGroup({
    layout,
    entries,
    label,
  });
}

export function createBindGroupLayout(
  device: GPUDevice,
  entries: GPUBindGroupLayoutEntry[],
  label?: string
): GPUBindGroupLayout {
  return device.createBindGroupLayout({
    entries,
    label,
  });
}
