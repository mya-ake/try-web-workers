import Moon from 'moonjs';

import components from './../components/exports.js';

const buildTemplate = (template) => {
  return template.replace(/\s/, '');
};


Moon.component('m-header', {
  template: buildTemplate(components.Header),
});


export default Moon;