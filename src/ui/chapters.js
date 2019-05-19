import React, {Component} from "react";

import "./chapters.css";
import copyToClipboard from "./copy-to-clipboard";
import {
  chapterIndex,
  before,
  after,
  referenceToLocation,
  verseNumIdToReference,
} from "../data/model";
import {NAV_HEIGHT_REM} from "./nav";

const BREAK_POINT = 700;

const handleFootnoteClicks = event => {
  const href = event.target.href;

  if (!href) return;

  const el = event.currentTarget.querySelector(new URL(href).hash);

  if (el) {
    el.scrollIntoView();
    event.preventDefault();
  }
};

const getClickedReference = event => {
  const el = event.target.classList.contains("woc")
    ? event.target.parentElement
    : event.target;

  if (el.classList.contains("verse-num") || el.classList.contains("verse"))
    return verseNumIdToReference(el.id);
};

class Chapter extends Component {
  lastClick = null;

  onClick = event => {
    handleFootnoteClicks(event);

    if (!event.defaultPrevented && this.props.onClick)
      this.props.onClick(event);

    if (event.defaultPrevented) return;

    if (this.lastClick != null && Date.now() - this.lastClick < 200) {
      const reference = getClickedReference(event);

      if (reference != null) {
        const {book, chapter, verse} = reference;

        copyToClipboard(
          new URL(referenceToLocation(reference), window.location).toString()
        );

        this.props.toast(`Copied link to ${book} ${chapter}:${verse}`);
      }
    }

    this.lastClick = Date.now();
  };

  render() {
    return this.props.text == null ? (
      <div
        className="fit"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div>
          Loading {this.props.reference.book} {this.props.reference.chapter}
        </div>
      </div>
    ) : (
      <div
        style={{
          marginBottom: `${NAV_HEIGHT_REM * 2}rem`,
          padding: "0 1rem 1rem 1rem",
          lineHeight: "1.4em",
        }}>
        <div
          style={{maxWidth: `${BREAK_POINT - 100}px`, margin: "auto"}}
          dangerouslySetInnerHTML={{__html: this.props.text}}
          onClick={this.onClick}
        />
        {this.props.translation === "esv" ? (
          <p
            className="footnotes"
            style={{
              fontSize: "0.7em",
              maxWidth: BREAK_POINT - 100,
              margin: "auto",
            }}>
            <a href="https://www.esv.org">ESV</a>
          </p>
        ) : null}
      </div>
    );
  }
}

const TRANSPARENT = {opacity: 0};
const VISIBLE = {opacity: 1};

export default ({
  reference,
  chapterCache,
  onReferenceChange,
  onScroll,
  getInitialScroll,
  onClick,
  toast,
  translation,
  enableFocusMode,
}) => (
  <div>
    <Chapter
      reference={reference}
      onClick={onClick}
      text={chapterCache[chapterIndex(reference)]}
      toast={toast}
      translation={translation}/>
    <button
      type="button"
      onClick={() => onReferenceChange(before(reference))}
      className="nav-button"
      style={{
        ...(enableFocusMode? TRANSPARENT : VISIBLE),
          left: "1rem",
          transform: "rotate(0.5turn)"
      }}>
      &#10140;
    </button>
    <button
      type="button"
      onClick={() => onReferenceChange(after(reference))}
      className="nav-button"
      style={{...(enableFocusMode? TRANSPARENT : VISIBLE), right: "1rem"}}>
      &#10140;
    </button>
  </div>
);
