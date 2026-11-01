# Component Portability and Oxenn Integration

**Status:** Adopted for the first integration path  
**Scope:** `DiabloNova/oxenn_components` as the source repository and `DiabloNova/oxenn` as the consumer repository.

This document records the repository-specific integration decision. It is not a claim that every existing component has already passed Oxenn's production build. Each component must still pass the consumer-side validation checklist before it is used in a product route.

## 1. Verified repository facts

The following values were read from the repositories' current `main` branches while preparing this contract.

| Concern | `oxenn_components` (source) | `oxenn` (consumer) |
|---|---|---|
| Next.js | `^15.2.0` | `16.4.2` |
| React / React DOM | `^19.0.0` | `19.2.4` |
| TypeScript | `^5.8.0` | `^5` |
| Package manager | npm scripts; no `packageManager` field | `pnpm@10.30.3` |
| Node requirement | Not explicitly pinned in `package.json` | `>=22` |
| CSS stack | Local CSS and CSS Modules | Tailwind CSS 4, PostCSS plugin, CSS Modules / regular CSS supported by the Next app |
| TypeScript alias | `@/* -> ./*` | `@/* -> ./src/*` |
| App structure | Showcase routes under `app/components/<slug>/` | Product routes under `src/app/`; reusable code under `src/components/` |
| Root package | `private: true`; standalone Next.js showcase app | `private: true`; product application |

The source repository's root package is an application, not a distributable component package. Installing the repository root as an npm/Git dependency would therefore couple Oxenn to the source app's Next.js setup and package manifest. That is not the desired integration boundary.

Oxenn already has the required React runtime and `lucide-react`, but its versions are not identical to the source app's versions. The source app's Next.js, lint, and development dependencies must not be copied into Oxenn just to consume a component.

## 2. Decision: distribute the `components/` directory with Git Subtree

For the current two-repository setup, use Git Subtree rather than publishing the source app as an npm package, copying files manually, or adding a submodule.

The source of truth remains:

```text
oxenn_components/
  components/
    <component-slug>/
      <Component>.tsx
      <component-local-styles>
      <assets and local helpers>
```

Showcase routes, navigation metadata, generated registries, and showcase-only assets remain outside this distribution boundary:

```text
oxenn_components/
  app/components/       # demos only; not imported into Oxenn
  generated/            # showcase navigation registry; not imported into Oxenn
  components/           # portable component source; exported
```

The consumer imports that source tree at:

```text
oxenn/
  src/components/
    oxenn-library/      # Git Subtree import of source components/
      <component-slug>/
```

This keeps the imported code away from existing Oxenn component paths, avoids filename collisions, retains a clear upstream boundary, and allows a later upstream update to be pulled without repeating manual copy operations. Oxenn uses its own route, layout, and navigation conventions; the source repository's demo pages are not product pages.

### Why not a standalone npm package yet?

A separately versioned package could be appropriate later, but there is no published package, registry configuration, or workspace package in the source repository today. The current need is reliable source transfer between two Git repositories. Git Subtree solves that without introducing a registry, release credentials, a second build pipeline, or a new runtime dependency. Revisit an npm package only when external consumers or independent semantic versioning justify that operational cost.

## 3. Publish the component subtree from the source repository

After component changes have been reviewed and merged into `oxenn_components/main`, update the local main branch and run:

```bash
git checkout main
git pull --ff-only origin main
bash scripts/publish-components-subtree.sh
```

