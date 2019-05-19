// window.requestAnimationFrame = callback => setTimeout(callback, 0);

import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {createBrowserHistory} from 'history';

import App from './app';
import reducer from '../reducer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore(reducer);
  const history = createBrowserHistory();
  render(<App store={store} history={history}/>, div);
});
