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

All fields are optional. The title defaults to a title-cased version of the folder name, with hyphens and underscores converted to spaces; the icon defaults to the generic `Blocks` icon, the order defaults to `1000`, and the page is shown in navigation. Lower order values sort first. Set `navigation` to `false` to keep a route available without listing it in the home menu. Icons are resolved from the small allowlist in `app/page.tsx`; unknown names safely fall back to `Blocks`.

The generated file `generated/component-registry.ts` is committed so TypeScript and CI always have a stable input. Regenerate it after adding/removing a route or changing metadata:

```bash
npm run generate:registry
npm run check:registry
npm run test:registry
```

CI verifies that the committed registry matches the current route folders and metadata. Do not edit the generated file manually.

## Component showcase

- **Home:** `/` — animated collapsible sidebar.
- **Floating bottom navigation:** `/components/floating-bottom-nav` — floating glass dock with active-item expansion, hover feedback, and a quick-create task dialog.
- **Gradient Waves:** `/components/gradient-waves` — WebGL2 rendering, pointer-driven lighting/parallax, and click-triggered swells.
- **Aurora:** `/components/aurora` — layered color ramps, pointer response, intro reveal, and light-mode rendering.
- **Micro Slats:** `/components/micro-slats` — WebGL2 slat ocean with wave presets and pointer splashes.
- **Gradient Blinds:** `/components/gradient-blinds` — WebGL2 satin slats, pointer spotlight, sway, and click-triggered ripples.
- **Topography:** `/components/topography` — WebGL2 terrain contours, pointer-responsive sculpting, glow, and click-triggered pulses.
- **Glass Surface:** `/components/glass-surface` — adaptive frosted glass, SVG displacement filters, and optional WebGL2 image refraction.
- **Branched Menu:** `/components/branched-menu` — animated tree navigation with expandable sections and SVG connector paths.
- **Gooey Nav:** `/components/gooey-nav` — liquid active-state navigation with particle transitions and a CSS fallback.
- **Option Wheel:** `/components/option-wheel` — curved kinetic selector with pointer, wheel, and keyboard interaction.
- **Text Loop:** `/components/text-loop` — animated SVG text paths with drag momentum, hover pause, and scroll boost.
- **Fluid Glass:** `/components/fluid-glass` — refractive glass object with morphable shapes, pointer/drag interaction, and reduced-motion-aware WebGL2 rendering.
- **Lanyard:** `/components/lanyard` — physics-driven 3D ID badge with drag-and-release interaction.
- **Finance Bento:** `/components/finance-bento` — responsive personal-finance dashboard with net-worth history, asset allocation, portfolio KPIs, cash flow, crypto sparklines, weekly stock volume, payments, and savings goals.
- **Marketing Feature Bento:** `/components/marketing-feature-bento` — responsive six-column marketing grid with animated trace waterfalls, replay scrubber, alert stack, cost histogram, code snippet, keyboard shortcuts, and redaction illustration.

Open the hamburger menu on the home page to navigate to all component showcases.

## C Chart 23

The ReUI C Chart 23 example is adapted to this repository's component portability contract. Its reusable implementation lives in `components/c-chart-23/Chart23.tsx` and uses Recharts directly, with local card and tooltip styling rather than requiring shadcn `Card` or `ChartContainer` primitives.

## Reusing components in Oxenn

The component source is maintained independently from its showcase routes. See [Component Portability and Oxenn Integration](docs/COMPONENT_PORTABILITY.md) for the verified compatibility matrix, source contract, and Git Subtree workflow.

## Quality checks

```bash
npm run check:registry
npm run test:registry
npm test
npm run lint
npm run typecheck
npm run build
```

## License

MIT
