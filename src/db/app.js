// @flow

import KeyValStore from './key-val-store';

const PREFERENCES_STORE_NAME = 'preferences';
const RECENTS_STORE_NAME = 'recents';
export const DB_METADATA = {
  name: 'app',
  version: 2,
  stores: [PREFERENCES_STORE_NAME, RECENTS_STORE_NAME],
};

let _preferences_instance, _recents_instance;

export const PERSISTED_PREFERENCES = {
  enableNightMode: true,
  hasConfirmedFocusMode: true,
  translation: true,
};
type PersistedPreferences = $Keys<typeof PERSISTED_PREFERENCES>;

export class PreferencesStore extends KeyValStore<PersistedPreferences, any> {
  constructor() {
    super(DB_METADATA, PREFERENCES_STORE_NAME);
  }
}

export const preferences = (): PreferencesStore => {
  if (_preferences_instance == null)
    _preferences_instance = new PreferencesStore();

  return _preferences_instance;
}

const RECENTS_KEYS = {passages: true};
type RecentsKeys = $Keys<typeof RECENTS_KEYS>;

export class RecentsStore extends KeyValStore<RecentsKeys, Array<number>> {
  constructor() {
    super(DB_METADATA, PREFERENCES_STORE_NAME);
  }
}

export const recents = (): RecentsStore => {
  if (_recents_instance == null)
    _recents_instance = new RecentsStore();

  return _recents_instance;
}

