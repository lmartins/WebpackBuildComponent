/*!
 * JSTests
 * 0.1.0:1403039782949 [development build]
 */
webpackJsonp([1],{

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dep = __webpack_require__(7);
	
	module.exports = function doSomething() {
	  dep();
	  console.log("Do something from module C");
	};


/***/ },

/***/ 7:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
	  'use strict';
	  console.log("Something from module C1");
	}


/***/ }

});
//# sourceMappingURL=1.chunk.js.map