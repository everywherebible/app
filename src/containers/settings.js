// @flow

import React from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import type {Match} from 'react-router';

import type {Action, Translation} from '../actions';
import {enableNightMode, setPreferences} from '../actions';
import type {State} from '../reducer';
import Download from '../ui/download';
import Settings from '../ui/settings';

type StateProps = {+enableNightMode: boolean, +translation: string};

const stateToProps = ({
      preferences: {
        enableNightMode,
        translation,
      },
    }: State): StateProps =>
  ({enableNightMode, translation});

type DispatchProps = {
  +setNightModeEnabled: boolean => any,
  +setTranslation: Translation => typeof undefined,
};

const dispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({
    setNightModeEnabled: enabled => dispatch(enableNightMode(enabled)),
    setTranslation: translation => dispatch(setPreferences({translation})),
  });

export default ({match: {path}}: {match: Match}) =>
  <div className="fit">
    <Route exact path={`${path}`}
      component={connect(stateToProps, dispatchToProps)(Settings)}/>
    <Route exact path={`${path}/download`}
      component={connect(stateToProps, dispatchToProps)(Download)}/>
  </div>;
