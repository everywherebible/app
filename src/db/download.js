// @flow

import type {Store} from 'react-redux';

import {setDownload} from '../actions';
import type {Reference, Translation} from '../data/model';
import {
  CHAPTER_COUNT,
  reference as toReference,
  translations,
} from '../data/model';
import dbs from './bibles/index';
import {fetchChapter, chapterUrl} from '../data/fetcher';
window.dbs = dbs;

const arrayOfChapters = [...Array(CHAPTER_COUNT)].map((_, i) => i);

type ProgressCallback = (downloaded: Set<Reference>) => any;

// 😂😂😂
const last2DomainSegments = u =>
  u.hostname.split('.').reverse().filter((_, i) => i < 2).reverse().join('.');

export default async function download(
    translation: Translation,
    onProgress: ProgressCallback) {

  // we rely on the service-worker-side database insertion to actually download
  // the content for offline use, so this doesn't work otherwise.
  if (!navigator.serviceWorker || !navigator.serviceWorker.controller)
    throw new Error('cannot download without service worker');

  const db = dbs[translation]();
  const indices = new Set(await db.allKeys());
  const toDownload = new Set(arrayOfChapters.filter(i => !indices.has(i)));
  const downloaded = new Set(Array.from(indices).map(toReference));

  for (const index of toDownload) {
    const reference = toReference(index);
    toDownload.delete(index);

    // the service worker will insert the result into the DB
    await fetchChapter(translation, reference);

    if (last2DomainSegments(chapterUrl(translation, reference)) !== 'everywherebible.org')
      await new Promise((resolve, _) => setTimeout(resolve, 1000));

    downloaded.add(reference);
    onProgress(downloaded);
  }

  onProgress(downloaded);
}

// eslint-disable-next-line no-redeclare
declare function download(translation: Translation, onProgress: ProgressCallback): any;

export const downloadTracker = (store: Store) => {
  const ongoingDownloads = {};

  store.subscribe((state = store.getState()) => {
    for (const translation of translations) {
      const downloaded = state.downloads[translation];
      if (ongoingDownloads[translation] == null &&
          downloaded &&
          downloaded.size === 0) {
        ongoingDownloads[translation] = download(translation, newDownloaded => {
          store.dispatch(setDownload(translation, newDownloaded));
        });
      }
    }
  });
};
