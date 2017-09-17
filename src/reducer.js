// @flow

import type {Action} from './actions';
import type {Reference} from './data';
import {chapterIndex} from './data';

export type State = {
  +reading: Reference,
  +chapters: {[number]: string},
}

export const DEFAULT = {reading: {book: 'Genesis', chapter: 1}, chapters: {}};

export default (state: State = DEFAULT, action: Action) => {
  switch (action.type) {
    case 'set-reference':
      return {
        ...state,
        reading: action.reference,
      };
    case 'set-chapter-text':
      return {
        ...state,
        chapters: {
          ...state.chapters,
          [chapterIndex(action.reference)]: action.text
        },
      };
    default:
      (action: empty); // eslint-disable-line
      return state;
  }
};
