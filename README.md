# Oxenn Components

Reusable, responsive UI components built with Next.js App Router, React, TypeScript, CSS Modules, and lucide-react.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Automatic component navigation

The home page navigation is generated from the App Router component showcases. To add a new item, create a route at `app/components/<slug>/page.tsx`; the registry generator discovers it automatically during `npm run dev` and `npm run build`. Component PRs do not need to edit `app/page.tsx` to add a menu link.

Optionally add `app/components/<slug>/component.json` to customize its navigation entry:

```json
{
  "title": "Radar",
  "icon": "Radar",
  "order": 50,
  "navigation": true
}
```

All fields are optional. Defaults are derived from the folder name, use the generic `Blocks` icon, sort after explicitly ordered entries (`1000`), and show the page in navigation. Set `navigation` to `false` to keep a route available without listing it in the home menu. Icons are resolved from the small allowlist in `app/page.tsx`; unknown names safely fall back to `Blocks`.

The generated file `generated/component-registry.ts` is committed so TypeScript and CI always have a stable input. Regenerate it after adding/removing a route or changing metadata:

```bash
npm run generate:registry
npm run check:registry
npm run test:registry
```

CI verifies that the committed registry matches the current route folders and metadata. Do not edit the generated file manually.

## Component showcases

- **Home:** `/` — animated collapsible sidebar showcase.
- **Floating bottom navigation:** `/components/floating-bottom-nav` — floating glass dock with active-item expansion, hover feedback, and a quick-create task dialog.
- **Gradient Waves:** `/components/gradient-waves` — React Bits GradientWaves with WebGL2 rendering, pointer-driven lighting/parallax, and click-triggered swells.
- **Glass Surface:** `/components/glass-surface` — adaptive frosted glass, SVG displacement filters, optional WebGL2 refraction, and transparent-image silhouette rendering.
- **Topography:** `/components/topography` — WebGL2 terrain contours with pointer-responsive sculpting, glow, and click-triggered pulses.

## Quality checks

```bash
npm run check:registry
npm run test:registry
npm run lint
npm run typecheck
npm run build
```

## License

MIT
