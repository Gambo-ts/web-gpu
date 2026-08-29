# Creating Lessons

Learn how to create new lessons using the shared module system.

## Quick Start

1. Create a new folder under `lessons/<topic>/<lesson-name>/`
2. Add `index.html` and `main.ts`
3. Use the shared modules for common functionality

## Lesson Template

### index.html

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gambo Starter — My Lesson</title>
  </head>
  <body>
    <a class="gambo-badge" href="/">← Gambo Starter</a>
    <canvas></canvas>
    <script type="module" src="./main.ts"></script>

    <style>
      .gambo-badge {
        position: fixed;
        top: 8px;
        left: 8px;
        z-index: 10;
        font:
          12px/1.4 system-ui,
          sans-serif;
        color: #fff;
        background: rgba(0, 0, 0, 0.55);
        padding: 4px 10px;
        border-radius: 999px;
        text-decoration: none;
      }
      .gambo-badge:hover {
        background: rgba(0, 0, 0, 0.8);
      }
      html,
      body {
        margin: 0;
        height: 100%;
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
  </body>
</html>
```

### main.ts

```typescript
import {
  initWebGPU,
  createShaderModule,
  createRenderPipeline,
  createRenderLoop,
  createVertexBuffer,
} from '@shared/webgpu/index.js';
import { createTriangleVertices } from '@shared/geometry/index.js';

async function main() {
  try {
    const context = await initWebGPU({ canvasSelector: 'canvas' });

    const module = createShaderModule(
      context.device,
      'My Shader',
      /* wgsl */ `
      struct Vertex {
        @location(0) position: vec2f,
        @location(1) color: vec3f,
      };

      struct VSOutput {
        @builtin(position) position: vec4f,
        @location(0) color: vec4f,
      };

      @vertex fn vs(vert: Vertex) -> VSOutput {
        var vsOut: VSOutput;
        vsOut.position = vec4f(vert.position, 0.0, 1.0);
        vsOut.color = vec4f(vert.color, 1.0);
        return vsOut;
      }

      @fragment fn fs(vsOut: VSOutput) -> @location(0) vec4f {
        return vsOut.color;
      }
    `
    );

    const pipeline = createRenderPipeline(context.device, {
      label: 'My Pipeline',
      layout: 'auto',
      vertex: {
        entryPoint: 'vs',
        module,
        buffers: [
          {
            arrayStride: 20,
            attributes: [
              { shaderLocation: 0, format: 'float32x2', offset: 0 },
              { shaderLocation: 1, format: 'float32x3', offset: 8 },
            ],
          },
        ],
      },
      fragment: { entryPoint: 'fs', module, targets: [{ format: context.format }] },
    });

    const { vertexData } = createTriangleVertices();
    const vertexBuffer = createVertexBuffer(context.device, vertexData);

    const renderPassDesc: GPURenderPassDescriptor = {
      label: 'Render Pass',
      colorAttachments: [
        {
          view: null as unknown as GPUTextureView,
          clearValue: [0.1, 0.1, 0.15, 1.0],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const renderLoop = createRenderLoop({
      context,
      renderPassDesc,
      onRender: pass => {
        pass.setPipeline(pipeline);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(3);
      },
    });

    renderLoop.start();
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

main();
```

## Using Shared Modules

### WebGPU Initialization

```typescript
import { initWebGPU } from '@shared/webgpu/index.js';

const context = await initWebGPU({
  canvasSelector: 'canvas',
  alphaMode: 'premultiplied',
  requiredFeatures: ['depth-clip-control'],
  requiredLimits: { maxTextureDimension2D: 8192 },
});
```

### Buffers

```typescript
import {
  createUniformBuffer,
  createVertexBuffer,
  writeBuffer,
  createUniformLayout,
} from '@shared/webgpu/index.js';

const layout = createUniformLayout([
  { name: 'color', size: 16 }, // vec4f
  { name: 'matrix', size: 64 }, // mat4x4f
]);

const buffer = createUniformBuffer(device, 80);
const values = new Float32Array(20); // 80 bytes / 4
```

### Render Loop

```typescript
import { createRenderLoop } from '@shared/webgpu/index.js';

const renderLoop = createRenderLoop({
  context,
  renderPassDesc,
  onRender: (pass, renderContext) => {
    // Your render commands here
    pass.setPipeline(pipeline);
    pass.draw(3);
  },
  onResize: (width, height) => {
    // Handle resize
  },
});

renderLoop.start();
// renderLoop.stop() to stop
```

### Math Utilities

```typescript
import { mat3, mat4, degToRad, createTransformMatrix } from '@shared/math/index.js';

const matrix = mat3.identity();
mat3.translate(matrix, [100, 100], matrix);
mat3.rotate(matrix, degToRad(45), matrix);
mat3.scale(matrix, [2, 2], matrix);
```

### Geometry

```typescript
import {
  createTriangleVertices,
  createQuadVertices,
  createCubeVertices,
} from '@shared/geometry/index.js';

const { vertexData, numVertices } = createTriangleVertices();
```

### UI Components

```typescript
import { createGUI, addSlider, addVector2, addSelect } from '@shared/ui/index.js';

const gui = await createGUI();
addSlider(gui, settings, 'rotation', 0, Math.PI * 2);
addVector2(gui, settings, 'translation', -500, 500);
addSelect(gui, settings, 'mode', ['wireframe', 'solid', 'points']);
```

## Registering the Lesson

The lesson will be automatically discovered by Vite based on the folder structure:

- `lessons/<topic>/<lesson-name>/index.html` → `/lessons/<topic>/<lesson-name>/`
- `lessons/<topic>/<lesson-name>/main.ts` → compiled and bundled

Add a link to the landing page (`index.html`) or the documentation sidebar to make it discoverable.

## Exercise Template

Create an `exercise.md` file in your lesson folder:

```markdown
# Exercise: <Title>

## Objective

<What the learner should achieve>

## Tasks

1. <Task 1>
2. <Task 2>
3. <Task 3>

## Hints

- <Hint 1>
- <Hint 2>

## Solution

<Collapsible solution section>
```
