// @flow

import React, {Component} from 'react';

import {CHAPTER_COUNT} from '../data';

if (process.env.THIS_IS_JUST_A_HACK)
  require('web-animations-js'); // TODO: a lot of browsers don't need this

const Page = ({style, children, index}) =>
  <div
      className="fit"
      style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${window.innerWidth}px`,
          display: 'inline-block',
          ...style
        }}>
    {children}
  </div>;

type Touch = {+screenX: number};

type Props = {
  index: number,
  onIndexChange: (number) => typeof undefined,
  renderPage: (number) =>
      typeof undefined
    | null
    | boolean
    | number
    | string
    | React$Element<any>
    | Iterable<React$Element<any>>,
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
    if (this.state.moveTime == null || this.state.startTime == null)
      return false
    return (this.state.moveTime - this.state.startTime) < 400;
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
        <Page style={{transform: this.pageTranslate(-1)}} index={index - 1}>
          {renderPage(index - 1)}
        </Page> :
        null}

      <Page style={{transform: this.pageTranslate()}} index={index}>
        {renderPage(index)}
      </Page>

      {index < CHAPTER_COUNT - 1?
        <Page style={{transform: this.pageTranslate(1)}} index={index + 1}>
          {renderPage(index + 1)}
        </Page> :
        null}
    </div>;
  }
}
