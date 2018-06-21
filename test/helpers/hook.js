const utils = require('../../lib/utils');

let cb = () => {};

function hook(fn) {
  cb = fn;
}

utils.getStdio = () => {
  return {
    write(...args) {
      cb(...args);
    },
  };
};

module.exports = hook;
