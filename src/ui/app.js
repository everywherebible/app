import React from 'react';
import {Provider} from 'react-redux';

import Read from './read';

export default ({store}) =>
  <Provider store={store}>
    <Read/>
  </Provider>
