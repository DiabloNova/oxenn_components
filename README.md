# Forme — Animated Sidebar

A reusable, responsive sidebar component inspired by the supplied reference: a slim icon rail expands into a layered navigation workspace with nested groups, hover states, and a secondary quick-access panel.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Component

```tsx
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout() {
  return <Sidebar defaultExpanded={false} onNavigate={(id, label) => console.log(id, label)} />;
}
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultExpanded` | `boolean` | `false` | Start with the full navigation open. |
| `onNavigate` | `(id: string, label: string) => void` | — | Called when a navigation or sub-navigation item is selected. |
| `className` | `string` | — | Optional class for the sidebar root. |

## Interaction details

- Starts collapsed and animates open/closed with a custom easing curve.
- Expand/collapse is available from the sparkle brand control and the chevron toggle.
- Main navigation items support active state and nested expandable groups.
- Secondary panel contains quick links, draft folders, and folder collections.
- Menu search filters primary navigation items.
- Keyboard focus is visible; icon controls have accessible labels.
- Respects `prefers-reduced-motion`.
- At mobile widths, the secondary panel is hidden while the primary panel remains usable.

## Stack

Next.js App Router · React · TypeScript · CSS Modules · lucide-react.

## License

MIT
