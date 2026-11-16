// Helper for the tests that read skill text.
import assert from 'node:assert/strict';

// Asserts that the text has `a`, has `b`, and has `a` before `b`.
export function before(text, a, b) {
  const i = text.indexOf(a);
  const j = text.indexOf(b);
  assert.ok(i >= 0, `the text has "${a}"`);
  assert.ok(j >= 0, `the text has "${b}"`);
  assert.ok(i < j, `"${a}" comes before "${b}"`);
}
