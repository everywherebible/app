// @flow

import type {Store} from 'react-redux';

import {setRecents} from '../actions';
import type {Action} from '../actions';
import {chapterIndex, reference} from './model';
import {recents} from '../db/app';

export const populateStoreWithRecents = (dispatch: Action => any) =>
  recents().get('passages')
    .then(passages => dispatch(setRecents(passages.map(reference))), e => null);

export default (store: Store) => {
  let last;

  store.subscribe((state = store.getState()) => {
    if (state.recents === last) return;
    // TODO: every time we navigate to the passage lookup, these will be
    // updated from the DB, leading to a bunch of spurious db writes. should
    // have a semantic equality check here.
    recents().set('passages', state.recents.map(chapterIndex));
    last = state.recents;
  });
};
