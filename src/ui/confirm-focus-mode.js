import React from 'react';

export default ({confirmFocusMode}) =>
  <div style={{
        position: 'absolute',
        left: '1.3rem',
        right: '1.3rem',
        bottom: '3rem',
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        borderRadius: '1rem',
      }}>
    <p><b>Focus mode enabled</b></p>

    <p style={{fontSize: '0.8em'}}>Tap the text to show the navigation</p>

    <p style={{marginBottom: 0}}>
      <button type='button' onClick={confirmFocusMode} style={{
            color: 'white',
            borderTop: '1px solid #444',
            backgroundColor: 'black',
            width: '100%',
            padding: '0.5rem 0',
            borderRadius: '0 0 1rem 1rem',
          }}>
        Got it
      </button>
    </p>
  </div>
