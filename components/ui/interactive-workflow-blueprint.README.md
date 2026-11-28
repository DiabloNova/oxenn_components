# Interactive Workflow Blueprint

## Consumer requirements

- React 19 and TypeScript.
- `@xyflow/react` (React Flow v12) as a consumer dependency.
- Import `@xyflow/react/dist/style.css` from an App Router page or layout; do not move that global stylesheet import into the reusable `components/` subtree.
- Component-owned styles are in `interactive-workflow-blueprint.module.css` and are imported by the component. No Tailwind or shadcn runtime components are required.

The component is local-only: it edits an in-memory graph and exports JSON; it does not connect to external services. `onChange` is emitted for graph edits, not React Flow selection or measurement updates.
