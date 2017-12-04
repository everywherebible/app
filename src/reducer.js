// @flow

import type {Action, Preferences} from './actions';
import type {Reference, Translation} from './data/model';
import {chapterIndex, isEqual} from './data/model';

const RECENT_COUNT = 10;

export type Toast = {|start: number, text: string|}; // TODO: find a better home

export type State = {|
  +chapters: {
    +[Translation]: {[number]: string},
  },
  +recents: Array<Reference>,
  +preferences: Preferences,
  +toasts: Array<Toast>,
  +downloads: {
    +[Translation]: Set<Reference>,
  },
|};

export const DEFAULT = {
  chapters: {kjv: {}, esv: {}},
  recents: [],
  preferences: {
    enableFocusMode: false,
    enableNightMode: false,
    hasConfirmedFocusMode: false,
    translation: 'kjv',
  },
  toasts: [],
  downloads: {},
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
        chapters: action.translation === 'kjv'?
          {
            kjv: {
              ...state.chapters.kjv,
              [chapterIndex(action.reference)]: action.text,
            },
            esv: state.chapters.esv
          } :
          {
            kjv: state.chapters.kjv,
            esv: {
              ...state.chapters.esv,
              [chapterIndex(action.reference)]: action.text,
            },
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
    case 'add-toast':
      return {
        ...state,
        toasts: [
          ...state.toasts.filter(t => Date.now() - t.start < 3000),
          {start: Date.now(), text: action.text},
        ]
      };
    case 'confirm-focus-mode':
      return {
        ...state,
        preferences: {...state.preferences, hasConfirmedFocusMode: true},
      };
    case 'set-download':
      const downloads = {...state.downloads};
      if (action.download == null)
        delete downloads[action.translation];
      else
        downloads[action.translation] = action.download;
      return {...state, downloads};
    default:
      (action: empty); // eslint-disable-line
      return state;
  }
};
