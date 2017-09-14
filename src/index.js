import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';

import './ui/normalize.css';
import './ui/index.css';
import reducer, {DEFAULT} from './reducer';
import registerServiceWorker from './registerServiceWorker';
import App from './ui/app';

const store = createStore(reducer, DEFAULT);

render(<App store={store}/>, document.getElementById('root'));
registerServiceWorker();
