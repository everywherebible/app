// @flow

import assert from 'assert';

import type {Reference} from './data';
import {chapterIndex, reference, before, after} from './data';

const GENESIS_1: Reference = {book: 'Genesis', chapter: 1, verse: 1};
const GENESIS_2: Reference = {book: 'Genesis', chapter: 2, verse: 1};
const EXODUS_1: Reference = {book: 'Exodus', chapter: 1, verse: 1};
const THE_LAST_ONE: Reference = {book: 'Revelation', chapter: 22, verse: 1};
const LAST_INDEX = 1188;

declare function describe(name: string, callback: () => any): any;
declare function it(name: string, callback: () => any): any;

describe('chapterIndex', () => {
  it('says genesis 1 index is 0', () => {
    assert.equal(chapterIndex(GENESIS_1), 0);
  });

  it('says exodus 1 index is 50', () => {
    assert.equal(chapterIndex(EXODUS_1), 50);
  });

  it('gets revelation 22 right', () => {
    assert.equal(chapterIndex(THE_LAST_ONE), LAST_INDEX);
  });
});

describe('reference', () => {
  it('says 0 is genesis 1', () => {
    assert.deepStrictEqual(reference(0), GENESIS_1);
  });

  it('says 50 is exodus 1', () => {
    assert.deepStrictEqual(reference(0), GENESIS_1);
  });

  it('says 1188 is genesis 1', () => {
    assert.deepStrictEqual(reference(LAST_INDEX), THE_LAST_ONE);
  });
});

describe('before', () => {
  it('says genesis 1 is before genesis 2', () => {
    assert.deepStrictEqual(before(GENESIS_2), GENESIS_1);
  });

  it('says revelation 22 is before genesis 1', () => {
    assert.deepStrictEqual(before(GENESIS_1), THE_LAST_ONE);
  });
});

describe('after', () => {
  it('says genesis 2 is after genesis 1', () => {
    assert.deepStrictEqual(after(GENESIS_1), GENESIS_2);
  });

  it('says revelation 22 is before genesis 1', () => {
    assert.deepStrictEqual(after(THE_LAST_ONE), GENESIS_1);
  });
});
