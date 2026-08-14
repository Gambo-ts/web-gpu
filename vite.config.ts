import { defineConfig } from "vite";
import { globSync } from "glob";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// Every lesson lives at lessons/<topic>/<name>/index.html — build them all
// as separate multi-page entry points so `npm run build` produces a full
// static export of the Gambo Starter lesson set, grouped by topic.
const lessonEntries = Object.fromEntries(
  globSync("lessons/*/*/index.html").map((file) => {
    const parts = file.split(/[\\/]/);
    const topic = parts[1];
    const name = parts[2];
    return [`${topic}/${name}`, fileURLToPath(new URL(file, import.meta.url))];
  })
);

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...lessonEntries,
      },
    },
  },
});
