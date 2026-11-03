# Fusion menu imagery

The menu uses 64 distinct images: the original 44 drink photos plus 20 photos added in November 2026 from the delivery-menu image collection (eight acai bowls, ten cold beverages, and two patty entries). Menu-board illustrations were not extracted or reused.

- `originals/`: full-resolution PNG masters, including copies of the five retained images.
- `*-320.webp` and `*-640.webp`: responsive website images.
- `imageSlug` in `menu-data.json` maps delivery-menu images to existing items without changing item names, prices, or anchor links. Full-resolution sources for the November additions are preserved in `output/menu-photos-2026-11-01/`.
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
