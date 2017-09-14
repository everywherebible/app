import React from 'react';
import {Provider} from 'react-redux';

import Read from '../containers/read';

export default ({store}) =>
  <Provider store={store}>
    <Read/>
  </Provider>
