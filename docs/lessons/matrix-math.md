# Matrix Math

Transforms and projection, from the ground up.

- **Translation** (`translation/`) — moving geometry by adding offsets, driven
  by a `dat.GUI` panel.
- **Rotation** (`rotation/`) — rotating around the origin with a rotation
  matrix.
- **Scale** (`scale/`) — scaling geometry, with a GUI for live values.
- **Matrix Math** (`matrix-math/`, `matrix-math-2/`, `matrix-math-3/`) — the
  full treatment: building matrices with `wgpu-matrix`, multiplying them to
  compose transforms, and moving from 2D to 3D.
- **Orthographic Projection** (`orthographic-projection/`) — a depth buffer and
  an orthographic projection matrix to render 3D geometry without perspective.

## Key concepts

| Concept                                               | Where it appears                       |
| ----------------------------------------------------- | -------------------------------------- |
| `wgpu-matrix` (`mat3`, `mat4`)                        | Translation through Matrix Math        |
| Matrix multiplication to compose transforms           | Matrix Math 2                          |
| 3D matrices (`mat4`)                                  | Matrix Math 3, Orthographic Projection |
| Depth texture + depth stencil attachment              | Orthographic Projection                |
| GUI-indexed matrix values (`[number, number]` tuples) | most lessons                           |

## Try it

```bash
npm run dev
# then open /lessons/matrix-math/matrix-math/
```
