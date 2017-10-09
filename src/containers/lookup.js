// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {Match} from 'react-router';
import {Route} from 'react-router-dom';

import {addRecent} from '../actions';
import type {Action} from '../actions';
import type {Reference} from '../data/model';
import {populateStoreWithRecents} from '../data/recent-reference-tracker';
import type {State} from '../reducer';
import ChooseBook from '../ui/choose-book';
import ChooseChapter from '../ui/choose-chapter';

const stateToProps = ({recents}: State) => ({recents});

const dispatchToProps = (dispatch: Action => any) =>
  ({
    addRecent: (reference: Reference) => dispatch(addRecent(reference)),
    populateStoreWithRecents: () => populateStoreWithRecents(dispatch),
  });

type Props = {match: Match};

export default ({match: {path}}: Props) =>
  <div className="fit">
    <Route exact path={`${path}`}
      component={connect(stateToProps, dispatchToProps)(ChooseBook)}/>
    <Route exact path={`${path}/:book`}
      component={connect(stateToProps, dispatchToProps)(ChooseChapter)}/>
  </div>;

