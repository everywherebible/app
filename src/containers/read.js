// @flow

import {connect} from 'react-redux';

import {setReference} from '../actions';
import type {Action} from '../actions';
import type {Reference} from '../data';
import type {State} from '../reducer';
import Chapters from '../ui/chapters';

type StateProps = {
  +reference: Reference,
  +chapterCache: {[number]: string},
};
type DispatchProps = {+onReferenceChange: (Reference) => typeof undefined};

const mapStateToProps = (state: State): StateProps =>
  ({reference: state.reading, chapterCache: state.chapters});

const mapDispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({onReferenceChange: reference => dispatch(setReference(reference))});

export default connect(mapStateToProps, mapDispatchToProps)(Chapters);
