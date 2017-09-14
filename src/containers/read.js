// @flow

import React from 'react';
import {connect} from 'react-redux';

import {setReference} from '../actions';
import type {Action} from '../actions';
import {chapterIndex, reference as referenceFromIndex} from '../data';
import type {Reference} from '../data';
import type {State} from '../reducer';
import PagerView from '../ui/pagerview';

type StateProps = {+reference: Reference};
type DispatchProps = {+onReferenceChange: (Reference) => typeof undefined};

const mapStateToProps = (state: State): StateProps =>
  ({reference: state.reading});

const mapDispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({onReferenceChange: reference => dispatch(setReference(reference))});

const Chapters = ({reference, onReferenceChange}) =>
  <PagerView
    index={chapterIndex(reference)}
    onIndexChange={index => onReferenceChange(referenceFromIndex(index))}/>;

export default connect(mapStateToProps, mapDispatchToProps)(Chapters);
