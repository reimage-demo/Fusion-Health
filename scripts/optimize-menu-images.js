// Requires cwebp. Preserves all source PNGs and creates responsive WebP derivatives.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'menu-data.json'), 'utf8'));
let count = 0;
for (const item of data.sections.flatMap(section => section.items).filter(item => item.look || item.existing)) {
  const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  const original = path.join(root, 'assets/menu/originals', slug + '.png');
  if (item.existing && !fs.existsSync(original)) fs.copyFileSync(path.join(root, item.existing), original);
  if (!fs.existsSync(original)) continue;
  for (const width of [320,640]) {
    const destination = path.join(root, 'assets/menu', `${slug}-${width}.webp`);
    if (fs.existsSync(destination) && fs.statSync(destination).mtimeMs >= fs.statSync(original).mtimeMs) continue;
    execFileSync('cwebp', ['-quiet','-q','82','-resize',String(width),'0',original,'-o',destination]);
  }
  count++;
}
console.log(`Optimized ${count}/44 drink images.`);
