import React from 'react';
import {NavLink} from 'react-router-dom';

import Book from '../img/book';

export const NAV_HEIGHT = '2.5rem';

export default () =>
  <nav style={{
      display: 'flex',
      position: 'fixed',
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      height: NAV_HEIGHT,
    }}>
    <NavLink to="/">
      <Book style={{transform: 'scale(1.35)'}}/>
    </NavLink>
  </nav>
