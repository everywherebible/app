import React from 'react';

import pkg from '../../package.json';

const REPO = pkg.repository.url.replace(/^git\+/, '');

const SMALL_FONT = '0.5rem';

export default () =>
  <div className='fit' style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 1rem',
      }}>
    <div style={{marginTop: '-3rem', textAlign: 'justify'}}>
      <h3 style={{textAlign: 'center'}}>{pkg.displayName}</h3>

      <p>
        Developed by <a href={REPO}>Aaron Stacy</a> and released under <a
        href={REPO + '/blob/dev/LICENSE'}>the {pkg.license} License</a>.
      </p>

      <p style={{fontSize: SMALL_FONT}}>
        Scripture quotations are from the ESV&reg; Bible (The Holy Bible,
        English Standard Version&reg;), copyright &copy; 2001 by Crossway, a
        publishing ministry of Good News Publishers. Used by <a
        href="http://www.esvapi.org/#copyright">permission</a>. All rights
        reserved. You may not copy or download more than 500 consecutive verses
        of the ESV Bible or more than one half of any book of the ESV Bible.
      </p>

      <p style={{fontSize: SMALL_FONT}}>
        Search icon made by <a
        href="https://www.flaticon.com/authors/lucy-g">Lucy G</a> from <a
        href="https://www.flaticon.com/">www.flaticon.com</a> is licensed by <a
        href="http://creativecommons.org/licenses/by/3.0/">CC 3.0 BY</a>
      </p>
    </div>
  </div>;
