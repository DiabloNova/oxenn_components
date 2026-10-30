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
- **Gradient Waves:** `/components/gradient-waves` — the official React Bits GradientWaves JS/CSS source with WebGL2 rendering, pointer-driven lighting/parallax, and click-triggered swells. The showcase uses a violet horizon, `#79d3f9` waves, and pearl crests.
- **Glass Surface:** `/components/glass-surface` — adaptive frosted glass, SVG displacement filters, optional WebGL2 image refraction, and transparent-image silhouette rendering.

Open the hamburger menu on the home page to navigate to all component showcases.

## Glass Surface

The component is adapted from the supplied React Bits GlassSurface JS/CSS source and lives in `components/glass-surface/`. It is checked into this repository directly so the existing App Router project does not need a separate shadcn configuration. The showcase demonstrates SVG/frosted rendering, WebGL2 image refraction over a local backdrop, and transparent-image shape mapping. The WebGL renderer cleans up partially allocated GPU resources and falls back when WebGL2 or texture access is unavailable.

```jsx
import GlassSurface from "@/components/glass-surface/GlassSurface";

<GlassSurface width={496} height={62} borderRadius={57} distortionScale={130} displace={0.5} backgroundOpacity={0.1}>
  <span>Your content</span>
</GlassSurface>
```

The `backdrop` prop accepts an image, video, canvas, or React ref to one of those elements. The `shape` prop accepts a transparent image path and derives its refractive silhouette from the image alpha channel.

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

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## License

MIT
