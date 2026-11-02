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
- **Option Wheel:** `/components/option-wheel` — curved kinetic selector with pointer, wheel, and keyboard interaction.
- **Text Loop:** `/components/text-loop` — animated SVG text paths with configurable shapes, ribbons, drag momentum, hover pause, and scroll boost.
- **Fluid Glass:** `/components/fluid-glass` — a 3D refractive glass object with seven morphable shapes, pointer/drag interaction, image refraction, chromatic dispersion, and reduced-motion-aware WebGL2 rendering.

Open the hamburger menu on the home page to navigate to all component showcases.

## Branched Menu

The component source is based on the supplied React Bits BranchedMenu JS/CSS example and is adapted to this repository's portability contract: its styles are a local CSS Module, and icons are passed as React nodes so the reusable component does not add a Hugeicons runtime dependency.

Install in a compatible shadcn / React Bits setup:

```bash
pnpm dlx shadcn@latest add @react-bits/BranchedMenu-JS-CSS
```

The source is checked into `components/branched-menu/` and demonstrated at `/components/branched-menu`.

```tsx
import { Download, Rocket, Settings2 } from "lucide-react";
import BranchedMenu from "@/components/branched-menu/BranchedMenu";

<BranchedMenu
  items={[
    {
      label: "Getting started",
      children: [
        { value: "install", label: "Installation", icon: <Download size={16} /> },
        { value: "quick", label: "Quick start", icon: <Rocket size={16} /> },
        { value: "config", label: "Configuration", icon: <Settings2 size={16} /> }
      ]
    },
    { label: "Components", children: [{ value: "buttons", label: "Buttons" }] }
  ]}
  defaultOpen={[0]}
  defaultActive="quick"
  onSelect={(value) => console.log("Selected:", value)}
  color="#f5f5f5"
  accentColor="#f5f5f5"
  lineColor="#3f3f46"
  width={240}
  rowHeight={36}
  indent={40}
  trunk={14}
  radius={10}
  lineWidth={1.5}
  fontSize={14}
  drawDuration={400}
  foldDuration={300}
/>
```

Use `onToggle(index, isOpen)` to observe section changes. The component supports multiple open sections through `defaultOpen`, manages its own active item, and reports selection through `onSelect`. For Hugeicons, wrap the icon data in your app's `HugeiconsIcon` component and pass the rendered element through `icon`. The component itself has no Hugeicons dependency.

## Glass Surface

The component is adapted from the supplied React Bits GlassSurface JS/CSS source and lives in `components/glass-surface/`. It is checked into this repository directly so the existing App Router project does not need a separate shadcn configuration. The showcase demonstrates SVG/frosted rendering, WebGL2 image refraction over a local backdrop, and transparent-image shape mapping. The WebGL renderer cleans up partially allocated GPU resources and falls back when WebGL2 or texture access is unavailable.

```jsx
import GlassSurface from "@/components/glass-surface/GlassSurface";

<GlassSurface width={496} height={62} borderRadius={57} distortionScale={130} displace={0.5} backgroundOpacity={0.1}>
  <span>Your content</span>
</GlassSurface>
```

The `backdrop` prop accepts an image, video, canvas, or React ref to one of those elements. Video backdrops update during playback; for a canvas backdrop, increment `backdropVersion` whenever its pixels change so the WebGL texture is refreshed. The `shape` prop accepts a transparent image path and derives its refractive silhouette from the image alpha channel. This repository keeps the implementation local, so the shadcn registry install command is not required here.

## Gradient Waves

