// @flow

import type {Reference} from './data/model';

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

export type Preferences = {
  +enableFocusMode: boolean,
  +enableNightMode: boolean,
};

export type SettablePreferences = {
  +enableFocusMode?: boolean,
  +enableNightMode?: boolean,
};

export type EnableFocusMode = {
  +type: 'enable-focus-mode',
  +enabled: boolean,
};

export const enableFocusMode = (enabled: boolean): EnableFocusMode =>
  ({type: 'enable-focus-mode', enabled});

export type EnableNightMode = {
  +type: 'enable-night-mode',
  +enabled: boolean,
};

export const enableNightMode = (enabled: boolean): EnableNightMode =>
  ({type: 'enable-night-mode', enabled});

export type SetPreferences = {
  +type: 'set-preferences',
  +preferences: SettablePreferences,
};

export const setPreferences = (preferences: Preferences):
    SetPreferences =>
  ({type: 'set-preferences', preferences});

export type Action =
    SetChapterText
  | AddRecent
  | SetRecents
  | EnableFocusMode
  | EnableNightMode
  | SetPreferences;

