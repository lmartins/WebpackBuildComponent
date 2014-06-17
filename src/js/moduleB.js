'use strict';

// require("script!./testeScriptLoader.js");

var addThing = function(){
  console.log("Add a thingie");
};
var addAnotherThing = function(){
  console.log("Add another thingie.");
};

module.exports = {
  addThing: addThing,
  addAnotherThing: addAnotherThing
};

// module.exports = function () {
//   'use strict';
//   console.log("Module B");
// }
