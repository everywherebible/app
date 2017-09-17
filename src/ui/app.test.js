import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';

window.requestAnimationFrame = callback => setTimeout(callback, 0);

// import App from './app';
import reducer from '../reducer';

it('renders without crashing', () => {
  // lazily import this so the rAF polyfill above works
  const app = require('./app');
  const div = document.createElement('div');
  const store = createStore(reducer);
  render(<app.default store={store}/>, div);
});
