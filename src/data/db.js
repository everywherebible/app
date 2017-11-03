/** thanks jake https://github.com/jakearchibald/idb-keyval */

const stores = {};

export const DB_NAME = 'esv';
export const STORE_NAMES = ['chapters', 'recents', 'preferences'];

export class KeyValStore {
  constructor(db = DB_NAME, store = STORE_NAMES[0]) {
    this._db_name = db;
    this._store_name = store;
  }

  db() {
    if (this._db == null)
      this._db = new Promise((resolve, reject) => {
        const request = indexedDB.open(this._db_name, 8);
        request.onerror = () => reject(request.error);
        // TODO: actually handle upgrade
        request.onupgradeneeded = () => {
          STORE_NAMES.forEach(name => {
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

  transact(type, callback) {
    return this.db().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(this._store_name, type);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(this._store_name));
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
}

export default ({db = DB_NAME, store = STORE_NAMES[0]} = {}) => {
  const key = db + '|' + store;
  if (stores[key] == null)
    stores[key] = new KeyValStore(db, store);
  return stores[key];
};
