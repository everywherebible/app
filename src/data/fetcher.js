import {setChapterText} from "../actions";
import {FROM_DB_HEADER, FROM_SERVICE_WORKER_HEADER} from "../constants";
import log from "../log";

import {chapterIndex, before, after, CHAPTER_COUNT} from "./model";

import transform from "./transform";

export const ESV_BASE = new URL("https://api.esv.org/v3/passage/html/");
const ESV_KEY = "cecc457af593de97294057073c9be28d7ffdfaf9";
const KJV_BASE = new URL("https://everywherebible.org");

export const fetchOrThrow = (url, init) =>
  fetch(url, init).then(response => {
    if (!response.ok)
      throw new Error(`${response.url} failed with ${response.status}`);
    const fromDb = response.headers.get(FROM_DB_HEADER);
    const fromSw = response.headers.get(FROM_SERVICE_WORKER_HEADER);
    const source = fromDb ? "from DB" : fromSw ? "from SW" : "from network";
    log(`Received ${url.toString()} ${source}`, "font-size: 0.8em");
    return response;
  });

const esvChapterUrl = reference => {
  const url = new URL("", ESV_BASE);
  url.searchParams.set("q", `${reference.book} ${reference.chapter}`);
  return url;
};

const kjvChapterUrl = reference => {
  const book = reference.book
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/psalm$/, "psalms");
  return new URL(`/api/v1/kjv/${book}/${reference.chapter}.html`, KJV_BASE);
};

export const esvLookup = url => {
  return fetchOrThrow(url, {
    headers: {
      authorization: `Token ${ESV_KEY}`,
      accept: "application/json",
    },
  });
};

const fetchChapter = (store, reference) => {
  const translation = store.getState().preferences.translation;
  const request =
    translation === "kjv"
      ? fetchOrThrow(kjvChapterUrl(reference)).then(response => response.text())
      : esvLookup(esvChapterUrl(reference)).then(response => {
          const fromSw = response.headers.get(FROM_SERVICE_WORKER_HEADER);

          return response
            .json()
            .then(obj => obj.passages[0])
            .then(text => (fromSw ? text : transform(text)));
        });

  request.then(text =>
    store.dispatch(setChapterText(translation, reference, text))
  );

  return request;
};

const indexIsCached = (state, index) =>
  state.chapters[state.preferences.translation][index] != null;

export const updateStoreWithPassageText = (store, reference) => {
  const state = store.getState();
  const index = chapterIndex(reference);

  if (!indexIsCached(state, index)) fetchChapter(store, reference);

  if (index > 0 && !indexIsCached(state, index - 1))
    fetchChapter(store, before(reference));

  if (index < CHAPTER_COUNT && !indexIsCached(state, index + 1))
    fetchChapter(store, after(reference));
};
