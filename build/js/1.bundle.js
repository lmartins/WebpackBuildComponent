webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dep = __webpack_require__(4);

	module.exports = function doSomething() {
	  dep();
	  console.log("Do something from module C");
	};


/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
	  'use strict';
	  console.log("Something from module C1");
	}


/***/ }
])