export default () => {
  let _resolve = undefined;
  let _reject = undefined;
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  promise.resolve = _resolve;
  promise.reject = _reject;

  return promise;
};
