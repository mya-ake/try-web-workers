self.onmessage = (evt) => {
  console.info('==== worker received ====');
  const data = evt.data;
  console.info(data);
  self.postMessage('worker reply: worker message');
};