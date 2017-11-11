import React, {Component} from 'react';

import './chapters.css';
import copyToClipboard from './copy-to-clipboard';
import {
  chapterIndex,
  reference as referenceFromIndex,
  before,
  after,
  referenceToLocation,
  verseNumIdToReference
} from '../data/model';
import {NAV_HEIGHT} from './nav';
import PagerView from './pagerview';

const BREAK_POINT = 700;

const handleFootnoteClicks = event => {
  const href = event.target.href;

  if (!href)
    return;

  const el = event.currentTarget.querySelector(new URL(href).hash);

  if (el) {
    el.scrollIntoView();
    event.preventDefault();
  }
};

const getClickedReference = event => {
  if (event.target.classList.contains('verse-num') ||
      event.target.classList.contains('verse'))
    return verseNumIdToReference(event.target.id);
}

class Chapter extends Component {
  lastClick = null;

  onClick = event => {
    handleFootnoteClicks(event);

    if (!event.defaultPrevented && this.props.onClick)
      this.props.onClick(event);

    if (event.defaultPrevented)
      return;

    if (this.lastClick != null && Date.now() - this.lastClick < 200) {
      const reference = getClickedReference(event);

      if (reference != null) {
        const {book, chapter, verse} = reference;

        copyToClipboard(
            new URL(
                referenceToLocation(reference),
                window.location)
              .toString());

        this.props.toast(`Copied link to ${book} ${chapter}:${verse}`);
      }
    }

    this.lastClick = Date.now();
  }

  render() {
    return this.props.text == null?
      <div
          className="fit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
        <div>
          Loading {this.props.reference.book} {this.props.reference.chapter}
        </div>
      </div> :
      <div
          style={{
            marginBottom: NAV_HEIGHT,
            padding: '0 1rem 1rem 1rem',
            lineHeight: '1.4em',
          }}>
        <div
          style={{maxWidth: `${BREAK_POINT - 100}px`, margin: 'auto'}}
          dangerouslySetInnerHTML={{__html: this.props.text}}
          onClick={this.onClick}/>
        {this.props.translation === 'esv'?
           <p
              className='footnotes'
              style={{
                fontSize: '0.7em',
                maxWidth: BREAK_POINT - 100,
                margin: 'auto',
              }}>
            <a href='https://www.esv.org'>ESV</a>
          </p> :
          null}
      </div>
      ;
  }
};

export default ({
      reference,
      chapterCache,
      onReferenceChange,
      onScroll,
      getInitialScroll,
      onClick,
      toast,
      translation,
    }) =>
  <div className='fit'>
    <PagerView
      index={chapterIndex(reference)}
      onIndexChange={index => onReferenceChange(referenceFromIndex(index))}
      onScroll={onScroll || (() => null)}
      getInitialScroll={getInitialScroll || (() => null)}
      renderPage={index =>
        <Chapter
          reference={referenceFromIndex(index)}
          onClick={onClick}
          text={chapterCache[index]}
          toast={toast}
          translation={translation}
          />}/>
    {window.innerWidth > BREAK_POINT?
      <button
          type='button'
          onClick={() => onReferenceChange(before(reference))}
          className='nav-button'
          style={{left: '1rem', transform: 'rotate(0.5turn)'}}>
        &#10140;
      </button> : null}
    {window.innerWidth > BREAK_POINT?
      <button
          type='button'
          onClick={() => onReferenceChange(after(reference))}
          className='nav-button'
          style={{right: '1rem'}}>
        &#10140;
      </button> : null}
  </div>
