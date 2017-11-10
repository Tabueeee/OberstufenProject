(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"util/":21}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator$1(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator$1.prototype._enumerate = function (input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator$1.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$2) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$1) {
        return resolve$$1(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};

Enumerator$1.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator$1.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all$1(entries) {
  return new Enumerator$1(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race$1(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$2(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$2.all = all$1;
Promise$2.race = race$1;
Promise$2.resolve = resolve$1;
Promise$2.reject = reject$1;
Promise$2._setScheduler = setScheduler;
Promise$2._setAsap = setAsap;
Promise$2._asap = asap;

Promise$2.prototype = {
  constructor: Promise$2,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

/*global self*/
function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$2;
}

// Strange compat..
Promise$2.polyfill = polyfill$1;
Promise$2.Promise = Promise$2;

return Promise$2;

})));



}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":17}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Binding, ConfigurationError, FunctionResolver, InstanceResolver, ResolutionError, SingletonLifecycle, TransientLifecycle, TypeResolver, _, assert, chain, sweeten,
    slice = [].slice;

  assert = require('assert');

  _ = require('underscore');

  FunctionResolver = require('./resolvers/FunctionResolver');

  InstanceResolver = require('./resolvers/InstanceResolver');

  TypeResolver = require('./resolvers/TypeResolver');

  SingletonLifecycle = require('./lifecycles/SingletonLifecycle');

  TransientLifecycle = require('./lifecycles/TransientLifecycle');

  ConfigurationError = require('./errors/ConfigurationError');

  ResolutionError = require('./errors/ResolutionError');

  sweeten = function(type, property) {
    return Object.defineProperty(type.prototype, property, {
      get: function() {
        return this;
      }
    });
  };

  chain = function(func) {
    return function() {
      var args, result;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      result = func.apply(this, args);
      return this;
    };
  };

  Binding = (function() {
    function Binding(forge, name) {
      this.forge = forge;
      this.name = name;
      assert(this.forge != null, 'The argument "forge" must have a value');
      assert(this.name != null, 'The argument "name" must have a value');
      this.lifecycle = new SingletonLifecycle();
      this["arguments"] = {};
    }

    Binding.prototype.matches = function(hint) {
      if (this.predicate != null) {
        return this.predicate(hint);
      } else {
        return true;
      }
    };

    Binding.prototype.resolve = function(context, hint, args) {
      var result;
      if (args == null) {
        args = {};
      }
      assert(context, 'The argument "context" must have a value');
      if (this.lifecycle == null) {
        throw new ConfigurationError(this.name, 'No lifecycle defined');
      }
      if (this.resolver == null) {
        throw new ConfigurationError(this.name, 'No resolver defined');
      }
      if (context.has(this)) {
        throw new ResolutionError(this.name, hint, context, 'Circular dependencies detected');
      }
      context.push(this);
      result = this.lifecycle.resolve(this.resolver, context, args);
      context.pop();
      return result;
    };

    sweeten(Binding, 'to');

    sweeten(Binding, 'as');

    Binding.prototype.type = chain(function(target) {
      assert(target != null, 'The argument "target" must have a value');
      return this.resolver = new TypeResolver(this.forge, this, target);
    });

    Binding.prototype["function"] = chain(function(target) {
      assert(target != null, 'The argument "target" must have a value');
      return this.resolver = new FunctionResolver(this.forge, this, target);
    });

    Binding.prototype.instance = chain(function(target) {
      assert(target != null, 'The argument "target" must have a value');
      return this.resolver = new InstanceResolver(this.forge, this, target);
    });

    Binding.prototype.singleton = chain(function() {
      return this.lifecycle = new SingletonLifecycle();
    });

    Binding.prototype.transient = chain(function() {
      return this.lifecycle = new TransientLifecycle();
    });

    Binding.prototype.when = chain(function(condition) {
      assert(condition != null, 'The argument "condition" must have a value');
      if (_.isFunction(condition)) {
        return this.predicate = condition;
      } else {
        return this.predicate = function(hint) {
          return hint === condition;
        };
      }
    });

    Binding.prototype["with"] = chain(function(args) {
      return this["arguments"] = args;
    });

    Binding.prototype.toString = function() {
      var deps, ref, tokens;
      tokens = [];
      if (this.predicate != null) {
        tokens.push('(conditional)');
      }
      tokens.push(this.name);
      tokens.push('->');
      tokens.push(this.resolver != null ? this.resolver.toString() : '<undefined resolver>');
      tokens.push("(" + (this.lifecycle.toString()) + ")");
      if (((ref = this.resolver.dependencies) != null ? ref.length : void 0) > 0) {
        deps = _.map(this.resolver.dependencies, function(dep) {
          if (dep.hint != null) {
            return dep.name + ":" + dep.hint;
          } else {
            return dep.name;
          }
        });
        tokens.push("depends on: [" + (deps.join(', ')) + "]");
      }
      return tokens.join(' ');
    };

    return Binding;

  })();

  module.exports = Binding;

}).call(this);

},{"./errors/ConfigurationError":6,"./errors/ResolutionError":7,"./lifecycles/SingletonLifecycle":10,"./lifecycles/TransientLifecycle":11,"./resolvers/FunctionResolver":12,"./resolvers/InstanceResolver":13,"./resolvers/TypeResolver":15,"assert":1,"underscore":18}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Context, _;

  _ = require('underscore');

  Context = (function() {
    function Context() {
      this.bindings = [];
    }

    Context.prototype.has = function(binding) {
      return _.contains(this.bindings, binding);
    };

    Context.prototype.push = function(binding) {
      return this.bindings.push(binding);
    };

    Context.prototype.pop = function() {
      return this.bindings.pop();
    };

    Context.prototype.toString = function(indent) {
      var lines, spaces;
      if (indent == null) {
        indent = 4;
      }
      spaces = Array(indent + 1).join(' ');
      lines = _.map(this.bindings, function(binding, index) {
        return "" + spaces + (index + 1) + ": " + (binding.toString());
      });
      return lines.reverse().join('\n');
    };

    return Context;

  })();

  module.exports = Context;

}).call(this);

},{"underscore":18}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Inspector, _, assert;

  assert = require('assert');

  _ = require('underscore');

  Inspector = (function() {
    function Inspector(unmangleNames) {
      this.unmangleNames = unmangleNames != null ? unmangleNames : false;
    }

    Inspector.prototype.getDependencies = function(func) {
      var hints, params;
      assert(func != null, 'The argument "func" must have a value');
      params = this.getParameterNames(func);
      hints = this.getDependencyHints(func);
      return _.map(params, function(param) {
        var ref;
        return (ref = hints[param]) != null ? ref : {
          name: param,
          all: false,
          hint: void 0
        };
      });
    };

    Inspector.prototype.getParameterNames = function(func) {
      var args, matches, regex;
      assert(func != null, 'The argument "func" must have a value');
      regex = /(?:function|constructor)[ A-Za-z0-9]*\(([^)]+)/g;
      matches = regex.exec(func.toString());
      if ((matches == null) || matches[1].length === 0) {
        return [];
      }
      args = matches[1].split(/[,\s]+/);
      if (this.unmangleNames) {
        return _.map(args, function(arg) {
          return arg.replace(/\d+$/, '');
        });
      } else {
        return args;
      }
    };

    Inspector.prototype.getDependencyHints = function(func) {
      var all, argument, dependency, hint, hints, match, name, pattern, ref, regex;
      assert(func != null, 'The argument "func" must have a value');
      regex = /"(.*?)\s*->\s*(all)?\s*(.*?)";/gi;
      hints = {};
      while (match = regex.exec(func.toString())) {
        pattern = match[0], argument = match[1], all = match[2], dependency = match[3];
        if (all != null) {
          all = true;
        }
        if (dependency.indexOf(':')) {
          ref = dependency.split(/\s*:\s*/, 2), name = ref[0], hint = ref[1];
        } else {
          name = dependency;
          hint = void 0;
        }
        hints[argument] = {
          name: name,
          all: all,
          hint: hint
        };
      }
      return hints;
    };

    Inspector.prototype.isAutoConstructor = function(constructor) {
      var body, name;
      assert(constructor != null, 'The argument "constructor" must have a value');
      name = constructor.name;
      body = constructor.toString();
      return body.indexOf(name + ".__super__.constructor.apply(this, arguments);") > 0;
    };

    return Inspector;

  })();

  module.exports = Inspector;

}).call(this);

},{"assert":1,"underscore":18}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var ConfigurationError,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ConfigurationError = (function(superClass) {
    extend(ConfigurationError, superClass);

    function ConfigurationError(name, message) {
      this.message = "The binding for component named " + name + " is misconfigured: " + message;
      Error.captureStackTrace(this, arguments.callee);
    }

    ConfigurationError.prototype.toString = function() {
      return this.message;
    };

    return ConfigurationError;

  })(Error);

  module.exports = ConfigurationError;

}).call(this);

},{}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var ResolutionError, util;

  util = require('util');

  ResolutionError = (function() {
    function ResolutionError(name, hint, context, message) {
      this.name = 'ResolutionError';
      this.message = this.getMessage(name, hint, context, message);
      Error.captureStackTrace(this, arguments.callee);
    }

    ResolutionError.prototype.toString = function() {
      return this.message;
    };

    ResolutionError.prototype.getMessage = function(name, hint, context, message) {
      var lines;
      lines = [];
      lines.push("Could not resolve component named " + name + ": " + message);
      if (hint != null) {
        lines.push('  With resolution hint:');
        lines.push("    " + (util.inspect(hint)));
      }
      lines.push('  In resolution context:');
      lines.push(context.toString());
      lines.push('  ---');
      return lines.join('\n');
    };

    return ResolutionError;

  })();

  module.exports = ResolutionError;

}).call(this);

},{"util":21}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Binding, Context, Forge, Inspector, ResolutionError, _, assert;

  assert = require('assert');

  _ = require('underscore');

  Binding = require('./Binding');

  Context = require('./Context');

  Inspector = require('./Inspector');

  ResolutionError = require('./errors/ResolutionError');

  Forge = (function() {
    function Forge(config) {
      var ref, ref1;
      if (config == null) {
        config = {};
      }
      this.bindings = {};
      this.unmangleNames = (ref = config.unmangleNames) != null ? ref : true;
      this.inspector = (ref1 = config.inspector) != null ? ref1 : new Inspector(this.unmangleNames);
    }

    Forge.prototype.bind = function(name) {
      var base, binding;
      assert(name != null, 'The argument "name" must have a value');
      assert(this.validateName(name), "Invalid binding name \"" + name + "\"");
      binding = new Binding(this, name);
      ((base = this.bindings)[name] != null ? base[name] : base[name] = []).push(binding);
      return binding;
    };

    Forge.prototype.unbind = function(name) {
      var count;
      assert(name != null, 'The argument "name" must have a value');
      count = this.bindings[name] != null ? this.bindings[name].length : 0;
      this.bindings[name] = [];
      return count;
    };

    Forge.prototype.rebind = function(name) {
      assert(name != null, 'The argument "name" must have a value');
      this.unbind(name);
      return this.bind(name);
    };

    Forge.prototype.get = function(name, hint, args) {
      return this.resolve(name, new Context(), hint, false, args);
    };

    Forge.prototype.getOne = function(name, hint, args) {
      var bindings, context;
      assert(name != null, 'The argument "name" must have a value');
      context = new Context();
      bindings = this.getMatchingBindings(name, hint);
      if (bindings.length === 0) {
        throw new ResolutionError(name, hint, context, 'No matching bindings were available');
      }
      if (bindings.length !== 1) {
        throw new ResolutionError(name, hint, context, 'Multiple matching bindings were available');
      }
      return this.resolveBindings(context, bindings, hint, args, true);
    };

    Forge.prototype.getAll = function(name, args) {
      var bindings, context;
      assert(name != null, 'The argument "name" must have a value');
      context = new Context();
      bindings = this.bindings[name];
      if (!((bindings != null ? bindings.length : void 0) > 0)) {
        throw new ResolutionError(name, void 0, context, 'No matching bindings were available');
      }
      return this.resolveBindings(context, bindings, void 0, args, false);
    };

    Forge.prototype.create = function(type, args) {
      var binding, context;
      assert(type != null, 'The argument "type" must have a value');
      context = new Context();
      binding = new Binding(this, type.constructor.name).type(type);
      return this.resolveBindings(context, [binding], void 0, args, true);
    };

    Forge.prototype.getMatchingBindings = function(name, hint) {
      assert(name != null, 'The argument "name" must have a value');
      if (this.bindings[name] == null) {
        return [];
      }
      return _.filter(this.bindings[name], function(b) {
        return b.matches(hint);
      });
    };

    Forge.prototype.resolve = function(name, context, hint, all, args) {
      var bindings, unwrap;
      assert(name != null, 'The argument "name" must have a value');
      if (context == null) {
        context = new Context();
      }
      if (all) {
        bindings = this.bindings[name];
        unwrap = false;
      } else {
        bindings = this.getMatchingBindings(name, hint);
        unwrap = true;
      }
      if ((bindings != null ? bindings.length : void 0) === 0) {
        throw new ResolutionError(name, hint, context, 'No matching bindings were available');
      }
      return this.resolveBindings(context, bindings, hint, args, unwrap);
    };

    Forge.prototype.resolveBindings = function(context, bindings, hint, args, unwrap) {
      var results;
      results = _.map(bindings, function(binding) {
        return binding.resolve(context, hint, args);
      });
      if (unwrap && results.length === 1) {
        return results[0];
      } else {
        return results;
      }
    };

    Forge.prototype.inspect = function() {
      var bindings;
      bindings = _.flatten(_.values(this.bindings));
      return _.invoke(bindings, 'toString').join('\n');
    };

    Forge.prototype.validateName = function(name) {
      if (this.unmangleNames) {
        return /[^\d]$/.test(name);
      } else {
        return true;
      }
    };

    return Forge;

  })();

  module.exports = Forge;

}).call(this);

},{"./Binding":3,"./Context":4,"./Inspector":5,"./errors/ResolutionError":7,"assert":1,"underscore":18}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Lifecycle;

  Lifecycle = (function() {
    function Lifecycle() {}

    Lifecycle.prototype.resolve = function(resolver, context, args) {
      throw new Error("You must implement resolve() on " + this.constructor.name);
    };

    return Lifecycle;

  })();

  module.exports = Lifecycle;

}).call(this);

},{}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Lifecycle, SingletonLifecycle, assert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  assert = require('assert');

  Lifecycle = require('./Lifecycle');

  SingletonLifecycle = (function(superClass) {
    extend(SingletonLifecycle, superClass);

    function SingletonLifecycle() {
      return SingletonLifecycle.__super__.constructor.apply(this, arguments);
    }

    SingletonLifecycle.prototype.resolve = function(resolver, context, args) {
      assert(resolver != null, 'The argument "resolver" must have a value');
      assert(context != null, 'The argument "context" must have a value');
      if (this.instance == null) {
        this.instance = resolver.resolve(context, args);
      }
      return this.instance;
    };

    SingletonLifecycle.prototype.toString = function() {
      return 'singleton';
    };

    return SingletonLifecycle;

  })(Lifecycle);

  module.exports = SingletonLifecycle;

}).call(this);

},{"./Lifecycle":9,"assert":1}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Lifecycle, TransientLifecycle, assert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  assert = require('assert');

  Lifecycle = require('./Lifecycle');

  TransientLifecycle = (function(superClass) {
    extend(TransientLifecycle, superClass);

    function TransientLifecycle() {
      return TransientLifecycle.__super__.constructor.apply(this, arguments);
    }

    TransientLifecycle.prototype.resolve = function(resolver, context, args) {
      assert(resolver != null, 'The argument "resolver" must have a value');
      assert(context != null, 'The argument "context" must have a value');
      return resolver.resolve(context, args);
    };

    TransientLifecycle.prototype.toString = function() {
      return 'transient';
    };

    return TransientLifecycle;

  })(Lifecycle);

  module.exports = TransientLifecycle;

}).call(this);

},{"./Lifecycle":9,"assert":1}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var FunctionResolver, Resolver, _, assert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  assert = require('assert');

  _ = require('underscore');

  Resolver = require('./Resolver');

  FunctionResolver = (function(superClass) {
    extend(FunctionResolver, superClass);

    function FunctionResolver(forge, binding, func) {
      this.func = func;
      FunctionResolver.__super__.constructor.call(this, forge, binding);
      assert(this.func != null, 'The argument "func" must have a value');
      this.dependencies = this.forge.inspector.getDependencies(this.func);
    }

    FunctionResolver.prototype.resolve = function(context, args) {
      args = this.resolveDependencies(context, this.dependencies, args);
      return this.func.apply(null, args);
    };

    FunctionResolver.prototype.toString = function() {
      return 'function';
    };

    return FunctionResolver;

  })(Resolver);

  module.exports = FunctionResolver;

}).call(this);

},{"./Resolver":14,"assert":1,"underscore":18}],13:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var InstanceResolver, Resolver, _, assert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  assert = require('assert');

  _ = require('underscore');

  Resolver = require('./Resolver');

  InstanceResolver = (function(superClass) {
    extend(InstanceResolver, superClass);

    function InstanceResolver(forge, binding, instance) {
      this.instance = instance;
      InstanceResolver.__super__.constructor.call(this, forge, binding);
      assert(this.instance != null, 'The argument "instance" must have a value');
      this.dependencies = [];
    }

    InstanceResolver.prototype.resolve = function(context, args) {
      return this.instance;
    };

    InstanceResolver.prototype.toString = function() {
      var ref;
      if (this.instance == null) {
        return '<unknown instance>';
      } else if (((ref = this.instance.constructor) != null ? ref.name : void 0) != null) {
        return "an instance of " + this.instance.constructor.name;
      } else {
        return "an instance of " + (typeof this.instance);
      }
    };

    return InstanceResolver;

  })(Resolver);

  module.exports = InstanceResolver;

}).call(this);

},{"./Resolver":14,"assert":1,"underscore":18}],14:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Resolver, _, assert;

  assert = require('assert');

  _ = require('underscore');

  Resolver = (function() {
    function Resolver(forge, binding) {
      this.forge = forge;
      this.binding = binding;
      assert(this.forge != null, 'The argument "forge" must have a value');
      assert(this.binding != null, 'The argument "binding" must have a value');
    }

    Resolver.prototype.resolve = function(context, args) {
      throw new Error("You must implement resolve() on " + this.constructor.name);
    };

    Resolver.prototype.resolveDependencies = function(context, dependencies, args) {
      return _.map(dependencies, (function(_this) {
        return function(dep) {
          var override, ref;
          if (dep.name === 'forge') {
            return _this.forge;
          }
          override = (ref = args[dep.name]) != null ? ref : _this.binding["arguments"][dep.name];
          return override != null ? override : _this.forge.resolve(dep.name, context, dep.hint, dep.all);
        };
      })(this));
    };

    return Resolver;

  })();

  module.exports = Resolver;

}).call(this);

},{"assert":1,"underscore":18}],15:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var Resolver, TypeResolver, _, assert,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  assert = require('assert');

  _ = require('underscore');

  Resolver = require('./Resolver');

  TypeResolver = (function(superClass) {
    extend(TypeResolver, superClass);

    function TypeResolver(forge, binding, type1) {
      var constructor;
      this.type = type1;
      TypeResolver.__super__.constructor.call(this, forge, binding);
      assert(this.type != null, 'The argument "type" must have a value');
      constructor = this.findConstructorToInspect(this.type);
      this.dependencies = this.forge.inspector.getDependencies(constructor);
    }

    TypeResolver.prototype.resolve = function(context, args) {
      var ctor;
      args = this.resolveDependencies(context, this.dependencies, args);
      ctor = this.type.bind.apply(this.type, [null].concat(args));
      return new ctor();
    };

    TypeResolver.prototype.findConstructorToInspect = function(type) {
      var constructor;
      constructor = type;
      while (this.forge.inspector.isAutoConstructor(constructor)) {
        constructor = constructor.__super__.constructor;
      }
      return constructor;
    };

    TypeResolver.prototype.toString = function() {
      return "type{" + this.type.name + "}";
    };

    return TypeResolver;

  })(Resolver);

  module.exports = TypeResolver;

}).call(this);

},{"./Resolver":14,"assert":1,"underscore":18}],16:[function(require,module,exports){
/*!
 * Knockout JavaScript library v3.4.2
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {(function(n){var x=this||(0,eval)("this"),t=x.document,M=x.navigator,u=x.jQuery,H=x.JSON;(function(n){"function"===typeof define&&define.amd?define(["exports","require"],n):"object"===typeof exports&&"object"===typeof module?n(module.exports||exports):n(x.ko={})})(function(N,O){function J(a,c){return null===a||typeof a in R?a===c:!1}function S(b,c){var d;return function(){d||(d=a.a.setTimeout(function(){d=n;b()},c))}}function T(b,c){var d;return function(){clearTimeout(d);d=a.a.setTimeout(b,c)}}function U(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c){c&&c!==E?"beforeChange"===c?this.Ob(a):this.Ja(a,c):this.Pb(a)}function V(a,c){null!==c&&c.k&&c.k()}function W(a,c){var d=this.Mc,e=d[s];e.T||(this.ob&&this.Oa[c]?(d.Sb(c,a,this.Oa[c]),this.Oa[c]=null,--this.ob):e.s[c]||d.Sb(c,a,e.t?{$:a}:d.yc(a)),a.Ha&&a.Hc())}function K(b,c,d,e){a.d[b]={init:function(b,g,h,l,m){var k,r;a.m(function(){var q=g(),p=a.a.c(q),p=!d!==!p,A=!r;if(A||c||p!==k)A&&a.xa.Ca()&&(r=a.a.wa(a.f.childNodes(b),!0)),p?(A||a.f.fa(b,a.a.wa(r)),a.hb(e?e(m,q):m,b)):a.f.za(b),k=p},null,
    {i:b});return{controlsDescendantBindings:!0}}};a.h.va[b]=!1;a.f.aa[b]=!0}var a="undefined"!==typeof N?N:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.H=function(a,c,d){a[c]=d};a.version="3.4.2";a.b("version",a.version);a.options={deferUpdates:!1,useOnlyNativeEvents:!1};a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=
    b;return a}function e(b,c,d,e){var m=b[c].match(r)||[];a.a.r(d.match(r),function(b){a.a.ra(m,b,e)});b[c]=m.join(" ")}var f={__proto__:[]}instanceof Array,g="function"===typeof Symbol,h={},l={};h[M&&/Firefox\/2/i.test(M.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];h.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(h,function(a,b){if(b.length)for(var c=0,d=b.length;c<d;c++)l[b[c]]=a});var m={propertychange:!0},k=
    t&&function(){for(var a=3,b=t.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:n}(),r=/\S+/g;return{gc:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],r:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},o:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},Vb:function(a,b,c){for(var d=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];return null},Na:function(b,c){var d=a.a.o(b,c);0<d?b.splice(d,1):0===d&&b.shift()},Wb:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.o(c,b[d])&&c.push(b[d]);return c},ib:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},Ma:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},ta:function(a,b){if(b instanceof Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<
d;c++)a.push(b[c]);return a},ra:function(b,c,d){var e=a.a.o(a.a.Bb(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},la:f,extend:c,$a:d,ab:f?d:c,D:b,Ea:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},rb:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},nc:function(b){b=a.a.W(b);for(var c=(b[0]&&b[0].ownerDocument||t).createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.ba(b[d]));return c},wa:function(b,c){for(var d=0,e=b.length,m=[];d<e;d++){var k=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  b[d].cloneNode(!0);m.push(c?a.ba(k):k)}return m},fa:function(b,c){a.a.rb(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},uc:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],m=e.parentNode,k=0,f=c.length;k<f;k++)m.insertBefore(c[k],e);k=0;for(f=d.length;k<f;k++)a.removeNode(d[k])}},Ba:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);for(;1<a.length&&a[a.length-1].parentNode!==b;)a.length--;if(1<a.length){var c=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            a[0],d=a[a.length-1];for(a.length=0;c!==d;)a.push(c),c=c.nextSibling;a.push(d)}}return a},wc:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},cb:function(a){return null===a||a===n?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},sd:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Rc:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==
    (b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},qb:function(b){return a.a.Rc(b,b.ownerDocument.documentElement)},Tb:function(b){return!!a.a.Vb(b,a.a.qb)},A:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},Zb:function(b){return a.onError?function(){try{return b.apply(this,arguments)}catch(c){throw a.onError&&a.onError(c),c;}}:b},setTimeout:function(b,c){return setTimeout(a.a.Zb(b),c)},dc:function(b){setTimeout(function(){a.onError&&a.onError(b);throw b;},0)},q:function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c,d){var e=a.a.Zb(d);d=k&&m[c];if(a.options.useOnlyNativeEvents||d||!u)if(d||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var f=function(a){e.call(b,a)},l="on"+c;b.attachEvent(l,f);a.a.G.qa(b,function(){b.detachEvent(l,f)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,e,!1);else u(b).bind(c,e)},Fa:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===
a.a.A(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(a.options.useOnlyNativeEvents||!u||d)if("function"==typeof t.createEvent)if("function"==typeof b.dispatchEvent)d=t.createEvent(l[c]||"HTMLEvents"),d.initEvent(c,!0,!0,x,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");
else u(b).trigger(c)},c:function(b){return a.I(b)?b():b},Bb:function(b){return a.I(b)?b.p():b},fb:function(b,c,d){var k;c&&("object"===typeof b.classList?(k=b.classList[d?"add":"remove"],a.a.r(c.match(r),function(a){k.call(b.classList,a)})):"string"===typeof b.className.baseVal?e(b.className,"baseVal",c,d):e(b,"className",c,d))},bb:function(b,c){var d=a.a.c(c);if(null===d||d===n)d="";var e=a.f.firstChild(b);!e||3!=e.nodeType||a.f.nextSibling(e)?a.f.fa(b,[b.ownerDocument.createTextNode(d)]):e.data=
    d;a.a.Wc(b)},vc:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(t.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},Wc:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Sc:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},nd:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=[],e=b;e<=c;e++)d.push(e);return d},W:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},bc:function(a){return g?Symbol(a):a},xd:6===k,
    yd:7===k,C:k,ic:function(b,c){for(var d=a.a.W(b.getElementsByTagName("input")).concat(a.a.W(b.getElementsByTagName("textarea"))),e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},k=[],m=d.length-1;0<=m;m--)e(d[m])&&k.push(d[m]);return k},kd:function(b){return"string"==typeof b&&(b=a.a.cb(b))?H&&H.parse?H.parse(b):(new Function("return "+b))():null},Gb:function(b,c,d){if(!H||!H.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
        return H.stringify(a.a.c(b),c,d)},ld:function(c,d,e){e=e||{};var k=e.params||{},m=e.includeFields||this.gc,f=c;if("object"==typeof c&&"form"===a.a.A(c))for(var f=c.action,l=m.length-1;0<=l;l--)for(var g=a.a.ic(c,m[l]),h=g.length-1;0<=h;h--)k[g[h].name]=g[h].value;d=a.a.c(d);var r=t.createElement("form");r.style.display="none";r.action=f;r.method="post";for(var n in d)c=t.createElement("input"),c.type="hidden",c.name=n,c.value=a.a.Gb(a.a.c(d[n])),r.appendChild(c);b(k,function(a,b){var c=t.createElement("input");
        c.type="hidden";c.name=a;c.value=b;r.appendChild(c)});t.body.appendChild(r);e.submitter?e.submitter(r):r.submit();setTimeout(function(){r.parentNode.removeChild(r)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.r);a.b("utils.arrayFirst",a.a.Vb);a.b("utils.arrayFilter",a.a.Ma);a.b("utils.arrayGetDistinctValues",a.a.Wb);a.b("utils.arrayIndexOf",a.a.o);a.b("utils.arrayMap",a.a.ib);a.b("utils.arrayPushAll",a.a.ta);a.b("utils.arrayRemoveItem",a.a.Na);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",
    a.a.gc);a.b("utils.getFormFields",a.a.ic);a.b("utils.peekObservable",a.a.Bb);a.b("utils.postJson",a.a.ld);a.b("utils.parseJson",a.a.kd);a.b("utils.registerEventHandler",a.a.q);a.b("utils.stringifyJson",a.a.Gb);a.b("utils.range",a.a.nd);a.b("utils.toggleDomNodeCssClass",a.a.fb);a.b("utils.triggerEvent",a.a.Fa);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.D);a.b("utils.addOrRemoveItem",a.a.ra);a.b("utils.setTextContent",a.a.bb);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=
    function(a){var c=this;if(1===arguments.length)return function(){return c.apply(a,arguments)};var d=Array.prototype.slice.call(arguments,1);return function(){var e=d.slice(0);e.push.apply(e,arguments);return c.apply(a,e)}});a.a.e=new function(){function a(b,g){var h=b[d];if(!h||"null"===h||!e[h]){if(!g)return n;h=b[d]="ko"+c++;e[h]={}}return e[h]}var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===n?n:e[d]},set:function(c,d,e){if(e!==n||a(c,!1)!==n)a(c,!0)[d]=
    e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},J:function(){return c++ +d}}};a.b("utils.domData",a.a.e);a.b("utils.domData.clear",a.a.e.clear);a.a.G=new function(){function b(b,c){var e=a.a.e.get(b,d);e===n&&c&&(e=[],a.a.e.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),l=0;l<e.length;l++)e[l](d);a.a.e.clear(d);a.a.G.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.e.J(),e={1:!0,8:!0,9:!0},
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              f={1:!0,9:!0};return{qa:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},tc:function(c,e){var f=b(c,!1);f&&(a.a.Na(f,e),0==f.length&&a.a.e.set(c,d,n))},ba:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.ta(d,b.getElementsByTagName("*"));for(var l=0,m=d.length;l<m;l++)c(d[l])}return b},removeNode:function(b){a.ba(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){u&&"function"==typeof u.cleanData&&u.cleanData([a])}}};
    a.ba=a.a.G.ba;a.removeNode=a.a.G.removeNode;a.b("cleanNode",a.ba);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.G);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.G.qa);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.G.tc);(function(){var b=[0,"",""],c=[1,"<table>","</table>"],d=[3,"<table><tbody><tr>","</tr></tbody></table>"],e=[1,"<select multiple='multiple'>","</select>"],f={thead:c,tbody:c,tfoot:c,tr:[2,"<table><tbody>","</tbody></table>"],td:d,th:d,option:e,optgroup:e},
                                                                                                                                                                                                                                                                             g=8>=a.a.C;a.a.na=function(c,d){var e;if(u)if(u.parseHTML)e=u.parseHTML(c,d)||[];else{if((e=u.clean([c],d))&&e[0]){for(var k=e[0];k.parentNode&&11!==k.parentNode.nodeType;)k=k.parentNode;k.parentNode&&k.parentNode.removeChild(k)}}else{(e=d)||(e=t);var k=e.parentWindow||e.defaultView||x,r=a.a.cb(c).toLowerCase(),q=e.createElement("div"),p;p=(r=r.match(/^<([a-z]+)[ >]/))&&f[r[1]]||b;r=p[0];p="ignored<div>"+p[1]+c+p[2]+"</div>";"function"==typeof k.innerShiv?q.appendChild(k.innerShiv(p)):(g&&e.appendChild(q),
        q.innerHTML=p,g&&q.parentNode.removeChild(q));for(;r--;)q=q.lastChild;e=a.a.W(q.lastChild.childNodes)}return e};a.a.Eb=function(b,c){a.a.rb(b);c=a.a.c(c);if(null!==c&&c!==n)if("string"!=typeof c&&(c=c.toString()),u)u(b).html(c);else for(var d=a.a.na(c,b.ownerDocument),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.na);a.b("utils.setHtml",a.a.Eb);a.N=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.N.pc(c.nodeValue);null!=f&&e.push({Qc:c,hd:f})}else if(1==c.nodeType)for(var f=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  0,g=c.childNodes,h=g.length;f<h;f++)b(g[f],e)}var c={};return{yb:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},Bc:function(a,b){var f=c[a];if(f===n)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),
        !0}finally{delete c[a]}},Cc:function(c,e){var f=[];b(c,f);for(var g=0,h=f.length;g<h;g++){var l=f[g].Qc,m=[l];e&&a.a.ta(m,e);a.N.Bc(f[g].hd,m);l.nodeValue="";l.parentNode&&l.parentNode.removeChild(l)}},pc:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.N);a.b("memoization.memoize",a.N.yb);a.b("memoization.unmemoize",a.N.Bc);a.b("memoization.parseMemoText",a.N.pc);a.b("memoization.unmemoizeDomNodeAndDescendants",a.N.Cc);a.Z=function(){function b(){if(e)for(var b=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     e,c=0,m;g<e;)if(m=d[g++]){if(g>b){if(5E3<=++c){g=e;a.a.dc(Error("'Too much recursion' after processing "+c+" task groups."));break}b=e}try{m()}catch(k){a.a.dc(k)}}}function c(){b();g=e=d.length=0}var d=[],e=0,f=1,g=0;return{scheduler:x.MutationObserver?function(a){var b=t.createElement("div");(new MutationObserver(a)).observe(b,{attributes:!0});return function(){b.classList.toggle("foo")}}(c):t&&"onreadystatechange"in t.createElement("script")?function(a){var b=t.createElement("script");b.onreadystatechange=
        function(){b.onreadystatechange=null;t.documentElement.removeChild(b);b=null;a()};t.documentElement.appendChild(b)}:function(a){setTimeout(a,0)},Za:function(b){e||a.Z.scheduler(c);d[e++]=b;return f++},cancel:function(a){a-=f-e;a>=g&&a<e&&(d[a]=null)},resetForTesting:function(){var a=e-g;g=e=d.length=0;return a},rd:b}}();a.b("tasks",a.Z);a.b("tasks.schedule",a.Z.Za);a.b("tasks.runEarly",a.Z.rd);a.Aa={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.B({read:b,write:function(e){clearTimeout(d);
        d=a.a.setTimeout(function(){b(e)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);a.gb=!1;f="notifyWhenChangesStop"==e?T:S;a.Wa(function(a){return f(a,d)})},deferred:function(b,c){if(!0!==c)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");b.gb||(b.gb=!0,b.Wa(function(c){var e,f=!1;return function(){if(!f){a.Z.cancel(e);e=a.Z.Za(c);try{f=!0,b.notifySubscribers(n,"dirty")}finally{f=
        !1}}}}))},notify:function(a,c){a.equalityComparer="always"==c?null:J}};var R={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Aa);a.zc=function(b,c,d){this.$=b;this.jb=c;this.Pc=d;this.T=!1;a.H(this,"dispose",this.k)};a.zc.prototype.k=function(){this.T=!0;this.Pc()};a.K=function(){a.a.ab(this,D);D.ub(this)};var E="change",D={ub:function(a){a.F={change:[]};a.Qb=1},Y:function(b,c,d){var e=this;d=d||E;var f=new a.zc(e,c?b.bind(c):b,function(){a.a.Na(e.F[d],f);e.Ka&&e.Ka(d)});e.ua&&e.ua(d);
        e.F[d]||(e.F[d]=[]);e.F[d].push(f);return f},notifySubscribers:function(b,c){c=c||E;c===E&&this.Kb();if(this.Ra(c)){var d=c===E&&this.Fc||this.F[c].slice(0);try{a.l.Xb();for(var e=0,f;f=d[e];++e)f.T||f.jb(b)}finally{a.l.end()}}},Pa:function(){return this.Qb},Zc:function(a){return this.Pa()!==a},Kb:function(){++this.Qb},Wa:function(b){var c=this,d=a.I(c),e,f,g,h;c.Ja||(c.Ja=c.notifySubscribers,c.notifySubscribers=U);var l=b(function(){c.Ha=!1;d&&h===c&&(h=c.Mb?c.Mb():c());var a=f||c.Ua(g,h);f=e=!1;
        a&&c.Ja(g=h)});c.Pb=function(a){c.Fc=c.F[E].slice(0);c.Ha=e=!0;h=a;l()};c.Ob=function(a){e||(g=a,c.Ja(a,"beforeChange"))};c.Hc=function(){c.Ua(g,c.p(!0))&&(f=!0)}},Ra:function(a){return this.F[a]&&this.F[a].length},Xc:function(b){if(b)return this.F[b]&&this.F[b].length||0;var c=0;a.a.D(this.F,function(a,b){"dirty"!==a&&(c+=b.length)});return c},Ua:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.D(b,function(b,e){var f=a.Aa[b];"function"==
    typeof f&&(c=f(c,e)||c)});return c}};a.H(D,"subscribe",D.Y);a.H(D,"extend",D.extend);a.H(D,"getSubscriptionsCount",D.Xc);a.a.la&&a.a.$a(D,Function.prototype);a.K.fn=D;a.lc=function(a){return null!=a&&"function"==typeof a.Y&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.K);a.b("isSubscribable",a.lc);a.xa=a.l=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{Xb:b,end:c,sc:function(b){if(e){if(!a.lc(b))throw Error("Only subscribable things can act as dependencies");
        e.jb.call(e.Lc,b,b.Gc||(b.Gc=++f))}},w:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},Ca:function(){if(e)return e.m.Ca()},Va:function(){if(e)return e.Va}}}();a.b("computedContext",a.xa);a.b("computedContext.getDependenciesCount",a.xa.Ca);a.b("computedContext.isInitial",a.xa.Va);a.b("ignoreDependencies",a.wd=a.l.w);var F=a.a.bc("_latestValue");a.O=function(b){function c(){if(0<arguments.length)return c.Ua(c[F],arguments[0])&&(c.ia(),c[F]=arguments[0],c.ha()),this;a.l.sc(c);return c[F]}
        c[F]=b;a.a.la||a.a.extend(c,a.K.fn);a.K.fn.ub(c);a.a.ab(c,B);a.options.deferUpdates&&a.Aa.deferred(c,!0);return c};var B={equalityComparer:J,p:function(){return this[F]},ha:function(){this.notifySubscribers(this[F])},ia:function(){this.notifySubscribers(this[F],"beforeChange")}};a.a.la&&a.a.$a(B,a.K.fn);var I=a.O.md="__ko_proto__";B[I]=a.O;a.Qa=function(b,c){return null===b||b===n||b[I]===n?!1:b[I]===c?!0:a.Qa(b[I],c)};a.I=function(b){return a.Qa(b,a.O)};a.Da=function(b){return"function"==typeof b&&
    b[I]===a.O||"function"==typeof b&&b[I]===a.B&&b.$c?!0:!1};a.b("observable",a.O);a.b("isObservable",a.I);a.b("isWriteableObservable",a.Da);a.b("isWritableObservable",a.Da);a.b("observable.fn",B);a.H(B,"peek",B.p);a.H(B,"valueHasMutated",B.ha);a.H(B,"valueWillMutate",B.ia);a.ma=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.O(b);a.a.ab(b,a.ma.fn);return b.extend({trackArrayChanges:!0})};
    a.ma.fn={remove:function(b){for(var c=this.p(),d=[],e="function"!=typeof b||a.I(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var g=c[f];e(g)&&(0===d.length&&this.ia(),d.push(g),c.splice(f,1),f--)}d.length&&this.ha();return d},removeAll:function(b){if(b===n){var c=this.p(),d=c.slice(0);this.ia();c.splice(0,c.length);this.ha();return d}return b?this.remove(function(c){return 0<=a.a.o(b,c)}):[]},destroy:function(b){var c=this.p(),d="function"!=typeof b||a.I(b)?function(a){return a===b}:b;this.ia();
        for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.ha()},destroyAll:function(b){return b===n?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.o(b,c)}):[]},indexOf:function(b){var c=this();return a.a.o(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.ia(),this.p()[d]=c,this.ha())}};a.a.la&&a.a.$a(a.ma.fn,a.O.fn);a.a.r("pop push reverse shift sort splice unshift".split(" "),function(b){a.ma.fn[b]=function(){var a=this.p();this.ia();this.Yb(a,b,arguments);
        var d=a[b].apply(a,arguments);this.ha();return d===a?this:d}});a.a.r(["slice"],function(b){a.ma.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.b("observableArray",a.ma);a.Aa.trackArrayChanges=function(b,c){function d(){if(!e){e=!0;l=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==E||++h;return l.apply(this,arguments)};var c=[].concat(b.p()||[]);f=null;g=b.Y(function(d){d=[].concat(d||[]);if(b.Ra("arrayChange")){var e;if(!f||1<h)f=a.a.lb(c,d,b.kb);e=f}c=d;f=null;h=0;
        e&&e.length&&b.notifySubscribers(e,"arrayChange")})}}b.kb={};c&&"object"==typeof c&&a.a.extend(b.kb,c);b.kb.sparse=!0;if(!b.Yb){var e=!1,f=null,g,h=0,l,m=b.ua,k=b.Ka;b.ua=function(a){m&&m.call(b,a);"arrayChange"===a&&d()};b.Ka=function(a){k&&k.call(b,a);"arrayChange"!==a||b.Ra("arrayChange")||(l&&(b.notifySubscribers=l,l=n),g.k(),e=!1)};b.Yb=function(b,c,d){function k(a,b,c){return m[m.length]={status:a,value:b,index:c}}if(e&&!h){var m=[],l=b.length,g=d.length,G=0;switch(c){case "push":G=l;case "unshift":for(c=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              0;c<g;c++)k("added",d[c],G+c);break;case "pop":G=l-1;case "shift":l&&k("deleted",b[G],G);break;case "splice":c=Math.min(Math.max(0,0>d[0]?l+d[0]:d[0]),l);for(var l=1===g?l:Math.min(c+(d[1]||0),l),g=c+g-2,G=Math.max(l,g),n=[],s=[],w=2;c<G;++c,++w)c<l&&s.push(k("deleted",b[c],c)),c<g&&n.push(k("added",d[w],c));a.a.hc(s,n);break;default:return}f=m}}}};var s=a.a.bc("_state");a.m=a.B=function(b,c,d){function e(){if(0<arguments.length){if("function"===typeof f)f.apply(g.sb,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
        return this}a.l.sc(e);(g.V||g.t&&e.Sa())&&e.U();return g.M}"object"===typeof b?d=b:(d=d||{},b&&(d.read=b));if("function"!=typeof d.read)throw Error("Pass a function that returns the value of the ko.computed");var f=d.write,g={M:n,da:!0,V:!0,Ta:!1,Hb:!1,T:!1,Ya:!1,t:!1,od:d.read,sb:c||d.owner,i:d.disposeWhenNodeIsRemoved||d.i||null,ya:d.disposeWhen||d.ya,pb:null,s:{},L:0,fc:null};e[s]=g;e.$c="function"===typeof f;a.a.la||a.a.extend(e,a.K.fn);a.K.fn.ub(e);a.a.ab(e,z);d.pure?(g.Ya=!0,g.t=!0,a.a.extend(e,
        Y)):d.deferEvaluation&&a.a.extend(e,Z);a.options.deferUpdates&&a.Aa.deferred(e,!0);g.i&&(g.Hb=!0,g.i.nodeType||(g.i=null));g.t||d.deferEvaluation||e.U();g.i&&e.ca()&&a.a.G.qa(g.i,g.pb=function(){e.k()});return e};var z={equalityComparer:J,Ca:function(){return this[s].L},Sb:function(a,c,d){if(this[s].Ya&&c===this)throw Error("A 'pure' computed must not be called recursively");this[s].s[a]=d;d.Ia=this[s].L++;d.pa=c.Pa()},Sa:function(){var a,c,d=this[s].s;for(a in d)if(d.hasOwnProperty(a)&&(c=d[a],this.oa&&
        c.$.Ha||c.$.Zc(c.pa)))return!0},gd:function(){this.oa&&!this[s].Ta&&this.oa(!1)},ca:function(){var a=this[s];return a.V||0<a.L},qd:function(){this.Ha?this[s].V&&(this[s].da=!0):this.ec()},yc:function(a){if(a.gb&&!this[s].i){var c=a.Y(this.gd,this,"dirty"),d=a.Y(this.qd,this);return{$:a,k:function(){c.k();d.k()}}}return a.Y(this.ec,this)},ec:function(){var b=this,c=b.throttleEvaluation;c&&0<=c?(clearTimeout(this[s].fc),this[s].fc=a.a.setTimeout(function(){b.U(!0)},c)):b.oa?b.oa(!0):b.U(!0)},U:function(b){var c=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             this[s],d=c.ya,e=!1;if(!c.Ta&&!c.T){if(c.i&&!a.a.qb(c.i)||d&&d()){if(!c.Hb){this.k();return}}else c.Hb=!1;c.Ta=!0;try{e=this.Vc(b)}finally{c.Ta=!1}c.L||this.k();return e}},Vc:function(b){var c=this[s],d=!1,e=c.Ya?n:!c.L,f={Mc:this,Oa:c.s,ob:c.L};a.l.Xb({Lc:f,jb:W,m:this,Va:e});c.s={};c.L=0;f=this.Uc(c,f);this.Ua(c.M,f)&&(c.t||this.notifySubscribers(c.M,"beforeChange"),c.M=f,c.t?this.Kb():b&&this.notifySubscribers(c.M),d=!0);e&&this.notifySubscribers(c.M,"awake");return d},Uc:function(b,c){try{var d=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       b.od;return b.sb?d.call(b.sb):d()}finally{a.l.end(),c.ob&&!b.t&&a.a.D(c.Oa,V),b.da=b.V=!1}},p:function(a){var c=this[s];(c.V&&(a||!c.L)||c.t&&this.Sa())&&this.U();return c.M},Wa:function(b){a.K.fn.Wa.call(this,b);this.Mb=function(){this[s].da?this.U():this[s].V=!1;return this[s].M};this.oa=function(a){this.Ob(this[s].M);this[s].V=!0;a&&(this[s].da=!0);this.Pb(this)}},k:function(){var b=this[s];!b.t&&b.s&&a.a.D(b.s,function(a,b){b.k&&b.k()});b.i&&b.pb&&a.a.G.tc(b.i,b.pb);b.s=null;b.L=0;b.T=!0;b.da=
        !1;b.V=!1;b.t=!1;b.i=null}},Y={ua:function(b){var c=this,d=c[s];if(!d.T&&d.t&&"change"==b){d.t=!1;if(d.da||c.Sa())d.s=null,d.L=0,c.U()&&c.Kb();else{var e=[];a.a.D(d.s,function(a,b){e[b.Ia]=a});a.a.r(e,function(a,b){var e=d.s[a],l=c.yc(e.$);l.Ia=b;l.pa=e.pa;d.s[a]=l})}d.T||c.notifySubscribers(d.M,"awake")}},Ka:function(b){var c=this[s];c.T||"change"!=b||this.Ra("change")||(a.a.D(c.s,function(a,b){b.k&&(c.s[a]={$:b.$,Ia:b.Ia,pa:b.pa},b.k())}),c.t=!0,this.notifySubscribers(n,"asleep"))},Pa:function(){var b=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       this[s];b.t&&(b.da||this.Sa())&&this.U();return a.K.fn.Pa.call(this)}},Z={ua:function(a){"change"!=a&&"beforeChange"!=a||this.p()}};a.a.la&&a.a.$a(z,a.K.fn);var P=a.O.md;a.m[P]=a.O;z[P]=a.m;a.bd=function(b){return a.Qa(b,a.m)};a.cd=function(b){return a.Qa(b,a.m)&&b[s]&&b[s].Ya};a.b("computed",a.m);a.b("dependentObservable",a.m);a.b("isComputed",a.bd);a.b("isPureComputed",a.cd);a.b("computed.fn",z);a.H(z,"peek",z.p);a.H(z,"dispose",z.k);a.H(z,"isActive",z.ca);a.H(z,"getDependenciesCount",z.Ca);a.rc=
        function(b,c){if("function"===typeof b)return a.m(b,c,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.m(b,c)};a.b("pureComputed",a.rc);(function(){function b(a,f,g){g=g||new d;a=f(a);if("object"!=typeof a||null===a||a===n||a instanceof RegExp||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var h=a instanceof Array?[]:{};g.save(a,h);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":h[c]=d;break;case "object":case "undefined":var k=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 g.get(d);h[c]=k!==n?k:b(d,f,g)}});return h}function c(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.Lb=[]}a.Ac=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.I(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Ac(b);return a.a.Gb(b,c,d)};d.prototype={save:function(b,c){var d=a.a.o(this.keys,
        b);0<=d?this.Lb[d]=c:(this.keys.push(b),this.Lb.push(c))},get:function(b){b=a.a.o(this.keys,b);return 0<=b?this.Lb[b]:n}}})();a.b("toJS",a.Ac);a.b("toJSON",a.toJSON);(function(){a.j={u:function(b){switch(a.a.A(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.e.get(b,a.d.options.zb):7>=a.a.C?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.j.u(b.options[b.selectedIndex]):n;default:return b.value}},ja:function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       c,d){switch(a.a.A(b)){case "option":switch(typeof c){case "string":a.a.e.set(b,a.d.options.zb,n);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.e.set(b,a.d.options.zb,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||null===c)c=n;for(var e=-1,f=0,g=b.options.length,h;f<g;++f)if(h=a.j.u(b.options[f]),h==c||""==h&&c===n){e=f;break}if(d||0<=e||c===n&&1<b.size)b.selectedIndex=e;break;default:if(null===
        c||c===n)c="";b.value=c}}}})();a.b("selectExtensions",a.j);a.b("selectExtensions.readValue",a.j.u);a.b("selectExtensions.writeValue",a.j.ja);a.h=function(){function b(b){b=a.a.cb(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),r,h=[],p=0;if(d){d.push(",");for(var A=0,y;y=d[A];++A){var v=y.charCodeAt(0);if(44===v){if(0>=p){c.push(r&&h.length?{key:r,value:h.join("")}:{unknown:r||h.join("")});r=p=0;h=[];continue}}else if(58===v){if(!p&&!r&&1===h.length){r=h.pop();continue}}else 47===
    v&&A&&1<y.length?(v=d[A-1].match(f))&&!g[v[0]]&&(b=b.substr(b.indexOf(y)+1),d=b.match(e),d.push(","),A=-1,y="/"):40===v||123===v||91===v?++p:41===v||125===v||93===v?--p:r||h.length||34!==v&&39!==v||(y=y.slice(1,-1));h.push(y)}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,
                                                                                                                                                                                                                                                    g={"in":1,"return":1,"typeof":1},h={};return{va:[],ga:h,Ab:b,Xa:function(e,m){function k(b,e){var m;if(!A){var l=a.getBindingHandler(b);if(l&&l.preprocess&&!(e=l.preprocess(e,b,k)))return;if(l=h[b])m=e,0<=a.a.o(c,m)?m=!1:(l=m.match(d),m=null===l?!1:l[1]?"Object("+l[1]+")"+l[2]:m),l=m;l&&g.push("'"+b+"':function(_z){"+m+"=_z}")}p&&(e="function(){return "+e+" }");f.push("'"+b+"':"+e)}m=m||{};var f=[],g=[],p=m.valueAccessors,A=m.bindingParams,y="string"===typeof e?b(e):e;a.a.r(y,function(a){k(a.key||
        a.unknown,a.value)});g.length&&k("_ko_property_writers","{"+g.join(",")+" }");return f.join(",")},fd:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;return!1},Ga:function(b,c,d,e,f){if(b&&a.I(b))!a.Da(b)||f&&b.p()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.h);a.b("expressionRewriting.bindingRewriteValidators",a.h.va);a.b("expressionRewriting.parseObjectLiteral",a.h.Ab);a.b("expressionRewriting.preProcessBindings",a.h.Xa);a.b("expressionRewriting._twoWayBindings",
        a.h.ga);a.b("jsonExpressionRewriting",a.h);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.h.Xa);(function(){function b(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&h.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,f=1,l=[];e=e.nextSibling;){if(c(e)&&(f--,0===f))return l;l.push(e);b(e)&&f++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-
    1].nextSibling:a.nextSibling:null}var f=t&&"\x3c!--test--\x3e"===t.createComment("test").text,g=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,h=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,l={ul:!0,ol:!0};a.f={aa:{},childNodes:function(a){return b(a)?d(a):a.childNodes},za:function(c){if(b(c)){c=a.f.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.rb(c)},fa:function(c,d){if(b(c)){a.f.za(c);for(var e=c.nextSibling,f=0,l=d.length;f<l;f++)e.parentNode.insertBefore(d[f],
        e)}else a.a.fa(c,d)},qc:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},kc:function(c,d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.f.qc(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Yc:b,vd:function(a){return(a=
        (f?a.text:a.nodeValue).match(g))?a[1]:null},oc:function(d){if(l[a.a.A(d)]){var k=d.firstChild;if(k){do if(1===k.nodeType){var f;f=k.firstChild;var g=null;if(f){do if(g)g.push(f);else if(b(f)){var h=e(f,!0);h?f=h:g=[f]}else c(f)&&(g=[f]);while(f=f.nextSibling)}if(f=g)for(g=k.nextSibling,h=0;h<f.length;h++)g?d.insertBefore(f[h],g):d.appendChild(f[h])}while(k=k.nextSibling)}}}}})();a.b("virtualElements",a.f);a.b("virtualElements.allowedBindings",a.f.aa);a.b("virtualElements.emptyNode",a.f.za);a.b("virtualElements.insertAfter",
        a.f.kc);a.b("virtualElements.prepend",a.f.qc);a.b("virtualElements.setDomNodeChildren",a.f.fa);(function(){a.S=function(){this.Kc={}};a.a.extend(a.S.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind")||a.g.getComponentNameForNode(b);case 8:return a.f.Yc(b);default:return!1}},getBindings:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b):null;return a.g.Rb(d,b,c,!1)},getBindingAccessors:function(b,c){var d=this.getBindingsString(b,
        c),d=d?this.parseBindingsString(d,c,b,{valueAccessors:!0}):null;return a.g.Rb(d,b,c,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");case 8:return a.f.vd(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var f=this.Kc,g=b+(e&&e.valueAccessors||""),h;if(!(h=f[g])){var l,m="with($context){with($data||{}){return{"+a.h.Xa(b,e)+"}}}";l=new Function("$context","$element",m);h=f[g]=l}return h(c,d)}catch(k){throw k.message="Unable to parse bindings.\nBindings value: "+
        b+"\nMessage: "+k.message,k;}}});a.S.instance=new a.S})();a.b("bindingProvider",a.S);(function(){function b(a){return function(){return a}}function c(a){return a()}function d(b){return a.a.Ea(a.l.w(b),function(a,c){return function(){return b()[c]}})}function e(c,e,k){return"function"===typeof c?d(c.bind(null,e,k)):a.a.Ea(c,b)}function f(a,b){return d(this.getBindings.bind(this,a,b))}function g(b,c,d){var e,k=a.f.firstChild(c),f=a.S.instance,m=f.preprocessNode;if(m){for(;e=k;)k=a.f.nextSibling(e),
        m.call(f,e);k=a.f.firstChild(c)}for(;e=k;)k=a.f.nextSibling(e),h(b,e,d)}function h(b,c,d){var e=!0,k=1===c.nodeType;k&&a.f.oc(c);if(k&&d||a.S.instance.nodeHasBindings(c))e=m(c,null,b,d).shouldBindDescendants;e&&!r[a.a.A(c)]&&g(b,c,!k)}function l(b){var c=[],d={},e=[];a.a.D(b,function X(k){if(!d[k]){var f=a.getBindingHandler(k);f&&(f.after&&(e.push(k),a.a.r(f.after,function(c){if(b[c]){if(-1!==a.a.o(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));
        X(c)}}),e.length--),c.push({key:k,jc:f}));d[k]=!0}});return c}function m(b,d,e,k){var m=a.a.e.get(b,q);if(!d){if(m)throw Error("You cannot apply bindings multiple times to the same element.");a.a.e.set(b,q,!0)}!m&&k&&a.xc(b,e);var g;if(d&&"function"!==typeof d)g=d;else{var h=a.S.instance,r=h.getBindingAccessors||f,p=a.B(function(){(g=d?d(e,b):r.call(h,b,e))&&e.Q&&e.Q();return g},null,{i:b});g&&p.ca()||(p=null)}var s;if(g){var t=p?function(a){return function(){return c(p()[a])}}:function(a){return g[a]},
                                                                                                                                                                                                                                                                                                                                                                                                                                                      u=function(){return a.a.Ea(p?p():g,c)};u.get=function(a){return g[a]&&c(t(a))};u.has=function(a){return a in g};k=l(g);a.a.r(k,function(c){var d=c.jc.init,k=c.jc.update,f=c.key;if(8===b.nodeType&&!a.f.aa[f])throw Error("The binding '"+f+"' cannot be used with virtual elements");try{"function"==typeof d&&a.l.w(function(){var a=d(b,t(f),u,e.$data,e);if(a&&a.controlsDescendantBindings){if(s!==n)throw Error("Multiple bindings ("+s+" and "+f+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
        s=f}}),"function"==typeof k&&a.B(function(){k(b,t(f),u,e.$data,e)},null,{i:b})}catch(m){throw m.message='Unable to process binding "'+f+": "+g[f]+'"\nMessage: '+m.message,m;}})}return{shouldBindDescendants:s===n}}function k(b){return b&&b instanceof a.R?b:new a.R(b)}a.d={};var r={script:!0,textarea:!0,template:!0};a.getBindingHandler=function(b){return a.d[b]};a.R=function(b,c,d,e,k){function f(){var k=g?b():b,m=a.a.c(k);c?(c.Q&&c.Q(),a.a.extend(l,c),l.Q=r):(l.$parents=[],l.$root=m,l.ko=a);l.$rawData=
        k;l.$data=m;d&&(l[d]=m);e&&e(l,c,m);return l.$data}function m(){return h&&!a.a.Tb(h)}var l=this,g="function"==typeof b&&!a.I(b),h,r;k&&k.exportDependencies?f():(r=a.B(f,null,{ya:m,i:!0}),r.ca()&&(l.Q=r,r.equalityComparer=null,h=[],r.Dc=function(b){h.push(b);a.a.G.qa(b,function(b){a.a.Na(h,b);h.length||(r.k(),l.Q=r=n)})}))};a.R.prototype.createChildContext=function(b,c,d,e){return new a.R(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);
        d&&d(a)},e)};a.R.prototype.extend=function(b){return new a.R(this.Q||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};a.R.prototype.ac=function(a,b){return this.createChildContext(a,b,null,{exportDependencies:!0})};var q=a.a.e.J(),p=a.a.e.J();a.xc=function(b,c){if(2==arguments.length)a.a.e.set(b,p,c),c.Q&&c.Q.Dc(b);else return a.a.e.get(b,p)};a.La=function(b,c,d){1===b.nodeType&&a.f.oc(b);return m(b,c,k(d),!0)};a.Ic=function(b,c,d){d=k(d);return a.La(b,
        e(c,d,b),d)};a.hb=function(a,b){1!==b.nodeType&&8!==b.nodeType||g(k(a),b,!0)};a.Ub=function(a,b){!u&&x.jQuery&&(u=x.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||x.document.body;h(k(a),b,!0)};a.nb=function(b){switch(b.nodeType){case 1:case 8:var c=a.xc(b);if(c)return c;if(b.parentNode)return a.nb(b.parentNode)}return n};a.Oc=function(b){return(b=a.nb(b))?b.$data:n};a.b("bindingHandlers",
        a.d);a.b("applyBindings",a.Ub);a.b("applyBindingsToDescendants",a.hb);a.b("applyBindingAccessorsToNode",a.La);a.b("applyBindingsToNode",a.Ic);a.b("contextFor",a.nb);a.b("dataFor",a.Oc)})();(function(b){function c(c,e){var m=f.hasOwnProperty(c)?f[c]:b,k;m?m.Y(e):(m=f[c]=new a.K,m.Y(e),d(c,function(b,d){var e=!(!d||!d.synchronous);g[c]={definition:b,dd:e};delete f[c];k||e?m.notifySubscribers(b):a.Z.Za(function(){m.notifySubscribers(b)})}),k=!0)}function d(a,b){e("getConfig",[a],function(c){c?e("loadComponent",
        [a,c],function(a){b(a,c)}):b(null,null)})}function e(c,d,f,k){k||(k=a.g.loaders.slice(0));var g=k.shift();if(g){var q=g[c];if(q){var p=!1;if(q.apply(g,d.concat(function(a){p?f(null):null!==a?f(a):e(c,d,f,k)}))!==b&&(p=!0,!g.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");}else e(c,d,f,k)}else f(null)}var f={},g={};a.g={get:function(d,e){var f=g.hasOwnProperty(d)?g[d]:b;f?f.dd?a.l.w(function(){e(f.definition)}):
        a.Z.Za(function(){e(f.definition)}):c(d,e)},$b:function(a){delete g[a]},Nb:e};a.g.loaders=[];a.b("components",a.g);a.b("components.get",a.g.get);a.b("components.clearCachedDefinition",a.g.$b)})();(function(){function b(b,c,d,e){function g(){0===--y&&e(h)}var h={},y=2,v=d.template;d=d.viewModel;v?f(c,v,function(c){a.g.Nb("loadTemplate",[b,c],function(a){h.template=a;g()})}):g();d?f(c,d,function(c){a.g.Nb("loadViewModel",[b,c],function(a){h[l]=a;g()})}):g()}function c(a,b,d){if("function"===typeof b)d(function(a){return new b(a)});
    else if("function"===typeof b[l])d(b[l]);else if("instance"in b){var e=b.instance;d(function(){return e})}else"viewModel"in b?c(a,b.viewModel,d):a("Unknown viewModel value: "+b)}function d(b){switch(a.a.A(b)){case "script":return a.a.na(b.text);case "textarea":return a.a.na(b.value);case "template":if(e(b.content))return a.a.wa(b.content.childNodes)}return a.a.wa(b.childNodes)}function e(a){return x.DocumentFragment?a instanceof DocumentFragment:a&&11===a.nodeType}function f(a,b,c){"string"===typeof b.require?
        O||x.require?(O||x.require)([b.require],c):a("Uses require, but no AMD loader is present"):c(b)}function g(a){return function(b){throw Error("Component '"+a+"': "+b);}}var h={};a.g.register=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.g.wb(b))throw Error("Component "+b+" is already registered");h[b]=c};a.g.wb=function(a){return h.hasOwnProperty(a)};a.g.ud=function(b){delete h[b];a.g.$b(b)};a.g.cc={getConfig:function(a,b){b(h.hasOwnProperty(a)?h[a]:null)},loadComponent:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  c,d){var e=g(a);f(e,c,function(c){b(a,e,c,d)})},loadTemplate:function(b,c,f){b=g(b);if("string"===typeof c)f(a.a.na(c));else if(c instanceof Array)f(c);else if(e(c))f(a.a.W(c.childNodes));else if(c.element)if(c=c.element,x.HTMLElement?c instanceof HTMLElement:c&&c.tagName&&1===c.nodeType)f(d(c));else if("string"===typeof c){var l=t.getElementById(c);l?f(d(l)):b("Cannot find element with ID "+c)}else b("Unknown element type: "+c);else b("Unknown template value: "+c)},loadViewModel:function(a,b,d){c(g(a),
        b,d)}};var l="createViewModel";a.b("components.register",a.g.register);a.b("components.isRegistered",a.g.wb);a.b("components.unregister",a.g.ud);a.b("components.defaultLoader",a.g.cc);a.g.loaders.push(a.g.cc);a.g.Ec=h})();(function(){function b(b,e){var f=b.getAttribute("params");if(f){var f=c.parseBindingsString(f,e,b,{valueAccessors:!0,bindingParams:!0}),f=a.a.Ea(f,function(c){return a.m(c,null,{i:b})}),g=a.a.Ea(f,function(c){var e=c.p();return c.ca()?a.m({read:function(){return a.a.c(c())},write:a.Da(e)&&
    function(a){c()(a)},i:b}):e});g.hasOwnProperty("$raw")||(g.$raw=f);return g}return{$raw:{}}}a.g.getComponentNameForNode=function(b){var c=a.a.A(b);if(a.g.wb(c)&&(-1!=c.indexOf("-")||"[object HTMLUnknownElement]"==""+b||8>=a.a.C&&b.tagName===c))return c};a.g.Rb=function(c,e,f,g){if(1===e.nodeType){var h=a.g.getComponentNameForNode(e);if(h){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');var l={name:h,params:b(e,f)};c.component=g?function(){return l}:
        l}}return c};var c=new a.S;9>a.a.C&&(a.g.register=function(a){return function(b){t.createElement(b);return a.apply(this,arguments)}}(a.g.register),t.createDocumentFragment=function(b){return function(){var c=b(),f=a.g.Ec,g;for(g in f)f.hasOwnProperty(g)&&c.createElement(g);return c}}(t.createDocumentFragment))})();(function(b){function c(b,c,d){c=c.template;if(!c)throw Error("Component '"+b+"' has no template");b=a.a.wa(c);a.f.fa(d,b)}function d(a,b,c,d){var e=a.createViewModel;return e?e.call(a,
        d,{element:b,templateNodes:c}):d}var e=0;a.d.component={init:function(f,g,h,l,m){function k(){var a=r&&r.dispose;"function"===typeof a&&a.call(r);q=r=null}var r,q,p=a.a.W(a.f.childNodes(f));a.a.G.qa(f,k);a.m(function(){var l=a.a.c(g()),h,v;"string"===typeof l?h=l:(h=a.a.c(l.name),v=a.a.c(l.params));if(!h)throw Error("No component name specified");var n=q=++e;a.g.get(h,function(e){if(q===n){k();if(!e)throw Error("Unknown component '"+h+"'");c(h,e,f);var l=d(e,f,p,v);e=m.createChildContext(l,b,function(a){a.$component=
        l;a.$componentTemplateNodes=p});r=l;a.hb(e,f)}})},null,{i:f});return{controlsDescendantBindings:!0}}};a.f.aa.component=!0})();var Q={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.D(d,function(c,d){d=a.a.c(d);var g=!1===d||null===d||d===n;g&&b.removeAttribute(c);8>=a.a.C&&c in Q?(c=Q[c],g?b.removeAttribute(c):b[c]=d):g||b.setAttribute(c,d.toString());"name"===c&&a.a.vc(b,g?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 c,d){function e(){var e=b.checked,f=p?g():e;if(!a.xa.Va()&&(!l||e)){var h=a.l.w(c);if(k){var m=r?h.p():h;q!==f?(e&&(a.a.ra(m,f,!0),a.a.ra(m,q,!1)),q=f):a.a.ra(m,f,e);r&&a.Da(h)&&h(m)}else a.h.Ga(h,d,"checked",f,!0)}}function f(){var d=a.a.c(c());b.checked=k?0<=a.a.o(d,g()):h?d:g()===d}var g=a.rc(function(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):d.has("value")?a.a.c(d.get("value")):b.value}),h="checkbox"==b.type,l="radio"==b.type;if(h||l){var m=c(),k=h&&a.a.c(m)instanceof Array,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  r=!(k&&m.push&&m.splice),q=k?g():n,p=l||k;l&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.m(e,null,{i:b});a.a.q(b,"click",e);a.m(f,null,{i:b});m=n}}};a.h.ga.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());null!==d&&"object"==typeof d?a.a.D(d,function(c,d){d=a.a.c(d);a.a.fb(b,c,d)}):(d=a.a.cb(String(d||"")),a.a.fb(b,b.__ko__cssValue,!1),b.__ko__cssValue=d,a.a.fb(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());
        d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var g=c()||{};a.a.D(g,function(g){"string"==typeof g&&a.a.q(b,g,function(b){var m,k=c()[g];if(k){try{var r=a.a.W(arguments);e=f.$data;r.unshift(e);m=k.apply(e,r)}finally{!0!==m&&(b.preventDefault?b.preventDefault():b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};
    a.d.foreach={mc:function(b){return function(){var c=b(),d=a.a.Bb(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.X.vb};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.X.vb}}},init:function(b,c){return a.d.template.init(b,a.d.foreach.mc(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.mc(c),
        d,e,f)}};a.h.va.foreach=!1;a.f.aa.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement}catch(k){g=f.body}e=g===b}f=c();a.h.Ga(f,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),g=e.bind(null,!1);a.a.q(b,"focus",f);a.a.q(b,"focusin",f);a.a.q(b,"blur",g);a.a.q(b,"focusout",g)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===
    d||(d?b.focus():b.blur(),!d&&b.__ko_hasfocusLastValue&&b.ownerDocument.body.focus(),a.l.w(a.a.Fa,null,[b,d?"focusin":"focusout"]))}};a.h.ga.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.h.ga.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Eb(b,c())}};K("if");K("ifnot",!1,!0);K("with",!0,!1,function(a,c){return a.ac(c)});var L={};a.d.options={init:function(b){if("select"!==a.a.A(b))throw Error("options binding applies only to SELECT elements");for(;0<
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.Ma(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function g(c,e){if(A&&k)a.j.ja(b,a.a.c(d.get("value")),!0);else if(p.length){var f=0<=a.a.o(p,a.j.u(e[0]));a.a.wc(e[0],f);A&&!f&&a.l.w(a.a.Fa,null,[b,"change"])}}var h=b.multiple,l=0!=b.length&&h?b.scrollTop:null,m=a.a.c(c()),k=d.get("valueAllowUnset")&&d.has("value"),r=
        d.get("optionsIncludeDestroyed");c={};var q,p=[];k||(h?p=a.a.ib(e(),a.j.u):0<=b.selectedIndex&&p.push(a.j.u(b.options[b.selectedIndex])));m&&("undefined"==typeof m.length&&(m=[m]),q=a.a.Ma(m,function(b){return r||b===n||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(m=a.a.c(d.get("optionsCaption")),null!==m&&m!==n&&q.unshift(L)));var A=!1;c.beforeRemove=function(a){b.removeChild(a)};m=g;d.has("optionsAfterRender")&&"function"==typeof d.get("optionsAfterRender")&&(m=function(b,c){g(0,c);
        a.l.w(d.get("optionsAfterRender"),null,[c[0],b!==L?b:n])});a.a.Db(b,q,function(c,e,g){g.length&&(p=!k&&g[0].selected?[a.j.u(g[0])]:[],A=!0);e=b.ownerDocument.createElement("option");c===L?(a.a.bb(e,d.get("optionsCaption")),a.j.ja(e,n)):(g=f(c,d.get("optionsValue"),c),a.j.ja(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.bb(e,c));return[e]},c,m);a.l.w(function(){k?a.j.ja(b,a.a.c(d.get("value")),!0):(h?p.length&&e().length<p.length:p.length&&0<=b.selectedIndex?a.j.u(b.options[b.selectedIndex])!==p[0]:
        p.length||0<=b.selectedIndex)&&a.a.Fa(b,"change")});a.a.Sc(b);l&&20<Math.abs(l-b.scrollTop)&&(b.scrollTop=l)}};a.d.options.zb=a.a.e.J();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.q(b,"change",function(){var e=c(),f=[];a.a.r(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.j.u(b))});a.h.Ga(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=a.a.A(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c()),e=b.scrollTop;
        d&&"number"==typeof d.length&&a.a.r(b.getElementsByTagName("option"),function(b){var c=0<=a.a.o(d,a.j.u(b));b.selected!=c&&a.a.wc(b,c)});b.scrollTop=e}};a.h.ga.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.D(d,function(c,d){d=a.a.c(d);if(null===d||d===n||!1===d)d="";b.style[c]=d})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.q(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,
        b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.bb(b,c())}};a.f.aa.text=!0;(function(){if(x&&x.navigator)var b=function(a){if(a)return parseFloat(a[1])},c=x.opera&&x.opera.version&&parseInt(x.opera.version()),d=x.navigator.userAgent,e=b(d.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),f=b(d.match(/Firefox\/([^ ]*)/));if(10>a.a.C)var g=a.a.e.J(),h=a.a.e.J(),l=function(b){var c=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   this.activeElement;(c=c&&a.a.e.get(c,h))&&c(b)},m=function(b,c){var d=b.ownerDocument;a.a.e.get(d,g)||(a.a.e.set(d,g,!0),a.a.q(d,"selectionchange",l));a.a.e.set(b,h,c)};a.d.textInput={init:function(b,d,g){function l(c,d){a.a.q(b,c,d)}function h(){var c=a.a.c(d());if(null===c||c===n)c="";u!==n&&c===u?a.a.setTimeout(h,4):b.value!==c&&(s=c,b.value=c)}function y(){t||(u=b.value,t=a.a.setTimeout(v,4))}function v(){clearTimeout(t);u=t=n;var c=b.value;s!==c&&(s=c,a.h.Ga(d(),g,"textInput",c))}var s=b.value,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 t,u,x=9==a.a.C?y:v;10>a.a.C?(l("propertychange",function(a){"value"===a.propertyName&&x(a)}),8==a.a.C&&(l("keyup",v),l("keydown",v)),8<=a.a.C&&(m(b,x),l("dragend",y))):(l("input",v),5>e&&"textarea"===a.a.A(b)?(l("keydown",y),l("paste",y),l("cut",y)):11>c?l("keydown",y):4>f&&(l("DOMAutoComplete",v),l("dragdrop",v),l("drop",v)));l("change",v);a.m(h,null,{i:b})}};a.h.ga.textInput=!0;a.d.textinput={preprocess:function(a,b,c){c("textInput",a)}}})();a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+
        ++a.d.uniqueName.Nc;a.a.vc(b,d)}}};a.d.uniqueName.Nc=0;a.d.value={after:["options","foreach"],init:function(b,c,d){if("input"!=b.tagName.toLowerCase()||"checkbox"!=b.type&&"radio"!=b.type){var e=["change"],f=d.get("valueUpdate"),g=!1,h=null;f&&("string"==typeof f&&(f=[f]),a.a.ta(e,f),e=a.a.Wb(e));var l=function(){h=null;g=!1;var e=c(),f=a.j.u(b);a.h.Ga(e,d,"value",f)};!a.a.C||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.o(e,"propertychange")||
    (a.a.q(b,"propertychange",function(){g=!0}),a.a.q(b,"focus",function(){g=!1}),a.a.q(b,"blur",function(){g&&l()}));a.a.r(e,function(c){var d=l;a.a.sd(c,"after")&&(d=function(){h=a.j.u(b);a.a.setTimeout(l,0)},c=c.substring(5));a.a.q(b,c,d)});var m=function(){var e=a.a.c(c()),f=a.j.u(b);if(null!==h&&e===h)a.a.setTimeout(m,0);else if(e!==f)if("select"===a.a.A(b)){var g=d.get("valueAllowUnset"),f=function(){a.j.ja(b,e,g)};f();g||e===a.j.u(b)?a.a.setTimeout(f,0):a.l.w(a.a.Fa,null,[b,"change"])}else a.j.ja(b,
        e)};a.m(m,null,{i:b})}else a.La(b,{checkedValue:c})},update:function(){}};a.h.ga.value=!0;a.d.visible={update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,g){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,g)}}})("click");a.P=function(){};a.P.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.P.prototype.createJavaScriptEvaluatorBlock=
        function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.P.prototype.makeTemplateSource=function(b,c){if("string"==typeof b){c=c||t;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.v.n(d)}if(1==b.nodeType||8==b.nodeType)return new a.v.sa(b);throw Error("Unknown template type: "+b);};a.P.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d,e)};a.P.prototype.isTemplateRewritten=function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.P.prototype.rewriteTemplate=function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.P);a.Ib=function(){function b(b,c,d,h){b=a.h.Ab(b);for(var l=a.h.va,m=0;m<b.length;m++){var k=b[m].key;if(l.hasOwnProperty(k)){var r=l[k];if("function"===typeof r){if(k=r(b[m].value))throw Error(k);}else if(!r)throw Error("This template engine does not support the '"+
        k+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.h.Xa(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return h.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Tc:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Ib.jd(b,
        c)},d)},jd:function(a,f){return a.replace(c,function(a,c,d,e,k){return b(k,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",f)})},Jc:function(b,c){return a.N.yb(function(d,h){var l=d.nextSibling;l&&l.nodeName.toLowerCase()===c&&a.La(l,b,h)})}}}();a.b("__tr_ambtns",a.Ib.Jc);(function(){a.v={};a.v.n=function(b){if(this.n=b){var c=a.a.A(b);this.eb="script"===c?1:"textarea"===c?2:"template"==c&&b.content&&11===b.content.nodeType?3:4}};a.v.n.prototype.text=function(){var b=1===
    this.eb?"text":2===this.eb?"value":"innerHTML";if(0==arguments.length)return this.n[b];var c=arguments[0];"innerHTML"===b?a.a.Eb(this.n,c):this.n[b]=c};var b=a.a.e.J()+"_";a.v.n.prototype.data=function(c){if(1===arguments.length)return a.a.e.get(this.n,b+c);a.a.e.set(this.n,b+c,arguments[1])};var c=a.a.e.J();a.v.n.prototype.nodes=function(){var b=this.n;if(0==arguments.length)return(a.a.e.get(b,c)||{}).mb||(3===this.eb?b.content:4===this.eb?b:n);a.a.e.set(b,c,{mb:arguments[0]})};a.v.sa=function(a){this.n=
        a};a.v.sa.prototype=new a.v.n;a.v.sa.prototype.text=function(){if(0==arguments.length){var b=a.a.e.get(this.n,c)||{};b.Jb===n&&b.mb&&(b.Jb=b.mb.innerHTML);return b.Jb}a.a.e.set(this.n,c,{Jb:arguments[0]})};a.b("templateSources",a.v);a.b("templateSources.domElement",a.v.n);a.b("templateSources.anonymousTemplate",a.v.sa)})();(function(){function b(b,c,d){var e;for(c=a.f.nextSibling(c);b&&(e=b)!==c;)b=a.f.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],g=e.parentNode,h=
        a.S.instance,n=h.preprocessNode;if(n){b(e,f,function(a,b){var c=a.previousSibling,d=n.call(h,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.Ba(c,g))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.Ub(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.N.Cc(b,[d])});a.a.Ba(c,g)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,f,h,q){q=q||{};var p=(b&&d(b)||f||{}).ownerDocument,n=q.templateEngine||g;
        a.Ib.Tc(f,n,p);f=n.renderTemplate(f,h,q,p);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");p=!1;switch(e){case "replaceChildren":a.f.fa(b,f);p=!0;break;case "replaceNode":a.a.uc(b,f);p=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+e);}p&&(c(f,h),q.afterRender&&a.l.w(q.afterRender,null,[f,h.$data]));return f}function f(b,c,d){return a.I(b)?b():"function"===typeof b?b(c,d):b}
        var g;a.Fb=function(b){if(b!=n&&!(b instanceof a.P))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.Cb=function(b,c,k,h,q){k=k||{};if((k.templateEngine||g)==n)throw Error("Set a template engine before calling renderTemplate");q=q||"replaceChildren";if(h){var p=d(h);return a.B(function(){var g=c&&c instanceof a.R?c:new a.R(c,null,null,null,{exportDependencies:!0}),n=f(b,g.$data,g),g=e(h,q,n,g,k);"replaceNode"==q&&(h=g,p=d(h))},null,{ya:function(){return!p||!a.a.qb(p)},i:p&&
        "replaceNode"==q?p.parentNode:p})}return a.N.yb(function(d){a.Cb(b,c,k,d,"replaceNode")})};a.pd=function(b,d,g,h,q){function p(a,b){c(b,t);g.afterRender&&g.afterRender(b,a);t=null}function s(a,c){t=q.createChildContext(a,g.as,function(a){a.$index=c});var d=f(b,a,t);return e(null,"ignoreTargetNode",d,t,g)}var t;return a.B(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.Ma(b,function(b){return g.includeDestroyed||b===n||null===b||!a.a.c(b._destroy)});a.l.w(a.a.Db,null,[h,b,
            s,g,p])},null,{i:h})};var h=a.a.e.J();a.d.template={init:function(b,c){var d=a.a.c(c());if("string"==typeof d||d.name)a.f.za(b);else{if("nodes"in d){if(d=d.nodes||[],a.I(d))throw Error('The "nodes" option must be a plain, non-observable array.');}else d=a.f.childNodes(b);d=a.a.nc(d);(new a.v.sa(b)).nodes(d)}return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var g=c();c=a.a.c(g);d=!0;e=null;"string"==typeof c?c={}:(g=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)));
            "foreach"in c?e=a.pd(g||b,d&&c.foreach||[],c,b,f):d?(f="data"in c?f.ac(c.data,c.as):f,e=a.Cb(g||b,f,c,b)):a.f.za(b);f=e;(c=a.a.e.get(b,h))&&"function"==typeof c.k&&c.k();a.a.e.set(b,h,f&&f.ca()?f:n)}};a.h.va.template=function(b){b=a.h.Ab(b);return 1==b.length&&b[0].unknown||a.h.fd(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.f.aa.template=!0})();a.b("setTemplateEngine",a.Fb);a.b("renderTemplate",a.Cb);a.a.hc=function(a,c,d){if(a.length&&
        c.length){var e,f,g,h,l;for(e=f=0;(!d||e<d)&&(h=a[f]);++f){for(g=0;l=c[g];++g)if(h.value===l.value){h.moved=l.index;l.moved=h.index;c.splice(g,1);e=g=0;break}e+=g}}};a.a.lb=function(){function b(b,d,e,f,g){var h=Math.min,l=Math.max,m=[],k,n=b.length,q,p=d.length,s=p-n||1,t=n+p+1,v,u,x;for(k=0;k<=n;k++)for(u=v,m.push(v=[]),x=h(p,k+s),q=l(0,k-1);q<=x;q++)v[q]=q?k?b[k-1]===d[q-1]?u[q-1]:h(u[q]||t,v[q-1]||t)+1:q+1:k+1;h=[];l=[];s=[];k=n;for(q=p;k||q;)p=m[k][q]-1,q&&p===m[k][q-1]?l.push(h[h.length]={status:e,
        value:d[--q],index:q}):k&&p===m[k-1][q]?s.push(h[h.length]={status:f,value:b[--k],index:k}):(--q,--k,g.sparse||h.push({status:"retained",value:d[q]}));a.a.hc(s,l,!g.dontLimitMoves&&10*n);return h.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.lb);(function(){function b(b,c,d,h,l){var m=[],k=a.B(function(){var k=c(d,l,a.a.Ba(m,b))||[];0<
    m.length&&(a.a.uc(m,k),h&&a.l.w(h,null,[d,k,l]));m.length=0;a.a.ta(m,k)},null,{i:b,ya:function(){return!a.a.Tb(m)}});return{ea:m,B:k.ca()?k:n}}var c=a.a.e.J(),d=a.a.e.J();a.a.Db=function(e,f,g,h,l){function m(b,c){w=q[c];u!==c&&(D[b]=w);w.tb(u++);a.a.Ba(w.ea,e);t.push(w);z.push(w)}function k(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.r(c[d].ea,function(a){b(a,d,c[d].ka)})}f=f||[];h=h||{};var r=a.a.e.get(e,c)===n,q=a.a.e.get(e,c)||[],p=a.a.ib(q,function(a){return a.ka}),s=a.a.lb(p,f,h.dontLimitMoves),
                                                                                                                                                                                                                                                                                                                                                                                                                       t=[],v=0,u=0,x=[],z=[];f=[];for(var D=[],p=[],w,C=0,B,E;B=s[C];C++)switch(E=B.moved,B.status){case "deleted":E===n&&(w=q[v],w.B&&(w.B.k(),w.B=n),a.a.Ba(w.ea,e).length&&(h.beforeRemove&&(t.push(w),z.push(w),w.ka===d?w=null:f[C]=w),w&&x.push.apply(x,w.ea)));v++;break;case "retained":m(C,v++);break;case "added":E!==n?m(C,E):(w={ka:B.value,tb:a.O(u++)},t.push(w),z.push(w),r||(p[C]=w))}a.a.e.set(e,c,t);k(h.beforeMove,D);a.a.r(x,h.beforeRemove?a.ba:a.removeNode);for(var C=0,r=a.f.firstChild(e),F;w=z[C];C++){w.ea||
    a.a.extend(w,b(e,g,w.ka,l,w.tb));for(v=0;s=w.ea[v];r=s.nextSibling,F=s,v++)s!==r&&a.f.kc(e,s,F);!w.ad&&l&&(l(w.ka,w.ea,w.tb),w.ad=!0)}k(h.beforeRemove,f);for(C=0;C<f.length;++C)f[C]&&(f[C].ka=d);k(h.afterMove,D);k(h.afterAdd,p)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Db);a.X=function(){this.allowTemplateRewriting=!1};a.X.prototype=new a.P;a.X.prototype.renderTemplateSource=function(b,c,d,e){if(c=(9>a.a.C?0:b.nodes)?b.nodes():null)return a.a.W(c.cloneNode(!0).childNodes);b=b.text();
        return a.a.na(b,e)};a.X.vb=new a.X;a.Fb(a.X.vb);a.b("nativeTemplateEngine",a.X);(function(){a.xb=function(){var a=this.ed=function(){if(!u||!u.tmpl)return 0;try{if(0<=u.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f,g){g=g||t;f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=u.template(null,"{{ko_with $item.koBindingContext}}"+
        h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=u.extend({koBindingContext:e},f.templateOptions);e=u.tmpl(h,b,e);e.appendTo(g.createElement("div"));u.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){t.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(u.tmpl.tag.ko_code={open:"__.push($1 || '');"},u.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.xb.prototype=
        new a.P;var b=new a.xb;0<b.ed&&a.Fb(b);a.b("jqueryTmplTemplateEngine",a.xb)})()})})();})();

},{}],17:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],18:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],19:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],20:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],21:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":20,"_process":17,"inherits":19}],22:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Application = (function () {
    function Application(knockoutInitializer, paramReader, router, serverActions) {
        this.knockoutInitializer = knockoutInitializer;
        this.paramReader = paramReader;
        this.router = router;
        this.serverActions = serverActions;
    }
    Application.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roomId;
            return __generator(this, function (_a) {
                roomId = this.paramReader.getQueryVariable('roomId');
                this.knockoutInitializer.initialize();
                this.router.renderLayout();
                this.router.renderPage(roomId);
                return [2];
            });
        });
    };
    return Application;
}());
exports.Application = Application;
},{}],23:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ContentDependencies_1 = require("./content/ContentDependencies");
var knockoutDependencies_1 = require("./knockout/knockoutDependencies");
var ParamReader_1 = require("./common/ParamReader");
var Application_1 = require("./Application");
var UserActions_1 = require("./UserActions");
var Router_1 = require("./Router");
var ServerActions_1 = require("./common/ServerActions");
var XhrRequest_1 = require("./common/XhrRequest");
var Forge = require("forge-di");
var XhrPost_1 = require("./common/XhrPost");
var Dependencies = (function () {
    function Dependencies() {
        this.forge = new Forge();
    }
    Dependencies.prototype.get = function (name) {
        return this.forge.get(name);
    };
    Dependencies.prototype.registerDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.forge.bind('name').to.instance('');
                        this.forge.bind('application').to.type(Application_1.Application);
                        this.registerDOMElements();
                        this.registerAppDependencies();
                        return [4, this.registerServerData()];
                    case 1:
                        _a.sent();
                        new ContentDependencies_1.ContentDependencies(this.forge);
                        new knockoutDependencies_1.KnockoutDependencies(this.forge);
                        return [2, this];
                }
            });
        });
    };
    Dependencies.prototype.registerServerData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serverActions, rooms, commonIssues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serverActions = this.forge.get('serverActions');
                        return [4, serverActions.getRooms()];
                    case 1:
                        rooms = _a.sent();
                        return [4, serverActions.getCommonIssues()];
                    case 2:
                        commonIssues = _a.sent();
                        this.forge.bind('rooms').to.instance(rooms);
                        this.forge.bind('commonIssues').to.instance(commonIssues);
                        return [2];
                }
            });
        });
    };
    Dependencies.prototype.registerAppDependencies = function () {
        this.forge.bind('paramReader').to.type(ParamReader_1.ParamReader);
        this.forge.bind('userActions').to.type(UserActions_1.UserActions);
        this.forge.bind('router').to.type(Router_1.Router);
        this.forge.bind('xhrRequest').to.type(XhrRequest_1.XhrRequest);
        this.forge.bind('xhrPost').to.type(XhrPost_1.XhrPost);
        this.forge.bind('serverActions').to.type(ServerActions_1.ServerActions);
    };
    Dependencies.prototype.registerDOMElements = function () {
        var node = window.document.getElementById('main');
        var sidebarNode = window.document.getElementById('sidebar');
        this.forge.bind('rootNode').to.instance(node);
        this.forge.bind('sidebarNode').to.instance(sidebarNode);
    };
    return Dependencies;
}());
exports.Dependencies = Dependencies;
},{"./Application":22,"./Router":24,"./UserActions":25,"./common/ParamReader":29,"./common/ServerActions":31,"./common/XhrPost":32,"./common/XhrRequest":33,"./content/ContentDependencies":34,"./knockout/knockoutDependencies":61,"forge-di":8}],24:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Components_1 = require("./knockout/config/Components");
var ko = require("knockout");
var Router = (function () {
    function Router(pageRenderer, componentResolver, rooms) {
        this.INITIAL_PAGE = 'home';
        this.pageRenderer = pageRenderer;
        this.componentResolver = componentResolver;
        this.rooms = rooms;
    }
    Router.prototype.renderLayout = function () {
        var component = this.componentResolver.getComponentByModuleName('sidebar');
        ko.applyBindings(component, this.pageRenderer.getLayoutNode());
    };
    Router.prototype.renderPage = function (roomId) {
        var room = this.rooms.filter(function (room) { return room.roomId === roomId; })[0];
        var componentName = this.getComponentNameByRoomId(room);
        console.log('loading component: "' + componentName + '"');
        var component = this.componentResolver.getComponentByModuleName(componentName);
        console.log(component);
        var node = this.pageRenderer.renderRootComponent(componentName, component);
        ko.applyBindings(component, node);
        component.onLoad(room);
    };
    Router.prototype.getComponentNameByRoomId = function (room) {
        var componentName = this.INITIAL_PAGE;
        if (typeof room !== 'undefined') {
            var name_1 = Router.layoutMap[room.layout];
            if (Components_1.isComponentName(name_1) !== false) {
                componentName = name_1;
            }
            else {
                console.log("route: \"" + name_1 + "\" not found, redirecting to home page.");
            }
        }
        return componentName;
    };
    Router.layoutMap = {
        'groups': 'roomGroups',
        'circle': 'roomCircular',
        'angled': 'roomGroupsAngled'
    };
    return Router;
}());
exports.Router = Router;
},{"./knockout/config/Components":57,"knockout":16}],25:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var UserActions = (function () {
    function UserActions(xhrPost) {
        this.xhrPost = xhrPost;
    }
    UserActions.prototype.sendNewCommonIssueToServer = function (commonIssue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/addCommonIssue', JSON.stringify(commonIssue))];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    UserActions.prototype.sendIssuesToMailServer = function (issues) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/sendMail', JSON.stringify(issues))];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    UserActions.prototype.sendChangeRoomContactToMailServer = function (room, changeRoomContact) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/changeRoomContact/' + room, JSON.stringify(changeRoomContact))];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return UserActions;
}());
exports.UserActions = UserActions;
},{}],26:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var es6_promise_1 = require("es6-promise");
var Dependencies_1 = require("./Dependencies");
es6_promise_1.polyfill();
new function () {
    new Dependencies_1.Dependencies()
        .registerDependencies()
        .then(function (dependencies) {
        dependencies
            .get('application')
            .run();
    });
}();
},{"./Dependencies":23,"es6-promise":2}],27:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Issue = (function () {
    function Issue() {
    }
    return Issue;
}());
exports.Issue = Issue;
},{}],28:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var IssueFormContainer = (function () {
    function IssueFormContainer() {
        this.issueContainer = [];
    }
    IssueFormContainer.prototype.addIssue = function (issue) {
        this.issueContainer.push(issue);
    };
    return IssueFormContainer;
}());
exports.IssueFormContainer = IssueFormContainer;
},{}],29:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ParamReader = (function () {
    function ParamReader() {
    }
    ParamReader.prototype.getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return undefined;
    };
    return ParamReader;
}());
exports.ParamReader = ParamReader;
},{}],30:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Resolver = (function () {
    function Resolver(classes) {
        this.classes = classes;
    }
    Resolver.prototype.getServiceByJobName = function (classToResolve) {
        var rec = function (index) {
            if (this.classes[index].constructor.name === classToResolve) {
                return this.classes[index];
            }
            if (index < 1) {
                throw new Error('cannot resolve service: ' + classToResolve);
            }
            return rec(index - 1);
        }.bind(this);
        return rec(this.classes.length - 1);
    };
    return Resolver;
}());
exports.Resolver = Resolver;
},{}],31:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ServerActions = (function () {
    function ServerActions(xhrRequest) {
        this.xhrRequest = xhrRequest;
    }
    ServerActions.prototype.getCommonIssues = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commonIssues, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commonIssues = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.xhrRequest.requestFromUrl('http://127.0.0.1:3000/commonIssues')];
                    case 2:
                        response = _a.sent();
                        commonIssues = JSON.parse(response);
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3, 4];
                    case 4: return [2, commonIssues];
                }
            });
        });
    };
    ServerActions.prototype.getRooms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rooms, response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rooms = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.xhrRequest.requestFromUrl('http://127.0.0.1:3000/rooms')];
                    case 2:
                        response = _a.sent();
                        rooms = JSON.parse(response);
                        return [3, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [3, 4];
                    case 4: return [2, rooms];
                }
            });
        });
    };
    ServerActions.prototype.sendMail = function () {
    };
    return ServerActions;
}());
exports.ServerActions = ServerActions;
},{}],32:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var XhrPost = (function () {
    function XhrPost() {
    }
    XhrPost.prototype.postJsonToUrl = function (url, jsonString) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            setTimeout(function () {
                reject('timeout');
            }, 60000);
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    resolve(this.responseText);
                }
            });
            xhr.open('POST', url);
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(jsonString);
        });
    };
    return XhrPost;
}());
exports.XhrPost = XhrPost;
},{}],33:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var XhrRequest = (function () {
    function XhrRequest() {
    }
    XhrRequest.prototype.requestFromUrl = function (requestUrl) {
        return new Promise(function (resolve, reject) {
            try {
                var data = null;
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.addEventListener('readystatechange', function () {
                    if (this.readyState === 4) {
                        if (typeof this.responseText === 'undefined') {
                            reject('nope');
                        }
                        resolve(this.responseText);
                    }
                });
                xhr.open('GET', requestUrl);
                xhr.send(data);
            }
            catch (error) {
                console.warn(error);
                reject(error);
            }
        });
    };
    return XhrRequest;
}());
exports.XhrRequest = XhrRequest;
},{}],34:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var sidebar_1 = require("./components/sidebar/sidebar");
var PageRenderer_1 = require("./PageRenderer");
var home_1 = require("./components/home/home");
var ComponentResolver_1 = require("./components/ComponentResolver");
var roomGroups_1 = require("./components/roomGroups/roomGroups");
var roomGroupsAngled_1 = require("./components/roomGroupsAngled/roomGroupsAngled");
var roomCircular_1 = require("./components/roomCircular/roomCircular");
var IssueFormContainer_1 = require("../common/IssueFormContainer");
var ContentDependencies = (function () {
    function ContentDependencies(forge) {
        this.forge = forge;
        this.registerComponents();
        this.registerOther();
    }
    ContentDependencies.prototype.registerOther = function () {
        this.forge.bind('pageRenderer').to.type(PageRenderer_1.PageRenderer);
        this.forge.bind('issueFormContainer').to.type(IssueFormContainer_1.IssueFormContainer);
    };
    ContentDependencies.prototype.registerComponents = function () {
        this.forge.bind('components').to.type(home_1.Home);
        this.forge.bind('components').to.type(sidebar_1.Sidebar);
        this.forge.bind('components').to.type(roomGroups_1.RoomGroups);
        this.forge.bind('components').to.type(roomGroupsAngled_1.RoomGroupsAngled);
        this.forge.bind('components').to.type(roomCircular_1.RoomCircular);
        this.forge.bind('componentResolver').to.type(ComponentResolver_1.ComponentResolver);
    };
    ContentDependencies.prototype.registerControllers = function () {
    };
    return ContentDependencies;
}());
exports.ContentDependencies = ContentDependencies;
},{"../common/IssueFormContainer":28,"./PageRenderer":35,"./components/ComponentResolver":37,"./components/home/home":40,"./components/roomCircular/roomCircular":43,"./components/roomGroups/roomGroups":49,"./components/roomGroupsAngled/roomGroupsAngled":46,"./components/sidebar/sidebar":53}],35:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var PageRenderer = (function () {
    function PageRenderer(rootNode, sidebarNode) {
        this.rootNode = rootNode;
        this.sidebarNode = sidebarNode;
    }
    PageRenderer.prototype.getLayoutNode = function () {
        return this.sidebarNode;
    };
    PageRenderer.prototype.renderRootComponent = function (moduleName, component) {
        this.rootNode.innerHTML = "<div><div id=\"" + moduleName + "\" data-bind='component: \"" + moduleName + "\"'></div></div>";
        var node = this.rootNode.children[0];
        component.onRender();
        return node;
    };
    return PageRenderer;
}());
exports.PageRenderer = PageRenderer;
},{}],36:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Component = (function () {
    function Component(name) {
        this.name = name;
    }
    Component.prototype.setUpdate = function () {
    };
    Component.prototype.onRender = function () {
    };
    Component.prototype.onLoad = function (room) {
    };
    Component.prototype.onInit = function () {
    };
    return Component;
}());
exports.Component = Component;
},{}],37:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Resolver_1 = require("../../common/Resolver");
var ComponentResolver = (function (_super) {
    __extends(ComponentResolver, _super);
    function ComponentResolver(components, componentClassMapping) {
        var _this = _super.call(this, components) || this;
        _this.componentList = componentClassMapping;
        return _this;
    }
    ComponentResolver.prototype.getComponent = function (classToResolve) {
        return _super.prototype.getServiceByJobName.call(this, classToResolve);
    };
    ComponentResolver.prototype.getComponentByModuleName = function (moduleName) {
        if (typeof this.componentList[moduleName] !== 'string') {
            throw new Error('Component not found: ' + moduleName);
        }
        var classToResolve = this.componentList[moduleName];
        return this.getComponent(classToResolve);
    };
    return ComponentResolver;
}(Resolver_1.Resolver));
exports.ComponentResolver = ComponentResolver;
},{"../../common/Resolver":30}],38:[function(require,module,exports){
module.exports = ".modal {\n  position: absolute;\n  width: 80%;\n  height: 100%;\n  background-color: white;\n  border: 1px solid black; }\n\n.room-container {\n  align-items: flex-start;\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: flex;\n  flex-wrap: wrap;\n  height: 100%;\n  width: 100%;\n  position: relative; }\n\n.table-group {\n  position: relative;\n  width: 40%;\n  border: 1px solid black;\n  height: 30%;\n  margin: 4% 4%;\n  box-sizing: border-box; }\n  .table-group.teacher-desk {\n    position: absolute;\n    bottom: 5%;\n    height: 10%;\n    width: 20%;\n    left: 60%;\n    margin: 0; }\n\n.device {\n  height: 50px;\n  width: 50px;\n  position: absolute;\n  border: 2px solid black;\n  cursor: pointer; }\n  .device.top {\n    left: 20%;\n    top: 10%; }\n  .device.bot-right {\n    right: 10%;\n    bottom: 20%; }\n  .device.bot-left {\n    left: 10%;\n    bottom: 20%; }\n  .device:hover {\n    border: 2px solid blue; }\n";

},{}],39:[function(require,module,exports){
module.exports = "<h1>Bitte w&auml;hlen sie einen Raum aus.</h1>\n";

},{}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Component_1 = require("../Component");
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        return _super.call(this, Home.COMPONENT_NAME) || this;
    }
    Home.prototype.updateViewModel = function (viewModel) {
    };
    Home.COMPONENT_NAME = 'home';
    return Home;
}(Component_1.Component));
exports.Home = Home;
},{"../Component":36}],41:[function(require,module,exports){
module.exports = ".room-container {\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: block;\n  float: left;\n  height: 100%;\n  width: 100%;\n  padding: 20px;\n  position: relative;\n  margin-bottom: 200px; }\n\n.tableCircular {\n  height: 75%;\n  width: 100%;\n  box-sizing: border-box;\n  display: block; }\n  .tableCircular tr {\n    height: 20%; }\n  .tableCircular td {\n    width: 20%; }\n\n.table-group {\n  position: relative;\n  float: left;\n  width: 30%;\n  border: 2px solid #333;\n  height: 20%;\n  margin: 2.5% 2.5% 0 0;\n  padding: 2.5% 0 2.5% 2.5%;\n  box-sizing: border-box; }\n  .table-group.teacher-desk {\n    height: 20%;\n    position: relative;\n    float: right;\n    bottom: 0;\n    left: 0;\n    width: 50%; }\n    .table-group.teacher-desk .device {\n      height: 95%;\n      width: 30%; }\n\n.device {\n  height: 20%;\n  width: 20%;\n  border: 3px solid #eee; }\n  .device.filler {\n    background-color: transparent;\n    text-align: center;\n    pointer-events: none;\n    border: none; }\n  .device.empty {\n    background-color: transparent;\n    pointer-events: none;\n    border: none; }\n  .device.connector {\n    background-color: #ccc;\n    pointer-events: none; }\n  .device span, .device h3 {\n    position: relative;\n    top: 40%;\n    translateY: -50%; }\n";

},{}],42:[function(require,module,exports){
module.exports = "<h2 class=\"room-title\">Raum: <span data-bind=\"text: $parent.roomId\"></span> Raumbetreuer: <span data-bind=\"text: $parent.roomContact\"></span></h2><img\n    src=\"styles/edit.png\" alt=\"\" class=\"edit\" data-bind=\"click: $parent.setChangeContact(true)\"\n>\n\n<div class=\"room-container\">\n\n    <div class=\"tableCircular\">\n\n        <div class=\"device filler\"><h3>Tisch 1</h3></div>\n        <div class=\"device\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\"><span>3</span></div>\n        <div class=\"device connector\"></div>\n        <div class=\"device\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\"><span>4</span></div>\n        <div class=\"device filler\"><h3>Tisch 2</h3></div>\n\n        <div class=\"device\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\"><span>1</span></div>\n        <div class=\"device\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\"><span>2</span></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\"><span>5</span></div>\n        <div class=\"device\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\"><span>6</span></div>\n\n        <div class=\"device empty\"></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device connector\"></div>\n\n        <div class=\"device\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\"><span>7</span></div>\n        <div class=\"device\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\"><span>8</span></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\"><span>11</span></div>\n        <div class=\"device\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\"><span>12</span></div>\n\n        <div class=\"device filler\"><h3>Tisch 3</h3></div>\n        <div class=\"device\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\"><span>9</span></div>\n        <div class=\"device connector\"></div>\n        <div class=\"device\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\"><span>10</span></div>\n        <div class=\"device filler\"><h3>Tisch 4</h3></div>\n\n    </div>\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\"><span>Lehrer</span></div>\n        <div class=\"device\" id=\"device-14\" data-bind=\"click: $parent.deviceClick(14)\"><span>Beamer</span></div>\n        <div class=\"device\" id=\"device-15\" data-bind=\"click: $parent.deviceClick(15)\"><span>Weitere</span></div>\n    </div>\n</div>\n\n<div class=\"changeContactPopup\" data-bind=\"visible: $parent.showChangeContact\">\n    <input type=\"text\" data-bind=\"value: $parent.roomContactInput\" >\n    <input type=\"text\" data-bind=\"value: $parent.roomContactMailInput\" >\n    <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.changeContact()\">Raumbetreuer &auml;ndern</a>\n    <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.setChangeContact(false)\">Abbrechen</a>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h3>Fehlerprotokoll f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h3>\n    <form>\n        <label>\n            Standardfehler:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Eine Liste mit h&auml;fig auftretenden Fehlern.\n                Sollten Sie einen anderen Fehler wiederholt feststellen, k&ouml;nnen Sie Ihn mit dem Button unten zur Liste hinzuf&uuml;gen.\"\n            >i</span>\n            <select class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\">\n                <option data-bind=\"text: title\"></option>\n            </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">Standardfehler speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Geben Sie einen Titel f&uuml;r Ihren Fehler an. Der Titel wird f&uuml;r den Betreff der E-Mails verwendet.\"\n            >i</span>\n            <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung*:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Pflichtfeld! Geben Sie hier eine Beschreibung Ihres Fehlers an.\n                Falls Sie einen Standardfehler melden m&ouml;chten, k&ouml;nnen Sie ihn hier weiter spezifizieren.\"\n            >i</span>\n            <textarea class=\"description\" name=\"description\" maxlength=\"500\" required data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            Lehrer benachrichtigen:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an alle Lehrer verschickt, die nach Plan in diesem Raum unterrichten.\"\n            >i</span>\n            <input class=\"contactMail-teachers\" type=\"checkbox\" data-bind=\"checked: $parent.addTeachersToMail\" >\n        </label>\n        <br>\n        <label>\n            PC-Werkstatt benachrichtigen:\n            <span class=\"tooltip popRight\" data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an die PC-Werkstatt verschickt.\">i</span>\n            <input class=\"contactMail-workshop\" type=\"checkbox\" data-bind=\"checked: $parent.addWorkshopToMail\" >\n        </label>\n        <br>\n\n        <label style=\"margin-bottom: 5px\">\n            Raumbetreuer:\n            <span class=\"tooltip popRight\" data-tooltip=\"Der Raumbetreuer wird &uuml;ber jeden Fehler in Kenntnis gesetzt.\">i</span>\n            <span data-bind=\"text: $parent.roomContactMail\" style=\"color: #888\"></span>\n        </label>\n        <br>\n        <label>\n            weitere Emp&auml;nger: <span\n            class=\"tooltip popRight\" data-tooltip=\"Eine Liste an zus&auml;tzlichen Emp&auml;ngern. Trennen Sie mehrere E-Mail-Adressen mit einem Komma.\"\n        >i</span> <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea>\n        </label>\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">Abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">Protokoll aufnehmen</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"toast error\" data-bind=\"visible: $parent.showError\">\n    <p data-bind=\"text: $parent.error\"></p>\n    <input type=\"button\" data-bind=\"click: $parent.hideToast()\" value=\"X\" >\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>,\n            Beschreibung: <span data-bind=\"text: description\"></span>,\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">Entfernen</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Liste der Fehlerprotokolle leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Liste der Fehlerprotokolle absenden</a>\n    </div>\n</div>\n";

},{}],43:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var RoomLayout_1 = require("../room/RoomLayout");
var RoomCircular = (function (_super) {
    __extends(RoomCircular, _super);
    function RoomCircular(commonIssues, issueFormContainer, userActions) {
        return _super.call(this, commonIssues, issueFormContainer, userActions, RoomCircular.COMPONENT_NAME) || this;
    }
    RoomCircular.prototype.onRender = function () {
        console.log(RoomCircular.COMPONENT_NAME);
    };
    RoomCircular.COMPONENT_NAME = 'roomCircular';
    return RoomCircular;
}(RoomLayout_1.RoomLayout));
exports.RoomCircular = RoomCircular;
},{"../room/RoomLayout":50}],44:[function(require,module,exports){
module.exports = ".room-container {\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: block;\n  float: left;\n  height: 100%;\n  width: 100%;\n  padding-top: 5%;\n  position: relative;\n  margin-bottom: 200px; }\n\n.table-group {\n  position: relative;\n  float: left;\n  width: 40%;\n  border: 2px solid #333;\n  height: 30%;\n  margin-bottom: 5%;\n  padding: 2.5% 0 2.5% 2.5%;\n  box-sizing: border-box; }\n  .table-group.teacher-desk {\n    height: 20%;\n    margin: 0px 5% 5% 0px;\n    position: relative;\n    float: right;\n    bottom: 0;\n    left: 0;\n    width: 50%; }\n    .table-group.teacher-desk .device {\n      height: 95%;\n      width: 28%; }\n  .table-group:nth-of-type(even) {\n    margin-left: 20%; }\n\n.device {\n  height: 45%;\n  width: 45%;\n  margin: 0 5% 5% 0; }\n  .device.top {\n    left: 0;\n    top: 0; }\n  .device.bot-right {\n    right: 0;\n    bottom: 0; }\n  .device.bot-left {\n    left: 0;\n    bottom: 0; }\n  .device.filler {\n    background-color: transparent;\n    pointer-events: none; }\n  .device:hover {\n    /*border: 2px solid blue;*/\n    border: none; }\n  .device span {\n    position: relative;\n    top: 40%;\n    translateY: -50%; }\n";

},{}],45:[function(require,module,exports){
module.exports = "<h2 class=\"room-title\">Raum: <span data-bind=\"text: $parent.roomId\"></span> Raumbetreuer: <span data-bind=\"text: $parent.roomContact\"></span></h2><img\n    src=\"styles/edit.png\" alt=\"\" class=\"edit\" data-bind=\"click: $parent.setChangeContact(true)\">\n\n<div class=\"room-container\">\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\"><span>1</span></div>\n        <div class=\"device filler\"><h3>Tisch 1</h3></div>\n        <div class=\"device bot-left\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\"><span>2</span></div>\n        <div class=\"device bot-right\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\"><span>3</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device filler\"><h3>Tisch 2</h3></div>\n        <div class=\"device top\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\"><span>4</span></div>\n        <div class=\"device bot-left\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\"><span>5</span></div>\n        <div class=\"device bot-right\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\"><span>6</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\"><span>7</span></div>\n        <div class=\"device filler\"><h3>Tisch 3</h3></div>\n        <div class=\"device bot-left\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\"><span>8</span></div>\n        <div class=\"device bot-right\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\"><span>9</span></div>\n    </div>\n    <div class=\"table-group extended\">\n        <div class=\"device filler\"><h3>Tisch 4</h3></div>\n        <div class=\"device top\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\"><span>10</span></div>\n        <div class=\"device bot-left\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\"><span>11</span></div>\n        <div class=\"device bot-right\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\"><span>12</span></div>\n    </div>\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\"><span>Lehrer</span></div>\n        <div class=\"device\" id=\"device-14\" data-bind=\"click: $parent.deviceClick(14)\"><span>Beamer</span></div>\n        <div class=\"device\" id=\"device-15\" data-bind=\"click: $parent.deviceClick(15)\"><span>Weitere</span></div>\n    </div>\n</div>\n\n<div class=\"changeContactPopup\" data-bind=\"visible: $parent.showChangeContact\">\n    <input type=\"text\" data-bind=\"value: $parent.roomContactInput\" >\n    <input type=\"text\" data-bind=\"value: $parent.roomContactMailInput\" >\n    <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.changeContact()\">Raumbetreuer &auml;ndern</a>\n    <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.setChangeContact(false)\">Abbrechen</a>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h3>Fehlerprotokoll f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h3>\n    <form>\n        <label>\n            Standardfehler:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Eine Liste mit h&auml;fig auftretenden Fehlern.\n                Sollten Sie einen anderen Fehler wiederholt feststellen, k&ouml;nnen Sie Ihn mit dem Button unten zur Liste hinzuf&uuml;gen.\"\n            >i</span>\n            <select class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\">\n                <option data-bind=\"text: title\"></option>\n            </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">Standardfehler speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Geben Sie einen Titel f&uuml;r Ihren Fehler an. Der Titel wird f&uuml;r den Betreff der E-Mails verwendet.\"\n            >i</span>\n            <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung*:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Pflichtfeld! Geben Sie hier eine Beschreibung Ihres Fehlers an.\n                Falls Sie einen Standardfehler melden m&ouml;chten, k&ouml;nnen Sie ihn hier weiter spezifizieren.\"\n            >i</span>\n            <textarea class=\"description\" name=\"description\" maxlength=\"500\" required data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            Lehrer benachrichtigen:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an alle Lehrer verschickt, die nach Plan in diesem Raum unterrichten.\"\n            >i</span>\n            <input class=\"contactMail-teachers\" type=\"checkbox\" data-bind=\"checked: $parent.addTeachersToMail\" >\n        </label>\n        <br>\n        <label>\n            PC-Werkstatt benachrichtigen:\n            <span class=\"tooltip popRight\" data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an die PC-Werkstatt verschickt.\">i</span>\n            <input class=\"contactMail-workshop\" type=\"checkbox\" data-bind=\"checked: $parent.addWorkshopToMail\" >\n        </label>\n        <br>\n\n        <label style=\"margin-bottom: 5px\">\n            Raumbetreuer:\n            <span class=\"tooltip popRight\" data-tooltip=\"Der Raumbetreuer wird &uuml;ber jeden Fehler in Kenntnis gesetzt.\">i</span>\n            <span data-bind=\"text: $parent.roomContactMail\" style=\"color: #888\"></span>\n        </label>\n        <br>\n        <label>\n            weitere Emp&auml;nger: <span\n            class=\"tooltip popRight\" data-tooltip=\"Eine Liste an zus&auml;tzlichen Emp&auml;ngern. Trennen Sie mehrere E-Mail-Adressen mit einem Komma.\"\n        >i</span> <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea>\n        </label>\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">Abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">Protokoll aufnehmen</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"toast error\" data-bind=\"visible: $parent.showError\">\n    <p data-bind=\"text: $parent.error\"></p>\n    <input type=\"button\" data-bind=\"click: $parent.hideToast()\" value=\"X\" >\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>,\n            Beschreibung: <span data-bind=\"text: description\"></span>,\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">Entfernen</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Liste der Fehlerprotokolle leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Liste der Fehlerprotokolle absenden</a>\n    </div>\n</div>\n";

},{}],46:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var RoomLayout_1 = require("../room/RoomLayout");
var RoomGroupsAngled = (function (_super) {
    __extends(RoomGroupsAngled, _super);
    function RoomGroupsAngled(commonIssues, issueFormContainer, userActions) {
        return _super.call(this, commonIssues, issueFormContainer, userActions, RoomGroupsAngled.COMPONENT_NAME) || this;
    }
    RoomGroupsAngled.prototype.onRender = function () {
        console.log(RoomGroupsAngled.COMPONENT_NAME);
    };
    RoomGroupsAngled.COMPONENT_NAME = 'roomGroupsAngled';
    return RoomGroupsAngled;
}(RoomLayout_1.RoomLayout));
exports.RoomGroupsAngled = RoomGroupsAngled;
},{"../room/RoomLayout":50}],47:[function(require,module,exports){
module.exports = ".room-container {\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: block;\n  float: left;\n  height: 100%;\n  width: 100%;\n  padding: 5% 0 0 5%;\n  position: relative;\n  margin-bottom: 200px; }\n\n.table-group {\n  position: relative;\n  float: left;\n  width: 45%;\n  border: 2px solid #333;\n  height: 30%;\n  margin: 0 5% 5% 0;\n  padding: 2.5% 0 2.5% 2.5%;\n  box-sizing: border-box; }\n  .table-group.teacher-desk {\n    height: 20%;\n    margin: 0px 5% 5% 0px;\n    position: relative;\n    float: right;\n    bottom: 0;\n    left: 0;\n    width: 50%; }\n    .table-group.teacher-desk .device {\n      height: 95%;\n      width: 28%; }\n\n.device {\n  height: 45%;\n  width: 45%;\n  margin: 0 5% 5% 0; }\n  .device.top {\n    left: 0;\n    top: 0; }\n  .device.bot-right {\n    right: 0;\n    bottom: 0; }\n  .device.bot-left {\n    left: 0;\n    bottom: 0; }\n  .device.filler {\n    background-color: transparent;\n    pointer-events: none; }\n  .device:hover {\n    /*border: 2px solid blue;*/\n    border: none; }\n  .device span {\n    position: relative;\n    top: 40%;\n    translateY: -50%; }\n";

},{}],48:[function(require,module,exports){
module.exports = "<h2 class=\"room-title\">Raum: <span data-bind=\"text: $parent.roomId\"></span> Raumbetreuer: <span data-bind=\"text: $parent.roomContact\"></span></h2><img\n    src=\"styles/edit.png\" alt=\"\" class=\"edit\" data-bind=\"click: $parent.setChangeContact(true)\">\n\n<div class=\"room-container\">\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\"><span>1</span></div>\n        <div class=\"device filler\"><h3>Tisch 1</h3></div>\n        <div class=\"device bot-left\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\"><span>2</span></div>\n        <div class=\"device bot-right\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\"><span>3</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\"><span>4</span></div>\n        <div class=\"device filler\"><h3>Tisch 2</h3></div>\n        <div class=\"device bot-left\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\"><span>5</span></div>\n        <div class=\"device bot-right\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\"><span>6</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\"><span>7</span></div>\n        <div class=\"device filler\"><h3>Tisch 3</h3></div>\n        <div class=\"device bot-left\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\"><span>8</span></div>\n        <div class=\"device bot-right\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\"><span>9</span></div>\n    </div>\n    <div class=\"table-group extended\">\n        <div class=\"device top\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\"><span>10</span></div>\n        <div class=\"device filler\"><h3>Tisch 4</h3></div>\n        <div class=\"device bot-left\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\"><span>11</span></div>\n        <div class=\"device bot-right\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\"><span>12</span></div>\n    </div>\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\"><span>Lehrer</span></div>\n        <div class=\"device\" id=\"device-14\" data-bind=\"click: $parent.deviceClick(14)\"><span>Beamer</span></div>\n        <div class=\"device\" id=\"device-15\" data-bind=\"click: $parent.deviceClick(15)\"><span>Weitere</span></div>\n    </div>\n</div>\n\n<div class=\"changeContactPopup\" data-bind=\"visible: $parent.showChangeContact\">\n    <input type=\"text\" data-bind=\"value: $parent.roomContactInput\" >\n    <input type=\"text\" data-bind=\"value: $parent.roomContactMailInput\" >\n    <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.changeContact()\">Raumbetreuer &auml;ndern</a>\n    <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.setChangeContact(false)\">Abbrechen</a>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h3>Fehlerprotokoll f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h3>\n    <form>\n        <label>\n            Standardfehler:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Eine Liste mit h&auml;fig auftretenden Fehlern.\n                Sollten Sie einen anderen Fehler wiederholt feststellen, k&ouml;nnen Sie Ihn mit dem Button unten zur Liste hinzuf&uuml;gen.\"\n            >i</span>\n            <select class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\">\n                <option data-bind=\"text: title\"></option>\n            </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">Standardfehler speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Geben Sie einen Titel f&uuml;r Ihren Fehler an. Der Titel wird f&uuml;r den Betreff der E-Mails verwendet.\"\n            >i</span>\n            <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung*:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Pflichtfeld! Geben Sie hier eine Beschreibung Ihres Fehlers an.\n                Falls Sie einen Standardfehler melden m&ouml;chten, k&ouml;nnen Sie ihn hier weiter spezifizieren.\"\n            >i</span>\n            <textarea class=\"description\" name=\"description\" maxlength=\"500\" required data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            Lehrer benachrichtigen:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an alle Lehrer verschickt, die nach Plan in diesem Raum unterrichten.\"\n            >i</span>\n            <input class=\"contactMail-teachers\" type=\"checkbox\" data-bind=\"checked: $parent.addTeachersToMail\" >\n        </label>\n        <br>\n        <label>\n            PC-Werkstatt benachrichtigen:\n            <span class=\"tooltip popRight\" data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an die PC-Werkstatt verschickt.\">i</span>\n            <input class=\"contactMail-workshop\" type=\"checkbox\" data-bind=\"checked: $parent.addWorkshopToMail\" >\n        </label>\n        <br>\n\n        <label style=\"margin-bottom: 5px\">\n            Raumbetreuer:\n            <span class=\"tooltip popRight\" data-tooltip=\"Der Raumbetreuer wird &uuml;ber jeden Fehler in Kenntnis gesetzt.\">i</span>\n            <span data-bind=\"text: $parent.roomContactMail\" style=\"color: #888\"></span>\n        </label>\n        <br>\n        <label>\n            weitere Emp&auml;nger: <span\n            class=\"tooltip popRight\" data-tooltip=\"Eine Liste an zus&auml;tzlichen Emp&auml;ngern. Trennen Sie mehrere E-Mail-Adressen mit einem Komma.\"\n        >i</span> <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea>\n        </label>\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">Abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">Protokoll aufnehmen</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"toast error\" data-bind=\"visible: $parent.showError\">\n    <p data-bind=\"text: $parent.error\"></p>\n    <input type=\"button\" data-bind=\"click: $parent.hideToast()\" value=\"X\" >\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>,\n            Beschreibung: <span data-bind=\"text: description\"></span>,\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">Entfernen</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Liste der Fehlerprotokolle leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Liste der Fehlerprotokolle absenden</a>\n    </div>\n</div>\n";

},{}],49:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var RoomLayout_1 = require("../room/RoomLayout");
var RoomGroups = (function (_super) {
    __extends(RoomGroups, _super);
    function RoomGroups(commonIssues, issueFormContainer, userActions) {
        return _super.call(this, commonIssues, issueFormContainer, userActions, RoomGroups.COMPONENT_NAME) || this;
    }
    RoomGroups.prototype.onRender = function () {
        console.log(RoomGroups.COMPONENT_NAME);
    };
    RoomGroups.COMPONENT_NAME = 'roomGroups';
    return RoomGroups;
}(RoomLayout_1.RoomLayout));
exports.RoomGroups = RoomGroups;
},{"../room/RoomLayout":50}],50:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Component_1 = require("../Component");
var ko = require("knockout");
var Issue_1 = require("../../../common/Issue");
var RoomLayout = (function (_super) {
    __extends(RoomLayout, _super);
    function RoomLayout(commonIssues, issueFormContainer, userActions, componentName) {
        var _this = _super.call(this, componentName) || this;
        _this.title = ko.observable('');
        _this.description = ko.observable('');
        _this.issueList = ko.observableArray([]);
        _this.selectedCommonIssue = ko.observable('');
        _this.commonIssueNameList = ['Fehler ausw\u00e4hlen'];
        _this.showError = ko.observable(false);
        _this.error = ko.observable('');
        _this.showChangeContact = ko.observable(false);
        _this.roomContactMailInput = ko.observable('');
        _this.roomContactInput = ko.observable('');
        _this.issueDeviceId = ko.observable(0);
        _this.issueRecipients = ko.observable('');
        _this.issueCounter = 0;
        _this.addTeachersToMail = ko.observable(false);
        _this.addWorkshopToMail = ko.observable(false);
        _this.commonIssueList = commonIssues;
        _this.issueFormContainer = issueFormContainer;
        _this.userActions = userActions;
        for (var _i = 0, commonIssues_1 = commonIssues; _i < commonIssues_1.length; _i++) {
            var commonIssue = commonIssues_1[_i];
            _this.commonIssueNameList.push(commonIssue.title);
        }
        _this.selectedCommonIssue.subscribe(function (newValue) {
            var selectedIssue = (this.commonIssueList.filter(function (commonIssue) { return commonIssue.title === newValue[0]; }))[0];
            if (typeof selectedIssue !== 'undefined') {
                this.description(selectedIssue.description);
                this.issueRecipients(selectedIssue.additionalRecipients);
                this.title(selectedIssue.title);
            }
        }.bind(_this));
        return _this;
    }
    RoomLayout.prototype.setChangeContact = function (state) {
        var _this = this;
        return function () {
            _this.showChangeContact(state);
        };
    };
    RoomLayout.prototype.saveAsTemplate = function () {
        var _this = this;
        return function () {
            var newCommonIssue = {
                description: _this.description.peek(),
                additionalRecipients: _this.issueRecipients.peek(),
                title: _this.title.peek()
            };
            _this.userActions
                .sendNewCommonIssueToServer(newCommonIssue)["catch"](function () {
                console.error('unable to send new common issue to Server, please try again later');
            });
        };
    };
    RoomLayout.prototype.clearIssues = function () {
        var _this = this;
        return function () {
            var elements = document.getElementsByClassName('device');
            for (var index = 0; index < elements.length; index++) {
                var element = elements.item(index);
                element.classList.remove('issue');
            }
            _this.issueList([]);
        };
    };
    RoomLayout.prototype.sendIssues = function () {
        var _this = this;
        return function () {
            if (_this.issueList.peek().length > 0) {
                _this.userActions.sendIssuesToMailServer({
                    addTeachersToMailList: _this.addTeachersToMail.peek(),
                    issues: _this.issueList.peek()
                })
                    .then(_this.issueList([]))["catch"](function () {
                    console.error('unable to send Issues to Server, please try again later');
                });
            }
            else {
                console.warn('no issues to send');
            }
        };
    };
    RoomLayout.prototype.changeContact = function () {
        var _this = this;
        return function () {
            _this.showChangeContact(false);
            _this.userActions.sendChangeRoomContactToMailServer(_this.roomId, {
                contact: _this.roomContactInput.peek(),
                contactMail: _this.roomContactMailInput.peek()
            })["catch"](function (error) {
                console.error(error);
            });
        };
    };
    RoomLayout.prototype.deleteIssue = function (issueId) {
        var _this = this;
        return function () {
            var newIssueList = _this.issueList.peek();
            for (var index = 0; index < newIssueList.length; index++) {
                var issue = newIssueList[index];
                if (issue.issueId === issueId) {
                    var deletedIssue = newIssueList.splice(index, 1);
                    _this.removeDeviceIssueClassIfNoLongerInIssueList(deletedIssue[0].deviceId, newIssueList);
                    _this.issueList(newIssueList);
                    break;
                }
            }
        };
    };
    RoomLayout.prototype.deviceHasIssues = function (deviceId) {
        var _this = this;
        return function () {
            for (var _i = 0, _a = _this.issueList.peek(); _i < _a.length; _i++) {
                var issue = _a[_i];
                if (issue.deviceId === deviceId) {
                    return true;
                }
            }
            return false;
        };
    };
    RoomLayout.prototype.cancelIssue = function () {
        var modalElement = document.getElementById('modal');
        modalElement.className = modalElement.className.replace('active', 'disabled');
        this.resetFormFields();
    };
    RoomLayout.prototype.addIssue = function () {
        var _this = this;
        var modalElement = document.getElementById('modal');
        return function () {
            if (_this.issueDeviceId.peek() !== 0) {
                if (_this.description.peek() === '' || _this.description.peek().length > 500) {
                    _this.showError(true);
                    _this.error(RoomLayout.DESCRIPTION_INVALID);
                }
                else {
                    _this.showError(false);
                    _this.error('');
                    var issue = new Issue_1.Issue();
                    issue.title = _this.title.peek();
                    issue.description = _this.description.peek();
                    var recipients = _this.issueRecipients.peek();
                    if (_this.addWorkshopToMail.peek() === true) {
                        recipients += RoomLayout.WORKSHOP_MAIL;
                    }
                    if (_this.issueRecipients.peek().indexOf(',') > -1) {
                        issue.recipients = recipients.trim().split(',');
                    }
                    else {
                        issue.recipients = [recipients];
                    }
                    issue.deviceId = _this.issueDeviceId.peek();
                    issue.issueId = _this.issueCounter++;
                    issue.roomId = _this.roomId;
                    var deviceElement = document.getElementById('device-' + issue.deviceId);
                    deviceElement.classList.add('issue');
                    _this.issueList.push(issue);
                    _this.issueFormContainer.addIssue(issue);
                    modalElement.className = modalElement.className.replace('active', 'disabled');
                    _this.resetFormFields();
                }
            }
        };
    };
    RoomLayout.prototype.onLoad = function (room) {
        this.roomId = room.roomId;
        this.roomContact = room.contact;
        this.roomContactInput(room.contact);
        this.roomContactMail = room.contactMail;
        this.roomContactMailInput(room.contactMail);
        this.room = room;
    };
    RoomLayout.prototype.deviceClick = function (device) {
        var _this = this;
        var modalElement = document.getElementById('modal');
        return function () {
            console.log('click' + device);
            modalElement.className = modalElement.className.replace('disabled', 'active');
            _this.issueDeviceId(parseInt(device));
        };
    };
    RoomLayout.prototype.hideToast = function () {
        var _this = this;
        return function () {
            _this.showError(false);
            _this.error('');
        };
    };
    RoomLayout.prototype.resetFormFields = function () {
        this.description('');
        this.issueRecipients('');
        this.title('');
        this.addTeachersToMail(false);
        this.addWorkshopToMail(false);
        this.issueDeviceId(0);
    };
    RoomLayout.prototype.removeDeviceIssueClassIfNoLongerInIssueList = function (deviceId, issues) {
        var issuesWithCurrentDeviceId = issues.filter(function (issue) { return issue.deviceId === deviceId; });
        if (issuesWithCurrentDeviceId.length < 1) {
            var element = document.getElementById('device-' + deviceId);
            element.classList.remove('issue');
        }
    };
    RoomLayout.DESCRIPTION_INVALID = 'Bitte geben Sie eine Beschreibung zum aufgetretenen Fehler an.';
    RoomLayout.WORKSHOP_MAIL = 'pc-werkstatt@gso-koeln.de';
    return RoomLayout;
}(Component_1.Component));
exports.RoomLayout = RoomLayout;
},{"../../../common/Issue":27,"../Component":36,"knockout":16}],51:[function(require,module,exports){
module.exports = ".sidebar-container {\n  background-color: #393d53;\n  box-sizing: border-box;\n  display: block;\n  width: 150px; }\n  @media (min-width: 900px) {\n    .sidebar-container {\n      width: 250px; } }\n\n.sidebar {\n  box-sizing: border-box;\n  display: block;\n  padding: 25px; }\n\n.sidebar-list {\n  color: white;\n  list-style: none;\n  padding: 0;\n  width: 100%; }\n  .sidebar-list .icon {\n    display: block;\n    float: left;\n    margin-left: 15px;\n    margin-top: 5px; }\n  .sidebar-list a {\n    box-sizing: border-box;\n    color: white;\n    display: block;\n    padding: 5px 35px;\n    text-decoration: none;\n    width: 100%; }\n  .sidebar-list .item {\n    margin: 5px 0; }\n    .sidebar-list .item.active a {\n      border-left: 5px solid #3c77be; }\n    .sidebar-list .item:hover {\n      background-color: #4e5371; }\n  .sidebar-list .setitem {\n    margin-left: 5px; }\n";

},{}],52:[function(require,module,exports){
module.exports = "<!--<div data-bind=\"text: JSON.stringify($parent)\"></div>-->\n\n<nav class=\"sidebar-list\" data-bind=\"foreach: {data: wingList, as: 'wing'}\">\n    <div class=\"item active\">\n        <a href=\"#\"><span data-bind=\"text: wing\"></span></a>\n    </div>\n\n    <div data-bind=\"foreach: {data: $parent.getRoomsByWing(wing), as: 'room'}\">\n        <div class=\"item setitem active\">\n            <a data-bind=\"attr: {href: '?page=room&roomId='+room.roomId}\"><span data-bind=\"text: room.roomId\"></span></a>\n        </div>\n    </div>\n</nav>\n";

},{}],53:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Component_1 = require("../Component");
var Sidebar = (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar(rooms) {
        var _this = _super.call(this, Sidebar.COMPONENT_NAME) || this;
        _this.wingList = [];
        _this.rooms = rooms;
        _this.wingList = _this.getUniqueKeys(rooms, 'wing').sort(function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
        return _this;
    }
    Sidebar.prototype.getFloorListForWing = function (wing) {
        var wingRooms = this.rooms.filter(function (room) { return room.wing === wing; });
        return this.getUniqueKeys(wingRooms, 'floor');
    };
    Sidebar.prototype.getRooms = function (wing, floor) {
        var filteredRooms = this.rooms.filter(function (room) { return room.wing === wing && room.floor === floor; });
        return filteredRooms.sort(function (a, b) {
            if (a.substr(1) < b.substr(1)) {
                return -1;
            }
            if (a.substr(1) > b.substr(1)) {
                return 1;
            }
            return 0;
        });
    };
    Sidebar.prototype.getRoomsByWing = function (wing) {
        var filteredRooms = this.rooms.filter(function (room) { return room.wing === wing; });
        return filteredRooms.sort(function (a, b) {
            if (a.roomId < b.roomId) {
                return -1;
            }
            if (a.roomId > b.roomId) {
                return 1;
            }
            return 0;
        });
    };
    Sidebar.prototype.onLoad = function () {
        console.log('loading sidebar');
    };
    Sidebar.prototype.updateViewModel = function (viewModel) {
        throw new Error('Method not implemented.');
    };
    Sidebar.prototype.getUniqueKeys = function (arr, property) {
        var u = {}, a = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i][property])) {
                a.push(arr[i][property]);
                u[arr[i][property]] = 1;
            }
        }
        return a;
    };
    Sidebar.COMPONENT_NAME = 'sidebar';
    return Sidebar;
}(Component_1.Component));
exports.Sidebar = Sidebar;
},{"../Component":36}],54:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var KnockoutComponent = (function () {
    function KnockoutComponent(template, component) {
        this.name = component.name;
        this.template = template;
        this.viewModel = { instance: component };
    }
    return KnockoutComponent;
}());
exports.KnockoutComponent = KnockoutComponent;
},{}],55:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var KnockoutComponent_1 = require("./KnockoutComponent");
var knockoutComponentFactory = (function () {
    function knockoutComponentFactory(templateSupplier, stylesSupplier, components) {
        this.templateSupplier = templateSupplier;
        this.stylesSupplier = stylesSupplier;
        this.components = components;
    }
    knockoutComponentFactory.prototype.createKnockoutComponents = function () {
        var knockoutComponents = [];
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            knockoutComponents.push(this.createKnockoutComponent(component));
        }
        return knockoutComponents;
    };
    knockoutComponentFactory.prototype.createKnockoutComponent = function (component) {
        var componentName = this.getComponentName(component);
        var template = '<style>' + this.stylesSupplier.getStyles(componentName) + '</style>' + this.templateSupplier.getTemplate(componentName);
        return new KnockoutComponent_1.KnockoutComponent(template, component);
    };
    knockoutComponentFactory.prototype.getComponentName = function (component) {
        if (typeof component.name === 'undefined') {
            throw new Error('Component name is missing.');
        }
        return component.name;
    };
    return knockoutComponentFactory;
}());
exports.knockoutComponentFactory = knockoutComponentFactory;
},{"./KnockoutComponent":54}],56:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ko = require("knockout");
var KnockoutInitializer = (function () {
    function KnockoutInitializer(knockoutComponents, knockoutHandlers) {
        this.knockoutComponents = knockoutComponents;
        this.knockoutHandlers = knockoutHandlers;
    }
    KnockoutInitializer.prototype.initialize = function () {
        console.log(this.knockoutComponents);
        for (var _i = 0, _a = this.knockoutComponents; _i < _a.length; _i++) {
            var knockoutComponent = _a[_i];
            ko.components.register(knockoutComponent.name, knockoutComponent);
        }
        for (var _b = 0, _c = this.knockoutHandlers; _b < _c.length; _b++) {
            var handler = _c[_b];
            ko.bindingHandlers[handler.name] = handler;
        }
    };
    return KnockoutInitializer;
}());
exports.KnockoutInitializer = KnockoutInitializer;
},{"knockout":16}],57:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.componentClassMapping = {
    home: 'Home',
    sidebar: 'Sidebar',
    roomGroups: 'RoomGroups',
    roomCircular: 'RoomCircular',
    roomGroupsAngled: 'RoomGroupsAngled'
};
function isComponentName(x) {
    for (var component in exports.componentClassMapping) {
        if (x === component) {
            return true;
        }
    }
    return false;
}
exports.isComponentName = isComponentName;
},{}],58:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var styles = {
    sidebar: require('..\\..\\content\\components\\sidebar\\sidebar.css'),
    home: require('..\\..\\content\\components\\home\\home.css'),
    roomGroups: require('..\\..\\content\\components\\roomGroups\\roomGroups.css'),
    roomGroupsAngled: require('..\\..\\content\\components\\roomGroupsAngled\\roomGroupsAngled.css'),
    roomCircular: require('..\\..\\content\\components\\roomCircular\\roomCircular.css')
};
var StylesSupplier = (function () {
    function StylesSupplier() {
    }
    StylesSupplier.prototype.getStyles = function (styleName) {
        var style = styles[styleName];
        if (typeof style !== 'undefined') {
            return style;
        }
        throw new Error('referenced Styles not found for: "' + styleName + '"');
    };
    return StylesSupplier;
}());
exports.StylesSupplier = StylesSupplier;
},{"..\\..\\content\\components\\home\\home.css":38,"..\\..\\content\\components\\roomCircular\\roomCircular.css":41,"..\\..\\content\\components\\roomGroupsAngled\\roomGroupsAngled.css":44,"..\\..\\content\\components\\roomGroups\\roomGroups.css":47,"..\\..\\content\\components\\sidebar\\sidebar.css":51}],59:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var templates = {
    sidebar: require('..\\..\\content\\components\\sidebar\\sidebar.html'),
    home: require('..\\..\\content\\components\\home\\home.html'),
    roomGroups: require('..\\..\\content\\components\\roomGroups\\roomGroups.html'),
    roomGroupsAngled: require('..\\..\\content\\components\\roomGroupsAngled\\roomGroupsAngled.html'),
    roomCircular: require('..\\..\\content\\components\\roomCircular\\roomCircular.html')
};
var TemplateSupplier = (function () {
    function TemplateSupplier() {
    }
    TemplateSupplier.prototype.getTemplate = function (templateName) {
        var template = templates[templateName];
        if (typeof template !== 'undefined') {
            return template;
        }
        throw new Error('referenced template not found for: ' + templateName);
    };
    return TemplateSupplier;
}());
exports.TemplateSupplier = TemplateSupplier;
},{"..\\..\\content\\components\\home\\home.html":39,"..\\..\\content\\components\\roomCircular\\roomCircular.html":42,"..\\..\\content\\components\\roomGroupsAngled\\roomGroupsAngled.html":45,"..\\..\\content\\components\\roomGroups\\roomGroups.html":48,"..\\..\\content\\components\\sidebar\\sidebar.html":52}],60:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ko = require("knockout");
var LinkHandler = (function () {
    function LinkHandler(userActions) {
        this.userActions = userActions;
        this.name = 'link';
        this.init = this.init.bind(this);
    }
    LinkHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var accessor = this.customAccessor(valueAccessor(), viewModel, allBindingsAccessor);
        ko.bindingHandlers
            .click
            .init(element, accessor, allBindingsAccessor, viewModel, bindingContext);
    };
    LinkHandler.prototype.customAccessor = function (originalFunction, viewModel, allBindingsAccessor) {
        return function () {
            return function () {
                if (ko.utils.unwrapObservable(allBindingsAccessor().condition)) {
                    originalFunction.apply(viewModel, arguments);
                }
                var moduleName = arguments[0];
                this.userActions.changePage(moduleName);
            }.bind(this);
        }.bind(this);
    };
    return LinkHandler;
}());
exports.LinkHandler = LinkHandler;
},{"knockout":16}],61:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Link_1 = require("./handlers/Link");
var Styles_1 = require("./config/Styles");
var Templates_1 = require("./config/Templates");
var KnockoutComponentFactory_1 = require("./KnockoutComponentFactory");
var Components_1 = require("./config/Components");
var KnockoutInitializer_1 = require("./KnockoutInitializer");
var KnockoutDependencies = (function () {
    function KnockoutDependencies(forge) {
        this.forge = forge;
        this.registerKnockoutServices();
        this.registerKnockoutModules();
        this.forge.bind('componentClassMapping').to.instance(Components_1.componentClassMapping);
        this.forge.bind('knockoutInitializer').to.type(KnockoutInitializer_1.KnockoutInitializer);
    }
    KnockoutDependencies.prototype.registerKnockoutServices = function () {
        this.forge.bind('knockoutHandlers').to.type(Link_1.LinkHandler);
    };
    KnockoutDependencies.prototype.registerKnockoutModules = function () {
        this.forge.bind('knockoutHandlers').to.type(Link_1.LinkHandler);
        this.forge.bind('stylesSupplier').to.type(Styles_1.StylesSupplier);
        this.forge.bind('templateSupplier').to.type(Templates_1.TemplateSupplier);
        this.forge.bind('componentSetup').to.type(KnockoutComponentFactory_1.knockoutComponentFactory);
        var componentSetup = this.forge.get('componentSetup');
        this.forge.bind('knockoutComponents').to["function"](componentSetup.createKnockoutComponents.bind(componentSetup));
    };
    return KnockoutDependencies;
}());
exports.KnockoutDependencies = KnockoutDependencies;
},{"./KnockoutComponentFactory":55,"./KnockoutInitializer":56,"./config/Components":57,"./config/Styles":58,"./config/Templates":59,"./handlers/Link":60}]},{},[26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL0JpbmRpbmcuanMiLCJub2RlX21vZHVsZXMvZm9yZ2UtZGkvQ29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9JbnNwZWN0b3IuanMiLCJub2RlX21vZHVsZXMvZm9yZ2UtZGkvZXJyb3JzL0NvbmZpZ3VyYXRpb25FcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9lcnJvcnMvUmVzb2x1dGlvbkVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvTGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvU2luZ2xldG9uTGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvVHJhbnNpZW50TGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9GdW5jdGlvblJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9JbnN0YW5jZVJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9SZXNvbHZlci5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9yZXNvbHZlcnMvVHlwZVJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2tub2Nrb3V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9BcHBsaWNhdGlvbi50cyIsInNyYy9EZXBlbmRlbmNpZXMudHMiLCJzcmMvUm91dGVyLnRzIiwic3JjL1VzZXJBY3Rpb25zLnRzIiwic3JjL2FwcC50cyIsInNyYy9jb21tb24vSXNzdWUudHMiLCJzcmMvY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lci50cyIsInNyYy9jb21tb24vUGFyYW1SZWFkZXIudHMiLCJzcmMvY29tbW9uL1Jlc29sdmVyLnRzIiwic3JjL2NvbW1vbi9TZXJ2ZXJBY3Rpb25zLnRzIiwic3JjL2NvbW1vbi9YaHJQb3N0LnRzIiwic3JjL2NvbW1vbi9YaHJSZXF1ZXN0LnRzIiwic3JjL2NvbnRlbnQvQ29udGVudERlcGVuZGVuY2llcy50cyIsInNyYy9jb250ZW50L1BhZ2VSZW5kZXJlci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvQ29tcG9uZW50LnRzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9Db21wb25lbnRSZXNvbHZlci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvaG9tZS9ob21lLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvaG9tZS9ob21lLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL2hvbWUvaG9tZS50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhci5jc3MiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21DaXJjdWxhci9yb29tQ2lyY3VsYXIuaHRtbCIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21Hcm91cHNBbmdsZWQvcm9vbUdyb3Vwc0FuZ2xlZC50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21Hcm91cHMvcm9vbUdyb3Vwcy50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbS9Sb29tTGF5b3V0LnRzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuY3NzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuaHRtbCIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvc2lkZWJhci9zaWRlYmFyLnRzIiwic3JjL2tub2Nrb3V0L0tub2Nrb3V0Q29tcG9uZW50LnRzIiwic3JjL2tub2Nrb3V0L0tub2Nrb3V0Q29tcG9uZW50RmFjdG9yeS50cyIsInNyYy9rbm9ja291dC9Lbm9ja291dEluaXRpYWxpemVyLnRzIiwic3JjL2tub2Nrb3V0L2NvbmZpZy9Db21wb25lbnRzLnRzIiwic3JjL2tub2Nrb3V0L2NvbmZpZy9TdHlsZXMudHMiLCJzcmMva25vY2tvdXQvY29uZmlnL1RlbXBsYXRlcy50cyIsInNyYy9rbm9ja291dC9oYW5kbGVycy9MaW5rLnRzIiwic3JjL2tub2Nrb3V0L2tub2Nrb3V0RGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNwSCxDQUFDO0lBQ0wsMkJBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBeEJZLG9EQUFvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNvbXBhcmUgYW5kIGlzQnVmZmVyIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvYmxvYi82ODBlOWU1ZTQ4OGYyMmFhYzI3NTk5YTU3ZGM4NDRhNjMxNTkyOGRkL2luZGV4LmpzXG4vLyBvcmlnaW5hbCBub3RpY2U6XG5cbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIHggPSBhLmxlbmd0aDtcbiAgdmFyIHkgPSBiLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXTtcbiAgICAgIHkgPSBiW2ldO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmICh5IDwgeCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICBpZiAoZ2xvYmFsLkJ1ZmZlciAmJiB0eXBlb2YgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKGIpO1xuICB9XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpO1xufVxuXG4vLyBiYXNlZCBvbiBub2RlIGFzc2VydCwgb3JpZ2luYWwgbm90aWNlOlxuXG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZ1bmN0aW9uc0hhdmVOYW1lcyA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb28oKSB7fS5uYW1lID09PSAnZm9vJztcbn0oKSk7XG5mdW5jdGlvbiBwVG9TdHJpbmcgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG59XG5mdW5jdGlvbiBpc1ZpZXcoYXJyYnVmKSB7XG4gIGlmIChpc0J1ZmZlcihhcnJidWYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsLkFycmF5QnVmZmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyhhcnJidWYpO1xuICB9XG4gIGlmICghYXJyYnVmKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChhcnJidWYgaW5zdGFuY2VvZiBEYXRhVmlldykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChhcnJidWYuYnVmZmVyICYmIGFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbnZhciByZWdleCA9IC9cXHMqZnVuY3Rpb25cXHMrKFteXFwoXFxzXSopXFxzKi87XG4vLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2Z1bmN0aW9uLnByb3RvdHlwZS5uYW1lL2Jsb2IvYWRlZWVlYzhiZmNjNjA2OGIxODdkN2Q5ZmIzZDViYjFkM2EzMDg5OS9pbXBsZW1lbnRhdGlvbi5qc1xuZnVuY3Rpb24gZ2V0TmFtZShmdW5jKSB7XG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMpIHtcbiAgICByZXR1cm4gZnVuYy5uYW1lO1xuICB9XG4gIHZhciBzdHIgPSBmdW5jLnRvU3RyaW5nKCk7XG4gIHZhciBtYXRjaCA9IHN0ci5tYXRjaChyZWdleCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXTtcbn1cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBnZXROYW1lKHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc3BlY3Qoc29tZXRoaW5nKSB7XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgfHwgIXV0aWwuaXNGdW5jdGlvbihzb21ldGhpbmcpKSB7XG4gICAgcmV0dXJuIHV0aWwuaW5zcGVjdChzb21ldGhpbmcpO1xuICB9XG4gIHZhciByYXduYW1lID0gZ2V0TmFtZShzb21ldGhpbmcpO1xuICB2YXIgbmFtZSA9IHJhd25hbWUgPyAnOiAnICsgcmF3bmFtZSA6ICcnO1xuICByZXR1cm4gJ1tGdW5jdGlvbicgKyAgbmFtZSArICddJztcbn1cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuZXhwZWN0ZWQpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIGRlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBTdHJpY3RFcXVhbCcsIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAmJiBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gY29tcGFyZShhY3R1YWwsIGV4cGVjdGVkKSA9PT0gMDtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoKGFjdHVhbCA9PT0gbnVsbCB8fCB0eXBlb2YgYWN0dWFsICE9PSAnb2JqZWN0JykgJiZcbiAgICAgICAgICAgICAoZXhwZWN0ZWQgPT09IG51bGwgfHwgdHlwZW9mIGV4cGVjdGVkICE9PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gc3RyaWN0ID8gYWN0dWFsID09PSBleHBlY3RlZCA6IGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyBJZiBib3RoIHZhbHVlcyBhcmUgaW5zdGFuY2VzIG9mIHR5cGVkIGFycmF5cywgd3JhcCB0aGVpciB1bmRlcmx5aW5nXG4gIC8vIEFycmF5QnVmZmVycyBpbiBhIEJ1ZmZlciBlYWNoIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlXG4gIC8vIFRoaXMgb3B0aW1pemF0aW9uIHJlcXVpcmVzIHRoZSBhcnJheXMgdG8gaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGNoZWNrZWQgYnlcbiAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyAoYWthIHBUb1N0cmluZykuIE5ldmVyIHBlcmZvcm0gYmluYXJ5XG4gIC8vIGNvbXBhcmlzb25zIGZvciBGbG9hdCpBcnJheXMsIHRob3VnaCwgc2luY2UgZS5nLiArMCA9PT0gLTAgYnV0IHRoZWlyXG4gIC8vIGJpdCBwYXR0ZXJucyBhcmUgbm90IGlkZW50aWNhbC5cbiAgfSBlbHNlIGlmIChpc1ZpZXcoYWN0dWFsKSAmJiBpc1ZpZXcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgcFRvU3RyaW5nKGFjdHVhbCkgPT09IHBUb1N0cmluZyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICAhKGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSB8fFxuICAgICAgICAgICAgICAgYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSkge1xuICAgIHJldHVybiBjb21wYXJlKG5ldyBVaW50OEFycmF5KGFjdHVhbC5idWZmZXIpLFxuICAgICAgICAgICAgICAgICAgIG5ldyBVaW50OEFycmF5KGV4cGVjdGVkLmJ1ZmZlcikpID09PSAwO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAhPT0gaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG1lbW9zID0gbWVtb3MgfHwge2FjdHVhbDogW10sIGV4cGVjdGVkOiBbXX07XG5cbiAgICB2YXIgYWN0dWFsSW5kZXggPSBtZW1vcy5hY3R1YWwuaW5kZXhPZihhY3R1YWwpO1xuICAgIGlmIChhY3R1YWxJbmRleCAhPT0gLTEpIHtcbiAgICAgIGlmIChhY3R1YWxJbmRleCA9PT0gbWVtb3MuZXhwZWN0ZWQuaW5kZXhPZihleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb3MuYWN0dWFsLnB1c2goYWN0dWFsKTtcbiAgICBtZW1vcy5leHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcblxuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSB7XG4gIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKVxuICAgIHJldHVybiBhID09PSBiO1xuICBpZiAoc3RyaWN0ICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSAhPT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKTtcbiAgdmFyIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYiwgc3RyaWN0KTtcbiAgfVxuICB2YXIga2EgPSBvYmplY3RLZXlzKGEpO1xuICB2YXIga2IgPSBvYmplY3RLZXlzKGIpO1xuICB2YXIga2V5LCBpO1xuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9PSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5ub3REZWVwU3RyaWN0RXF1YWwgPSBub3REZWVwU3RyaWN0RXF1YWw7XG5mdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBTdHJpY3RFcXVhbCcsIG5vdERlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn1cblxuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSWdub3JlLiAgVGhlIGluc3RhbmNlb2YgY2hlY2sgZG9lc24ndCB3b3JrIGZvciBhcnJvdyBmdW5jdGlvbnMuXG4gIH1cblxuICBpZiAoRXJyb3IuaXNQcm90b3R5cGVPZihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKSB7XG4gIHZhciBlcnJvcjtcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBibG9jayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYmxvY2tcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIGFjdHVhbCA9IF90cnlCbG9jayhibG9jayk7XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICB2YXIgdXNlclByb3ZpZGVkTWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJztcbiAgdmFyIGlzVW53YW50ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgdXRpbC5pc0Vycm9yKGFjdHVhbCk7XG4gIHZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmICFleHBlY3RlZDtcblxuICBpZiAoKGlzVW53YW50ZWRFeGNlcHRpb24gJiZcbiAgICAgIHVzZXJQcm92aWRlZE1lc3NhZ2UgJiZcbiAgICAgIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fFxuICAgICAgaXNVbmV4cGVjdGVkRXhjZXB0aW9uKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKHRydWUsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyhmYWxzZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHRocm93IGVycjsgfTtcblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07XG4iLCIvKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc3RlZmFucGVubmVyL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDQuMS4xXG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLkVTNlByb21pc2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB4O1xuICByZXR1cm4geCAhPT0gbnVsbCAmJiAodHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbnZhciBfaXNBcnJheSA9IHVuZGVmaW5lZDtcbmlmIChBcnJheS5pc0FycmF5KSB7XG4gIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbn0gZWxzZSB7XG4gIF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xufVxuXG52YXIgaXNBcnJheSA9IF9pc0FycmF5O1xuXG52YXIgbGVuID0gMDtcbnZhciB2ZXJ0eE5leHQgPSB1bmRlZmluZWQ7XG52YXIgY3VzdG9tU2NoZWR1bGVyRm4gPSB1bmRlZmluZWQ7XG5cbnZhciBhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gIGxlbiArPSAyO1xuICBpZiAobGVuID09PSAyKSB7XG4gICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIGlmIChjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgY3VzdG9tU2NoZWR1bGVyRm4oZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICBjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG59XG5cbmZ1bmN0aW9uIHNldEFzYXAoYXNhcEZuKSB7XG4gIGFzYXAgPSBhc2FwRm47XG59XG5cbnZhciBicm93c2VyV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG52YXIgYnJvd3Nlckdsb2JhbCA9IGJyb3dzZXJXaW5kb3cgfHwge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHt9KS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbi8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG52YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbn1cblxuLy8gdmVydHhcbmZ1bmN0aW9uIHVzZVZlcnR4VGltZXIoKSB7XG4gIGlmICh0eXBlb2YgdmVydHhOZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2ZXJ0eE5leHQoZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIG5vZGUuZGF0YSA9IGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyO1xuICB9O1xufVxuXG4vLyB3ZWIgd29ya2VyXG5mdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gZXM2LXByb21pc2Ugd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgZ2xvYmFsU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdsb2JhbFNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgIHZhciBhcmcgPSBxdWV1ZVtpICsgMV07XG5cbiAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gYXR0ZW1wdFZlcnR4KCkge1xuICB0cnkge1xuICAgIHZhciByID0gcmVxdWlyZTtcbiAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB1bmRlZmluZWQ7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgaWYgKF9zdGF0ZSkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBfYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2VDYWxsYmFjayhfc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZSQxKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxudmFyIFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMTYpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIFBFTkRJTkcgPSB2b2lkIDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG5cbnZhciBHRVRfVEhFTl9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiBzZWxmRnVsZmlsbG1lbnQoKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFwiWW91IGNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKTtcbn1cblxuZnVuY3Rpb24gY2Fubm90UmV0dXJuT3duKCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVuKHByb21pc2UpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgcmV0dXJuIEdFVF9USEVOX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeVRoZW4odGhlbiQkMSwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICB0cnkge1xuICAgIHRoZW4kJDEuY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbiQkMSkge1xuICBhc2FwKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgIHZhciBlcnJvciA9IHRyeVRoZW4odGhlbiQkMSwgdGhlbmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9XG4gIH0sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICByZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJDEpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkMSA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUkMSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQxID09PSBHRVRfVEhFTl9FUlJPUikge1xuICAgICAgcmVqZWN0KHByb21pc2UsIEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoZW4kJDEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkMSkpIHtcbiAgICAgIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICByZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgZ2V0VGhlbih2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgfVxuXG4gIHB1Ymxpc2gocHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEO1xuXG4gIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHByb21pc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcblxuICBhc2FwKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9zdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBfc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBFcnJvck9iamVjdCgpIHtcbiAgdGhpcy5lcnJvciA9IG51bGw7XG59XG5cbnZhciBUUllfQ0FUQ0hfRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICByZXR1cm4gVFJZX0NBVENIX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkLFxuICAgICAgc3VjY2VlZGVkID0gdW5kZWZpbmVkLFxuICAgICAgZmFpbGVkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHZhbHVlID0gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICB2YWx1ZS5lcnJvciA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgLy8gbm9vcFxuICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gUkVKRUNURUQpIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3QocHJvbWlzZSwgZSk7XG4gIH1cbn1cblxudmFyIGlkID0gMDtcbmZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cbmZ1bmN0aW9uIG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgcHJvbWlzZVtQUk9NSVNFX0lEXSA9IGlkKys7XG4gIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG59XG5cbmZ1bmN0aW9uIEVudW1lcmF0b3IkMShDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICBtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhpcy5sZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcblxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgIHRoaXMuX2VudW1lcmF0ZShpbnB1dCk7XG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGlvbkVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbn1cblxuRW51bWVyYXRvciQxLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gUEVORElORyAmJiBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lYWNoRW50cnkoaW5wdXRbaV0sIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yJDEucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICB2YXIgcmVzb2x2ZSQkMSA9IGMucmVzb2x2ZTtcblxuICBpZiAocmVzb2x2ZSQkMSA9PT0gcmVzb2x2ZSQxKSB7XG4gICAgdmFyIF90aGVuID0gZ2V0VGhlbihlbnRyeSk7XG5cbiAgICBpZiAoX3RoZW4gPT09IHRoZW4gJiYgZW50cnkuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBfdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFByb21pc2UkMikge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIF90aGVuKTtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQxKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlJCQxKGVudHJ5KTtcbiAgICAgIH0pLCBpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUkJDEoZW50cnkpLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvciQxLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gKHN0YXRlLCBpLCB2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IkMS5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uIChwcm9taXNlLCBpKSB7XG4gIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgfSk7XG59O1xuXG4vKipcbiAgYFByb21pc2UuYWxsYCBhY2NlcHRzIGFuIGFycmF5IG9mIHByb21pc2VzLCBhbmQgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IG9mIGZ1bGZpbGxtZW50IHZhbHVlcyBmb3IgdGhlIHBhc3NlZCBwcm9taXNlcywgb3JcbiAgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBiZSByZWplY3RlZC4gSXQgY2FzdHMgYWxsXG4gIGVsZW1lbnRzIG9mIHRoZSBwYXNzZWQgaXRlcmFibGUgdG8gcHJvbWlzZXMgYXMgaXQgcnVucyB0aGlzIGFsZ29yaXRobS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVzb2x2ZSgyKTtcbiAgbGV0IHByb21pc2UzID0gcmVzb2x2ZSgzKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBhbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICBsZXQgcHJvbWlzZTMgPSByZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIGFycmF5IG9mIHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4gIEBzdGF0aWNcbiovXG5mdW5jdGlvbiBhbGwkMShlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvciQxKHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yYWNlYCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2ggaXMgc2V0dGxlZCBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlXG4gIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIHNldHRsZS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMicpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFByb21pc2UucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdFxuICBzZXR0bGVkIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlXG4gIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IHNldHRsZWQgcHJvbWlzZSBoYXNcbiAgYmVjb21lIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gIHByb21pc2Ugd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcigncHJvbWlzZSAyJykpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQW4gZXhhbXBsZSByZWFsLXdvcmxkIHVzZSBjYXNlIGlzIGltcGxlbWVudGluZyB0aW1lb3V0czpcblxuICBgYGBqYXZhc2NyaXB0XG4gIFByb21pc2UucmFjZShbYWpheCgnZm9vLmpzb24nKSwgdGltZW91dCg1MDAwKV0pXG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2Ugd2hpY2ggc2V0dGxlcyBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlIGZpcnN0IHBhc3NlZFxuICBwcm9taXNlIHRvIHNldHRsZS5cbiovXG5mdW5jdGlvbiByYWNlJDEoZW50cmllcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKF8sIHJlamVjdCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgYFByb21pc2UucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWQgYHJlYXNvbmAuXG4gIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdCQxKHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBuZWVkc1Jlc29sdmVyKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG59XG5cbmZ1bmN0aW9uIG5lZWRzTmV3KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xufVxuXG4vKipcbiAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cbiAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgVGVybWlub2xvZ3lcbiAgLS0tLS0tLS0tLS1cblxuICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxuICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cbiAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXG4gIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXG5cbiAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxuXG4gIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcbiAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXG5cbiAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcbiAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXG4gIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgaXRzZWxmIGZ1bGZpbGwuXG5cblxuICBCYXNpYyBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tXG5cbiAgYGBganNcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyBvbiBzdWNjZXNzXG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG5cbiAgICAvLyBvbiBmYWlsdXJlXG4gICAgcmVqZWN0KHJlYXNvbik7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgQWR2YW5jZWQgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLS0tLVxuXG4gIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcbiAgYFhNTEh0dHBSZXF1ZXN0YHMuXG5cbiAgYGBganNcbiAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxuXG4gIGBgYGpzXG4gIFByb21pc2UuYWxsKFtcbiAgICBnZXRKU09OKCcvcG9zdHMnKSxcbiAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XG4gICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxuICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0pO1xuICBgYGBcblxuICBAY2xhc3MgUHJvbWlzZVxuICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEBjb25zdHJ1Y3RvclxuKi9cbmZ1bmN0aW9uIFByb21pc2UkMihyZXNvbHZlcikge1xuICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UkMiA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gIH1cbn1cblxuUHJvbWlzZSQyLmFsbCA9IGFsbCQxO1xuUHJvbWlzZSQyLnJhY2UgPSByYWNlJDE7XG5Qcm9taXNlJDIucmVzb2x2ZSA9IHJlc29sdmUkMTtcblByb21pc2UkMi5yZWplY3QgPSByZWplY3QkMTtcblByb21pc2UkMi5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZSQyLl9zZXRBc2FwID0gc2V0QXNhcDtcblByb21pc2UkMi5fYXNhcCA9IGFzYXA7XG5cblByb21pc2UkMi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQcm9taXNlJDIsXG5cbiAgLyoqXG4gICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQ2hhaW5pbmdcbiAgICAtLS0tLS0tLVxuICBcbiAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICB9KTtcbiAgXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgfSk7XG4gICAgYGBgXG4gICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFzc2ltaWxhdGlvblxuICAgIC0tLS0tLS0tLS0tLVxuICBcbiAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBTaW1wbGUgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCByZXN1bHQ7XG4gIFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCBhdXRob3IsIGJvb2tzO1xuICBcbiAgICB0cnkge1xuICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gIFxuICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcbiAgXG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuICBcbiAgICB9XG4gIFxuICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZEF1dGhvcigpLlxuICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCB0aGVuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gIHRoZW46IHRoZW4sXG5cbiAgLyoqXG4gICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG4gIFxuICAgIGBgYGpzXG4gICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgfVxuICBcbiAgICAvLyBzeW5jaHJvbm91c1xuICAgIHRyeSB7XG4gICAgICBmaW5kQXV0aG9yKCk7XG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfVxuICBcbiAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIGNhdGNoXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgJ2NhdGNoJzogZnVuY3Rpb24gX2NhdGNoKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cbi8qZ2xvYmFsIHNlbGYqL1xuZnVuY3Rpb24gcG9seWZpbGwkMSgpIHtcbiAgICB2YXIgbG9jYWwgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICBpZiAoUCkge1xuICAgICAgICB2YXIgcHJvbWlzZVRvU3RyaW5nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbC5Qcm9taXNlID0gUHJvbWlzZSQyO1xufVxuXG4vLyBTdHJhbmdlIGNvbXBhdC4uXG5Qcm9taXNlJDIucG9seWZpbGwgPSBwb2x5ZmlsbCQxO1xuUHJvbWlzZSQyLlByb21pc2UgPSBQcm9taXNlJDI7XG5cbnJldHVybiBQcm9taXNlJDI7XG5cbn0pKSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVzNi1wcm9taXNlLm1hcFxuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIEJpbmRpbmcsIENvbmZpZ3VyYXRpb25FcnJvciwgRnVuY3Rpb25SZXNvbHZlciwgSW5zdGFuY2VSZXNvbHZlciwgUmVzb2x1dGlvbkVycm9yLCBTaW5nbGV0b25MaWZlY3ljbGUsIFRyYW5zaWVudExpZmVjeWNsZSwgVHlwZVJlc29sdmVyLCBfLCBhc3NlcnQsIGNoYWluLCBzd2VldGVuLFxuICAgIHNsaWNlID0gW10uc2xpY2U7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBGdW5jdGlvblJlc29sdmVyID0gcmVxdWlyZSgnLi9yZXNvbHZlcnMvRnVuY3Rpb25SZXNvbHZlcicpO1xuXG4gIEluc3RhbmNlUmVzb2x2ZXIgPSByZXF1aXJlKCcuL3Jlc29sdmVycy9JbnN0YW5jZVJlc29sdmVyJyk7XG5cbiAgVHlwZVJlc29sdmVyID0gcmVxdWlyZSgnLi9yZXNvbHZlcnMvVHlwZVJlc29sdmVyJyk7XG5cbiAgU2luZ2xldG9uTGlmZWN5Y2xlID0gcmVxdWlyZSgnLi9saWZlY3ljbGVzL1NpbmdsZXRvbkxpZmVjeWNsZScpO1xuXG4gIFRyYW5zaWVudExpZmVjeWNsZSA9IHJlcXVpcmUoJy4vbGlmZWN5Y2xlcy9UcmFuc2llbnRMaWZlY3ljbGUnKTtcblxuICBDb25maWd1cmF0aW9uRXJyb3IgPSByZXF1aXJlKCcuL2Vycm9ycy9Db25maWd1cmF0aW9uRXJyb3InKTtcblxuICBSZXNvbHV0aW9uRXJyb3IgPSByZXF1aXJlKCcuL2Vycm9ycy9SZXNvbHV0aW9uRXJyb3InKTtcblxuICBzd2VldGVuID0gZnVuY3Rpb24odHlwZSwgcHJvcGVydHkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY2hhaW4gPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIHJlc3VsdDtcbiAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9O1xuXG4gIEJpbmRpbmcgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQmluZGluZyhmb3JnZSwgbmFtZSkge1xuICAgICAgdGhpcy5mb3JnZSA9IGZvcmdlO1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIGFzc2VydCh0aGlzLmZvcmdlICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJmb3JnZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBhc3NlcnQodGhpcy5uYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHRoaXMubGlmZWN5Y2xlID0gbmV3IFNpbmdsZXRvbkxpZmVjeWNsZSgpO1xuICAgICAgdGhpc1tcImFyZ3VtZW50c1wiXSA9IHt9O1xuICAgIH1cblxuICAgIEJpbmRpbmcucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihoaW50KSB7XG4gICAgICBpZiAodGhpcy5wcmVkaWNhdGUgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUoaGludCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKGNvbnRleHQsIGhpbnQsIGFyZ3MpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAoYXJncyA9PSBudWxsKSB7XG4gICAgICAgIGFyZ3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIGFzc2VydChjb250ZXh0LCAnVGhlIGFyZ3VtZW50IFwiY29udGV4dFwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBpZiAodGhpcy5saWZlY3ljbGUgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgQ29uZmlndXJhdGlvbkVycm9yKHRoaXMubmFtZSwgJ05vIGxpZmVjeWNsZSBkZWZpbmVkJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5yZXNvbHZlciA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBDb25maWd1cmF0aW9uRXJyb3IodGhpcy5uYW1lLCAnTm8gcmVzb2x2ZXIgZGVmaW5lZCcpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRleHQuaGFzKHRoaXMpKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXNvbHV0aW9uRXJyb3IodGhpcy5uYW1lLCBoaW50LCBjb250ZXh0LCAnQ2lyY3VsYXIgZGVwZW5kZW5jaWVzIGRldGVjdGVkJyk7XG4gICAgICB9XG4gICAgICBjb250ZXh0LnB1c2godGhpcyk7XG4gICAgICByZXN1bHQgPSB0aGlzLmxpZmVjeWNsZS5yZXNvbHZlKHRoaXMucmVzb2x2ZXIsIGNvbnRleHQsIGFyZ3MpO1xuICAgICAgY29udGV4dC5wb3AoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHN3ZWV0ZW4oQmluZGluZywgJ3RvJyk7XG5cbiAgICBzd2VldGVuKEJpbmRpbmcsICdhcycpO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudHlwZSA9IGNoYWluKGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgYXNzZXJ0KHRhcmdldCAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwidGFyZ2V0XCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVyID0gbmV3IFR5cGVSZXNvbHZlcih0aGlzLmZvcmdlLCB0aGlzLCB0YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGVbXCJmdW5jdGlvblwiXSA9IGNoYWluKGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgYXNzZXJ0KHRhcmdldCAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwidGFyZ2V0XCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVyID0gbmV3IEZ1bmN0aW9uUmVzb2x2ZXIodGhpcy5mb3JnZSwgdGhpcywgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmluc3RhbmNlID0gY2hhaW4oZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBhc3NlcnQodGFyZ2V0ICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJ0YXJnZXRcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZXIgPSBuZXcgSW5zdGFuY2VSZXNvbHZlcih0aGlzLmZvcmdlLCB0aGlzLCB0YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuc2luZ2xldG9uID0gY2hhaW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGUgPSBuZXcgU2luZ2xldG9uTGlmZWN5Y2xlKCk7XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS50cmFuc2llbnQgPSBjaGFpbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpZmVjeWNsZSA9IG5ldyBUcmFuc2llbnRMaWZlY3ljbGUoKTtcbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLndoZW4gPSBjaGFpbihmdW5jdGlvbihjb25kaXRpb24pIHtcbiAgICAgIGFzc2VydChjb25kaXRpb24gIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImNvbmRpdGlvblwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGNvbmRpdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlID0gY29uZGl0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlID0gZnVuY3Rpb24oaGludCkge1xuICAgICAgICAgIHJldHVybiBoaW50ID09PSBjb25kaXRpb247XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZVtcIndpdGhcIl0gPSBjaGFpbihmdW5jdGlvbihhcmdzKSB7XG4gICAgICByZXR1cm4gdGhpc1tcImFyZ3VtZW50c1wiXSA9IGFyZ3M7XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlcHMsIHJlZiwgdG9rZW5zO1xuICAgICAgdG9rZW5zID0gW107XG4gICAgICBpZiAodGhpcy5wcmVkaWNhdGUgIT0gbnVsbCkge1xuICAgICAgICB0b2tlbnMucHVzaCgnKGNvbmRpdGlvbmFsKScpO1xuICAgICAgfVxuICAgICAgdG9rZW5zLnB1c2godGhpcy5uYW1lKTtcbiAgICAgIHRva2Vucy5wdXNoKCctPicpO1xuICAgICAgdG9rZW5zLnB1c2godGhpcy5yZXNvbHZlciAhPSBudWxsID8gdGhpcy5yZXNvbHZlci50b1N0cmluZygpIDogJzx1bmRlZmluZWQgcmVzb2x2ZXI+Jyk7XG4gICAgICB0b2tlbnMucHVzaChcIihcIiArICh0aGlzLmxpZmVjeWNsZS50b1N0cmluZygpKSArIFwiKVwiKTtcbiAgICAgIGlmICgoKHJlZiA9IHRoaXMucmVzb2x2ZXIuZGVwZW5kZW5jaWVzKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgIGRlcHMgPSBfLm1hcCh0aGlzLnJlc29sdmVyLmRlcGVuZGVuY2llcywgZnVuY3Rpb24oZGVwKSB7XG4gICAgICAgICAgaWYgKGRlcC5oaW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXAubmFtZSArIFwiOlwiICsgZGVwLmhpbnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkZXAubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0b2tlbnMucHVzaChcImRlcGVuZHMgb246IFtcIiArIChkZXBzLmpvaW4oJywgJykpICsgXCJdXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2Vucy5qb2luKCcgJyk7XG4gICAgfTtcblxuICAgIHJldHVybiBCaW5kaW5nO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBCaW5kaW5nO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIENvbnRleHQsIF87XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBDb250ZXh0ID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIENvbnRleHQoKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gW107XG4gICAgfVxuXG4gICAgQ29udGV4dC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oYmluZGluZykge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnModGhpcy5iaW5kaW5ncywgYmluZGluZyk7XG4gICAgfTtcblxuICAgIENvbnRleHQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbihiaW5kaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncy5wdXNoKGJpbmRpbmcpO1xuICAgIH07XG5cbiAgICBDb250ZXh0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzLnBvcCgpO1xuICAgIH07XG5cbiAgICBDb250ZXh0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGluZGVudCkge1xuICAgICAgdmFyIGxpbmVzLCBzcGFjZXM7XG4gICAgICBpZiAoaW5kZW50ID09IG51bGwpIHtcbiAgICAgICAgaW5kZW50ID0gNDtcbiAgICAgIH1cbiAgICAgIHNwYWNlcyA9IEFycmF5KGluZGVudCArIDEpLmpvaW4oJyAnKTtcbiAgICAgIGxpbmVzID0gXy5tYXAodGhpcy5iaW5kaW5ncywgZnVuY3Rpb24oYmluZGluZywgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCIgKyBzcGFjZXMgKyAoaW5kZXggKyAxKSArIFwiOiBcIiArIChiaW5kaW5nLnRvU3RyaW5nKCkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGluZXMucmV2ZXJzZSgpLmpvaW4oJ1xcbicpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29udGV4dDtcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gQ29udGV4dDtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBJbnNwZWN0b3IsIF8sIGFzc2VydDtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIEluc3BlY3RvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBJbnNwZWN0b3IodW5tYW5nbGVOYW1lcykge1xuICAgICAgdGhpcy51bm1hbmdsZU5hbWVzID0gdW5tYW5nbGVOYW1lcyAhPSBudWxsID8gdW5tYW5nbGVOYW1lcyA6IGZhbHNlO1xuICAgIH1cblxuICAgIEluc3BlY3Rvci5wcm90b3R5cGUuZ2V0RGVwZW5kZW5jaWVzID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgdmFyIGhpbnRzLCBwYXJhbXM7XG4gICAgICBhc3NlcnQoZnVuYyAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiZnVuY1wiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBwYXJhbXMgPSB0aGlzLmdldFBhcmFtZXRlck5hbWVzKGZ1bmMpO1xuICAgICAgaGludHMgPSB0aGlzLmdldERlcGVuZGVuY3lIaW50cyhmdW5jKTtcbiAgICAgIHJldHVybiBfLm1hcChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHZhciByZWY7XG4gICAgICAgIHJldHVybiAocmVmID0gaGludHNbcGFyYW1dKSAhPSBudWxsID8gcmVmIDoge1xuICAgICAgICAgIG5hbWU6IHBhcmFtLFxuICAgICAgICAgIGFsbDogZmFsc2UsXG4gICAgICAgICAgaGludDogdm9pZCAwXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgSW5zcGVjdG9yLnByb3RvdHlwZS5nZXRQYXJhbWV0ZXJOYW1lcyA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHZhciBhcmdzLCBtYXRjaGVzLCByZWdleDtcbiAgICAgIGFzc2VydChmdW5jICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJmdW5jXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHJlZ2V4ID0gLyg/OmZ1bmN0aW9ufGNvbnN0cnVjdG9yKVsgQS1aYS16MC05XSpcXCgoW14pXSspL2c7XG4gICAgICBtYXRjaGVzID0gcmVnZXguZXhlYyhmdW5jLnRvU3RyaW5nKCkpO1xuICAgICAgaWYgKChtYXRjaGVzID09IG51bGwpIHx8IG1hdGNoZXNbMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIGFyZ3MgPSBtYXRjaGVzWzFdLnNwbGl0KC9bLFxcc10rLyk7XG4gICAgICBpZiAodGhpcy51bm1hbmdsZU5hbWVzKSB7XG4gICAgICAgIHJldHVybiBfLm1hcChhcmdzLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICByZXR1cm4gYXJnLnJlcGxhY2UoL1xcZCskLywgJycpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBJbnNwZWN0b3IucHJvdG90eXBlLmdldERlcGVuZGVuY3lIaW50cyA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHZhciBhbGwsIGFyZ3VtZW50LCBkZXBlbmRlbmN5LCBoaW50LCBoaW50cywgbWF0Y2gsIG5hbWUsIHBhdHRlcm4sIHJlZiwgcmVnZXg7XG4gICAgICBhc3NlcnQoZnVuYyAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiZnVuY1wiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICByZWdleCA9IC9cIiguKj8pXFxzKi0+XFxzKihhbGwpP1xccyooLio/KVwiOy9naTtcbiAgICAgIGhpbnRzID0ge307XG4gICAgICB3aGlsZSAobWF0Y2ggPSByZWdleC5leGVjKGZ1bmMudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgcGF0dGVybiA9IG1hdGNoWzBdLCBhcmd1bWVudCA9IG1hdGNoWzFdLCBhbGwgPSBtYXRjaFsyXSwgZGVwZW5kZW5jeSA9IG1hdGNoWzNdO1xuICAgICAgICBpZiAoYWxsICE9IG51bGwpIHtcbiAgICAgICAgICBhbGwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZXBlbmRlbmN5LmluZGV4T2YoJzonKSkge1xuICAgICAgICAgIHJlZiA9IGRlcGVuZGVuY3kuc3BsaXQoL1xccyo6XFxzKi8sIDIpLCBuYW1lID0gcmVmWzBdLCBoaW50ID0gcmVmWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSBkZXBlbmRlbmN5O1xuICAgICAgICAgIGhpbnQgPSB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgaGludHNbYXJndW1lbnRdID0ge1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgaGludDogaGludFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhpbnRzO1xuICAgIH07XG5cbiAgICBJbnNwZWN0b3IucHJvdG90eXBlLmlzQXV0b0NvbnN0cnVjdG9yID0gZnVuY3Rpb24oY29uc3RydWN0b3IpIHtcbiAgICAgIHZhciBib2R5LCBuYW1lO1xuICAgICAgYXNzZXJ0KGNvbnN0cnVjdG9yICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJjb25zdHJ1Y3RvclwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBuYW1lID0gY29uc3RydWN0b3IubmFtZTtcbiAgICAgIGJvZHkgPSBjb25zdHJ1Y3Rvci50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIGJvZHkuaW5kZXhPZihuYW1lICsgXCIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XCIpID4gMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEluc3BlY3RvcjtcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gSW5zcGVjdG9yO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIENvbmZpZ3VyYXRpb25FcnJvcixcbiAgICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gIENvbmZpZ3VyYXRpb25FcnJvciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gICAgZXh0ZW5kKENvbmZpZ3VyYXRpb25FcnJvciwgc3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBDb25maWd1cmF0aW9uRXJyb3IobmFtZSwgbWVzc2FnZSkge1xuICAgICAgdGhpcy5tZXNzYWdlID0gXCJUaGUgYmluZGluZyBmb3IgY29tcG9uZW50IG5hbWVkIFwiICsgbmFtZSArIFwiIGlzIG1pc2NvbmZpZ3VyZWQ6IFwiICsgbWVzc2FnZTtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGFyZ3VtZW50cy5jYWxsZWUpO1xuICAgIH1cblxuICAgIENvbmZpZ3VyYXRpb25FcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2U7XG4gICAgfTtcblxuICAgIHJldHVybiBDb25maWd1cmF0aW9uRXJyb3I7XG5cbiAgfSkoRXJyb3IpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gQ29uZmlndXJhdGlvbkVycm9yO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIFJlc29sdXRpb25FcnJvciwgdXRpbDtcblxuICB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4gIFJlc29sdXRpb25FcnJvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBSZXNvbHV0aW9uRXJyb3IobmFtZSwgaGludCwgY29udGV4dCwgbWVzc2FnZSkge1xuICAgICAgdGhpcy5uYW1lID0gJ1Jlc29sdXRpb25FcnJvcic7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmdldE1lc3NhZ2UobmFtZSwgaGludCwgY29udGV4dCwgbWVzc2FnZSk7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBhcmd1bWVudHMuY2FsbGVlKTtcbiAgICB9XG5cbiAgICBSZXNvbHV0aW9uRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tZXNzYWdlO1xuICAgIH07XG5cbiAgICBSZXNvbHV0aW9uRXJyb3IucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbihuYW1lLCBoaW50LCBjb250ZXh0LCBtZXNzYWdlKSB7XG4gICAgICB2YXIgbGluZXM7XG4gICAgICBsaW5lcyA9IFtdO1xuICAgICAgbGluZXMucHVzaChcIkNvdWxkIG5vdCByZXNvbHZlIGNvbXBvbmVudCBuYW1lZCBcIiArIG5hbWUgKyBcIjogXCIgKyBtZXNzYWdlKTtcbiAgICAgIGlmIChoaW50ICE9IG51bGwpIHtcbiAgICAgICAgbGluZXMucHVzaCgnICBXaXRoIHJlc29sdXRpb24gaGludDonKTtcbiAgICAgICAgbGluZXMucHVzaChcIiAgICBcIiArICh1dGlsLmluc3BlY3QoaGludCkpKTtcbiAgICAgIH1cbiAgICAgIGxpbmVzLnB1c2goJyAgSW4gcmVzb2x1dGlvbiBjb250ZXh0OicpO1xuICAgICAgbGluZXMucHVzaChjb250ZXh0LnRvU3RyaW5nKCkpO1xuICAgICAgbGluZXMucHVzaCgnICAtLS0nKTtcbiAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlc29sdXRpb25FcnJvcjtcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gUmVzb2x1dGlvbkVycm9yO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIEJpbmRpbmcsIENvbnRleHQsIEZvcmdlLCBJbnNwZWN0b3IsIFJlc29sdXRpb25FcnJvciwgXywgYXNzZXJ0O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgQmluZGluZyA9IHJlcXVpcmUoJy4vQmluZGluZycpO1xuXG4gIENvbnRleHQgPSByZXF1aXJlKCcuL0NvbnRleHQnKTtcblxuICBJbnNwZWN0b3IgPSByZXF1aXJlKCcuL0luc3BlY3RvcicpO1xuXG4gIFJlc29sdXRpb25FcnJvciA9IHJlcXVpcmUoJy4vZXJyb3JzL1Jlc29sdXRpb25FcnJvcicpO1xuXG4gIEZvcmdlID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEZvcmdlKGNvbmZpZykge1xuICAgICAgdmFyIHJlZiwgcmVmMTtcbiAgICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xuICAgICAgICBjb25maWcgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgIHRoaXMudW5tYW5nbGVOYW1lcyA9IChyZWYgPSBjb25maWcudW5tYW5nbGVOYW1lcykgIT0gbnVsbCA/IHJlZiA6IHRydWU7XG4gICAgICB0aGlzLmluc3BlY3RvciA9IChyZWYxID0gY29uZmlnLmluc3BlY3RvcikgIT0gbnVsbCA/IHJlZjEgOiBuZXcgSW5zcGVjdG9yKHRoaXMudW5tYW5nbGVOYW1lcyk7XG4gICAgfVxuXG4gICAgRm9yZ2UucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgYmFzZSwgYmluZGluZztcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGFzc2VydCh0aGlzLnZhbGlkYXRlTmFtZShuYW1lKSwgXCJJbnZhbGlkIGJpbmRpbmcgbmFtZSBcXFwiXCIgKyBuYW1lICsgXCJcXFwiXCIpO1xuICAgICAgYmluZGluZyA9IG5ldyBCaW5kaW5nKHRoaXMsIG5hbWUpO1xuICAgICAgKChiYXNlID0gdGhpcy5iaW5kaW5ncylbbmFtZV0gIT0gbnVsbCA/IGJhc2VbbmFtZV0gOiBiYXNlW25hbWVdID0gW10pLnB1c2goYmluZGluZyk7XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBjb3VudDtcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGNvdW50ID0gdGhpcy5iaW5kaW5nc1tuYW1lXSAhPSBudWxsID8gdGhpcy5iaW5kaW5nc1tuYW1lXS5sZW5ndGggOiAwO1xuICAgICAgdGhpcy5iaW5kaW5nc1tuYW1lXSA9IFtdO1xuICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUucmViaW5kID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgdGhpcy51bmJpbmQobmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kKG5hbWUpO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSwgaGludCwgYXJncykge1xuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZShuYW1lLCBuZXcgQ29udGV4dCgpLCBoaW50LCBmYWxzZSwgYXJncyk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5nZXRPbmUgPSBmdW5jdGlvbihuYW1lLCBoaW50LCBhcmdzKSB7XG4gICAgICB2YXIgYmluZGluZ3MsIGNvbnRleHQ7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgIGJpbmRpbmdzID0gdGhpcy5nZXRNYXRjaGluZ0JpbmRpbmdzKG5hbWUsIGhpbnQpO1xuICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzb2x1dGlvbkVycm9yKG5hbWUsIGhpbnQsIGNvbnRleHQsICdObyBtYXRjaGluZyBiaW5kaW5ncyB3ZXJlIGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzb2x1dGlvbkVycm9yKG5hbWUsIGhpbnQsIGNvbnRleHQsICdNdWx0aXBsZSBtYXRjaGluZyBiaW5kaW5ncyB3ZXJlIGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZUJpbmRpbmdzKGNvbnRleHQsIGJpbmRpbmdzLCBoaW50LCBhcmdzLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKG5hbWUsIGFyZ3MpIHtcbiAgICAgIHZhciBiaW5kaW5ncywgY29udGV4dDtcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzW25hbWVdO1xuICAgICAgaWYgKCEoKGJpbmRpbmdzICE9IG51bGwgPyBiaW5kaW5ncy5sZW5ndGggOiB2b2lkIDApID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc29sdXRpb25FcnJvcihuYW1lLCB2b2lkIDAsIGNvbnRleHQsICdObyBtYXRjaGluZyBiaW5kaW5ncyB3ZXJlIGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZUJpbmRpbmdzKGNvbnRleHQsIGJpbmRpbmdzLCB2b2lkIDAsIGFyZ3MsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKHR5cGUsIGFyZ3MpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBjb250ZXh0O1xuICAgICAgYXNzZXJ0KHR5cGUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInR5cGVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICBiaW5kaW5nID0gbmV3IEJpbmRpbmcodGhpcywgdHlwZS5jb25zdHJ1Y3Rvci5uYW1lKS50eXBlKHR5cGUpO1xuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZUJpbmRpbmdzKGNvbnRleHQsIFtiaW5kaW5nXSwgdm9pZCAwLCBhcmdzLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLmdldE1hdGNoaW5nQmluZGluZ3MgPSBmdW5jdGlvbihuYW1lLCBoaW50KSB7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBpZiAodGhpcy5iaW5kaW5nc1tuYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLmJpbmRpbmdzW25hbWVdLCBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLm1hdGNoZXMoaGludCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihuYW1lLCBjb250ZXh0LCBoaW50LCBhbGwsIGFyZ3MpIHtcbiAgICAgIHZhciBiaW5kaW5ncywgdW53cmFwO1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbGwpIHtcbiAgICAgICAgYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzW25hbWVdO1xuICAgICAgICB1bndyYXAgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbmRpbmdzID0gdGhpcy5nZXRNYXRjaGluZ0JpbmRpbmdzKG5hbWUsIGhpbnQpO1xuICAgICAgICB1bndyYXAgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKChiaW5kaW5ncyAhPSBudWxsID8gYmluZGluZ3MubGVuZ3RoIDogdm9pZCAwKSA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzb2x1dGlvbkVycm9yKG5hbWUsIGhpbnQsIGNvbnRleHQsICdObyBtYXRjaGluZyBiaW5kaW5ncyB3ZXJlIGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZUJpbmRpbmdzKGNvbnRleHQsIGJpbmRpbmdzLCBoaW50LCBhcmdzLCB1bndyYXApO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUucmVzb2x2ZUJpbmRpbmdzID0gZnVuY3Rpb24oY29udGV4dCwgYmluZGluZ3MsIGhpbnQsIGFyZ3MsIHVud3JhcCkge1xuICAgICAgdmFyIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gXy5tYXAoYmluZGluZ3MsIGZ1bmN0aW9uKGJpbmRpbmcpIHtcbiAgICAgICAgcmV0dXJuIGJpbmRpbmcucmVzb2x2ZShjb250ZXh0LCBoaW50LCBhcmdzKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHVud3JhcCAmJiByZXN1bHRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmdzO1xuICAgICAgYmluZGluZ3MgPSBfLmZsYXR0ZW4oXy52YWx1ZXModGhpcy5iaW5kaW5ncykpO1xuICAgICAgcmV0dXJuIF8uaW52b2tlKGJpbmRpbmdzLCAndG9TdHJpbmcnKS5qb2luKCdcXG4nKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLnZhbGlkYXRlTmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIGlmICh0aGlzLnVubWFuZ2xlTmFtZXMpIHtcbiAgICAgICAgcmV0dXJuIC9bXlxcZF0kLy50ZXN0KG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBGb3JnZTtcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gRm9yZ2U7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgTGlmZWN5Y2xlO1xuXG4gIExpZmVjeWNsZSA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBMaWZlY3ljbGUoKSB7fVxuXG4gICAgTGlmZWN5Y2xlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVzb2x2ZXIsIGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGltcGxlbWVudCByZXNvbHZlKCkgb24gXCIgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gTGlmZWN5Y2xlO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBMaWZlY3ljbGU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgTGlmZWN5Y2xlLCBTaW5nbGV0b25MaWZlY3ljbGUsIGFzc2VydCxcbiAgICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIExpZmVjeWNsZSA9IHJlcXVpcmUoJy4vTGlmZWN5Y2xlJyk7XG5cbiAgU2luZ2xldG9uTGlmZWN5Y2xlID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgICBleHRlbmQoU2luZ2xldG9uTGlmZWN5Y2xlLCBzdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIFNpbmdsZXRvbkxpZmVjeWNsZSgpIHtcbiAgICAgIHJldHVybiBTaW5nbGV0b25MaWZlY3ljbGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgU2luZ2xldG9uTGlmZWN5Y2xlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVzb2x2ZXIsIGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIGFzc2VydChyZXNvbHZlciAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwicmVzb2x2ZXJcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgYXNzZXJ0KGNvbnRleHQgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImNvbnRleHRcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgaWYgKHRoaXMuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gcmVzb2x2ZXIucmVzb2x2ZShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH07XG5cbiAgICBTaW5nbGV0b25MaWZlY3ljbGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ3NpbmdsZXRvbic7XG4gICAgfTtcblxuICAgIHJldHVybiBTaW5nbGV0b25MaWZlY3ljbGU7XG5cbiAgfSkoTGlmZWN5Y2xlKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFNpbmdsZXRvbkxpZmVjeWNsZTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBMaWZlY3ljbGUsIFRyYW5zaWVudExpZmVjeWNsZSwgYXNzZXJ0LFxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgTGlmZWN5Y2xlID0gcmVxdWlyZSgnLi9MaWZlY3ljbGUnKTtcblxuICBUcmFuc2llbnRMaWZlY3ljbGUgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgIGV4dGVuZChUcmFuc2llbnRMaWZlY3ljbGUsIHN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gVHJhbnNpZW50TGlmZWN5Y2xlKCkge1xuICAgICAgcmV0dXJuIFRyYW5zaWVudExpZmVjeWNsZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBUcmFuc2llbnRMaWZlY3ljbGUucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZXNvbHZlciwgY29udGV4dCwgYXJncykge1xuICAgICAgYXNzZXJ0KHJlc29sdmVyICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJyZXNvbHZlclwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBhc3NlcnQoY29udGV4dCAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiY29udGV4dFwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICByZXR1cm4gcmVzb2x2ZXIucmVzb2x2ZShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgVHJhbnNpZW50TGlmZWN5Y2xlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICd0cmFuc2llbnQnO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHJhbnNpZW50TGlmZWN5Y2xlO1xuXG4gIH0pKExpZmVjeWNsZSk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBUcmFuc2llbnRMaWZlY3ljbGU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgRnVuY3Rpb25SZXNvbHZlciwgUmVzb2x2ZXIsIF8sIGFzc2VydCxcbiAgICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgUmVzb2x2ZXIgPSByZXF1aXJlKCcuL1Jlc29sdmVyJyk7XG5cbiAgRnVuY3Rpb25SZXNvbHZlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gICAgZXh0ZW5kKEZ1bmN0aW9uUmVzb2x2ZXIsIHN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gRnVuY3Rpb25SZXNvbHZlcihmb3JnZSwgYmluZGluZywgZnVuYykge1xuICAgICAgdGhpcy5mdW5jID0gZnVuYztcbiAgICAgIEZ1bmN0aW9uUmVzb2x2ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZm9yZ2UsIGJpbmRpbmcpO1xuICAgICAgYXNzZXJ0KHRoaXMuZnVuYyAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiZnVuY1wiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHRoaXMuZm9yZ2UuaW5zcGVjdG9yLmdldERlcGVuZGVuY2llcyh0aGlzLmZ1bmMpO1xuICAgIH1cblxuICAgIEZ1bmN0aW9uUmVzb2x2ZXIucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICBhcmdzID0gdGhpcy5yZXNvbHZlRGVwZW5kZW5jaWVzKGNvbnRleHQsIHRoaXMuZGVwZW5kZW5jaWVzLCBhcmdzKTtcbiAgICAgIHJldHVybiB0aGlzLmZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfTtcblxuICAgIEZ1bmN0aW9uUmVzb2x2ZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICB9O1xuXG4gICAgcmV0dXJuIEZ1bmN0aW9uUmVzb2x2ZXI7XG5cbiAgfSkoUmVzb2x2ZXIpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb25SZXNvbHZlcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBJbnN0YW5jZVJlc29sdmVyLCBSZXNvbHZlciwgXywgYXNzZXJ0LFxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBSZXNvbHZlciA9IHJlcXVpcmUoJy4vUmVzb2x2ZXInKTtcblxuICBJbnN0YW5jZVJlc29sdmVyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgICBleHRlbmQoSW5zdGFuY2VSZXNvbHZlciwgc3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBJbnN0YW5jZVJlc29sdmVyKGZvcmdlLCBiaW5kaW5nLCBpbnN0YW5jZSkge1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgICAgSW5zdGFuY2VSZXNvbHZlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBmb3JnZSwgYmluZGluZyk7XG4gICAgICBhc3NlcnQodGhpcy5pbnN0YW5jZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiaW5zdGFuY2VcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICB9XG5cbiAgICBJbnN0YW5jZVJlc29sdmVyLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfTtcblxuICAgIEluc3RhbmNlUmVzb2x2ZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKHRoaXMuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJzx1bmtub3duIGluc3RhbmNlPic7XG4gICAgICB9IGVsc2UgaWYgKCgocmVmID0gdGhpcy5pbnN0YW5jZS5jb25zdHJ1Y3RvcikgIT0gbnVsbCA/IHJlZi5uYW1lIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcImFuIGluc3RhbmNlIG9mIFwiICsgdGhpcy5pbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiYW4gaW5zdGFuY2Ugb2YgXCIgKyAodHlwZW9mIHRoaXMuaW5zdGFuY2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gSW5zdGFuY2VSZXNvbHZlcjtcblxuICB9KShSZXNvbHZlcik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBJbnN0YW5jZVJlc29sdmVyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIFJlc29sdmVyLCBfLCBhc3NlcnQ7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBSZXNvbHZlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBSZXNvbHZlcihmb3JnZSwgYmluZGluZykge1xuICAgICAgdGhpcy5mb3JnZSA9IGZvcmdlO1xuICAgICAgdGhpcy5iaW5kaW5nID0gYmluZGluZztcbiAgICAgIGFzc2VydCh0aGlzLmZvcmdlICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJmb3JnZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBhc3NlcnQodGhpcy5iaW5kaW5nICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJiaW5kaW5nXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICB9XG5cbiAgICBSZXNvbHZlci5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGltcGxlbWVudCByZXNvbHZlKCkgb24gXCIgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgIH07XG5cbiAgICBSZXNvbHZlci5wcm90b3R5cGUucmVzb2x2ZURlcGVuZGVuY2llcyA9IGZ1bmN0aW9uKGNvbnRleHQsIGRlcGVuZGVuY2llcywgYXJncykge1xuICAgICAgcmV0dXJuIF8ubWFwKGRlcGVuZGVuY2llcywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkZXApIHtcbiAgICAgICAgICB2YXIgb3ZlcnJpZGUsIHJlZjtcbiAgICAgICAgICBpZiAoZGVwLm5hbWUgPT09ICdmb3JnZScpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5mb3JnZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3ZlcnJpZGUgPSAocmVmID0gYXJnc1tkZXAubmFtZV0pICE9IG51bGwgPyByZWYgOiBfdGhpcy5iaW5kaW5nW1wiYXJndW1lbnRzXCJdW2RlcC5uYW1lXTtcbiAgICAgICAgICByZXR1cm4gb3ZlcnJpZGUgIT0gbnVsbCA/IG92ZXJyaWRlIDogX3RoaXMuZm9yZ2UucmVzb2x2ZShkZXAubmFtZSwgY29udGV4dCwgZGVwLmhpbnQsIGRlcC5hbGwpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUmVzb2x2ZXI7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFJlc29sdmVyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIFJlc29sdmVyLCBUeXBlUmVzb2x2ZXIsIF8sIGFzc2VydCxcbiAgICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgUmVzb2x2ZXIgPSByZXF1aXJlKCcuL1Jlc29sdmVyJyk7XG5cbiAgVHlwZVJlc29sdmVyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgICBleHRlbmQoVHlwZVJlc29sdmVyLCBzdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIFR5cGVSZXNvbHZlcihmb3JnZSwgYmluZGluZywgdHlwZTEpIHtcbiAgICAgIHZhciBjb25zdHJ1Y3RvcjtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGUxO1xuICAgICAgVHlwZVJlc29sdmVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIGZvcmdlLCBiaW5kaW5nKTtcbiAgICAgIGFzc2VydCh0aGlzLnR5cGUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInR5cGVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgY29uc3RydWN0b3IgPSB0aGlzLmZpbmRDb25zdHJ1Y3RvclRvSW5zcGVjdCh0aGlzLnR5cGUpO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZvcmdlLmluc3BlY3Rvci5nZXREZXBlbmRlbmNpZXMoY29uc3RydWN0b3IpO1xuICAgIH1cblxuICAgIFR5cGVSZXNvbHZlci5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHZhciBjdG9yO1xuICAgICAgYXJncyA9IHRoaXMucmVzb2x2ZURlcGVuZGVuY2llcyhjb250ZXh0LCB0aGlzLmRlcGVuZGVuY2llcywgYXJncyk7XG4gICAgICBjdG9yID0gdGhpcy50eXBlLmJpbmQuYXBwbHkodGhpcy50eXBlLCBbbnVsbF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIHJldHVybiBuZXcgY3RvcigpO1xuICAgIH07XG5cbiAgICBUeXBlUmVzb2x2ZXIucHJvdG90eXBlLmZpbmRDb25zdHJ1Y3RvclRvSW5zcGVjdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIHZhciBjb25zdHJ1Y3RvcjtcbiAgICAgIGNvbnN0cnVjdG9yID0gdHlwZTtcbiAgICAgIHdoaWxlICh0aGlzLmZvcmdlLmluc3BlY3Rvci5pc0F1dG9Db25zdHJ1Y3Rvcihjb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgY29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvci5fX3N1cGVyX18uY29uc3RydWN0b3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc3RydWN0b3I7XG4gICAgfTtcblxuICAgIFR5cGVSZXNvbHZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBcInR5cGV7XCIgKyB0aGlzLnR5cGUubmFtZSArIFwifVwiO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHlwZVJlc29sdmVyO1xuXG4gIH0pKFJlc29sdmVyKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFR5cGVSZXNvbHZlcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8qIVxyXG4gKiBLbm9ja291dCBKYXZhU2NyaXB0IGxpYnJhcnkgdjMuNC4yXHJcbiAqIChjKSBUaGUgS25vY2tvdXQuanMgdGVhbSAtIGh0dHA6Ly9rbm9ja291dGpzLmNvbS9cclxuICogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcclxuICovXHJcblxyXG4oZnVuY3Rpb24oKSB7KGZ1bmN0aW9uKG4pe3ZhciB4PXRoaXN8fCgwLGV2YWwpKFwidGhpc1wiKSx0PXguZG9jdW1lbnQsTT14Lm5hdmlnYXRvcix1PXgualF1ZXJ5LEg9eC5KU09OOyhmdW5jdGlvbihuKXtcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCIsXCJyZXF1aXJlXCJdLG4pOlwib2JqZWN0XCI9PT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bihtb2R1bGUuZXhwb3J0c3x8ZXhwb3J0cyk6bih4LmtvPXt9KX0pKGZ1bmN0aW9uKE4sTyl7ZnVuY3Rpb24gSihhLGMpe3JldHVybiBudWxsPT09YXx8dHlwZW9mIGEgaW4gUj9hPT09YzohMX1mdW5jdGlvbiBTKGIsYyl7dmFyIGQ7cmV0dXJuIGZ1bmN0aW9uKCl7ZHx8KGQ9YS5hLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtkPW47YigpfSxjKSl9fWZ1bmN0aW9uIFQoYixjKXt2YXIgZDtyZXR1cm4gZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoZCk7ZD1hLmEuc2V0VGltZW91dChiLGMpfX1mdW5jdGlvbiBVKGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyl7YyYmYyE9PUU/XCJiZWZvcmVDaGFuZ2VcIj09PWM/dGhpcy5PYihhKTp0aGlzLkphKGEsYyk6dGhpcy5QYihhKX1mdW5jdGlvbiBWKGEsYyl7bnVsbCE9PWMmJmMuayYmYy5rKCl9ZnVuY3Rpb24gVyhhLGMpe3ZhciBkPXRoaXMuTWMsZT1kW3NdO2UuVHx8KHRoaXMub2ImJnRoaXMuT2FbY10/KGQuU2IoYyxhLHRoaXMuT2FbY10pLHRoaXMuT2FbY109bnVsbCwtLXRoaXMub2IpOmUuc1tjXXx8ZC5TYihjLGEsZS50P3skOmF9OmQueWMoYSkpLGEuSGEmJmEuSGMoKSl9ZnVuY3Rpb24gSyhiLGMsZCxlKXthLmRbYl09e2luaXQ6ZnVuY3Rpb24oYixnLGgsbCxtKXt2YXIgayxyO2EubShmdW5jdGlvbigpe3ZhciBxPWcoKSxwPWEuYS5jKHEpLHA9IWQhPT0hcCxBPSFyO2lmKEF8fGN8fHAhPT1rKUEmJmEueGEuQ2EoKSYmKHI9YS5hLndhKGEuZi5jaGlsZE5vZGVzKGIpLCEwKSkscD8oQXx8YS5mLmZhKGIsYS5hLndhKHIpKSxhLmhiKGU/ZShtLHEpOm0sYikpOmEuZi56YShiKSxrPXB9LG51bGwsXHJcbiAgICB7aTpifSk7cmV0dXJue2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiEwfX19O2EuaC52YVtiXT0hMTthLmYuYWFbYl09ITB9dmFyIGE9XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBOP046e307YS5iPWZ1bmN0aW9uKGIsYyl7Zm9yKHZhciBkPWIuc3BsaXQoXCIuXCIpLGU9YSxmPTA7ZjxkLmxlbmd0aC0xO2YrKyllPWVbZFtmXV07ZVtkW2QubGVuZ3RoLTFdXT1jfTthLkg9ZnVuY3Rpb24oYSxjLGQpe2FbY109ZH07YS52ZXJzaW9uPVwiMy40LjJcIjthLmIoXCJ2ZXJzaW9uXCIsYS52ZXJzaW9uKTthLm9wdGlvbnM9e2RlZmVyVXBkYXRlczohMSx1c2VPbmx5TmF0aXZlRXZlbnRzOiExfTthLmE9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEsYil7Zm9yKHZhciBjIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShjKSYmYihjLGFbY10pfWZ1bmN0aW9uIGMoYSxiKXtpZihiKWZvcih2YXIgYyBpbiBiKWIuaGFzT3duUHJvcGVydHkoYykmJihhW2NdPWJbY10pO3JldHVybiBhfWZ1bmN0aW9uIGQoYSxiKXthLl9fcHJvdG9fXz1cclxuICAgIGI7cmV0dXJuIGF9ZnVuY3Rpb24gZShiLGMsZCxlKXt2YXIgbT1iW2NdLm1hdGNoKHIpfHxbXTthLmEucihkLm1hdGNoKHIpLGZ1bmN0aW9uKGIpe2EuYS5yYShtLGIsZSl9KTtiW2NdPW0uam9pbihcIiBcIil9dmFyIGY9e19fcHJvdG9fXzpbXX1pbnN0YW5jZW9mIEFycmF5LGc9XCJmdW5jdGlvblwiPT09dHlwZW9mIFN5bWJvbCxoPXt9LGw9e307aFtNJiYvRmlyZWZveFxcLzIvaS50ZXN0KE0udXNlckFnZW50KT9cIktleWJvYXJkRXZlbnRcIjpcIlVJRXZlbnRzXCJdPVtcImtleXVwXCIsXCJrZXlkb3duXCIsXCJrZXlwcmVzc1wiXTtoLk1vdXNlRXZlbnRzPVwiY2xpY2sgZGJsY2xpY2sgbW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmVcIi5zcGxpdChcIiBcIik7YihoLGZ1bmN0aW9uKGEsYil7aWYoYi5sZW5ndGgpZm9yKHZhciBjPTAsZD1iLmxlbmd0aDtjPGQ7YysrKWxbYltjXV09YX0pO3ZhciBtPXtwcm9wZXJ0eWNoYW5nZTohMH0saz1cclxuICAgIHQmJmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTMsYj10LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksYz1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaVwiKTtiLmlubmVySFRNTD1cIlxceDNjIS0tW2lmIGd0IElFIFwiKyArK2ErXCJdPjxpPjwvaT48IVtlbmRpZl0tLVxceDNlXCIsY1swXTspO3JldHVybiA0PGE/YTpufSgpLHI9L1xcUysvZztyZXR1cm57Z2M6W1wiYXV0aGVudGljaXR5X3Rva2VuXCIsL15fX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbihfLiopPyQvXSxyOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTAsZD1hLmxlbmd0aDtjPGQ7YysrKWIoYVtjXSxjKX0sbzpmdW5jdGlvbihhLGIpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mKXJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGEsYik7Zm9yKHZhciBjPTAsZD1hLmxlbmd0aDtjPGQ7YysrKWlmKGFbY109PT1iKXJldHVybiBjO3JldHVybi0xfSxWYjpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLGU9YS5sZW5ndGg7ZDxlO2QrKylpZihiLmNhbGwoYyxhW2RdLGQpKXJldHVybiBhW2RdO3JldHVybiBudWxsfSxOYTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5vKGIsYyk7MDxkP2Iuc3BsaWNlKGQsMSk6MD09PWQmJmIuc2hpZnQoKX0sV2I6ZnVuY3Rpb24oYil7Yj1ifHxbXTtmb3IodmFyIGM9W10sZD0wLGU9Yi5sZW5ndGg7ZDxlO2QrKykwPmEuYS5vKGMsYltkXSkmJmMucHVzaChiW2RdKTtyZXR1cm4gY30saWI6ZnVuY3Rpb24oYSxiKXthPWF8fFtdO2Zvcih2YXIgYz1bXSxkPTAsZT1hLmxlbmd0aDtkPGU7ZCsrKWMucHVzaChiKGFbZF0sZCkpO3JldHVybiBjfSxNYTpmdW5jdGlvbihhLGIpe2E9YXx8W107Zm9yKHZhciBjPVtdLGQ9MCxlPWEubGVuZ3RoO2Q8ZTtkKyspYihhW2RdLGQpJiZjLnB1c2goYVtkXSk7cmV0dXJuIGN9LHRhOmZ1bmN0aW9uKGEsYil7aWYoYiBpbnN0YW5jZW9mIEFycmF5KWEucHVzaC5hcHBseShhLGIpO2Vsc2UgZm9yKHZhciBjPTAsZD1iLmxlbmd0aDtjPFxyXG5kO2MrKylhLnB1c2goYltjXSk7cmV0dXJuIGF9LHJhOmZ1bmN0aW9uKGIsYyxkKXt2YXIgZT1hLmEubyhhLmEuQmIoYiksYyk7MD5lP2QmJmIucHVzaChjKTpkfHxiLnNwbGljZShlLDEpfSxsYTpmLGV4dGVuZDpjLCRhOmQsYWI6Zj9kOmMsRDpiLEVhOmZ1bmN0aW9uKGEsYil7aWYoIWEpcmV0dXJuIGE7dmFyIGM9e30sZDtmb3IoZCBpbiBhKWEuaGFzT3duUHJvcGVydHkoZCkmJihjW2RdPWIoYVtkXSxkLGEpKTtyZXR1cm4gY30scmI6ZnVuY3Rpb24oYil7Zm9yKDtiLmZpcnN0Q2hpbGQ7KWEucmVtb3ZlTm9kZShiLmZpcnN0Q2hpbGQpfSxuYzpmdW5jdGlvbihiKXtiPWEuYS5XKGIpO2Zvcih2YXIgYz0oYlswXSYmYlswXS5vd25lckRvY3VtZW50fHx0KS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGQ9MCxlPWIubGVuZ3RoO2Q8ZTtkKyspYy5hcHBlbmRDaGlsZChhLmJhKGJbZF0pKTtyZXR1cm4gY30sd2E6ZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9MCxlPWIubGVuZ3RoLG09W107ZDxlO2QrKyl7dmFyIGs9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiW2RdLmNsb25lTm9kZSghMCk7bS5wdXNoKGM/YS5iYShrKTprKX1yZXR1cm4gbX0sZmE6ZnVuY3Rpb24oYixjKXthLmEucmIoYik7aWYoYylmb3IodmFyIGQ9MCxlPWMubGVuZ3RoO2Q8ZTtkKyspYi5hcHBlbmRDaGlsZChjW2RdKX0sdWM6ZnVuY3Rpb24oYixjKXt2YXIgZD1iLm5vZGVUeXBlP1tiXTpiO2lmKDA8ZC5sZW5ndGgpe2Zvcih2YXIgZT1kWzBdLG09ZS5wYXJlbnROb2RlLGs9MCxmPWMubGVuZ3RoO2s8ZjtrKyspbS5pbnNlcnRCZWZvcmUoY1trXSxlKTtrPTA7Zm9yKGY9ZC5sZW5ndGg7azxmO2srKylhLnJlbW92ZU5vZGUoZFtrXSl9fSxCYTpmdW5jdGlvbihhLGIpe2lmKGEubGVuZ3RoKXtmb3IoYj04PT09Yi5ub2RlVHlwZSYmYi5wYXJlbnROb2RlfHxiO2EubGVuZ3RoJiZhWzBdLnBhcmVudE5vZGUhPT1iOylhLnNwbGljZSgwLDEpO2Zvcig7MTxhLmxlbmd0aCYmYVthLmxlbmd0aC0xXS5wYXJlbnROb2RlIT09YjspYS5sZW5ndGgtLTtpZigxPGEubGVuZ3RoKXt2YXIgYz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYVswXSxkPWFbYS5sZW5ndGgtMV07Zm9yKGEubGVuZ3RoPTA7YyE9PWQ7KWEucHVzaChjKSxjPWMubmV4dFNpYmxpbmc7YS5wdXNoKGQpfX1yZXR1cm4gYX0sd2M6ZnVuY3Rpb24oYSxiKXs3Pms/YS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLGIpOmEuc2VsZWN0ZWQ9Yn0sY2I6ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PT1hfHxhPT09bj9cIlwiOmEudHJpbT9hLnRyaW0oKTphLnRvU3RyaW5nKCkucmVwbGFjZSgvXltcXHNcXHhhMF0rfFtcXHNcXHhhMF0rJC9nLFwiXCIpfSxzZDpmdW5jdGlvbihhLGIpe2E9YXx8XCJcIjtyZXR1cm4gYi5sZW5ndGg+YS5sZW5ndGg/ITE6YS5zdWJzdHJpbmcoMCxiLmxlbmd0aCk9PT1ifSxSYzpmdW5jdGlvbihhLGIpe2lmKGE9PT1iKXJldHVybiEwO2lmKDExPT09YS5ub2RlVHlwZSlyZXR1cm4hMTtpZihiLmNvbnRhaW5zKXJldHVybiBiLmNvbnRhaW5zKDM9PT1hLm5vZGVUeXBlP2EucGFyZW50Tm9kZTphKTtpZihiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKXJldHVybiAxNj09XHJcbiAgICAoYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihhKSYxNik7Zm9yKDthJiZhIT1iOylhPWEucGFyZW50Tm9kZTtyZXR1cm4hIWF9LHFiOmZ1bmN0aW9uKGIpe3JldHVybiBhLmEuUmMoYixiLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KX0sVGI6ZnVuY3Rpb24oYil7cmV0dXJuISFhLmEuVmIoYixhLmEucWIpfSxBOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZhLnRhZ05hbWUmJmEudGFnTmFtZS50b0xvd2VyQ2FzZSgpfSxaYjpmdW5jdGlvbihiKXtyZXR1cm4gYS5vbkVycm9yP2Z1bmN0aW9uKCl7dHJ5e3JldHVybiBiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1jYXRjaChjKXt0aHJvdyBhLm9uRXJyb3ImJmEub25FcnJvcihjKSxjO319OmJ9LHNldFRpbWVvdXQ6ZnVuY3Rpb24oYixjKXtyZXR1cm4gc2V0VGltZW91dChhLmEuWmIoYiksYyl9LGRjOmZ1bmN0aW9uKGIpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXthLm9uRXJyb3ImJmEub25FcnJvcihiKTt0aHJvdyBiO30sMCl9LHE6ZnVuY3Rpb24oYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLGQpe3ZhciBlPWEuYS5aYihkKTtkPWsmJm1bY107aWYoYS5vcHRpb25zLnVzZU9ubHlOYXRpdmVFdmVudHN8fGR8fCF1KWlmKGR8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGIuYWRkRXZlbnRMaXN0ZW5lcilpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgYi5hdHRhY2hFdmVudCl7dmFyIGY9ZnVuY3Rpb24oYSl7ZS5jYWxsKGIsYSl9LGw9XCJvblwiK2M7Yi5hdHRhY2hFdmVudChsLGYpO2EuYS5HLnFhKGIsZnVuY3Rpb24oKXtiLmRldGFjaEV2ZW50KGwsZil9KX1lbHNlIHRocm93IEVycm9yKFwiQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lciBvciBhdHRhY2hFdmVudFwiKTtlbHNlIGIuYWRkRXZlbnRMaXN0ZW5lcihjLGUsITEpO2Vsc2UgdShiKS5iaW5kKGMsZSl9LEZhOmZ1bmN0aW9uKGIsYyl7aWYoIWJ8fCFiLm5vZGVUeXBlKXRocm93IEVycm9yKFwiZWxlbWVudCBtdXN0IGJlIGEgRE9NIG5vZGUgd2hlbiBjYWxsaW5nIHRyaWdnZXJFdmVudFwiKTt2YXIgZDtcImlucHV0XCI9PT1cclxuYS5hLkEoYikmJmIudHlwZSYmXCJjbGlja1wiPT1jLnRvTG93ZXJDYXNlKCk/KGQ9Yi50eXBlLGQ9XCJjaGVja2JveFwiPT1kfHxcInJhZGlvXCI9PWQpOmQ9ITE7aWYoYS5vcHRpb25zLnVzZU9ubHlOYXRpdmVFdmVudHN8fCF1fHxkKWlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQuY3JlYXRlRXZlbnQpaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYi5kaXNwYXRjaEV2ZW50KWQ9dC5jcmVhdGVFdmVudChsW2NdfHxcIkhUTUxFdmVudHNcIiksZC5pbml0RXZlbnQoYywhMCwhMCx4LDAsMCwwLDAsMCwhMSwhMSwhMSwhMSwwLGIpLGIuZGlzcGF0Y2hFdmVudChkKTtlbHNlIHRocm93IEVycm9yKFwiVGhlIHN1cHBsaWVkIGVsZW1lbnQgZG9lc24ndCBzdXBwb3J0IGRpc3BhdGNoRXZlbnRcIik7ZWxzZSBpZihkJiZiLmNsaWNrKWIuY2xpY2soKTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBiLmZpcmVFdmVudCliLmZpcmVFdmVudChcIm9uXCIrYyk7ZWxzZSB0aHJvdyBFcnJvcihcIkJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHRyaWdnZXJpbmcgZXZlbnRzXCIpO1xyXG5lbHNlIHUoYikudHJpZ2dlcihjKX0sYzpmdW5jdGlvbihiKXtyZXR1cm4gYS5JKGIpP2IoKTpifSxCYjpmdW5jdGlvbihiKXtyZXR1cm4gYS5JKGIpP2IucCgpOmJ9LGZiOmZ1bmN0aW9uKGIsYyxkKXt2YXIgaztjJiYoXCJvYmplY3RcIj09PXR5cGVvZiBiLmNsYXNzTGlzdD8oaz1iLmNsYXNzTGlzdFtkP1wiYWRkXCI6XCJyZW1vdmVcIl0sYS5hLnIoYy5tYXRjaChyKSxmdW5jdGlvbihhKXtrLmNhbGwoYi5jbGFzc0xpc3QsYSl9KSk6XCJzdHJpbmdcIj09PXR5cGVvZiBiLmNsYXNzTmFtZS5iYXNlVmFsP2UoYi5jbGFzc05hbWUsXCJiYXNlVmFsXCIsYyxkKTplKGIsXCJjbGFzc05hbWVcIixjLGQpKX0sYmI6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKTtpZihudWxsPT09ZHx8ZD09PW4pZD1cIlwiO3ZhciBlPWEuZi5maXJzdENoaWxkKGIpOyFlfHwzIT1lLm5vZGVUeXBlfHxhLmYubmV4dFNpYmxpbmcoZSk/YS5mLmZhKGIsW2Iub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkKV0pOmUuZGF0YT1cclxuICAgIGQ7YS5hLldjKGIpfSx2YzpmdW5jdGlvbihhLGIpe2EubmFtZT1iO2lmKDc+PWspdHJ5e2EubWVyZ2VBdHRyaWJ1dGVzKHQuY3JlYXRlRWxlbWVudChcIjxpbnB1dCBuYW1lPSdcIithLm5hbWUrXCInLz5cIiksITEpfWNhdGNoKGMpe319LFdjOmZ1bmN0aW9uKGEpezk8PWsmJihhPTE9PWEubm9kZVR5cGU/YTphLnBhcmVudE5vZGUsYS5zdHlsZSYmKGEuc3R5bGUuem9vbT1hLnN0eWxlLnpvb20pKX0sU2M6ZnVuY3Rpb24oYSl7aWYoayl7dmFyIGI9YS5zdHlsZS53aWR0aDthLnN0eWxlLndpZHRoPTA7YS5zdHlsZS53aWR0aD1ifX0sbmQ6ZnVuY3Rpb24oYixjKXtiPWEuYS5jKGIpO2M9YS5hLmMoYyk7Zm9yKHZhciBkPVtdLGU9YjtlPD1jO2UrKylkLnB1c2goZSk7cmV0dXJuIGR9LFc6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVtdLGM9MCxkPWEubGVuZ3RoO2M8ZDtjKyspYi5wdXNoKGFbY10pO3JldHVybiBifSxiYzpmdW5jdGlvbihhKXtyZXR1cm4gZz9TeW1ib2woYSk6YX0seGQ6Nj09PWssXHJcbiAgICB5ZDo3PT09ayxDOmssaWM6ZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9YS5hLlcoYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpKS5jb25jYXQoYS5hLlcoYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpKSksZT1cInN0cmluZ1wiPT10eXBlb2YgYz9mdW5jdGlvbihhKXtyZXR1cm4gYS5uYW1lPT09Y306ZnVuY3Rpb24oYSl7cmV0dXJuIGMudGVzdChhLm5hbWUpfSxrPVtdLG09ZC5sZW5ndGgtMTswPD1tO20tLSllKGRbbV0pJiZrLnB1c2goZFttXSk7cmV0dXJuIGt9LGtkOmZ1bmN0aW9uKGIpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBiJiYoYj1hLmEuY2IoYikpP0gmJkgucGFyc2U/SC5wYXJzZShiKToobmV3IEZ1bmN0aW9uKFwicmV0dXJuIFwiK2IpKSgpOm51bGx9LEdiOmZ1bmN0aW9uKGIsYyxkKXtpZighSHx8IUguc3RyaW5naWZ5KXRocm93IEVycm9yKFwiQ2Fubm90IGZpbmQgSlNPTi5zdHJpbmdpZnkoKS4gU29tZSBicm93c2VycyAoZS5nLiwgSUUgPCA4KSBkb24ndCBzdXBwb3J0IGl0IG5hdGl2ZWx5LCBidXQgeW91IGNhbiBvdmVyY29tZSB0aGlzIGJ5IGFkZGluZyBhIHNjcmlwdCByZWZlcmVuY2UgdG8ganNvbjIuanMsIGRvd25sb2FkYWJsZSBmcm9tIGh0dHA6Ly93d3cuanNvbi5vcmcvanNvbjIuanNcIik7XHJcbiAgICAgICAgcmV0dXJuIEguc3RyaW5naWZ5KGEuYS5jKGIpLGMsZCl9LGxkOmZ1bmN0aW9uKGMsZCxlKXtlPWV8fHt9O3ZhciBrPWUucGFyYW1zfHx7fSxtPWUuaW5jbHVkZUZpZWxkc3x8dGhpcy5nYyxmPWM7aWYoXCJvYmplY3RcIj09dHlwZW9mIGMmJlwiZm9ybVwiPT09YS5hLkEoYykpZm9yKHZhciBmPWMuYWN0aW9uLGw9bS5sZW5ndGgtMTswPD1sO2wtLSlmb3IodmFyIGc9YS5hLmljKGMsbVtsXSksaD1nLmxlbmd0aC0xOzA8PWg7aC0tKWtbZ1toXS5uYW1lXT1nW2hdLnZhbHVlO2Q9YS5hLmMoZCk7dmFyIHI9dC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtyLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7ci5hY3Rpb249ZjtyLm1ldGhvZD1cInBvc3RcIjtmb3IodmFyIG4gaW4gZCljPXQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLGMudHlwZT1cImhpZGRlblwiLGMubmFtZT1uLGMudmFsdWU9YS5hLkdiKGEuYS5jKGRbbl0pKSxyLmFwcGVuZENoaWxkKGMpO2IoayxmdW5jdGlvbihhLGIpe3ZhciBjPXQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGMudHlwZT1cImhpZGRlblwiO2MubmFtZT1hO2MudmFsdWU9YjtyLmFwcGVuZENoaWxkKGMpfSk7dC5ib2R5LmFwcGVuZENoaWxkKHIpO2Uuc3VibWl0dGVyP2Uuc3VibWl0dGVyKHIpOnIuc3VibWl0KCk7c2V0VGltZW91dChmdW5jdGlvbigpe3IucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyKX0sMCl9fX0oKTthLmIoXCJ1dGlsc1wiLGEuYSk7YS5iKFwidXRpbHMuYXJyYXlGb3JFYWNoXCIsYS5hLnIpO2EuYihcInV0aWxzLmFycmF5Rmlyc3RcIixhLmEuVmIpO2EuYihcInV0aWxzLmFycmF5RmlsdGVyXCIsYS5hLk1hKTthLmIoXCJ1dGlscy5hcnJheUdldERpc3RpbmN0VmFsdWVzXCIsYS5hLldiKTthLmIoXCJ1dGlscy5hcnJheUluZGV4T2ZcIixhLmEubyk7YS5iKFwidXRpbHMuYXJyYXlNYXBcIixhLmEuaWIpO2EuYihcInV0aWxzLmFycmF5UHVzaEFsbFwiLGEuYS50YSk7YS5iKFwidXRpbHMuYXJyYXlSZW1vdmVJdGVtXCIsYS5hLk5hKTthLmIoXCJ1dGlscy5leHRlbmRcIixhLmEuZXh0ZW5kKTthLmIoXCJ1dGlscy5maWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdFwiLFxyXG4gICAgYS5hLmdjKTthLmIoXCJ1dGlscy5nZXRGb3JtRmllbGRzXCIsYS5hLmljKTthLmIoXCJ1dGlscy5wZWVrT2JzZXJ2YWJsZVwiLGEuYS5CYik7YS5iKFwidXRpbHMucG9zdEpzb25cIixhLmEubGQpO2EuYihcInV0aWxzLnBhcnNlSnNvblwiLGEuYS5rZCk7YS5iKFwidXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXJcIixhLmEucSk7YS5iKFwidXRpbHMuc3RyaW5naWZ5SnNvblwiLGEuYS5HYik7YS5iKFwidXRpbHMucmFuZ2VcIixhLmEubmQpO2EuYihcInV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzc1wiLGEuYS5mYik7YS5iKFwidXRpbHMudHJpZ2dlckV2ZW50XCIsYS5hLkZhKTthLmIoXCJ1dGlscy51bndyYXBPYnNlcnZhYmxlXCIsYS5hLmMpO2EuYihcInV0aWxzLm9iamVjdEZvckVhY2hcIixhLmEuRCk7YS5iKFwidXRpbHMuYWRkT3JSZW1vdmVJdGVtXCIsYS5hLnJhKTthLmIoXCJ1dGlscy5zZXRUZXh0Q29udGVudFwiLGEuYS5iYik7YS5iKFwidW53cmFwXCIsYS5hLmMpO0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kfHwoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ9XHJcbiAgICBmdW5jdGlvbihhKXt2YXIgYz10aGlzO2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBmdW5jdGlvbigpe3JldHVybiBjLmFwcGx5KGEsYXJndW1lbnRzKX07dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiBmdW5jdGlvbigpe3ZhciBlPWQuc2xpY2UoMCk7ZS5wdXNoLmFwcGx5KGUsYXJndW1lbnRzKTtyZXR1cm4gYy5hcHBseShhLGUpfX0pO2EuYS5lPW5ldyBmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYixnKXt2YXIgaD1iW2RdO2lmKCFofHxcIm51bGxcIj09PWh8fCFlW2hdKXtpZighZylyZXR1cm4gbjtoPWJbZF09XCJrb1wiK2MrKztlW2hdPXt9fXJldHVybiBlW2hdfXZhciBjPTAsZD1cIl9fa29fX1wiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpLGU9e307cmV0dXJue2dldDpmdW5jdGlvbihjLGQpe3ZhciBlPWEoYywhMSk7cmV0dXJuIGU9PT1uP246ZVtkXX0sc2V0OmZ1bmN0aW9uKGMsZCxlKXtpZihlIT09bnx8YShjLCExKSE9PW4pYShjLCEwKVtkXT1cclxuICAgIGV9LGNsZWFyOmZ1bmN0aW9uKGEpe3ZhciBiPWFbZF07cmV0dXJuIGI/KGRlbGV0ZSBlW2JdLGFbZF09bnVsbCwhMCk6ITF9LEo6ZnVuY3Rpb24oKXtyZXR1cm4gYysrICtkfX19O2EuYihcInV0aWxzLmRvbURhdGFcIixhLmEuZSk7YS5iKFwidXRpbHMuZG9tRGF0YS5jbGVhclwiLGEuYS5lLmNsZWFyKTthLmEuRz1uZXcgZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsYyl7dmFyIGU9YS5hLmUuZ2V0KGIsZCk7ZT09PW4mJmMmJihlPVtdLGEuYS5lLnNldChiLGQsZSkpO3JldHVybiBlfWZ1bmN0aW9uIGMoZCl7dmFyIGU9YihkLCExKTtpZihlKWZvcih2YXIgZT1lLnNsaWNlKDApLGw9MDtsPGUubGVuZ3RoO2wrKyllW2xdKGQpO2EuYS5lLmNsZWFyKGQpO2EuYS5HLmNsZWFuRXh0ZXJuYWxEYXRhKGQpO2lmKGZbZC5ub2RlVHlwZV0pZm9yKGU9ZC5maXJzdENoaWxkO2Q9ZTspZT1kLm5leHRTaWJsaW5nLDg9PT1kLm5vZGVUeXBlJiZjKGQpfXZhciBkPWEuYS5lLkooKSxlPXsxOiEwLDg6ITAsOTohMH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmPXsxOiEwLDk6ITB9O3JldHVybntxYTpmdW5jdGlvbihhLGMpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGMpdGhyb3cgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7YihhLCEwKS5wdXNoKGMpfSx0YzpmdW5jdGlvbihjLGUpe3ZhciBmPWIoYywhMSk7ZiYmKGEuYS5OYShmLGUpLDA9PWYubGVuZ3RoJiZhLmEuZS5zZXQoYyxkLG4pKX0sYmE6ZnVuY3Rpb24oYil7aWYoZVtiLm5vZGVUeXBlXSYmKGMoYiksZltiLm5vZGVUeXBlXSkpe3ZhciBkPVtdO2EuYS50YShkLGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpKTtmb3IodmFyIGw9MCxtPWQubGVuZ3RoO2w8bTtsKyspYyhkW2xdKX1yZXR1cm4gYn0scmVtb3ZlTm9kZTpmdW5jdGlvbihiKXthLmJhKGIpO2IucGFyZW50Tm9kZSYmYi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGIpfSxjbGVhbkV4dGVybmFsRGF0YTpmdW5jdGlvbihhKXt1JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LmNsZWFuRGF0YSYmdS5jbGVhbkRhdGEoW2FdKX19fTtcclxuICAgIGEuYmE9YS5hLkcuYmE7YS5yZW1vdmVOb2RlPWEuYS5HLnJlbW92ZU5vZGU7YS5iKFwiY2xlYW5Ob2RlXCIsYS5iYSk7YS5iKFwicmVtb3ZlTm9kZVwiLGEucmVtb3ZlTm9kZSk7YS5iKFwidXRpbHMuZG9tTm9kZURpc3Bvc2FsXCIsYS5hLkcpO2EuYihcInV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2tcIixhLmEuRy5xYSk7YS5iKFwidXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZURpc3Bvc2VDYWxsYmFja1wiLGEuYS5HLnRjKTsoZnVuY3Rpb24oKXt2YXIgYj1bMCxcIlwiLFwiXCJdLGM9WzEsXCI8dGFibGU+XCIsXCI8L3RhYmxlPlwiXSxkPVszLFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0sZT1bMSxcIjxzZWxlY3QgbXVsdGlwbGU9J211bHRpcGxlJz5cIixcIjwvc2VsZWN0PlwiXSxmPXt0aGVhZDpjLHRib2R5OmMsdGZvb3Q6Yyx0cjpbMixcIjx0YWJsZT48dGJvZHk+XCIsXCI8L3Rib2R5PjwvdGFibGU+XCJdLHRkOmQsdGg6ZCxvcHRpb246ZSxvcHRncm91cDplfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnPTg+PWEuYS5DO2EuYS5uYT1mdW5jdGlvbihjLGQpe3ZhciBlO2lmKHUpaWYodS5wYXJzZUhUTUwpZT11LnBhcnNlSFRNTChjLGQpfHxbXTtlbHNle2lmKChlPXUuY2xlYW4oW2NdLGQpKSYmZVswXSl7Zm9yKHZhciBrPWVbMF07ay5wYXJlbnROb2RlJiYxMSE9PWsucGFyZW50Tm9kZS5ub2RlVHlwZTspaz1rLnBhcmVudE5vZGU7ay5wYXJlbnROb2RlJiZrLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoayl9fWVsc2V7KGU9ZCl8fChlPXQpO3ZhciBrPWUucGFyZW50V2luZG93fHxlLmRlZmF1bHRWaWV3fHx4LHI9YS5hLmNiKGMpLnRvTG93ZXJDYXNlKCkscT1lLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikscDtwPShyPXIubWF0Y2goL148KFthLXpdKylbID5dLykpJiZmW3JbMV1dfHxiO3I9cFswXTtwPVwiaWdub3JlZDxkaXY+XCIrcFsxXStjK3BbMl0rXCI8L2Rpdj5cIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBrLmlubmVyU2hpdj9xLmFwcGVuZENoaWxkKGsuaW5uZXJTaGl2KHApKTooZyYmZS5hcHBlbmRDaGlsZChxKSxcclxuICAgICAgICBxLmlubmVySFRNTD1wLGcmJnEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChxKSk7Zm9yKDtyLS07KXE9cS5sYXN0Q2hpbGQ7ZT1hLmEuVyhxLmxhc3RDaGlsZC5jaGlsZE5vZGVzKX1yZXR1cm4gZX07YS5hLkViPWZ1bmN0aW9uKGIsYyl7YS5hLnJiKGIpO2M9YS5hLmMoYyk7aWYobnVsbCE9PWMmJmMhPT1uKWlmKFwic3RyaW5nXCIhPXR5cGVvZiBjJiYoYz1jLnRvU3RyaW5nKCkpLHUpdShiKS5odG1sKGMpO2Vsc2UgZm9yKHZhciBkPWEuYS5uYShjLGIub3duZXJEb2N1bWVudCksZT0wO2U8ZC5sZW5ndGg7ZSsrKWIuYXBwZW5kQ2hpbGQoZFtlXSl9fSkoKTthLmIoXCJ1dGlscy5wYXJzZUh0bWxGcmFnbWVudFwiLGEuYS5uYSk7YS5iKFwidXRpbHMuc2V0SHRtbFwiLGEuYS5FYik7YS5OPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihjLGUpe2lmKGMpaWYoOD09Yy5ub2RlVHlwZSl7dmFyIGY9YS5OLnBjKGMubm9kZVZhbHVlKTtudWxsIT1mJiZlLnB1c2goe1FjOmMsaGQ6Zn0pfWVsc2UgaWYoMT09Yy5ub2RlVHlwZSlmb3IodmFyIGY9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxnPWMuY2hpbGROb2RlcyxoPWcubGVuZ3RoO2Y8aDtmKyspYihnW2ZdLGUpfXZhciBjPXt9O3JldHVybnt5YjpmdW5jdGlvbihhKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBhKXRocm93IEVycm9yKFwiWW91IGNhbiBvbmx5IHBhc3MgYSBmdW5jdGlvbiB0byBrby5tZW1vaXphdGlvbi5tZW1vaXplKClcIik7dmFyIGI9KDQyOTQ5NjcyOTYqKDErTWF0aC5yYW5kb20oKSl8MCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKSsoNDI5NDk2NzI5NiooMStNYXRoLnJhbmRvbSgpKXwwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO2NbYl09YTtyZXR1cm5cIlxceDNjIS0tW2tvX21lbW86XCIrYitcIl0tLVxceDNlXCJ9LEJjOmZ1bmN0aW9uKGEsYil7dmFyIGY9Y1thXTtpZihmPT09bil0aHJvdyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYW55IG1lbW8gd2l0aCBJRCBcIithK1wiLiBQZXJoYXBzIGl0J3MgYWxyZWFkeSBiZWVuIHVubWVtb2l6ZWQuXCIpO3RyeXtyZXR1cm4gZi5hcHBseShudWxsLGJ8fFtdKSxcclxuICAgICAgICAhMH1maW5hbGx5e2RlbGV0ZSBjW2FdfX0sQ2M6ZnVuY3Rpb24oYyxlKXt2YXIgZj1bXTtiKGMsZik7Zm9yKHZhciBnPTAsaD1mLmxlbmd0aDtnPGg7ZysrKXt2YXIgbD1mW2ddLlFjLG09W2xdO2UmJmEuYS50YShtLGUpO2EuTi5CYyhmW2ddLmhkLG0pO2wubm9kZVZhbHVlPVwiXCI7bC5wYXJlbnROb2RlJiZsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobCl9fSxwYzpmdW5jdGlvbihhKXtyZXR1cm4oYT1hLm1hdGNoKC9eXFxba29fbWVtb1xcOiguKj8pXFxdJC8pKT9hWzFdOm51bGx9fX0oKTthLmIoXCJtZW1vaXphdGlvblwiLGEuTik7YS5iKFwibWVtb2l6YXRpb24ubWVtb2l6ZVwiLGEuTi55Yik7YS5iKFwibWVtb2l6YXRpb24udW5tZW1vaXplXCIsYS5OLkJjKTthLmIoXCJtZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0XCIsYS5OLnBjKTthLmIoXCJtZW1vaXphdGlvbi51bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHNcIixhLk4uQ2MpO2EuWj1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoKXtpZihlKWZvcih2YXIgYj1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUsYz0wLG07ZzxlOylpZihtPWRbZysrXSl7aWYoZz5iKXtpZig1RTM8PSsrYyl7Zz1lO2EuYS5kYyhFcnJvcihcIidUb28gbXVjaCByZWN1cnNpb24nIGFmdGVyIHByb2Nlc3NpbmcgXCIrYytcIiB0YXNrIGdyb3Vwcy5cIikpO2JyZWFrfWI9ZX10cnl7bSgpfWNhdGNoKGspe2EuYS5kYyhrKX19fWZ1bmN0aW9uIGMoKXtiKCk7Zz1lPWQubGVuZ3RoPTB9dmFyIGQ9W10sZT0wLGY9MSxnPTA7cmV0dXJue3NjaGVkdWxlcjp4Lk11dGF0aW9uT2JzZXJ2ZXI/ZnVuY3Rpb24oYSl7dmFyIGI9dC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyhuZXcgTXV0YXRpb25PYnNlcnZlcihhKSkub2JzZXJ2ZShiLHthdHRyaWJ1dGVzOiEwfSk7cmV0dXJuIGZ1bmN0aW9uKCl7Yi5jbGFzc0xpc3QudG9nZ2xlKFwiZm9vXCIpfX0oYyk6dCYmXCJvbnJlYWR5c3RhdGVjaGFuZ2VcImluIHQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKT9mdW5jdGlvbihhKXt2YXIgYj10LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7Yi5vbnJlYWR5c3RhdGVjaGFuZ2U9XHJcbiAgICAgICAgZnVuY3Rpb24oKXtiLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsO3QuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKGIpO2I9bnVsbDthKCl9O3QuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGIpfTpmdW5jdGlvbihhKXtzZXRUaW1lb3V0KGEsMCl9LFphOmZ1bmN0aW9uKGIpe2V8fGEuWi5zY2hlZHVsZXIoYyk7ZFtlKytdPWI7cmV0dXJuIGYrK30sY2FuY2VsOmZ1bmN0aW9uKGEpe2EtPWYtZTthPj1nJiZhPGUmJihkW2FdPW51bGwpfSxyZXNldEZvclRlc3Rpbmc6ZnVuY3Rpb24oKXt2YXIgYT1lLWc7Zz1lPWQubGVuZ3RoPTA7cmV0dXJuIGF9LHJkOmJ9fSgpO2EuYihcInRhc2tzXCIsYS5aKTthLmIoXCJ0YXNrcy5zY2hlZHVsZVwiLGEuWi5aYSk7YS5iKFwidGFza3MucnVuRWFybHlcIixhLloucmQpO2EuQWE9e3Rocm90dGxlOmZ1bmN0aW9uKGIsYyl7Yi50aHJvdHRsZUV2YWx1YXRpb249Yzt2YXIgZD1udWxsO3JldHVybiBhLkIoe3JlYWQ6Yix3cml0ZTpmdW5jdGlvbihlKXtjbGVhclRpbWVvdXQoZCk7XHJcbiAgICAgICAgZD1hLmEuc2V0VGltZW91dChmdW5jdGlvbigpe2IoZSl9LGMpfX0pfSxyYXRlTGltaXQ6ZnVuY3Rpb24oYSxjKXt2YXIgZCxlLGY7XCJudW1iZXJcIj09dHlwZW9mIGM/ZD1jOihkPWMudGltZW91dCxlPWMubWV0aG9kKTthLmdiPSExO2Y9XCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIj09ZT9UOlM7YS5XYShmdW5jdGlvbihhKXtyZXR1cm4gZihhLGQpfSl9LGRlZmVycmVkOmZ1bmN0aW9uKGIsYyl7aWYoITAhPT1jKXRocm93IEVycm9yKFwiVGhlICdkZWZlcnJlZCcgZXh0ZW5kZXIgb25seSBhY2NlcHRzIHRoZSB2YWx1ZSAndHJ1ZScsIGJlY2F1c2UgaXQgaXMgbm90IHN1cHBvcnRlZCB0byB0dXJuIGRlZmVycmFsIG9mZiBvbmNlIGVuYWJsZWQuXCIpO2IuZ2J8fChiLmdiPSEwLGIuV2EoZnVuY3Rpb24oYyl7dmFyIGUsZj0hMTtyZXR1cm4gZnVuY3Rpb24oKXtpZighZil7YS5aLmNhbmNlbChlKTtlPWEuWi5aYShjKTt0cnl7Zj0hMCxiLm5vdGlmeVN1YnNjcmliZXJzKG4sXCJkaXJ0eVwiKX1maW5hbGx5e2Y9XHJcbiAgICAgICAgITF9fX19KSl9LG5vdGlmeTpmdW5jdGlvbihhLGMpe2EuZXF1YWxpdHlDb21wYXJlcj1cImFsd2F5c1wiPT1jP251bGw6Sn19O3ZhciBSPXt1bmRlZmluZWQ6MSxcImJvb2xlYW5cIjoxLG51bWJlcjoxLHN0cmluZzoxfTthLmIoXCJleHRlbmRlcnNcIixhLkFhKTthLnpjPWZ1bmN0aW9uKGIsYyxkKXt0aGlzLiQ9Yjt0aGlzLmpiPWM7dGhpcy5QYz1kO3RoaXMuVD0hMTthLkgodGhpcyxcImRpc3Bvc2VcIix0aGlzLmspfTthLnpjLnByb3RvdHlwZS5rPWZ1bmN0aW9uKCl7dGhpcy5UPSEwO3RoaXMuUGMoKX07YS5LPWZ1bmN0aW9uKCl7YS5hLmFiKHRoaXMsRCk7RC51Yih0aGlzKX07dmFyIEU9XCJjaGFuZ2VcIixEPXt1YjpmdW5jdGlvbihhKXthLkY9e2NoYW5nZTpbXX07YS5RYj0xfSxZOmZ1bmN0aW9uKGIsYyxkKXt2YXIgZT10aGlzO2Q9ZHx8RTt2YXIgZj1uZXcgYS56YyhlLGM/Yi5iaW5kKGMpOmIsZnVuY3Rpb24oKXthLmEuTmEoZS5GW2RdLGYpO2UuS2EmJmUuS2EoZCl9KTtlLnVhJiZlLnVhKGQpO1xyXG4gICAgICAgIGUuRltkXXx8KGUuRltkXT1bXSk7ZS5GW2RdLnB1c2goZik7cmV0dXJuIGZ9LG5vdGlmeVN1YnNjcmliZXJzOmZ1bmN0aW9uKGIsYyl7Yz1jfHxFO2M9PT1FJiZ0aGlzLktiKCk7aWYodGhpcy5SYShjKSl7dmFyIGQ9Yz09PUUmJnRoaXMuRmN8fHRoaXMuRltjXS5zbGljZSgwKTt0cnl7YS5sLlhiKCk7Zm9yKHZhciBlPTAsZjtmPWRbZV07KytlKWYuVHx8Zi5qYihiKX1maW5hbGx5e2EubC5lbmQoKX19fSxQYTpmdW5jdGlvbigpe3JldHVybiB0aGlzLlFifSxaYzpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5QYSgpIT09YX0sS2I6ZnVuY3Rpb24oKXsrK3RoaXMuUWJ9LFdhOmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMsZD1hLkkoYyksZSxmLGcsaDtjLkphfHwoYy5KYT1jLm5vdGlmeVN1YnNjcmliZXJzLGMubm90aWZ5U3Vic2NyaWJlcnM9VSk7dmFyIGw9YihmdW5jdGlvbigpe2MuSGE9ITE7ZCYmaD09PWMmJihoPWMuTWI/Yy5NYigpOmMoKSk7dmFyIGE9Znx8Yy5VYShnLGgpO2Y9ZT0hMTtcclxuICAgICAgICBhJiZjLkphKGc9aCl9KTtjLlBiPWZ1bmN0aW9uKGEpe2MuRmM9Yy5GW0VdLnNsaWNlKDApO2MuSGE9ZT0hMDtoPWE7bCgpfTtjLk9iPWZ1bmN0aW9uKGEpe2V8fChnPWEsYy5KYShhLFwiYmVmb3JlQ2hhbmdlXCIpKX07Yy5IYz1mdW5jdGlvbigpe2MuVWEoZyxjLnAoITApKSYmKGY9ITApfX0sUmE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuRlthXSYmdGhpcy5GW2FdLmxlbmd0aH0sWGM6ZnVuY3Rpb24oYil7aWYoYilyZXR1cm4gdGhpcy5GW2JdJiZ0aGlzLkZbYl0ubGVuZ3RofHwwO3ZhciBjPTA7YS5hLkQodGhpcy5GLGZ1bmN0aW9uKGEsYil7XCJkaXJ0eVwiIT09YSYmKGMrPWIubGVuZ3RoKX0pO3JldHVybiBjfSxVYTpmdW5jdGlvbihhLGMpe3JldHVybiF0aGlzLmVxdWFsaXR5Q29tcGFyZXJ8fCF0aGlzLmVxdWFsaXR5Q29tcGFyZXIoYSxjKX0sZXh0ZW5kOmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXM7YiYmYS5hLkQoYixmdW5jdGlvbihiLGUpe3ZhciBmPWEuQWFbYl07XCJmdW5jdGlvblwiPT1cclxuICAgIHR5cGVvZiBmJiYoYz1mKGMsZSl8fGMpfSk7cmV0dXJuIGN9fTthLkgoRCxcInN1YnNjcmliZVwiLEQuWSk7YS5IKEQsXCJleHRlbmRcIixELmV4dGVuZCk7YS5IKEQsXCJnZXRTdWJzY3JpcHRpb25zQ291bnRcIixELlhjKTthLmEubGEmJmEuYS4kYShELEZ1bmN0aW9uLnByb3RvdHlwZSk7YS5LLmZuPUQ7YS5sYz1mdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5ZJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLm5vdGlmeVN1YnNjcmliZXJzfTthLmIoXCJzdWJzY3JpYmFibGVcIixhLkspO2EuYihcImlzU3Vic2NyaWJhYmxlXCIsYS5sYyk7YS54YT1hLmw9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEpe2QucHVzaChlKTtlPWF9ZnVuY3Rpb24gYygpe2U9ZC5wb3AoKX12YXIgZD1bXSxlLGY9MDtyZXR1cm57WGI6YixlbmQ6YyxzYzpmdW5jdGlvbihiKXtpZihlKXtpZighYS5sYyhiKSl0aHJvdyBFcnJvcihcIk9ubHkgc3Vic2NyaWJhYmxlIHRoaW5ncyBjYW4gYWN0IGFzIGRlcGVuZGVuY2llc1wiKTtcclxuICAgICAgICBlLmpiLmNhbGwoZS5MYyxiLGIuR2N8fChiLkdjPSsrZikpfX0sdzpmdW5jdGlvbihhLGQsZSl7dHJ5e3JldHVybiBiKCksYS5hcHBseShkLGV8fFtdKX1maW5hbGx5e2MoKX19LENhOmZ1bmN0aW9uKCl7aWYoZSlyZXR1cm4gZS5tLkNhKCl9LFZhOmZ1bmN0aW9uKCl7aWYoZSlyZXR1cm4gZS5WYX19fSgpO2EuYihcImNvbXB1dGVkQ29udGV4dFwiLGEueGEpO2EuYihcImNvbXB1dGVkQ29udGV4dC5nZXREZXBlbmRlbmNpZXNDb3VudFwiLGEueGEuQ2EpO2EuYihcImNvbXB1dGVkQ29udGV4dC5pc0luaXRpYWxcIixhLnhhLlZhKTthLmIoXCJpZ25vcmVEZXBlbmRlbmNpZXNcIixhLndkPWEubC53KTt2YXIgRj1hLmEuYmMoXCJfbGF0ZXN0VmFsdWVcIik7YS5PPWZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoKXtpZigwPGFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGMuVWEoY1tGXSxhcmd1bWVudHNbMF0pJiYoYy5pYSgpLGNbRl09YXJndW1lbnRzWzBdLGMuaGEoKSksdGhpczthLmwuc2MoYyk7cmV0dXJuIGNbRl19XHJcbiAgICAgICAgY1tGXT1iO2EuYS5sYXx8YS5hLmV4dGVuZChjLGEuSy5mbik7YS5LLmZuLnViKGMpO2EuYS5hYihjLEIpO2Eub3B0aW9ucy5kZWZlclVwZGF0ZXMmJmEuQWEuZGVmZXJyZWQoYywhMCk7cmV0dXJuIGN9O3ZhciBCPXtlcXVhbGl0eUNvbXBhcmVyOkoscDpmdW5jdGlvbigpe3JldHVybiB0aGlzW0ZdfSxoYTpmdW5jdGlvbigpe3RoaXMubm90aWZ5U3Vic2NyaWJlcnModGhpc1tGXSl9LGlhOmZ1bmN0aW9uKCl7dGhpcy5ub3RpZnlTdWJzY3JpYmVycyh0aGlzW0ZdLFwiYmVmb3JlQ2hhbmdlXCIpfX07YS5hLmxhJiZhLmEuJGEoQixhLksuZm4pO3ZhciBJPWEuTy5tZD1cIl9fa29fcHJvdG9fX1wiO0JbSV09YS5PO2EuUWE9ZnVuY3Rpb24oYixjKXtyZXR1cm4gbnVsbD09PWJ8fGI9PT1ufHxiW0ldPT09bj8hMTpiW0ldPT09Yz8hMDphLlFhKGJbSV0sYyl9O2EuST1mdW5jdGlvbihiKXtyZXR1cm4gYS5RYShiLGEuTyl9O2EuRGE9ZnVuY3Rpb24oYil7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgYiYmXHJcbiAgICBiW0ldPT09YS5PfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBiJiZiW0ldPT09YS5CJiZiLiRjPyEwOiExfTthLmIoXCJvYnNlcnZhYmxlXCIsYS5PKTthLmIoXCJpc09ic2VydmFibGVcIixhLkkpO2EuYihcImlzV3JpdGVhYmxlT2JzZXJ2YWJsZVwiLGEuRGEpO2EuYihcImlzV3JpdGFibGVPYnNlcnZhYmxlXCIsYS5EYSk7YS5iKFwib2JzZXJ2YWJsZS5mblwiLEIpO2EuSChCLFwicGVla1wiLEIucCk7YS5IKEIsXCJ2YWx1ZUhhc011dGF0ZWRcIixCLmhhKTthLkgoQixcInZhbHVlV2lsbE11dGF0ZVwiLEIuaWEpO2EubWE9ZnVuY3Rpb24oYil7Yj1ifHxbXTtpZihcIm9iamVjdFwiIT10eXBlb2YgYnx8IShcImxlbmd0aFwiaW4gYikpdGhyb3cgRXJyb3IoXCJUaGUgYXJndW1lbnQgcGFzc2VkIHdoZW4gaW5pdGlhbGl6aW5nIGFuIG9ic2VydmFibGUgYXJyYXkgbXVzdCBiZSBhbiBhcnJheSwgb3IgbnVsbCwgb3IgdW5kZWZpbmVkLlwiKTtiPWEuTyhiKTthLmEuYWIoYixhLm1hLmZuKTtyZXR1cm4gYi5leHRlbmQoe3RyYWNrQXJyYXlDaGFuZ2VzOiEwfSl9O1xyXG4gICAgYS5tYS5mbj17cmVtb3ZlOmZ1bmN0aW9uKGIpe2Zvcih2YXIgYz10aGlzLnAoKSxkPVtdLGU9XCJmdW5jdGlvblwiIT10eXBlb2YgYnx8YS5JKGIpP2Z1bmN0aW9uKGEpe3JldHVybiBhPT09Yn06YixmPTA7ZjxjLmxlbmd0aDtmKyspe3ZhciBnPWNbZl07ZShnKSYmKDA9PT1kLmxlbmd0aCYmdGhpcy5pYSgpLGQucHVzaChnKSxjLnNwbGljZShmLDEpLGYtLSl9ZC5sZW5ndGgmJnRoaXMuaGEoKTtyZXR1cm4gZH0scmVtb3ZlQWxsOmZ1bmN0aW9uKGIpe2lmKGI9PT1uKXt2YXIgYz10aGlzLnAoKSxkPWMuc2xpY2UoMCk7dGhpcy5pYSgpO2Muc3BsaWNlKDAsYy5sZW5ndGgpO3RoaXMuaGEoKTtyZXR1cm4gZH1yZXR1cm4gYj90aGlzLnJlbW92ZShmdW5jdGlvbihjKXtyZXR1cm4gMDw9YS5hLm8oYixjKX0pOltdfSxkZXN0cm95OmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMucCgpLGQ9XCJmdW5jdGlvblwiIT10eXBlb2YgYnx8YS5JKGIpP2Z1bmN0aW9uKGEpe3JldHVybiBhPT09Yn06Yjt0aGlzLmlhKCk7XHJcbiAgICAgICAgZm9yKHZhciBlPWMubGVuZ3RoLTE7MDw9ZTtlLS0pZChjW2VdKSYmKGNbZV0uX2Rlc3Ryb3k9ITApO3RoaXMuaGEoKX0sZGVzdHJveUFsbDpmdW5jdGlvbihiKXtyZXR1cm4gYj09PW4/dGhpcy5kZXN0cm95KGZ1bmN0aW9uKCl7cmV0dXJuITB9KTpiP3RoaXMuZGVzdHJveShmdW5jdGlvbihjKXtyZXR1cm4gMDw9YS5hLm8oYixjKX0pOltdfSxpbmRleE9mOmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMoKTtyZXR1cm4gYS5hLm8oYyxiKX0scmVwbGFjZTpmdW5jdGlvbihhLGMpe3ZhciBkPXRoaXMuaW5kZXhPZihhKTswPD1kJiYodGhpcy5pYSgpLHRoaXMucCgpW2RdPWMsdGhpcy5oYSgpKX19O2EuYS5sYSYmYS5hLiRhKGEubWEuZm4sYS5PLmZuKTthLmEucihcInBvcCBwdXNoIHJldmVyc2Ugc2hpZnQgc29ydCBzcGxpY2UgdW5zaGlmdFwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihiKXthLm1hLmZuW2JdPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5wKCk7dGhpcy5pYSgpO3RoaXMuWWIoYSxiLGFyZ3VtZW50cyk7XHJcbiAgICAgICAgdmFyIGQ9YVtiXS5hcHBseShhLGFyZ3VtZW50cyk7dGhpcy5oYSgpO3JldHVybiBkPT09YT90aGlzOmR9fSk7YS5hLnIoW1wic2xpY2VcIl0sZnVuY3Rpb24oYil7YS5tYS5mbltiXT1mdW5jdGlvbigpe3ZhciBhPXRoaXMoKTtyZXR1cm4gYVtiXS5hcHBseShhLGFyZ3VtZW50cyl9fSk7YS5iKFwib2JzZXJ2YWJsZUFycmF5XCIsYS5tYSk7YS5BYS50cmFja0FycmF5Q2hhbmdlcz1mdW5jdGlvbihiLGMpe2Z1bmN0aW9uIGQoKXtpZighZSl7ZT0hMDtsPWIubm90aWZ5U3Vic2NyaWJlcnM7Yi5ub3RpZnlTdWJzY3JpYmVycz1mdW5jdGlvbihhLGIpe2ImJmIhPT1FfHwrK2g7cmV0dXJuIGwuYXBwbHkodGhpcyxhcmd1bWVudHMpfTt2YXIgYz1bXS5jb25jYXQoYi5wKCl8fFtdKTtmPW51bGw7Zz1iLlkoZnVuY3Rpb24oZCl7ZD1bXS5jb25jYXQoZHx8W10pO2lmKGIuUmEoXCJhcnJheUNoYW5nZVwiKSl7dmFyIGU7aWYoIWZ8fDE8aClmPWEuYS5sYihjLGQsYi5rYik7ZT1mfWM9ZDtmPW51bGw7aD0wO1xyXG4gICAgICAgIGUmJmUubGVuZ3RoJiZiLm5vdGlmeVN1YnNjcmliZXJzKGUsXCJhcnJheUNoYW5nZVwiKX0pfX1iLmtiPXt9O2MmJlwib2JqZWN0XCI9PXR5cGVvZiBjJiZhLmEuZXh0ZW5kKGIua2IsYyk7Yi5rYi5zcGFyc2U9ITA7aWYoIWIuWWIpe3ZhciBlPSExLGY9bnVsbCxnLGg9MCxsLG09Yi51YSxrPWIuS2E7Yi51YT1mdW5jdGlvbihhKXttJiZtLmNhbGwoYixhKTtcImFycmF5Q2hhbmdlXCI9PT1hJiZkKCl9O2IuS2E9ZnVuY3Rpb24oYSl7ayYmay5jYWxsKGIsYSk7XCJhcnJheUNoYW5nZVwiIT09YXx8Yi5SYShcImFycmF5Q2hhbmdlXCIpfHwobCYmKGIubm90aWZ5U3Vic2NyaWJlcnM9bCxsPW4pLGcuaygpLGU9ITEpfTtiLlliPWZ1bmN0aW9uKGIsYyxkKXtmdW5jdGlvbiBrKGEsYixjKXtyZXR1cm4gbVttLmxlbmd0aF09e3N0YXR1czphLHZhbHVlOmIsaW5kZXg6Y319aWYoZSYmIWgpe3ZhciBtPVtdLGw9Yi5sZW5ndGgsZz1kLmxlbmd0aCxHPTA7c3dpdGNoKGMpe2Nhc2UgXCJwdXNoXCI6Rz1sO2Nhc2UgXCJ1bnNoaWZ0XCI6Zm9yKGM9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwO2M8ZztjKyspayhcImFkZGVkXCIsZFtjXSxHK2MpO2JyZWFrO2Nhc2UgXCJwb3BcIjpHPWwtMTtjYXNlIFwic2hpZnRcIjpsJiZrKFwiZGVsZXRlZFwiLGJbR10sRyk7YnJlYWs7Y2FzZSBcInNwbGljZVwiOmM9TWF0aC5taW4oTWF0aC5tYXgoMCwwPmRbMF0/bCtkWzBdOmRbMF0pLGwpO2Zvcih2YXIgbD0xPT09Zz9sOk1hdGgubWluKGMrKGRbMV18fDApLGwpLGc9YytnLTIsRz1NYXRoLm1heChsLGcpLG49W10scz1bXSx3PTI7YzxHOysrYywrK3cpYzxsJiZzLnB1c2goayhcImRlbGV0ZWRcIixiW2NdLGMpKSxjPGcmJm4ucHVzaChrKFwiYWRkZWRcIixkW3ddLGMpKTthLmEuaGMocyxuKTticmVhaztkZWZhdWx0OnJldHVybn1mPW19fX19O3ZhciBzPWEuYS5iYyhcIl9zdGF0ZVwiKTthLm09YS5CPWZ1bmN0aW9uKGIsYyxkKXtmdW5jdGlvbiBlKCl7aWYoMDxhcmd1bWVudHMubGVuZ3RoKXtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgZilmLmFwcGx5KGcuc2IsYXJndW1lbnRzKTtlbHNlIHRocm93IEVycm9yKFwiQ2Fubm90IHdyaXRlIGEgdmFsdWUgdG8gYSBrby5jb21wdXRlZCB1bmxlc3MgeW91IHNwZWNpZnkgYSAnd3JpdGUnIG9wdGlvbi4gSWYgeW91IHdpc2ggdG8gcmVhZCB0aGUgY3VycmVudCB2YWx1ZSwgZG9uJ3QgcGFzcyBhbnkgcGFyYW1ldGVycy5cIik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXN9YS5sLnNjKGUpOyhnLlZ8fGcudCYmZS5TYSgpKSYmZS5VKCk7cmV0dXJuIGcuTX1cIm9iamVjdFwiPT09dHlwZW9mIGI/ZD1iOihkPWR8fHt9LGImJihkLnJlYWQ9YikpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGQucmVhZCl0aHJvdyBFcnJvcihcIlBhc3MgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBrby5jb21wdXRlZFwiKTt2YXIgZj1kLndyaXRlLGc9e006bixkYTohMCxWOiEwLFRhOiExLEhiOiExLFQ6ITEsWWE6ITEsdDohMSxvZDpkLnJlYWQsc2I6Y3x8ZC5vd25lcixpOmQuZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkfHxkLml8fG51bGwseWE6ZC5kaXNwb3NlV2hlbnx8ZC55YSxwYjpudWxsLHM6e30sTDowLGZjOm51bGx9O2Vbc109ZztlLiRjPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBmO2EuYS5sYXx8YS5hLmV4dGVuZChlLGEuSy5mbik7YS5LLmZuLnViKGUpO2EuYS5hYihlLHopO2QucHVyZT8oZy5ZYT0hMCxnLnQ9ITAsYS5hLmV4dGVuZChlLFxyXG4gICAgICAgIFkpKTpkLmRlZmVyRXZhbHVhdGlvbiYmYS5hLmV4dGVuZChlLFopO2Eub3B0aW9ucy5kZWZlclVwZGF0ZXMmJmEuQWEuZGVmZXJyZWQoZSwhMCk7Zy5pJiYoZy5IYj0hMCxnLmkubm9kZVR5cGV8fChnLmk9bnVsbCkpO2cudHx8ZC5kZWZlckV2YWx1YXRpb258fGUuVSgpO2cuaSYmZS5jYSgpJiZhLmEuRy5xYShnLmksZy5wYj1mdW5jdGlvbigpe2UuaygpfSk7cmV0dXJuIGV9O3ZhciB6PXtlcXVhbGl0eUNvbXBhcmVyOkosQ2E6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tzXS5MfSxTYjpmdW5jdGlvbihhLGMsZCl7aWYodGhpc1tzXS5ZYSYmYz09PXRoaXMpdGhyb3cgRXJyb3IoXCJBICdwdXJlJyBjb21wdXRlZCBtdXN0IG5vdCBiZSBjYWxsZWQgcmVjdXJzaXZlbHlcIik7dGhpc1tzXS5zW2FdPWQ7ZC5JYT10aGlzW3NdLkwrKztkLnBhPWMuUGEoKX0sU2E6ZnVuY3Rpb24oKXt2YXIgYSxjLGQ9dGhpc1tzXS5zO2ZvcihhIGluIGQpaWYoZC5oYXNPd25Qcm9wZXJ0eShhKSYmKGM9ZFthXSx0aGlzLm9hJiZcclxuICAgICAgICBjLiQuSGF8fGMuJC5aYyhjLnBhKSkpcmV0dXJuITB9LGdkOmZ1bmN0aW9uKCl7dGhpcy5vYSYmIXRoaXNbc10uVGEmJnRoaXMub2EoITEpfSxjYTpmdW5jdGlvbigpe3ZhciBhPXRoaXNbc107cmV0dXJuIGEuVnx8MDxhLkx9LHFkOmZ1bmN0aW9uKCl7dGhpcy5IYT90aGlzW3NdLlYmJih0aGlzW3NdLmRhPSEwKTp0aGlzLmVjKCl9LHljOmZ1bmN0aW9uKGEpe2lmKGEuZ2ImJiF0aGlzW3NdLmkpe3ZhciBjPWEuWSh0aGlzLmdkLHRoaXMsXCJkaXJ0eVwiKSxkPWEuWSh0aGlzLnFkLHRoaXMpO3JldHVybnskOmEsazpmdW5jdGlvbigpe2MuaygpO2QuaygpfX19cmV0dXJuIGEuWSh0aGlzLmVjLHRoaXMpfSxlYzpmdW5jdGlvbigpe3ZhciBiPXRoaXMsYz1iLnRocm90dGxlRXZhbHVhdGlvbjtjJiYwPD1jPyhjbGVhclRpbWVvdXQodGhpc1tzXS5mYyksdGhpc1tzXS5mYz1hLmEuc2V0VGltZW91dChmdW5jdGlvbigpe2IuVSghMCl9LGMpKTpiLm9hP2Iub2EoITApOmIuVSghMCl9LFU6ZnVuY3Rpb24oYil7dmFyIGM9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbc10sZD1jLnlhLGU9ITE7aWYoIWMuVGEmJiFjLlQpe2lmKGMuaSYmIWEuYS5xYihjLmkpfHxkJiZkKCkpe2lmKCFjLkhiKXt0aGlzLmsoKTtyZXR1cm59fWVsc2UgYy5IYj0hMTtjLlRhPSEwO3RyeXtlPXRoaXMuVmMoYil9ZmluYWxseXtjLlRhPSExfWMuTHx8dGhpcy5rKCk7cmV0dXJuIGV9fSxWYzpmdW5jdGlvbihiKXt2YXIgYz10aGlzW3NdLGQ9ITEsZT1jLllhP246IWMuTCxmPXtNYzp0aGlzLE9hOmMucyxvYjpjLkx9O2EubC5YYih7TGM6ZixqYjpXLG06dGhpcyxWYTplfSk7Yy5zPXt9O2MuTD0wO2Y9dGhpcy5VYyhjLGYpO3RoaXMuVWEoYy5NLGYpJiYoYy50fHx0aGlzLm5vdGlmeVN1YnNjcmliZXJzKGMuTSxcImJlZm9yZUNoYW5nZVwiKSxjLk09ZixjLnQ/dGhpcy5LYigpOmImJnRoaXMubm90aWZ5U3Vic2NyaWJlcnMoYy5NKSxkPSEwKTtlJiZ0aGlzLm5vdGlmeVN1YnNjcmliZXJzKGMuTSxcImF3YWtlXCIpO3JldHVybiBkfSxVYzpmdW5jdGlvbihiLGMpe3RyeXt2YXIgZD1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLm9kO3JldHVybiBiLnNiP2QuY2FsbChiLnNiKTpkKCl9ZmluYWxseXthLmwuZW5kKCksYy5vYiYmIWIudCYmYS5hLkQoYy5PYSxWKSxiLmRhPWIuVj0hMX19LHA6ZnVuY3Rpb24oYSl7dmFyIGM9dGhpc1tzXTsoYy5WJiYoYXx8IWMuTCl8fGMudCYmdGhpcy5TYSgpKSYmdGhpcy5VKCk7cmV0dXJuIGMuTX0sV2E6ZnVuY3Rpb24oYil7YS5LLmZuLldhLmNhbGwodGhpcyxiKTt0aGlzLk1iPWZ1bmN0aW9uKCl7dGhpc1tzXS5kYT90aGlzLlUoKTp0aGlzW3NdLlY9ITE7cmV0dXJuIHRoaXNbc10uTX07dGhpcy5vYT1mdW5jdGlvbihhKXt0aGlzLk9iKHRoaXNbc10uTSk7dGhpc1tzXS5WPSEwO2EmJih0aGlzW3NdLmRhPSEwKTt0aGlzLlBiKHRoaXMpfX0sazpmdW5jdGlvbigpe3ZhciBiPXRoaXNbc107IWIudCYmYi5zJiZhLmEuRChiLnMsZnVuY3Rpb24oYSxiKXtiLmsmJmIuaygpfSk7Yi5pJiZiLnBiJiZhLmEuRy50YyhiLmksYi5wYik7Yi5zPW51bGw7Yi5MPTA7Yi5UPSEwO2IuZGE9XHJcbiAgICAgICAgITE7Yi5WPSExO2IudD0hMTtiLmk9bnVsbH19LFk9e3VhOmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMsZD1jW3NdO2lmKCFkLlQmJmQudCYmXCJjaGFuZ2VcIj09Yil7ZC50PSExO2lmKGQuZGF8fGMuU2EoKSlkLnM9bnVsbCxkLkw9MCxjLlUoKSYmYy5LYigpO2Vsc2V7dmFyIGU9W107YS5hLkQoZC5zLGZ1bmN0aW9uKGEsYil7ZVtiLklhXT1hfSk7YS5hLnIoZSxmdW5jdGlvbihhLGIpe3ZhciBlPWQuc1thXSxsPWMueWMoZS4kKTtsLklhPWI7bC5wYT1lLnBhO2Quc1thXT1sfSl9ZC5UfHxjLm5vdGlmeVN1YnNjcmliZXJzKGQuTSxcImF3YWtlXCIpfX0sS2E6ZnVuY3Rpb24oYil7dmFyIGM9dGhpc1tzXTtjLlR8fFwiY2hhbmdlXCIhPWJ8fHRoaXMuUmEoXCJjaGFuZ2VcIil8fChhLmEuRChjLnMsZnVuY3Rpb24oYSxiKXtiLmsmJihjLnNbYV09eyQ6Yi4kLElhOmIuSWEscGE6Yi5wYX0sYi5rKCkpfSksYy50PSEwLHRoaXMubm90aWZ5U3Vic2NyaWJlcnMobixcImFzbGVlcFwiKSl9LFBhOmZ1bmN0aW9uKCl7dmFyIGI9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbc107Yi50JiYoYi5kYXx8dGhpcy5TYSgpKSYmdGhpcy5VKCk7cmV0dXJuIGEuSy5mbi5QYS5jYWxsKHRoaXMpfX0sWj17dWE6ZnVuY3Rpb24oYSl7XCJjaGFuZ2VcIiE9YSYmXCJiZWZvcmVDaGFuZ2VcIiE9YXx8dGhpcy5wKCl9fTthLmEubGEmJmEuYS4kYSh6LGEuSy5mbik7dmFyIFA9YS5PLm1kO2EubVtQXT1hLk87eltQXT1hLm07YS5iZD1mdW5jdGlvbihiKXtyZXR1cm4gYS5RYShiLGEubSl9O2EuY2Q9ZnVuY3Rpb24oYil7cmV0dXJuIGEuUWEoYixhLm0pJiZiW3NdJiZiW3NdLllhfTthLmIoXCJjb21wdXRlZFwiLGEubSk7YS5iKFwiZGVwZW5kZW50T2JzZXJ2YWJsZVwiLGEubSk7YS5iKFwiaXNDb21wdXRlZFwiLGEuYmQpO2EuYihcImlzUHVyZUNvbXB1dGVkXCIsYS5jZCk7YS5iKFwiY29tcHV0ZWQuZm5cIix6KTthLkgoeixcInBlZWtcIix6LnApO2EuSCh6LFwiZGlzcG9zZVwiLHouayk7YS5IKHosXCJpc0FjdGl2ZVwiLHouY2EpO2EuSCh6LFwiZ2V0RGVwZW5kZW5jaWVzQ291bnRcIix6LkNhKTthLnJjPVxyXG4gICAgICAgIGZ1bmN0aW9uKGIsYyl7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGIpcmV0dXJuIGEubShiLGMse3B1cmU6ITB9KTtiPWEuYS5leHRlbmQoe30sYik7Yi5wdXJlPSEwO3JldHVybiBhLm0oYixjKX07YS5iKFwicHVyZUNvbXB1dGVkXCIsYS5yYyk7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhLGYsZyl7Zz1nfHxuZXcgZDthPWYoYSk7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGF8fG51bGw9PT1hfHxhPT09bnx8YSBpbnN0YW5jZW9mIFJlZ0V4cHx8YSBpbnN0YW5jZW9mIERhdGV8fGEgaW5zdGFuY2VvZiBTdHJpbmd8fGEgaW5zdGFuY2VvZiBOdW1iZXJ8fGEgaW5zdGFuY2VvZiBCb29sZWFuKXJldHVybiBhO3ZhciBoPWEgaW5zdGFuY2VvZiBBcnJheT9bXTp7fTtnLnNhdmUoYSxoKTtjKGEsZnVuY3Rpb24oYyl7dmFyIGQ9ZihhW2NdKTtzd2l0Y2godHlwZW9mIGQpe2Nhc2UgXCJib29sZWFuXCI6Y2FzZSBcIm51bWJlclwiOmNhc2UgXCJzdHJpbmdcIjpjYXNlIFwiZnVuY3Rpb25cIjpoW2NdPWQ7YnJlYWs7Y2FzZSBcIm9iamVjdFwiOmNhc2UgXCJ1bmRlZmluZWRcIjp2YXIgaz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLmdldChkKTtoW2NdPWshPT1uP2s6YihkLGYsZyl9fSk7cmV0dXJuIGh9ZnVuY3Rpb24gYyhhLGIpe2lmKGEgaW5zdGFuY2VvZiBBcnJheSl7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspYihjKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLnRvSlNPTiYmYihcInRvSlNPTlwiKX1lbHNlIGZvcihjIGluIGEpYihjKX1mdW5jdGlvbiBkKCl7dGhpcy5rZXlzPVtdO3RoaXMuTGI9W119YS5BYz1mdW5jdGlvbihjKXtpZigwPT1hcmd1bWVudHMubGVuZ3RoKXRocm93IEVycm9yKFwiV2hlbiBjYWxsaW5nIGtvLnRvSlMsIHBhc3MgdGhlIG9iamVjdCB5b3Ugd2FudCB0byBjb252ZXJ0LlwiKTtyZXR1cm4gYihjLGZ1bmN0aW9uKGIpe2Zvcih2YXIgYz0wO2EuSShiKSYmMTA+YztjKyspYj1iKCk7cmV0dXJuIGJ9KX07YS50b0pTT049ZnVuY3Rpb24oYixjLGQpe2I9YS5BYyhiKTtyZXR1cm4gYS5hLkdiKGIsYyxkKX07ZC5wcm90b3R5cGU9e3NhdmU6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEubyh0aGlzLmtleXMsXHJcbiAgICAgICAgYik7MDw9ZD90aGlzLkxiW2RdPWM6KHRoaXMua2V5cy5wdXNoKGIpLHRoaXMuTGIucHVzaChjKSl9LGdldDpmdW5jdGlvbihiKXtiPWEuYS5vKHRoaXMua2V5cyxiKTtyZXR1cm4gMDw9Yj90aGlzLkxiW2JdOm59fX0pKCk7YS5iKFwidG9KU1wiLGEuQWMpO2EuYihcInRvSlNPTlwiLGEudG9KU09OKTsoZnVuY3Rpb24oKXthLmo9e3U6ZnVuY3Rpb24oYil7c3dpdGNoKGEuYS5BKGIpKXtjYXNlIFwib3B0aW9uXCI6cmV0dXJuITA9PT1iLl9fa29fX2hhc0RvbURhdGFPcHRpb25WYWx1ZV9fP2EuYS5lLmdldChiLGEuZC5vcHRpb25zLnpiKTo3Pj1hLmEuQz9iLmdldEF0dHJpYnV0ZU5vZGUoXCJ2YWx1ZVwiKSYmYi5nZXRBdHRyaWJ1dGVOb2RlKFwidmFsdWVcIikuc3BlY2lmaWVkP2IudmFsdWU6Yi50ZXh0OmIudmFsdWU7Y2FzZSBcInNlbGVjdFwiOnJldHVybiAwPD1iLnNlbGVjdGVkSW5kZXg/YS5qLnUoYi5vcHRpb25zW2Iuc2VsZWN0ZWRJbmRleF0pOm47ZGVmYXVsdDpyZXR1cm4gYi52YWx1ZX19LGphOmZ1bmN0aW9uKGIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMsZCl7c3dpdGNoKGEuYS5BKGIpKXtjYXNlIFwib3B0aW9uXCI6c3dpdGNoKHR5cGVvZiBjKXtjYXNlIFwic3RyaW5nXCI6YS5hLmUuc2V0KGIsYS5kLm9wdGlvbnMuemIsbik7XCJfX2tvX19oYXNEb21EYXRhT3B0aW9uVmFsdWVfX1wiaW4gYiYmZGVsZXRlIGIuX19rb19faGFzRG9tRGF0YU9wdGlvblZhbHVlX187Yi52YWx1ZT1jO2JyZWFrO2RlZmF1bHQ6YS5hLmUuc2V0KGIsYS5kLm9wdGlvbnMuemIsYyksYi5fX2tvX19oYXNEb21EYXRhT3B0aW9uVmFsdWVfXz0hMCxiLnZhbHVlPVwibnVtYmVyXCI9PT10eXBlb2YgYz9jOlwiXCJ9YnJlYWs7Y2FzZSBcInNlbGVjdFwiOmlmKFwiXCI9PT1jfHxudWxsPT09YyljPW47Zm9yKHZhciBlPS0xLGY9MCxnPWIub3B0aW9ucy5sZW5ndGgsaDtmPGc7KytmKWlmKGg9YS5qLnUoYi5vcHRpb25zW2ZdKSxoPT1jfHxcIlwiPT1oJiZjPT09bil7ZT1mO2JyZWFrfWlmKGR8fDA8PWV8fGM9PT1uJiYxPGIuc2l6ZSliLnNlbGVjdGVkSW5kZXg9ZTticmVhaztkZWZhdWx0OmlmKG51bGw9PT1cclxuICAgICAgICBjfHxjPT09biljPVwiXCI7Yi52YWx1ZT1jfX19fSkoKTthLmIoXCJzZWxlY3RFeHRlbnNpb25zXCIsYS5qKTthLmIoXCJzZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZVwiLGEuai51KTthLmIoXCJzZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWVcIixhLmouamEpO2EuaD1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYil7Yj1hLmEuY2IoYik7MTIzPT09Yi5jaGFyQ29kZUF0KDApJiYoYj1iLnNsaWNlKDEsLTEpKTt2YXIgYz1bXSxkPWIubWF0Y2goZSkscixoPVtdLHA9MDtpZihkKXtkLnB1c2goXCIsXCIpO2Zvcih2YXIgQT0wLHk7eT1kW0FdOysrQSl7dmFyIHY9eS5jaGFyQ29kZUF0KDApO2lmKDQ0PT09dil7aWYoMD49cCl7Yy5wdXNoKHImJmgubGVuZ3RoP3trZXk6cix2YWx1ZTpoLmpvaW4oXCJcIil9Ont1bmtub3duOnJ8fGguam9pbihcIlwiKX0pO3I9cD0wO2g9W107Y29udGludWV9fWVsc2UgaWYoNTg9PT12KXtpZighcCYmIXImJjE9PT1oLmxlbmd0aCl7cj1oLnBvcCgpO2NvbnRpbnVlfX1lbHNlIDQ3PT09XHJcbiAgICB2JiZBJiYxPHkubGVuZ3RoPyh2PWRbQS0xXS5tYXRjaChmKSkmJiFnW3ZbMF1dJiYoYj1iLnN1YnN0cihiLmluZGV4T2YoeSkrMSksZD1iLm1hdGNoKGUpLGQucHVzaChcIixcIiksQT0tMSx5PVwiL1wiKTo0MD09PXZ8fDEyMz09PXZ8fDkxPT09dj8rK3A6NDE9PT12fHwxMjU9PT12fHw5Mz09PXY/LS1wOnJ8fGgubGVuZ3RofHwzNCE9PXYmJjM5IT09dnx8KHk9eS5zbGljZSgxLC0xKSk7aC5wdXNoKHkpfX1yZXR1cm4gY312YXIgYz1bXCJ0cnVlXCIsXCJmYWxzZVwiLFwibnVsbFwiLFwidW5kZWZpbmVkXCJdLGQ9L14oPzpbJF9hLXpdWyRcXHddKnwoLispKFxcLlxccypbJF9hLXpdWyRcXHddKnxcXFsuK1xcXSkpJC9pLGU9UmVnRXhwKFwiXFxcIig/OlteXFxcIlxcXFxcXFxcXXxcXFxcXFxcXC4pKlxcXCJ8Jyg/OlteJ1xcXFxcXFxcXXxcXFxcXFxcXC4pKid8Lyg/OlteL1xcXFxcXFxcXXxcXFxcXFxcXC4pKi93KnxbXlxcXFxzOiwvXVteLFxcXCIne30oKS86W1xcXFxdXSpbXlxcXFxzLFxcXCIne30oKS86W1xcXFxdXXxbXlxcXFxzXVwiLFwiZ1wiKSxmPS9bXFxdKVwiJ0EtWmEtejAtOV8kXSskLyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc9e1wiaW5cIjoxLFwicmV0dXJuXCI6MSxcInR5cGVvZlwiOjF9LGg9e307cmV0dXJue3ZhOltdLGdhOmgsQWI6YixYYTpmdW5jdGlvbihlLG0pe2Z1bmN0aW9uIGsoYixlKXt2YXIgbTtpZighQSl7dmFyIGw9YS5nZXRCaW5kaW5nSGFuZGxlcihiKTtpZihsJiZsLnByZXByb2Nlc3MmJiEoZT1sLnByZXByb2Nlc3MoZSxiLGspKSlyZXR1cm47aWYobD1oW2JdKW09ZSwwPD1hLmEubyhjLG0pP209ITE6KGw9bS5tYXRjaChkKSxtPW51bGw9PT1sPyExOmxbMV0/XCJPYmplY3QoXCIrbFsxXStcIilcIitsWzJdOm0pLGw9bTtsJiZnLnB1c2goXCInXCIrYitcIic6ZnVuY3Rpb24oX3ope1wiK20rXCI9X3p9XCIpfXAmJihlPVwiZnVuY3Rpb24oKXtyZXR1cm4gXCIrZStcIiB9XCIpO2YucHVzaChcIidcIitiK1wiJzpcIitlKX1tPW18fHt9O3ZhciBmPVtdLGc9W10scD1tLnZhbHVlQWNjZXNzb3JzLEE9bS5iaW5kaW5nUGFyYW1zLHk9XCJzdHJpbmdcIj09PXR5cGVvZiBlP2IoZSk6ZTthLmEucih5LGZ1bmN0aW9uKGEpe2soYS5rZXl8fFxyXG4gICAgICAgIGEudW5rbm93bixhLnZhbHVlKX0pO2cubGVuZ3RoJiZrKFwiX2tvX3Byb3BlcnR5X3dyaXRlcnNcIixcIntcIitnLmpvaW4oXCIsXCIpK1wiIH1cIik7cmV0dXJuIGYuam9pbihcIixcIil9LGZkOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspaWYoYVtjXS5rZXk9PWIpcmV0dXJuITA7cmV0dXJuITF9LEdhOmZ1bmN0aW9uKGIsYyxkLGUsZil7aWYoYiYmYS5JKGIpKSFhLkRhKGIpfHxmJiZiLnAoKT09PWV8fGIoZSk7ZWxzZSBpZigoYj1jLmdldChcIl9rb19wcm9wZXJ0eV93cml0ZXJzXCIpKSYmYltkXSliW2RdKGUpfX19KCk7YS5iKFwiZXhwcmVzc2lvblJld3JpdGluZ1wiLGEuaCk7YS5iKFwiZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnNcIixhLmgudmEpO2EuYihcImV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsXCIsYS5oLkFiKTthLmIoXCJleHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5nc1wiLGEuaC5YYSk7YS5iKFwiZXhwcmVzc2lvblJld3JpdGluZy5fdHdvV2F5QmluZGluZ3NcIixcclxuICAgICAgICBhLmguZ2EpO2EuYihcImpzb25FeHByZXNzaW9uUmV3cml0aW5nXCIsYS5oKTthLmIoXCJqc29uRXhwcmVzc2lvblJld3JpdGluZy5pbnNlcnRQcm9wZXJ0eUFjY2Vzc29yc0ludG9Kc29uXCIsYS5oLlhhKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEpe3JldHVybiA4PT1hLm5vZGVUeXBlJiZnLnRlc3QoZj9hLnRleHQ6YS5ub2RlVmFsdWUpfWZ1bmN0aW9uIGMoYSl7cmV0dXJuIDg9PWEubm9kZVR5cGUmJmgudGVzdChmP2EudGV4dDphLm5vZGVWYWx1ZSl9ZnVuY3Rpb24gZChhLGQpe2Zvcih2YXIgZT1hLGY9MSxsPVtdO2U9ZS5uZXh0U2libGluZzspe2lmKGMoZSkmJihmLS0sMD09PWYpKXJldHVybiBsO2wucHVzaChlKTtiKGUpJiZmKyt9aWYoIWQpdGhyb3cgRXJyb3IoXCJDYW5ub3QgZmluZCBjbG9zaW5nIGNvbW1lbnQgdGFnIHRvIG1hdGNoOiBcIithLm5vZGVWYWx1ZSk7cmV0dXJuIG51bGx9ZnVuY3Rpb24gZShhLGIpe3ZhciBjPWQoYSxiKTtyZXR1cm4gYz8wPGMubGVuZ3RoP2NbYy5sZW5ndGgtXHJcbiAgICAxXS5uZXh0U2libGluZzphLm5leHRTaWJsaW5nOm51bGx9dmFyIGY9dCYmXCJcXHgzYyEtLXRlc3QtLVxceDNlXCI9PT10LmNyZWF0ZUNvbW1lbnQoXCJ0ZXN0XCIpLnRleHQsZz1mPy9eXFx4M2MhLS1cXHMqa28oPzpcXHMrKFtcXHNcXFNdKykpP1xccyotLVxceDNlJC86L15cXHMqa28oPzpcXHMrKFtcXHNcXFNdKykpP1xccyokLyxoPWY/L15cXHgzYyEtLVxccypcXC9rb1xccyotLVxceDNlJC86L15cXHMqXFwva29cXHMqJC8sbD17dWw6ITAsb2w6ITB9O2EuZj17YWE6e30sY2hpbGROb2RlczpmdW5jdGlvbihhKXtyZXR1cm4gYihhKT9kKGEpOmEuY2hpbGROb2Rlc30semE6ZnVuY3Rpb24oYyl7aWYoYihjKSl7Yz1hLmYuY2hpbGROb2RlcyhjKTtmb3IodmFyIGQ9MCxlPWMubGVuZ3RoO2Q8ZTtkKyspYS5yZW1vdmVOb2RlKGNbZF0pfWVsc2UgYS5hLnJiKGMpfSxmYTpmdW5jdGlvbihjLGQpe2lmKGIoYykpe2EuZi56YShjKTtmb3IodmFyIGU9Yy5uZXh0U2libGluZyxmPTAsbD1kLmxlbmd0aDtmPGw7ZisrKWUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZFtmXSxcclxuICAgICAgICBlKX1lbHNlIGEuYS5mYShjLGQpfSxxYzpmdW5jdGlvbihhLGMpe2IoYSk/YS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjLGEubmV4dFNpYmxpbmcpOmEuZmlyc3RDaGlsZD9hLmluc2VydEJlZm9yZShjLGEuZmlyc3RDaGlsZCk6YS5hcHBlbmRDaGlsZChjKX0sa2M6ZnVuY3Rpb24oYyxkLGUpe2U/YihjKT9jLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGQsZS5uZXh0U2libGluZyk6ZS5uZXh0U2libGluZz9jLmluc2VydEJlZm9yZShkLGUubmV4dFNpYmxpbmcpOmMuYXBwZW5kQ2hpbGQoZCk6YS5mLnFjKGMsZCl9LGZpcnN0Q2hpbGQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGIoYSk/IWEubmV4dFNpYmxpbmd8fGMoYS5uZXh0U2libGluZyk/bnVsbDphLm5leHRTaWJsaW5nOmEuZmlyc3RDaGlsZH0sbmV4dFNpYmxpbmc6ZnVuY3Rpb24oYSl7YihhKSYmKGE9ZShhKSk7cmV0dXJuIGEubmV4dFNpYmxpbmcmJmMoYS5uZXh0U2libGluZyk/bnVsbDphLm5leHRTaWJsaW5nfSxZYzpiLHZkOmZ1bmN0aW9uKGEpe3JldHVybihhPVxyXG4gICAgICAgIChmP2EudGV4dDphLm5vZGVWYWx1ZSkubWF0Y2goZykpP2FbMV06bnVsbH0sb2M6ZnVuY3Rpb24oZCl7aWYobFthLmEuQShkKV0pe3ZhciBrPWQuZmlyc3RDaGlsZDtpZihrKXtkbyBpZigxPT09ay5ub2RlVHlwZSl7dmFyIGY7Zj1rLmZpcnN0Q2hpbGQ7dmFyIGc9bnVsbDtpZihmKXtkbyBpZihnKWcucHVzaChmKTtlbHNlIGlmKGIoZikpe3ZhciBoPWUoZiwhMCk7aD9mPWg6Zz1bZl19ZWxzZSBjKGYpJiYoZz1bZl0pO3doaWxlKGY9Zi5uZXh0U2libGluZyl9aWYoZj1nKWZvcihnPWsubmV4dFNpYmxpbmcsaD0wO2g8Zi5sZW5ndGg7aCsrKWc/ZC5pbnNlcnRCZWZvcmUoZltoXSxnKTpkLmFwcGVuZENoaWxkKGZbaF0pfXdoaWxlKGs9ay5uZXh0U2libGluZyl9fX19fSkoKTthLmIoXCJ2aXJ0dWFsRWxlbWVudHNcIixhLmYpO2EuYihcInZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NcIixhLmYuYWEpO2EuYihcInZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGVcIixhLmYuemEpO2EuYihcInZpcnR1YWxFbGVtZW50cy5pbnNlcnRBZnRlclwiLFxyXG4gICAgICAgIGEuZi5rYyk7YS5iKFwidmlydHVhbEVsZW1lbnRzLnByZXBlbmRcIixhLmYucWMpO2EuYihcInZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW5cIixhLmYuZmEpOyhmdW5jdGlvbigpe2EuUz1mdW5jdGlvbigpe3RoaXMuS2M9e319O2EuYS5leHRlbmQoYS5TLnByb3RvdHlwZSx7bm9kZUhhc0JpbmRpbmdzOmZ1bmN0aW9uKGIpe3N3aXRjaChiLm5vZGVUeXBlKXtjYXNlIDE6cmV0dXJuIG51bGwhPWIuZ2V0QXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpfHxhLmcuZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUoYik7Y2FzZSA4OnJldHVybiBhLmYuWWMoYik7ZGVmYXVsdDpyZXR1cm4hMX19LGdldEJpbmRpbmdzOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9dGhpcy5nZXRCaW5kaW5nc1N0cmluZyhiLGMpLGQ9ZD90aGlzLnBhcnNlQmluZGluZ3NTdHJpbmcoZCxjLGIpOm51bGw7cmV0dXJuIGEuZy5SYihkLGIsYywhMSl9LGdldEJpbmRpbmdBY2Nlc3NvcnM6ZnVuY3Rpb24oYixjKXt2YXIgZD10aGlzLmdldEJpbmRpbmdzU3RyaW5nKGIsXHJcbiAgICAgICAgYyksZD1kP3RoaXMucGFyc2VCaW5kaW5nc1N0cmluZyhkLGMsYix7dmFsdWVBY2Nlc3NvcnM6ITB9KTpudWxsO3JldHVybiBhLmcuUmIoZCxiLGMsITApfSxnZXRCaW5kaW5nc1N0cmluZzpmdW5jdGlvbihiKXtzd2l0Y2goYi5ub2RlVHlwZSl7Y2FzZSAxOnJldHVybiBiLmdldEF0dHJpYnV0ZShcImRhdGEtYmluZFwiKTtjYXNlIDg6cmV0dXJuIGEuZi52ZChiKTtkZWZhdWx0OnJldHVybiBudWxsfX0scGFyc2VCaW5kaW5nc1N0cmluZzpmdW5jdGlvbihiLGMsZCxlKXt0cnl7dmFyIGY9dGhpcy5LYyxnPWIrKGUmJmUudmFsdWVBY2Nlc3NvcnN8fFwiXCIpLGg7aWYoIShoPWZbZ10pKXt2YXIgbCxtPVwid2l0aCgkY29udGV4dCl7d2l0aCgkZGF0YXx8e30pe3JldHVybntcIithLmguWGEoYixlKStcIn19fVwiO2w9bmV3IEZ1bmN0aW9uKFwiJGNvbnRleHRcIixcIiRlbGVtZW50XCIsbSk7aD1mW2ddPWx9cmV0dXJuIGgoYyxkKX1jYXRjaChrKXt0aHJvdyBrLm1lc3NhZ2U9XCJVbmFibGUgdG8gcGFyc2UgYmluZGluZ3MuXFxuQmluZGluZ3MgdmFsdWU6IFwiK1xyXG4gICAgICAgIGIrXCJcXG5NZXNzYWdlOiBcIitrLm1lc3NhZ2Usazt9fX0pO2EuUy5pbnN0YW5jZT1uZXcgYS5TfSkoKTthLmIoXCJiaW5kaW5nUHJvdmlkZXJcIixhLlMpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGF9fWZ1bmN0aW9uIGMoYSl7cmV0dXJuIGEoKX1mdW5jdGlvbiBkKGIpe3JldHVybiBhLmEuRWEoYS5sLncoYiksZnVuY3Rpb24oYSxjKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYigpW2NdfX0pfWZ1bmN0aW9uIGUoYyxlLGspe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBjP2QoYy5iaW5kKG51bGwsZSxrKSk6YS5hLkVhKGMsYil9ZnVuY3Rpb24gZihhLGIpe3JldHVybiBkKHRoaXMuZ2V0QmluZGluZ3MuYmluZCh0aGlzLGEsYikpfWZ1bmN0aW9uIGcoYixjLGQpe3ZhciBlLGs9YS5mLmZpcnN0Q2hpbGQoYyksZj1hLlMuaW5zdGFuY2UsbT1mLnByZXByb2Nlc3NOb2RlO2lmKG0pe2Zvcig7ZT1rOylrPWEuZi5uZXh0U2libGluZyhlKSxcclxuICAgICAgICBtLmNhbGwoZixlKTtrPWEuZi5maXJzdENoaWxkKGMpfWZvcig7ZT1rOylrPWEuZi5uZXh0U2libGluZyhlKSxoKGIsZSxkKX1mdW5jdGlvbiBoKGIsYyxkKXt2YXIgZT0hMCxrPTE9PT1jLm5vZGVUeXBlO2smJmEuZi5vYyhjKTtpZihrJiZkfHxhLlMuaW5zdGFuY2Uubm9kZUhhc0JpbmRpbmdzKGMpKWU9bShjLG51bGwsYixkKS5zaG91bGRCaW5kRGVzY2VuZGFudHM7ZSYmIXJbYS5hLkEoYyldJiZnKGIsYywhayl9ZnVuY3Rpb24gbChiKXt2YXIgYz1bXSxkPXt9LGU9W107YS5hLkQoYixmdW5jdGlvbiBYKGspe2lmKCFkW2tdKXt2YXIgZj1hLmdldEJpbmRpbmdIYW5kbGVyKGspO2YmJihmLmFmdGVyJiYoZS5wdXNoKGspLGEuYS5yKGYuYWZ0ZXIsZnVuY3Rpb24oYyl7aWYoYltjXSl7aWYoLTEhPT1hLmEubyhlLGMpKXRocm93IEVycm9yKFwiQ2Fubm90IGNvbWJpbmUgdGhlIGZvbGxvd2luZyBiaW5kaW5ncywgYmVjYXVzZSB0aGV5IGhhdmUgYSBjeWNsaWMgZGVwZW5kZW5jeTogXCIrZS5qb2luKFwiLCBcIikpO1xyXG4gICAgICAgIFgoYyl9fSksZS5sZW5ndGgtLSksYy5wdXNoKHtrZXk6ayxqYzpmfSkpO2Rba109ITB9fSk7cmV0dXJuIGN9ZnVuY3Rpb24gbShiLGQsZSxrKXt2YXIgbT1hLmEuZS5nZXQoYixxKTtpZighZCl7aWYobSl0aHJvdyBFcnJvcihcIllvdSBjYW5ub3QgYXBwbHkgYmluZGluZ3MgbXVsdGlwbGUgdGltZXMgdG8gdGhlIHNhbWUgZWxlbWVudC5cIik7YS5hLmUuc2V0KGIscSwhMCl9IW0mJmsmJmEueGMoYixlKTt2YXIgZztpZihkJiZcImZ1bmN0aW9uXCIhPT10eXBlb2YgZClnPWQ7ZWxzZXt2YXIgaD1hLlMuaW5zdGFuY2Uscj1oLmdldEJpbmRpbmdBY2Nlc3NvcnN8fGYscD1hLkIoZnVuY3Rpb24oKXsoZz1kP2QoZSxiKTpyLmNhbGwoaCxiLGUpKSYmZS5RJiZlLlEoKTtyZXR1cm4gZ30sbnVsbCx7aTpifSk7ZyYmcC5jYSgpfHwocD1udWxsKX12YXIgcztpZihnKXt2YXIgdD1wP2Z1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBjKHAoKVthXSl9fTpmdW5jdGlvbihhKXtyZXR1cm4gZ1thXX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHU9ZnVuY3Rpb24oKXtyZXR1cm4gYS5hLkVhKHA/cCgpOmcsYyl9O3UuZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiBnW2FdJiZjKHQoYSkpfTt1Lmhhcz1mdW5jdGlvbihhKXtyZXR1cm4gYSBpbiBnfTtrPWwoZyk7YS5hLnIoayxmdW5jdGlvbihjKXt2YXIgZD1jLmpjLmluaXQsaz1jLmpjLnVwZGF0ZSxmPWMua2V5O2lmKDg9PT1iLm5vZGVUeXBlJiYhYS5mLmFhW2ZdKXRocm93IEVycm9yKFwiVGhlIGJpbmRpbmcgJ1wiK2YrXCInIGNhbm5vdCBiZSB1c2VkIHdpdGggdmlydHVhbCBlbGVtZW50c1wiKTt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2YgZCYmYS5sLncoZnVuY3Rpb24oKXt2YXIgYT1kKGIsdChmKSx1LGUuJGRhdGEsZSk7aWYoYSYmYS5jb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyl7aWYocyE9PW4pdGhyb3cgRXJyb3IoXCJNdWx0aXBsZSBiaW5kaW5ncyAoXCIrcytcIiBhbmQgXCIrZitcIikgYXJlIHRyeWluZyB0byBjb250cm9sIGRlc2NlbmRhbnQgYmluZGluZ3Mgb2YgdGhlIHNhbWUgZWxlbWVudC4gWW91IGNhbm5vdCB1c2UgdGhlc2UgYmluZGluZ3MgdG9nZXRoZXIgb24gdGhlIHNhbWUgZWxlbWVudC5cIik7XHJcbiAgICAgICAgcz1mfX0pLFwiZnVuY3Rpb25cIj09dHlwZW9mIGsmJmEuQihmdW5jdGlvbigpe2soYix0KGYpLHUsZS4kZGF0YSxlKX0sbnVsbCx7aTpifSl9Y2F0Y2gobSl7dGhyb3cgbS5tZXNzYWdlPSdVbmFibGUgdG8gcHJvY2VzcyBiaW5kaW5nIFwiJytmK1wiOiBcIitnW2ZdKydcIlxcbk1lc3NhZ2U6ICcrbS5tZXNzYWdlLG07fX0pfXJldHVybntzaG91bGRCaW5kRGVzY2VuZGFudHM6cz09PW59fWZ1bmN0aW9uIGsoYil7cmV0dXJuIGImJmIgaW5zdGFuY2VvZiBhLlI/YjpuZXcgYS5SKGIpfWEuZD17fTt2YXIgcj17c2NyaXB0OiEwLHRleHRhcmVhOiEwLHRlbXBsYXRlOiEwfTthLmdldEJpbmRpbmdIYW5kbGVyPWZ1bmN0aW9uKGIpe3JldHVybiBhLmRbYl19O2EuUj1mdW5jdGlvbihiLGMsZCxlLGspe2Z1bmN0aW9uIGYoKXt2YXIgaz1nP2IoKTpiLG09YS5hLmMoayk7Yz8oYy5RJiZjLlEoKSxhLmEuZXh0ZW5kKGwsYyksbC5RPXIpOihsLiRwYXJlbnRzPVtdLGwuJHJvb3Q9bSxsLmtvPWEpO2wuJHJhd0RhdGE9XHJcbiAgICAgICAgaztsLiRkYXRhPW07ZCYmKGxbZF09bSk7ZSYmZShsLGMsbSk7cmV0dXJuIGwuJGRhdGF9ZnVuY3Rpb24gbSgpe3JldHVybiBoJiYhYS5hLlRiKGgpfXZhciBsPXRoaXMsZz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBiJiYhYS5JKGIpLGgscjtrJiZrLmV4cG9ydERlcGVuZGVuY2llcz9mKCk6KHI9YS5CKGYsbnVsbCx7eWE6bSxpOiEwfSksci5jYSgpJiYobC5RPXIsci5lcXVhbGl0eUNvbXBhcmVyPW51bGwsaD1bXSxyLkRjPWZ1bmN0aW9uKGIpe2gucHVzaChiKTthLmEuRy5xYShiLGZ1bmN0aW9uKGIpe2EuYS5OYShoLGIpO2gubGVuZ3RofHwoci5rKCksbC5RPXI9bil9KX0pKX07YS5SLnByb3RvdHlwZS5jcmVhdGVDaGlsZENvbnRleHQ9ZnVuY3Rpb24oYixjLGQsZSl7cmV0dXJuIG5ldyBhLlIoYix0aGlzLGMsZnVuY3Rpb24oYSxiKXthLiRwYXJlbnRDb250ZXh0PWI7YS4kcGFyZW50PWIuJGRhdGE7YS4kcGFyZW50cz0oYi4kcGFyZW50c3x8W10pLnNsaWNlKDApO2EuJHBhcmVudHMudW5zaGlmdChhLiRwYXJlbnQpO1xyXG4gICAgICAgIGQmJmQoYSl9LGUpfTthLlIucHJvdG90eXBlLmV4dGVuZD1mdW5jdGlvbihiKXtyZXR1cm4gbmV3IGEuUih0aGlzLlF8fHRoaXMuJGRhdGEsdGhpcyxudWxsLGZ1bmN0aW9uKGMsZCl7Yy4kcmF3RGF0YT1kLiRyYXdEYXRhO2EuYS5leHRlbmQoYyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBiP2IoKTpiKX0pfTthLlIucHJvdG90eXBlLmFjPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuY3JlYXRlQ2hpbGRDb250ZXh0KGEsYixudWxsLHtleHBvcnREZXBlbmRlbmNpZXM6ITB9KX07dmFyIHE9YS5hLmUuSigpLHA9YS5hLmUuSigpO2EueGM9ZnVuY3Rpb24oYixjKXtpZigyPT1hcmd1bWVudHMubGVuZ3RoKWEuYS5lLnNldChiLHAsYyksYy5RJiZjLlEuRGMoYik7ZWxzZSByZXR1cm4gYS5hLmUuZ2V0KGIscCl9O2EuTGE9ZnVuY3Rpb24oYixjLGQpezE9PT1iLm5vZGVUeXBlJiZhLmYub2MoYik7cmV0dXJuIG0oYixjLGsoZCksITApfTthLkljPWZ1bmN0aW9uKGIsYyxkKXtkPWsoZCk7cmV0dXJuIGEuTGEoYixcclxuICAgICAgICBlKGMsZCxiKSxkKX07YS5oYj1mdW5jdGlvbihhLGIpezEhPT1iLm5vZGVUeXBlJiY4IT09Yi5ub2RlVHlwZXx8ZyhrKGEpLGIsITApfTthLlViPWZ1bmN0aW9uKGEsYil7IXUmJngualF1ZXJ5JiYodT14LmpRdWVyeSk7aWYoYiYmMSE9PWIubm9kZVR5cGUmJjghPT1iLm5vZGVUeXBlKXRocm93IEVycm9yKFwia28uYXBwbHlCaW5kaW5nczogZmlyc3QgcGFyYW1ldGVyIHNob3VsZCBiZSB5b3VyIHZpZXcgbW9kZWw7IHNlY29uZCBwYXJhbWV0ZXIgc2hvdWxkIGJlIGEgRE9NIG5vZGVcIik7Yj1ifHx4LmRvY3VtZW50LmJvZHk7aChrKGEpLGIsITApfTthLm5iPWZ1bmN0aW9uKGIpe3N3aXRjaChiLm5vZGVUeXBlKXtjYXNlIDE6Y2FzZSA4OnZhciBjPWEueGMoYik7aWYoYylyZXR1cm4gYztpZihiLnBhcmVudE5vZGUpcmV0dXJuIGEubmIoYi5wYXJlbnROb2RlKX1yZXR1cm4gbn07YS5PYz1mdW5jdGlvbihiKXtyZXR1cm4oYj1hLm5iKGIpKT9iLiRkYXRhOm59O2EuYihcImJpbmRpbmdIYW5kbGVyc1wiLFxyXG4gICAgICAgIGEuZCk7YS5iKFwiYXBwbHlCaW5kaW5nc1wiLGEuVWIpO2EuYihcImFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzXCIsYS5oYik7YS5iKFwiYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlXCIsYS5MYSk7YS5iKFwiYXBwbHlCaW5kaW5nc1RvTm9kZVwiLGEuSWMpO2EuYihcImNvbnRleHRGb3JcIixhLm5iKTthLmIoXCJkYXRhRm9yXCIsYS5PYyl9KSgpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGMsZSl7dmFyIG09Zi5oYXNPd25Qcm9wZXJ0eShjKT9mW2NdOmIsazttP20uWShlKToobT1mW2NdPW5ldyBhLkssbS5ZKGUpLGQoYyxmdW5jdGlvbihiLGQpe3ZhciBlPSEoIWR8fCFkLnN5bmNocm9ub3VzKTtnW2NdPXtkZWZpbml0aW9uOmIsZGQ6ZX07ZGVsZXRlIGZbY107a3x8ZT9tLm5vdGlmeVN1YnNjcmliZXJzKGIpOmEuWi5aYShmdW5jdGlvbigpe20ubm90aWZ5U3Vic2NyaWJlcnMoYil9KX0pLGs9ITApfWZ1bmN0aW9uIGQoYSxiKXtlKFwiZ2V0Q29uZmlnXCIsW2FdLGZ1bmN0aW9uKGMpe2M/ZShcImxvYWRDb21wb25lbnRcIixcclxuICAgICAgICBbYSxjXSxmdW5jdGlvbihhKXtiKGEsYyl9KTpiKG51bGwsbnVsbCl9KX1mdW5jdGlvbiBlKGMsZCxmLGspe2t8fChrPWEuZy5sb2FkZXJzLnNsaWNlKDApKTt2YXIgZz1rLnNoaWZ0KCk7aWYoZyl7dmFyIHE9Z1tjXTtpZihxKXt2YXIgcD0hMTtpZihxLmFwcGx5KGcsZC5jb25jYXQoZnVuY3Rpb24oYSl7cD9mKG51bGwpOm51bGwhPT1hP2YoYSk6ZShjLGQsZixrKX0pKSE9PWImJihwPSEwLCFnLnN1cHByZXNzTG9hZGVyRXhjZXB0aW9ucykpdGhyb3cgRXJyb3IoXCJDb21wb25lbnQgbG9hZGVycyBtdXN0IHN1cHBseSB2YWx1ZXMgYnkgaW52b2tpbmcgdGhlIGNhbGxiYWNrLCBub3QgYnkgcmV0dXJuaW5nIHZhbHVlcyBzeW5jaHJvbm91c2x5LlwiKTt9ZWxzZSBlKGMsZCxmLGspfWVsc2UgZihudWxsKX12YXIgZj17fSxnPXt9O2EuZz17Z2V0OmZ1bmN0aW9uKGQsZSl7dmFyIGY9Zy5oYXNPd25Qcm9wZXJ0eShkKT9nW2RdOmI7Zj9mLmRkP2EubC53KGZ1bmN0aW9uKCl7ZShmLmRlZmluaXRpb24pfSk6XHJcbiAgICAgICAgYS5aLlphKGZ1bmN0aW9uKCl7ZShmLmRlZmluaXRpb24pfSk6YyhkLGUpfSwkYjpmdW5jdGlvbihhKXtkZWxldGUgZ1thXX0sTmI6ZX07YS5nLmxvYWRlcnM9W107YS5iKFwiY29tcG9uZW50c1wiLGEuZyk7YS5iKFwiY29tcG9uZW50cy5nZXRcIixhLmcuZ2V0KTthLmIoXCJjb21wb25lbnRzLmNsZWFyQ2FjaGVkRGVmaW5pdGlvblwiLGEuZy4kYil9KSgpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixjLGQsZSl7ZnVuY3Rpb24gZygpezA9PT0tLXkmJmUoaCl9dmFyIGg9e30seT0yLHY9ZC50ZW1wbGF0ZTtkPWQudmlld01vZGVsO3Y/ZihjLHYsZnVuY3Rpb24oYyl7YS5nLk5iKFwibG9hZFRlbXBsYXRlXCIsW2IsY10sZnVuY3Rpb24oYSl7aC50ZW1wbGF0ZT1hO2coKX0pfSk6ZygpO2Q/ZihjLGQsZnVuY3Rpb24oYyl7YS5nLk5iKFwibG9hZFZpZXdNb2RlbFwiLFtiLGNdLGZ1bmN0aW9uKGEpe2hbbF09YTtnKCl9KX0pOmcoKX1mdW5jdGlvbiBjKGEsYixkKXtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilkKGZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYihhKX0pO1xyXG4gICAgZWxzZSBpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYltsXSlkKGJbbF0pO2Vsc2UgaWYoXCJpbnN0YW5jZVwiaW4gYil7dmFyIGU9Yi5pbnN0YW5jZTtkKGZ1bmN0aW9uKCl7cmV0dXJuIGV9KX1lbHNlXCJ2aWV3TW9kZWxcImluIGI/YyhhLGIudmlld01vZGVsLGQpOmEoXCJVbmtub3duIHZpZXdNb2RlbCB2YWx1ZTogXCIrYil9ZnVuY3Rpb24gZChiKXtzd2l0Y2goYS5hLkEoYikpe2Nhc2UgXCJzY3JpcHRcIjpyZXR1cm4gYS5hLm5hKGIudGV4dCk7Y2FzZSBcInRleHRhcmVhXCI6cmV0dXJuIGEuYS5uYShiLnZhbHVlKTtjYXNlIFwidGVtcGxhdGVcIjppZihlKGIuY29udGVudCkpcmV0dXJuIGEuYS53YShiLmNvbnRlbnQuY2hpbGROb2Rlcyl9cmV0dXJuIGEuYS53YShiLmNoaWxkTm9kZXMpfWZ1bmN0aW9uIGUoYSl7cmV0dXJuIHguRG9jdW1lbnRGcmFnbWVudD9hIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudDphJiYxMT09PWEubm9kZVR5cGV9ZnVuY3Rpb24gZihhLGIsYyl7XCJzdHJpbmdcIj09PXR5cGVvZiBiLnJlcXVpcmU/XHJcbiAgICAgICAgT3x8eC5yZXF1aXJlPyhPfHx4LnJlcXVpcmUpKFtiLnJlcXVpcmVdLGMpOmEoXCJVc2VzIHJlcXVpcmUsIGJ1dCBubyBBTUQgbG9hZGVyIGlzIHByZXNlbnRcIik6YyhiKX1mdW5jdGlvbiBnKGEpe3JldHVybiBmdW5jdGlvbihiKXt0aHJvdyBFcnJvcihcIkNvbXBvbmVudCAnXCIrYStcIic6IFwiK2IpO319dmFyIGg9e307YS5nLnJlZ2lzdGVyPWZ1bmN0aW9uKGIsYyl7aWYoIWMpdGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbmZpZ3VyYXRpb24gZm9yIFwiK2IpO2lmKGEuZy53YihiKSl0aHJvdyBFcnJvcihcIkNvbXBvbmVudCBcIitiK1wiIGlzIGFscmVhZHkgcmVnaXN0ZXJlZFwiKTtoW2JdPWN9O2EuZy53Yj1mdW5jdGlvbihhKXtyZXR1cm4gaC5oYXNPd25Qcm9wZXJ0eShhKX07YS5nLnVkPWZ1bmN0aW9uKGIpe2RlbGV0ZSBoW2JdO2EuZy4kYihiKX07YS5nLmNjPXtnZXRDb25maWc6ZnVuY3Rpb24oYSxiKXtiKGguaGFzT3duUHJvcGVydHkoYSk/aFthXTpudWxsKX0sbG9hZENvbXBvbmVudDpmdW5jdGlvbihhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyxkKXt2YXIgZT1nKGEpO2YoZSxjLGZ1bmN0aW9uKGMpe2IoYSxlLGMsZCl9KX0sbG9hZFRlbXBsYXRlOmZ1bmN0aW9uKGIsYyxmKXtiPWcoYik7aWYoXCJzdHJpbmdcIj09PXR5cGVvZiBjKWYoYS5hLm5hKGMpKTtlbHNlIGlmKGMgaW5zdGFuY2VvZiBBcnJheSlmKGMpO2Vsc2UgaWYoZShjKSlmKGEuYS5XKGMuY2hpbGROb2RlcykpO2Vsc2UgaWYoYy5lbGVtZW50KWlmKGM9Yy5lbGVtZW50LHguSFRNTEVsZW1lbnQ/YyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50OmMmJmMudGFnTmFtZSYmMT09PWMubm9kZVR5cGUpZihkKGMpKTtlbHNlIGlmKFwic3RyaW5nXCI9PT10eXBlb2YgYyl7dmFyIGw9dC5nZXRFbGVtZW50QnlJZChjKTtsP2YoZChsKSk6YihcIkNhbm5vdCBmaW5kIGVsZW1lbnQgd2l0aCBJRCBcIitjKX1lbHNlIGIoXCJVbmtub3duIGVsZW1lbnQgdHlwZTogXCIrYyk7ZWxzZSBiKFwiVW5rbm93biB0ZW1wbGF0ZSB2YWx1ZTogXCIrYyl9LGxvYWRWaWV3TW9kZWw6ZnVuY3Rpb24oYSxiLGQpe2MoZyhhKSxcclxuICAgICAgICBiLGQpfX07dmFyIGw9XCJjcmVhdGVWaWV3TW9kZWxcIjthLmIoXCJjb21wb25lbnRzLnJlZ2lzdGVyXCIsYS5nLnJlZ2lzdGVyKTthLmIoXCJjb21wb25lbnRzLmlzUmVnaXN0ZXJlZFwiLGEuZy53Yik7YS5iKFwiY29tcG9uZW50cy51bnJlZ2lzdGVyXCIsYS5nLnVkKTthLmIoXCJjb21wb25lbnRzLmRlZmF1bHRMb2FkZXJcIixhLmcuY2MpO2EuZy5sb2FkZXJzLnB1c2goYS5nLmNjKTthLmcuRWM9aH0pKCk7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGUpe3ZhciBmPWIuZ2V0QXR0cmlidXRlKFwicGFyYW1zXCIpO2lmKGYpe3ZhciBmPWMucGFyc2VCaW5kaW5nc1N0cmluZyhmLGUsYix7dmFsdWVBY2Nlc3NvcnM6ITAsYmluZGluZ1BhcmFtczohMH0pLGY9YS5hLkVhKGYsZnVuY3Rpb24oYyl7cmV0dXJuIGEubShjLG51bGwse2k6Yn0pfSksZz1hLmEuRWEoZixmdW5jdGlvbihjKXt2YXIgZT1jLnAoKTtyZXR1cm4gYy5jYSgpP2EubSh7cmVhZDpmdW5jdGlvbigpe3JldHVybiBhLmEuYyhjKCkpfSx3cml0ZTphLkRhKGUpJiZcclxuICAgIGZ1bmN0aW9uKGEpe2MoKShhKX0saTpifSk6ZX0pO2cuaGFzT3duUHJvcGVydHkoXCIkcmF3XCIpfHwoZy4kcmF3PWYpO3JldHVybiBnfXJldHVybnskcmF3Ont9fX1hLmcuZ2V0Q29tcG9uZW50TmFtZUZvck5vZGU9ZnVuY3Rpb24oYil7dmFyIGM9YS5hLkEoYik7aWYoYS5nLndiKGMpJiYoLTEhPWMuaW5kZXhPZihcIi1cIil8fFwiW29iamVjdCBIVE1MVW5rbm93bkVsZW1lbnRdXCI9PVwiXCIrYnx8OD49YS5hLkMmJmIudGFnTmFtZT09PWMpKXJldHVybiBjfTthLmcuUmI9ZnVuY3Rpb24oYyxlLGYsZyl7aWYoMT09PWUubm9kZVR5cGUpe3ZhciBoPWEuZy5nZXRDb21wb25lbnROYW1lRm9yTm9kZShlKTtpZihoKXtjPWN8fHt9O2lmKGMuY29tcG9uZW50KXRocm93IEVycm9yKCdDYW5ub3QgdXNlIHRoZSBcImNvbXBvbmVudFwiIGJpbmRpbmcgb24gYSBjdXN0b20gZWxlbWVudCBtYXRjaGluZyBhIGNvbXBvbmVudCcpO3ZhciBsPXtuYW1lOmgscGFyYW1zOmIoZSxmKX07Yy5jb21wb25lbnQ9Zz9mdW5jdGlvbigpe3JldHVybiBsfTpcclxuICAgICAgICBsfX1yZXR1cm4gY307dmFyIGM9bmV3IGEuUzs5PmEuYS5DJiYoYS5nLnJlZ2lzdGVyPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXt0LmNyZWF0ZUVsZW1lbnQoYik7cmV0dXJuIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0oYS5nLnJlZ2lzdGVyKSx0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ9ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9YigpLGY9YS5nLkVjLGc7Zm9yKGcgaW4gZilmLmhhc093blByb3BlcnR5KGcpJiZjLmNyZWF0ZUVsZW1lbnQoZyk7cmV0dXJuIGN9fSh0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQpKX0pKCk7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoYixjLGQpe2M9Yy50ZW1wbGF0ZTtpZighYyl0aHJvdyBFcnJvcihcIkNvbXBvbmVudCAnXCIrYitcIicgaGFzIG5vIHRlbXBsYXRlXCIpO2I9YS5hLndhKGMpO2EuZi5mYShkLGIpfWZ1bmN0aW9uIGQoYSxiLGMsZCl7dmFyIGU9YS5jcmVhdGVWaWV3TW9kZWw7cmV0dXJuIGU/ZS5jYWxsKGEsXHJcbiAgICAgICAgZCx7ZWxlbWVudDpiLHRlbXBsYXRlTm9kZXM6Y30pOmR9dmFyIGU9MDthLmQuY29tcG9uZW50PXtpbml0OmZ1bmN0aW9uKGYsZyxoLGwsbSl7ZnVuY3Rpb24gaygpe3ZhciBhPXImJnIuZGlzcG9zZTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgYSYmYS5jYWxsKHIpO3E9cj1udWxsfXZhciByLHEscD1hLmEuVyhhLmYuY2hpbGROb2RlcyhmKSk7YS5hLkcucWEoZixrKTthLm0oZnVuY3Rpb24oKXt2YXIgbD1hLmEuYyhnKCkpLGgsdjtcInN0cmluZ1wiPT09dHlwZW9mIGw/aD1sOihoPWEuYS5jKGwubmFtZSksdj1hLmEuYyhsLnBhcmFtcykpO2lmKCFoKXRocm93IEVycm9yKFwiTm8gY29tcG9uZW50IG5hbWUgc3BlY2lmaWVkXCIpO3ZhciBuPXE9KytlO2EuZy5nZXQoaCxmdW5jdGlvbihlKXtpZihxPT09bil7aygpO2lmKCFlKXRocm93IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgJ1wiK2grXCInXCIpO2MoaCxlLGYpO3ZhciBsPWQoZSxmLHAsdik7ZT1tLmNyZWF0ZUNoaWxkQ29udGV4dChsLGIsZnVuY3Rpb24oYSl7YS4kY29tcG9uZW50PVxyXG4gICAgICAgIGw7YS4kY29tcG9uZW50VGVtcGxhdGVOb2Rlcz1wfSk7cj1sO2EuaGIoZSxmKX19KX0sbnVsbCx7aTpmfSk7cmV0dXJue2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiEwfX19O2EuZi5hYS5jb21wb25lbnQ9ITB9KSgpO3ZhciBRPXtcImNsYXNzXCI6XCJjbGFzc05hbWVcIixcImZvclwiOlwiaHRtbEZvclwifTthLmQuYXR0cj17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYygpKXx8e307YS5hLkQoZCxmdW5jdGlvbihjLGQpe2Q9YS5hLmMoZCk7dmFyIGc9ITE9PT1kfHxudWxsPT09ZHx8ZD09PW47ZyYmYi5yZW1vdmVBdHRyaWJ1dGUoYyk7OD49YS5hLkMmJmMgaW4gUT8oYz1RW2NdLGc/Yi5yZW1vdmVBdHRyaWJ1dGUoYyk6YltjXT1kKTpnfHxiLnNldEF0dHJpYnV0ZShjLGQudG9TdHJpbmcoKSk7XCJuYW1lXCI9PT1jJiZhLmEudmMoYixnP1wiXCI6ZC50b1N0cmluZygpKX0pfX07KGZ1bmN0aW9uKCl7YS5kLmNoZWNrZWQ9e2FmdGVyOltcInZhbHVlXCIsXCJhdHRyXCJdLGluaXQ6ZnVuY3Rpb24oYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyxkKXtmdW5jdGlvbiBlKCl7dmFyIGU9Yi5jaGVja2VkLGY9cD9nKCk6ZTtpZighYS54YS5WYSgpJiYoIWx8fGUpKXt2YXIgaD1hLmwudyhjKTtpZihrKXt2YXIgbT1yP2gucCgpOmg7cSE9PWY/KGUmJihhLmEucmEobSxmLCEwKSxhLmEucmEobSxxLCExKSkscT1mKTphLmEucmEobSxmLGUpO3ImJmEuRGEoaCkmJmgobSl9ZWxzZSBhLmguR2EoaCxkLFwiY2hlY2tlZFwiLGYsITApfX1mdW5jdGlvbiBmKCl7dmFyIGQ9YS5hLmMoYygpKTtiLmNoZWNrZWQ9az8wPD1hLmEubyhkLGcoKSk6aD9kOmcoKT09PWR9dmFyIGc9YS5yYyhmdW5jdGlvbigpe3JldHVybiBkLmhhcyhcImNoZWNrZWRWYWx1ZVwiKT9hLmEuYyhkLmdldChcImNoZWNrZWRWYWx1ZVwiKSk6ZC5oYXMoXCJ2YWx1ZVwiKT9hLmEuYyhkLmdldChcInZhbHVlXCIpKTpiLnZhbHVlfSksaD1cImNoZWNrYm94XCI9PWIudHlwZSxsPVwicmFkaW9cIj09Yi50eXBlO2lmKGh8fGwpe3ZhciBtPWMoKSxrPWgmJmEuYS5jKG0paW5zdGFuY2VvZiBBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcj0hKGsmJm0ucHVzaCYmbS5zcGxpY2UpLHE9az9nKCk6bixwPWx8fGs7bCYmIWIubmFtZSYmYS5kLnVuaXF1ZU5hbWUuaW5pdChiLGZ1bmN0aW9uKCl7cmV0dXJuITB9KTthLm0oZSxudWxsLHtpOmJ9KTthLmEucShiLFwiY2xpY2tcIixlKTthLm0oZixudWxsLHtpOmJ9KTttPW59fX07YS5oLmdhLmNoZWNrZWQ9ITA7YS5kLmNoZWNrZWRWYWx1ZT17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7Yi52YWx1ZT1hLmEuYyhjKCkpfX19KSgpO2EuZC5jc3M9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMoKSk7bnVsbCE9PWQmJlwib2JqZWN0XCI9PXR5cGVvZiBkP2EuYS5EKGQsZnVuY3Rpb24oYyxkKXtkPWEuYS5jKGQpO2EuYS5mYihiLGMsZCl9KTooZD1hLmEuY2IoU3RyaW5nKGR8fFwiXCIpKSxhLmEuZmIoYixiLl9fa29fX2Nzc1ZhbHVlLCExKSxiLl9fa29fX2Nzc1ZhbHVlPWQsYS5hLmZiKGIsZCwhMCkpfX07YS5kLmVuYWJsZT17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYygpKTtcclxuICAgICAgICBkJiZiLmRpc2FibGVkP2IucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik6ZHx8Yi5kaXNhYmxlZHx8KGIuZGlzYWJsZWQ9ITApfX07YS5kLmRpc2FibGU9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe2EuZC5lbmFibGUudXBkYXRlKGIsZnVuY3Rpb24oKXtyZXR1cm4hYS5hLmMoYygpKX0pfX07YS5kLmV2ZW50PXtpbml0OmZ1bmN0aW9uKGIsYyxkLGUsZil7dmFyIGc9YygpfHx7fTthLmEuRChnLGZ1bmN0aW9uKGcpe1wic3RyaW5nXCI9PXR5cGVvZiBnJiZhLmEucShiLGcsZnVuY3Rpb24oYil7dmFyIG0saz1jKClbZ107aWYoayl7dHJ5e3ZhciByPWEuYS5XKGFyZ3VtZW50cyk7ZT1mLiRkYXRhO3IudW5zaGlmdChlKTttPWsuYXBwbHkoZSxyKX1maW5hbGx5eyEwIT09bSYmKGIucHJldmVudERlZmF1bHQ/Yi5wcmV2ZW50RGVmYXVsdCgpOmIucmV0dXJuVmFsdWU9ITEpfSExPT09ZC5nZXQoZytcIkJ1YmJsZVwiKSYmKGIuY2FuY2VsQnViYmxlPSEwLGIuc3RvcFByb3BhZ2F0aW9uJiZiLnN0b3BQcm9wYWdhdGlvbigpKX19KX0pfX07XHJcbiAgICBhLmQuZm9yZWFjaD17bWM6ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9YigpLGQ9YS5hLkJiKGMpO2lmKCFkfHxcIm51bWJlclwiPT10eXBlb2YgZC5sZW5ndGgpcmV0dXJue2ZvcmVhY2g6Yyx0ZW1wbGF0ZUVuZ2luZTphLlgudmJ9O2EuYS5jKGMpO3JldHVybntmb3JlYWNoOmQuZGF0YSxhczpkLmFzLGluY2x1ZGVEZXN0cm95ZWQ6ZC5pbmNsdWRlRGVzdHJveWVkLGFmdGVyQWRkOmQuYWZ0ZXJBZGQsYmVmb3JlUmVtb3ZlOmQuYmVmb3JlUmVtb3ZlLGFmdGVyUmVuZGVyOmQuYWZ0ZXJSZW5kZXIsYmVmb3JlTW92ZTpkLmJlZm9yZU1vdmUsYWZ0ZXJNb3ZlOmQuYWZ0ZXJNb3ZlLHRlbXBsYXRlRW5naW5lOmEuWC52Yn19fSxpbml0OmZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuZC50ZW1wbGF0ZS5pbml0KGIsYS5kLmZvcmVhY2gubWMoYykpfSx1cGRhdGU6ZnVuY3Rpb24oYixjLGQsZSxmKXtyZXR1cm4gYS5kLnRlbXBsYXRlLnVwZGF0ZShiLGEuZC5mb3JlYWNoLm1jKGMpLFxyXG4gICAgICAgIGQsZSxmKX19O2EuaC52YS5mb3JlYWNoPSExO2EuZi5hYS5mb3JlYWNoPSEwO2EuZC5oYXNmb2N1cz17aW5pdDpmdW5jdGlvbihiLGMsZCl7ZnVuY3Rpb24gZShlKXtiLl9fa29faGFzZm9jdXNVcGRhdGluZz0hMDt2YXIgZj1iLm93bmVyRG9jdW1lbnQ7aWYoXCJhY3RpdmVFbGVtZW50XCJpbiBmKXt2YXIgZzt0cnl7Zz1mLmFjdGl2ZUVsZW1lbnR9Y2F0Y2goayl7Zz1mLmJvZHl9ZT1nPT09Yn1mPWMoKTthLmguR2EoZixkLFwiaGFzZm9jdXNcIixlLCEwKTtiLl9fa29faGFzZm9jdXNMYXN0VmFsdWU9ZTtiLl9fa29faGFzZm9jdXNVcGRhdGluZz0hMX12YXIgZj1lLmJpbmQobnVsbCwhMCksZz1lLmJpbmQobnVsbCwhMSk7YS5hLnEoYixcImZvY3VzXCIsZik7YS5hLnEoYixcImZvY3VzaW5cIixmKTthLmEucShiLFwiYmx1clwiLGcpO2EuYS5xKGIsXCJmb2N1c291dFwiLGcpfSx1cGRhdGU6ZnVuY3Rpb24oYixjKXt2YXIgZD0hIWEuYS5jKGMoKSk7Yi5fX2tvX2hhc2ZvY3VzVXBkYXRpbmd8fGIuX19rb19oYXNmb2N1c0xhc3RWYWx1ZT09PVxyXG4gICAgZHx8KGQ/Yi5mb2N1cygpOmIuYmx1cigpLCFkJiZiLl9fa29faGFzZm9jdXNMYXN0VmFsdWUmJmIub3duZXJEb2N1bWVudC5ib2R5LmZvY3VzKCksYS5sLncoYS5hLkZhLG51bGwsW2IsZD9cImZvY3VzaW5cIjpcImZvY3Vzb3V0XCJdKSl9fTthLmguZ2EuaGFzZm9jdXM9ITA7YS5kLmhhc0ZvY3VzPWEuZC5oYXNmb2N1czthLmguZ2EuaGFzRm9jdXM9ITA7YS5kLmh0bWw9e2luaXQ6ZnVuY3Rpb24oKXtyZXR1cm57Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6ITB9fSx1cGRhdGU6ZnVuY3Rpb24oYixjKXthLmEuRWIoYixjKCkpfX07SyhcImlmXCIpO0soXCJpZm5vdFwiLCExLCEwKTtLKFwid2l0aFwiLCEwLCExLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGEuYWMoYyl9KTt2YXIgTD17fTthLmQub3B0aW9ucz17aW5pdDpmdW5jdGlvbihiKXtpZihcInNlbGVjdFwiIT09YS5hLkEoYikpdGhyb3cgRXJyb3IoXCJvcHRpb25zIGJpbmRpbmcgYXBwbGllcyBvbmx5IHRvIFNFTEVDVCBlbGVtZW50c1wiKTtmb3IoOzA8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIubGVuZ3RoOyliLnJlbW92ZSgwKTtyZXR1cm57Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6ITB9fSx1cGRhdGU6ZnVuY3Rpb24oYixjLGQpe2Z1bmN0aW9uIGUoKXtyZXR1cm4gYS5hLk1hKGIub3B0aW9ucyxmdW5jdGlvbihhKXtyZXR1cm4gYS5zZWxlY3RlZH0pfWZ1bmN0aW9uIGYoYSxiLGMpe3ZhciBkPXR5cGVvZiBiO3JldHVyblwiZnVuY3Rpb25cIj09ZD9iKGEpOlwic3RyaW5nXCI9PWQ/YVtiXTpjfWZ1bmN0aW9uIGcoYyxlKXtpZihBJiZrKWEuai5qYShiLGEuYS5jKGQuZ2V0KFwidmFsdWVcIikpLCEwKTtlbHNlIGlmKHAubGVuZ3RoKXt2YXIgZj0wPD1hLmEubyhwLGEuai51KGVbMF0pKTthLmEud2MoZVswXSxmKTtBJiYhZiYmYS5sLncoYS5hLkZhLG51bGwsW2IsXCJjaGFuZ2VcIl0pfX12YXIgaD1iLm11bHRpcGxlLGw9MCE9Yi5sZW5ndGgmJmg/Yi5zY3JvbGxUb3A6bnVsbCxtPWEuYS5jKGMoKSksaz1kLmdldChcInZhbHVlQWxsb3dVbnNldFwiKSYmZC5oYXMoXCJ2YWx1ZVwiKSxyPVxyXG4gICAgICAgIGQuZ2V0KFwib3B0aW9uc0luY2x1ZGVEZXN0cm95ZWRcIik7Yz17fTt2YXIgcSxwPVtdO2t8fChoP3A9YS5hLmliKGUoKSxhLmoudSk6MDw9Yi5zZWxlY3RlZEluZGV4JiZwLnB1c2goYS5qLnUoYi5vcHRpb25zW2Iuc2VsZWN0ZWRJbmRleF0pKSk7bSYmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBtLmxlbmd0aCYmKG09W21dKSxxPWEuYS5NYShtLGZ1bmN0aW9uKGIpe3JldHVybiByfHxiPT09bnx8bnVsbD09PWJ8fCFhLmEuYyhiLl9kZXN0cm95KX0pLGQuaGFzKFwib3B0aW9uc0NhcHRpb25cIikmJihtPWEuYS5jKGQuZ2V0KFwib3B0aW9uc0NhcHRpb25cIikpLG51bGwhPT1tJiZtIT09biYmcS51bnNoaWZ0KEwpKSk7dmFyIEE9ITE7Yy5iZWZvcmVSZW1vdmU9ZnVuY3Rpb24oYSl7Yi5yZW1vdmVDaGlsZChhKX07bT1nO2QuaGFzKFwib3B0aW9uc0FmdGVyUmVuZGVyXCIpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBkLmdldChcIm9wdGlvbnNBZnRlclJlbmRlclwiKSYmKG09ZnVuY3Rpb24oYixjKXtnKDAsYyk7XHJcbiAgICAgICAgYS5sLncoZC5nZXQoXCJvcHRpb25zQWZ0ZXJSZW5kZXJcIiksbnVsbCxbY1swXSxiIT09TD9iOm5dKX0pO2EuYS5EYihiLHEsZnVuY3Rpb24oYyxlLGcpe2cubGVuZ3RoJiYocD0hayYmZ1swXS5zZWxlY3RlZD9bYS5qLnUoZ1swXSldOltdLEE9ITApO2U9Yi5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7Yz09PUw/KGEuYS5iYihlLGQuZ2V0KFwib3B0aW9uc0NhcHRpb25cIikpLGEuai5qYShlLG4pKTooZz1mKGMsZC5nZXQoXCJvcHRpb25zVmFsdWVcIiksYyksYS5qLmphKGUsYS5hLmMoZykpLGM9ZihjLGQuZ2V0KFwib3B0aW9uc1RleHRcIiksZyksYS5hLmJiKGUsYykpO3JldHVybltlXX0sYyxtKTthLmwudyhmdW5jdGlvbigpe2s/YS5qLmphKGIsYS5hLmMoZC5nZXQoXCJ2YWx1ZVwiKSksITApOihoP3AubGVuZ3RoJiZlKCkubGVuZ3RoPHAubGVuZ3RoOnAubGVuZ3RoJiYwPD1iLnNlbGVjdGVkSW5kZXg/YS5qLnUoYi5vcHRpb25zW2Iuc2VsZWN0ZWRJbmRleF0pIT09cFswXTpcclxuICAgICAgICBwLmxlbmd0aHx8MDw9Yi5zZWxlY3RlZEluZGV4KSYmYS5hLkZhKGIsXCJjaGFuZ2VcIil9KTthLmEuU2MoYik7bCYmMjA8TWF0aC5hYnMobC1iLnNjcm9sbFRvcCkmJihiLnNjcm9sbFRvcD1sKX19O2EuZC5vcHRpb25zLnpiPWEuYS5lLkooKTthLmQuc2VsZWN0ZWRPcHRpb25zPXthZnRlcjpbXCJvcHRpb25zXCIsXCJmb3JlYWNoXCJdLGluaXQ6ZnVuY3Rpb24oYixjLGQpe2EuYS5xKGIsXCJjaGFuZ2VcIixmdW5jdGlvbigpe3ZhciBlPWMoKSxmPVtdO2EuYS5yKGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvcHRpb25cIiksZnVuY3Rpb24oYil7Yi5zZWxlY3RlZCYmZi5wdXNoKGEuai51KGIpKX0pO2EuaC5HYShlLGQsXCJzZWxlY3RlZE9wdGlvbnNcIixmKX0pfSx1cGRhdGU6ZnVuY3Rpb24oYixjKXtpZihcInNlbGVjdFwiIT1hLmEuQShiKSl0aHJvdyBFcnJvcihcInZhbHVlcyBiaW5kaW5nIGFwcGxpZXMgb25seSB0byBTRUxFQ1QgZWxlbWVudHNcIik7dmFyIGQ9YS5hLmMoYygpKSxlPWIuc2Nyb2xsVG9wO1xyXG4gICAgICAgIGQmJlwibnVtYmVyXCI9PXR5cGVvZiBkLmxlbmd0aCYmYS5hLnIoYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKSxmdW5jdGlvbihiKXt2YXIgYz0wPD1hLmEubyhkLGEuai51KGIpKTtiLnNlbGVjdGVkIT1jJiZhLmEud2MoYixjKX0pO2Iuc2Nyb2xsVG9wPWV9fTthLmguZ2Euc2VsZWN0ZWRPcHRpb25zPSEwO2EuZC5zdHlsZT17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYygpfHx7fSk7YS5hLkQoZCxmdW5jdGlvbihjLGQpe2Q9YS5hLmMoZCk7aWYobnVsbD09PWR8fGQ9PT1ufHwhMT09PWQpZD1cIlwiO2Iuc3R5bGVbY109ZH0pfX07YS5kLnN1Ym1pdD17aW5pdDpmdW5jdGlvbihiLGMsZCxlLGYpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGMoKSl0aHJvdyBFcnJvcihcIlRoZSB2YWx1ZSBmb3IgYSBzdWJtaXQgYmluZGluZyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7YS5hLnEoYixcInN1Ym1pdFwiLGZ1bmN0aW9uKGEpe3ZhciBkLGU9YygpO3RyeXtkPWUuY2FsbChmLiRkYXRhLFxyXG4gICAgICAgIGIpfWZpbmFsbHl7ITAhPT1kJiYoYS5wcmV2ZW50RGVmYXVsdD9hLnByZXZlbnREZWZhdWx0KCk6YS5yZXR1cm5WYWx1ZT0hMSl9fSl9fTthLmQudGV4dD17aW5pdDpmdW5jdGlvbigpe3JldHVybntjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczohMH19LHVwZGF0ZTpmdW5jdGlvbihiLGMpe2EuYS5iYihiLGMoKSl9fTthLmYuYWEudGV4dD0hMDsoZnVuY3Rpb24oKXtpZih4JiZ4Lm5hdmlnYXRvcil2YXIgYj1mdW5jdGlvbihhKXtpZihhKXJldHVybiBwYXJzZUZsb2F0KGFbMV0pfSxjPXgub3BlcmEmJngub3BlcmEudmVyc2lvbiYmcGFyc2VJbnQoeC5vcGVyYS52ZXJzaW9uKCkpLGQ9eC5uYXZpZ2F0b3IudXNlckFnZW50LGU9YihkLm1hdGNoKC9eKD86KD8hY2hyb21lKS4pKnZlcnNpb25cXC8oW14gXSopIHNhZmFyaS9pKSksZj1iKGQubWF0Y2goL0ZpcmVmb3hcXC8oW14gXSopLykpO2lmKDEwPmEuYS5DKXZhciBnPWEuYS5lLkooKSxoPWEuYS5lLkooKSxsPWZ1bmN0aW9uKGIpe3ZhciBjPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlRWxlbWVudDsoYz1jJiZhLmEuZS5nZXQoYyxoKSkmJmMoYil9LG09ZnVuY3Rpb24oYixjKXt2YXIgZD1iLm93bmVyRG9jdW1lbnQ7YS5hLmUuZ2V0KGQsZyl8fChhLmEuZS5zZXQoZCxnLCEwKSxhLmEucShkLFwic2VsZWN0aW9uY2hhbmdlXCIsbCkpO2EuYS5lLnNldChiLGgsYyl9O2EuZC50ZXh0SW5wdXQ9e2luaXQ6ZnVuY3Rpb24oYixkLGcpe2Z1bmN0aW9uIGwoYyxkKXthLmEucShiLGMsZCl9ZnVuY3Rpb24gaCgpe3ZhciBjPWEuYS5jKGQoKSk7aWYobnVsbD09PWN8fGM9PT1uKWM9XCJcIjt1IT09biYmYz09PXU/YS5hLnNldFRpbWVvdXQoaCw0KTpiLnZhbHVlIT09YyYmKHM9YyxiLnZhbHVlPWMpfWZ1bmN0aW9uIHkoKXt0fHwodT1iLnZhbHVlLHQ9YS5hLnNldFRpbWVvdXQodiw0KSl9ZnVuY3Rpb24gdigpe2NsZWFyVGltZW91dCh0KTt1PXQ9bjt2YXIgYz1iLnZhbHVlO3MhPT1jJiYocz1jLGEuaC5HYShkKCksZyxcInRleHRJbnB1dFwiLGMpKX12YXIgcz1iLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx1LHg9OT09YS5hLkM/eTp2OzEwPmEuYS5DPyhsKFwicHJvcGVydHljaGFuZ2VcIixmdW5jdGlvbihhKXtcInZhbHVlXCI9PT1hLnByb3BlcnR5TmFtZSYmeChhKX0pLDg9PWEuYS5DJiYobChcImtleXVwXCIsdiksbChcImtleWRvd25cIix2KSksODw9YS5hLkMmJihtKGIseCksbChcImRyYWdlbmRcIix5KSkpOihsKFwiaW5wdXRcIix2KSw1PmUmJlwidGV4dGFyZWFcIj09PWEuYS5BKGIpPyhsKFwia2V5ZG93blwiLHkpLGwoXCJwYXN0ZVwiLHkpLGwoXCJjdXRcIix5KSk6MTE+Yz9sKFwia2V5ZG93blwiLHkpOjQ+ZiYmKGwoXCJET01BdXRvQ29tcGxldGVcIix2KSxsKFwiZHJhZ2Ryb3BcIix2KSxsKFwiZHJvcFwiLHYpKSk7bChcImNoYW5nZVwiLHYpO2EubShoLG51bGwse2k6Yn0pfX07YS5oLmdhLnRleHRJbnB1dD0hMDthLmQudGV4dGlucHV0PXtwcmVwcm9jZXNzOmZ1bmN0aW9uKGEsYixjKXtjKFwidGV4dElucHV0XCIsYSl9fX0pKCk7YS5kLnVuaXF1ZU5hbWU9e2luaXQ6ZnVuY3Rpb24oYixjKXtpZihjKCkpe3ZhciBkPVwia29fdW5pcXVlX1wiK1xyXG4gICAgICAgICsrYS5kLnVuaXF1ZU5hbWUuTmM7YS5hLnZjKGIsZCl9fX07YS5kLnVuaXF1ZU5hbWUuTmM9MDthLmQudmFsdWU9e2FmdGVyOltcIm9wdGlvbnNcIixcImZvcmVhY2hcIl0saW5pdDpmdW5jdGlvbihiLGMsZCl7aWYoXCJpbnB1dFwiIT1iLnRhZ05hbWUudG9Mb3dlckNhc2UoKXx8XCJjaGVja2JveFwiIT1iLnR5cGUmJlwicmFkaW9cIiE9Yi50eXBlKXt2YXIgZT1bXCJjaGFuZ2VcIl0sZj1kLmdldChcInZhbHVlVXBkYXRlXCIpLGc9ITEsaD1udWxsO2YmJihcInN0cmluZ1wiPT10eXBlb2YgZiYmKGY9W2ZdKSxhLmEudGEoZSxmKSxlPWEuYS5XYihlKSk7dmFyIGw9ZnVuY3Rpb24oKXtoPW51bGw7Zz0hMTt2YXIgZT1jKCksZj1hLmoudShiKTthLmguR2EoZSxkLFwidmFsdWVcIixmKX07IWEuYS5DfHxcImlucHV0XCIhPWIudGFnTmFtZS50b0xvd2VyQ2FzZSgpfHxcInRleHRcIiE9Yi50eXBlfHxcIm9mZlwiPT1iLmF1dG9jb21wbGV0ZXx8Yi5mb3JtJiZcIm9mZlwiPT1iLmZvcm0uYXV0b2NvbXBsZXRlfHwtMSE9YS5hLm8oZSxcInByb3BlcnR5Y2hhbmdlXCIpfHxcclxuICAgIChhLmEucShiLFwicHJvcGVydHljaGFuZ2VcIixmdW5jdGlvbigpe2c9ITB9KSxhLmEucShiLFwiZm9jdXNcIixmdW5jdGlvbigpe2c9ITF9KSxhLmEucShiLFwiYmx1clwiLGZ1bmN0aW9uKCl7ZyYmbCgpfSkpO2EuYS5yKGUsZnVuY3Rpb24oYyl7dmFyIGQ9bDthLmEuc2QoYyxcImFmdGVyXCIpJiYoZD1mdW5jdGlvbigpe2g9YS5qLnUoYik7YS5hLnNldFRpbWVvdXQobCwwKX0sYz1jLnN1YnN0cmluZyg1KSk7YS5hLnEoYixjLGQpfSk7dmFyIG09ZnVuY3Rpb24oKXt2YXIgZT1hLmEuYyhjKCkpLGY9YS5qLnUoYik7aWYobnVsbCE9PWgmJmU9PT1oKWEuYS5zZXRUaW1lb3V0KG0sMCk7ZWxzZSBpZihlIT09ZilpZihcInNlbGVjdFwiPT09YS5hLkEoYikpe3ZhciBnPWQuZ2V0KFwidmFsdWVBbGxvd1Vuc2V0XCIpLGY9ZnVuY3Rpb24oKXthLmouamEoYixlLGcpfTtmKCk7Z3x8ZT09PWEuai51KGIpP2EuYS5zZXRUaW1lb3V0KGYsMCk6YS5sLncoYS5hLkZhLG51bGwsW2IsXCJjaGFuZ2VcIl0pfWVsc2UgYS5qLmphKGIsXHJcbiAgICAgICAgZSl9O2EubShtLG51bGwse2k6Yn0pfWVsc2UgYS5MYShiLHtjaGVja2VkVmFsdWU6Y30pfSx1cGRhdGU6ZnVuY3Rpb24oKXt9fTthLmguZ2EudmFsdWU9ITA7YS5kLnZpc2libGU9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMoKSksZT1cIm5vbmVcIiE9Yi5zdHlsZS5kaXNwbGF5O2QmJiFlP2Iuc3R5bGUuZGlzcGxheT1cIlwiOiFkJiZlJiYoYi5zdHlsZS5kaXNwbGF5PVwibm9uZVwiKX19OyhmdW5jdGlvbihiKXthLmRbYl09e2luaXQ6ZnVuY3Rpb24oYyxkLGUsZixnKXtyZXR1cm4gYS5kLmV2ZW50LmluaXQuY2FsbCh0aGlzLGMsZnVuY3Rpb24oKXt2YXIgYT17fTthW2JdPWQoKTtyZXR1cm4gYX0sZSxmLGcpfX19KShcImNsaWNrXCIpO2EuUD1mdW5jdGlvbigpe307YS5QLnByb3RvdHlwZS5yZW5kZXJUZW1wbGF0ZVNvdXJjZT1mdW5jdGlvbigpe3Rocm93IEVycm9yKFwiT3ZlcnJpZGUgcmVuZGVyVGVtcGxhdGVTb3VyY2VcIik7fTthLlAucHJvdG90eXBlLmNyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jaz1cclxuICAgICAgICBmdW5jdGlvbigpe3Rocm93IEVycm9yKFwiT3ZlcnJpZGUgY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrXCIpO307YS5QLnByb3RvdHlwZS5tYWtlVGVtcGxhdGVTb3VyY2U9ZnVuY3Rpb24oYixjKXtpZihcInN0cmluZ1wiPT10eXBlb2YgYil7Yz1jfHx0O3ZhciBkPWMuZ2V0RWxlbWVudEJ5SWQoYik7aWYoIWQpdGhyb3cgRXJyb3IoXCJDYW5ub3QgZmluZCB0ZW1wbGF0ZSB3aXRoIElEIFwiK2IpO3JldHVybiBuZXcgYS52Lm4oZCl9aWYoMT09Yi5ub2RlVHlwZXx8OD09Yi5ub2RlVHlwZSlyZXR1cm4gbmV3IGEudi5zYShiKTt0aHJvdyBFcnJvcihcIlVua25vd24gdGVtcGxhdGUgdHlwZTogXCIrYik7fTthLlAucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlPWZ1bmN0aW9uKGEsYyxkLGUpe2E9dGhpcy5tYWtlVGVtcGxhdGVTb3VyY2UoYSxlKTtyZXR1cm4gdGhpcy5yZW5kZXJUZW1wbGF0ZVNvdXJjZShhLGMsZCxlKX07YS5QLnByb3RvdHlwZS5pc1RlbXBsYXRlUmV3cml0dGVuPWZ1bmN0aW9uKGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyl7cmV0dXJuITE9PT10aGlzLmFsbG93VGVtcGxhdGVSZXdyaXRpbmc/ITA6dGhpcy5tYWtlVGVtcGxhdGVTb3VyY2UoYSxjKS5kYXRhKFwiaXNSZXdyaXR0ZW5cIil9O2EuUC5wcm90b3R5cGUucmV3cml0ZVRlbXBsYXRlPWZ1bmN0aW9uKGEsYyxkKXthPXRoaXMubWFrZVRlbXBsYXRlU291cmNlKGEsZCk7Yz1jKGEudGV4dCgpKTthLnRleHQoYyk7YS5kYXRhKFwiaXNSZXdyaXR0ZW5cIiwhMCl9O2EuYihcInRlbXBsYXRlRW5naW5lXCIsYS5QKTthLkliPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGMsZCxoKXtiPWEuaC5BYihiKTtmb3IodmFyIGw9YS5oLnZhLG09MDttPGIubGVuZ3RoO20rKyl7dmFyIGs9YlttXS5rZXk7aWYobC5oYXNPd25Qcm9wZXJ0eShrKSl7dmFyIHI9bFtrXTtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2Ygcil7aWYoaz1yKGJbbV0udmFsdWUpKXRocm93IEVycm9yKGspO31lbHNlIGlmKCFyKXRocm93IEVycm9yKFwiVGhpcyB0ZW1wbGF0ZSBlbmdpbmUgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ1wiK1xyXG4gICAgICAgIGsrXCInIGJpbmRpbmcgd2l0aGluIGl0cyB0ZW1wbGF0ZXNcIik7fX1kPVwia28uX190cl9hbWJ0bnMoZnVuY3Rpb24oJGNvbnRleHQsJGVsZW1lbnQpe3JldHVybihmdW5jdGlvbigpe3JldHVybnsgXCIrYS5oLlhhKGIse3ZhbHVlQWNjZXNzb3JzOiEwfSkrXCIgfSB9KSgpfSwnXCIrZC50b0xvd2VyQ2FzZSgpK1wiJylcIjtyZXR1cm4gaC5jcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2soZCkrY312YXIgYz0vKDwoW2Etel0rXFxkKikoPzpcXHMrKD8hZGF0YS1iaW5kXFxzKj1cXHMqKVthLXowLTlcXC1dKyg/Oj0oPzpcXFwiW15cXFwiXSpcXFwifFxcJ1teXFwnXSpcXCd8W14+XSopKT8pKlxccyspZGF0YS1iaW5kXFxzKj1cXHMqKFtcIiddKShbXFxzXFxTXSo/KVxcMy9naSxkPS9cXHgzYyEtLVxccyprb1xcYlxccyooW1xcc1xcU10qPylcXHMqLS1cXHgzZS9nO3JldHVybntUYzpmdW5jdGlvbihiLGMsZCl7Yy5pc1RlbXBsYXRlUmV3cml0dGVuKGIsZCl8fGMucmV3cml0ZVRlbXBsYXRlKGIsZnVuY3Rpb24oYil7cmV0dXJuIGEuSWIuamQoYixcclxuICAgICAgICBjKX0sZCl9LGpkOmZ1bmN0aW9uKGEsZil7cmV0dXJuIGEucmVwbGFjZShjLGZ1bmN0aW9uKGEsYyxkLGUsayl7cmV0dXJuIGIoayxjLGQsZil9KS5yZXBsYWNlKGQsZnVuY3Rpb24oYSxjKXtyZXR1cm4gYihjLFwiXFx4M2MhLS0ga28gLS1cXHgzZVwiLFwiI2NvbW1lbnRcIixmKX0pfSxKYzpmdW5jdGlvbihiLGMpe3JldHVybiBhLk4ueWIoZnVuY3Rpb24oZCxoKXt2YXIgbD1kLm5leHRTaWJsaW5nO2wmJmwubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PWMmJmEuTGEobCxiLGgpfSl9fX0oKTthLmIoXCJfX3RyX2FtYnRuc1wiLGEuSWIuSmMpOyhmdW5jdGlvbigpe2Eudj17fTthLnYubj1mdW5jdGlvbihiKXtpZih0aGlzLm49Yil7dmFyIGM9YS5hLkEoYik7dGhpcy5lYj1cInNjcmlwdFwiPT09Yz8xOlwidGV4dGFyZWFcIj09PWM/MjpcInRlbXBsYXRlXCI9PWMmJmIuY29udGVudCYmMTE9PT1iLmNvbnRlbnQubm9kZVR5cGU/Mzo0fX07YS52Lm4ucHJvdG90eXBlLnRleHQ9ZnVuY3Rpb24oKXt2YXIgYj0xPT09XHJcbiAgICB0aGlzLmViP1widGV4dFwiOjI9PT10aGlzLmViP1widmFsdWVcIjpcImlubmVySFRNTFwiO2lmKDA9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMubltiXTt2YXIgYz1hcmd1bWVudHNbMF07XCJpbm5lckhUTUxcIj09PWI/YS5hLkViKHRoaXMubixjKTp0aGlzLm5bYl09Y307dmFyIGI9YS5hLmUuSigpK1wiX1wiO2Eudi5uLnByb3RvdHlwZS5kYXRhPWZ1bmN0aW9uKGMpe2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBhLmEuZS5nZXQodGhpcy5uLGIrYyk7YS5hLmUuc2V0KHRoaXMubixiK2MsYXJndW1lbnRzWzFdKX07dmFyIGM9YS5hLmUuSigpO2Eudi5uLnByb3RvdHlwZS5ub2Rlcz1mdW5jdGlvbigpe3ZhciBiPXRoaXMubjtpZigwPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybihhLmEuZS5nZXQoYixjKXx8e30pLm1ifHwoMz09PXRoaXMuZWI/Yi5jb250ZW50OjQ9PT10aGlzLmViP2I6bik7YS5hLmUuc2V0KGIsYyx7bWI6YXJndW1lbnRzWzBdfSl9O2Eudi5zYT1mdW5jdGlvbihhKXt0aGlzLm49XHJcbiAgICAgICAgYX07YS52LnNhLnByb3RvdHlwZT1uZXcgYS52Lm47YS52LnNhLnByb3RvdHlwZS50ZXh0PWZ1bmN0aW9uKCl7aWYoMD09YXJndW1lbnRzLmxlbmd0aCl7dmFyIGI9YS5hLmUuZ2V0KHRoaXMubixjKXx8e307Yi5KYj09PW4mJmIubWImJihiLkpiPWIubWIuaW5uZXJIVE1MKTtyZXR1cm4gYi5KYn1hLmEuZS5zZXQodGhpcy5uLGMse0piOmFyZ3VtZW50c1swXX0pfTthLmIoXCJ0ZW1wbGF0ZVNvdXJjZXNcIixhLnYpO2EuYihcInRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50XCIsYS52Lm4pO2EuYihcInRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZVwiLGEudi5zYSl9KSgpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixjLGQpe3ZhciBlO2ZvcihjPWEuZi5uZXh0U2libGluZyhjKTtiJiYoZT1iKSE9PWM7KWI9YS5mLm5leHRTaWJsaW5nKGUpLGQoZSxiKX1mdW5jdGlvbiBjKGMsZCl7aWYoYy5sZW5ndGgpe3ZhciBlPWNbMF0sZj1jW2MubGVuZ3RoLTFdLGc9ZS5wYXJlbnROb2RlLGg9XHJcbiAgICAgICAgYS5TLmluc3RhbmNlLG49aC5wcmVwcm9jZXNzTm9kZTtpZihuKXtiKGUsZixmdW5jdGlvbihhLGIpe3ZhciBjPWEucHJldmlvdXNTaWJsaW5nLGQ9bi5jYWxsKGgsYSk7ZCYmKGE9PT1lJiYoZT1kWzBdfHxiKSxhPT09ZiYmKGY9ZFtkLmxlbmd0aC0xXXx8YykpfSk7Yy5sZW5ndGg9MDtpZighZSlyZXR1cm47ZT09PWY/Yy5wdXNoKGUpOihjLnB1c2goZSxmKSxhLmEuQmEoYyxnKSl9YihlLGYsZnVuY3Rpb24oYil7MSE9PWIubm9kZVR5cGUmJjghPT1iLm5vZGVUeXBlfHxhLlViKGQsYil9KTtiKGUsZixmdW5jdGlvbihiKXsxIT09Yi5ub2RlVHlwZSYmOCE9PWIubm9kZVR5cGV8fGEuTi5DYyhiLFtkXSl9KTthLmEuQmEoYyxnKX19ZnVuY3Rpb24gZChhKXtyZXR1cm4gYS5ub2RlVHlwZT9hOjA8YS5sZW5ndGg/YVswXTpudWxsfWZ1bmN0aW9uIGUoYixlLGYsaCxxKXtxPXF8fHt9O3ZhciBwPShiJiZkKGIpfHxmfHx7fSkub3duZXJEb2N1bWVudCxuPXEudGVtcGxhdGVFbmdpbmV8fGc7XHJcbiAgICAgICAgYS5JYi5UYyhmLG4scCk7Zj1uLnJlbmRlclRlbXBsYXRlKGYsaCxxLHApO2lmKFwibnVtYmVyXCIhPXR5cGVvZiBmLmxlbmd0aHx8MDxmLmxlbmd0aCYmXCJudW1iZXJcIiE9dHlwZW9mIGZbMF0ubm9kZVR5cGUpdGhyb3cgRXJyb3IoXCJUZW1wbGF0ZSBlbmdpbmUgbXVzdCByZXR1cm4gYW4gYXJyYXkgb2YgRE9NIG5vZGVzXCIpO3A9ITE7c3dpdGNoKGUpe2Nhc2UgXCJyZXBsYWNlQ2hpbGRyZW5cIjphLmYuZmEoYixmKTtwPSEwO2JyZWFrO2Nhc2UgXCJyZXBsYWNlTm9kZVwiOmEuYS51YyhiLGYpO3A9ITA7YnJlYWs7Y2FzZSBcImlnbm9yZVRhcmdldE5vZGVcIjpicmVhaztkZWZhdWx0OnRocm93IEVycm9yKFwiVW5rbm93biByZW5kZXJNb2RlOiBcIitlKTt9cCYmKGMoZixoKSxxLmFmdGVyUmVuZGVyJiZhLmwudyhxLmFmdGVyUmVuZGVyLG51bGwsW2YsaC4kZGF0YV0pKTtyZXR1cm4gZn1mdW5jdGlvbiBmKGIsYyxkKXtyZXR1cm4gYS5JKGIpP2IoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgYj9iKGMsZCk6Yn1cclxuICAgICAgICB2YXIgZzthLkZiPWZ1bmN0aW9uKGIpe2lmKGIhPW4mJiEoYiBpbnN0YW5jZW9mIGEuUCkpdGhyb3cgRXJyb3IoXCJ0ZW1wbGF0ZUVuZ2luZSBtdXN0IGluaGVyaXQgZnJvbSBrby50ZW1wbGF0ZUVuZ2luZVwiKTtnPWJ9O2EuQ2I9ZnVuY3Rpb24oYixjLGssaCxxKXtrPWt8fHt9O2lmKChrLnRlbXBsYXRlRW5naW5lfHxnKT09bil0aHJvdyBFcnJvcihcIlNldCBhIHRlbXBsYXRlIGVuZ2luZSBiZWZvcmUgY2FsbGluZyByZW5kZXJUZW1wbGF0ZVwiKTtxPXF8fFwicmVwbGFjZUNoaWxkcmVuXCI7aWYoaCl7dmFyIHA9ZChoKTtyZXR1cm4gYS5CKGZ1bmN0aW9uKCl7dmFyIGc9YyYmYyBpbnN0YW5jZW9mIGEuUj9jOm5ldyBhLlIoYyxudWxsLG51bGwsbnVsbCx7ZXhwb3J0RGVwZW5kZW5jaWVzOiEwfSksbj1mKGIsZy4kZGF0YSxnKSxnPWUoaCxxLG4sZyxrKTtcInJlcGxhY2VOb2RlXCI9PXEmJihoPWcscD1kKGgpKX0sbnVsbCx7eWE6ZnVuY3Rpb24oKXtyZXR1cm4hcHx8IWEuYS5xYihwKX0saTpwJiZcclxuICAgICAgICBcInJlcGxhY2VOb2RlXCI9PXE/cC5wYXJlbnROb2RlOnB9KX1yZXR1cm4gYS5OLnliKGZ1bmN0aW9uKGQpe2EuQ2IoYixjLGssZCxcInJlcGxhY2VOb2RlXCIpfSl9O2EucGQ9ZnVuY3Rpb24oYixkLGcsaCxxKXtmdW5jdGlvbiBwKGEsYil7YyhiLHQpO2cuYWZ0ZXJSZW5kZXImJmcuYWZ0ZXJSZW5kZXIoYixhKTt0PW51bGx9ZnVuY3Rpb24gcyhhLGMpe3Q9cS5jcmVhdGVDaGlsZENvbnRleHQoYSxnLmFzLGZ1bmN0aW9uKGEpe2EuJGluZGV4PWN9KTt2YXIgZD1mKGIsYSx0KTtyZXR1cm4gZShudWxsLFwiaWdub3JlVGFyZ2V0Tm9kZVwiLGQsdCxnKX12YXIgdDtyZXR1cm4gYS5CKGZ1bmN0aW9uKCl7dmFyIGI9YS5hLmMoZCl8fFtdO1widW5kZWZpbmVkXCI9PXR5cGVvZiBiLmxlbmd0aCYmKGI9W2JdKTtiPWEuYS5NYShiLGZ1bmN0aW9uKGIpe3JldHVybiBnLmluY2x1ZGVEZXN0cm95ZWR8fGI9PT1ufHxudWxsPT09Ynx8IWEuYS5jKGIuX2Rlc3Ryb3kpfSk7YS5sLncoYS5hLkRiLG51bGwsW2gsYixcclxuICAgICAgICAgICAgcyxnLHBdKX0sbnVsbCx7aTpofSl9O3ZhciBoPWEuYS5lLkooKTthLmQudGVtcGxhdGU9e2luaXQ6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKCkpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBkfHxkLm5hbWUpYS5mLnphKGIpO2Vsc2V7aWYoXCJub2Rlc1wiaW4gZCl7aWYoZD1kLm5vZGVzfHxbXSxhLkkoZCkpdGhyb3cgRXJyb3IoJ1RoZSBcIm5vZGVzXCIgb3B0aW9uIG11c3QgYmUgYSBwbGFpbiwgbm9uLW9ic2VydmFibGUgYXJyYXkuJyk7fWVsc2UgZD1hLmYuY2hpbGROb2RlcyhiKTtkPWEuYS5uYyhkKTsobmV3IGEudi5zYShiKSkubm9kZXMoZCl9cmV0dXJue2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiEwfX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyxkLGUsZil7dmFyIGc9YygpO2M9YS5hLmMoZyk7ZD0hMDtlPW51bGw7XCJzdHJpbmdcIj09dHlwZW9mIGM/Yz17fTooZz1jLm5hbWUsXCJpZlwiaW4gYyYmKGQ9YS5hLmMoY1tcImlmXCJdKSksZCYmXCJpZm5vdFwiaW4gYyYmKGQ9IWEuYS5jKGMuaWZub3QpKSk7XHJcbiAgICAgICAgICAgIFwiZm9yZWFjaFwiaW4gYz9lPWEucGQoZ3x8YixkJiZjLmZvcmVhY2h8fFtdLGMsYixmKTpkPyhmPVwiZGF0YVwiaW4gYz9mLmFjKGMuZGF0YSxjLmFzKTpmLGU9YS5DYihnfHxiLGYsYyxiKSk6YS5mLnphKGIpO2Y9ZTsoYz1hLmEuZS5nZXQoYixoKSkmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGMuayYmYy5rKCk7YS5hLmUuc2V0KGIsaCxmJiZmLmNhKCk/ZjpuKX19O2EuaC52YS50ZW1wbGF0ZT1mdW5jdGlvbihiKXtiPWEuaC5BYihiKTtyZXR1cm4gMT09Yi5sZW5ndGgmJmJbMF0udW5rbm93bnx8YS5oLmZkKGIsXCJuYW1lXCIpP251bGw6XCJUaGlzIHRlbXBsYXRlIGVuZ2luZSBkb2VzIG5vdCBzdXBwb3J0IGFub255bW91cyB0ZW1wbGF0ZXMgbmVzdGVkIHdpdGhpbiBpdHMgdGVtcGxhdGVzXCJ9O2EuZi5hYS50ZW1wbGF0ZT0hMH0pKCk7YS5iKFwic2V0VGVtcGxhdGVFbmdpbmVcIixhLkZiKTthLmIoXCJyZW5kZXJUZW1wbGF0ZVwiLGEuQ2IpO2EuYS5oYz1mdW5jdGlvbihhLGMsZCl7aWYoYS5sZW5ndGgmJlxyXG4gICAgICAgIGMubGVuZ3RoKXt2YXIgZSxmLGcsaCxsO2ZvcihlPWY9MDsoIWR8fGU8ZCkmJihoPWFbZl0pOysrZil7Zm9yKGc9MDtsPWNbZ107KytnKWlmKGgudmFsdWU9PT1sLnZhbHVlKXtoLm1vdmVkPWwuaW5kZXg7bC5tb3ZlZD1oLmluZGV4O2Muc3BsaWNlKGcsMSk7ZT1nPTA7YnJlYWt9ZSs9Z319fTthLmEubGI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsZCxlLGYsZyl7dmFyIGg9TWF0aC5taW4sbD1NYXRoLm1heCxtPVtdLGssbj1iLmxlbmd0aCxxLHA9ZC5sZW5ndGgscz1wLW58fDEsdD1uK3ArMSx2LHUseDtmb3Ioaz0wO2s8PW47aysrKWZvcih1PXYsbS5wdXNoKHY9W10pLHg9aChwLGsrcykscT1sKDAsay0xKTtxPD14O3ErKyl2W3FdPXE/az9iW2stMV09PT1kW3EtMV0/dVtxLTFdOmgodVtxXXx8dCx2W3EtMV18fHQpKzE6cSsxOmsrMTtoPVtdO2w9W107cz1bXTtrPW47Zm9yKHE9cDtrfHxxOylwPW1ba11bcV0tMSxxJiZwPT09bVtrXVtxLTFdP2wucHVzaChoW2gubGVuZ3RoXT17c3RhdHVzOmUsXHJcbiAgICAgICAgdmFsdWU6ZFstLXFdLGluZGV4OnF9KTprJiZwPT09bVtrLTFdW3FdP3MucHVzaChoW2gubGVuZ3RoXT17c3RhdHVzOmYsdmFsdWU6YlstLWtdLGluZGV4Omt9KTooLS1xLC0tayxnLnNwYXJzZXx8aC5wdXNoKHtzdGF0dXM6XCJyZXRhaW5lZFwiLHZhbHVlOmRbcV19KSk7YS5hLmhjKHMsbCwhZy5kb250TGltaXRNb3ZlcyYmMTAqbik7cmV0dXJuIGgucmV2ZXJzZSgpfXJldHVybiBmdW5jdGlvbihhLGQsZSl7ZT1cImJvb2xlYW5cIj09PXR5cGVvZiBlP3tkb250TGltaXRNb3ZlczplfTplfHx7fTthPWF8fFtdO2Q9ZHx8W107cmV0dXJuIGEubGVuZ3RoPGQubGVuZ3RoP2IoYSxkLFwiYWRkZWRcIixcImRlbGV0ZWRcIixlKTpiKGQsYSxcImRlbGV0ZWRcIixcImFkZGVkXCIsZSl9fSgpO2EuYihcInV0aWxzLmNvbXBhcmVBcnJheXNcIixhLmEubGIpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixjLGQsaCxsKXt2YXIgbT1bXSxrPWEuQihmdW5jdGlvbigpe3ZhciBrPWMoZCxsLGEuYS5CYShtLGIpKXx8W107MDxcclxuICAgIG0ubGVuZ3RoJiYoYS5hLnVjKG0sayksaCYmYS5sLncoaCxudWxsLFtkLGssbF0pKTttLmxlbmd0aD0wO2EuYS50YShtLGspfSxudWxsLHtpOmIseWE6ZnVuY3Rpb24oKXtyZXR1cm4hYS5hLlRiKG0pfX0pO3JldHVybntlYTptLEI6ay5jYSgpP2s6bn19dmFyIGM9YS5hLmUuSigpLGQ9YS5hLmUuSigpO2EuYS5EYj1mdW5jdGlvbihlLGYsZyxoLGwpe2Z1bmN0aW9uIG0oYixjKXt3PXFbY107dSE9PWMmJihEW2JdPXcpO3cudGIodSsrKTthLmEuQmEody5lYSxlKTt0LnB1c2godyk7ei5wdXNoKHcpfWZ1bmN0aW9uIGsoYixjKXtpZihiKWZvcih2YXIgZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKyljW2RdJiZhLmEucihjW2RdLmVhLGZ1bmN0aW9uKGEpe2IoYSxkLGNbZF0ua2EpfSl9Zj1mfHxbXTtoPWh8fHt9O3ZhciByPWEuYS5lLmdldChlLGMpPT09bixxPWEuYS5lLmdldChlLGMpfHxbXSxwPWEuYS5pYihxLGZ1bmN0aW9uKGEpe3JldHVybiBhLmthfSkscz1hLmEubGIocCxmLGguZG9udExpbWl0TW92ZXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ9W10sdj0wLHU9MCx4PVtdLHo9W107Zj1bXTtmb3IodmFyIEQ9W10scD1bXSx3LEM9MCxCLEU7Qj1zW0NdO0MrKylzd2l0Y2goRT1CLm1vdmVkLEIuc3RhdHVzKXtjYXNlIFwiZGVsZXRlZFwiOkU9PT1uJiYodz1xW3ZdLHcuQiYmKHcuQi5rKCksdy5CPW4pLGEuYS5CYSh3LmVhLGUpLmxlbmd0aCYmKGguYmVmb3JlUmVtb3ZlJiYodC5wdXNoKHcpLHoucHVzaCh3KSx3LmthPT09ZD93PW51bGw6ZltDXT13KSx3JiZ4LnB1c2guYXBwbHkoeCx3LmVhKSkpO3YrKzticmVhaztjYXNlIFwicmV0YWluZWRcIjptKEMsdisrKTticmVhaztjYXNlIFwiYWRkZWRcIjpFIT09bj9tKEMsRSk6KHc9e2thOkIudmFsdWUsdGI6YS5PKHUrKyl9LHQucHVzaCh3KSx6LnB1c2godykscnx8KHBbQ109dykpfWEuYS5lLnNldChlLGMsdCk7ayhoLmJlZm9yZU1vdmUsRCk7YS5hLnIoeCxoLmJlZm9yZVJlbW92ZT9hLmJhOmEucmVtb3ZlTm9kZSk7Zm9yKHZhciBDPTAscj1hLmYuZmlyc3RDaGlsZChlKSxGO3c9eltDXTtDKyspe3cuZWF8fFxyXG4gICAgYS5hLmV4dGVuZCh3LGIoZSxnLHcua2EsbCx3LnRiKSk7Zm9yKHY9MDtzPXcuZWFbdl07cj1zLm5leHRTaWJsaW5nLEY9cyx2KyspcyE9PXImJmEuZi5rYyhlLHMsRik7IXcuYWQmJmwmJihsKHcua2Esdy5lYSx3LnRiKSx3LmFkPSEwKX1rKGguYmVmb3JlUmVtb3ZlLGYpO2ZvcihDPTA7QzxmLmxlbmd0aDsrK0MpZltDXSYmKGZbQ10ua2E9ZCk7ayhoLmFmdGVyTW92ZSxEKTtrKGguYWZ0ZXJBZGQscCl9fSkoKTthLmIoXCJ1dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nXCIsYS5hLkRiKTthLlg9ZnVuY3Rpb24oKXt0aGlzLmFsbG93VGVtcGxhdGVSZXdyaXRpbmc9ITF9O2EuWC5wcm90b3R5cGU9bmV3IGEuUDthLlgucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlU291cmNlPWZ1bmN0aW9uKGIsYyxkLGUpe2lmKGM9KDk+YS5hLkM/MDpiLm5vZGVzKT9iLm5vZGVzKCk6bnVsbClyZXR1cm4gYS5hLlcoYy5jbG9uZU5vZGUoITApLmNoaWxkTm9kZXMpO2I9Yi50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIGEuYS5uYShiLGUpfTthLlgudmI9bmV3IGEuWDthLkZiKGEuWC52Yik7YS5iKFwibmF0aXZlVGVtcGxhdGVFbmdpbmVcIixhLlgpOyhmdW5jdGlvbigpe2EueGI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmVkPWZ1bmN0aW9uKCl7aWYoIXV8fCF1LnRtcGwpcmV0dXJuIDA7dHJ5e2lmKDA8PXUudG1wbC50YWcudG1wbC5vcGVuLnRvU3RyaW5nKCkuaW5kZXhPZihcIl9fXCIpKXJldHVybiAyfWNhdGNoKGEpe31yZXR1cm4gMX0oKTt0aGlzLnJlbmRlclRlbXBsYXRlU291cmNlPWZ1bmN0aW9uKGIsZSxmLGcpe2c9Z3x8dDtmPWZ8fHt9O2lmKDI+YSl0aHJvdyBFcnJvcihcIllvdXIgdmVyc2lvbiBvZiBqUXVlcnkudG1wbCBpcyB0b28gb2xkLiBQbGVhc2UgdXBncmFkZSB0byBqUXVlcnkudG1wbCAxLjAuMHByZSBvciBsYXRlci5cIik7dmFyIGg9Yi5kYXRhKFwicHJlY29tcGlsZWRcIik7aHx8KGg9Yi50ZXh0KCl8fFwiXCIsaD11LnRlbXBsYXRlKG51bGwsXCJ7e2tvX3dpdGggJGl0ZW0ua29CaW5kaW5nQ29udGV4dH19XCIrXHJcbiAgICAgICAgaCtcInt7L2tvX3dpdGh9fVwiKSxiLmRhdGEoXCJwcmVjb21waWxlZFwiLGgpKTtiPVtlLiRkYXRhXTtlPXUuZXh0ZW5kKHtrb0JpbmRpbmdDb250ZXh0OmV9LGYudGVtcGxhdGVPcHRpb25zKTtlPXUudG1wbChoLGIsZSk7ZS5hcHBlbmRUbyhnLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO3UuZnJhZ21lbnRzPXt9O3JldHVybiBlfTt0aGlzLmNyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jaz1mdW5jdGlvbihhKXtyZXR1cm5cInt7a29fY29kZSAoKGZ1bmN0aW9uKCkgeyByZXR1cm4gXCIrYStcIiB9KSgpKSB9fVwifTt0aGlzLmFkZFRlbXBsYXRlPWZ1bmN0aW9uKGEsYil7dC53cml0ZShcIjxzY3JpcHQgdHlwZT0ndGV4dC9odG1sJyBpZD0nXCIrYStcIic+XCIrYitcIlxceDNjL3NjcmlwdD5cIil9OzA8YSYmKHUudG1wbC50YWcua29fY29kZT17b3BlbjpcIl9fLnB1c2goJDEgfHwgJycpO1wifSx1LnRtcGwudGFnLmtvX3dpdGg9e29wZW46XCJ3aXRoKCQxKSB7XCIsY2xvc2U6XCJ9IFwifSl9O2EueGIucHJvdG90eXBlPVxyXG4gICAgICAgIG5ldyBhLlA7dmFyIGI9bmV3IGEueGI7MDxiLmVkJiZhLkZiKGIpO2EuYihcImpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZVwiLGEueGIpfSkoKX0pfSkoKTt9KSgpO1xyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS44LjNcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZCxcbiAgICBuYXRpdmVDcmVhdGUgICAgICAgPSBPYmplY3QuY3JlYXRlO1xuXG4gIC8vIE5ha2VkIGZ1bmN0aW9uIHJlZmVyZW5jZSBmb3Igc3Vycm9nYXRlLXByb3RvdHlwZS1zd2FwcGluZy5cbiAgdmFyIEN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjguMyc7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIHZhciBvcHRpbWl6ZUNiID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBvdGhlcik7XG4gICAgICB9O1xuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQSBtb3N0bHktaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgY2FsbGJhY2tzIHRoYXQgY2FuIGJlIGFwcGxpZWRcbiAgLy8gdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyXG4gIC8vIGlkZW50aXR5LCBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gb3B0aW1pemVDYih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkgcmV0dXJuIF8ubWF0Y2hlcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuICBfLml0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY2IodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYXNzaWduZXIgZnVuY3Rpb25zLlxuICB2YXIgY3JlYXRlQXNzaWduZXIgPSBmdW5jdGlvbihrZXlzRnVuYywgdW5kZWZpbmVkT25seSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdLFxuICAgICAgICAgICAga2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKCF1bmRlZmluZWRPbmx5IHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBhbm90aGVyLlxuICB2YXIgYmFzZUNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICAgIGlmICghXy5pc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgcHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEhlbHBlciBmb3IgY29sbGVjdGlvbiBtZXRob2RzIHRvIGRldGVybWluZSB3aGV0aGVyIGEgY29sbGVjdGlvblxuICAvLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0XG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgZ2V0TGVuZ3RoID0gcHJvcGVydHkoJ2xlbmd0aCcpO1xuICB2YXIgaXNBcnJheUxpa2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBpdGVtICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVzYCBhbmQgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlcyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgaXRlbSwgZnJvbUluZGV4LCBndWFyZCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgaXRlbSwgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBnZXRMZW5ndGgoaW5wdXQpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgICAgLy9mbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdFxuICAgICAgICBpZiAoIXNoYWxsb3cpIHZhbHVlID0gZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0KTtcbiAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIG91dHB1dC5sZW5ndGggKz0gbGVuO1xuICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXTtcbiAgICAgIGlmIChfLmNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCBhcmdzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGFyZ3VtZW50c1tqXSwgaXRlbSkpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bnppcChhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENvbXBsZW1lbnQgb2YgXy56aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzXG4gIF8udW56aXAgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBfLm1heChhcnJheSwgZ2V0TGVuZ3RoKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGxpc3QpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICB2YXIgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKDEpO1xuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgaW5kZXhPZiBhbmQgbGFzdEluZGV4T2YgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICAgIGkgPSBpZHggPj0gMCA/IGlkeCA6IE1hdGgubWF4KGlkeCArIGxlbmd0aCwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW5ndGggPSBpZHggPj0gMCA/IE1hdGgubWluKGlkeCArIDEsIGxlbmd0aCkgOiBpZHggKyBsZW5ndGggKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgICAgaWR4ID0gc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaWR4XSA9PT0gaXRlbSA/IGlkeCA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgICAgaWR4ID0gcHJlZGljYXRlRmluZChzbGljZS5jYWxsKGFycmF5LCBpLCBsZW5ndGgpLCBfLmlzTmFOKTtcbiAgICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgICAgfVxuICAgICAgZm9yIChpZHggPSBkaXIgPiAwID8gaSA6IGxlbmd0aCAtIDE7IGlkeCA+PSAwICYmIGlkeCA8IGxlbmd0aDsgaWR4ICs9IGRpcikge1xuICAgICAgICBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoMSwgXy5maW5kSW5kZXgsIF8uc29ydGVkSW5kZXgpO1xuICBfLmxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIF8uZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gIHZhciBleGVjdXRlQm91bmQgPSBmdW5jdGlvbihzb3VyY2VGdW5jLCBib3VuZEZ1bmMsIGNvbnRleHQsIGNhbGxpbmdDb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB2YXIgc2VsZiA9IGJhc2VDcmVhdGUoc291cmNlRnVuYy5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBzb3VyY2VGdW5jLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gXyA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBrZXk7XG4gICAgaWYgKGxlbmd0aCA8PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gXy5wYXJ0aWFsKF8uZGVsYXksIF8sIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgbmVnYXRlZCB2ZXJzaW9uIG9mIHRoZSBwYXNzZWQtaW4gcHJlZGljYXRlLlxuICBfLm5lZ2F0ZSA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgc3RhcnQgPSBhcmdzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGkgPSBzdGFydDtcbiAgICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIHVwIHRvIChidXQgbm90IGluY2x1ZGluZykgdGhlIE50aCBjYWxsLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3QgYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuXG4gIHZhciBoYXNFbnVtQnVnID0gIXt0b1N0cmluZzogbnVsbH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICB2YXIgbm9uRW51bUlkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGg7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIHZhciBwcm90byA9IChfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSkgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKF8uaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3RcbiAgLy8gSW4gY29udHJhc3QgdG8gXy5tYXAgaXQgcmV0dXJucyBhbiBvYmplY3RcbiAgXy5tYXBPYmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0cyA9IHt9LFxuICAgICAgICAgIGN1cnJlbnRLZXk7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluIG9iamVjdChzKVxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgXy5leHRlbmRPd24gPSBfLmFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKF8ua2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iamVjdCwgb2l0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBvYmogPSBvYmplY3QsIGl0ZXJhdGVlLCBrZXlzO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9pdGVyYXRlZSkpIHtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihvaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikgeyByZXR1cm4ga2V5IGluIG9iajsgfTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cywgdHJ1ZSk7XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUgb2JqZWN0LlxuICAvLyBJZiBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRoZW4gdGhleSB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICAvLyBjcmVhdGVkIG9iamVjdC5cbiAgXy5jcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUsIHByb3BzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICBpZiAocHJvcHMpIF8uZXh0ZW5kT3duKHJlc3VsdCwgcHJvcHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmlzTWF0Y2ggPSBmdW5jdGlvbihvYmplY3QsIGF0dHJzKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMoYXR0cnMpLCBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgIHZhciBvYmogPSBPYmplY3Qob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gcHJvcGVydHk7XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBmdW5jdGlvbigpe30gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuXG4gIF8ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCJpbXBvcnQge0tub2Nrb3V0SW5pdGlhbGl6ZXJ9IGZyb20gJy4va25vY2tvdXQvS25vY2tvdXRJbml0aWFsaXplcic7XG5pbXBvcnQge1BhcmFtUmVhZGVyfSBmcm9tICcuL2NvbW1vbi9QYXJhbVJlYWRlcic7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnLi9Sb3V0ZXInO1xuaW1wb3J0IHtTZXJ2ZXJBY3Rpb25zfSBmcm9tICcuL2NvbW1vbi9TZXJ2ZXJBY3Rpb25zJztcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIHtcblxuICAgIHByaXZhdGUgcGFyYW1SZWFkZXI6IFBhcmFtUmVhZGVyO1xuICAgIHByaXZhdGUga25vY2tvdXRJbml0aWFsaXplcjogS25vY2tvdXRJbml0aWFsaXplcjtcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyO1xuICAgIHByaXZhdGUgc2VydmVyQWN0aW9uczogU2VydmVyQWN0aW9ucztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAga25vY2tvdXRJbml0aWFsaXplcjogS25vY2tvdXRJbml0aWFsaXplcixcbiAgICAgICAgcGFyYW1SZWFkZXI6IFBhcmFtUmVhZGVyLFxuICAgICAgICByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgc2VydmVyQWN0aW9uczogU2VydmVyQWN0aW9uc1xuICAgICkge1xuICAgICAgICB0aGlzLmtub2Nrb3V0SW5pdGlhbGl6ZXIgPSBrbm9ja291dEluaXRpYWxpemVyO1xuICAgICAgICB0aGlzLnBhcmFtUmVhZGVyID0gcGFyYW1SZWFkZXI7XG4gICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xuICAgICAgICB0aGlzLnNlcnZlckFjdGlvbnMgPSBzZXJ2ZXJBY3Rpb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBydW4oKSB7XG4gICAgICAgIGxldCByb29tSWQgPSB0aGlzLnBhcmFtUmVhZGVyLmdldFF1ZXJ5VmFyaWFibGUoJ3Jvb21JZCcpO1xuXG4gICAgICAgIHRoaXMua25vY2tvdXRJbml0aWFsaXplci5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMucm91dGVyLnJlbmRlckxheW91dCgpO1xuXG4gICAgICAgIHRoaXMucm91dGVyLnJlbmRlclBhZ2Uocm9vbUlkKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0NvbnRlbnREZXBlbmRlbmNpZXN9IGZyb20gJy4vY29udGVudC9Db250ZW50RGVwZW5kZW5jaWVzJztcbmltcG9ydCB7S25vY2tvdXREZXBlbmRlbmNpZXN9IGZyb20gJy4va25vY2tvdXQva25vY2tvdXREZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHtQYXJhbVJlYWRlcn0gZnJvbSAnLi9jb21tb24vUGFyYW1SZWFkZXInO1xuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9BcHBsaWNhdGlvbic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuL1VzZXJBY3Rpb25zJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICcuL1JvdXRlcic7XG5pbXBvcnQge1NlcnZlckFjdGlvbnN9IGZyb20gJy4vY29tbW9uL1NlcnZlckFjdGlvbnMnO1xuaW1wb3J0IHtYaHJSZXF1ZXN0fSBmcm9tICcuL2NvbW1vbi9YaHJSZXF1ZXN0JztcbmltcG9ydCBGb3JnZSA9IHJlcXVpcmUoJ2ZvcmdlLWRpJyk7XG5pbXBvcnQge1hoclBvc3R9IGZyb20gJy4vY29tbW9uL1hoclBvc3QnO1xuXG5leHBvcnQgY2xhc3MgRGVwZW5kZW5jaWVzIHtcbiAgICBwcml2YXRlIGZvcmdlOiBGb3JnZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5mb3JnZSA9IG5ldyBGb3JnZSgpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIGdldDxUIGV4dGVuZHMgT2JqZWN0PihuYW1lOiBzdHJpbmcpOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yZ2UuZ2V0KG5hbWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZWdpc3RlckRlcGVuZGVuY2llcygpIHtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCduYW1lJykudG8uaW5zdGFuY2UoJycpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2FwcGxpY2F0aW9uJykudG8udHlwZShBcHBsaWNhdGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJET01FbGVtZW50cygpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQXBwRGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIGF3YWl0IHRoaXMucmVnaXN0ZXJTZXJ2ZXJEYXRhKCk7XG4gICAgICAgIG5ldyBDb250ZW50RGVwZW5kZW5jaWVzKHRoaXMuZm9yZ2UpO1xuICAgICAgICBuZXcgS25vY2tvdXREZXBlbmRlbmNpZXModGhpcy5mb3JnZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZWdpc3RlclNlcnZlckRhdGEoKSB7XG4gICAgICAgIGxldCBzZXJ2ZXJBY3Rpb25zID0gdGhpcy5mb3JnZS5nZXQ8U2VydmVyQWN0aW9ucz4oJ3NlcnZlckFjdGlvbnMnKTtcbiAgICAgICAgbGV0IHJvb21zID0gYXdhaXQgc2VydmVyQWN0aW9ucy5nZXRSb29tcygpO1xuICAgICAgICBsZXQgY29tbW9uSXNzdWVzID0gYXdhaXQgc2VydmVyQWN0aW9ucy5nZXRDb21tb25Jc3N1ZXMoKTtcblxuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3Jvb21zJykudG8uaW5zdGFuY2Uocm9vbXMpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbW1vbklzc3VlcycpLnRvLmluc3RhbmNlKGNvbW1vbklzc3Vlcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWdpc3RlckFwcERlcGVuZGVuY2llcygpIHtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdwYXJhbVJlYWRlcicpLnRvLnR5cGUoUGFyYW1SZWFkZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3VzZXJBY3Rpb25zJykudG8udHlwZShVc2VyQWN0aW9ucyk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgncm91dGVyJykudG8udHlwZShSb3V0ZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3hoclJlcXVlc3QnKS50by50eXBlKFhoclJlcXVlc3QpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3hoclBvc3QnKS50by50eXBlKFhoclBvc3QpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3NlcnZlckFjdGlvbnMnKS50by50eXBlKFNlcnZlckFjdGlvbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVnaXN0ZXJET01FbGVtZW50cygpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcbiAgICAgICAgbGV0IHNpZGViYXJOb2RlID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlYmFyJyk7XG5cbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdyb290Tm9kZScpLnRvLmluc3RhbmNlKG5vZGUpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3NpZGViYXJOb2RlJykudG8uaW5zdGFuY2Uoc2lkZWJhck5vZGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7aXNDb21wb25lbnROYW1lfSBmcm9tICcuL2tub2Nrb3V0L2NvbmZpZy9Db21wb25lbnRzJztcbmltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7Q29tcG9uZW50UmVzb2x2ZXJ9IGZyb20gJy4vY29udGVudC9jb21wb25lbnRzL0NvbXBvbmVudFJlc29sdmVyJztcbmltcG9ydCB7UGFnZVJlbmRlcmVyfSBmcm9tICcuL2NvbnRlbnQvUGFnZVJlbmRlcmVyJztcblxuZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgbGF5b3V0TWFwID0ge1xuICAgICAgICAnZ3JvdXBzJzogJ3Jvb21Hcm91cHMnLFxuICAgICAgICAnY2lyY2xlJzogJ3Jvb21DaXJjdWxhcicsXG4gICAgICAgICdhbmdsZWQnOiAncm9vbUdyb3Vwc0FuZ2xlZCdcbiAgICB9O1xuICAgIHByaXZhdGUgcGFnZVJlbmRlcmVyOiBQYWdlUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBJTklUSUFMX1BBR0UgPSAnaG9tZSc7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50UmVzb2x2ZXI7XG4gICAgcHJpdmF0ZSByb29tczogQXJyYXk8YW55PjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcGFnZVJlbmRlcmVyOiBQYWdlUmVuZGVyZXIsXG4gICAgICAgIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRSZXNvbHZlcixcbiAgICAgICAgcm9vbXM6IEFycmF5PGFueT5cbiAgICApIHtcbiAgICAgICAgdGhpcy5wYWdlUmVuZGVyZXIgPSBwYWdlUmVuZGVyZXI7XG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVzb2x2ZXIgPSBjb21wb25lbnRSZXNvbHZlcjtcbiAgICAgICAgdGhpcy5yb29tcyA9IHJvb21zO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXJMYXlvdXQoKSB7XG4gICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLmdldENvbXBvbmVudEJ5TW9kdWxlTmFtZSgnc2lkZWJhcicpO1xuICAgICAgICBrby5hcHBseUJpbmRpbmdzKGNvbXBvbmVudCwgdGhpcy5wYWdlUmVuZGVyZXIuZ2V0TGF5b3V0Tm9kZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyUGFnZShyb29tSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgcm9vbSA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLnJvb21JZCA9PT0gcm9vbUlkKVswXTtcbiAgICAgICAgbGV0IGNvbXBvbmVudE5hbWUgPSB0aGlzLmdldENvbXBvbmVudE5hbWVCeVJvb21JZChyb29tKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvYWRpbmcgY29tcG9uZW50OiBcIicgKyBjb21wb25lbnROYW1lICsgJ1wiJyk7XG5cbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIuZ2V0Q29tcG9uZW50QnlNb2R1bGVOYW1lKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhjb21wb25lbnQpO1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMucGFnZVJlbmRlcmVyLnJlbmRlclJvb3RDb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KTtcblxuICAgICAgICBrby5hcHBseUJpbmRpbmdzKGNvbXBvbmVudCwgbm9kZSk7XG4gICAgICAgIGNvbXBvbmVudC5vbkxvYWQocm9vbSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb21wb25lbnROYW1lQnlSb29tSWQocm9vbSkge1xuICAgICAgICBsZXQgY29tcG9uZW50TmFtZSA9IHRoaXMuSU5JVElBTF9QQUdFO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygcm9vbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0gUm91dGVyLmxheW91dE1hcFtyb29tLmxheW91dF07XG4gICAgICAgICAgICBpZiAoaXNDb21wb25lbnROYW1lKG5hbWUpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcm91dGU6IFwiJHtuYW1lfVwiIG5vdCBmb3VuZCwgcmVkaXJlY3RpbmcgdG8gaG9tZSBwYWdlLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE5hbWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtJc3N1ZX0gZnJvbSAnLi9jb21tb24vSXNzdWUnO1xuaW1wb3J0IHtYaHJQb3N0fSBmcm9tICcuL2NvbW1vbi9YaHJQb3N0JztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFVzZXJBY3Rpb25zIHtcbiAgICBwcml2YXRlIHhoclBvc3Q6IFhoclBvc3Q7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeGhyUG9zdDogWGhyUG9zdCkge1xuICAgICAgICB0aGlzLnhoclBvc3QgPSB4aHJQb3N0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBzZW5kTmV3Q29tbW9uSXNzdWVUb1NlcnZlcihjb21tb25Jc3N1ZTogYW55KSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnhoclBvc3QucG9zdEpzb25Ub1VybCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2FkZENvbW1vbklzc3VlJywgSlNPTi5zdHJpbmdpZnkoY29tbW9uSXNzdWUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgc2VuZElzc3Vlc1RvTWFpbFNlcnZlcihpc3N1ZXM6IGlzc3VlTWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy54aHJQb3N0LnBvc3RKc29uVG9VcmwoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZW5kTWFpbCcsIEpTT04uc3RyaW5naWZ5KGlzc3VlcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBzZW5kQ2hhbmdlUm9vbUNvbnRhY3RUb01haWxTZXJ2ZXIocm9vbTogc3RyaW5nLCBjaGFuZ2VSb29tQ29udGFjdDogY2hhbmdlUm9vbUNvbnRhY3RCb2R5KSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnhoclBvc3QucG9zdEpzb25Ub1VybCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2NoYW5nZVJvb21Db250YWN0LycgKyByb29tLCBKU09OLnN0cmluZ2lmeShjaGFuZ2VSb29tQ29udGFjdCkpO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIGNoYW5nZVJvb21Db250YWN0Qm9keSB7XG4gICAgY29udGFjdDogc3RyaW5nO1xuICAgIGNvbnRhY3RNYWlsOiBzdHJpbmc7XG59XG5cblxuaW50ZXJmYWNlIGlzc3VlTWVzc2FnZSB7XG4gICAgaXNzdWVzOiBBcnJheTxJc3N1ZT47XG4gICAgYWRkVGVhY2hlcnNUb01haWxMaXN0OiBib29sZWFuO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5cbmltcG9ydCB7cG9seWZpbGx9IGZyb20gJ2VzNi1wcm9taXNlJztcbmltcG9ydCB7RGVwZW5kZW5jaWVzfSBmcm9tICcuL0RlcGVuZGVuY2llcyc7XG5pbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tICcuL0FwcGxpY2F0aW9uJztcblxucG9seWZpbGwoKTtcblxubmV3IGZ1bmN0aW9uICgpIHtcbiAgICBuZXcgRGVwZW5kZW5jaWVzKClcbiAgICAgICAgLnJlZ2lzdGVyRGVwZW5kZW5jaWVzKClcbiAgICAgICAgLnRoZW4oKGRlcGVuZGVuY2llcykgPT4ge1xuICAgICAgICAgICAgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgLmdldDxBcHBsaWNhdGlvbj4oJ2FwcGxpY2F0aW9uJylcbiAgICAgICAgICAgICAgICAucnVuKCk7XG4gICAgICAgIH0pO1xufSgpO1xuXG5cblxuXG4iLCJleHBvcnQgY2xhc3MgSXNzdWUge1xuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xuICAgIHB1YmxpYyBkZXZpY2VJZDogbnVtYmVyO1xuICAgIHB1YmxpYyByZWNpcGllbnRzOiBBcnJheTxzdHJpbmc+O1xuICAgIHB1YmxpYyByb29tSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgaXNzdWVJZDogbnVtYmVyO1xufVxuIiwiaW1wb3J0IHtJc3N1ZX0gZnJvbSAnLi9Jc3N1ZSc7XG5cbmV4cG9ydCBjbGFzcyBJc3N1ZUZvcm1Db250YWluZXIge1xuXG4gICAgcHJpdmF0ZSBpc3N1ZUNvbnRhaW5lciA9IFtdO1xuXG5cbiAgICBwdWJsaWMgYWRkSXNzdWUoaXNzdWU6IElzc3VlKSB7XG4gICAgICAgIHRoaXMuaXNzdWVDb250YWluZXIucHVzaChpc3N1ZSk7XG4gICAgfVxuXG59XG4iLCJleHBvcnQgY2xhc3MgUGFyYW1SZWFkZXIge1xuICAgIHB1YmxpYyBnZXRRdWVyeVZhcmlhYmxlKHZhcmlhYmxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIGxldCB2YXJzID0gcXVlcnkuc3BsaXQoJyYnKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGFpciA9IHZhcnNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIGlmIChkZWNvZGVVUklDb21wb25lbnQocGFpclswXSkgPT0gdmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgLy8gdGhyb3cgRXJyb3IoJ1F1ZXJ5IHZhcmlhYmxlICcgKyB2YXJpYWJsZSArICcgbm90IGZvdW5kJyk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFJlc29sdmVyPFQ+IHtcbiAgICBwcml2YXRlIGNsYXNzZXM6IEFycmF5PFQ+O1xuXG4gICAgLy90b2RvIGFkZCBjYWNoaW5nXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNsYXNzZXM6IEFycmF5PFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NlcyA9IGNsYXNzZXM7XG4gICAgfVxuXG4gICAgLy90b2RvIGNvbnNpZGVyIHN0cm9uZ2VyIHR5cGUgZm9yIGNsYXNzVG9SZXNvbHZlXG4gICAgcHVibGljIGdldFNlcnZpY2VCeUpvYk5hbWUoY2xhc3NUb1Jlc29sdmU6IHN0cmluZyk6IFQge1xuICAgICAgICBsZXQgcmVjID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc2VzW2luZGV4XS5jb25zdHJ1Y3Rvci5uYW1lID09PSBjbGFzc1RvUmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzZXNbaW5kZXhdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgcmVzb2x2ZSBzZXJ2aWNlOiAnICsgY2xhc3NUb1Jlc29sdmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVjKGluZGV4IC0gMSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICByZXR1cm4gcmVjKHRoaXMuY2xhc3Nlcy5sZW5ndGggLSAxKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge1hoclJlcXVlc3R9IGZyb20gJy4vWGhyUmVxdWVzdCc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJBY3Rpb25zIHtcbiAgICBwcml2YXRlIHhoclJlcXVlc3Q6IFhoclJlcXVlc3Q7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeGhyUmVxdWVzdDogWGhyUmVxdWVzdCkge1xuICAgICAgICB0aGlzLnhoclJlcXVlc3QgPSB4aHJSZXF1ZXN0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRDb21tb25Jc3N1ZXMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGNvbW1vbklzc3VlcyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy54aHJSZXF1ZXN0LnJlcXVlc3RGcm9tVXJsKCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvY29tbW9uSXNzdWVzJyk7XG4gICAgICAgICAgICBjb21tb25Jc3N1ZXMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tbW9uSXNzdWVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRSb29tcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgcm9vbXMgPSBbXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy54aHJSZXF1ZXN0LnJlcXVlc3RGcm9tVXJsKCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvcm9vbXMnKTtcbiAgICAgICAgICAgIHJvb21zID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvb21zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZW5kTWFpbCgpIHtcbiAgICAgICAgLy8gdG9kbyBpbXBsZW1lbnRcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgWGhyUG9zdCB7XG5cbiAgICBwdWJsaWMgcG9zdEpzb25Ub1VybCh1cmwsIGpzb25TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCd0aW1lb3V0Jyk7XG4gICAgICAgICAgICB9LCA2MDAwMCk7XG5cbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgdXJsKTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcblxuICAgICAgICAgICAgeGhyLnNlbmQoanNvblN0cmluZyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBYaHJSZXF1ZXN0IHtcblxuICAgIHB1YmxpYyByZXF1ZXN0RnJvbVVybChyZXF1ZXN0VXJsOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IChyZXNwb25zZTogc3RyaW5nKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvcjogc3RyaW5nIHwgRXJyb3IpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGE6IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB4aHI6IFhNTEh0dHBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yZXNwb25zZVRleHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdub3BlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB4aHIub3BlbignR0VUJywgcmVxdWVzdFVybCk7XG4gICAgICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJjYWNoZS1jb250cm9sXCIsIFwibm8tY2FjaGVcIik7XG5cbiAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQge1NpZGViYXJ9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXInO1xuaW1wb3J0IHtQYWdlUmVuZGVyZXJ9IGZyb20gJy4vUGFnZVJlbmRlcmVyJztcbmltcG9ydCB7SG9tZX0gZnJvbSAnLi9jb21wb25lbnRzL2hvbWUvaG9tZSc7XG5pbXBvcnQge0NvbXBvbmVudFJlc29sdmVyfSBmcm9tICcuL2NvbXBvbmVudHMvQ29tcG9uZW50UmVzb2x2ZXInO1xuaW1wb3J0IEZvcmdlID0gcmVxdWlyZShcImZvcmdlLWRpXCIpO1xuaW1wb3J0IHtSb29tR3JvdXBzfSBmcm9tICcuL2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzJztcbmltcG9ydCB7Um9vbUdyb3Vwc0FuZ2xlZH0gZnJvbSAnLi9jb21wb25lbnRzL3Jvb21Hcm91cHNBbmdsZWQvcm9vbUdyb3Vwc0FuZ2xlZCc7XG5pbXBvcnQge1Jvb21DaXJjdWxhcn0gZnJvbSAnLi9jb21wb25lbnRzL3Jvb21DaXJjdWxhci9yb29tQ2lyY3VsYXInO1xuaW1wb3J0IHtJc3N1ZUZvcm1Db250YWluZXJ9IGZyb20gJy4uL2NvbW1vbi9Jc3N1ZUZvcm1Db250YWluZXInO1xuXG5leHBvcnQgY2xhc3MgQ29udGVudERlcGVuZGVuY2llcyB7XG4gICAgcHJpdmF0ZSBmb3JnZTogRm9yZ2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZm9yZ2U6IEZvcmdlKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UgPSBmb3JnZTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckNvbXBvbmVudHMoKTtcbiAgICAgICAgLy8gdGhpcy5yZWdpc3RlckNvbnRyb2xsZXJzKCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJPdGhlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck90aGVyKCkge1xuICAgICAgICAvLyB0aGlzLmZvcmdlLmJpbmQoJ3ZpZXdNb2RlbFVwZGF0ZXInKS50by50eXBlKFZpZXdNb2RlbFVwZGF0ZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3BhZ2VSZW5kZXJlcicpLnRvLnR5cGUoUGFnZVJlbmRlcmVyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdpc3N1ZUZvcm1Db250YWluZXInKS50by50eXBlKElzc3VlRm9ybUNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyQ29tcG9uZW50cygpIHtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShIb21lKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShTaWRlYmFyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShSb29tR3JvdXBzKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShSb29tR3JvdXBzQW5nbGVkKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShSb29tQ2lyY3VsYXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudFJlc29sdmVyJykudG8udHlwZShDb21wb25lbnRSZXNvbHZlcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyQ29udHJvbGxlcnMoKSB7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgnY29tcG9uZW50Q29udHJvbGxlck1hcHBpbmcnKS50by5pbnN0YW5jZShjb21wb25lbnRDb250cm9sbGVyTWFwcGluZyk7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgnY29udHJvbGxlcnMnKS50by50eXBlKFNpZGViYXJDb250cm9sbGVyKTtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb250cm9sbGVycycpLnRvLnR5cGUoU2luZ2xlQ29tcG9uZW50Q29udHJvbGxlcik7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgnY29udHJvbGxlcnMnKS50by50eXBlKEhvbWVDb250cm9sbGVyKTtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb250cm9sbGVyUmVzb2x2ZXInKS50by50eXBlKENvbnRyb2xsZXJSZXNvbHZlcik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9Db21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgUGFnZVJlbmRlcmVyIHtcbiAgICBwcml2YXRlIHJvb3ROb2RlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHNpZGViYXJOb2RlOiBIVE1MRWxlbWVudDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihyb290Tm9kZTogSFRNTEVsZW1lbnQsIHNpZGViYXJOb2RlOiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgICAgIHRoaXMuc2lkZWJhck5vZGUgPSBzaWRlYmFyTm9kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TGF5b3V0Tm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lkZWJhck5vZGU7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlclJvb3RDb21wb25lbnQobW9kdWxlTmFtZTogc3RyaW5nLCBjb21wb25lbnQ6IENvbXBvbmVudCk6IGFueSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGUuaW5uZXJIVE1MID0gYDxkaXY+PGRpdiBpZD1cIiR7bW9kdWxlTmFtZX1cIiBkYXRhLWJpbmQ9J2NvbXBvbmVudDogXCIke21vZHVsZU5hbWV9XCInPjwvZGl2PjwvZGl2PmA7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5yb290Tm9kZS5jaGlsZHJlblswXTtcbiAgICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgdXBkYXRlOiAoKSA9PiB2b2lkO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRVcGRhdGUoKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgb25SZW5kZXIoKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgb25Mb2FkKHJvb20/OiBhbnkpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvbkluaXQoKSB7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7UmVzb2x2ZXJ9IGZyb20gJy4uLy4uL2NvbW1vbi9SZXNvbHZlcic7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRSZXNvbHZlciBleHRlbmRzIFJlc29sdmVyPENvbXBvbmVudD4ge1xuICAgIHByaXZhdGUgY29tcG9uZW50TGlzdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21wb25lbnRzOiBBcnJheTxDb21wb25lbnQ+LCBjb21wb25lbnRDbGFzc01hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcbiAgICAgICAgc3VwZXIoY29tcG9uZW50cyk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50TGlzdCA9IGNvbXBvbmVudENsYXNzTWFwcGluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50KGNsYXNzVG9SZXNvbHZlOiBzdHJpbmcpOiBDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0U2VydmljZUJ5Sm9iTmFtZShjbGFzc1RvUmVzb2x2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbXBvbmVudEJ5TW9kdWxlTmFtZShtb2R1bGVOYW1lOiBzdHJpbmcpOiBDb21wb25lbnQge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29tcG9uZW50TGlzdFttb2R1bGVOYW1lXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IG5vdCBmb3VuZDogJyArIG1vZHVsZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNsYXNzVG9SZXNvbHZlID0gdGhpcy5jb21wb25lbnRMaXN0W21vZHVsZU5hbWVdO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoY2xhc3NUb1Jlc29sdmUpO1xuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIubW9kYWwge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2lkdGg6IDgwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7IH1cXG5cXG4ucm9vbS1jb250YWluZXIge1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7IH1cXG5cXG4udGFibGUtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDQwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgaGVpZ2h0OiAzMCU7XFxuICBtYXJnaW46IDQlIDQlO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxcbiAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgYm90dG9tOiA1JTtcXG4gICAgaGVpZ2h0OiAxMCU7XFxuICAgIHdpZHRoOiAyMCU7XFxuICAgIGxlZnQ6IDYwJTtcXG4gICAgbWFyZ2luOiAwOyB9XFxuXFxuLmRldmljZSB7XFxuICBoZWlnaHQ6IDUwcHg7XFxuICB3aWR0aDogNTBweDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgY3Vyc29yOiBwb2ludGVyOyB9XFxuICAuZGV2aWNlLnRvcCB7XFxuICAgIGxlZnQ6IDIwJTtcXG4gICAgdG9wOiAxMCU7IH1cXG4gIC5kZXZpY2UuYm90LXJpZ2h0IHtcXG4gICAgcmlnaHQ6IDEwJTtcXG4gICAgYm90dG9tOiAyMCU7IH1cXG4gIC5kZXZpY2UuYm90LWxlZnQge1xcbiAgICBsZWZ0OiAxMCU7XFxuICAgIGJvdHRvbTogMjAlOyB9XFxuICAuZGV2aWNlOmhvdmVyIHtcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmx1ZTsgfVxcblwiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMT5CaXR0ZSB3JmF1bWw7aGxlbiBzaWUgZWluZW4gUmF1bSBhdXMuPC9oMT5cXG5cIjtcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuLi9Db21wb25lbnQnO1xuXG5cbmV4cG9ydCBjbGFzcyBIb21lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT01QT05FTlRfTkFNRSA9ICdob21lJztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoSG9tZS5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVZpZXdNb2RlbCh2aWV3TW9kZWw6IGFueSkge1xuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIucm9vbS1jb250YWluZXIge1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBmbG9hdDogbGVmdDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZzogMjBweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG1hcmdpbi1ib3R0b206IDIwMHB4OyB9XFxuXFxuLnRhYmxlQ2lyY3VsYXIge1xcbiAgaGVpZ2h0OiA3NSU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBibG9jazsgfVxcbiAgLnRhYmxlQ2lyY3VsYXIgdHIge1xcbiAgICBoZWlnaHQ6IDIwJTsgfVxcbiAgLnRhYmxlQ2lyY3VsYXIgdGQge1xcbiAgICB3aWR0aDogMjAlOyB9XFxuXFxuLnRhYmxlLWdyb3VwIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgd2lkdGg6IDMwJTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkICMzMzM7XFxuICBoZWlnaHQ6IDIwJTtcXG4gIG1hcmdpbjogMi41JSAyLjUlIDAgMDtcXG4gIHBhZGRpbmc6IDIuNSUgMCAyLjUlIDIuNSU7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XFxuICAudGFibGUtZ3JvdXAudGVhY2hlci1kZXNrIHtcXG4gICAgaGVpZ2h0OiAyMCU7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZmxvYXQ6IHJpZ2h0O1xcbiAgICBib3R0b206IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHdpZHRoOiA1MCU7IH1cXG4gICAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayAuZGV2aWNlIHtcXG4gICAgICBoZWlnaHQ6IDk1JTtcXG4gICAgICB3aWR0aDogMzAlOyB9XFxuXFxuLmRldmljZSB7XFxuICBoZWlnaHQ6IDIwJTtcXG4gIHdpZHRoOiAyMCU7XFxuICBib3JkZXI6IDNweCBzb2xpZCAjZWVlOyB9XFxuICAuZGV2aWNlLmZpbGxlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgICBib3JkZXI6IG5vbmU7IH1cXG4gIC5kZXZpY2UuZW1wdHkge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgIGJvcmRlcjogbm9uZTsgfVxcbiAgLmRldmljZS5jb25uZWN0b3Ige1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxcbiAgLmRldmljZSBzcGFuLCAuZGV2aWNlIGgzIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB0b3A6IDQwJTtcXG4gICAgdHJhbnNsYXRlWTogLTUwJTsgfVxcblwiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMiBjbGFzcz1cXFwicm9vbS10aXRsZVxcXCI+UmF1bTogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21JZFxcXCI+PC9zcGFuPiBSYXVtYmV0cmV1ZXI6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5yb29tQ29udGFjdFxcXCI+PC9zcGFuPjwvaDI+PGltZ1xcbiAgICBzcmM9XFxcInN0eWxlcy9lZGl0LnBuZ1xcXCIgYWx0PVxcXCJcXFwiIGNsYXNzPVxcXCJlZGl0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNldENoYW5nZUNvbnRhY3QodHJ1ZSlcXFwiXFxuPlxcblxcbjxkaXYgY2xhc3M9XFxcInJvb20tY29udGFpbmVyXFxcIj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGVDaXJjdWxhclxcXCI+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMTwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygzKVxcXCI+PHNwYW4+Mzwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBjb25uZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNClcXFwiPjxzcGFuPjQ8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMjwvaDM+PC9kaXY+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxKVxcXCI+PHNwYW4+MTwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0yXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDIpXFxcIj48c3Bhbj4yPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGVtcHR5XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS01XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDUpXFxcIj48c3Bhbj41PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTZcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNilcXFwiPjxzcGFuPjY8L3NwYW4+PC9kaXY+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZW1wdHlcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGVtcHR5XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBlbXB0eVxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZW1wdHlcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGNvbm5lY3RvclxcXCI+PC9kaXY+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtN1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg3KVxcXCI+PHNwYW4+Nzwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS04XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDgpXFxcIj48c3Bhbj44PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGVtcHR5XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0xMVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMSlcXFwiPjxzcGFuPjExPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTEyXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEyKVxcXCI+PHNwYW4+MTI8L3NwYW4+PC9kaXY+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMzwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtOVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg5KVxcXCI+PHNwYW4+OTwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBjb25uZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTEwXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEwKVxcXCI+PHNwYW4+MTA8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggNDwvaDM+PC9kaXY+XFxuXFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cCB0ZWFjaGVyLWRlc2tcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTEzXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEzKVxcXCI+PHNwYW4+TGVocmVyPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTE0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDE0KVxcXCI+PHNwYW4+QmVhbWVyPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTE1XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDE1KVxcXCI+PHNwYW4+V2VpdGVyZTwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiY2hhbmdlQ29udGFjdFBvcHVwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRwYXJlbnQuc2hvd0NoYW5nZUNvbnRhY3RcXFwiPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5yb29tQ29udGFjdElucHV0XFxcIiA+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnJvb21Db250YWN0TWFpbElucHV0XFxcIiA+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gY29uZmlybVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jaGFuZ2VDb250YWN0KClcXFwiPlJhdW1iZXRyZXVlciAmYXVtbDtuZGVybjwvYT5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhYm9ydFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zZXRDaGFuZ2VDb250YWN0KGZhbHNlKVxcXCI+QWJicmVjaGVuPC9hPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsIGRpc2FibGVkXFxcIiBpZD1cXFwibW9kYWxcXFwiPlxcbiAgICA8aDM+RmVobGVycHJvdG9rb2xsIGYmdXVtbDtyIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5pc3N1ZURldmljZUlkXFxcIj48L3NwYW4+IG1lbGRlbjwvaDM+XFxuICAgIDxmb3JtPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIFN0YW5kYXJkZmVobGVyOlxcbiAgICAgICAgICAgIDxzcGFuXFxuICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIkVpbmUgTGlzdGUgbWl0IGgmYXVtbDtmaWcgYXVmdHJldGVuZGVuIEZlaGxlcm4uXFxuICAgICAgICAgICAgICAgIFNvbGx0ZW4gU2llIGVpbmVuIGFuZGVyZW4gRmVobGVyIHdpZWRlcmhvbHQgZmVzdHN0ZWxsZW4sIGsmb3VtbDtubmVuIFNpZSBJaG4gbWl0IGRlbSBCdXR0b24gdW50ZW4genVyIExpc3RlIGhpbnp1ZiZ1dW1sO2dlbi5cXFwiXFxuICAgICAgICAgICAgPmk8L3NwYW4+XFxuICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cXFwidGVtcGxhdGUtc2VsZWN0XFxcIiBpZD1cXFwidGVtcGxhdGUtc2VsZWN0XFxcIiBkYXRhLWJpbmQ9XFxcIm9wdGlvbnM6ICRwYXJlbnQuY29tbW9uSXNzdWVOYW1lTGlzdCwgc2VsZWN0ZWRPcHRpb25zOiAkcGFyZW50LnNlbGVjdGVkQ29tbW9uSXNzdWVcXFwiPlxcbiAgICAgICAgICAgICAgICA8b3B0aW9uIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvb3B0aW9uPlxcbiAgICAgICAgICAgIDwvc2VsZWN0PlxcbiAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJidXR0b24gdGVtcGxhdGUtc2F2ZVxcXCIgaHJlZj1cXFwiI1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zYXZlQXNUZW1wbGF0ZSgpXFxcIj5TdGFuZGFyZGZlaGxlciBzcGVpY2hlcm48L2E+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIEJldHJlZmY6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiXFxuICAgICAgICAgICAgICAgIGRhdGEtdG9vbHRpcD1cXFwiR2ViZW4gU2llIGVpbmVuIFRpdGVsIGYmdXVtbDtyIElocmVuIEZlaGxlciBhbi4gRGVyIFRpdGVsIHdpcmQgZiZ1dW1sO3IgZGVuIEJldHJlZmYgZGVyIEUtTWFpbHMgdmVyd2VuZGV0LlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcInRpdGxlXFxcIiBuYW1lPVxcXCJ0aXRsZVxcXCIgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC50aXRsZVxcXCIgPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICBCZXNjaHJlaWJ1bmcqOlxcbiAgICAgICAgICAgIDxzcGFuXFxuICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIlBmbGljaHRmZWxkISBHZWJlbiBTaWUgaGllciBlaW5lIEJlc2NocmVpYnVuZyBJaHJlcyBGZWhsZXJzIGFuLlxcbiAgICAgICAgICAgICAgICBGYWxscyBTaWUgZWluZW4gU3RhbmRhcmRmZWhsZXIgbWVsZGVuIG0mb3VtbDtjaHRlbiwgayZvdW1sO25uZW4gU2llIGlobiBoaWVyIHdlaXRlciBzcGV6aWZpemllcmVuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XFxcImRlc2NyaXB0aW9uXFxcIiBuYW1lPVxcXCJkZXNjcmlwdGlvblxcXCIgbWF4bGVuZ3RoPVxcXCI1MDBcXFwiIHJlcXVpcmVkIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQuZGVzY3JpcHRpb25cXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIExlaHJlciBiZW5hY2hyaWNodGlnZW46XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiXFxuICAgICAgICAgICAgICAgIGRhdGEtdG9vbHRpcD1cXFwiRmFsbHMgYXVzZ2V3JmF1bWw7aGx0LCB3aXJkIGVpbmUgRS1NYWlsIGFuIGFsbGUgTGVocmVyIHZlcnNjaGlja3QsIGRpZSBuYWNoIFBsYW4gaW4gZGllc2VtIFJhdW0gdW50ZXJyaWNodGVuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImNvbnRhY3RNYWlsLXRlYWNoZXJzXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiAkcGFyZW50LmFkZFRlYWNoZXJzVG9NYWlsXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIFBDLVdlcmtzdGF0dCBiZW5hY2hyaWNodGlnZW46XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRmFsbHMgYXVzZ2V3JmF1bWw7aGx0LCB3aXJkIGVpbmUgRS1NYWlsIGFuIGRpZSBQQy1XZXJrc3RhdHQgdmVyc2NoaWNrdC5cXFwiPmk8L3NwYW4+XFxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJjb250YWN0TWFpbC13b3Jrc2hvcFxcXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDogJHBhcmVudC5hZGRXb3Jrc2hvcFRvTWFpbFxcXCIgPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG5cXG4gICAgICAgIDxsYWJlbCBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogNXB4XFxcIj5cXG4gICAgICAgICAgICBSYXVtYmV0cmV1ZXI6XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRGVyIFJhdW1iZXRyZXVlciB3aXJkICZ1dW1sO2JlciBqZWRlbiBGZWhsZXIgaW4gS2VubnRuaXMgZ2VzZXR6dC5cXFwiPmk8L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21Db250YWN0TWFpbFxcXCIgc3R5bGU9XFxcImNvbG9yOiAjODg4XFxcIj48L3NwYW4+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIHdlaXRlcmUgRW1wJmF1bWw7bmdlcjogPHNwYW5cXG4gICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJFaW5lIExpc3RlIGFuIHp1cyZhdW1sO3R6bGljaGVuIEVtcCZhdW1sO25nZXJuLiBUcmVubmVuIFNpZSBtZWhyZXJlIEUtTWFpbC1BZHJlc3NlbiBtaXQgZWluZW0gS29tbWEuXFxcIlxcbiAgICAgICAgPmk8L3NwYW4+IDx0ZXh0YXJlYSBjbGFzcz1cXFwicmVjaXBpZW50c1xcXCIgbmFtZT1cXFwicmVjaXBpZW50c1xcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5pc3N1ZVJlY2lwaWVudHNcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICA8L2xhYmVsPlxcblxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWJvcnRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2FuY2VsSXNzdWUoKVxcXCI+QWJicmVjaGVuPC9hPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gY29uZmlybVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5hZGRJc3N1ZSgpXFxcIj5Qcm90b2tvbGwgYXVmbmVobWVuPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgPC9mb3JtPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcInRvYXN0IGVycm9yXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRwYXJlbnQuc2hvd0Vycm9yXFxcIj5cXG4gICAgPHAgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LmVycm9yXFxcIj48L3A+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuaGlkZVRvYXN0KClcXFwiIHZhbHVlPVxcXCJYXFxcIiA+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiaXNzdWUtbGlzdFxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImlzc3VlLWl0ZW1zXFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6ICRwYXJlbnQuaXNzdWVMaXN0XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtaXRlbVxcXCI+XFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGV2aWNlSWRcXFwiPjwvc3Bhbj4sXFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IGRlc2NyaXB0aW9uXFxcIj48L3NwYW4+LFxcbiAgICAgICAgICAgIEVtcGYmYXVtbDtuZ2VyOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHJlY2lwaWVudHNcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHJlbW92ZVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZWxldGVJc3N1ZShpc3N1ZUlkKVxcXCI+RW50ZmVybmVuPC9hPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhY3Rpb25zXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLWNsZWFyXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNsZWFySXNzdWVzKClcXFwiPkxpc3RlIGRlciBGZWhsZXJwcm90b2tvbGxlIGxlZXJlbjwvYT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLXNlbmRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2VuZElzc3VlcygpXFxcIj5MaXN0ZSBkZXIgRmVobGVycHJvdG9rb2xsZSBhYnNlbmRlbjwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4iLCJpbXBvcnQge1Jvb21MYXlvdXR9IGZyb20gJy4uL3Jvb20vUm9vbUxheW91dCc7XG5pbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBSb29tQ2lyY3VsYXIgZXh0ZW5kcyBSb29tTGF5b3V0IHtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTVBPTkVOVF9OQU1FID0gJ3Jvb21DaXJjdWxhcic7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21tb25Jc3N1ZXM6IGFueSwgaXNzdWVGb3JtQ29udGFpbmVyOiBJc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucykge1xuICAgICAgICBzdXBlcihjb21tb25Jc3N1ZXMsIGlzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnMsIFJvb21DaXJjdWxhci5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uUmVuZGVyKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFJvb21DaXJjdWxhci5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG59XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIucm9vbS1jb250YWluZXIge1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBmbG9hdDogbGVmdDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZy10b3A6IDUlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWFyZ2luLWJvdHRvbTogMjAwcHg7IH1cXG5cXG4udGFibGUtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZmxvYXQ6IGxlZnQ7XFxuICB3aWR0aDogNDAlO1xcbiAgYm9yZGVyOiAycHggc29saWQgIzMzMztcXG4gIGhlaWdodDogMzAlO1xcbiAgbWFyZ2luLWJvdHRvbTogNSU7XFxuICBwYWRkaW5nOiAyLjUlIDAgMi41JSAyLjUlO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxcbiAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayB7XFxuICAgIGhlaWdodDogMjAlO1xcbiAgICBtYXJnaW46IDBweCA1JSA1JSAwcHg7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZmxvYXQ6IHJpZ2h0O1xcbiAgICBib3R0b206IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHdpZHRoOiA1MCU7IH1cXG4gICAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayAuZGV2aWNlIHtcXG4gICAgICBoZWlnaHQ6IDk1JTtcXG4gICAgICB3aWR0aDogMjglOyB9XFxuICAudGFibGUtZ3JvdXA6bnRoLW9mLXR5cGUoZXZlbikge1xcbiAgICBtYXJnaW4tbGVmdDogMjAlOyB9XFxuXFxuLmRldmljZSB7XFxuICBoZWlnaHQ6IDQ1JTtcXG4gIHdpZHRoOiA0NSU7XFxuICBtYXJnaW46IDAgNSUgNSUgMDsgfVxcbiAgLmRldmljZS50b3Age1xcbiAgICBsZWZ0OiAwO1xcbiAgICB0b3A6IDA7IH1cXG4gIC5kZXZpY2UuYm90LXJpZ2h0IHtcXG4gICAgcmlnaHQ6IDA7XFxuICAgIGJvdHRvbTogMDsgfVxcbiAgLmRldmljZS5ib3QtbGVmdCB7XFxuICAgIGxlZnQ6IDA7XFxuICAgIGJvdHRvbTogMDsgfVxcbiAgLmRldmljZS5maWxsZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cXG4gIC5kZXZpY2U6aG92ZXIge1xcbiAgICAvKmJvcmRlcjogMnB4IHNvbGlkIGJsdWU7Ki9cXG4gICAgYm9yZGVyOiBub25lOyB9XFxuICAuZGV2aWNlIHNwYW4ge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHRvcDogNDAlO1xcbiAgICB0cmFuc2xhdGVZOiAtNTAlOyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgyIGNsYXNzPVxcXCJyb29tLXRpdGxlXFxcIj5SYXVtOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUlkXFxcIj48L3NwYW4+IFJhdW1iZXRyZXVlcjogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21Db250YWN0XFxcIj48L3NwYW4+PC9oMj48aW1nXFxuICAgIHNyYz1cXFwic3R5bGVzL2VkaXQucG5nXFxcIiBhbHQ9XFxcIlxcXCIgY2xhc3M9XFxcImVkaXRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2V0Q2hhbmdlQ29udGFjdCh0cnVlKVxcXCI+XFxuXFxuPGRpdiBjbGFzcz1cXFwicm9vbS1jb250YWluZXJcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTFcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMSlcXFwiPjxzcGFuPjE8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMTwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtMlxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygyKVxcXCI+PHNwYW4+Mjwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygzKVxcXCI+PHNwYW4+Mzwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAyPC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtNFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg0KVxcXCI+PHNwYW4+NDwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS01XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDUpXFxcIj48c3Bhbj41PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS02XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDYpXFxcIj48c3Bhbj42PC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS03XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDcpXFxcIj48c3Bhbj43PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGZpbGxlclxcXCI+PGgzPlRpc2NoIDM8L2gzPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLThcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOClcXFwiPjxzcGFuPjg8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTlcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOSlcXFwiPjxzcGFuPjk8L3NwYW4+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cCBleHRlbmRlZFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggNDwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTEwXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEwKVxcXCI+PHNwYW4+MTA8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtMTFcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTEpXFxcIj48c3Bhbj4xMTwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtMTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTIpXFxcIj48c3Bhbj4xMjwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwIHRlYWNoZXItZGVza1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTMpXFxcIj48c3Bhbj5MZWhyZXI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTQpXFxcIj48c3Bhbj5CZWFtZXI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTUpXFxcIj48c3Bhbj5XZWl0ZXJlPC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJjaGFuZ2VDb250YWN0UG9wdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogJHBhcmVudC5zaG93Q2hhbmdlQ29udGFjdFxcXCI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnJvb21Db250YWN0SW5wdXRcXFwiID5cXG4gICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQucm9vbUNvbnRhY3RNYWlsSW5wdXRcXFwiID5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNoYW5nZUNvbnRhY3QoKVxcXCI+UmF1bWJldHJldWVyICZhdW1sO25kZXJuPC9hPlxcbiAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGFib3J0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNldENoYW5nZUNvbnRhY3QoZmFsc2UpXFxcIj5BYmJyZWNoZW48L2E+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwibW9kYWwgZGlzYWJsZWRcXFwiIGlkPVxcXCJtb2RhbFxcXCI+XFxuICAgIDxoMz5GZWhsZXJwcm90b2tvbGwgZiZ1dW1sO3IgR2VyJmF1bWw7dDogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50Lmlzc3VlRGV2aWNlSWRcXFwiPjwvc3Bhbj4gbWVsZGVuPC9oMz5cXG4gICAgPGZvcm0+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgU3RhbmRhcmRmZWhsZXI6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRWluZSBMaXN0ZSBtaXQgaCZhdW1sO2ZpZyBhdWZ0cmV0ZW5kZW4gRmVobGVybi5cXG4gICAgICAgICAgICAgICAgU29sbHRlbiBTaWUgZWluZW4gYW5kZXJlbiBGZWhsZXIgd2llZGVyaG9sdCBmZXN0c3RlbGxlbiwgayZvdW1sO25uZW4gU2llIElobiBtaXQgZGVtIEJ1dHRvbiB1bnRlbiB6dXIgTGlzdGUgaGluenVmJnV1bWw7Z2VuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGlkPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczogJHBhcmVudC5jb21tb25Jc3N1ZU5hbWVMaXN0LCBzZWxlY3RlZE9wdGlvbnM6ICRwYXJlbnQuc2VsZWN0ZWRDb21tb25Jc3N1ZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxvcHRpb24gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9vcHRpb24+XFxuICAgICAgICAgICAgPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvbiB0ZW1wbGF0ZS1zYXZlXFxcIiBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNhdmVBc1RlbXBsYXRlKClcXFwiPlN0YW5kYXJkZmVobGVyIHNwZWljaGVybjwvYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmV0cmVmZjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCJcXG4gICAgICAgICAgICAgICAgZGF0YS10b29sdGlwPVxcXCJHZWJlbiBTaWUgZWluZW4gVGl0ZWwgZiZ1dW1sO3IgSWhyZW4gRmVobGVyIGFuLiBEZXIgVGl0ZWwgd2lyZCBmJnV1bWw7ciBkZW4gQmV0cmVmZiBkZXIgRS1NYWlscyB2ZXJ3ZW5kZXQuXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwidGl0bGVcXFwiIG5hbWU9XFxcInRpdGxlXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnRpdGxlXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIEJlc2NocmVpYnVuZyo6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiUGZsaWNodGZlbGQhIEdlYmVuIFNpZSBoaWVyIGVpbmUgQmVzY2hyZWlidW5nIElocmVzIEZlaGxlcnMgYW4uXFxuICAgICAgICAgICAgICAgIEZhbGxzIFNpZSBlaW5lbiBTdGFuZGFyZGZlaGxlciBtZWxkZW4gbSZvdW1sO2NodGVuLCBrJm91bWw7bm5lbiBTaWUgaWhuIGhpZXIgd2VpdGVyIHNwZXppZml6aWVyZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiZGVzY3JpcHRpb25cXFwiIG5hbWU9XFxcImRlc2NyaXB0aW9uXFxcIiBtYXhsZW5ndGg9XFxcIjUwMFxcXCIgcmVxdWlyZWQgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5kZXNjcmlwdGlvblxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgTGVocmVyIGJlbmFjaHJpY2h0aWdlbjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCJcXG4gICAgICAgICAgICAgICAgZGF0YS10b29sdGlwPVxcXCJGYWxscyBhdXNnZXcmYXVtbDtobHQsIHdpcmQgZWluZSBFLU1haWwgYW4gYWxsZSBMZWhyZXIgdmVyc2NoaWNrdCwgZGllIG5hY2ggUGxhbiBpbiBkaWVzZW0gUmF1bSB1bnRlcnJpY2h0ZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiY29udGFjdE1haWwtdGVhY2hlcnNcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6ICRwYXJlbnQuYWRkVGVhY2hlcnNUb01haWxcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgUEMtV2Vya3N0YXR0IGJlbmFjaHJpY2h0aWdlbjpcXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJGYWxscyBhdXNnZXcmYXVtbDtobHQsIHdpcmQgZWluZSBFLU1haWwgYW4gZGllIFBDLVdlcmtzdGF0dCB2ZXJzY2hpY2t0LlxcXCI+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImNvbnRhY3RNYWlsLXdvcmtzaG9wXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiAkcGFyZW50LmFkZFdvcmtzaG9wVG9NYWlsXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcblxcbiAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiA1cHhcXFwiPlxcbiAgICAgICAgICAgIFJhdW1iZXRyZXVlcjpcXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJEZXIgUmF1bWJldHJldWVyIHdpcmQgJnV1bWw7YmVyIGplZGVuIEZlaGxlciBpbiBLZW5udG5pcyBnZXNldHp0LlxcXCI+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUNvbnRhY3RNYWlsXFxcIiBzdHlsZT1cXFwiY29sb3I6ICM4ODhcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgd2VpdGVyZSBFbXAmYXVtbDtuZ2VyOiA8c3BhblxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIkVpbmUgTGlzdGUgYW4genVzJmF1bWw7dHpsaWNoZW4gRW1wJmF1bWw7bmdlcm4uIFRyZW5uZW4gU2llIG1laHJlcmUgRS1NYWlsLUFkcmVzc2VuIG1pdCBlaW5lbSBLb21tYS5cXFwiXFxuICAgICAgICA+aTwvc3Bhbj4gPHRleHRhcmVhIGNsYXNzPVxcXCJyZWNpcGllbnRzXFxcIiBuYW1lPVxcXCJyZWNpcGllbnRzXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50Lmlzc3VlUmVjaXBpZW50c1xcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuXFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhYm9ydFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jYW5jZWxJc3N1ZSgpXFxcIj5BYmJyZWNoZW48L2E+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmFkZElzc3VlKClcXFwiPlByb3Rva29sbCBhdWZuZWhtZW48L2E+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICA8L2Zvcm0+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwidG9hc3QgZXJyb3JcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogJHBhcmVudC5zaG93RXJyb3JcXFwiPlxcbiAgICA8cCBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQuZXJyb3JcXFwiPjwvcD5cXG4gICAgPGlucHV0IHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5oaWRlVG9hc3QoKVxcXCIgdmFsdWU9XFxcIlhcXFwiID5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJpc3N1ZS1saXN0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiaXNzdWUtaXRlbXNcXFwiIGRhdGEtYmluZD1cXFwiZm9yZWFjaDogJHBhcmVudC5pc3N1ZUxpc3RcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1pdGVtXFxcIj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHRpdGxlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgR2VyJmF1bWw7dDogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiBkZXZpY2VJZFxcXCI+PC9zcGFuPixcXG4gICAgICAgICAgICBCZXNjaHJlaWJ1bmc6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGVzY3JpcHRpb25cXFwiPjwvc3Bhbj4sXFxuICAgICAgICAgICAgRW1wZiZhdW1sO25nZXI6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogcmVjaXBpZW50c1xcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gcmVtb3ZlXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRlbGV0ZUlzc3VlKGlzc3VlSWQpXFxcIj5FbnRmZXJuZW48L2E+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcImFjdGlvbnNcXFwiPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhY3Rpb24tY2xlYXJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2xlYXJJc3N1ZXMoKVxcXCI+TGlzdGUgZGVyIEZlaGxlcnByb3Rva29sbGUgbGVlcmVuPC9hPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhY3Rpb24tc2VuZFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zZW5kSXNzdWVzKClcXFwiPkxpc3RlIGRlciBGZWhsZXJwcm90b2tvbGxlIGFic2VuZGVuPC9hPlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiIsImltcG9ydCB7Um9vbUxheW91dH0gZnJvbSAnLi4vcm9vbS9Sb29tTGF5b3V0JztcbmltcG9ydCB7SXNzdWVGb3JtQ29udGFpbmVyfSBmcm9tICcuLi8uLi8uLi9jb21tb24vSXNzdWVGb3JtQ29udGFpbmVyJztcbmltcG9ydCB7VXNlckFjdGlvbnN9IGZyb20gJy4uLy4uLy4uL1VzZXJBY3Rpb25zJztcblxuZXhwb3J0IGNsYXNzIFJvb21Hcm91cHNBbmdsZWQgZXh0ZW5kcyBSb29tTGF5b3V0IHtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTVBPTkVOVF9OQU1FID0gJ3Jvb21Hcm91cHNBbmdsZWQnO1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbW9uSXNzdWVzOiBhbnksIGlzc3VlRm9ybUNvbnRhaW5lcjogSXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9uczogVXNlckFjdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoY29tbW9uSXNzdWVzLCBpc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zLCBSb29tR3JvdXBzQW5nbGVkLkNPTVBPTkVOVF9OQU1FKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25SZW5kZXIoKXtcbiAgICAgICAgY29uc29sZS5sb2coUm9vbUdyb3Vwc0FuZ2xlZC5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxufVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLnJvb20tY29udGFpbmVyIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZmxvYXQ6IGxlZnQ7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDUlIDAgMCA1JTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG1hcmdpbi1ib3R0b206IDIwMHB4OyB9XFxuXFxuLnRhYmxlLWdyb3VwIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgd2lkdGg6IDQ1JTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkICMzMzM7XFxuICBoZWlnaHQ6IDMwJTtcXG4gIG1hcmdpbjogMCA1JSA1JSAwO1xcbiAgcGFkZGluZzogMi41JSAwIDIuNSUgMi41JTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cXG4gIC50YWJsZS1ncm91cC50ZWFjaGVyLWRlc2sge1xcbiAgICBoZWlnaHQ6IDIwJTtcXG4gICAgbWFyZ2luOiAwcHggNSUgNSUgMHB4O1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGZsb2F0OiByaWdodDtcXG4gICAgYm90dG9tOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICB3aWR0aDogNTAlOyB9XFxuICAgIC50YWJsZS1ncm91cC50ZWFjaGVyLWRlc2sgLmRldmljZSB7XFxuICAgICAgaGVpZ2h0OiA5NSU7XFxuICAgICAgd2lkdGg6IDI4JTsgfVxcblxcbi5kZXZpY2Uge1xcbiAgaGVpZ2h0OiA0NSU7XFxuICB3aWR0aDogNDUlO1xcbiAgbWFyZ2luOiAwIDUlIDUlIDA7IH1cXG4gIC5kZXZpY2UudG9wIHtcXG4gICAgbGVmdDogMDtcXG4gICAgdG9wOiAwOyB9XFxuICAuZGV2aWNlLmJvdC1yaWdodCB7XFxuICAgIHJpZ2h0OiAwO1xcbiAgICBib3R0b206IDA7IH1cXG4gIC5kZXZpY2UuYm90LWxlZnQge1xcbiAgICBsZWZ0OiAwO1xcbiAgICBib3R0b206IDA7IH1cXG4gIC5kZXZpY2UuZmlsbGVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lOyB9XFxuICAuZGV2aWNlOmhvdmVyIHtcXG4gICAgLypib3JkZXI6IDJweCBzb2xpZCBibHVlOyovXFxuICAgIGJvcmRlcjogbm9uZTsgfVxcbiAgLmRldmljZSBzcGFuIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB0b3A6IDQwJTtcXG4gICAgdHJhbnNsYXRlWTogLTUwJTsgfVxcblwiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMiBjbGFzcz1cXFwicm9vbS10aXRsZVxcXCI+UmF1bTogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21JZFxcXCI+PC9zcGFuPiBSYXVtYmV0cmV1ZXI6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5yb29tQ29udGFjdFxcXCI+PC9zcGFuPjwvaDI+PGltZ1xcbiAgICBzcmM9XFxcInN0eWxlcy9lZGl0LnBuZ1xcXCIgYWx0PVxcXCJcXFwiIGNsYXNzPVxcXCJlZGl0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNldENoYW5nZUNvbnRhY3QodHJ1ZSlcXFwiPlxcblxcbjxkaXYgY2xhc3M9XFxcInJvb20tY29udGFpbmVyXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS0xXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEpXFxcIj48c3Bhbj4xPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGZpbGxlclxcXCI+PGgzPlRpc2NoIDE8L2gzPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMilcXFwiPjxzcGFuPjI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMylcXFwiPjxzcGFuPjM8L3NwYW4+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNClcXFwiPjxzcGFuPjQ8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMjwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtNVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg1KVxcXCI+PHNwYW4+NTwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtNlxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg2KVxcXCI+PHNwYW4+Njwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtN1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg3KVxcXCI+PHNwYW4+Nzwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAzPC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS04XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDgpXFxcIj48c3Bhbj44PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS05XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDkpXFxcIj48c3Bhbj45PC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXAgZXh0ZW5kZWRcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS0xMFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMClcXFwiPjxzcGFuPjEwPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGZpbGxlclxcXCI+PGgzPlRpc2NoIDQ8L2gzPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTExXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDExKVxcXCI+PHNwYW4+MTE8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTEyXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEyKVxcXCI+PHNwYW4+MTI8L3NwYW4+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cCB0ZWFjaGVyLWRlc2tcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTEzXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEzKVxcXCI+PHNwYW4+TGVocmVyPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTE0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDE0KVxcXCI+PHNwYW4+QmVhbWVyPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTE1XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDE1KVxcXCI+PHNwYW4+V2VpdGVyZTwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiY2hhbmdlQ29udGFjdFBvcHVwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRwYXJlbnQuc2hvd0NoYW5nZUNvbnRhY3RcXFwiPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5yb29tQ29udGFjdElucHV0XFxcIiA+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnJvb21Db250YWN0TWFpbElucHV0XFxcIiA+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gY29uZmlybVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jaGFuZ2VDb250YWN0KClcXFwiPlJhdW1iZXRyZXVlciAmYXVtbDtuZGVybjwvYT5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhYm9ydFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zZXRDaGFuZ2VDb250YWN0KGZhbHNlKVxcXCI+QWJicmVjaGVuPC9hPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsIGRpc2FibGVkXFxcIiBpZD1cXFwibW9kYWxcXFwiPlxcbiAgICA8aDM+RmVobGVycHJvdG9rb2xsIGYmdXVtbDtyIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5pc3N1ZURldmljZUlkXFxcIj48L3NwYW4+IG1lbGRlbjwvaDM+XFxuICAgIDxmb3JtPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIFN0YW5kYXJkZmVobGVyOlxcbiAgICAgICAgICAgIDxzcGFuXFxuICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIkVpbmUgTGlzdGUgbWl0IGgmYXVtbDtmaWcgYXVmdHJldGVuZGVuIEZlaGxlcm4uXFxuICAgICAgICAgICAgICAgIFNvbGx0ZW4gU2llIGVpbmVuIGFuZGVyZW4gRmVobGVyIHdpZWRlcmhvbHQgZmVzdHN0ZWxsZW4sIGsmb3VtbDtubmVuIFNpZSBJaG4gbWl0IGRlbSBCdXR0b24gdW50ZW4genVyIExpc3RlIGhpbnp1ZiZ1dW1sO2dlbi5cXFwiXFxuICAgICAgICAgICAgPmk8L3NwYW4+XFxuICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cXFwidGVtcGxhdGUtc2VsZWN0XFxcIiBpZD1cXFwidGVtcGxhdGUtc2VsZWN0XFxcIiBkYXRhLWJpbmQ9XFxcIm9wdGlvbnM6ICRwYXJlbnQuY29tbW9uSXNzdWVOYW1lTGlzdCwgc2VsZWN0ZWRPcHRpb25zOiAkcGFyZW50LnNlbGVjdGVkQ29tbW9uSXNzdWVcXFwiPlxcbiAgICAgICAgICAgICAgICA8b3B0aW9uIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvb3B0aW9uPlxcbiAgICAgICAgICAgIDwvc2VsZWN0PlxcbiAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJidXR0b24gdGVtcGxhdGUtc2F2ZVxcXCIgaHJlZj1cXFwiI1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zYXZlQXNUZW1wbGF0ZSgpXFxcIj5TdGFuZGFyZGZlaGxlciBzcGVpY2hlcm48L2E+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIEJldHJlZmY6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiXFxuICAgICAgICAgICAgICAgIGRhdGEtdG9vbHRpcD1cXFwiR2ViZW4gU2llIGVpbmVuIFRpdGVsIGYmdXVtbDtyIElocmVuIEZlaGxlciBhbi4gRGVyIFRpdGVsIHdpcmQgZiZ1dW1sO3IgZGVuIEJldHJlZmYgZGVyIEUtTWFpbHMgdmVyd2VuZGV0LlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcInRpdGxlXFxcIiBuYW1lPVxcXCJ0aXRsZVxcXCIgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC50aXRsZVxcXCIgPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICBCZXNjaHJlaWJ1bmcqOlxcbiAgICAgICAgICAgIDxzcGFuXFxuICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIlBmbGljaHRmZWxkISBHZWJlbiBTaWUgaGllciBlaW5lIEJlc2NocmVpYnVuZyBJaHJlcyBGZWhsZXJzIGFuLlxcbiAgICAgICAgICAgICAgICBGYWxscyBTaWUgZWluZW4gU3RhbmRhcmRmZWhsZXIgbWVsZGVuIG0mb3VtbDtjaHRlbiwgayZvdW1sO25uZW4gU2llIGlobiBoaWVyIHdlaXRlciBzcGV6aWZpemllcmVuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XFxcImRlc2NyaXB0aW9uXFxcIiBuYW1lPVxcXCJkZXNjcmlwdGlvblxcXCIgbWF4bGVuZ3RoPVxcXCI1MDBcXFwiIHJlcXVpcmVkIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQuZGVzY3JpcHRpb25cXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIExlaHJlciBiZW5hY2hyaWNodGlnZW46XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiXFxuICAgICAgICAgICAgICAgIGRhdGEtdG9vbHRpcD1cXFwiRmFsbHMgYXVzZ2V3JmF1bWw7aGx0LCB3aXJkIGVpbmUgRS1NYWlsIGFuIGFsbGUgTGVocmVyIHZlcnNjaGlja3QsIGRpZSBuYWNoIFBsYW4gaW4gZGllc2VtIFJhdW0gdW50ZXJyaWNodGVuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImNvbnRhY3RNYWlsLXRlYWNoZXJzXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiAkcGFyZW50LmFkZFRlYWNoZXJzVG9NYWlsXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIFBDLVdlcmtzdGF0dCBiZW5hY2hyaWNodGlnZW46XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRmFsbHMgYXVzZ2V3JmF1bWw7aGx0LCB3aXJkIGVpbmUgRS1NYWlsIGFuIGRpZSBQQy1XZXJrc3RhdHQgdmVyc2NoaWNrdC5cXFwiPmk8L3NwYW4+XFxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJjb250YWN0TWFpbC13b3Jrc2hvcFxcXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDogJHBhcmVudC5hZGRXb3Jrc2hvcFRvTWFpbFxcXCIgPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG5cXG4gICAgICAgIDxsYWJlbCBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogNXB4XFxcIj5cXG4gICAgICAgICAgICBSYXVtYmV0cmV1ZXI6XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRGVyIFJhdW1iZXRyZXVlciB3aXJkICZ1dW1sO2JlciBqZWRlbiBGZWhsZXIgaW4gS2VubnRuaXMgZ2VzZXR6dC5cXFwiPmk8L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21Db250YWN0TWFpbFxcXCIgc3R5bGU9XFxcImNvbG9yOiAjODg4XFxcIj48L3NwYW4+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIHdlaXRlcmUgRW1wJmF1bWw7bmdlcjogPHNwYW5cXG4gICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJFaW5lIExpc3RlIGFuIHp1cyZhdW1sO3R6bGljaGVuIEVtcCZhdW1sO25nZXJuLiBUcmVubmVuIFNpZSBtZWhyZXJlIEUtTWFpbC1BZHJlc3NlbiBtaXQgZWluZW0gS29tbWEuXFxcIlxcbiAgICAgICAgPmk8L3NwYW4+IDx0ZXh0YXJlYSBjbGFzcz1cXFwicmVjaXBpZW50c1xcXCIgbmFtZT1cXFwicmVjaXBpZW50c1xcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5pc3N1ZVJlY2lwaWVudHNcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICA8L2xhYmVsPlxcblxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWJvcnRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2FuY2VsSXNzdWUoKVxcXCI+QWJicmVjaGVuPC9hPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gY29uZmlybVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5hZGRJc3N1ZSgpXFxcIj5Qcm90b2tvbGwgYXVmbmVobWVuPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgPC9mb3JtPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcInRvYXN0IGVycm9yXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRwYXJlbnQuc2hvd0Vycm9yXFxcIj5cXG4gICAgPHAgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LmVycm9yXFxcIj48L3A+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuaGlkZVRvYXN0KClcXFwiIHZhbHVlPVxcXCJYXFxcIiA+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiaXNzdWUtbGlzdFxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImlzc3VlLWl0ZW1zXFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6ICRwYXJlbnQuaXNzdWVMaXN0XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtaXRlbVxcXCI+XFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGV2aWNlSWRcXFwiPjwvc3Bhbj4sXFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IGRlc2NyaXB0aW9uXFxcIj48L3NwYW4+LFxcbiAgICAgICAgICAgIEVtcGYmYXVtbDtuZ2VyOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHJlY2lwaWVudHNcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHJlbW92ZVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZWxldGVJc3N1ZShpc3N1ZUlkKVxcXCI+RW50ZmVybmVuPC9hPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhY3Rpb25zXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLWNsZWFyXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNsZWFySXNzdWVzKClcXFwiPkxpc3RlIGRlciBGZWhsZXJwcm90b2tvbGxlIGxlZXJlbjwvYT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLXNlbmRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2VuZElzc3VlcygpXFxcIj5MaXN0ZSBkZXIgRmVobGVycHJvdG9rb2xsZSBhYnNlbmRlbjwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4iLCJpbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5pbXBvcnQge1Jvb21MYXlvdXR9IGZyb20gJy4uL3Jvb20vUm9vbUxheW91dCc7XG5cblxuZXhwb3J0IGNsYXNzIFJvb21Hcm91cHMgZXh0ZW5kcyBSb29tTGF5b3V0IHtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTVBPTkVOVF9OQU1FID0gJ3Jvb21Hcm91cHMnO1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbW9uSXNzdWVzOiBhbnksIGlzc3VlRm9ybUNvbnRhaW5lcjogSXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9uczogVXNlckFjdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoY29tbW9uSXNzdWVzLCBpc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zLCBSb29tR3JvdXBzLkNPTVBPTkVOVF9OQU1FKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25SZW5kZXIoKXtcbiAgICAgICAgY29uc29sZS5sb2coUm9vbUdyb3Vwcy5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4uL0NvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7SXNzdWV9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9Jc3N1ZSc7XG5pbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSb29tTGF5b3V0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBwcml2YXRlIHN0YXRpYyBERVNDUklQVElPTl9JTlZBTElEID0gJ0JpdHRlIGdlYmVuIFNpZSBlaW5lIEJlc2NocmVpYnVuZyB6dW0gYXVmZ2V0cmV0ZW5lbiBGZWhsZXIgYW4uJztcbiAgICBwcml2YXRlIHN0YXRpYyBXT1JLU0hPUF9NQUlMID0gJ3BjLXdlcmtzdGF0dEBnc28ta29lbG4uZGUnO1xuICAgIHB1YmxpYyByb29tSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgdGl0bGUgPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwdWJsaWMgZGVzY3JpcHRpb24gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwdWJsaWMgaXNzdWVMaXN0ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcbiAgICBwdWJsaWMgc2VsZWN0ZWRDb21tb25Jc3N1ZSA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHB1YmxpYyBjb21tb25Jc3N1ZU5hbWVMaXN0OiBBcnJheTxhbnk+ID0gWydGZWhsZXIgYXVzd1xcdTAwZTRobGVuJ107XG4gICAgcHVibGljIHNob3dFcnJvcjogT2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIHB1YmxpYyBlcnJvcjogT2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgcHVibGljIHNob3dDaGFuZ2VDb250YWN0ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgcHVibGljIHJvb21Db250YWN0OiBzdHJpbmc7XG4gICAgcHVibGljIHJvb21Db250YWN0TWFpbElucHV0OiBPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwdWJsaWMgcm9vbUNvbnRhY3RJbnB1dDogT2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgcHJpdmF0ZSBjb21tb25Jc3N1ZUxpc3Q7XG4gICAgcHJpdmF0ZSBpc3N1ZUZvcm1Db250YWluZXI6IElzc3VlRm9ybUNvbnRhaW5lcjtcbiAgICBwcml2YXRlIGlzc3VlRGV2aWNlSWQ6IE9ic2VydmFibGU8bnVtYmVyPiA9IGtvLm9ic2VydmFibGUoMCk7XG4gICAgcHJpdmF0ZSBpc3N1ZVJlY2lwaWVudHMgPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwcml2YXRlIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucztcbiAgICBwcml2YXRlIGlzc3VlQ291bnRlciA9IDA7XG4gICAgcHJpdmF0ZSByb29tOiBhbnk7XG4gICAgcHJpdmF0ZSByb29tQ29udGFjdE1haWw6IHN0cmluZztcbiAgICBwcml2YXRlIGFkZFRlYWNoZXJzVG9NYWlsOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgcHJpdmF0ZSBhZGRXb3Jrc2hvcFRvTWFpbDogT2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbW1vbklzc3VlczogYW55LCBpc3N1ZUZvcm1Db250YWluZXI6IElzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnM6IFVzZXJBY3Rpb25zLCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHN1cGVyKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICB0aGlzLmNvbW1vbklzc3VlTGlzdCA9IGNvbW1vbklzc3VlcztcbiAgICAgICAgdGhpcy5pc3N1ZUZvcm1Db250YWluZXIgPSBpc3N1ZUZvcm1Db250YWluZXI7XG4gICAgICAgIHRoaXMudXNlckFjdGlvbnMgPSB1c2VyQWN0aW9ucztcblxuICAgICAgICBmb3IgKGxldCBjb21tb25Jc3N1ZSBvZiBjb21tb25Jc3N1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbW9uSXNzdWVOYW1lTGlzdC5wdXNoKGNvbW1vbklzc3VlLnRpdGxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDb21tb25Jc3N1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJc3N1ZSA9ICh0aGlzLmNvbW1vbklzc3VlTGlzdC5maWx0ZXIoKGNvbW1vbklzc3VlKSA9PiBjb21tb25Jc3N1ZS50aXRsZSA9PT0gbmV3VmFsdWVbMF0pKVswXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZWN0ZWRJc3N1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uKHNlbGVjdGVkSXNzdWUuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVSZWNpcGllbnRzKHNlbGVjdGVkSXNzdWUuYWRkaXRpb25hbFJlY2lwaWVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUoc2VsZWN0ZWRJc3N1ZS50aXRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENoYW5nZUNvbnRhY3Qoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0NoYW5nZUNvbnRhY3Qoc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNhdmVBc1RlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5ld0NvbW1vbklzc3VlID0ge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLnBlZWsoKSxcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUmVjaXBpZW50czogdGhpcy5pc3N1ZVJlY2lwaWVudHMucGVlaygpLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLnBlZWsoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy51c2VyQWN0aW9uc1xuICAgICAgICAgICAgICAgIC5zZW5kTmV3Q29tbW9uSXNzdWVUb1NlcnZlcihuZXdDb21tb25Jc3N1ZSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmFibGUgdG8gc2VuZCBuZXcgY29tbW9uIGlzc3VlIHRvIFNlcnZlciwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhcklzc3VlcygpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcblxuICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGV2aWNlJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBlbGVtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzLml0ZW0oaW5kZXgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXNzdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pc3N1ZUxpc3QoW10pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZW5kSXNzdWVzKCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNzdWVMaXN0LnBlZWsoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyQWN0aW9ucy5zZW5kSXNzdWVzVG9NYWlsU2VydmVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRlYWNoZXJzVG9NYWlsTGlzdDogdGhpcy5hZGRUZWFjaGVyc1RvTWFpbC5wZWVrKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IHRoaXMuaXNzdWVMaXN0LnBlZWsoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAudGhlbih0aGlzLmlzc3VlTGlzdChbXSkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmFibGUgdG8gc2VuZCBJc3N1ZXMgdG8gU2VydmVyLCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ25vIGlzc3VlcyB0byBzZW5kJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGNoYW5nZUNvbnRhY3QoKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNob3dDaGFuZ2VDb250YWN0KGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMudXNlckFjdGlvbnMuc2VuZENoYW5nZVJvb21Db250YWN0VG9NYWlsU2VydmVyKFxuICAgICAgICAgICAgICAgIHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdDogdGhpcy5yb29tQ29udGFjdElucHV0LnBlZWsoKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdE1haWw6IHRoaXMucm9vbUNvbnRhY3RNYWlsSW5wdXQucGVlaygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZGVsZXRlSXNzdWUoaXNzdWVJZCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5ld0lzc3VlTGlzdCA9IHRoaXMuaXNzdWVMaXN0LnBlZWsoKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG5ld0lzc3VlTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNzdWUgPSBuZXdJc3N1ZUxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChpc3N1ZS5pc3N1ZUlkID09PSBpc3N1ZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWxldGVkSXNzdWUgPSBuZXdJc3N1ZUxpc3Quc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZURldmljZUlzc3VlQ2xhc3NJZk5vTG9uZ2VySW5Jc3N1ZUxpc3QoZGVsZXRlZElzc3VlWzBdLmRldmljZUlkLCBuZXdJc3N1ZUxpc3QpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVMaXN0KG5ld0lzc3VlTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGV2aWNlSGFzSXNzdWVzKGRldmljZUlkKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGlzc3VlIG9mIHRoaXMuaXNzdWVMaXN0LnBlZWsoKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc3N1ZS5kZXZpY2VJZCA9PT0gZGV2aWNlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGNhbmNlbElzc3VlKCkge1xuICAgICAgICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XG4gICAgICAgIG1vZGFsRWxlbWVudC5jbGFzc05hbWUgPSBtb2RhbEVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoJ2FjdGl2ZScsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIHRoaXMucmVzZXRGb3JtRmllbGRzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZElzc3VlKCkge1xuICAgICAgICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc3N1ZURldmljZUlkLnBlZWsoKSAhPT0gMCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb24ucGVlaygpID09PSAnJyB8fCB0aGlzLmRlc2NyaXB0aW9uLnBlZWsoKS5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoUm9vbUxheW91dC5ERVNDUklQVElPTl9JTlZBTElEKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dFcnJvcihmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc3N1ZSA9IG5ldyBJc3N1ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlzc3VlLnRpdGxlID0gdGhpcy50aXRsZS5wZWVrKCk7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlLmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbi5wZWVrKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWNpcGllbnRzID0gdGhpcy5pc3N1ZVJlY2lwaWVudHMucGVlaygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFkZFdvcmtzaG9wVG9NYWlsLnBlZWsoKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjaXBpZW50cyArPSBSb29tTGF5b3V0LldPUktTSE9QX01BSUw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc3VlUmVjaXBpZW50cy5wZWVrKCkuaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlLnJlY2lwaWVudHMgPSByZWNpcGllbnRzLnRyaW0oKS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWUucmVjaXBpZW50cyA9IFtyZWNpcGllbnRzXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlzc3VlLmRldmljZUlkID0gdGhpcy5pc3N1ZURldmljZUlkLnBlZWsoKTtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWUuaXNzdWVJZCA9IHRoaXMuaXNzdWVDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlLnJvb21JZCA9IHRoaXMucm9vbUlkO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGV2aWNlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXZpY2UtJyArIGlzc3VlLmRldmljZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICBkZXZpY2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzc3VlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc3N1ZUxpc3QucHVzaChpc3N1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVGb3JtQ29udGFpbmVyLmFkZElzc3VlKGlzc3VlKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWxFbGVtZW50LmNsYXNzTmFtZSA9IG1vZGFsRWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgnYWN0aXZlJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRGb3JtRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWQocm9vbSkge1xuICAgICAgICB0aGlzLnJvb21JZCA9IHJvb20ucm9vbUlkO1xuICAgICAgICB0aGlzLnJvb21Db250YWN0ID0gcm9vbS5jb250YWN0O1xuICAgICAgICB0aGlzLnJvb21Db250YWN0SW5wdXQocm9vbS5jb250YWN0KTtcbiAgICAgICAgdGhpcy5yb29tQ29udGFjdE1haWwgPSByb29tLmNvbnRhY3RNYWlsO1xuICAgICAgICB0aGlzLnJvb21Db250YWN0TWFpbElucHV0KHJvb20uY29udGFjdE1haWwpO1xuICAgICAgICB0aGlzLnJvb20gPSByb29tO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXZpY2VDbGljayhkZXZpY2U6IHN0cmluZykge1xuICAgICAgICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljaycgKyBkZXZpY2UpO1xuICAgICAgICAgICAgbW9kYWxFbGVtZW50LmNsYXNzTmFtZSA9IG1vZGFsRWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgnZGlzYWJsZWQnLCAnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmlzc3VlRGV2aWNlSWQocGFyc2VJbnQoZGV2aWNlKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGVUb2FzdCgpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5lcnJvcignJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldEZvcm1GaWVsZHMoKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24oJycpO1xuICAgICAgICB0aGlzLmlzc3VlUmVjaXBpZW50cygnJyk7XG4gICAgICAgIHRoaXMudGl0bGUoJycpO1xuICAgICAgICB0aGlzLmFkZFRlYWNoZXJzVG9NYWlsKGZhbHNlKTtcbiAgICAgICAgdGhpcy5hZGRXb3Jrc2hvcFRvTWFpbChmYWxzZSk7XG4gICAgICAgIHRoaXMuaXNzdWVEZXZpY2VJZCgwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZURldmljZUlzc3VlQ2xhc3NJZk5vTG9uZ2VySW5Jc3N1ZUxpc3QoZGV2aWNlSWQsIGlzc3Vlcykge1xuICAgICAgICBsZXQgaXNzdWVzV2l0aEN1cnJlbnREZXZpY2VJZCA9IGlzc3Vlcy5maWx0ZXIoKGlzc3VlKSA9PiBpc3N1ZS5kZXZpY2VJZCA9PT0gZGV2aWNlSWQpO1xuXG4gICAgICAgIGlmIChpc3N1ZXNXaXRoQ3VycmVudERldmljZUlkLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RldmljZS0nICsgZGV2aWNlSWQpO1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpc3N1ZScpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLnNpZGViYXItY29udGFpbmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzOTNkNTM7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogMTUwcHg7IH1cXG4gIEBtZWRpYSAobWluLXdpZHRoOiA5MDBweCkge1xcbiAgICAuc2lkZWJhci1jb250YWluZXIge1xcbiAgICAgIHdpZHRoOiAyNTBweDsgfSB9XFxuXFxuLnNpZGViYXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcGFkZGluZzogMjVweDsgfVxcblxcbi5zaWRlYmFyLWxpc3Qge1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG4gIHBhZGRpbmc6IDA7XFxuICB3aWR0aDogMTAwJTsgfVxcbiAgLnNpZGViYXItbGlzdCAuaWNvbiB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBmbG9hdDogbGVmdDtcXG4gICAgbWFyZ2luLWxlZnQ6IDE1cHg7XFxuICAgIG1hcmdpbi10b3A6IDVweDsgfVxcbiAgLnNpZGViYXItbGlzdCBhIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgcGFkZGluZzogNXB4IDM1cHg7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gICAgd2lkdGg6IDEwMCU7IH1cXG4gIC5zaWRlYmFyLWxpc3QgLml0ZW0ge1xcbiAgICBtYXJnaW46IDVweCAwOyB9XFxuICAgIC5zaWRlYmFyLWxpc3QgLml0ZW0uYWN0aXZlIGEge1xcbiAgICAgIGJvcmRlci1sZWZ0OiA1cHggc29saWQgIzNjNzdiZTsgfVxcbiAgICAuc2lkZWJhci1saXN0IC5pdGVtOmhvdmVyIHtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNGU1MzcxOyB9XFxuICAuc2lkZWJhci1saXN0IC5zZXRpdGVtIHtcXG4gICAgbWFyZ2luLWxlZnQ6IDVweDsgfVxcblwiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjwhLS08ZGl2IGRhdGEtYmluZD1cXFwidGV4dDogSlNPTi5zdHJpbmdpZnkoJHBhcmVudClcXFwiPjwvZGl2Pi0tPlxcblxcbjxuYXYgY2xhc3M9XFxcInNpZGViYXItbGlzdFxcXCIgZGF0YS1iaW5kPVxcXCJmb3JlYWNoOiB7ZGF0YTogd2luZ0xpc3QsIGFzOiAnd2luZyd9XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiaXRlbSBhY3RpdmVcXFwiPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCI+PHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB3aW5nXFxcIj48L3NwYW4+PC9hPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6IHtkYXRhOiAkcGFyZW50LmdldFJvb21zQnlXaW5nKHdpbmcpLCBhczogJ3Jvb20nfVxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtIHNldGl0ZW0gYWN0aXZlXFxcIj5cXG4gICAgICAgICAgICA8YSBkYXRhLWJpbmQ9XFxcImF0dHI6IHtocmVmOiAnP3BhZ2U9cm9vbSZyb29tSWQ9Jytyb29tLnJvb21JZH1cXFwiPjxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogcm9vbS5yb29tSWRcXFwiPjwvc3Bhbj48L2E+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9uYXY+XFxuXCI7XG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi4vQ29tcG9uZW50JztcblxuZXhwb3J0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ09NUE9ORU5UX05BTUUgPSAnc2lkZWJhcic7XG4gICAgcHVibGljIHJvb21zOiBBcnJheTxhbnk+O1xuICAgIHB1YmxpYyB3aW5nTGlzdCA9IFtdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHJvb21zOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoU2lkZWJhci5DT01QT05FTlRfTkFNRSk7XG4gICAgICAgIHRoaXMucm9vbXMgPSByb29tcztcbiAgICAgICAgdGhpcy53aW5nTGlzdCA9IHRoaXMuZ2V0VW5pcXVlS2V5cyhyb29tcywgJ3dpbmcnKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYSA8IGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhID4gYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0Rmxvb3JMaXN0Rm9yV2luZyh3aW5nOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHdpbmdSb29tcyA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLndpbmcgPT09IHdpbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVbmlxdWVLZXlzKHdpbmdSb29tcywgJ2Zsb29yJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJvb21zKHdpbmcsIGZsb29yKSB7XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkUm9vbXMgPSB0aGlzLnJvb21zLmZpbHRlcigocm9vbSkgPT4gcm9vbS53aW5nID09PSB3aW5nICYmIHJvb20uZmxvb3IgPT09IGZsb29yKTtcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUm9vbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgaWYgKGEuc3Vic3RyKDEpIDwgYi5zdWJzdHIoMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhLnN1YnN0cigxKSA+IGIuc3Vic3RyKDEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXR1cm4gdGhpcy5yb29tcy5maWx0ZXIoKHJvb20pID0+IHJvb20ud2luZyA9PT0gd2luZyAmJiByb29tLmZsb29yID09PSBmbG9vcik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJvb21zQnlXaW5nKHdpbmcpIHtcbiAgICAgICAgbGV0IGZpbHRlcmVkUm9vbXMgPSB0aGlzLnJvb21zLmZpbHRlcigocm9vbSkgPT4gcm9vbS53aW5nID09PSB3aW5nKTtcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUm9vbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgaWYgKGEucm9vbUlkIDwgYi5yb29tSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhLnJvb21JZCA+IGIucm9vbUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Mb2FkKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbG9hZGluZyBzaWRlYmFyJyk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVZpZXdNb2RlbCh2aWV3TW9kZWw6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRVbmlxdWVLZXlzKGFyciwgcHJvcGVydHkpIHtcbiAgICAgICAgbGV0IHUgPSB7fSwgYSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghdS5oYXNPd25Qcm9wZXJ0eShhcnJbaV1bcHJvcGVydHldKSkge1xuICAgICAgICAgICAgICAgIGEucHVzaChhcnJbaV1bcHJvcGVydHldKTtcbiAgICAgICAgICAgICAgICB1W2FycltpXVtwcm9wZXJ0eV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi4vY29udGVudC9jb21wb25lbnRzL0NvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3MgS25vY2tvdXRDb21wb25lbnQge1xuXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdGVtcGxhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgdmlld01vZGVsOiB7IGluc3RhbmNlOiBDb21wb25lbnQgfVxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHRlbXBsYXRlOiBzdHJpbmcsIGNvbXBvbmVudDogQ29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGNvbXBvbmVudC5uYW1lO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgIHRoaXMudmlld01vZGVsID0ge2luc3RhbmNlOiBjb21wb25lbnR9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7U3R5bGVzU3VwcGxpZXJ9IGZyb20gXCIuL2NvbmZpZy9TdHlsZXNcIjtcbmltcG9ydCB7VGVtcGxhdGVTdXBwbGllcn0gZnJvbSBcIi4vY29uZmlnL1RlbXBsYXRlc1wiO1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuLi9jb250ZW50L2NvbXBvbmVudHMvQ29tcG9uZW50XCI7XG5pbXBvcnQge0tub2Nrb3V0Q29tcG9uZW50fSBmcm9tIFwiLi9Lbm9ja291dENvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3Mga25vY2tvdXRDb21wb25lbnRGYWN0b3J5IHtcblxuICAgIHByaXZhdGUgc3R5bGVzU3VwcGxpZXI6IFN0eWxlc1N1cHBsaWVyO1xuICAgIHByaXZhdGUgdGVtcGxhdGVTdXBwbGllcjogVGVtcGxhdGVTdXBwbGllcjtcbiAgICBwcml2YXRlIGNvbXBvbmVudHM6IEFycmF5PENvbXBvbmVudD47XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHRlbXBsYXRlU3VwcGxpZXI6IFRlbXBsYXRlU3VwcGxpZXIsXG4gICAgICAgIHN0eWxlc1N1cHBsaWVyOiBTdHlsZXNTdXBwbGllcixcbiAgICAgICAgY29tcG9uZW50czogQXJyYXk8Q29tcG9uZW50PlxuICAgICkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlU3VwcGxpZXIgPSB0ZW1wbGF0ZVN1cHBsaWVyO1xuICAgICAgICB0aGlzLnN0eWxlc1N1cHBsaWVyID0gc3R5bGVzU3VwcGxpZXI7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUtub2Nrb3V0Q29tcG9uZW50cygpOiBBcnJheTxLbm9ja291dENvbXBvbmVudD4ge1xuICAgICAgICBsZXQga25vY2tvdXRDb21wb25lbnRzOiBBcnJheTxLbm9ja291dENvbXBvbmVudD4gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5jb21wb25lbnRzKSB7XG4gICAgICAgICAgICBrbm9ja291dENvbXBvbmVudHMucHVzaCh0aGlzLmNyZWF0ZUtub2Nrb3V0Q29tcG9uZW50KGNvbXBvbmVudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtub2Nrb3V0Q29tcG9uZW50cztcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlS25vY2tvdXRDb21wb25lbnQoY29tcG9uZW50OiBDb21wb25lbnQpOiBLbm9ja291dENvbXBvbmVudCB7XG4gICAgICAgIGxldCBjb21wb25lbnROYW1lID0gdGhpcy5nZXRDb21wb25lbnROYW1lKGNvbXBvbmVudCk7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9ICc8c3R5bGU+JyArIHRoaXMuc3R5bGVzU3VwcGxpZXIuZ2V0U3R5bGVzKGNvbXBvbmVudE5hbWUpICsgJzwvc3R5bGU+JyArIHRoaXMudGVtcGxhdGVTdXBwbGllci5nZXRUZW1wbGF0ZShjb21wb25lbnROYW1lKTtcblxuICAgICAgICByZXR1cm4gbmV3IEtub2Nrb3V0Q29tcG9uZW50KHRlbXBsYXRlLCBjb21wb25lbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29tcG9uZW50TmFtZShjb21wb25lbnQ6IENvbXBvbmVudCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBuYW1lIGlzIG1pc3NpbmcuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcG9uZW50Lm5hbWU7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XG5pbXBvcnQge0tub2Nrb3V0Q29tcG9uZW50fSBmcm9tIFwiLi9rbm9ja091dENvbXBvbmVudFwiO1xuaW1wb3J0IHtIYW5kbGVyfSBmcm9tIFwiLi9oYW5kbGVycy9IYW5kbGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBLbm9ja291dEluaXRpYWxpemVyIHtcblxuICAgIHByaXZhdGUga25vY2tvdXRDb21wb25lbnRzOiBBcnJheTxLbm9ja291dENvbXBvbmVudD47XG4gICAgcHJpdmF0ZSBrbm9ja291dEhhbmRsZXJzOiBBcnJheTxIYW5kbGVyPjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAga25vY2tvdXRDb21wb25lbnRzOiBBcnJheTxLbm9ja291dENvbXBvbmVudD4sXG4gICAgICAgIGtub2Nrb3V0SGFuZGxlcnM6IEFycmF5PEhhbmRsZXI+LFxuICAgICkge1xuICAgICAgICB0aGlzLmtub2Nrb3V0Q29tcG9uZW50cyA9IGtub2Nrb3V0Q29tcG9uZW50cztcbiAgICAgICAgdGhpcy5rbm9ja291dEhhbmRsZXJzID0ga25vY2tvdXRIYW5kbGVycztcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5rbm9ja291dENvbXBvbmVudHMpO1xuICAgICAgICBmb3IgKGxldCBrbm9ja291dENvbXBvbmVudCBvZiB0aGlzLmtub2Nrb3V0Q29tcG9uZW50cykge1xuICAgICAgICAgICAga28uY29tcG9uZW50cy5yZWdpc3Rlcihrbm9ja291dENvbXBvbmVudC5uYW1lLCBrbm9ja291dENvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMua25vY2tvdXRIYW5kbGVycykge1xuICAgICAgICAgICAga28uYmluZGluZ0hhbmRsZXJzW2hhbmRsZXIubmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGNvbXBvbmVudENsYXNzTWFwcGluZyA9IHtcbiAgICBob21lOiAnSG9tZScsXG4gICAgc2lkZWJhcjogJ1NpZGViYXInLFxuICAgIHJvb21Hcm91cHM6ICdSb29tR3JvdXBzJyxcbiAgICByb29tQ2lyY3VsYXI6ICdSb29tQ2lyY3VsYXInLFxuICAgIHJvb21Hcm91cHNBbmdsZWQ6ICdSb29tR3JvdXBzQW5nbGVkJ1xufTtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50TmFtZSA9IGtleW9mIHR5cGVvZiBjb21wb25lbnRDbGFzc01hcHBpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBvbmVudE5hbWUoeDogc3RyaW5nKTogeCBpcyBDb21wb25lbnROYW1lIHtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgaW4gY29tcG9uZW50Q2xhc3NNYXBwaW5nKSB7XG4gICAgICAgIGlmICh4ID09PSBjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiY29uc3Qgc3R5bGVzID0ge1xuICAgIC8vIHJvb206IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tXFxcXHJvb20uY3NzJyksXG4gICAgLy8gaXNzdWVGb3JtOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcaXNzdWVGb3JtXFxcXGlzc3VlRm9ybS5jc3MnKSxcbiAgICBzaWRlYmFyOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcc2lkZWJhclxcXFxzaWRlYmFyLmNzcycpLFxuICAgIGhvbWU6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxob21lXFxcXGhvbWUuY3NzJyksXG4gICAgcm9vbUdyb3VwczogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXHJvb21Hcm91cHNcXFxccm9vbUdyb3Vwcy5jc3MnKSxcbiAgICByb29tR3JvdXBzQW5nbGVkOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc0FuZ2xlZFxcXFxyb29tR3JvdXBzQW5nbGVkLmNzcycpLFxuICAgIHJvb21DaXJjdWxhcjogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXHJvb21DaXJjdWxhclxcXFxyb29tQ2lyY3VsYXIuY3NzJyksXG59O1xuXG5leHBvcnQgY2xhc3MgU3R5bGVzU3VwcGxpZXIge1xuICAgIHB1YmxpYyBnZXRTdHlsZXMoc3R5bGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHN0eWxlID0gc3R5bGVzW3N0eWxlTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZmVyZW5jZWQgU3R5bGVzIG5vdCBmb3VuZCBmb3I6IFwiJyArIHN0eWxlTmFtZSArICdcIicpO1xuICAgIH1cbn1cbiIsImNvbnN0IHRlbXBsYXRlcyA9IHtcbiAgICAvLyByb29tOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbVxcXFxyb29tLmh0bWwnKSxcbiAgICAvLyBpc3N1ZUZvcm06IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxpc3N1ZUZvcm1cXFxcaXNzdWVGb3JtLmh0bWwnKSxcbiAgICBzaWRlYmFyOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcc2lkZWJhclxcXFxzaWRlYmFyLmh0bWwnKSxcbiAgICBob21lOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcaG9tZVxcXFxob21lLmh0bWwnKSxcbiAgICByb29tR3JvdXBzOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc1xcXFxyb29tR3JvdXBzLmh0bWwnKSxcbiAgICByb29tR3JvdXBzQW5nbGVkOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc0FuZ2xlZFxcXFxyb29tR3JvdXBzQW5nbGVkLmh0bWwnKSxcbiAgICByb29tQ2lyY3VsYXI6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tQ2lyY3VsYXJcXFxccm9vbUNpcmN1bGFyLmh0bWwnKVxufTtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlU3VwcGxpZXIge1xuICAgIHB1YmxpYyBnZXRUZW1wbGF0ZSh0ZW1wbGF0ZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSB0ZW1wbGF0ZXNbdGVtcGxhdGVOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVmZXJlbmNlZCB0ZW1wbGF0ZSBub3QgZm91bmQgZm9yOiAnICsgdGVtcGxhdGVOYW1lKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQge0FsbEJpbmRpbmdzQWNjZXNzb3IsIEJpbmRpbmdDb250ZXh0fSBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQge0hhbmRsZXJ9IGZyb20gJy4vSGFuZGxlcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBMaW5rSGFuZGxlciBpbXBsZW1lbnRzIEhhbmRsZXIge1xuXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih1c2VyQWN0aW9uczogVXNlckFjdGlvbnMpIHtcbiAgICAgICAgdGhpcy51c2VyQWN0aW9ucyA9IHVzZXJBY3Rpb25zO1xuICAgICAgICB0aGlzLm5hbWUgPSAnbGluayc7XG4gICAgICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KGVsZW1lbnQ6IGFueSwgdmFsdWVBY2Nlc3NvcjogKCkgPT4gYW55LCBhbGxCaW5kaW5nc0FjY2Vzc29yOiBBbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWw6IGFueSwgYmluZGluZ0NvbnRleHQ6IEJpbmRpbmdDb250ZXh0PGFueT4pIHtcbiAgICAgICAgbGV0IGFjY2Vzc29yOiAoKSA9PiBhbnkgPSB0aGlzLmN1c3RvbUFjY2Vzc29yKHZhbHVlQWNjZXNzb3IoKSwgdmlld01vZGVsLCBhbGxCaW5kaW5nc0FjY2Vzc29yKTtcbiAgICAgICAga28uYmluZGluZ0hhbmRsZXJzXG4gICAgICAgICAgLmNsaWNrXG4gICAgICAgICAgLmluaXQoZWxlbWVudCwgYWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3VzdG9tQWNjZXNzb3Iob3JpZ2luYWxGdW5jdGlvbiwgdmlld01vZGVsLCBhbGxCaW5kaW5nc0FjY2Vzc29yKTogYW55IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3NBY2Nlc3NvcigpLmNvbmRpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh2aWV3TW9kZWwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZU5hbWU6IHN0cmluZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJBY3Rpb25zLmNoYW5nZVBhZ2UobW9kdWxlTmFtZSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgRm9yZ2UgPSByZXF1aXJlKFwiZm9yZ2UtZGlcIik7XG5pbXBvcnQge0xpbmtIYW5kbGVyfSBmcm9tIFwiLi9oYW5kbGVycy9MaW5rXCI7XG5pbXBvcnQge1N0eWxlc1N1cHBsaWVyfSBmcm9tIFwiLi9jb25maWcvU3R5bGVzXCI7XG5pbXBvcnQge1RlbXBsYXRlU3VwcGxpZXJ9IGZyb20gXCIuL2NvbmZpZy9UZW1wbGF0ZXNcIjtcbmltcG9ydCB7a25vY2tvdXRDb21wb25lbnRGYWN0b3J5fSBmcm9tIFwiLi9Lbm9ja291dENvbXBvbmVudEZhY3RvcnlcIjtcbmltcG9ydCB7Y29tcG9uZW50Q2xhc3NNYXBwaW5nfSBmcm9tIFwiLi9jb25maWcvQ29tcG9uZW50c1wiO1xuaW1wb3J0IHtLbm9ja291dEluaXRpYWxpemVyfSBmcm9tIFwiLi9Lbm9ja291dEluaXRpYWxpemVyXCI7XG5cbmV4cG9ydCBjbGFzcyBLbm9ja291dERlcGVuZGVuY2llcyB7XG4gICAgcHJpdmF0ZSBmb3JnZTogRm9yZ2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZm9yZ2U6IEZvcmdlKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UgPSBmb3JnZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlcktub2Nrb3V0U2VydmljZXMoKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlcktub2Nrb3V0TW9kdWxlcygpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudENsYXNzTWFwcGluZycpLnRvLmluc3RhbmNlKGNvbXBvbmVudENsYXNzTWFwcGluZyk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgna25vY2tvdXRJbml0aWFsaXplcicpLnRvLnR5cGUoS25vY2tvdXRJbml0aWFsaXplcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyS25vY2tvdXRTZXJ2aWNlcygpIHtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdrbm9ja291dEhhbmRsZXJzJykudG8udHlwZShMaW5rSGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyS25vY2tvdXRNb2R1bGVzKCkge1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2tub2Nrb3V0SGFuZGxlcnMnKS50by50eXBlKExpbmtIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdzdHlsZXNTdXBwbGllcicpLnRvLnR5cGUoU3R5bGVzU3VwcGxpZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3RlbXBsYXRlU3VwcGxpZXInKS50by50eXBlKFRlbXBsYXRlU3VwcGxpZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudFNldHVwJykudG8udHlwZShrbm9ja291dENvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIGxldCBjb21wb25lbnRTZXR1cDoga25vY2tvdXRDb21wb25lbnRGYWN0b3J5ID0gdGhpcy5mb3JnZS5nZXQ8a25vY2tvdXRDb21wb25lbnRGYWN0b3J5PignY29tcG9uZW50U2V0dXAnKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdrbm9ja291dENvbXBvbmVudHMnKS50by5mdW5jdGlvbihjb21wb25lbnRTZXR1cC5jcmVhdGVLbm9ja291dENvbXBvbmVudHMuYmluZChjb21wb25lbnRTZXR1cCkpO1xuICAgIH1cbn1cbiJdfQ==