The component source is taken from the official [React Bits GradientWaves JS/CSS registry item](https://github.com/DavidHDev/react-bits/blob/main/public/r/GradientWaves-JS-CSS.json). To install it in a compatible shadcn setup, React Bits documents this command:

```bash
pnpm dlx shadcn@latest add @react-bits/GradientWaves-JS-CSS
```

The component is checked into `components/gradient-waves/` so it remains locally owned and works with this repository's App Router showcase.

## Gradient Blinds

The component source is taken from the official [React Bits GradientBlinds JS/CSS registry item](https://github.com/DavidHDev/react-bits/blob/main/public/r/GradientBlinds-JS-CSS.json). To install it in a compatible shadcn setup:

```bash
pnpm dlx shadcn@latest add @react-bits/GradientBlinds-JS-CSS
```

The component is checked into `components/gradient-blinds/` and demonstrated at `/components/gradient-blinds`. It uses WebGL2 for the animated slats, pointer-following spotlight, and click ripples.

```jsx
import GradientBlinds from "@/components/gradient-blinds/GradientBlinds";

<div style={{ width: "100%", height: 600, position: "relative" }}>
  <GradientBlinds
    gradientColors={["#8b8788", "#215ab6"]}
    angle={20}
    blindCount={16}
    blindMinWidth={60}
    spotlightRadius={0.5}
    clickEffect="ripple"
    intro
  />
</div>
```


## Topography

The component source is taken from the official [React Bits Topography JS/CSS registry item](https://github.com/DavidHDev/react-bits/blob/main/public/r/Topography-JS-CSS.json). To install it in a compatible shadcn setup:

```bash
pnpm dlx shadcn@latest add @react-bits/Topography-JS-CSS
```

The component is checked into `components/topography/` and uses WebGL2 for animated terrain rendering. It supports reduced-motion preferences and pointer/click interactions.

## Text Loop

The checked-in component is an adaptation of the supplied React Bits TextLoop JS/CSS implementation. The shadcn command below installs the upstream registry item, not this repository's adapted version; use `components/text-loop/` when reusing the implementation maintained here.

```bash
pnpm dlx shadcn@latest add @react-bits/TextLoop-JS-CSS
```

The component is checked into `components/text-loop/` and showcased at `/components/text-loop`. It imports GSAP at runtime, so every consuming app must install a compatible version explicitly (for example, `pnpm add gsap@^3.13.0`). The GSAP dependency in this repository's `package.json` supports the local showcase and is not transferred automatically with the component subtree. `ribbonColor` and `crossColor` accept CSS color values (including hex, named, `rgb()`, and `hsl()` colors); the crossing ribbon uses `color-mix()` to lighten its stroke for a contrasting dark text overlay. The component stylesheet is a local CSS Module for safe subtree reuse.

```tsx
import TextLoop from "@/components/text-loop/TextLoop";

<TextLoop
  text=" OXENN ✦ AI ✦ SEO ✦ AEO ✦ GEO "
  shape="line"
  speed={90}
  direction="forward"
  separator="✦"
  curviness={126}
  fontSize={46}
  fontWeight={800}
  ribbon
  ribbonColor="#5227FF"
  ribbonWidth={86}
  draggable
  pauseOnHover
/>
```


## Floating bottom navigation

```tsx
import FloatingBottomNav from "@/components/floating-bottom-nav/FloatingBottomNav";

export default function AppShell() {
  return (
    <FloatingBottomNav
      initialActive="home"
      onNavigate={(destination) => console.log(destination)}
      onCreateTask={(title) => console.log("Create task:", title)}
    />
  );
}
```

The component starts with Home selected. Clicking a destination animates the active pill and label; the coral plus opens an accessible quick-task dialog. The component owns no backend or persistence: pass `onCreateTask` to connect it to your task system.

## Existing sidebar

```tsx
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout() {
  return <Sidebar defaultExpanded={false} onNavigate={(id, label) => console.log(id, label)} />;
}
```

## Fluid Glass

The component source is based on the official [React Bits FluidGlass JS/CSS registry item](https://github.com/DavidHDev/react-bits/blob/main/public/r/FluidGlass-JS-CSS.json). To install it in a compatible shadcn setup, React Bits documents:

```bash
pnpm dlx shadcn@latest add @react-bits/FluidGlass-JS-CSS
```

The component is checked into `components/fluid-glass/` and is demonstrated at `/components/fluid-glass`. The showcase uses a local SVG texture so image refraction works without a third-party asset host.

```tsx
import FluidGlass from "@/components/fluid-glass/FluidGlass";

export default function FluidGlassExample() {
  return (
    <div style={{ width: "100%", height: 600, position: "relative" }}>
      <FluidGlass
        text="AEO/ GEO/ SEO"
        src="/fluid-glass-hero.svg"
        shape="pill"
        size={180}
        refraction={0.6}
        dispersion={0.4}
        interaction="follow"
        tint={0.25}
        reflection={1}
        shadow={0.5}
        elevation={0.4}
        idle
        morphOnClick
        intro
      />
    </div>
  );
}
```

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
