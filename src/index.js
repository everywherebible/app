import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';

import {updateStoreWithPassageText} from './fetcher';
import reducer, {DEFAULT} from './reducer';
import registerServiceWorker from './registerServiceWorker';
import App from './ui/app';
import './ui/index.css';
import './ui/normalize.css';

const store = createStore(reducer, DEFAULT);

store.subscribe(() => updateStoreWithPassageText(store, store.getState()));

render(<App store={store}/>, document.getElementById('root'));

updateStoreWithPassageText(store, store.getState());

registerServiceWorker();

window.store = store;
