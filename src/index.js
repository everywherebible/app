import createHistory from 'history/createBrowserHistory';
import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';

import {locationToReference} from './data';
import {updateStoreWithPassageText} from './fetcher';
import recentReferenceTracker from './recent-reference-tracker';
import reducer, {DEFAULT} from './reducer';
import registerServiceWorker from './register-service-worker';
import App from './ui/app';
import {READ_PATH_RE} from './ui/nav';
import './ui/index.css';
import './ui/normalize.css';

const store = createStore(reducer, DEFAULT);
const history = createHistory();

history.listen((location, action) =>
  READ_PATH_RE.exec(location.pathname)?
    updateStoreWithPassageText(store, locationToReference(location)) : null);

render(<App store={store} history={history}/>, document.getElementById('root'));

if (READ_PATH_RE.exec(window.location.pathname))
  updateStoreWithPassageText(store, locationToReference(window.location));

recentReferenceTracker(store);

registerServiceWorker();


