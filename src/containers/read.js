// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {ContextRouter} from 'react-router';
import {withRouter} from 'react-router-dom';
import debounce from 'lodash.debounce';

import {enableFocusMode} from '../actions';
import type {Action} from '../actions';
import {
  locationToReference,
  referenceToLocation,
  referenceToVerseNumId,
} from '../data';
import type {State} from '../reducer';
import Chapters from '../ui/chapters';

type StateProps = {
  +chapterCache: {[number]: string},
  +enableFocusMode: boolean,
};

const stateToProps = (state: State): StateProps =>
  ({chapterCache: state.chapters, enableFocusMode: state.enableFocusMode});

type DispatchProps = {+setFocusModeEnabled: boolean => any};

const dispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({setFocusModeEnabled: enabled => dispatch(enableFocusMode(enabled))});

const onScroll = debounce((history, location, el) => {
  const path = referenceToLocation(locationToReference(location));
  return history.replace(`${path}?s=${el.scrollTop}`)
}, 400);

const getInitialScroll = () => {
  const url = new URL(window.location);

  if (!url.searchParams)
    return 0;

  const scroll = parseInt(url.searchParams.get('s'), 10);

  if (!Number.isNaN(scroll))
    return scroll;

  const reference = locationToReference(window.location);

  if (reference.verse !== 1)
    return root => {
      const el = root.querySelector('#' + referenceToVerseNumId(reference));
      return el? el.offsetTop : 0;
    };
  else
    return 0;
};

const ChaptersWithRouter = withRouter(({
    chapterCache,
    location,
    history,
    setFocusModeEnabled,
    enableFocusMode,
  } : StateProps & DispatchProps & ContextRouter) =>
    <Chapters
      reference={locationToReference(location)}
      chapterCache={chapterCache}
      onReferenceChange={reference =>
        history.replace(`/${reference.book}+${reference.chapter}`)}
      onScroll={event => onScroll(history, location, event.currentTarget)}
      onClick={event => setFocusModeEnabled(!enableFocusMode)}
      getInitialScroll={getInitialScroll}/>);

export default withRouter(
    connect(stateToProps, dispatchToProps)(ChaptersWithRouter));
