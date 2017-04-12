// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


class IndexedDB {
  constructor({ dbName, version }) {
    this.dbName = dbName;
    this.version = version;
    this.request = null;
    this.db = null;
  }

  static hasIndexDB() {
    return 'indexedDB' in window;
  }

  open({ error }) {
    this.request = window.indexedDB.open(this.dbName, this.version);
    this.request.addEventListener('error', (err) => {
      console.error(err);
      error(err);
    }, false);
    this.request.addEventListener('success', (evt) => {
      console.log(evt);
      this.db = evt.target.result;
    }, false);
  }

}

export default IndexedDB;