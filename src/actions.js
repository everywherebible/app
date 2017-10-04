// @flow

import type {Reference} from './data';

export type SetChapterText = {
  +type: 'set-chapter-text',
  +reference: Reference,
  +text: string,
};

export const setChapterText =
  (reference: Reference, text: string): SetChapterText =>
    ({type: 'set-chapter-text', reference, text});

export type AddRecent = {
  +type: 'add-recent',
  +reference: Reference,
}

export const addRecent = (reference: Reference): AddRecent =>
  ({type: 'add-recent', reference});

export type SetRecents = {
  +type: 'set-recents',
  +recents: Array<Reference>,
}

export const setRecents = (recents: Array<Reference>): SetRecents =>
  ({type: 'set-recents', recents});

export type Action = SetChapterText | AddRecent | SetRecents;

