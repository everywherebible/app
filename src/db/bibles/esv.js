// @flow

import KeyValStore from '../key-val-store';

let _instance;

const STORE_NAME = 'chapters';

const DB_METADATA = {
  name: 'bible-esv',
  version: 2,
  stores: [STORE_NAME],
};

export class EsvBibleStore extends KeyValStore<number, string> {
  constructor() {
    super(DB_METADATA, STORE_NAME);
  }
}

export default (): EsvBibleStore => {
  if (_instance == null)
    _instance = new EsvBibleStore();

  return _instance;
}
