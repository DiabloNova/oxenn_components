# shadcn/ui and Tailwind CSS setup

## Current repository state

The repository already uses Next.js, React, and TypeScript. Existing examples use CSS Modules and regular CSS. Tailwind CSS and the shadcn/ui CLI configuration were not present on the inspected `main` branch.

The workflow blueprint is self-contained and uses scoped CSS plus React Flow's stylesheet. It does not require Tailwind or shadcn runtime components. Its shared source file is placed at `components/ui/interactive-workflow-blueprint.tsx` to establish the conventional shadcn-compatible UI component location without changing the existing styling pipeline.

## Recommended setup when adopting Tailwind/shadcn

1. Make this a separate, reviewed infrastructure change; confirm the package manager and deployment build before changing global styles.
2. For Next.js App Router, follow the official Tailwind guide: install `tailwindcss`, `@tailwindcss/postcss`, and `postcss`; configure the Tailwind PostCSS plugin; add `@import \"tailwindcss\";` to `app/globals.css`; then verify development and production builds before migrating CSS Modules.
3. Initialize shadcn/ui with `npx shadcn@latest init`. Select the existing App Router, global stylesheet, CSS variables, and import alias settings. Review generated `components.json` instead of overwriting project configuration blindly.
4. Set the component alias to `@/components` and UI directory to `components/ui`. The existing TypeScript alias `@/*` already resolves from the repository root.
5. Add shadcn primitives incrementally when needed. Do not bulk-convert existing components as part of this integration.

Official references:
- https://tailwindcss.com/docs/installation/framework-guides/nextjs
- https://ui.shadcn.com/docs/installation/next
- https://ui.shadcn.com/docs/cli
