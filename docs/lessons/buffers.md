# Buffers

How data travels to and from the GPU.

- **Vertex Buffers** (`vertex-buffers/`, `vertex-buffers-2/`) — build vertex
  data with a helper that generates circle geometry, then bind it with
  `setVertexBuffer`. Part 2 mixes static and per-frame changing buffers with
  multiple vertex attributes (positions + colors).

- **Uniforms** (`uniforms/`, `uniforms-2/`) — per-draw uniform buffers shared
  with shaders. Part 1 sends color data; part 2 adds a resolution uniform and a
  `dat.GUI` panel for live tweaking.

- **Storage Buffers** (`storage-buffers/`, `storage-buffers-2/`) — larger,
  GPU-writable buffers. Part 2 demonstrates updating a storage buffer every
  frame and binding it alongside vertex buffers.

## Key concepts

| Concept | Where it appears |
| --- | --- |
| `createBuffer` + `writeBuffer` | all buffer lessons |
| `setVertexBuffer` | Vertex Buffers |
| `createBindGroup` / uniform bindings | Uniforms |
| Storage buffer binding | Storage Buffers |
| `dat.GUI` for live controls | Uniforms 2, Storage Buffers |

## Try it

```bash
npm run dev
# then open /lessons/buffers/vertex-buffers/
```