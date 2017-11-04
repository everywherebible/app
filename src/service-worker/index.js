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
import store from '../db/bibles/esv';
import {stringToReference, chapterIndex} from '../data/model';
import transform from '../data/transform';
import {lookup} from '../data/fetcher';
import type {EsvApiJson} from '../data/fetcher';

const isPassageLookup = (url: URL): boolean =>
  /^\/v3\/passage\/html/.test(url.pathname);

const fromDb = (url: URL): Promise<string> => {
  const passageString = url.searchParams.get('q');
  return store().get(chapterIndex(stringToReference(passageString)));
}

const toDb = (url: URL, text: string) => {
  const passage = url.searchParams.get('q');
  const reference = stringToReference(passage);
  const index = chapterIndex(reference);

  if (Number.isNaN(index))
    return;

  if (process.env.NODE_ENV === 'development')
    console.log(`storing ${url.toString()} (${passage})
                 with reference ${JSON.stringify(reference)}
                 as ${index}`);

  store().set(index, text);
};

self.addEventListener('fetch', event => {
  const request: Request = event.request;
  const url = new URL(request.url);

  if (isPassageLookup(url)) {
    event.respondWith(fromDb(url)
      .then(text => {
        const esvApiJson: EsvApiJson = {passages: [text]};
        return new Response(JSON.stringify(esvApiJson), {
          status: 200,
          headers: {[FROM_DB_HEADER]: true, [FROM_SERVICE_WORKER_HEADER]: true},
        });
      })
      .catch(error => {
        return lookup(url)
          .then(response => response.json())
          .then(esvApiJson => esvApiJson.passages[0])
          .then(transform)
          .then(text => {
            toDb(new URL(request.url), text);
            const esvApiJson: EsvApiJson = {passages: [text]};
            return new Response(JSON.stringify(esvApiJson), {
              status: 200,
              headers: {[FROM_SERVICE_WORKER_HEADER]: true},
            });
          })
      }));
  }
});
