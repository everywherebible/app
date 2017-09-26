import React from 'react';

import './chapters.css';
import {chapterIndex, reference as referenceFromIndex} from '../data';
import {NAV_HEIGHT} from '../ui/nav';
import PagerView from '../ui/pagerview';

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

const Chapter = ({reference, text}) =>
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
        textAlign: 'justify',
        lineHeight: '1.4em',
      }}

      dangerouslySetInnerHTML={{__html: text}}

      onClick={handleFootnoteClicks}
      />;

export default ({
      reference,
      chapterCache,
      onReferenceChange,
      onScroll,
      getInitialScroll,
    }) =>
  <PagerView
    index={chapterIndex(reference)}
    onIndexChange={index => onReferenceChange(referenceFromIndex(index))}
    renderPage={index =>
      <Chapter
        reference={referenceFromIndex(index)}
        text={chapterCache[index]}/>}
        onScroll={onScroll || (() => null)}
        getInitialScroll={getInitialScroll || (() => null)}/>;

