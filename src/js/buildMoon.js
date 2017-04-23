import Moon from 'moonjs';

import components from './../components/exports.js';
import services from './services/exports.js';
import utils from './utils.js';
import IndexedDB from './lib/IndexedDB.js';

Moon.component('m-header', {
  props: ['title'],
  template: utils.buildTemplate(components.Header),
});


Moon.component('m-worker-box', {
  props: ['title'],
  template: utils.buildTemplate(components.WorkerBox),
  data: {
    worker: null,
  },
  hooks: {
    init() {
      if (utils.hasWorker()) {
        const worker = new Worker('workers/dedicatedWorker.js');

        // Workerからレスポンスを受け取る
        worker.addEventListener('message', (evt) => {
          console.info('==== main thread received ====');
          console.info(evt.data);
        });
        // Workerのエラーを受け取る
        worker.addEventListener('error', (err) => {
          console.error(err);
        });

        this.set('worker', worker);
      }
    },
  },
  methods: {
    clickAction() {
      const worker = this.get('worker');
      if (worker !== null) {
        // Workerに送信
        worker.postMessage({
          message: 'to worker',
        });
      } else {
        console.info('Worker does not exitst');
      }
    },
  },
});


Moon.component('m-shared-worker-box', {
  props: ['title'],
  template: utils.buildTemplate(components.SharedWorkerBox),
  data: {
    worker: null,
    value1: 0,
    value2: 0,
    result: 0,
  },
  hooks: {
    init() {
      if (utils.hasWorker()) {
        const worker = new SharedWorker('workers/sharedWorker.js');
        // const worker = new Worker('workers/sharedWorker.js');
        worker.port.start();

        // Workerからレスポンスを受け取る
        worker.port.addEventListener('message', (evt) => {
          // worker.addEventListener('message', (evt) => {
          console.info('==== main thread received ====');
          const newResult = evt.data;
          const oldResult = this.get('result');
          if (newResult !== oldResult) {
            this.set('result', newResult);
          }
        });
        // Workerのエラーを受け取る
        worker.addEventListener('error', (err) => {
          console.error(err);
        });

        this.set('worker', worker);
      }
    },
    updated() {
      const worker = this.get('worker');
      if (worker !== null) {
        worker.port.postMessage([this.get('value1'), this.get('value2')]);
        // worker.postMessage([this.get('value1'), this.get('value2')]);
      }
    },
  },
  methods: {
  },
});

Moon.component('m-indexed-db', {
  template: utils.buildTemplate(components.IndexedDB),
  data: {
    indexedDb: null,
    user: {
      name: '',
      email: '',
    },
    gotUser: {
      name: '',
      email: '',
    },
    searchId: '',
    searchResult: true,
  },
  hooks: {
    init() {
      if (IndexedDB.hasIndexDB() === true) {
        this.set('indexedDb', new IndexedDB({
          dbName: 'sample-db',
          version: 2,
        }));
      }
    },
  },
  methods: {
    clickOpen() {
      const indexedDb = this.get('indexedDb');
      if (indexedDb !== null) {
        indexedDb.open({
          error() {
            console.error('error');
          },
        });
      }
    },
    submitSave() {
      const indexedDb = this.get('indexedDb');
      if (indexedDb !== null) {
        const user = this.get('user');
        indexedDb.write({
          objectName: indexedDb.STORES.USERS,
          value: user,
        });
      }
    },
    submitGet() {
      const indexedDb = this.get('indexedDb');
      if (indexedDb !== null) {
        indexedDb.read({
          objectName: indexedDb.STORES.USERS,
          key: Number(this.get('searchId')),
        })
          .then((result) => {
            if (result) {
              this.set('searchResult', true);
              this.set('gotUser', result);
            } else {
              this.set('searchResult', false);
              this.set('gotUser', {
                name: '',
                email: '',
              });
            }
          })
          .catch((err) => {
            this.set('searchResult', false);
            console.error(err);
            this.set('gotUser', {
              name: '',
              email: '',
            });
          });
      }
    },
  },
});

Moon.component('m-fetch', services.Fetch);


export default Moon;