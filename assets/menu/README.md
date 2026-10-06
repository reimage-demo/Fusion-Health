# Fusion menu imagery

The October 2026 menu uses 44 distinct drink images: 39 newly generated photographs and five retained website images. Menu-board illustrations were not extracted or reused.

- `originals/`: full-resolution PNG masters, including copies of the five retained images.
- `*-320.webp` and `*-640.webp`: responsive website images.
- `generation-prompts.json`: per-drink prompts, style reference, and source provenance.

The built-in image generator was used for new images. Each prompt specifies the latest recipe, drink appearance, and sparse ingredient props, while matching the existing branded cup, cream backdrop, soft lighting, and painted swirls. The kids’ image represents the strawberry banana option.

From the project root:

```sh
node scripts/optimize-menu-images.js
node scripts/build-menu.js
python3 scripts/check-menu.py
```

Image optimization requires `cwebp`. The site remains static HTML; it has no runtime build dependency. Change names, ingredients, prices, and favorites in `menu-data.json`, then rebuild the menu. Homepage featured content and ingredient references should be checked when recipes change.

New generations should use the existing website reference and be visually checked before replacing a master. Keep the original site assets, which are still used elsewhere.
