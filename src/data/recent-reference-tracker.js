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
  let last;

  store.subscribe((state = store.getState()) => {
    if (state.recents === last) return;
    // TODO: every time we navigate to the passage lookup, these will be
    // updated from the DB, leading to a bunch of spurious db writes. should
    // have a semantic equality check here.
    recents.set('passages', state.recents.map(chapterIndex));
    last = state.recents;
  });

  populateStoreWithRecents(store.dispatch);
};
