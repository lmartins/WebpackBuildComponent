'use strict';

var dep = require('./moduleC1.js');

module.exports = function doSomething() {
  dep();
  console.log("Do something from module C");
};
