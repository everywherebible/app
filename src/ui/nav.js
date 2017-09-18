import React from 'react';
import {NavLink} from 'react-router-dom';

import Book from '../img/book';

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
      height: '3rem',
    }}>
    <NavLink to="/">
      <Book style={{transform: 'scale(1.35)'}}/>
    </NavLink>
  </nav>
