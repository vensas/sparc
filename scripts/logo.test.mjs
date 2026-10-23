// Tests for the logo of the change add-sparc-logo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const PURPLE = '#552583';
const PURPLE_ON_DARK = '#b08be0';
const GOLD = '#fdb927';

test('logo: light and dark variants use the chosen colors and name sparc', () => {
  const light = read('docs/assets/logo-light.svg');
  const dark = read('docs/assets/logo-dark.svg');
  for (const [svg, purple] of [[light, PURPLE], [dark, PURPLE_ON_DARK]]) {
    assert.match(svg, /^<svg [^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(svg.includes(purple) && svg.includes(GOLD), 'purple and gold are in the logo');
    assert.match(svg, /<title[^>]*>sparc<\/title>/);
    assert.match(svg, />sparc<\/text>/);
  }
});

test('logo: plugin icon is a 512 x 512 PNG made from the icon SVG', () => {
  const svg = read('docs/assets/icon.svg');
  assert.ok(svg.includes(PURPLE) && svg.includes(GOLD));
  const png = readFileSync(join(ROOT, '.claude-plugin/icon.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 512, 'width');
  assert.equal(png.readUInt32BE(20), 512, 'height');
});

test('logo: README shows the light or dark logo for the theme of the reader', () => {
  const title = read('README.md').split('\n')[0];
  assert.match(title, /^# <picture>/);
  assert.match(title, /<source media="\(prefers-color-scheme: dark\)" srcset="docs\/assets\/logo-dark\.svg">/);
  assert.match(title, /<img src="docs\/assets\/logo-light\.svg" alt="sparc"/);
});
