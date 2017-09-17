// @flow

import React, {Component} from 'react';

import {CHAPTER_COUNT} from '../data';

if (!process.env.TEST)
  require('web-animations-js'); // TODO: a lot of browsers don't need this

type Children =
      typeof undefined
    | null
    | boolean
    | number
    | string
    | React$Element<any>
    | Iterable<React$Element<any>>;

type PageProps = {
  onScroll?: (Event) => any,
  style: {[string]: string},
  index: number,
  pageScrollDepths: {[number]: number},
  children: Children,
};

class Page extends Component<PageProps> {
  static defaultProps = {onScroll: event => null};

  root = null;

  componentDidUpdate(prevProps) {
    const {index, pageScrollDepths} = this.props;

    if (this.root != null && prevProps.index !== index) {
      let scrollDepth = pageScrollDepths[index];
      if (scrollDepth == null)
        scrollDepth = 0;
      this.root.scrollTo(0, scrollDepth);
    }
  }

  render() {
    const {onScroll, children, style} = this.props;

    return <div
          className="fit"
          ref={root => this.root = root}
          onScroll={onScroll}
          style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${window.innerWidth}px`,
              display: 'inline-block',
              overflowY: 'scroll',
              WebkitOverflowScrolling: 'touch',
              ...style
            }}>
        {children}
      </div>;
  }
}

type Touch = {+screenX: number, +screenY: number};

type Props = {
  index: number,
  onIndexChange: (number) => typeof undefined,
  renderPage: (number) => Children,
};

type State = {
  touchStart?: ?Touch,
  startTime?: ?number,
  touchMove?: ?Touch,
  moveTime?: ?number,
  toAnimate?: ?number,
};

type Animatable = {animate: (any, number) => any};

/** Cheesey pager view. */
export default class PagerView extends Component<Props, State> {
  static defaultProps = {
    renderPage: index =>
      <div style={{backgroundColor: ['red', 'green', 'blue'][index % 3]}}>
        Page {index}
      </div>
  };

  // seems more performant to keep this out of state/props?
  pageScrollDepths = {};

  onPageScroll = (event: Event) => {
    if (!(event.currentTarget instanceof HTMLElement))
      return;
    this.pageScrollDepths[this.props.index] = event.currentTarget.scrollTop;
  }

  onTouchStart = (event: SyntheticTouchEvent<HTMLDivElement>) => this.setState({
    touchStart: event.touches[0],
    startTime: event.timeStamp,
  });

  onTouchMove = (event: SyntheticTouchEvent<HTMLDivElement>) => this.setState({
    touchMove: event.touches[0],
    moveTime: event.timeStamp,
  });

  onTouchEnd = () => this.updateCurrentPage();

  track: ?Animatable;

  constructor() {
    super();
    this.state = {};
  }

  /** Track offset ignoring swiping or animation. */
  restingOffset(): number {
    return this.props.index * -window.innerWidth;
  }

  /** Horizontal delta caused by swiping. */
  touchOffset(): number {
    if (this.state.touchMove == null || this.state.touchStart == null)
      return 0;
    else
      return this.state.touchMove.screenX - this.state.touchStart.screenX;
  }

  /** Track offset taking swiping into account, but ignoring animation. */
  offset(): number {
    if (this.state.touchMove == null)
      return this.restingOffset();
    else
      return this.restingOffset() + this.touchOffset();
  }

  /** True if a gesture is considered a flick. */
  isFlick(): boolean {
    const {touchStart, startTime, touchMove, moveTime} = this.state;

    if (touchStart == null ||
        startTime == null ||
        touchMove == null ||
        moveTime == null)
      return false;

    const duration = moveTime - startTime;
    const slope = Math.abs((touchMove.screenY - touchStart.screenY) /
        (touchMove.screenX - touchStart.screenX));

    return duration < 400 && slope < 0.5;
  }

  newIndex(): number {
    const offset = this.touchOffset();
    const isFlick = this.isFlick();

    if ((isFlick && offset > 0) || (offset > window.innerWidth / 2))
      if (this.props.index > 0)
        return this.props.index - 1;
      else
        return this.props.index;
    else if ((isFlick && offset < 0) || (offset < -(window.innerWidth / 2)))
      if (this.props.index < CHAPTER_COUNT - 1)
        return this.props.index + 1;
      else
        return this.props.index;
    else
      return this.props.index;
  }

  updateCurrentPage() {
    this.props.onIndexChange(this.newIndex());

    this.setState({
      touchStart: null,
      touchMove: null,
      toAnimate: this.state.touchMove != null? this.offset() : null,
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.toAnimate == null && this.state.toAnimate != null) {
      const from = `translateX(${this.state.toAnimate}px)`;
      const to = `translateX(${this.offset()}px)`;
      const duration = 200; // TODO: determine this based on velocity
      if (this.track)
        this.track.animate([{transform: from}, {transform: to}], duration);
      this.setState({toAnimate: null});
    }
  }

  pageTranslate(delta: number = 0): string {
    return `translateX(${-this.restingOffset() + (delta * window.innerWidth)}px)`;
  }

  render() {
    const totalWidth = `${window.innerWidth * CHAPTER_COUNT}px`;
    const {index, renderPage} = this.props;
    const {toAnimate} = this.state;
    const offset = toAnimate == null? this.offset() : toAnimate;
    return <div
        className="fit"
        ref={track => this.track = track}
        style={{
          position: 'relative',
          width: totalWidth,
          overflowY: 'hidden',
          transform: `translateX(${offset}px)`,
        }}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        >
      {index !== 0?
        <Page
            style={{transform: this.pageTranslate(-1)}}
            index={index - 1}
            pageScrollDepths={this.pageScrollDepths}>
          {renderPage(index - 1)}
        </Page> :
        null}

      <Page
          style={{transform: this.pageTranslate()}}
          index={index}
          pageScrollDepths={this.pageScrollDepths}
          onScroll={this.onPageScroll}>
        {renderPage(index)}
      </Page>

      {index < CHAPTER_COUNT - 1?
        <Page
            style={{transform: this.pageTranslate(1)}}
            index={index + 1}
            pageScrollDepths={this.pageScrollDepths}>
          {renderPage(index + 1)}
        </Page> :
        null}
    </div>;
  }
}
