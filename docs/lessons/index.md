# Lessons Overview

Complete catalog of all Gambo Starter lessons organized by topic.

## Fundamentals

### Render Intro

**Path:** `/lessons/fundamentals/render-intro/`

The "Hello World" of WebGPU rendering. Sets up adapter, device, canvas context, compiles a WGSL shader module, and draws a hardcoded green triangle.

**Key Concepts:**

- `requestAdapter` / `requestDevice`
- Canvas + `GPUCanvasContext.configure`
- `createShaderModule` with WGSL
- Render pipeline + render pass

### Compute Intro

**Path:** `/lessons/fundamentals/compute-intro/`

Introduction to compute pipelines. Dispatches a workgroup that doubles values in a storage buffer.

**Key Concepts:**

- Compute pipeline creation
- Storage buffer binding
- `dispatchWorkgroups`
- Buffer readback with `mapAsync`

---

## Buffers

### Vertex Buffers

**Path:** `/lessons/buffers/vertex-buffers/`

Build vertex data with a helper that generates circle geometry, then bind it with `setVertexBuffer`.

**Key Concepts:**

- Vertex buffer creation
- `setVertexBuffer`
- Interleaved vertex attributes (position + color)

### Vertex Buffers 2

**Path:** `/lessons/buffers/vertex-buffers-2/`

Mixes static and per-frame changing buffers with multiple vertex attributes using instanced rendering.

**Key Concepts:**

- Multiple vertex buffers
- Instance step mode
- Per-instance data (color, offset, scale)

### Uniforms

**Path:** `/lessons/buffers/uniforms/`

Per-draw uniform buffers shared with shaders. Sends color, scale, and offset data.

**Key Concepts:**

- Uniform buffer creation
- `createBindGroup` / uniform bindings
- Buffer layout with alignment

### Uniforms 2

**Path:** `/lessons/buffers/uniforms-2/`

Adds resolution uniform and `dat.GUI` panel for live tweaking of 100 objects.

**Key Concepts:**

- Multiple uniform buffers per object
- `dat.GUI` for live controls
- Object-oriented buffer management

### Storage Buffers

**Path:** `/lessons/buffers/storage-buffers/`

Larger, GPU-writable buffers. Demonstrates storage buffer binding alongside vertex buffers.

**Key Concepts:**

- Storage buffer creation
- Read-only storage binding
- Instanced rendering with storage buffers

### Storage Buffers 2

**Path:** `/lessons/buffers/storage-buffers-2/`

Updates a storage buffer every frame and binds it alongside vertex buffers.

**Key Concepts:**

- Dynamic storage buffer updates
- Per-frame buffer writes
- Large buffer management

---

## Matrix Math

### Translation

**Path:** `/lessons/matrix-math/translation/`

Moving geometry by adding offsets, driven by a `dat.GUI` panel.

**Key Concepts:**

- Translation matrix
- Manual vertex transformation in shader
- GUI-driven parameters

### Rotation

**Path:** `/lessons/matrix-math/rotation/`

Rotating around the origin with a rotation matrix using sine/cosine.

**Key Concepts:**

- 2D rotation matrix
- `Math.sin` / `Math.cos` in uniform
- Degree/radian conversion

### Scale

**Path:** `/lessons/matrix-math/scale/`

Scaling geometry with a scale matrix, with GUI for live values.

**Key Concepts:**

- Scale matrix
- Combined transform order (scale → rotate → translate)
- Independent X/Y scaling

### Matrix Math

**Path:** `/lessons/matrix-math/matrix-math/`

Full treatment: building matrices with `wgpu-matrix`, multiplying them to compose transforms.

**Key Concepts:**

- `wgpu-matrix` mat3 operations
- Matrix multiplication for composition
- Clip space transformation

### Matrix Math 2

**Path:** `/lessons/matrix-math/matrix-math-2/`

Multiple objects with independent transforms using accumulated matrix multiplication.

**Key Concepts:**

- Per-object transform matrices
- Matrix accumulation
- Multiple bind groups

### Matrix Math 3

**Path:** `/lessons/matrix-math/matrix-math-3/`

Refactored clip space matrix and cleaner transform composition.

**Key Concepts:**

- Separate clip space matrix
- Transform composition order
- Matrix identity reset

### Orthographic Projection

**Path:** `/lessons/matrix-math/orthographic-projection/`

3D "F" shape with depth buffer and orthographic projection matrix.

**Key Concepts:**

- 3D vertex data (position + color)
- `mat4.ortho` projection
- Depth texture + depth stencil attachment
- Face culling
- 3D GUI controls (translation, rotation, scale)

---

## Shaders

### Inter Stage Variables

**Path:** `/lessons/shaders/inter-stage-variables/`

Passes data from vertex shader to fragment shader through `@builtin(position)` and `@location(n)` outputs.

**Key Concepts:**

- Vertex output `struct`
- `@location(n)` inter-stage variables
- `@builtin(position)`
- Color interpolation across triangle

---

## Textures

### Textures

**Path:** `/lessons/textures/textures/`

Create a texture, fill it with data, sample it in a shader with a sampler, and bind via bind group.

**Key Concepts:**

- `createTexture` + `queue.writeTexture`
- Sampler creation
- `textureSample` in WGSL
- Bind group binding

### Textures 2

**Path:** `/lessons/textures/textures-2/`

Adds GUI controls for sampler parameters (address modes, filters) and mipmap generation.

**Key Concepts:**

- Multiple sampler configurations
- `addressModeU/V`, `magFilter`, `minFilter`
- Mipmap level generation
- Animated texture coordinates

### Textures 3

**Path:** `/lessons/textures/textures-3/`

Uses `wgpu-matrix` for 2D transforms on textured quad.

**Key Concepts:**

- `wgpu-matrix` mat3 for texture transforms
- Matrix composition for texture coordinates
- Combined transform + texture coords

### Importing Textures

**Path:** `/lessons/textures/importing-textures/`

Load real images (`f-texture.png`) with `createImageBitmap`, copy into GPU textures.

**Key Concepts:**

- `fetch` + `blob()` + `createImageBitmap`
- `queue.copyExternalImageToTexture`
- Texture from external image

### Importing Textures 2

**Path:** `/lessons/textures/importing-textures-2/`

Loads multiple images (`f-texture.png`, `coins.jpg`, `Granite_paving_tileable_512x512.jpeg`) with mip-map generation.

**Key Concepts:**

- Multiple texture loading
- Mip-map generation via render passes
- `generateMips` utility
- Texture array via multiple bind groups
- 3D transform with perspective

### Importing Textures 3

**Path:** `/lessons/textures/importing-textures-3/`

Rotating textured cube with depth buffer, multiple textures, and click-to-cycle.

**Key Concepts:**

- Cube geometry with normals/UVs
- Depth buffer for 3D
- Multiple textures with click cycling
- Perspective projection
- Camera view matrix
