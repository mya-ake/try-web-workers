// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const STORES = Object.freeze({
  USERS: 'users',
});

const TRANSACTION = Object.freeze({
  MODE: {
    READ_ONLY: 'readonly',
    READ_WRITE: 'readwrite',
    VERSION_CHANGE: 'versionchange',
  },
});

class IndexedDB {
  constructor({ dbName, version }) {
    this.STORES = STORES;
    this.TRANSACTION = TRANSACTION;

    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.open({
      error() {
        console.error('error');
      },
    });
  }

  static hasIndexDB() {
    return 'indexedDB' in window;
  }

  open({ error }) {
    const request = window.indexedDB.open(this.dbName, this.version);
    request.addEventListener('error', (err) => {
      console.error(err);
      error(err);
    }, false);
    request.addEventListener('upgradeneeded', (evt) => {
      // マイグレーション
      console.info('upgrade db');

      const db = evt.target.result;
      const objectStore = db.createObjectStore(STORES.USERS, { autoIncrement: true });
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
    }, false);

    request.addEventListener('success', (evt) => {
      // マイグレーションの後
      console.info('request success');
      this.db = evt.target.result;

      this.db.addEventListener('error', (evtErr) => {
        console.error(`Database error: ${evtErr.target.errorCode}`);
      }, false);
    }, false);
  }

  write({ objectName, value }) {
    const transaction = this.db.transaction([objectName], TRANSACTION.MODE.READ_WRITE);
    transaction.addEventListener('complete', () => {
      console.info('write done');
    }, false);

    transaction.addEventListener('error', (evt) => {
      console.error('write error');
      console.error(evt);
    }, false);

    const objectStore = transaction.objectStore(objectName);
    const request = objectStore.add(value);
    request.addEventListener('success', (evt) => {
      console.info('write success');
      console.info(evt);
      console.info(`ID: ${evt.target.result}`);
    });
  }

  read({ objectName, key }) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([objectName]);
      const objectStore = transaction.objectStore(objectName);
      const request = objectStore.get(key);
      request.addEventListener('success', (evt) => {
        resolve(evt.target.result);
      });
      request.addEventListener('error', (evt) => {
        reject(evt);
      });
    });
  }
}

export default IndexedDB;