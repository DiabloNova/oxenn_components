# Contribution Skyline

## Consumer requirements

- React 19 and TypeScript.
- Tailwind CSS v4 must be configured in the consuming application; the component uses Tailwind utility classes for layout, spacing, typography, responsive behavior, and interaction states.
- Install the component runtime dependencies `framer-motion` and `lucide-react`.
- Import the component from `@/components/ui/contribution-skyline`.

The showcase app configures Tailwind v4 through `postcss.config.mjs` and `app/globals.css`. Consumers copying only the `components/` subtree must configure Tailwind v4 and include the component source in Tailwind's content/source detection.

## Accessibility and runtime behavior

The chart supports keyboard day navigation, both view buttons are keyboard reachable, reduced-motion preferences, and optional Web Audio feedback. Audio is unlocked only after user interaction and its AudioContext is closed when the component unmounts.
