# Timeline

A client-side, scroll-driven timeline built with GSAP, SplitText, and Lenis.

## Consumer requirements

This component uses Tailwind CSS 4 utility classes. A consuming application must:

1. Install `tailwindcss@^4` and `@tailwindcss/postcss@^4` as development dependencies.
2. Configure PostCSS with the `@tailwindcss/postcss` plugin.
3. Import Tailwind's theme and utilities layers from the consuming app's global stylesheet:

   ```css
   @import "tailwindcss/theme.css" layer(theme);
   @import "tailwindcss/utilities.css" layer(utilities);
   ```

4. Ensure the Tailwind source scanner includes this component's TSX file when the component is outside the app's default source directory.

The source showcase app keeps this setup in its root `postcss.config.mjs` and `app/globals.css`; neither file is part of the distributable `components/` subtree.

## Runtime dependencies

- `gsap@^3.13.0` (including ScrollTrigger and SplitText)
- `@gsap/react@^2.1.2`
- `lenis@^1.3.17`

React and React DOM are provided by the consuming application.

## Accessibility and behavior

- The component observes `prefers-reduced-motion`; in that mode it skips SplitText/item reveal animations and disables Lenis wheel/touch interpolation.
- Animation contexts and SplitText instances are reverted when motion preferences or responsive layout breakpoints change.
- The component expects a sufficiently wide container and an image URL supplied through `imageUrl` (or its default placeholder).
- Import it from `@/components/effects/timeline` in the source showcase app, or use the relative path appropriate to the consuming project.
