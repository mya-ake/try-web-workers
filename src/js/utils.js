const hasWorker = () => {
  if ('Worker' in window) {
    console.info('has worker');
    return true;
  } else {
    console.info('none worker');
    return false;
  }
};


export default {
  hasWorker: hasWorker,
};