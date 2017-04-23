const hasWorker = () => {
  if ('Worker' in window) {
    console.info('has worker');
    return true;
  } else {
    console.info('none worker');
    return false;
  }
};

const buildTemplate = (template) => {
  return template.replace(/\s/, '');
};

export default {
  hasWorker: hasWorker,
  buildTemplate: buildTemplate,
};