import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsxRuntime from "react/jsx-runtime";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = path.join(root, "components/c-chart-23/Chart23.tsx");
const componentStylesPath = path.join(root, "components/c-chart-23/Chart23.module.css");
const showcasePath = path.join(root, "app/components/c-chart-23/page.tsx");
const showcaseMetadataPath = path.join(root, "app/components/c-chart-23/component.json");
const registryPath = path.join(root, "generated/component-registry.ts");
const componentSource = readFileSync(componentPath, "utf8");
const compiledComponent = ts.transpileModule(componentSource, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

function createRechartsMocks() {
  let tooltipProps;

  const recharts = {
    PolarAngleAxis: () => null,
    PolarGrid: () => null,
    Radar: (props) =>
      jsxRuntime.jsx("circle", {
        "data-animation-active": String(props.isAnimationActive),
        cx: 0,
        cy: 0,
        r: 1,
      }),
    RadarChart: ({ data, children }) =>
      jsxRuntime.jsx("svg", {
        "data-chart-size": String(data.length),
        "data-first-skill": data[0]?.skill,
        children,
      }),
    ResponsiveContainer: ({ width, height, children }) =>
      jsxRuntime.jsx("div", {
        "data-responsive-width": String(width),
        "data-responsive-height": String(height),
        children,
      }),
    Tooltip: (props) => {
      tooltipProps = props;
      return null;
    },
  };

  return {
    recharts,
    getTooltipProps: () => tooltipProps,
  };
}

function loadPattern({ reactModule = React, browserWindow } = {}) {
  const componentModule = { exports: {} };
  const mocks = createRechartsMocks();
  const styles = new Proxy({}, { get: (_target, key) => String(key) });

  vm.runInNewContext(compiledComponent, {
    module: componentModule,
    exports: componentModule.exports,
    window: browserWindow,
    require(specifier) {
      if (specifier === "react") return reactModule;
      if (specifier === "react/jsx-runtime") return jsxRuntime;
      if (specifier === "recharts") return mocks.recharts;
      if (specifier === "./Chart23.module.css") return styles;
      throw new Error(`Unexpected import: ${specifier}`);
    },
  });

  return {
    Pattern: componentModule.exports.Pattern,
    recharts: mocks.recharts,
    getTooltipProps: mocks.getTooltipProps,
  };
}

function findElement(node, type) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findElement(child, type);
      if (match) return match;
    }
    return null;
  }

  if (!node || typeof node !== "object") return null;
  if (node.type === type) return node;

  return findElement(node.props?.children, type);
}

test("renders the existing defaults and disables animation during server rendering", () => {
  const { Pattern } = loadPattern();
  const html = renderToStaticMarkup(React.createElement(Pattern));

  assert.match(html, /Skill Assessment/);
  assert.match(html, /Team proficiency across key areas/);
  assert.match(html, /data-chart-size="6"/);
  assert.match(html, /data-first-skill="Frontend"/);
  assert.match(html, /data-animation-active="false"/);
});

test("accepts custom data, title, and description without changing the defaults", () => {
  const { Pattern } = loadPattern();
  const html = renderToStaticMarkup(
    React.createElement(Pattern, {
      data: [{ skill: "AEO", score: 81 }],
      title: "Visibility profile",
      description: "Current visibility score",
    }),
  );

  assert.match(html, /Visibility profile/);
  assert.match(html, /Current visibility score/);
  assert.match(html, /data-chart-size="1"/);
  assert.match(html, /data-first-skill="AEO"/);
  assert.match(html, /data-animation-active="false"/);
});

test("tracks browser reduced-motion changes and cleans up its subscription", () => {
  const listeners = new Set();
  const mediaQuery = {
    matches: true,
    addEventListener(event, listener) {
      assert.equal(event, "change");
      listeners.add(listener);
    },
    removeEventListener(event, listener) {
      assert.equal(event, "change");
      listeners.delete(listener);
    },
  };

  let cleanup;
  let notifications = 0;
  const reactModule = {
    useId: () => ":chart-test:",
    useSyncExternalStore(subscribe, getSnapshot) {
      cleanup ??= subscribe(() => {
        notifications += 1;
      });
      return getSnapshot();
    },
  };
  const { Pattern, recharts } = loadPattern({
    reactModule,
    browserWindow: { matchMedia: () => mediaQuery },
  });

  const initialRadar = findElement(Pattern({}), recharts.Radar);
  assert.equal(initialRadar.props.isAnimationActive, false);
  assert.equal(listeners.size, 1);

  mediaQuery.matches = false;
  for (const listener of listeners) listener();

  assert.equal(notifications, 1);
  const updatedRadar = findElement(Pattern({}), recharts.Radar);
  assert.equal(updatedRadar.props.isAnimationActive, true);

  cleanup();
  assert.equal(listeners.size, 0);
});

