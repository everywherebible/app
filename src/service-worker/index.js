// @flow
/**
 * Service worker for app-specific logic.
 *
 * In development, this code will run alone as a service worker, and in
 * production this will get appended to the "sw-precache" code that's generated
 * by the build.
 */
/* eslint-disable no-restricted-globals */

import {FROM_DB_HEADER, FROM_SERVICE_WORKER_HEADER} from '../constants';
import esvStore from '../db/bibles/esv';
import kjvStore from '../db/bibles/kjv';
import {
  pathStringToReference,
  apiPathToReference,
  chapterIndex,
} from '../data/model';
import transform from '../data/transform';
import {ESV_BASE, fetchOrThrow, esvLookup} from '../data/fetcher';
import type {EsvApiJson} from '../data/fetcher';
import log from '../log';

const isPassageLookup = (url: URL): boolean =>
  ESV_BASE.hostname === url.hostname || /^\/api/.test(url.pathname);

const logStorage = (url, reference, index) =>
  log(`Storing ${url.toString()} with reference ${JSON.stringify(reference)} as ${index}`,
      'color: #888; font-size: 0.8em');

const fromKjvDb = (url: URL): Promise<string> => {
  return kjvStore().get(chapterIndex(apiPathToReference(url.pathname)));
}

const toKjvDb = (url: URL, text: string) => {
  const reference = apiPathToReference(url.pathname);
  const index = chapterIndex(reference);
  logStorage(url, reference, index);
  kjvStore().set(index, text);
};

const fromEsvDb = (url: URL): Promise<string> => {
  const passageString = url.searchParams.get('q');
  return esvStore().get(chapterIndex(pathStringToReference(passageString)));
}

const toEsvDb = (url: URL, text: string) => {
  const passage = url.searchParams.get('q');
  const reference = pathStringToReference(passage);
  const index = chapterIndex(reference);

  if (Number.isNaN(index))
    return;

  logStorage(url, reference, index);
  esvStore().set(index, text);
};

const createSwResponse = (text: string) =>
  new Response(text, {
    status: 200,
    headers: {[FROM_SERVICE_WORKER_HEADER]: true},
  });

self.addEventListener('fetch', event => {
  const request: Request = event.request;
  const url = new URL(request.url);
  const isEsv = ESV_BASE.hostname === url.hostname;

  if (!isPassageLookup(url))
    return;

  const fromDb: Promise<string> = isEsv? fromEsvDb(url) : fromKjvDb(url);

  event.respondWith(fromDb
    .then(text => {
      if (isEsv) {
        const esvApiJson: EsvApiJson = {passages: [text]};
        text = JSON.stringify(esvApiJson);
      }
      log(`Serving ${url.pathname}${url.search} from db`,
          'color: #23bd23; font-size: 0.8em');
      return new Response(text, {
        status: 200,
        headers: {[FROM_DB_HEADER]: true, [FROM_SERVICE_WORKER_HEADER]: true},
      });
    })
    .catch(error => {
      const request: Promise<Response> = isEsv?
        esvLookup(url)
          .then(response => response.json())
          .then(esvApiJson => esvApiJson.passages[0])
          .then(transform)
          .then(text => {
            const esvApiJson: EsvApiJson = {passages: [text]};
            toEsvDb(url, text);
            return createSwResponse(JSON.stringify(esvApiJson));
          }) :

        fetchOrThrow(url)
          .then(response => response.text())
          .then(text => {
            toKjvDb(url, text);
            return createSwResponse(text);
          });

      return request;
    }));
});
