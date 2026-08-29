export function wgsl(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    return result + str + (value ?? '');
  });
}

export const shaderTemplates = {
  vertexPosition2D: /* wgsl */ `
    struct Vertex {
      @location(0) position: vec2f,
    };

    struct VSOutput {
      @builtin(position) position: vec4f,
    };
  `,

  vertexPosition2DColor3: /* wgsl */ `
    struct Vertex {
      @location(0) position: vec2f,
      @location(1) color: vec3f,
    };

    struct VSOutput {
      @builtin(position) position: vec4f,
      @location(0) color: vec4f,
    };
  `,

  vertexPosition3DColor3: /* wgsl */ `
    struct Vertex {
      @location(0) position: vec3f,
      @location(1) color: vec3f,
    };

    struct VSOutput {
      @builtin(position) position: vec4f,
      @location(0) color: vec4f,
    };
  `,

  vertexPosition3DTexcoord2: /* wgsl */ `
    struct Vertex {
      @location(0) position: vec3f,
      @location(1) texcoord: vec2f,
    };

    struct VSOutput {
      @builtin(position) position: vec4f,
      @location(0) texcoord: vec2f,
    };
  `,

  vertexPosition3DTexcoord2Normal3: /* wgsl */ `
    struct Vertex {
      @location(0) position: vec3f,
      @location(1) texcoord: vec2f,
      @location(2) normal: vec3f,
    };

    struct VSOutput {
      @builtin(position) position: vec4f,
      @location(0) texcoord: vec2f,
      @location(1) normal: vec3f,
    };
  `,

  fragmentColor: /* wgsl */ `
    @fragment fn fs(vsOutput: VSOutput) -> @location(0) vec4f {
      return vsOutput.color;
    }
  `,

  fragmentTexture: /* wgsl */ `
    @group(0) @binding(0) var ourSampler: sampler;
    @group(0) @binding(1) var ourTexture: texture_2d<f32>;

    @fragment fn fs(fsInput: VSOutput) -> @location(0) vec4f {
      return textureSample(ourTexture, ourSampler, fsInput.texcoord);
    }
  `,

  fragmentTextureWithUniforms: /* wgsl */ `
    struct Uniforms {
      matrix: mat3x3f,
      resolution: vec2f,
      color: vec4f,
    };

    @group(0) @binding(0) var<uniform> uni: Uniforms;
    @group(0) @binding(1) var ourSampler: sampler;
    @group(0) @binding(2) var ourTexture: texture_2d<f32>;

    @fragment fn fs(fsInput: VSOutput) -> @location(0) vec4f {
      return textureSample(ourTexture, ourSampler, fsInput.texcoord) * uni.color;
    }
  `,

  computeDoubling: /* wgsl */ `
    @group(0) @binding(0) var<storage, read_write> data: array<f32>;

    @compute @workgroup_size(1) fn computeSomething(
      @builtin(global_invocation_id) id: vec3u
    ) {
      let i = id.x;
      data[i] = data[i] * 2.0;
    }
  `,
};

export function createShaderCode(vertexSrc: string, fragmentSrc: string): string {
  return vertexSrc + '\n' + fragmentSrc;
}

export function createUniformStruct(
  name: string,
  fields: { name: string; type: string }[]
): string {
  const fieldStr = fields.map(f => `  ${f.name}: ${f.type},`).join('\n');
  return `struct ${name} {\n${fieldStr}\n};`;
}

export function createVertexStruct(
  name: string,
  fields: { location: number; name: string; type: string }[]
): string {
  const fieldStr = fields.map(f => `  @location(${f.location}) ${f.name}: ${f.type},`).join('\n');
  return `struct ${name} {\n${fieldStr}\n};`;
}

export function createVSOutputStruct(
  name: string,
  fields: { location?: number; builtin?: string; name: string; type: string }[]
): string {
  const fieldStr = fields
    .map(f => {
      const decorators: string[] = [];
      if (f.builtin) decorators.push(`@builtin(${f.builtin})`);
      if (f.location !== undefined) decorators.push(`@location(${f.location})`);
      return `  ${decorators.join(' ')} ${f.name}: ${f.type},`;
    })
    .join('\n');
  return `struct ${name} {\n${fieldStr}\n};`;
}
