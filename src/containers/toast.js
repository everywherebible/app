// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';

import type {State, Toast as ToastType} from '../reducer';
import '../ui/toast.css';

type Props = {toasts: Array<ToastType>};

const stateToProps = ({toasts}: State): Props => ({toasts});

export class Toast extends Component<Props> {
  toastElements = [];

  fadeOutClasses() {
    this.toastElements.map(t => t.classList.add('toast-fade-out'));
  }

  componentDidMount() {
    this.fadeOutClasses();
  }

  componentDidUpdate() {
    this.fadeOutClasses();
  }

  render() {
    const {toasts} = this.props;
    this.toastElements = [];

    return <div>
      {toasts
        .map(toast =>
          <div
              ref={t => t && this.toastElements.push(t)}
              className='toast'
              style={{
                position: 'absolute',
                bottom: '4rem',
                left: 0,
                right: 0,
                textAlign: 'center',
                pointerEvents: 'none',
                transition: 'opacity 1s ease-out',
                transitionDelay: '2s',
              }}
              key={toast.start}>
            <div style={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '1rem',
                  display: 'inline-block',
                  padding: '.7rem 1rem',
                }}>
              {toast.text}
            </div>
          </div>)}
    </div>;
  }
}

export default connect(stateToProps)(Toast);
