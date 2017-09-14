// @flow

import type {Action} from './actions';
import type {Reference} from './data';

export type State = {
  +reading: Reference
}

export const DEFAULT = {reading: {book: 'Genesis', chapter: 1}};

export default (state: State = DEFAULT, action: Action) => {
  switch (action.type) {
    case 'set-reference':
      return {reading: action.reference};
    default:
      (action: empty); // eslint-disable-line
      return state;
  }
};
