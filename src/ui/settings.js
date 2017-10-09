import React from 'react';
import {Link} from 'react-router-dom';

import type {StateProps, DispatchProps} from '../containers/settings';

type Props = StateProps & DispatchProps;

const ROW_HEIGHT = '3rem';
const GUTTER = '1rem';

export default ({enableNightMode, setNightModeEnabled}: Props):
    React$Element<any> =>
  <div>
    <label
        style={{
          display: 'block',
          lineHeight: ROW_HEIGHT,
          marginLeft: GUTTER,
        }}>
      <span>Night Mode</span>
      <input
          style={{
            float: 'right',
            height: ROW_HEIGHT,
            margin: '0 '  + GUTTER,
          }}
          type='checkbox'
          checked={enableNightMode}
          onChange={event => setNightModeEnabled(!enableNightMode)}/>
    </label>
    <Link
        to='/about'
        style={{
          lineHeight: ROW_HEIGHT,
          marginLeft: GUTTER,
          textDecoration: 'none',
        }}>
      About
    </Link>
  </div>;

