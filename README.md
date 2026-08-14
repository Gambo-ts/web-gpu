# Gambo Starter (TypeScript + WebGPU)

A from-scratch TypeScript rewrite of a 22-lesson WebGPU tutorial set, rebranded
and restructured as a self-contained **Gambo Starter** scaffold. No lesson
depends on an external tutorial site anymore — everything either ships as a
local npm dependency or lives in this repo.

## Structure

```
gambo-starter-ts/
├─ index.html            # Gambo Starter landing page, links every lesson by topic
├─ lessons/
│  ├─ fundamentals/      # render-intro, compute-intro
│  ├─ buffers/           # vertex-buffers*, uniforms*, storage-buffers*
│  ├─ matrix-math/       # translation, rotation, scale, matrix-math*, orthographic-projection
│  ├─ shaders/           # inter-stage-variables
│  ├─ textures/          # textures*, importing-textures*
│  │  └─ <name>/
│  │     ├─ index.html   # titled "Gambo Starter — <Lesson>"
│  │     └─ main.ts
├─ public/assets/        # drop lesson texture images here (see below)
├─ vite.config.ts        # multi-page build — every lesson is its own entry
├─ tsconfig.json
└─ package.json
```

## Getting started

```bash
npm install
npm run dev      # Vite dev server, open the printed localhost URL
npm run build    # type-checks with tsc, then builds a static export
```

Each lesson is independently reachable in dev at `/lessons/<topic>/<name>/`,
and the root `index.html` is a Gambo-branded index linking to all of them,
grouped by topic.

## What changed from the original tutorial source

- **Every `main.js` rewritten as `main.ts`**, with WebGPU objects (`GPUDevice`,
  `GPUCanvasContext`, `GPUTextureView`, render/compute pass descriptors, etc.)
  typed against `@webgpu/types`.
- **No more CDN/tutorial-site imports.** `wgpu-matrix` and `dat.gui` are now
  real npm dependencies instead of being pulled from a third-party CDN or
  `webgpufundamentals.org` at runtime.
- **All page titles and in-page branding renamed** to "Gambo Starter — ‹Lesson›",
  with a small "← Gambo Starter" badge linking back to the landing page.
- **Bundled with Vite** as a proper multi-page TypeScript project (previously
  each lesson was a standalone `<script src="main.js">` with no build step).

### A note on texture images

Three lessons (`textures-2`, `importing-textures*`) load bitmap images
(`f-texture.png`, `coins.jpg`, `noodles.jpg`,
`Granite_paving_tileable_512x512.jpeg`). Those are demo *assets*, not
tutorial-site branding, so they weren't rewritten — the code now expects them
at `public/assets/<filename>`. Drop your own versions of those files in (any
image works; they're just texture-mapping demos) and the lessons will run.

### TypeScript strictness

`tsconfig.json` ships with `strict: false` / `noImplicitAny: false` so the
set compiles cleanly out of the box, but every lesson's render-pass
descriptors are typed as `GPURenderPassDescriptor`, matrix/GUI settings use
tuple types, and helper signatures are annotated, so `npm run build` passes
its `tsc --noEmit` check. Tighten it incrementally per-lesson as you build on
top of this starter.
