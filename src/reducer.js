// @flow

import type {Action, Preferences} from './actions';
import type {Reference} from './data/model';
import {chapterIndex, isEqual} from './data/model';

const RECENT_COUNT = 10;

export type State = {
  +chapters: {[number]: string},
  +recents: Array<Reference>,
  +preferences: Preferences,
}

export const DEFAULT = {
  chapters: {},
  recents: [],
  preferences: {
    enableFocusMode: false,
    enableNightMode: false,
  }
};

const updatedRecents =
  (reference: Reference, currentRecents: Array<Reference>) => {
    const withoutNewReference =
      currentRecents.filter(current => !isEqual(current, reference));

    return withoutNewReference.length >= RECENT_COUNT?
      withoutNewReference.slice(0, RECENT_COUNT) : withoutNewReference;
  };

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
    case 'add-recent':
      return {
        ...state,
        recents: [
          action.reference,
          ...updatedRecents(action.reference, state.recents),
        ],
      };
    case 'set-recents':
      return {...state, recents: action.recents};
    case 'enable-focus-mode':
      return {
        ...state,
        preferences: {...state.preferences, enableFocusMode: action.enabled},
      };
    case 'enable-night-mode':
      return {
        ...state,
        preferences: {...state.preferences, enableNightMode: action.enabled},
      };
    case 'set-preferences':
      return {
        ...state,
        preferences: {...state.preferences, ...action.preferences},
      };
    default:
      (action: empty); // eslint-disable-line
      return state;
  }
};
