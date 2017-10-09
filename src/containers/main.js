// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import type {State} from '../reducer';

type Props = {+enableNightMode: boolean, children?: any};

const stateToProps = ({preferences: {enableNightMode}}: State): Props =>
  ({enableNightMode});

const Main = ({enableNightMode, children}: Props): React$Element<any> =>
  <main className={`fit ${enableNightMode? 'night-mode' : ''}`}>
    {children}
  </main>

export default withRouter(connect(stateToProps)(Main));
