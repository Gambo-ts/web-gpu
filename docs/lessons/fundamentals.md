# Fundamentals

Where every WebGPU journey starts: the render pipeline and the compute pipeline.

- **Render Intro** (`lessons/fundamentals/render-intro/`) — sets up an adapter
  and device, configures the canvas context, compiles a WGSL shader module, and
  draws a hardcoded green triangle through a render pipeline and render pass.

- **Compute Intro** (`lessons/fundamentals/compute-intro/`) — introduces the
  compute pipeline, dispatching a workgroup that writes into a storage buffer.

## Key concepts

| Concept                               | Where it appears |
| ------------------------------------- | ---------------- |
| `requestAdapter` / `requestDevice`    | both lessons     |
| Canvas + `GPUCanvasContext.configure` | Render Intro     |
| `createShaderModule` with WGSL        | Render Intro     |
| Render pipeline + render pass         | Render Intro     |
| Compute pipeline + dispatch           | Compute Intro    |

## Try it

```bash
npm run dev
# then open /lessons/fundamentals/render-intro/
```
