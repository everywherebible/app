/** thanks jake https://github.com/jakearchibald/idb-keyval */

export default class KeyValStore {
  constructor(dbMetadata, store) {
    this._db_metadata = dbMetadata;
    this._store_name = store;
  }

  db() {
    if (this._db == null)
      this._db = new Promise((resolve, reject) => {
        const request = indexedDB.open(
          this._db_metadata.name,
          this._db_metadata.version
        );
        request.onerror = () => reject(request.error);
        // TODO: actually handle upgrade
        request.onupgradeneeded = () => {
          this._db_metadata.stores.forEach(name => {
            try {
              request.result.deleteObjectStore(name);
            } catch (ignore) {}
            request.result.createObjectStore(name);
          });
        };
        request.onsuccess = () => {
          resolve(request.result);
        };
      });
    return this._db;
  }

  transact(type, callback) {
    return this.db().then(
      db =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(this._store_name, type);
          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error);
          callback(transaction.objectStore(this._store_name));
        })
    );
  }

  get(key) {
    var req;
    return this.transact("readonly", store => (req = store.get(key))).then(
      () => {
        if (typeof req.result === "undefined") {
          let keyString = "";
          if (key.hasOwnProperty("toString")) keyString = key.toString();
          throw new Error(`Key ${keyString} not found`);
        } else {
          return req.result;
        }
      }
    );
  }

  set(key, value) {
    return this.transact("readwrite", store => store.put(value, key));
  }

  all() {
    const entries = [];
    return this.transact("readonly", store => {
      const request = store.openCursor();
      request.onsuccess = event => {
        const cursor = event.target.result;
        if (!cursor) return;
        entries.push({key: cursor.key, value: cursor.value});
        cursor.continue();
      };
    }).then(() => entries);
  }
}
