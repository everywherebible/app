// @flow
/**
 * Service worker for app-specific logic.
 *
 * In development, this code will run alone as a service worker, and in
 * production this will get appended to the "sw-precache" code that's generated
 * by the build.
 */
/* eslint-disable no-restricted-globals */

import store from './db';
import {stringToReference, chapterIndex} from './data';

const isPassageLookup = (url: URL): boolean =>
  /^\/v2\/rest\/passageQuery/.test(url.pathname);

const fromDb = (url: URL): Promise<string> =>
  store().get(chapterIndex(stringToReference(url.searchParams.get('passage'))));

const toDb = (response: Response): Promise<any> =>
  response.text()
    .then(text =>
        store().set(chapterIndex(stringToReference(
              new URL(response.url).searchParams.get('passage'))),
      text));

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (isPassageLookup(url))
    event.respondWith(fromDb(url)
      .then(text => new Response(text, {status: 200}))
      .catch(error => {
        const fromNetwork = fetch(event.request);
        fromNetwork.then(response => response.clone()).then(toDb);
        return fromNetwork;
      }));
});
