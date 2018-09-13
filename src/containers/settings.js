// @flow

import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import type {Match} from 'react-router';

import type {Action} from '../actions';
import type {Translation, Reference} from '../data/model';
import {enableNightMode, setPreferences, setDownload} from '../actions';
import type {State} from '../reducer';
import Download from '../ui/download';
import Settings from '../ui/settings';

type StateProps = {
  +enableNightMode: boolean,
  +translation: string,
  +download: ?Set<Reference>,
};

const stateToProps = ({
      preferences: {
        enableNightMode,
        translation,
      },
      downloads,
    }: State): StateProps =>
  ({enableNightMode, translation, download: downloads[translation]});

type DispatchProps = {
  +setNightModeEnabled: boolean => any,
  +setTranslation: Translation => typeof undefined,
  +setDownload: (Translation, Set<Reference>) => typeof undefined,
};

const dispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({
    setNightModeEnabled: enabled => dispatch(enableNightMode(enabled)),
    setTranslation: translation => dispatch(setPreferences({translation})),
    setDownload: (translation, download) =>
      dispatch(setDownload(translation, download)),
  });

export default ({match: {path}}: {match: Match}) =>
  <div className="fit">
    <Switch>
      <Route path={`${path}/download`}
        component={connect(stateToProps, dispatchToProps)(Download)}/>
      <Route path={`${path}`}
        component={connect(stateToProps, dispatchToProps)(Settings)}/>
    </Switch>
  </div>;
