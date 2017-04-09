self.addEventListener('connect', (e) => {
  const port = e.ports[0];

  // ここはaddEventListener使えないっぽい
  port.onmessage = (evt) => {
    const workerResult = (evt.data[0] * evt.data[1]);
    port.postMessage(workerResult);
  };
});

// self.onmessage = (evt) => {
//   const workerResult = (evt.data[0] * evt.data[1]);
//   self.postMessage(workerResult);
// };