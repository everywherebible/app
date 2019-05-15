// @flow

import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Redirect, Switch} from 'react-router-dom';
import type Store from 'redux';

import About from './about';
import Lookup from '../containers/lookup';
import Main from '../containers/main';
import Nav from '../containers/nav';
import Read from '../containers/read';
import Settings from '../containers/settings';
import Toast from '../containers/toast';
import type {Reference} from '../data/model';
import {chapterToLocation} from '../data/model';
import type State from '../reducer';

type Props = {store: Store<State>, history: any};

const redirectToLastChapter = (reference: ?Reference) =>
  () => <Redirect to={reference == null?
    '/Genesis+1' :
    chapterToLocation(reference)}/>;

export default ({store, history}: Props) =>
  <Provider store={store}>
    <Router history={history}>
      <Main>
        <section className='fit'>
          <Switch>
            <Route path='/lookup'         component={Lookup}/>
            <Route path='/settings'       component={Settings}/>
            <Route path='/about'          component={About}/>
            <Route path='/:passage' exact component={Read}/>
            <Route path='/'         exact component={
              redirectToLastChapter(store.getState().recents[0])}/>
          </Switch>
        </section>
        <Toast/>
        <Nav style={{position: 'fixed', right: 0, bottom: 0, left: 0}}/>
      </Main>
    </Router>
  </Provider>;
