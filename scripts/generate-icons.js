import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Source SVG with white stroke (#FFFFFF) on deep charcoal background (#161820)
// Original viewBox is 0 0 24 24, centered with comfortable padding
const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#161820"/>
  <g transform="translate(96, 96) scale(13.3333)" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M10 2v2"/>
    <path d="M14 2v4"/>
    <path d="M17 2a1 1 0 0 1 1 1v9h-6V7h6"/>
    <path d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), baseSvg);

const sizes = [16, 32, 48, 128];

async function generatePngs() {
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon${size}.png`);
    await sharp(Buffer.from(baseSvg))
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    console.log(`Generated: ${outputPath} (${size}x${size})`);
  }
}

generatePngs().then(() => {
  console.log('All icon PNGs successfully generated!');
}).catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
