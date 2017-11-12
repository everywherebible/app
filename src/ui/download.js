import React from 'react';

import bibles from '../db/bibles/index';
import download from '../db/download';

window.bibles = bibles;
window.download = download;

export default () =>
  <div>
    Download
  </div>
