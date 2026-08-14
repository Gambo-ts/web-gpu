# Project Structure

```
gambo-starter-ts/
├─ index.html            # Landing page, links every lesson by topic
├─ docs/                 # This documentation site (VitePress)
├─ lessons/
│  ├─ fundamentals/      # render-intro, compute-intro
│  ├─ buffers/           # vertex-buffers*, uniforms*, storage-buffers*
│  ├─ matrix-math/       # translation, rotation, scale, matrix-math*, orthographic-projection
│  ├─ shaders/           # inter-stage-variables
│  └─ textures/          # textures*, importing-textures*
│     └─ <name>/
│        ├─ index.html   # titled "Gambo Starter — <Lesson>"
│        └─ main.ts
├─ public/assets/        # lesson texture images (f-texture.png, coins.jpg, etc.)
├─ vite.config.ts        # multi-page build — every lesson is its own entry
├─ tsconfig.json
└─ package.json
```

## Key files

- **`vite.config.ts`** — discovers `lessons/*/*/index.html` and builds each as a
  separate entry point. Uses `glob` and a cross-platform path split (`[\\/]`)
  so it works on Windows and Unix.
- **`tsconfig.json`** — ships `strict: false` / `noImplicitAny: false`, but
  render-pass descriptors, GUI settings, and helper signatures are annotated,
  so `npm run build`'s `tsc --noEmit` check passes.
- **`public/assets/`** — drop demo texture images here. The texture lessons
  expect them at `/assets/<filename>`.

## About texture images

Three lessons load bitmap images (`f-texture.png`, `coins.jpg`, `noodles.jpg`,
`Granite_paving_tileable_512x512.jpeg`). They're demo assets, not branding —
any image works. The code expects them in `public/assets/`.