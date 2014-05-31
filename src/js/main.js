"use strict";

require("script!./testeScriptLoader.js");

require.ensure(['./moduleC'], function(require){
  var c = require('./moduleC');
  c();
});

var _   = require('lodash'),
    modb = require('./moduleB.js');
    //dom = require('dom');

// modb();
modb.addThing();
modb.addAnotherThing();

var add2 = function (x) {
  return x + 2;
};

var double = function (x) {
  return x * 2;
};

var map = function (func, list) {
  var output = [];
  for (var idx in list) {
    output.push( func(list[idx]) );
  }
  return output;
};

// alert('WHEEE2!!!');


var buildProcessor = function (func) {
  var processFunc = function (list) {
    return map(func, list);
  };
  return processFunc;
};

var buildMultiplier = function (x) {
  return function(y) {
    return x * y;
  };
};

var processAdd2 = buildProcessor( add2 );
var processDouble = buildProcessor( double );

console.log( processAdd2([5, 6, 7]) );
console.log( processDouble( [12, 164, 320] ) );
var double = buildMultiplier(2);
var triple = buildMultiplier(3);


// TODO: ver erro 404
// require.ensure(["./moduleB"], function(require) {
//     var b = require("./moduleB");
// });

var add1 = function (x) {
  return x + 1;
};
var negate = function (func) {
  return function(x){
    return -1 * func(x);
  };
};

console.log( negate(add1)(5) );

var language = {
  name: 'Javascript',
  isSupportedByBrowsers: true,
  createdIn: 1995,
  author: {
    firstName: 'Brendan',
    lastName: 'Eich'
  },
  getAuthorFullName: function () {
    return this.author.firstName + this.author.lastName;
  }
};

var fruit = {
    apple: 2,
    orange: 5,
    pear: 1
  },
  sentence = "I have ",
  quantity;

for (var kind in fruit) {
  if (fruit.hasOwnProperty(kind)) {
    quantity = fruit[kind];
    sentence += quantity + ' ' + kind + (quantity === 1 ? '' : 's') + ', ';
  }
}
sentence = sentence.substr(0, sentence.length-2) + '.';
console.log(sentence);

var toggleActiveItem = function ToggleActiveItem (element) {
  element.classList.remove('active');
};

var listItems = document.querySelectorAll('.mainMenu li');
console.log(listItems);
var activeListItems = _.filter(listItems, function(item){
  return item.classList.contains('active');
});
// console.log(activeListItems);
_.each(activeListItems, function(item) {
  item.classList.remove('active');
});

_.each(activeListItems, toggleActiveItem );
