# tools — asset pipeline scripts (run manually, not part of build)

These are plain Node ESM scripts. Run them from the repo root (they use `process.cwd()`).
`package.json` has no npm scripts for them.

| Script | What it does |
|---|---|
| `optimize-images.mjs` | Recursively finds jpg/jpeg/png/gif in `public/` and writes `public/optimized/<same subpath>/<name>-{small,medium,large}.webp` (480, 1024 and 1920 px wide). |
| `generate-blurhash.mjs` | Collects image URLs, writes 32px blurhashes to `app/_data/blurhash-data.json`. That JSON is currently **not consumed** anywhere. |
| `generate-favicon.mjs` | `public/logo.svg` → `public/logo.ico` (32×32). The favicon PNGs are referenced in `app/layout.tsx` metadata. |

## `public/` layout
- `public/images/`: source images. Project markdown references them as `/images/...`, and they can be resized
  on demand through `/api/images/...`.
- `public/optimized/**`: generated webp variants. `app/_data/projects-data.ts` references these directly
  (`/optimized/images/foo-medium.webp`). The generated files are committed.
- Root: `logo.svg`, `logo.ico`, `favicon-*.png`, `hero-blur.png`, plus some template leftovers
  (`playpex.jpg`, `project_image.png`).

## Related unused libs
`app/lib/image-optimization.ts`, `app/lib/image-utils.ts`, `app/lib/blurhash-utils.ts` and
`app/lib/blurhash-canvas.ts` duplicate this tooling as runtime helpers. **No module imports them.**
Only `app/lib/utils.ts` (`cn`) is live.
