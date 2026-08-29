import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Gambo Starter',
  description: 'A TypeScript + WebGPU lesson scaffold',
  base: '/web-gpu/',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/web-gpu/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0b0b0f' }],
    ['meta', { property: 'og:title', content: 'Gambo Starter — TypeScript + WebGPU' }],
    ['meta', { property: 'og:description', content: 'A TypeScript + WebGPU lesson scaffold' }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/^(\s*)\/\/\s*!?\s*$/gm, '');
        },
      },
    ],
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Gambo Starter',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'Lessons', link: '/lessons/', activeMatch: '/lessons/' },
      { text: 'API Reference', link: '/api/', activeMatch: '/api/' },
      {
        text: 'Resources',
        items: [
          { text: 'WebGPU Spec', link: 'https://gpuweb.github.io/gpuweb/' },
          { text: 'WGSL Spec', link: 'https://gpuweb.github.io/gpuweb/wgsl/' },
          { text: 'WebGPU Fundamentals', link: 'https://webgpufundamentals.org/' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/gambo-starter/web-gpu',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Project Structure', link: '/guide/project-structure' },
            { text: 'Creating Lessons', link: '/guide/creating-lessons' },
            { text: 'Best Practices', link: '/guide/best-practices' },
          ],
        },
      ],
      '/lessons/': [
        {
          text: 'Lessons by Topic',
          items: [
            { text: 'Overview', link: '/lessons/' },
            { text: 'Fundamentals', link: '/lessons/fundamentals' },
            { text: 'Buffers', link: '/lessons/buffers' },
            { text: 'Matrix Math', link: '/lessons/matrix-math' },
            { text: 'Shaders', link: '/lessons/shaders' },
            { text: 'Textures', link: '/lessons/textures' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'WebGPU Init', link: '/api/webgpu-init' },
            { text: 'Buffers', link: '/api/buffers' },
            { text: 'Textures', link: '/api/textures' },
            { text: 'Pipelines', link: '/api/pipelines' },
            { text: 'Render Loop', link: '/api/render-loop' },
            { text: 'Math Utilities', link: '/api/math' },
            { text: 'Geometry', link: '/api/geometry' },
            { text: 'UI Components', link: '/api/ui' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/gambo-starter/web-gpu' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Gambo Starter — a TypeScript + WebGPU lesson scaffold',
    },

    editLink: {
      pattern: 'https://github.com/gambo-starter/web-gpu/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['wgpu-matrix', 'dat.gui'],
    },
  },
});
