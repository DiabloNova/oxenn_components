import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const registryModule = await import("../scripts/generate-component-registry.mjs").catch(() => ({}));
const { discoverComponents, renderRegistry } = registryModule;

function withComponents(run) {
  const root = mkdtempSync(path.join(os.tmpdir(), "oxenn-registry-"));
  const componentsDir = path.join(root, "app", "components");
  mkdirSync(componentsDir, { recursive: true });
  try {
    run(componentsDir);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function addPage(componentsDir, slug, metadata) {
  const directory = path.join(componentsDir, slug);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "page.tsx"), "export default function Page() { return null; }\n");
  if (metadata !== undefined) {
    writeFileSync(path.join(directory, "component.json"), JSON.stringify(metadata));
  }
}

function addRawMetadataPage(componentsDir, slug, metadata) {
  const directory = path.join(componentsDir, slug);
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "page.tsx"), "export default function Page() { return null; }\n");
  writeFileSync(path.join(directory, "component.json"), metadata);
}

test("discovers only direct component routes and applies metadata with stable ordering", () => {
  assert.equal(typeof discoverComponents, "function", "generator must export discoverComponents");
  withComponents((componentsDir) => {
    addPage(componentsDir, "zeta-panel", { title: "Zeta Panel", icon: "Layers3", order: 20 });
    addPage(componentsDir, "alpha-view", { title: "Alpha View", icon: "Waves", order: 10, navigation: false });
    mkdirSync(path.join(componentsDir, "not-a-route"));
    mkdirSync(path.join(componentsDir, "not-a-file-route", "page.tsx"), { recursive: true });
    mkdirSync(path.join(componentsDir, "nested", "child"), { recursive: true });
    writeFileSync(path.join(componentsDir, "nested", "child", "page.tsx"), "export default function Page() { return null; }\n");

    assert.deepEqual(discoverComponents(componentsDir), [
      { slug: "alpha-view", href: "/components/alpha-view", title: "Alpha View", icon: "Waves", order: 10, navigation: false },
      { slug: "zeta-panel", href: "/components/zeta-panel", title: "Zeta Panel", icon: "Layers3", order: 20, navigation: true },
    ]);
  });
});

test("uses readable defaults when component metadata is omitted", () => {
  assert.equal(typeof discoverComponents, "function", "generator must export discoverComponents");
  withComponents((componentsDir) => {
    addPage(componentsDir, "floating-bottom_nav");
    assert.deepEqual(discoverComponents(componentsDir), [
      { slug: "floating-bottom_nav", href: "/components/floating-bottom_nav", title: "Floating Bottom Nav", icon: "Blocks", order: 1000, navigation: true },
    ]);
  });
});

test("rejects invalid JSON component metadata", () => {
  assert.equal(typeof discoverComponents, "function", "generator must export discoverComponents");
  withComponents((componentsDir) => {
    addRawMetadataPage(componentsDir, "invalid-json", '{"title": "Broken",');
    assert.throws(() => discoverComponents(componentsDir), /Invalid JSON/);
  });
});

test("rejects unsupported metadata fields and invalid field types", () => {
  assert.equal(typeof discoverComponents, "function", "generator must export discoverComponents");

  const invalidCases = [
    { slug: "unsupported-field", metadata: { title: "Invalid", unexpected: true }, message: /unsupported.*unexpected/i },
    { slug: "invalid-title", metadata: { title: 42 }, message: /title.*non-empty string/i },
    { slug: "invalid-icon", metadata: { icon: 42 }, message: /icon.*non-empty string/i },
    { slug: "invalid-order", metadata: { order: "first" }, message: /order.*finite number/i },
    { slug: "invalid-navigation", metadata: { navigation: "yes" }, message: /navigation.*boolean/i },
  ];

  for (const { slug, metadata, message } of invalidCases) {
    withComponents((componentsDir) => {
      addPage(componentsDir, slug, metadata);
      assert.throws(() => discoverComponents(componentsDir), message, slug);
    });
  }
});

test("renders deterministic TypeScript output from the registry entries", () => {
  assert.equal(typeof renderRegistry, "function", "generator must export renderRegistry");
  const entries = [{ slug: "radar", href: "/components/radar", title: "Radar", icon: "Radar", order: 30, navigation: true }];
  const first = renderRegistry(entries);
  assert.equal(first, renderRegistry(entries));
  assert.match(first, /export const componentRegistry/);
  assert.match(first, /"\/components\/radar"/);
  assert.match(first, /"navigation": true/);
});
