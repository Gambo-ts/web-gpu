import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Gambo Starter",
  description: "A TypeScript + WebGPU lesson scaffold",
  base: "/web-gpu/",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/guide/getting-started" },
      { text: "Lessons", link: "/lessons/" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Project Structure", link: "/guide/project-structure" },
          { text: "Lessons", link: "/lessons/" },
        ],
      },
      {
        text: "Lessons by Topic",
        items: [
          { text: "Fundamentals", link: "/lessons/fundamentals" },
          { text: "Buffers", link: "/lessons/buffers" },
          { text: "Matrix Math", link: "/lessons/matrix-math" },
          { text: "Shaders", link: "/lessons/shaders" },
          { text: "Textures", link: "/lessons/textures" },
        ],
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Gambo Starter — a TypeScript + WebGPU lesson scaffold",
    },
  },
});
