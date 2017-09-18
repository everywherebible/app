// @flow

import type {Action} from './actions';
import {chapterIndex} from './data';

export type State = {+chapters: {[number]: string}}

export const DEFAULT = {reading: {book: 'Genesis', chapter: 1}, chapters: {}};

export default (state: State = DEFAULT, action: Action) => {
  switch (action.type) {
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
