import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import createHistory from 'history/createBrowserHistory';

window.requestAnimationFrame = callback => setTimeout(callback, 0);

import reducer from '../reducer';

it('renders without crashing', () => {
  // lazily import this so the rAF polyfill above works
  const app = require('./app');
  const div = document.createElement('div');
  const store = createStore(reducer);
  const history = createHistory();
  render(<app.default store={store} history={history}/>, div);
});
