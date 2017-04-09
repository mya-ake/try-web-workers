self.onconnect = (e) => {
  let port = e.ports[0];

  port.onmessage = (evt) => {
    const workerResult = (evt.data[0] * evt.data[1]);
    port.postMessage(workerResult);
  };
};

// self.onmessage = (evt) => {
//   const workerResult = (evt.data[0] * evt.data[1]);
//   self.postMessage(workerResult);
// };