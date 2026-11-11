# Dependency security overrides

These root-level npm overrides are intentionally narrow workarounds for vulnerable transitive dependencies in the current compatible Next.js 15 and ESLint toolchain.

- `next > postcss: ^8.5.32` replaces the older PostCSS version pinned by the current Next.js 15 release. The audited vulnerable range ends at 8.5.22.
- `@typescript-eslint/typescript-estree > minimatch: ^11.0.1` replaces the vulnerable 10.x copy used by typescript-estree. The advisory's patched release starts at 11.0.1. This override is scoped to that dependency path rather than applied globally, because other ESLint packages resolve older minimatch major versions with different compatibility requirements.

Do not remove either override until the corresponding upstream dependency declares a patched range and a fresh lockfile audit confirms that the vulnerable versions are no longer installed. Keep the overrides scoped; do not replace them with a global minimatch override.
