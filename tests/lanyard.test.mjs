import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateCameraFrame, disposeWebGLRenderer, parseColor } from '../components/lanyard/lanyard-utils.mjs';

const fallback = [0.25, 0.5, 0.75];

function createContext(validColors = {}) {
  let current = '#000000';
  return {
    get fillStyle() { return current; },
    set fillStyle(value) {
      if (Object.hasOwn(validColors, value)) current = validColors[value];
      else if (/^#[0-9a-f]{6}$/i.test(value)) current = value.toLowerCase();
      else if (/^#[0-9a-f]{3}$/i.test(value)) current = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
    }
  };
}

test('parseColor accepts normalized hex colors', () => {
  const result = parseColor('#ff8000', fallback, () => createContext());
  assert.deepEqual(result, [1, 128 / 255, 0]);
});

test('parseColor accepts valid colors that match either sentinel', () => {
  for (const color of ['#010203', '#040506']) {
    assert.deepEqual(parseColor(color, fallback, () => createContext()), [1 / 255, 2 / 255, 3 / 255].map((v, i) => color === '#010203' ? v : [4, 5, 6][i] / 255));
  }
});

test('parseColor returns the supplied fallback for rejected CSS values', () => {
  assert.equal(parseColor('not-a-color', fallback, () => createContext()), fallback);
});

test('parseColor returns fallback when canvas context is unavailable or throws', () => {
  assert.equal(parseColor('#fff', fallback, () => null), fallback);
  assert.equal(parseColor('#fff', fallback, () => { throw new Error('canvas unavailable'); }), fallback);
});

test('camera framing keeps portrait cards within the horizontal viewport for every anchor', () => {
  const layout = { width: 1.6, height: 2.25, hangY: 1.25 };
  for (const anchor of ['left', 'center', 'right']) {
    const frame = calculateCameraFrame({ layout, size: 0.9, strapLength: 0.5, anchor, width: 320, height: 480 });
    const anchorPosition = { left: 0.27, center: 0.5, right: 0.73 }[anchor];
    const minWidth = layout.width / Math.min(0.72, 2 * Math.min(anchorPosition, 1 - anchorPosition));
    assert.ok(frame.viewWidth >= minWidth);
    assert.ok(Number.isFinite(frame.cameraZ));
    assert.ok(Number.isFinite(frame.hangTop));
  }
});

test('camera framing remains finite for narrow containers and clamped inputs', () => {
  const frame = calculateCameraFrame({ layout: { width: 2.25, height: 1.6, hangY: 0.8 }, size: 4, strapLength: 3, anchor: 'unknown', width: 0, height: 0 });
  assert.ok(Object.values(frame).every(Number.isFinite));
  assert.ok(frame.viewHeight >= 1.6 / 0.58);
  assert.equal(frame.aspect, 1);
});

test('renderer cleanup releases the context after disposing renderer resources', () => {
  const calls = [];
  disposeWebGLRenderer({ dispose: () => calls.push('dispose'), forceContextLoss: () => calls.push('forceContextLoss') });
  assert.deepEqual(calls, ['dispose', 'forceContextLoss']);
});

test('renderer context is still released if dispose throws', () => {
  const calls = [];
  assert.throws(() => disposeWebGLRenderer({
    dispose: () => { calls.push('dispose'); throw new Error('dispose failed'); },
    forceContextLoss: () => calls.push('forceContextLoss')
  }), /dispose failed/);
  assert.deepEqual(calls, ['dispose', 'forceContextLoss']);
});
