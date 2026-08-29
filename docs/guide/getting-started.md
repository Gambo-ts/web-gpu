# Getting Started

## Install

```bash
npm install
```

## Run the dev server

```bash
npm run dev
```

Open the printed `localhost` URL. The landing page links every lesson.

## Build a static export

```bash
npm run build
```

This type-checks with `tsc`, then builds a full static export with Vite. Every
lesson is its own multi-page entry point.

## Preview the docs site

```bash
npm run docs:dev     # dev server
npm run docs:build   # static build
```

## Check WebGPU support

Your browser must support WebGPU. In Chrome or Edge, confirm `navigator.gpu`
is available — each lesson logs an error to the console if it isn't.
