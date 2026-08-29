# Textures

Sampling images on the GPU and loading them from the browser.

- **Textures** (`textures/`, `textures-2/`, `textures-3/`) — create a texture,
  fill it with data, sample it in a shader with a sampler, and bind it via a
  bind group. Later parts add GUI controls and use `wgpu-matrix` for transforms.

- **Importing Textures** (`importing-textures/`, `importing-textures-2/`,
  `importing-textures-3/`) — load real images (`f-texture.png`, `coins.jpg`,
  `noodles.jpg`, `Granite_paving_tileable_512x512.jpeg`) with
  `createImageBitmap`, then copy them into GPU textures. Part 2 adds mip-map
  generation; part 3 adds a rotating cube with depth.

## Key concepts

| Concept                                              | Where it appears             |
| ---------------------------------------------------- | ---------------------------- |
| `createTexture` + `queue.copyExternalImageToTexture` | Textures, Importing Textures |
| Sampler creation + `textureSample` in WGSL           | Textures                     |
| `createImageBitmap` from a fetched URL               | Importing Textures           |
| Mip-map generation (`generateMips`)                  | Importing Textures 2         |
| Cube geometry + depth buffer                         | Importing Textures 3         |

## Texture assets

Drop demo images in `public/assets/`. The lessons expect them at
`/assets/<filename>`.

## Try it

```bash
npm run dev
# then open /lessons/textures/textures/
```
