// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {ContextRouter} from 'react-router';
import {withRouter} from 'react-router-dom';
import debounce from 'lodash.debounce';

import {enableFocusMode, addToast, confirmFocusMode} from '../actions';
import type {Action, Translation} from '../actions';
import {
  chapterCounts,
  locationToReference,
  chapterToLocation,
  referenceToVerseNumId,
} from '../data/model';
import type {State} from '../reducer';
import Chapters from '../ui/chapters';
import ThatsNotInTheBible from '../ui/thats-not-in-the-bible';
import ConfirmFocusMode from '../ui/confirm-focus-mode';

type StateProps = {
  +chapterCache: {[number]: string},
  +enableFocusMode: boolean,
  +hasConfirmedFocusMode: boolean,
  +translation: Translation,
};

const stateToProps = ({
      chapters,
      preferences: {
        enableFocusMode,
        hasConfirmedFocusMode,
        translation,
      }
    }: State): StateProps =>
  ({
    chapterCache: chapters[translation],
    enableFocusMode,
    hasConfirmedFocusMode,
    translation,
  });

type DispatchProps = {
  +setFocusModeEnabled: boolean => any,
  +toast: string => any,
};

const dispatchToProps = (dispatch: Action => any): DispatchProps =>
  ({
    setFocusModeEnabled: enabled => dispatch(enableFocusMode(enabled)),
    toast: text => dispatch(addToast(text)),
    confirmFocusMode: () => dispatch(confirmFocusMode()),
  });

const onScroll = debounce((history, location, el) => {
  const path = chapterToLocation(locationToReference(location));
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
    toast,
    hasConfirmedFocusMode,
    translation,
    confirmFocusMode,
  } : StateProps & DispatchProps & ContextRouter) => {
    const reference = locationToReference(location);
    return <div className='fit'>
      {chapterCounts[reference.book]?
        <Chapters
          reference={reference}
          chapterCache={chapterCache}
          onReferenceChange={reference =>
            history.replace(`/${reference.book}+${reference.chapter}`)}
          onScroll={event => onScroll(history, location, event.currentTarget)}
          onClick={event => setFocusModeEnabled(!enableFocusMode)}
          getInitialScroll={getInitialScroll}
          toast={toast}
          translation={translation}/> :
        <ThatsNotInTheBible/>}
      {enableFocusMode && !hasConfirmedFocusMode?
        <ConfirmFocusMode confirmFocusMode={confirmFocusMode}/> :
        null}
    </div>;
});

export default withRouter(
    connect(stateToProps, dispatchToProps)(ChaptersWithRouter));
