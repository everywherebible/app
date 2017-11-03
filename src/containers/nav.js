// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import type {State} from '../reducer';
import Nav from '../ui/nav';

const stateToProps = ({preferences: {enableFocusMode}}: State) =>
  ({enableFocusMode});

const BASE_STYLE = {transition: 'opacity 0.2s ease-in-out'};

const HideableNav = ({enableFocusMode}) =>
  enableFocusMode?
    <Nav style={{...BASE_STYLE, opacity: '0.0', pointerEvents: 'none'}}/> :
    <Nav style={{...BASE_STYLE, opacity: '1.0'}}/>;

export default withRouter(connect(stateToProps)(HideableNav));
