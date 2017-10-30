// @flow

import type {Store} from 'react-redux';

import type {Action} from '../actions';
import {setPreferences} from '../actions';
import {preferences, PERSISTED_PREFERENCES} from '../db/app';
import type {State} from '../reducer';

const keyValArrayToObject = (o, {key, value}) => {
  o[key] = value;
  return o;
};

export const populateStoreWithPreferences = (dispatch: Action => any) => {
  preferences().all().then(preferences =>
    dispatch(setPreferences(preferences.reduce(keyValArrayToObject, {}))));
};

export default (store: Store<State>) => {
  let last = {};

  store.subscribe((state = store.getState()) => {
    if (state.preferences === last) return;
    Object.keys(PERSISTED_PREFERENCES)
      .filter(k => last[k] !== state.preferences[k])
      .map(k => preferences().set(k, state.preferences[k]));
    last = state.preferences;
  });

  populateStoreWithPreferences(store.dispatch);
};
