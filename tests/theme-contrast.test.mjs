import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");

function declarations(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "s"));
  assert.ok(match, `Missing ${selector} color block`);
  return Object.fromEntries(
    [...match[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map((entry) => [entry[1], entry[2].trim()]),
  );
}

const base = declarations("@theme");
const light = { ...base, ...declarations(":root") };
const dark = { ...light, ...declarations(".dark") };

function resolveColor(name, palette, seen = new Set()) {
  assert.ok(!seen.has(name), `Circular color token: --${name}`);
  seen.add(name);
  const value = palette[name];
  assert.ok(value, `Missing color token: --${name}`);
  const reference = value.match(/^var\(--([\w-]+)\)$/);
  return reference ? resolveColor(reference[1], palette, seen) : value;
}

function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i, `Expected a six-digit hex color, received ${hex}`);
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function assertPair(palette, foreground, background, minimum, mode) {
  const foregroundColor = resolveColor(foreground, palette);
  const backgroundColor = resolveColor(background, palette);
  const ratio = contrast(foregroundColor, backgroundColor);
  assert.ok(
    ratio >= minimum,
    `${mode}: --${foreground} on --${background} is ${ratio.toFixed(2)}:1; expected ${minimum}:1`,
  );
}

for (const [mode, palette] of Object.entries({ light, dark })) {
  test(`${mode} accent text pairs meet WCAG AA`, () => {
    for (const accent of ["pink", "yellow", "lime", "violet", "cyan", "blue"]) {
      assertPair(palette, `text-on-${accent}`, `accent-${accent}`, 4.5, mode);
    }
  });

  test(`${mode} surface text meets WCAG AA`, () => {
    for (const surface of ["bg", "paper"]) {
      assertPair(palette, "ink", surface, 4.5, mode);
      assertPair(palette, "muted", surface, 4.5, mode);
    }
  });

  test(`${mode} focus and brutal shadow boundaries remain visible`, () => {
    for (const surface of ["bg", "paper"]) {
      assertPair(palette, "focus-ring", surface, 3, mode);
      assertPair(palette, "shadow-color", surface, 3, mode);
    }
  });
}
