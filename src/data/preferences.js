// @flow

import type {Store} from 'react-redux';

import type {Action, SettablePreferences} from '../actions';
import {setPreferences} from '../actions';
import {updateStoreWithPassageText} from './fetcher';
import {locationToReference} from './model';
import {preferences, PERSISTED_PREFERENCES} from '../db/app';
import type {State} from '../reducer';
import {READ_PATH_RE} from '../ui/nav';

const keyValArrayToObject = (o, {key, value}) => {
  o[key] = value;
  return o;
};

export const populateStoreWithPreferences = (dispatch: Action => any):
    Promise<SettablePreferences> =>
  preferences()
    .all()
    .then(preferences => {
      const preferencesObject = preferences.reduce(keyValArrayToObject, {});
      dispatch(setPreferences(preferencesObject));
      return preferencesObject;
    });

export default (store: Store<State>, initial: SettablePreferences = {}) => {
  let last = initial;

  store.subscribe((state = store.getState()) => {
    if (state.preferences === last) return;

    Object.keys(PERSISTED_PREFERENCES)
      .filter(k => last[k] !== state.preferences[k])
      .map(k => preferences().set(k, state.preferences[k]));

    if (READ_PATH_RE.exec(window.location.pathname) &&
        last.translation !== state.preferences.translation)
      updateStoreWithPassageText(store, locationToReference(window.location));

    last = state.preferences;
  });

  populateStoreWithPreferences(store.dispatch);
};
