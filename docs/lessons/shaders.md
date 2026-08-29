# Shaders

- **Inter Stage Variables** (`inter-stage-variables/`) — passes data from the
  vertex shader to the fragment shader through `@builtin(position)` and
  `@location(n)` outputs, using a `struct` for the vertex output.

## Key concepts

| Concept                               | Where it appears      |
| ------------------------------------- | --------------------- |
| Vertex output `struct`                | Inter Stage Variables |
| `@location(n)` inter-stage variables  | Inter Stage Variables |
| `@builtin(position)`                  | Inter Stage Variables |
| Color interpolation across a triangle | Inter Stage Variables |

## Try it

```bash
npm run dev
# then open /lessons/shaders/inter-stage-variables/
```
