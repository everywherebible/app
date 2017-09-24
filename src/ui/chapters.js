import React from 'react';

import './chapters.css';
import {chapterIndex, reference as referenceFromIndex} from '../data';
import {NAV_HEIGHT} from '../ui/nav';
import PagerView from '../ui/pagerview';

const Chapter = ({reference, text}) =>
  text == null?
    <div
        className="fit"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div>
        Loading {reference.book} {reference.chapter}
      </div>
    </div> :
    <div
      style={{
        marginBottom: NAV_HEIGHT,
        padding: '0 1rem 1rem 1rem',
        textAlign: 'justify',
        lineHeight: '1.4em',
      }}
      dangerouslySetInnerHTML={{__html: text}}/>;

export default ({reference, chapterCache, onReferenceChange}) =>
  <PagerView
    index={chapterIndex(reference)}
    onIndexChange={index => onReferenceChange(referenceFromIndex(index))}
    renderPage={index =>
      <Chapter
        reference={referenceFromIndex(index)}
        text={chapterCache[index]}/>}/>;

