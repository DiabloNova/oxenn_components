# Oxenn Components

Reusable, responsive UI components built with Next.js App Router, React, TypeScript, CSS Modules, and lucide-react.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Component showcase

- **Home:** `/` — animated collapsible sidebar.
- **Floating bottom navigation:** `/components/floating-bottom-nav` — floating glass dock with active-item expansion, hover feedback, and a quick-create task dialog.
- **Gradient Waves:** `/components/gradient-waves` — the official React Bits GradientWaves JS/CSS source with WebGL2 rendering, pointer-driven lighting/parallax, and click-triggered swells.
- **Fluid Glass:** `/components/fluid-glass` — a 3D refractive glass object with seven morphable shapes, pointer/drag interaction, image refraction, chromatic dispersion, and reduced-motion-aware WebGL2 rendering. The showcase uses a violet horizon, `#79d3f9` waves, and pearl crests.

Open the hamburger menu on the home page to navigate to the Floating Bottom Navigation, Gradient Waves, and Fluid Glass showcases.

## Gradient Waves

The component source is taken from the official [React Bits GradientWaves JS/CSS registry item](https://github.com/DavidHDev/react-bits/blob/main/public/r/GradientWaves-JS-CSS.json). To install it in a compatible shadcn setup, React Bits documents this command:

```bash
pnpm dlx shadcn@latest add @react-bits/GradientWaves-JS-CSS
```

The component is checked into `components/gradient-waves/` so it remains locally owned and works with this repository's App Router showcase.

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

```jsx
import FluidGlass from "@/components/fluid-glass/FluidGlass";

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
```
## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## License

MIT
