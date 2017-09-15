import React from 'react';

import {chapterIndex, reference as referenceFromIndex} from '../data';
import PagerView from '../ui/pagerview';

const Chapter = ({reference}) =>
  <div
      className="fit"
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div>
      Loading {reference.book} {reference.chapter}
    </div>
  </div>;

export default ({reference, onReferenceChange}) =>
  <PagerView
    index={chapterIndex(reference)}
    onIndexChange={index => onReferenceChange(referenceFromIndex(index))}
    renderPage={index => <Chapter reference={referenceFromIndex(index)}/>}/>;

