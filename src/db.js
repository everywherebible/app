/** thanks jake https://github.com/jakearchibald/idb-keyval */

var keyValStore;

export const DB_NAME = 'esv';
export const STORE_NAME = 'chapters';

export class KeyValStore {
  db() {
    if (this._db == null)
      this._db = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onerror = () => reject(request.error);
        // TODO: actually handle upgrade
        request.onupgradeneeded = () => {
          request.result.createObjectStore(STORE_NAME);
        }
        request.onsuccess = () => {
          resolve(request.result);
        }
      });
    return this._db;
  }

  transact(type, callback) {
    return this.db().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, type);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(STORE_NAME));
    }))
  }

  get(key) {
    var req;
    return this.transact('readonly', store => req = store.get(key))
      .then(() => {
        if (typeof req.result === 'undefined')
          throw new Error(`Key ${key} not found`);
        else
          return req.result;
      });
  }

  set(key, value) {
    return this.transact('readwrite', store => store.put(value, key));
  }

  all() {
    const values = [];
    return this.transact('readonly', store => {
        const cursor = (store.openKeyCursor || store.openCursor).call(store);
        cursor.onsuccess = () => {
          if (!cursor.result) return;
          values.push(cursor.result.value);
          cursor.result.continue();
        };
      })
      .then(() => values);
  }
}

export default () => keyValStore == null?
  keyValStore = new KeyValStore() : keyValStore;
