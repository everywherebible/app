// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import debounce from 'lodash.debounce';

import {locationToReference} from '../data';
import type {State} from '../reducer';
import Chapters from '../ui/chapters';

type StateProps = {+chapterCache: {[number]: string}};

const stateToProps = (state: State): StateProps =>
  ({chapterCache: state.chapters});

const onScroll = debounce((history, location, el) =>
    history.replace(`${location.pathname}?s=${el.scrollTop}`), 400);

const getInitialScroll = () => {
  const url = new URL(window.location);

  if (!url.searchParams)
    return 0;

  const scroll = parseInt(url.searchParams.get('s'), 10);

  return Number.isNaN(scroll)? 0 : scroll;
};

const ChaptersWithRouter = withRouter(({
    chapterCache,
    location,
    history,
  }) =>
    <Chapters
      reference={locationToReference(location)}
      chapterCache={chapterCache}
      onReferenceChange={reference =>
        history.replace(`/${reference.book}+${reference.chapter}`)}
      onScroll={event => onScroll(history, location, event.currentTarget)}
      getInitialScroll={getInitialScroll}/>);

export default withRouter(connect(stateToProps)(ChaptersWithRouter));
