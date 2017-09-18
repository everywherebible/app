// @flow

import type {Reference} from './data';

export type SetReference = {+type: 'set-reference', +reference: Reference};

export const setReference = (reference: Reference): SetReference =>
  ({type: 'set-reference', reference});

export type SetChapterText = {
  +type: 'set-chapter-text',
  +reference: Reference,
  +text: string,
};

export const setChapterText =
  (reference: Reference, text: string): SetChapterText =>
    ({type: 'set-chapter-text', reference, text});

export type Action = SetChapterText;

