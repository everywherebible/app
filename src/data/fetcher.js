// @flow
import type {Store} from 'redux';

import {setChapterText} from '../actions';
import {FROM_SERVICE_WORKER_HEADER} from '../constants';
import type {Reference} from './model';
import {chapterIndex, before, after, CHAPTER_COUNT} from './model';
import type {State} from '../reducer';
import transform from './transform';

const BASE = new URL('https://api.esv.org/v3/passage/html/');
const ESV_KEY = 'cecc457af593de97294057073c9be28d7ffdfaf9';

export const chapterUrl = (reference: Reference): URL => {
  const url = new URL('', BASE);
  url.searchParams.set('q', `${reference.book} ${reference.chapter}`);
  return url;
}

export const lookup = (url: URL | Reference): Promise<Response> => {
  if (!(url instanceof URL))
    url = chapterUrl(url);

  return fetch(url, {
    headers: {
      authorization: `Token ${ESV_KEY}`,
      accept: 'application/json',
    }
  });
}

const fetchChapter = (store: Store, reference: Reference): Promise<string> =>
  lookup(reference)
      .then(response => {
        if (!response.ok)
          throw new Error(`${response.url} failed with ${response.status}`);
        return response;
      })
      .then(response => {
        const fromSW = response.headers.get(FROM_SERVICE_WORKER_HEADER);

        return response.json()
          .then(obj => obj.passages[0])
          .then(text => fromSW? text : transform(text));
      })
      .then(text => store.dispatch(setChapterText(reference, text)));

const indexIsCached = (state: State, index: number): boolean =>
  state.chapters[index] != null;

export const updateStoreWithPassageText = (store: Store, reference: Reference) => {
  const state = store.getState();
  const index = chapterIndex(reference);

  if (!indexIsCached(state, index))
    fetchChapter(store, reference);

  if (index > 0 && !indexIsCached(state, index - 1))
    fetchChapter(store, before(reference));

  if (index < CHAPTER_COUNT && !indexIsCached(state, index + 1))
    fetchChapter(store, after(reference));
}
