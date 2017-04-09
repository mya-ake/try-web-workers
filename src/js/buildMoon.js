import Moon from 'moonjs';

import components from './../components/exports.js';
import utils from './utils.js';


const buildTemplate = (template) => {
  return template.replace(/\s/, '');
};


Moon.component('m-header', {
  props: ['title'],
  template: buildTemplate(components.Header),
});

Moon.component('m-list', {
  template: buildTemplate(components.ProcessList),
  data: {
    items: [
      'item1',
    ],
  },
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
        worker.addEventListener('message', (evt) => {
          console.info('==== main thread received ====');
          console.info(evt.data);
        });
        this.set('worker', worker);
      }
    },
  },
  methods: {
    clickAction() {
      const worker = this.get('worker');
      if (worker !== null) {
        worker.postMessage({
          message: 'to worker',
        });
      }
    },
  },
});


export default Moon;