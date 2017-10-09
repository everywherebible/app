// @flow

import {connect} from 'react-redux';

import type {Action} from '../actions';
import {enableNightMode} from '../actions';
import type {State} from '../reducer';
import Settings from '../ui/settings';

type StateProps = {+enableNightMode: boolean};

const stateToProps = ({preferences: {enableNightMode}}: State): StateProps =>
  ({enableNightMode});

type DispatchProps = {+setNightModeEnabled: boolean => any};

const dispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({setNightModeEnabled: enabled => dispatch(enableNightMode(enabled))});

export default connect(stateToProps, dispatchToProps)(Settings);
