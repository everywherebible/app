// @flow

import {connect} from 'react-redux';

import type {Action, Translation} from '../actions';
import {enableNightMode, setPreferences} from '../actions';
import type {State} from '../reducer';
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

export default connect(stateToProps, dispatchToProps)(Settings);
