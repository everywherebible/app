import createHistory from 'history/createBrowserHistory';
import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';

import {locationToReference} from './data';
import {updateStoreWithPassageText} from './fetcher';
import reducer, {DEFAULT} from './reducer';
import registerServiceWorker from './register-service-worker';
import App from './ui/app';
import './ui/index.css';
import './ui/normalize.css';

const store = createStore(reducer, DEFAULT);
const history = createHistory();

history.listen((location, action) =>
  updateStoreWithPassageText(store, locationToReference(location)));

render(<App store={store} history={history}/>, document.getElementById('root'));

updateStoreWithPassageText(store, locationToReference(window.location));

registerServiceWorker();
