import React from 'react';
import {Link} from 'react-router-dom';

import {chapterCounts} from '../data';

export default ({match: {params: {book}}, addRecent}) =>
  <div
      className="fit"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        textAlign: 'center',
        overflowY: 'scroll',
      }}>
    {[...Array(chapterCounts[book])].map((_, i) =>
      <Link
          key={i}
          to={`/${book}+${i + 1}`}
          onClick={event => addRecent({book, chapter: i + 1, verse: 1})}
          style={{
            width: '2rem',
            padding: '1rem',
            textDecoration: 'none',
            color: 'black',
          }}>
        {i + 1}
      </Link>)}
  </div>
