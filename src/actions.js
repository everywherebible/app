// @flow

export type Next = {+type: 'next'};
export const next = (): Next => ({type: 'next'});

export type Action = Next;
