#!/usr/bin/env node
// Simple WebP generator for heavy images (banners, modals, backgrounds)
// Usage: npm run generate:webp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PROJECT_ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'images');

const CANDIDATES = [
  'gpcmq-30-1030x687.jpg', // hero bg (legacy)
  'bannieres web - boutique_boutique-bigbox-fr_qc.png',
  'bannieres web - boutique_boutique-bigbox-en_qc.png',
  'concours_ekoi_fr.jpg',
  'concours_ekoi_en.jpg',
  'concoursedika__300x250-fr.png',
  'concoursedika__300x250-en.png',
  'meilleurs_endroits_qc_fr.png',
  'meilleurs_endroits_qc_en.png',
  'encan_FR_2025.png',
  'encan_EN_2025.png'
];

async function toWebp(inputPath, quality = 80) {
  const ext = path.extname(inputPath);
  const base = inputPath.slice(0, -ext.length);
  const outPath = base + '.webp';

  if (fs.existsSync(outPath)) {
    console.log('[skip] already exists:', path.relative(PROJECT_ROOT, outPath));
    return;
  }

  console.log('[webp] ->', path.relative(PROJECT_ROOT, outPath));
  await sharp(inputPath)
    .webp({ quality, effort: 5 })
    .toFile(outPath);
}

(async function main() {
  try {
    for (const rel of CANDIDATES) {
      const abs = path.join(IMAGES_DIR, rel);
      if (!fs.existsSync(abs)) {
        console.warn('[missing]', rel);
        continue;
      }
      await toWebp(abs, 80);
    }
    console.log('Done.');
  } catch (e) {
    console.error('Error generating webp:', e);
    process.exit(1);
  }
})();


