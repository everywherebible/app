// @flow

import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Redirect} from 'react-router-dom';
import type Store from 'redux';

import Read from '../containers/read';
import Nav from '../ui/nav';

type Props = {store: Store, history: any};

export default ({store, history}: Props) =>
  <Provider store={store}>
    <Router history={history}>
      <main className="fit">
        <section className="fit">
          <Route path="/:passage" component={Read}/>
          <Route path="/" exact render={() => <Redirect to="/Genesis+1"/>}/>
        </section>
        <Nav style={{position: 'fixed', right: 0, bottom: 0, left: 0}}/>
      </main>
    </Router>
  </Provider>;
