import KeyValStore from "./key-val-store";

const PREFERENCES_STORE_NAME = "preferences";
const RECENTS_STORE_NAME = "recents";
export const DB_METADATA = {
  name: "app",
  version: 3,
  stores: [PREFERENCES_STORE_NAME, RECENTS_STORE_NAME],
};

let _preferences_instance, _recents_instance;

export const PERSISTED_PREFERENCES = {
  enableNightMode: true,
  hasConfirmedFocusMode: true,
  translation: true,
};

export class PreferencesStore extends KeyValStore {
  constructor() {
    super(DB_METADATA, PREFERENCES_STORE_NAME);
  }
}

export const preferences = () => {
  if (_preferences_instance == null)
    _preferences_instance = new PreferencesStore();

  return _preferences_instance;
};

export class RecentsStore extends KeyValStore {
  constructor() {
    super(DB_METADATA, RECENTS_STORE_NAME);
  }
}

export const recents = () => {
  if (_recents_instance == null) _recents_instance = new RecentsStore();

  return _recents_instance;
};