The script creates a filtered Git history containing only `components/` and pushes it to the `oxenn-components-dist` branch. It requires the `git subtree` command to be installed, refuses to publish from a non-main branch or a dirty working tree, fetches `origin/main` (or the configured remote's `main`) and requires the local commit to match it exactly. The distribution branch is updated with a normal fast-forward-only push, not a force-push: the existing remote tip must be an ancestor of the generated subtree commit (or already equal to it). If the branch contains a manual edit, a bad publication, or any other divergent history, the push is rejected instead of overwriting that history; inspect and deliberately reconcile the branch rather than bypassing the rejection. For the same atomic push, the script also sends the unchanged source `main` commit as a no-op refspec guarded by `--force-with-lease`. That lease is only a concurrency check to ensure remote `main` has not moved since validation; it does not rewrite `main`.

The distribution branch is generated output. Do not edit it directly. Changes belong in normal component branches and are published only after those changes land on `main`.

## 4. First import into Oxenn

Run these commands from the Oxenn repository after the source distribution branch has been published. The destination prefix `src/components/oxenn-library` must not exist at all. `git subtree add` fails if the prefix exists, even when it is an empty directory. If the directory exists, remove it only after verifying that it contains no user work; do not use this command to overwrite an existing component directory:

```bash
git remote add oxenn-components https://github.com/DiabloNova/oxenn_components.git
git fetch oxenn-components oxenn-components-dist
git subtree add --prefix=src/components/oxenn-library oxenn-components oxenn-components-dist --squash
```

If the remote already exists, do not add it again. Verify its URL with `git remote -v`.

Example import:

```tsx
import OptionWheel from "@/components/oxenn-library/option-wheel/OptionWheel";
```

Use the actual component folder and exported symbol. A component should be integrated into a product route only after its consumer-side checks pass. Do not import or copy the source showcase page.

## 5. Pull upstream component updates into Oxenn

After additional component changes are merged into source `main` and the subtree distribution branch is published:

```bash
git fetch oxenn-components oxenn-components-dist
git subtree pull --prefix=src/components/oxenn-library oxenn-components oxenn-components-dist --squash
```

Review the resulting diff as a normal Oxenn change. Keep product-specific adapters, pages, translations, and navigation outside `src/components/oxenn-library`; this makes future subtree pulls predictable.

Do not resolve a subtree conflict by deleting the imported tree or force-resetting the prefix. Resolve the individual conflicting files, then run the consumer checks.

## 6. Component portability contract

Every component intended for reuse in Oxenn must satisfy these rules before it is considered integration-ready.

### Required source boundaries

- The component and all implementation-only helpers must live under its own `components/<slug>/` directory.
- Component source must not import from `app/`, showcase pages, `generated/`, or any other demo-only path.
- Avoid repository-root aliases such as `@/components/...`. Prefer imports relative to the component directory.
- Relative imports must stay inside the component directory. A component must not depend on a sibling component's private implementation; extract a shared primitive deliberately if one is needed.
- Keep all required images, shaders, fonts, audio, and other assets beside the component, or expose them through documented props. Never rely on an undocumented file in the source app's `public/` directory.
- Do not import Next.js APIs from a component unless the component genuinely requires Next.js and that dependency is explicitly approved for the consumer.

### React and browser behavior

- Export a typed public props interface/type for TypeScript components.
- Declare `'use client'` at the component entry when it uses hooks, browser APIs, event handlers, canvas/WebGL, audio, observers, or client-side state.
- Do not access `window`, `document`, `navigator`, or browser-only constructors at module evaluation time. Guard browser-only work and keep it inside client execution/effects.
- Treat React and React DOM as consumer-provided runtimes. Do not bundle a second React copy.
- Avoid relying on undocumented behavior of a particular Next.js version.

### Styling

- Prefer CSS Modules for component styles. They reduce global selector collisions and keep the component self-contained.
- Use CSS Modules (`*.module.css`) for component-owned styles and import them from the component entry. Do not import regular/global CSS from files under `components/`; Next.js App Router does not treat this reusable-source directory as a global stylesheet entry point. If a component truly requires global CSS, keep that stylesheet outside the subtree and import it from an appropriate file under the consumer's `src/app/` directory, documenting the required import. Scope any such global selectors to a component-specific root and never add generic selectors such as `button`, `body`, `h1`, or `:root`.
- Do not silently depend on product-wide design tokens, fonts, global resets, or theme variables. Either define safe component defaults or document the required token contract explicitly.
- Support reduced-motion preferences for non-essential animation and check focus-visible behavior for interactive components.
- Do not assume Tailwind classes are available in the source project or in the consumer. Tailwind may be used only when the component contract explicitly declares it as a consumer requirement.

### Dependencies and API

- Every external package imported by a component must be identified during integration review.
- Use a dependency already present in Oxenn when its API/version is compatible. Otherwise, request an explicit dependency decision; do not silently edit Oxenn's root `package.json` or lockfile as part of a source-only transfer.
- Do not copy the source app's dependency list wholesale.
- Keep backend calls, environment variables, authentication, persistence, and product-specific navigation outside generic UI components. Inject these through props or callbacks.
- Document optional assets, browser features, minimum container dimensions, and any required CSS imports.

## 7. Evidence from current components

These examples illustrate why the contract is necessary; they are not blanket approval for production integration.

| Component | Observed implementation | Portability notes |
|---|---|---|
| FloatingBottomNav | React client component, `lucide-react`, local CSS Module | Good isolation pattern. Verify icon exports against Oxenn's installed Lucide version. |
| Sidebar | React client component, `lucide-react`, local CSS Module | Good styling boundary. Product-specific navigation/data must continue to be injected through props. |
| FluidGlass | React client component, local regular CSS, WebGL2 and browser observers | Requires a client boundary and browser-capability/fallback testing. Keep its CSS selectors namespaced. |
| OptionWheel | React client component, React hooks, relative regular CSS, pointer/wheel/keyboard handlers, optional audio URL | Merged into `main`. Its current regular CSS import must be converted to a CSS Module (or moved to a documented `src/app/` global stylesheet import) before subtree integration. It still needs a build/render test inside the actual Oxenn app before product use. |

## 8. Consumer-side acceptance checklist

For each component selected for Oxenn:

1. Confirm all relative imports and assets resolve after subtree import.
2. Confirm every external package is already available or approved and installed explicitly.
3. Run `pnpm typecheck` and `pnpm lint` in Oxenn.
4. Run the production `pnpm build`; a component compiling in the source showcase is not sufficient evidence for Next.js 16.
5. Render the component from a real Oxenn App Router page and verify the server/client boundary.
6. Verify its CSS in both Oxenn themes and in Persian/English layouts where applicable.
7. Exercise keyboard, pointer/touch, focus, reduced-motion, resize, and browser fallback behavior relevant to the component.
8. Review the final Oxenn diff to ensure the subtree contains only upstream component source and product adapters remain outside it.

A component is **portable** only when source-boundary checks pass. It is **Oxenn-compatible** only after the consumer-side acceptance checklist passes.

## 9. Scope and safety

This contract does not change Oxenn, its dependencies, product routes, or navigation. Each component must meet the CSS Module/global stylesheet rule above before it is imported. The first import into Oxenn should be a separate, explicitly reviewed Oxenn change after the selected component's source PR has merged and the subtree distribution branch is published.
