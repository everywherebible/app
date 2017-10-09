import React from 'react';

import './chapters.css';
import {chapterIndex, reference as referenceFromIndex} from '../data/model';
import {NAV_HEIGHT} from './nav';
import PagerView from './pagerview';

const handleFootnoteClicks = event => {
  const href = event.target.href;

  if (!href)
    return;

  const el = event.currentTarget.querySelector(new URL(href).hash);

  if (el) {
    el.scrollIntoView();
    event.preventDefault();
  }
};

const Chapter = ({reference, text, onClick}) =>
  text == null?
    <div
        className="fit"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
      <div>Loading {reference.book} {reference.chapter}</div>
    </div> :
    <div
      style={{
        marginBottom: NAV_HEIGHT,
        padding: '0 1rem 1rem 1rem',
        lineHeight: '1.4em',
      }}

      dangerouslySetInnerHTML={{__html: text}}

      onClick={event => {
        handleFootnoteClicks(event);

        if (!event.defaultPrevented && onClick)
          onClick(event);
      }}
      />;

export default ({
      reference,
      chapterCache,
      onReferenceChange,
      onScroll,
      getInitialScroll,
      onClick
    }) =>
  <PagerView
    index={chapterIndex(reference)}
    onIndexChange={index => onReferenceChange(referenceFromIndex(index))}
    onScroll={onScroll || (() => null)}
    getInitialScroll={getInitialScroll || (() => null)}
    renderPage={index =>
      <Chapter
        reference={referenceFromIndex(index)}
        onClick={onClick}
        text={chapterCache[index]}/>}/>;

