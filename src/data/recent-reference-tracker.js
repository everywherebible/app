// @flow

import type {Store} from 'react-redux';

import {setRecents} from '../actions';
import type {Action} from '../actions';
import {chapterIndex, reference} from './model';
import db from './db';

export const populateStoreWithRecents = (dispatch: Action => any) =>
  db({store: 'recents'}).get('passages')
    .then(passages => dispatch(setRecents(passages.map(reference))), e => null);

export default (store: Store) => {
  const recents = db({store: 'recents'});

  store.subscribe((state = store.getState()) =>
    recents.set('passages', state.recents.map(chapterIndex)));

  populateStoreWithRecents(store.dispatch);
};
