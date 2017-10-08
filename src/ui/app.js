// @flow

import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Redirect, Switch} from 'react-router-dom';
import type Store from 'redux';

import Lookup from '../containers/lookup';
import Main from '../containers/main';
import Nav from '../containers/nav';
import Read from '../containers/read';
import Settings from '../containers/settings';
import type State from '../reducer';

type Props = {store: Store<State>, history: any};

const RedirectToGenesis1 = () => <Redirect to='/Genesis+1'/>;

export default ({store, history}: Props) =>
  <Provider store={store}>
    <Router history={history}>
      <Main>
        <section className='fit'>
          <Switch>
            <Route path='/lookup'         component={Lookup}/>
            <Route path='/settings'       component={Settings}/>
            <Route path='/:passage' exact component={Read}/>
            <Route path='/'         exact component={RedirectToGenesis1}/>
          </Switch>
        </section>
        <Nav style={{position: 'fixed', right: 0, bottom: 0, left: 0}}/>
      </Main>
    </Router>
  </Provider>;