test("falls back safely when matchMedia is unavailable", () => {
  const reactModule = {
    useId: () => ":chart-test:",
    useSyncExternalStore(_subscribe, getSnapshot) {
      return getSnapshot();
    },
  };
  const { Pattern, recharts } = loadPattern({
    reactModule,
    browserWindow: {},
  });

  const radar = findElement(Pattern({}), recharts.Radar);
  assert.equal(radar.props.isAnimationActive, true);
});

test("renders the custom tooltip for a Recharts active payload", () => {
  const { Pattern, getTooltipProps } = loadPattern();

  renderToStaticMarkup(
    React.createElement(Pattern, {
      data: [{ skill: "Testing", score: 85 }],
    }),
  );

  const tooltipProps = getTooltipProps();
  assert.ok(React.isValidElement(tooltipProps?.content));
  assert.equal(tooltipProps.cursor, false);

  const tooltipHtml = renderToStaticMarkup(
    React.createElement(tooltipProps.content.type, {
      ...tooltipProps.content.props,
      active: true,
      payload: [
        {
          value: 85,
          payload: { skill: "Testing", score: 85 },
        },
      ],
    }),
  );

  assert.match(tooltipHtml, /Testing/);
  assert.match(tooltipHtml, />85</);
  assert.match(tooltipHtml, /Proficiency/);
});

test("keeps the chart container responsive within its defined chart height", () => {
  const { Pattern } = loadPattern();
  const html = renderToStaticMarkup(React.createElement(Pattern));
  const styles = readFileSync(componentStylesPath, "utf8");
  const chartStyles = styles.match(/\.chart\s*\{([^}]+)\}/)?.[1];
  const cardStyles = styles.match(/\.card\s*\{([^}]+)\}/)?.[1];

  assert.match(html, /data-responsive-width="100%"/);
  assert.match(html, /data-responsive-height="100%"/);
  assert.ok(chartStyles, "chart CSS block should exist");
  assert.ok(cardStyles, "card CSS block should exist");
  assert.match(chartStyles, /width:\s*100%/);
  assert.match(chartStyles, /height:\s*292px/);
  assert.match(cardStyles, /min-width:\s*0/);
});

test("renders the showcase route and mounts the reusable chart", () => {
  const routeSource = readFileSync(showcasePath, "utf8");
  const compiledRoute = ts.transpileModule(routeSource, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const routeModule = { exports: {} };
  const styles = new Proxy({}, { get: (_target, key) => String(key) });
  const iconNames = ["ArrowLeft", "ArrowUpRight", "Radar"];
  const icons = Object.fromEntries(
    iconNames.map((name) => [
      name,
      (props) =>
        jsxRuntime.jsx("svg", {
          "data-mock-icon": name,
          width: props.size ?? 16,
          height: props.size ?? 16,
        }),
    ]),
  );

  vm.runInNewContext(compiledRoute, {
    module: routeModule,
    exports: routeModule.exports,
    require(specifier) {
      if (specifier === "react/jsx-runtime") return jsxRuntime;
      if (specifier === "next/link") {
        return ({ href, children, ...props }) =>
          jsxRuntime.jsx("a", { href, ...props, children });
      }
      if (specifier === "lucide-react") return icons;
      if (specifier === "@/components/c-chart-23/Chart23") {
        return {
          Pattern: () => jsxRuntime.jsx("div", { "data-chart-preview": "true" }),
        };
      }
      if (specifier === "./page.module.css") return styles;
      throw new Error(`Unexpected import: ${specifier}`);
    },
  });

  const html = renderToStaticMarkup(
    React.createElement(routeModule.exports.default),
  );

  assert.match(html, /LIVE PREVIEW/);
  assert.match(html, /Map your team/);
  assert.match(html, /data-chart-preview="true"/);
  assert.match(html, /RECHARTS · RADAR/);
});

test("keeps the component metadata and generated registry entry aligned", () => {
  const metadata = JSON.parse(readFileSync(showcaseMetadataPath, "utf8"));
  const registry = readFileSync(registryPath, "utf8");

  assert.deepEqual(metadata, {
    title: "C Chart 23",
    icon: "Radar",
    order: 45,
    navigation: true,
  });
  assert.match(registry, /"slug":\s*"c-chart-23"/);
  assert.match(registry, /"href":\s*"\/components\/c-chart-23"/);
  assert.match(registry, /"title":\s*"C Chart 23"/);
  assert.match(registry, /"icon":\s*"Radar"/);
  assert.match(registry, /"order":\s*45/);
  assert.match(registry, /"navigation":\s*true/);
});

test("keeps the reusable chart independent of shadcn UI primitives", () => {
  assert.match(componentSource, /from "recharts"/);
  assert.doesNotMatch(
    componentSource,
    /from ["'][^"']*(?:@\/components\/ui|shadcn)["']/i,
  );
});
