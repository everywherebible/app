import React from 'react';

import {CHAPTER_COUNT} from '../data/model';
import bibles from '../db/bibles/index';
import download from '../db/download';

const Sorry = () =>
  <div>
    Sorry, but your browser doesn't support the offline feature.
  </div>

const Downloading = ({translation, download}) =>
  <div className="fit">
    <h1>{translation.toUpperCase()}</h1>

    <p>
    {(download.size / CHAPTER_COUNT * 100).toFixed(0)}%
    </p>

    <p>
    Downloading for offline usage.
    </p>
  </div>;

const Downloaded = ({translation}) =>
  <div className="fit">
    <h1>{translation.toUpperCase()}</h1>

    <p>
    Downloaded for offline usage.
    </p>
  </div>;

const Download = ({translation, download, setDownload}) =>
  download == null?
    <div className="fit">
      <h1>{translation.toUpperCase()}</h1>
      <h1>Download the </h1>
      <button onClick={() => setDownload(translation, new Set())}>Start</button>
    </div> :

    download.size === CHAPTER_COUNT?
      <Downloaded translation={translation}/> :
      <Downloading translation={translation} download={download}/>;

export default props =>
  'serviceWorker' in navigator?  <Download {...props}/> : <Sorry/>;
