import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createRendererSafely,
  selectSwellPreset,
  shouldScheduleFrame,
  subscribeToReducedMotion,
} from '../components/micro-slats/micro-slats-utils.mjs';

const presets = {
  swell: { speed: 1, name: 'swell' },
  tide: { speed: 0.5, name: 'tide' },
  storm: { speed: 2, name: 'storm' },
  signal: { speed: 0, name: 'signal' },
};

test('selects each supported preset and safely falls back for unknown runtime keys', () => {
  for (const name of ['swell', 'tide', 'storm', 'signal']) {
    assert.equal(selectSwellPreset(name, presets), presets[name]);
  }
  for (const name of [undefined, '', 'unknown', 'constructor', '__proto__', 'toString']) {
    assert.equal(selectSwellPreset(name, presets), presets.swell);
  }
});

test('renderer initialization returns the renderer or a graceful null fallback', () => {
  const renderer = { gl: {} };
  assert.equal(createRendererSafely(() => renderer), renderer);
  assert.equal(createRendererSafely(() => { throw new Error('WebGL unavailable'); }), null);
});

test('reduced-motion subscription reports live changes and removes its listener', () => {
  const listeners = new Set();
  const mediaQuery = {
    matches: false,
    addEventListener(type, listener) {
      assert.equal(type, 'change');
      listeners.add(listener);
    },
    removeEventListener(type, listener) {
      assert.equal(type, 'change');
      listeners.delete(listener);
    },
  };
  const changes = [];
  const unsubscribe = subscribeToReducedMotion(mediaQuery, (matches) => changes.push(matches));

  mediaQuery.matches = true;
  for (const listener of listeners) listener();
  mediaQuery.matches = false;
  for (const listener of listeners) listener();
  assert.deepEqual(changes, [true, false]);

  unsubscribe();
  assert.equal(listeners.size, 0);
  mediaQuery.matches = true;
  for (const listener of listeners) listener();
  assert.deepEqual(changes, [true, false]);
});


test('animation frames are scheduled only while visible and work remains', () => {
  assert.equal(shouldScheduleFrame(false, false, true, false, false), false);
  assert.equal(shouldScheduleFrame(true, true, true, false, false), false);
  assert.equal(shouldScheduleFrame(true, false, false, false, false), false);
  assert.equal(shouldScheduleFrame(true, false, true, false, false), true);
  assert.equal(shouldScheduleFrame(true, false, false, true, false), true);
  assert.equal(shouldScheduleFrame(true, false, false, false, true), true);
});
