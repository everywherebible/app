// @flow

import KeyValStore from '../key-val-store';

let _instance;

const STORE_NAME = 'chapters';

const DB_METADATA = {
  name: 'bible-kjv',
  version: 2,
  stores: [STORE_NAME],
};

export class KjvBibleStore extends KeyValStore<number, string> {
  constructor() {
    super(DB_METADATA, STORE_NAME);
  }
}

export default (): KjvBibleStore => {
  if (_instance == null)
    _instance = new KjvBibleStore();

  return _instance;
}
