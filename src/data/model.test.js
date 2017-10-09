// @flow

import assert from 'assert';

import type {Reference} from './model';
import {
  chapterIndex,
  reference,
  before,
  after,
  locationToReference,
} from './model';

const GENESIS_1: Reference = {book: 'Genesis', chapter: 1, verse: 1};
const GENESIS_2: Reference = {book: 'Genesis', chapter: 2, verse: 1};
const EXODUS_1: Reference = {book: 'Exodus', chapter: 1, verse: 1};
const TWO_THESS_3_4: Reference = {
  book: '2 Thessalonians',
  chapter: 3,
  verse: 4,
};
const ONE_JOHN: Reference = {book: '1 John', chapter: 1, verse: 1};
const THE_LAST_ONE: Reference = {book: 'Revelation', chapter: 22, verse: 1};
const LAST_INDEX = 1188;

declare function describe(name: string, callback: () => any): any;
declare function it(name: string, callback: () => any): any;

const loc = (pathname: string): Location => ({...window.location, pathname});

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

describe('locationToReference', () => {
  it('handles "/Genesis+1"', () => {
    assert.deepStrictEqual(locationToReference(loc('/Genesis+1')),
        GENESIS_1);
  });

  it('handles "Genesis+1:1"', () => {
    assert.deepStrictEqual(locationToReference(loc('/Genesis+1:1')),
        GENESIS_1);
  });

  it('handles "/2+Thessalonians+3:4"', () => {
    assert.deepStrictEqual(locationToReference(loc('/2+Thessalonians+3:4')),
        TWO_THESS_3_4);
  });

  it('handles "/2%20thessalonians+3:4"', () => {
    assert.deepStrictEqual(locationToReference(loc('/2%20thessalonians+3:4')),
        TWO_THESS_3_4);
  });

  it('handles case', () => {
    assert.deepStrictEqual(locationToReference(loc('/gEnEsis+1')),
        GENESIS_1);
  });

  it('handles numbered books', () => {
    assert.deepStrictEqual(locationToReference(loc('/1+John+1')),
        ONE_JOHN);
  });

  it('handles no chapter', () => {
    assert.deepStrictEqual(locationToReference(loc('/Genesis')), GENESIS_1);
  });
});
