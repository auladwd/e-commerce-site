import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="45%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Squircle Background -->
  <rect x="16" y="16" width="480" height="480" rx="124" fill="url(#bgGrad)" />
  
  <!-- Subtle Inner Border -->
  <rect x="24" y="24" width="464" height="464" rx="116" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="6" />

  <!-- Bag Icon Group with Shadow -->
  <g filter="url(#dropShadow)">
    <!-- Bag Handle -->
    <path
      d="M192 186 V150 C192 114.65 220.65 86 256 86 C291.35 86 320 114.65 320 150 V186"
      fill="none"
      stroke="#ffffff"
      stroke-width="32"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Bag Main Body -->
    <path
      d="M136 186 C136 177.16 143.16 170 152 170 H360 C368.84 170 376 177.16 376 186 L392 386 C393 398.5 383.2 409 370.6 409 H141.4 C128.8 409 119 398.5 120 386 Z"
      fill="#ffffff"
    />

    <!-- Stylized 'S' & Bag Fold inside bag -->
    <!-- Curved Handle Groove Cutout -->
    <path
      d="M204 220 C204 248.7 227.3 272 256 272 C284.7 272 308 248.7 308 220"
      fill="none"
      stroke="#059669"
      stroke-width="18"
      stroke-linecap="round"
    />

    <!-- Modern Dynamic 'S' Symbol in Bag Center -->
    <path
      d="M276 295 C250 286 226 298 226 316 C226 344 286 332 286 360 C286 376 264 384 242 377"
      fill="none"
      stroke="#059669"
      stroke-width="20"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Little Sparkle / Star at top right of the bag -->
    <path
      d="M344 140 L350 156 L366 162 L350 168 L344 184 L338 168 L322 162 L338 156 Z"
      fill="#fef08a"
    />
  </g>
</svg>`;

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

async function run() {
  const root = process.cwd();
  const publicDir = path.join(root, 'public');
  const appDir = path.join(root, 'src', 'app');

  // Save SVG
  const svgBuffer = Buffer.from(svgContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgBuffer);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgBuffer);
  console.log('Saved icon.svg to public/ and src/app/');

  // Generate PNG sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngs = {};
  for (const size of sizes) {
    pngs[size] = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    console.log(`Generated ${size}x${size} PNG`);
  }

  // Save Apple touch icon (180x180)
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngs[180]);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), pngs[180]);
  console.log('Saved apple-touch-icon.png');

  // Save standard sizes in public
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), pngs[192]);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), pngs[512]);

  // Generate ICO (16, 32, 48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: pngs[16] },
    { width: 32, height: 32, buffer: pngs[32] },
    { width: 48, height: 48, buffer: pngs[48] },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Saved favicon.ico to public/ and src/app/');

  // Also create a webmanifest
  const manifest = {
    name: "স্মার্টশপ বাংলাদেশ | SmartShop BD",
    short_name: "SmartShop BD",
    description: "সেরা দামে সেরা গ্যাজেট ও লাইফস্টাইল পণ্য, সারা দেশে ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারি।",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Saved site.webmanifest');
}

run().catch(console.error);
