// @flow

import type {Store} from 'react-redux';

import type {Action} from '../actions';
import {setPreferences} from '../actions';
import db from './db';
import type {State} from '../reducer';

const keyValArrayToObject = (o, {key, value}) => {
  o[key] = value;
  return o;
};

// we don't want to save the preference for, e.g. focus mode, as this resets on
// most navigation.
const PERSISTED_KEYS = ['enableNightMode', 'hasConfirmedFocusMode'];

export const populateStoreWithPreferences = (dispatch: Action => any) => {
  db({store: 'preferences'}).all().then(preferences =>
    dispatch(setPreferences(preferences.reduce(keyValArrayToObject, {}))));
};

export default (store: Store<State>) => {
  let last = {};

  store.subscribe((state = store.getState()) => {
    if (state.preferences === last) return;
    PERSISTED_KEYS
      .filter(k => last[k] !== state.preferences[k])
      .map(k => db({store: 'preferences'}).set(k, state.preferences[k]));
    last = state.preferences;
  });

  populateStoreWithPreferences(store.dispatch);
};
