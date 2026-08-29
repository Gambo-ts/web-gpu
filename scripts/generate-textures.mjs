import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "public", "assets");

if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

function createFTexture() {
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext("2d");

  // Draw a colorful F pattern
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, 256, 256);

  // Draw F shape
  ctx.fillStyle = "#e94560";
  ctx.fillRect(50, 50, 40, 160); // vertical bar
  ctx.fillRect(50, 50, 120, 40); // top bar
  ctx.fillRect(50, 130, 80, 40); // middle bar

  // Add some noise/texture
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  return canvas.toBuffer("image/png");
}

function createCoinsTexture() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, 512, 512);

  // Draw coin-like circles
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 64 + col * 110;
      const y = 64 + row * 110;
      const radius = 40;

      // Coin gradient
      const gradient = ctx.createRadialGradient(x - 8, y - 8, 0, x, y, radius);
      gradient.addColorStop(0, "#ffd700");
      gradient.addColorStop(0.5, "#daa520");
      gradient.addColorStop(1, "#b8860b");

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner detail
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  return canvas.toBuffer("image/png");
}

function createNoodlesTexture() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f5e6c8";
  ctx.fillRect(0, 0, 512, 512);

  // Draw wavy noodle lines
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 20 + i * 24);
    for (let x = 0; x <= 512; x += 10) {
      const y = 20 + i * 24 + Math.sin(x * 0.02 + i) * 8;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(139, 105, 60, ${0.3 + Math.random() * 0.3})`;
    ctx.lineWidth = 3 + Math.random() * 3;
    ctx.stroke();
  }

  return canvas.toBuffer("image/png");
}

function createGraniteTexture() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext("2d");

  // Base color
  ctx.fillStyle = "#7a7a7a";
  ctx.fillRect(0, 0, 512, 512);

  // Add noise for granite effect
  const imageData = ctx.createImageData(512, 512);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 60;
    const base = 122;
    data[i] = Math.max(0, Math.min(255, base + noise));     // R
    data[i + 1] = Math.max(0, Math.min(255, base + noise * 0.8)); // G
    data[i + 2] = Math.max(0, Math.min(255, base + noise * 0.6)); // B
    data[i + 3] = 255; // A
  }

  ctx.putImageData(imageData, 0, 0);

  // Add some darker speckles
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(40,40,40,${Math.random() * 0.3})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }

  return canvas.toBuffer("image/png");
}

console.log("Generating placeholder textures...");

writeFileSync(join(assetsDir, "f-texture.png"), createFTexture());
console.log("✓ f-texture.png");

writeFileSync(join(assetsDir, "coins.jpg"), createCoinsTexture());
console.log("✓ coins.jpg");

writeFileSync(join(assetsDir, "noodles.jpg"), createNoodlesTexture());
console.log("✓ noodles.jpg");

writeFileSync(join(assetsDir, "Granite_paving_tileable_512x512.jpeg"), createGraniteTexture());
console.log("✓ Granite_paving_tileable_512x512.jpeg");

console.log("All textures generated!");