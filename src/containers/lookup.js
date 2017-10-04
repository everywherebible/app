// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {Match} from 'react-router';
import {Route} from 'react-router-dom';

import {addRecent} from '../actions';
import type {Action} from '../actions';
import type {Reference} from '../data';
import {populateStoreWithRecents} from '../recent-reference-tracker';
import type {State} from '../reducer';
import ChooseBook from '../ui/choose-book';
import ChooseChapter from '../ui/choose-chapter';

const mapStateToProps = ({recents}: State) => ({recents});

const mapDispatchToProps = (dispatch: Action => any) =>
  ({
    addRecent: (reference: Reference) => dispatch(addRecent(reference)),
    populateStoreWithRecents: () => populateStoreWithRecents(dispatch),
  });

type Props = {match: Match};

export default ({match: {path}}: Props) =>
  <div className="fit">
    <Route exact path={`${path}`}
      component={connect(mapStateToProps, mapDispatchToProps)(ChooseBook)}/>
    <Route exact path={`${path}/:book`}
      component={connect(mapStateToProps, mapDispatchToProps)(ChooseChapter)}/>
  </div>;

