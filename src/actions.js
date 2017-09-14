// @flow

import type {Reference} from './data';

export type SetReference = {+type: 'set-reference', +reference: Reference};
export const setReference = (reference: Reference): SetReference =>
  ({type: 'set-reference', reference});

export type Action = SetReference;

