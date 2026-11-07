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
- **Gradient Waves:** `/components/gradient-waves` — the official React Bits GradientWaves JS/CSS source with WebGL2 rendering, pointer-driven lighting/parallax, and click-triggered swells.
- **Gradient Blinds:** `/components/gradient-blinds` — the official React Bits GradientBlinds JS/CSS source with WebGL2 satin slats, pointer spotlight, sway, and click-triggered ripples.
- **Topography:** `/components/topography` — the official React Bits Topography JS/CSS source with WebGL2 terrain contours, pointer-responsive sculpting, glow, and click-triggered pulses.
- **Glass Surface:** `/components/glass-surface` — adaptive frosted glass, SVG displacement filters, optional WebGL2 image refraction, and transparent-image silhouette rendering.
- **Branched Menu:** `/components/branched-menu` — animated tree navigation with expandable sections, SVG connector paths, and selection callbacks.
- **Gooey Nav:** `/components/gooey-nav` — liquid active-state navigation with particle transitions, WebGL2 rendering, and a CSS fallback.
- **Option Wheel:** `/components/option-wheel` — curved kinetic selector with pointer, wheel, and keyboard interaction.
- **Text Loop:** `/components/text-loop` — animated SVG text paths with configurable shapes, ribbons, drag momentum, hover pause, and scroll boost.
- **Fluid Glass:** `/components/fluid-glass` — a 3D refractive glass object with seven morphable shapes, pointer/drag interaction, image refraction, chromatic dispersion, and reduced-motion-aware WebGL2 rendering.
- **C Chart 23:** `/components/c-chart-23` — responsive Recharts radar chart with gradient fill, glow, and custom tooltips.

Open the hamburger menu on the home page to navigate to all component showcases.

## C Chart 23

The ReUI C Chart 23 example is adapted to this repository's component portability contract. Its reusable implementation lives in `components/c-chart-23/Chart23.tsx` and uses Recharts directly, with local card and tooltip styling rather than requiring shadcn `Card` or `ChartContainer` primitives.

Install the upstream registry item in a compatible shadcn project with:

```bash
pnpm dlx shadcn@latest add @reui/c-chart-23
```

For this repository's standalone implementation, Recharts is declared as a project dependency. The showcase is available at `/components/c-chart-23`.

## Reusing components in Oxenn

The component source is maintained independently from its showcase routes. See [Component Portability and Oxenn Integration](docs/COMPONENT_PORTABILITY.md) for the verified compatibility matrix, source contract, and Git Subtree workflow. After component changes are merged into `main`, publish the `components/` subtree with:

```bash
bash scripts/publish-components-subtree.sh
```

The script publishes only the reusable component source to `oxenn-components-dist`; it does not publish demo pages or change the Oxenn repository. Consumer-side validation is required before a component is used in the product.

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

## Gooey Nav

The component source is based on the official [React Bits GooeyNav JS/CSS registry item](https://github.com/DavidHDev/react-bits/blob/main/public/r/GooeyNav-JS-CSS.json). Install it in a compatible shadcn setup with:

```bash
pnpm dlx shadcn@latest add @react-bits/GooeyNav-JS-CSS
```

The reusable implementation lives in `components/gooey-nav/` and is demonstrated at `/components/gooey-nav`. It supports controlled or internal active state, light/dark themes, particle tuning, hover feedback, and a CSS fallback when WebGL2 is unavailable.

Use `ariaLabel` to name the navigation landmark; when a visible heading should provide the name, pass its id through `ariaLabelledBy` instead.

**Implementation note:** Gooey Nav intentionally retains the official React Bits `.jsx` + `.css` source format instead of converting the upstream source to TypeScript and CSS Modules. This keeps the WebGL implementation close to its published JS/CSS registry version; its global selectors are consistently namespaced with `.gooey-nav` to avoid collisions with other components. This is a documented source-format exception, like the JS/CSS adaptation already described for Glass Surface.
