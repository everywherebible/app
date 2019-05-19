import {setPreferences} from "../actions";
import {updateStoreWithPassageText} from "./fetcher";
import {locationToReference} from "./model";
import {preferences, PERSISTED_PREFERENCES} from "../db/app";

import {READ_PATH_RE} from "../ui/nav";

const keyValArrayToObject = (o, {key, value}) => {
  o[key] = value;
  return o;
};

export const populateStoreWithPreferences = dispatch =>
  preferences()
    .all()
    .then(preferences =>
      dispatch(setPreferences(preferences.reduce(keyValArrayToObject, {})))
    );

export default store => {
  let last = store.getState().preferences;

  store.subscribe((state = store.getState()) => {
    if (state.preferences === last) return;

    Object.keys(PERSISTED_PREFERENCES)
      .filter(k => last[k] !== state.preferences[k])
      .map(k => preferences().set(k, state.preferences[k]));

    if (
      READ_PATH_RE.exec(window.location.pathname) &&
      last.translation !== state.preferences.translation
    )
      updateStoreWithPassageText(store, locationToReference(window.location));

    last = state.preferences;
  });
};
