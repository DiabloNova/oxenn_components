# Timeline

A reusable timeline with a scroll-linked horizontal presentation on larger screens and a normal vertical reading layout on small screens or when reduced motion is requested.

## Public API

Pass the events through the required `items` prop. The component renders them in the supplied order; keep that array in chronological order when presenting a history.

Each `TimelineItem` requires a stable, unique `id`, a visible `date`, a `title`, and a `description`. An optional `dateTime` value is forwarded to the semantic HTML `time` element (for example, `2026-05`).

The exported `TimelineProps` and `TimelineItem` types define the public TypeScript contract. Optional props configure the heading, period label, colors, image, and text direction.

## Styling and dependencies

Component styles are isolated in `timeline.module.css`; no Tailwind configuration, global stylesheet changes, or global selectors are required.

Runtime dependencies:

- `gsap@^3.13.0`
- `@gsap/react@^2.1.2`

React and React DOM are provided by the consuming application. Lenis is intentionally not managed by this component: the host application owns document-level scrolling and may integrate its own scroll provider when required.

## Motion and responsive behavior

- On larger screens, GSAP ScrollTrigger pins the component viewport and translates the event track in proportion to document scrolling.
- On screens up to 767px wide, events use a vertical layout and native document scrolling.
- When `prefers-reduced-motion: reduce` is active, the component uses a vertical, unpinned layout and creates no GSAP scroll animation.
- Responsive and motion-preference changes revert the existing GSAP context before a new layout is initialized.
- The component does not assume that it owns the page scroll container.

## Example

```tsx
import Timeline, { type TimelineItem } from "@/components/effects/timeline";

const events: TimelineItem[] = [
  {
    id: "launch",
    date: "March 2026",
    dateTime: "2026-03",
    title: "Launch",
    description: "The first public release is available.",
  },
];

export function ProjectHistory() {
  return <Timeline title="Project history" items={events} />;
}
```
