// @flow

import React from 'react';
import {connect} from 'react-redux';

import {next} from '../actions';
import type {Action} from '../actions';
import type {Reference, State} from '../reducer';

type StateProps = {+reference: Reference};
type DispatchProps = {+next: () => any};
type Props = StateProps & DispatchProps;

const Read = ({reference: {book, chapter}}: Props) =>
  <div>{book.toString() + ' ' + chapter.toString()}</div>;

const mapStateToProps = (state: State): StateProps =>
  ({reference: state.reading});

const mapDispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({next: () => dispatch(next())});

export default connect(mapStateToProps, mapDispatchToProps)(Read);
