// @flow

/** thanks jake https://github.com/jakearchibald/idb-keyval */

// begin flow lib declaration //////////////////////////////////////////////////

// Until https://github.com/facebook/flow/pull/5216 gets merged?

// Implemented by window & worker
declare interface IDBEnvironment {
  indexedDB: IDBFactory;
}

type IDBDirection = 'next' | 'nextunique' | 'prev' | 'prevunique';

// Implemented by window.indexedDB & worker.indexedDB
declare interface IDBFactory {
  open(name: string, version?: number): IDBOpenDBRequest;
  deleteDatabase(name: string): IDBOpenDBRequest;
  cmp(a: any, b: any): -1|0|1;
}

declare var indexedDB: IDBFactory;

declare interface IDBRequest extends EventTarget {
  result: any;
  error: Error;
  source: ?(IDBIndex | IDBObjectStore | IDBCursor);
  transaction: IDBTransaction;
  readyState: 'pending'|'done';
  onerror: (err: any) => mixed;
  onsuccess: (e: any) => mixed;
}

declare interface IDBOpenDBRequest extends IDBRequest {
  onblocked: (e: any) => mixed;
  onupgradeneeded: (e: any) => mixed;
}

declare interface IDBDatabase extends EventTarget {
  close(): void;
  createObjectStore(name: string, options?: {
    keyPath?: ?(string|string[]),
    autoIncrement?: bool
  }): IDBObjectStore;
  deleteObjectStore(name: string): void;
  transaction(storeNames: string|string[], mode?: 'readonly'|'readwrite'|'versionchange'): IDBTransaction;
  name: string;
  version: number;
  objectStoreNames: string[];
  onabort: (e: any) => mixed;
  onerror: (e: any) => mixed;
  onversionchange: (e: any) => mixed;
}

declare interface IDBTransaction extends EventTarget {
  abort(): void;
  db: IDBDatabase;
  error: Error;
  mode: 'readonly'|'readwrite'|'versionchange';
  name: string;
  objectStore(name: string): IDBObjectStore;
  onabort: (e: any) => mixed;
  oncomplete: (e: any) => mixed;
  onerror: (e: any) => mixed;
}

declare interface IDBObjectStore {
  add(value: any, key?: any): IDBRequest;
  autoIncrement: bool;
  clear(): IDBRequest;
  createIndex(indexName: string, keyPath: string|string[], optionalParameter?: {
    unique?: bool,
    multiEntry?: bool,
  }): IDBIndex;
  count(keyRange?: any|IDBKeyRange): IDBRequest;
  delete(key: any): IDBRequest;
  deleteIndex(indexName: string): void;
  get(key: any): IDBRequest;
  index(indexName: string): IDBIndex;
  indexNames: string[];
  name: string;
  keyPath: any;
  openCursor(range?: any|IDBKeyRange, direction?: IDBDirection): IDBRequest;
  openKeyCursor(range?: any|IDBKeyRange, direction?: IDBDirection): IDBRequest;
  put(value: any, key?: any): IDBRequest;
  transaction : IDBTransaction;
}

declare interface IDBIndex extends EventTarget {
  count(key?: any|IDBKeyRange): IDBRequest;
  get(key: any|IDBKeyRange): IDBRequest;
  getKey(key: any|IDBKeyRange): IDBRequest;
  openCursor(range?: any|IDBKeyRange, direction?: IDBDirection): IDBRequest;
  openKeyCursor(range?: any|IDBKeyRange, direction?: IDBDirection): IDBRequest;
  name: string;
  objectStore: IDBObjectStore;
  keyPath: any;
  multiEntry: bool;
  unique: bool;
}

declare interface IDBKeyRange {
  bound(lower: any, upper: any, lowerOpen?: bool, upperOpen?: bool): IDBKeyRange;
  only(value: any): IDBKeyRange;
  lowerBound(bound: any, open?: bool): IDBKeyRange;
  upperBound(bound: any, open?: bool): IDBKeyRange;
  lower: any;
  upper: any;
  lowerOpen: bool;
  upperOpen: bool;
}

declare interface IDBCursor {
  advance(count: number): void;
  continue(key?: any): void;
  delete(): IDBRequest;
  update(newValue: any): IDBRequest;
  source: IDBObjectStore|IDBIndex;
  direction: IDBDirection;
  key: any;
  primaryKey: any;
}

declare interface IDBCursorWithValue extends IDBCursor {
  value: any;
}

// end flow lib declaration ////////////////////////////////////////////////////

export type DbMetadata = {
  name: string,
  version: number,
  stores: Array<string>,
};

export default class KeyValStore<K: string | number, V> {
  _db: Promise<IDBDatabase>;
  _db_metadata: DbMetadata;
  _store_name: string;

  constructor(dbMetadata: DbMetadata, store: string) {
    this._db_metadata = dbMetadata;
    this._store_name = store;
  }

  db(): Promise<IDBDatabase> {
    if (this._db == null)
      this._db = new Promise((resolve, reject) => {
        const request = indexedDB.open(this._db_metadata.name,
                                              this._db_metadata.version);
        request.onerror = () => reject(request.error);
        // TODO: actually handle upgrade
        request.onupgradeneeded = () => {
          this._db_metadata.stores.forEach(name => {
            try { request.result.deleteObjectStore(name) } catch (ignore) {}
            request.result.createObjectStore(name);
          });
        }
        request.onsuccess = () => {
          resolve(request.result);
        }
      });
    return this._db;
  }

  transact(type: 'readonly' | 'readwrite', callback: IDBObjectStore => any):
      Promise<void> {
    return this.db().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(this._store_name, type);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(this._store_name));
    }))
  }

  get(key: K): Promise<V> {
    var req;
    return this.transact('readonly', store => req = store.get(key))
      .then(() => {
        if (typeof req.result === 'undefined') {
          let keyString = '';
          if (key.hasOwnProperty('toString'))
            keyString = key.toString();
          throw new Error(`Key ${keyString} not found`);
        } else {
          return (req.result: V);
        }
      });
  }

  set(key: K, value: V): Promise<void> {
    return this.transact('readwrite', store => store.put(value, key));
  }

  all(): Promise<Array<{key: K, value: V}>> {
    const entries = [];
    return this.transact('readonly', store => {
        const request = store.openCursor();
        request.onsuccess = event => {
          const cursor = event.target.result;
          if (!cursor) return;
          entries.push({key: cursor.key, value: cursor.value});
          cursor.continue();
        };
      })
      .then(() => entries);
  }

  allKeys(): Promise<Array<K>> {
    const keys = [];
    return this.transact('readonly', store => {
        const request = store.openKeyCursor();
        request.onsuccess = event => {
          const cursor = event.target.result;
          if (!cursor) return;
          keys.push(cursor.key);
          cursor.continue();
        };
      })
      .then(() => keys);
  }
}
