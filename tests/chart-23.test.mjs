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
const componentSource = readFileSync(componentPath, "utf8");
const compiledComponent = ts.transpileModule(componentSource, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

function createRechartsMocks() {
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
    ResponsiveContainer: ({ children }) =>
      jsxRuntime.jsx("div", { children }),
    Tooltip: () => null,
  };

  return recharts;
}

function loadPattern({ reactModule = React, browserWindow } = {}) {
  const componentModule = { exports: {} };
  const recharts = createRechartsMocks();
  const styles = new Proxy({}, { get: (_target, key) => String(key) });

  vm.runInNewContext(compiledComponent, {
    module: componentModule,
    exports: componentModule.exports,
    window: browserWindow,
    require(specifier) {
      if (specifier === "react") return reactModule;
      if (specifier === "react/jsx-runtime") return jsxRuntime;
      if (specifier === "recharts") return recharts;
      if (specifier === "./Chart23.module.css") return styles;
      throw new Error(`Unexpected import: ${specifier}`);
    },
  });

  return { Pattern: componentModule.exports.Pattern, recharts };
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
