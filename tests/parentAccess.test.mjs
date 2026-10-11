import test from 'node:test';
import assert from 'node:assert/strict';
import { isParentPath, canonicalAppPath, createParentChallenge, DIGIT_WORDS } from '../src/utils/parentAccess.ts';

test('all parent routes are gated, without matching unrelated prefixes', () => {
  for (const path of ['/parents', '/parents/', '/parents/records', '/parents/future/settings']) assert.equal(isParentPath(path), true);
  for (const path of ['/', '/play/pick-color', '/parents-other', '/parent']) assert.equal(isParentPath(path), false);
});
test('legacy records URLs resolve to the gated route', () => {
  assert.equal(canonicalAppPath('/records'), '/parents/records');
  assert.equal(canonicalAppPath('/records/'), '/parents/records');
  assert.equal(canonicalAppPath('/parents/records'), '/parents/records');
});
test('challenges have three spelled-out digits and no leading zero', () => {
  for (let index = 0; index < 1000; index++) {
    const challenge = createParentChallenge();
    assert.match(challenge, /^[1-9][0-9]{2}$/);
    assert.equal(challenge.split('').map((digit) => DIGIT_WORDS[Number(digit)]).every(Boolean), true);
  }
});
