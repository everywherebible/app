// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {locationToReference} from '../data';
import type {State} from '../reducer';
import Chapters from '../ui/chapters';

type StateProps = {+chapterCache: {[number]: string}};

const stateToProps = (state: State): StateProps =>
  ({chapterCache: state.chapters});

const ChaptersWithRouter = withRouter(({
    chapterCache,
    location,
    history,
  }) =>
    <Chapters
      reference={locationToReference(location)}
      chapterCache={chapterCache}
      onReferenceChange={reference =>
        history.replace(`/${reference.book}+${reference.chapter}`)}/>);

export default withRouter(connect(stateToProps)(ChaptersWithRouter));
