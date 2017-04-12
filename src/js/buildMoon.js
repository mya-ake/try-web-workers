import Moon from 'moonjs';

import components from './../components/exports.js';
import utils from './utils.js';
import IndexedDB from './lib/IndexedDB.js';


const buildTemplate = (template) => {
  return template.replace(/\s/, '');
};


Moon.component('m-header', {
  props: ['title'],
  template: buildTemplate(components.Header),
});


Moon.component('m-worker-box', {
  props: ['title'],
  template: buildTemplate(components.WorkerBox),
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
  template: buildTemplate(components.SharedWorkerBox),
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
  template: buildTemplate(components.IndexedDB),
  data: {
    indexedDb: null,
  },
  hooks: {
    init() {
      if (IndexedDB.hasIndexDB() === true) {
        this.set('indexedDb', new IndexedDB({
          dbName: 'sample-db',
          version: 1,
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
  },
});


export default Moon;