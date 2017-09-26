import React from 'react';
import {Route} from 'react-router-dom';

import ChooseBook from '../ui/choose-book';
import ChooseChapter from '../ui/choose-chapter';

export default ({match: {path}}) =>
  <div className="fit">
    <Route exact path={`${path}`}       component={ChooseBook}/>
    <Route exact path={`${path}/:book`} component={ChooseChapter}/>
  </div>;

