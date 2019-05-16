import {createBrowserHistory} from 'history';
import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';

import {enableFocusMode} from './actions';
import {locationToReference} from './data/model';
import {updateStoreWithPassageText} from './data/fetcher';
import preferenceTracker,
  {populateStoreWithPreferences} from './data/preferences';
import recentReferenceTracker,
  {populateStoreWithRecents} from './data/recent-reference-tracker';
import reducer, {DEFAULT} from './reducer';
import registerServiceWorker from './service-worker/register';
import App from './ui/app';
import {READ_PATH_RE} from './ui/nav';
import './ui/normalize.css';
import './ui/index.css';

const store = createStore(reducer, DEFAULT);
const history = createBrowserHistory();

if (sessionStorage.redirect) {
  history.replace(sessionStorage.redirect);
  delete sessionStorage.redirect;
}

history.listen((location, action) =>
  READ_PATH_RE.exec(location.pathname)?
    updateStoreWithPassageText(store, locationToReference(location)) :
    store.dispatch(enableFocusMode(false)));

Promise.all([
  populateStoreWithPreferences(store.dispatch),
  populateStoreWithRecents(store.dispatch)
]).then(() => {
  render(
    <App store={store} history={history}/>,
    document.getElementById('root'));

  if (READ_PATH_RE.exec(window.location.pathname))
    updateStoreWithPassageText(store, locationToReference(window.location));

  preferenceTracker(store);
  recentReferenceTracker(store);
});

registerServiceWorker();
