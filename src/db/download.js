// @flow

import type {Store} from 'react-redux';

import type {Reference, Translation} from '../data/model';
import {CHAPTER_COUNT, reference as toReference} from '../data/model';
import dbs from './bibles/index';
import {fetchChapter, chapterUrl} from '../data/fetcher';

const arrayOfChapters = [...Array(CHAPTER_COUNT)].map((_, i) => i);

type ProgressCallback = (downloaded: Set<Reference>) => any;

export default async function download(
    translation: Translation,
    onProgress: ProgressCallback) {

  // we rely on the service-worker-side database insertion to actually download
  // the content for offline use, so this doesn't work otherwise.
  if (!navigator.serviceWorker || navigator.serviceWorker.controller)
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

    await new Promise((resolve, _) => setTimeout(resolve, 1000));
    downloaded.add(reference);
    onProgress(downloaded);
  }
}
