// @flow
import type {Store} from 'redux';

import {setChapterText} from '../actions';
import {FROM_SERVICE_WORKER_HEADER} from '../constants';
import type {Reference} from './model';
import {chapterIndex, before, after, CHAPTER_COUNT} from './model';
import type {State} from '../reducer';
import transform from './transform';

export const ESV_BASE = new URL('https://api.esv.org/v3/passage/html/');
const ESV_KEY = 'cecc457af593de97294057073c9be28d7ffdfaf9';

export type EsvApiJson = {|
  +passages: Array<string>,
|};

export type EsvApiResponse = {|
  +headers: {get: (string) => ?string},
  +url: string,
  +status: number,
  +ok: boolean,
  +json: () => Promise<EsvApiJson>,
|};

export const fetchOrThrow = (url: string | URL, init?: RequestOptions):
    Promise<Response> =>
  fetch(url, init)
    .then((response: Response): Response => {
      if (!response.ok)
        throw new Error(`${response.url} failed with ${response.status}`);
      return response;
    });

const esvChapterUrl = (reference: Reference): URL => {
  const url = new URL('', ESV_BASE);
  url.searchParams.set('q', `${reference.book} ${reference.chapter}`);
  return url;
};

const kjvChapterUrl = (reference: Reference): URL => {
  const book = reference.book.toLowerCase().replace(/ /g, '-');
  return new URL(`/api/v1/kjv/${book}/${reference.chapter}.html`,
      window.location);
};

export const esvLookup = (url: URL): Promise<EsvApiResponse> => {
  declare function fetchOrThrow(url: URL, options: mixed): Promise<EsvApiResponse>;

  return fetchOrThrow(url, {
    headers: {
      authorization: `Token ${ESV_KEY}`,
      accept: 'application/json',
    }
  });
};

const fetchChapter = (store: Store, reference: Reference): Promise<string> => {
  const translation = store.getState().preferences.translation;
  const request: Promise<string> = translation === 'kjv'?
    fetchOrThrow(kjvChapterUrl(reference))
      .then(response => response.text()) :

    esvLookup(esvChapterUrl(reference))
      .then(response => {
        const fromSW = response.headers.get(FROM_SERVICE_WORKER_HEADER);

        return (response.json(): Promise<EsvApiJson>)
          .then(obj => obj.passages[0])
          .then(text => fromSW? text : transform(text));
      });

  request
    .then(text => store.dispatch(setChapterText(translation, reference, text)));

  return request;
}

const indexIsCached = (state: State, index: number): boolean =>
  state.chapters[state.preferences.translation][index] != null;

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
