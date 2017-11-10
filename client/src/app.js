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
module.exports = "<h1>Bitte w&auml;hlen Sie einen Raum aus.</h1>\n";

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
module.exports = "<h2 class=\"room-title\">Raum: <span data-bind=\"text: $parent.roomId\"></span> Raumbetreuer: <span data-bind=\"text: $parent.roomContact\"></span></h2><img\n    src=\"styles/edit.png\" alt=\"\" class=\"edit\" data-bind=\"click: $parent.setChangeContact(true)\"\n>\n\n<div class=\"room-container\">\n\n    <div class=\"tableCircular\">\n\n        <div class=\"device filler\"><h3>Tisch 1</h3></div>\n        <div class=\"device\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\"><span>3</span></div>\n        <div class=\"device connector\"></div>\n        <div class=\"device\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\"><span>4</span></div>\n        <div class=\"device filler\"><h3>Tisch 2</h3></div>\n\n        <div class=\"device\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\"><span>1</span></div>\n        <div class=\"device\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\"><span>2</span></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\"><span>5</span></div>\n        <div class=\"device\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\"><span>6</span></div>\n\n        <div class=\"device empty\"></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device connector\"></div>\n\n        <div class=\"device\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\"><span>7</span></div>\n        <div class=\"device\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\"><span>8</span></div>\n        <div class=\"device empty\"></div>\n        <div class=\"device\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\"><span>11</span></div>\n        <div class=\"device\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\"><span>12</span></div>\n\n        <div class=\"device filler\"><h3>Tisch 3</h3></div>\n        <div class=\"device\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\"><span>9</span></div>\n        <div class=\"device connector\"></div>\n        <div class=\"device\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\"><span>10</span></div>\n        <div class=\"device filler\"><h3>Tisch 4</h3></div>\n\n    </div>\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\"><span>Lehrer</span></div>\n        <div class=\"device\" id=\"device-14\" data-bind=\"click: $parent.deviceClick(14)\"><span>Beamer</span></div>\n        <div class=\"device\" id=\"device-15\" data-bind=\"click: $parent.deviceClick(15)\"><span>Weitere</span></div>\n    </div>\n</div>\n\n<div class=\"changeContactPopup\" data-bind=\"visible: $parent.showChangeContact\">\n    <input type=\"text\" data-bind=\"value: $parent.roomContactInput\" >\n    <input type=\"text\" data-bind=\"value: $parent.roomContactMailInput\" >\n    <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.changeContact()\">Raumbetreuer &auml;ndern</a>\n    <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.setChangeContact(false)\">Abbrechen</a>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h3>Fehlerprotokoll f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h3>\n    <form>\n        <label>\n            Standardfehler:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Eine Liste mit h&auml;fig auftretenden Fehlern.\n                Sollten Sie einen anderen Fehler wiederholt feststellen, k&ouml;nnen Sie Ihn mit dem Button unten zur Liste hinzuf&uuml;gen.\"\n            >i</span>\n            <select class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\">\n                <option data-bind=\"text: title\"></option>\n            </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">Standardfehler speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Geben Sie einen Titel f&uuml;r Ihren Fehler an. Der Titel wird f&uuml;r den Betreff der E-Mails verwendet.\"\n            >i</span>\n            <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung*:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Pflichtfeld! Geben Sie hier eine Beschreibung Ihres Fehlers an.\n                Falls Sie einen Standardfehler melden m&ouml;chten, k&ouml;nnen Sie ihn hier weiter spezifizieren.\"\n            >i</span>\n            <textarea class=\"description\" name=\"description\" maxlength=\"500\" required data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            Lehrer benachrichtigen:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an alle Lehrer verschickt, die nach Plan in diesem Raum unterrichten.\"\n            >i</span>\n            <input class=\"contactMail-teachers\" type=\"checkbox\" data-bind=\"checked: $parent.addTeachersToMail\" >\n        </label>\n        <br>\n        <label>\n            PC-Werkstatt benachrichtigen:\n            <span class=\"tooltip popRight\" data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an die PC-Werkstatt verschickt.\">i</span>\n            <input class=\"contactMail-workshop\" type=\"checkbox\" data-bind=\"checked: $parent.addWorkshopToMail\" >\n        </label>\n        <br>\n\n        <label style=\"margin-bottom: 5px\">\n            Raumbetreuer:\n            <span class=\"tooltip popRight\" data-tooltip=\"Der Raumbetreuer wird &uuml;ber jeden Fehler in Kenntnis gesetzt.\">i</span>\n            <span data-bind=\"text: $parent.roomContactMail\" style=\"color: #888\"></span>\n        </label>\n        <br>\n        <label>\n            weitere Empf&auml;nger: <span\n            class=\"tooltip popRight\" data-tooltip=\"Eine Liste an zus&auml;tzlichen Emp&auml;ngern. Trennen Sie mehrere E-Mail-Adressen mit einem Komma.\"\n        >i</span> <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea>\n        </label>\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">Abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">Protokoll aufnehmen</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"toast error\" data-bind=\"visible: $parent.showError\">\n    <p data-bind=\"text: $parent.error\"></p>\n    <input type=\"button\" data-bind=\"click: $parent.hideToast()\" value=\"X\" >\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>,\n            Beschreibung: <span data-bind=\"text: description\"></span>,\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">Entfernen</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Liste der Fehlerprotokolle leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Liste der Fehlerprotokolle absenden</a>\n    </div>\n</div>\n";

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
module.exports = "<h2 class=\"room-title\">Raum: <span data-bind=\"text: $parent.roomId\"></span> Raumbetreuer: <span data-bind=\"text: $parent.roomContact\"></span></h2><img\n    src=\"styles/edit.png\" alt=\"\" class=\"edit\" data-bind=\"click: $parent.setChangeContact(true)\">\n\n<div class=\"room-container\">\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\"><span>1</span></div>\n        <div class=\"device filler\"><h3>Tisch 1</h3></div>\n        <div class=\"device bot-left\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\"><span>2</span></div>\n        <div class=\"device bot-right\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\"><span>3</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device filler\"><h3>Tisch 2</h3></div>\n        <div class=\"device top\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\"><span>4</span></div>\n        <div class=\"device bot-left\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\"><span>5</span></div>\n        <div class=\"device bot-right\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\"><span>6</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\"><span>7</span></div>\n        <div class=\"device filler\"><h3>Tisch 3</h3></div>\n        <div class=\"device bot-left\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\"><span>8</span></div>\n        <div class=\"device bot-right\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\"><span>9</span></div>\n    </div>\n    <div class=\"table-group extended\">\n        <div class=\"device filler\"><h3>Tisch 4</h3></div>\n        <div class=\"device top\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\"><span>10</span></div>\n        <div class=\"device bot-left\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\"><span>11</span></div>\n        <div class=\"device bot-right\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\"><span>12</span></div>\n    </div>\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\"><span>Lehrer</span></div>\n        <div class=\"device\" id=\"device-14\" data-bind=\"click: $parent.deviceClick(14)\"><span>Beamer</span></div>\n        <div class=\"device\" id=\"device-15\" data-bind=\"click: $parent.deviceClick(15)\"><span>Weitere</span></div>\n    </div>\n</div>\n\n<div class=\"changeContactPopup\" data-bind=\"visible: $parent.showChangeContact\">\n    <input type=\"text\" data-bind=\"value: $parent.roomContactInput\" >\n    <input type=\"text\" data-bind=\"value: $parent.roomContactMailInput\" >\n    <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.changeContact()\">Raumbetreuer &auml;ndern</a>\n    <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.setChangeContact(false)\">Abbrechen</a>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h3>Fehlerprotokoll f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h3>\n    <form>\n        <label>\n            Standardfehler:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Eine Liste mit h&auml;fig auftretenden Fehlern.\n                Sollten Sie einen anderen Fehler wiederholt feststellen, k&ouml;nnen Sie Ihn mit dem Button unten zur Liste hinzuf&uuml;gen.\"\n            >i</span>\n            <select class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\">\n                <option data-bind=\"text: title\"></option>\n            </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">Standardfehler speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Geben Sie einen Titel f&uuml;r Ihren Fehler an. Der Titel wird f&uuml;r den Betreff der E-Mails verwendet.\"\n            >i</span>\n            <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung*:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Pflichtfeld! Geben Sie hier eine Beschreibung Ihres Fehlers an.\n                Falls Sie einen Standardfehler melden m&ouml;chten, k&ouml;nnen Sie ihn hier weiter spezifizieren.\"\n            >i</span>\n            <textarea class=\"description\" name=\"description\" maxlength=\"500\" required data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            Lehrer benachrichtigen:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an alle Lehrer verschickt, die nach Plan in diesem Raum unterrichten.\"\n            >i</span>\n            <input class=\"contactMail-teachers\" type=\"checkbox\" data-bind=\"checked: $parent.addTeachersToMail\" >\n        </label>\n        <br>\n        <label>\n            PC-Werkstatt benachrichtigen:\n            <span class=\"tooltip popRight\" data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an die PC-Werkstatt verschickt.\">i</span>\n            <input class=\"contactMail-workshop\" type=\"checkbox\" data-bind=\"checked: $parent.addWorkshopToMail\" >\n        </label>\n        <br>\n\n        <label style=\"margin-bottom: 5px\">\n            Raumbetreuer:\n            <span class=\"tooltip popRight\" data-tooltip=\"Der Raumbetreuer wird &uuml;ber jeden Fehler in Kenntnis gesetzt.\">i</span>\n            <span data-bind=\"text: $parent.roomContactMail\" style=\"color: #888\"></span>\n        </label>\n        <br>\n        <label>\n            weitere Empf&auml;nger: <span\n            class=\"tooltip popRight\" data-tooltip=\"Eine Liste an zus&auml;tzlichen Emp&auml;ngern. Trennen Sie mehrere E-Mail-Adressen mit einem Komma.\"\n        >i</span> <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea>\n        </label>\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">Abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">Protokoll aufnehmen</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"toast error\" data-bind=\"visible: $parent.showError\">\n    <p data-bind=\"text: $parent.error\"></p>\n    <input type=\"button\" data-bind=\"click: $parent.hideToast()\" value=\"X\" >\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>,\n            Beschreibung: <span data-bind=\"text: description\"></span>,\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">Entfernen</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Liste der Fehlerprotokolle leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Liste der Fehlerprotokolle absenden</a>\n    </div>\n</div>\n";

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
module.exports = "<h2 class=\"room-title\">Raum: <span data-bind=\"text: $parent.roomId\"></span> Raumbetreuer: <span data-bind=\"text: $parent.roomContact\"></span></h2><img\n    src=\"styles/edit.png\" alt=\"\" class=\"edit\" data-bind=\"click: $parent.setChangeContact(true)\"\n>\n\n<div class=\"room-container\">\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\"><span>1</span></div>\n        <div class=\"device filler\"><h3>Tisch 1</h3></div>\n        <div class=\"device bot-left\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\"><span>2</span></div>\n        <div class=\"device bot-right\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\"><span>3</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\"><span>4</span></div>\n        <div class=\"device filler\"><h3>Tisch 2</h3></div>\n        <div class=\"device bot-left\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\"><span>5</span></div>\n        <div class=\"device bot-right\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\"><span>6</span></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\"><span>7</span></div>\n        <div class=\"device filler\"><h3>Tisch 3</h3></div>\n        <div class=\"device bot-left\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\"><span>8</span></div>\n        <div class=\"device bot-right\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\"><span>9</span></div>\n    </div>\n    <div class=\"table-group extended\">\n        <div class=\"device top\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\"><span>10</span></div>\n        <div class=\"device filler\"><h3>Tisch 4</h3></div>\n        <div class=\"device bot-left\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\"><span>11</span></div>\n        <div class=\"device bot-right\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\"><span>12</span></div>\n    </div>\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\"><span>Lehrer</span></div>\n        <div class=\"device\" id=\"device-14\" data-bind=\"click: $parent.deviceClick(14)\"><span>Beamer</span></div>\n        <div class=\"device\" id=\"device-15\" data-bind=\"click: $parent.deviceClick(15)\"><span>Weitere</span></div>\n    </div>\n</div>\n\n<div class=\"changeContactPopup\" data-bind=\"visible: $parent.showChangeContact\">\n\n    <label style=\"margin-bottom: 5px\">\n        Name:\n        <input type=\"text\" data-bind=\"value: $parent.roomContactInput\" >\n    </label>\n    <label style=\"margin-bottom: 5px\">\n        E-Mail Adresse:\n        <input type=\"text\" data-bind=\"value: $parent.roomContactMailInput\" >\n    </label>\n\n    <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.changeContact()\">Raumbetreuer &auml;ndern</a>\n    <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.setChangeContact(false)\">Abbrechen</a>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h3>Fehlerprotokoll f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h3>\n    <form>\n        <label>\n            Standardfehler:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Eine Liste mit h&auml;fig auftretenden Fehlern.\n                Sollten Sie einen anderen Fehler wiederholt feststellen, k&ouml;nnen Sie Ihn mit dem Button unten zur Liste hinzuf&uuml;gen.\"\n            >i</span>\n            <select class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\">\n                <option data-bind=\"text: title\"></option>\n            </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">Standardfehler speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Geben Sie einen Titel f&uuml;r Ihren Fehler an. Der Titel wird f&uuml;r den Betreff der E-Mails verwendet.\"\n            >i</span>\n            <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung*:\n            <span\n                class=\"tooltip popRight\" data-tooltip=\"Pflichtfeld! Geben Sie hier eine Beschreibung Ihres Fehlers an.\n                Falls Sie einen Standardfehler melden m&ouml;chten, k&ouml;nnen Sie ihn hier weiter spezifizieren.\"\n            >i</span>\n            <textarea class=\"description\" name=\"description\" maxlength=\"500\" required data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            Lehrer benachrichtigen:\n            <span\n                class=\"tooltip popRight\"\n                data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an alle Lehrer verschickt, die nach Plan in diesem Raum unterrichten.\"\n            >i</span>\n            <input class=\"contactMail-teachers\" type=\"checkbox\" data-bind=\"checked: $parent.addTeachersToMail\" >\n        </label>\n        <br>\n        <label>\n            PC-Werkstatt benachrichtigen:\n            <span class=\"tooltip popRight\" data-tooltip=\"Falls ausgew&auml;hlt, wird eine E-Mail an die PC-Werkstatt verschickt.\">i</span>\n            <input class=\"contactMail-workshop\" type=\"checkbox\" data-bind=\"checked: $parent.addWorkshopToMail\" >\n        </label>\n        <br>\n\n        <label style=\"margin-bottom: 5px\">\n            Raumbetreuer:\n            <span class=\"tooltip popRight\" data-tooltip=\"Der Raumbetreuer wird &uuml;ber jeden Fehler in Kenntnis gesetzt.\">i</span>\n            <span data-bind=\"text: $parent.roomContactMail\" style=\"color: #888\"></span>\n        </label>\n        <br>\n        <label>\n            weitere Empf&auml;nger: <span\n            class=\"tooltip popRight\" data-tooltip=\"Eine Liste an zus&auml;tzlichen Emp&auml;ngern. Trennen Sie mehrere E-Mail-Adressen mit einem Komma.\"\n        >i</span> <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea>\n        </label>\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">Abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">Protokoll aufnehmen</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"toast error\" data-bind=\"visible: $parent.showError\">\n    <p data-bind=\"text: $parent.error\"></p>\n    <input type=\"button\" data-bind=\"click: $parent.hideToast()\" value=\"X\" >\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>,\n            Beschreibung: <span data-bind=\"text: description\"></span>,\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">Entfernen</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Liste der Fehlerprotokolle leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Liste der Fehlerprotokolle absenden</a>\n    </div>\n</div>\n";

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
        _this.roomContact = ko.observable('');
        _this.roomContactMailInput = ko.observable('');
        _this.roomContactInput = ko.observable('');
        _this.issueDeviceId = ko.observable(0);
        _this.issueRecipients = ko.observable('');
        _this.issueCounter = 0;
        _this.roomContactMail = ko.observable('');
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
            _this.roomContact(_this.roomContactInput.peek());
            _this.roomContactMail(_this.roomContactMailInput.peek());
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
        this.roomContact(room.contact);
        this.roomContactInput(room.contact);
        this.roomContactMail(room.contactMail);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL0JpbmRpbmcuanMiLCJub2RlX21vZHVsZXMvZm9yZ2UtZGkvQ29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9JbnNwZWN0b3IuanMiLCJub2RlX21vZHVsZXMvZm9yZ2UtZGkvZXJyb3JzL0NvbmZpZ3VyYXRpb25FcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9lcnJvcnMvUmVzb2x1dGlvbkVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvTGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvU2luZ2xldG9uTGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvVHJhbnNpZW50TGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9GdW5jdGlvblJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9JbnN0YW5jZVJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9SZXNvbHZlci5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9yZXNvbHZlcnMvVHlwZVJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2tub2Nrb3V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9BcHBsaWNhdGlvbi50cyIsInNyYy9EZXBlbmRlbmNpZXMudHMiLCJzcmMvUm91dGVyLnRzIiwic3JjL1VzZXJBY3Rpb25zLnRzIiwic3JjL2FwcC50cyIsInNyYy9jb21tb24vSXNzdWUudHMiLCJzcmMvY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lci50cyIsInNyYy9jb21tb24vUGFyYW1SZWFkZXIudHMiLCJzcmMvY29tbW9uL1Jlc29sdmVyLnRzIiwic3JjL2NvbW1vbi9TZXJ2ZXJBY3Rpb25zLnRzIiwic3JjL2NvbW1vbi9YaHJQb3N0LnRzIiwic3JjL2NvbW1vbi9YaHJSZXF1ZXN0LnRzIiwic3JjL2NvbnRlbnQvQ29udGVudERlcGVuZGVuY2llcy50cyIsInNyYy9jb250ZW50L1BhZ2VSZW5kZXJlci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvQ29tcG9uZW50LnRzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9Db21wb25lbnRSZXNvbHZlci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvaG9tZS9ob21lLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvaG9tZS9ob21lLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL2hvbWUvaG9tZS50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhci5jc3MiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21DaXJjdWxhci9yb29tQ2lyY3VsYXIuaHRtbCIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21Hcm91cHNBbmdsZWQvcm9vbUdyb3Vwc0FuZ2xlZC50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21Hcm91cHMvcm9vbUdyb3Vwcy50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbS9Sb29tTGF5b3V0LnRzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuY3NzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuaHRtbCIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvc2lkZWJhci9zaWRlYmFyLnRzIiwic3JjL2tub2Nrb3V0L0tub2Nrb3V0Q29tcG9uZW50LnRzIiwic3JjL2tub2Nrb3V0L0tub2Nrb3V0Q29tcG9uZW50RmFjdG9yeS50cyIsInNyYy9rbm9ja291dC9Lbm9ja291dEluaXRpYWxpemVyLnRzIiwic3JjL2tub2Nrb3V0L2NvbmZpZy9Db21wb25lbnRzLnRzIiwic3JjL2tub2Nrb3V0L2NvbmZpZy9TdHlsZXMudHMiLCJzcmMva25vY2tvdXQvY29uZmlnL1RlbXBsYXRlcy50cyIsInNyYy9rbm9ja291dC9oYW5kbGVycy9MaW5rLnRzIiwic3JjL2tub2Nrb3V0L2tub2Nrb3V0RGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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NEJBQWdCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbURBQXdCLENBQUMsQ0FBQztRQUVwRSxJQUFJLGNBQWMsR0FBNkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQTJCLGdCQUFnQixDQUFDLENBQUM7UUFDMUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBUSxDQUFBLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3BILENBQUM7SUFDTCwyQkFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUF4Qlksb0RBQW9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLy8gY29tcGFyZSBhbmQgaXNCdWZmZXIgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9ibG9iLzY4MGU5ZTVlNDg4ZjIyYWFjMjc1OTlhNTdkYzg0NGE2MzE1OTI4ZGQvaW5kZXguanNcbi8vIG9yaWdpbmFsIG5vdGljZTpcblxuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB2YXIgeCA9IGEubGVuZ3RoO1xuICB2YXIgeSA9IGIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldO1xuICAgICAgeSA9IGJbaV07XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKHkgPCB4KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5mdW5jdGlvbiBpc0J1ZmZlcihiKSB7XG4gIGlmIChnbG9iYWwuQnVmZmVyICYmIHR5cGVvZiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIoYik7XG4gIH1cbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcik7XG59XG5cbi8vIGJhc2VkIG9uIG5vZGUgYXNzZXJ0LCBvcmlnaW5hbCBub3RpY2U6XG5cbi8vIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1VuaXRfVGVzdGluZy8xLjBcbi8vXG4vLyBUSElTIElTIE5PVCBURVNURUQgTk9SIExJS0VMWSBUTyBXT1JLIE9VVFNJREUgVjghXG4vL1xuLy8gT3JpZ2luYWxseSBmcm9tIG5hcndoYWwuanMgKGh0dHA6Ly9uYXJ3aGFsanMub3JnKVxuLy8gQ29weXJpZ2h0IChjKSAyMDA5IFRob21hcyBSb2JpbnNvbiA8Mjgwbm9ydGguY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0b1xuLy8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbi8vIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuLy8gc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgZnVuY3Rpb25zSGF2ZU5hbWVzID0gKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvbygpIHt9Lm5hbWUgPT09ICdmb28nO1xufSgpKTtcbmZ1bmN0aW9uIHBUb1N0cmluZyAob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbn1cbmZ1bmN0aW9uIGlzVmlldyhhcnJidWYpIHtcbiAgaWYgKGlzQnVmZmVyKGFycmJ1ZikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KGFycmJ1Zik7XG4gIH1cbiAgaWYgKCFhcnJidWYpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGFycmJ1ZiBpbnN0YW5jZW9mIERhdGFWaWV3KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGFycmJ1Zi5idWZmZXIgJiYgYXJyYnVmLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxudmFyIHJlZ2V4ID0gL1xccypmdW5jdGlvblxccysoW15cXChcXHNdKilcXHMqLztcbi8vIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvZnVuY3Rpb24ucHJvdG90eXBlLm5hbWUvYmxvYi9hZGVlZWVjOGJmY2M2MDY4YjE4N2Q3ZDlmYjNkNWJiMWQzYTMwODk5L2ltcGxlbWVudGF0aW9uLmpzXG5mdW5jdGlvbiBnZXROYW1lKGZ1bmMpIHtcbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcykge1xuICAgIHJldHVybiBmdW5jLm5hbWU7XG4gIH1cbiAgdmFyIHN0ciA9IGZ1bmMudG9TdHJpbmcoKTtcbiAgdmFyIG1hdGNoID0gc3RyLm1hdGNoKHJlZ2V4KTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IGdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgICAgIHZhciBpZHggPSBvdXQuaW5kZXhPZignXFxuJyArIGZuX25hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGJlZm9yZSBpdCAoYW5kIGl0cyBsaW5lKVxuICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YWNrID0gb3V0O1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuZnVuY3Rpb24gaW5zcGVjdChzb21ldGhpbmcpIHtcbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcyB8fCAhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpIHtcbiAgICByZXR1cm4gdXRpbC5pbnNwZWN0KHNvbWV0aGluZyk7XG4gIH1cbiAgdmFyIHJhd25hbWUgPSBnZXROYW1lKHNvbWV0aGluZyk7XG4gIHZhciBuYW1lID0gcmF3bmFtZSA/ICc6ICcgKyByYXduYW1lIDogJyc7XG4gIHJldHVybiAnW0Z1bmN0aW9uJyArICBuYW1lICsgJ10nO1xufVxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuYWN0dWFsKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5leHBlY3RlZCksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQuZGVlcFN0cmljdEVxdWFsID0gZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcFN0cmljdEVxdWFsJywgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcykge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICYmIGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBjb21wYXJlKGFjdHVhbCwgZXhwZWN0ZWQpID09PSAwO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICgoYWN0dWFsID09PSBudWxsIHx8IHR5cGVvZiBhY3R1YWwgIT09ICdvYmplY3QnKSAmJlxuICAgICAgICAgICAgIChleHBlY3RlZCA9PT0gbnVsbCB8fCB0eXBlb2YgZXhwZWN0ZWQgIT09ICdvYmplY3QnKSkge1xuICAgIHJldHVybiBzdHJpY3QgPyBhY3R1YWwgPT09IGV4cGVjdGVkIDogYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIElmIGJvdGggdmFsdWVzIGFyZSBpbnN0YW5jZXMgb2YgdHlwZWQgYXJyYXlzLCB3cmFwIHRoZWlyIHVuZGVybHlpbmdcbiAgLy8gQXJyYXlCdWZmZXJzIGluIGEgQnVmZmVyIGVhY2ggdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2VcbiAgLy8gVGhpcyBvcHRpbWl6YXRpb24gcmVxdWlyZXMgdGhlIGFycmF5cyB0byBoYXZlIHRoZSBzYW1lIHR5cGUgYXMgY2hlY2tlZCBieVxuICAvLyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIChha2EgcFRvU3RyaW5nKS4gTmV2ZXIgcGVyZm9ybSBiaW5hcnlcbiAgLy8gY29tcGFyaXNvbnMgZm9yIEZsb2F0KkFycmF5cywgdGhvdWdoLCBzaW5jZSBlLmcuICswID09PSAtMCBidXQgdGhlaXJcbiAgLy8gYml0IHBhdHRlcm5zIGFyZSBub3QgaWRlbnRpY2FsLlxuICB9IGVsc2UgaWYgKGlzVmlldyhhY3R1YWwpICYmIGlzVmlldyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICBwVG9TdHJpbmcoYWN0dWFsKSA9PT0gcFRvU3RyaW5nKGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgICEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5IHx8XG4gICAgICAgICAgICAgICBhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUobmV3IFVpbnQ4QXJyYXkoYWN0dWFsLmJ1ZmZlciksXG4gICAgICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoZXhwZWN0ZWQuYnVmZmVyKSkgPT09IDA7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICE9PSBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbWVtb3MgPSBtZW1vcyB8fCB7YWN0dWFsOiBbXSwgZXhwZWN0ZWQ6IFtdfTtcblxuICAgIHZhciBhY3R1YWxJbmRleCA9IG1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7XG4gICAgaWYgKGFjdHVhbEluZGV4ICE9PSAtMSkge1xuICAgICAgaWYgKGFjdHVhbEluZGV4ID09PSBtZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vcy5hY3R1YWwucHVzaChhY3R1YWwpO1xuICAgIG1lbW9zLmV4cGVjdGVkLnB1c2goZXhwZWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIsIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpIHtcbiAgaWYgKGEgPT09IG51bGwgfHwgYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwgfHwgYiA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gaWYgb25lIGlzIGEgcHJpbWl0aXZlLCB0aGUgb3RoZXIgbXVzdCBiZSBzYW1lXG4gIGlmICh1dGlsLmlzUHJpbWl0aXZlKGEpIHx8IHV0aWwuaXNQcmltaXRpdmUoYikpXG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIGlmIChzdHJpY3QgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGEpICE9PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB2YXIgYUlzQXJncyA9IGlzQXJndW1lbnRzKGEpO1xuICB2YXIgYklzQXJncyA9IGlzQXJndW1lbnRzKGIpO1xuICBpZiAoKGFJc0FyZ3MgJiYgIWJJc0FyZ3MpIHx8ICghYUlzQXJncyAmJiBiSXNBcmdzKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChhSXNBcmdzKSB7XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiLCBzdHJpY3QpO1xuICB9XG4gIHZhciBrYSA9IG9iamVjdEtleXMoYSk7XG4gIHZhciBrYiA9IG9iamVjdEtleXMoYik7XG4gIHZhciBrZXksIGk7XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT09IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9PSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbCA9IG5vdERlZXBTdHJpY3RFcXVhbDtcbmZ1bmN0aW9uIG5vdERlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcFN0cmljdEVxdWFsJywgbm90RGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufVxuXG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJZ25vcmUuICBUaGUgaW5zdGFuY2VvZiBjaGVjayBkb2Vzbid0IHdvcmsgZm9yIGFycm93IGZ1bmN0aW9ucy5cbiAgfVxuXG4gIGlmIChFcnJvci5pc1Byb3RvdHlwZU9mKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlO1xufVxuXG5mdW5jdGlvbiBfdHJ5QmxvY2soYmxvY2spIHtcbiAgdmFyIGVycm9yO1xuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodHlwZW9mIGJsb2NrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJibG9ja1wiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgYWN0dWFsID0gX3RyeUJsb2NrKGJsb2NrKTtcblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIHZhciB1c2VyUHJvdmlkZWRNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnO1xuICB2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiB1dGlsLmlzRXJyb3IoYWN0dWFsKTtcbiAgdmFyIGlzVW5leHBlY3RlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgIWV4cGVjdGVkO1xuXG4gIGlmICgoaXNVbndhbnRlZEV4Y2VwdGlvbiAmJlxuICAgICAgdXNlclByb3ZpZGVkTWVzc2FnZSAmJlxuICAgICAgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8XG4gICAgICBpc1VuZXhwZWN0ZWRFeGNlcHRpb24pIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3ModHJ1ZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKGZhbHNlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikgdGhyb3cgZXJyOyB9O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsIi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zdGVmYW5wZW5uZXIvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgNC4xLjFcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuRVM2UHJvbWlzZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHg7XG4gIHJldHVybiB4ICE9PSBudWxsICYmICh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKTtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxudmFyIF9pc0FycmF5ID0gdW5kZWZpbmVkO1xuaWYgKEFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xufSBlbHNlIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHIgPSByZXF1aXJlO1xuICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHVuZGVmaW5lZDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICBpZiAoX3N0YXRlKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IF9hcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlc29sdmVkIHdpdGggdGhlXG4gIHBhc3NlZCBgdmFsdWVgLiBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlJDEob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICByZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG52YXIgUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxudmFyIEdFVF9USEVOX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW4ocHJvbWlzZSkge1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gR0VUX1RIRU5fRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuJCQxLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbiQkMS5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuJCQxKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuJCQxLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIHJlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkMSkge1xuICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJiB0aGVuJCQxID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSQxKSB7XG4gICAgaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoZW4kJDEgPT09IEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAodGhlbiQkMSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0aGVuJCQxKSkge1xuICAgICAgaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIHJlamVjdChwcm9taXNlLCBzZWxmRnVsZmlsbG1lbnQoKSk7XG4gIH0gZWxzZSBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBnZXRUaGVuKHZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gIGFzYXAocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX3N1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IF9zdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgcGFyZW50Ll9vbmVycm9yID0gbnVsbDtcblxuICBfc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gPSBvblJlamVjdGlvbjtcblxuICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHBhcmVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaChwcm9taXNlKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY2hpbGQgPSB1bmRlZmluZWQsXG4gICAgICBjYWxsYmFjayA9IHVuZGVmaW5lZCxcbiAgICAgIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgIGlmIChjaGlsZCkge1xuICAgICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgIH1cbiAgfVxuXG4gIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIEVycm9yT2JqZWN0KCkge1xuICB0aGlzLmVycm9yID0gbnVsbDtcbn1cblxudmFyIFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgIHJldHVybiBUUllfQ0FUQ0hfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkLFxuICAgICAgZXJyb3IgPSB1bmRlZmluZWQsXG4gICAgICBzdWNjZWVkZWQgPSB1bmRlZmluZWQsXG4gICAgICBmYWlsZWQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdmFsdWUgPSB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgIHZhbHVlLmVycm9yID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAvLyBub29wXG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgICAgcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpIHtcbiAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlamVjdChwcm9taXNlLCBlKTtcbiAgfVxufVxuXG52YXIgaWQgPSAwO1xuZnVuY3Rpb24gbmV4dElkKCkge1xuICByZXR1cm4gaWQrKztcbn1cblxuZnVuY3Rpb24gbWFrZVByb21pc2UocHJvbWlzZSkge1xuICBwcm9taXNlW1BST01JU0VfSURdID0gaWQrKztcbiAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gRW51bWVyYXRvciQxKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gIH1cblxuICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgdGhpcy5fZW51bWVyYXRlKGlucHV0KTtcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlamVjdCh0aGlzLnByb21pc2UsIHZhbGlkYXRpb25FcnJvcigpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0aW9uRXJyb3IoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xufVxuXG5FbnVtZXJhdG9yJDEucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBQRU5ESU5HICYmIGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IkMS5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIChlbnRyeSwgaSkge1xuICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gIHZhciByZXNvbHZlJCQxID0gYy5yZXNvbHZlO1xuXG4gIGlmIChyZXNvbHZlJCQxID09PSByZXNvbHZlJDEpIHtcbiAgICB2YXIgX3RoZW4gPSBnZXRUaGVuKGVudHJ5KTtcblxuICAgIGlmIChfdGhlbiA9PT0gdGhlbiAmJiBlbnRyeS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSQyKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKG5vb3ApO1xuICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24gKHJlc29sdmUkJDEpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUkJDEoZW50cnkpO1xuICAgICAgfSksIGkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZSQkMShlbnRyeSksIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yJDEucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbiAoc3RhdGUsIGksIHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgICAgcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgfVxufTtcblxuRW51bWVyYXRvciQxLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gKHByb21pc2UsIGkpIHtcbiAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gIHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KFJFSkVDVEVELCBpLCByZWFzb24pO1xuICB9KTtcbn07XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbCQxKGVudHJpZXMpIHtcbiAgcmV0dXJuIG5ldyBFbnVtZXJhdG9yJDEodGhpcywgZW50cmllcykucHJvbWlzZTtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJhY2VgIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaCBpcyBzZXR0bGVkIGluIHRoZSBzYW1lIHdheSBhcyB0aGVcbiAgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gc2V0dGxlLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAyJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUHJvbWlzZS5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0XG4gIHNldHRsZWQgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGVcbiAgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3Qgc2V0dGxlZCBwcm9taXNlIGhhc1xuICBiZWNvbWUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAgcHJvbWlzZSB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdwcm9taXNlIDInKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnNcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBBbiBleGFtcGxlIHJlYWwtd29ybGQgdXNlIGNhc2UgaXMgaW1wbGVtZW50aW5nIHRpbWVvdXRzOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgUHJvbWlzZS5yYWNlKFthamF4KCdmb28uanNvbicpLCB0aW1lb3V0KDUwMDApXSlcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB3aGljaCBzZXR0bGVzIGluIHRoZSBzYW1lIHdheSBhcyB0aGUgZmlyc3QgcGFzc2VkXG4gIHByb21pc2UgdG8gc2V0dGxlLlxuKi9cbmZ1bmN0aW9uIHJhY2UkMShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0JDEocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuZnVuY3Rpb24gUHJvbWlzZSQyKHJlc29sdmVyKSB7XG4gIHRoaXNbUFJPTUlTRV9JRF0gPSBuZXh0SWQoKTtcbiAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaWYgKG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSQyID8gaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbmVlZHNOZXcoKTtcbiAgfVxufVxuXG5Qcm9taXNlJDIuYWxsID0gYWxsJDE7XG5Qcm9taXNlJDIucmFjZSA9IHJhY2UkMTtcblByb21pc2UkMi5yZXNvbHZlID0gcmVzb2x2ZSQxO1xuUHJvbWlzZSQyLnJlamVjdCA9IHJlamVjdCQxO1xuUHJvbWlzZSQyLl9zZXRTY2hlZHVsZXIgPSBzZXRTY2hlZHVsZXI7XG5Qcm9taXNlJDIuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZSQyLl9hc2FwID0gYXNhcDtcblxuUHJvbWlzZSQyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UkMixcblxuICAvKipcbiAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBDaGFpbmluZ1xuICAgIC0tLS0tLS0tXG4gIFxuICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgIH0pO1xuICBcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICB9KTtcbiAgICBgYGBcbiAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQXNzaW1pbGF0aW9uXG4gICAgLS0tLS0tLS0tLS0tXG4gIFxuICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IHJlc3VsdDtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IGF1dGhvciwgYm9va3M7XG4gIFxuICAgIHRyeSB7XG4gICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgXG4gICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICBcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kQXV0aG9yKCkuXG4gICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIHRoZW5cbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgdGhlbjogdGhlbixcblxuICAvKipcbiAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cbiAgXG4gICAgYGBganNcbiAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICB9XG4gIFxuICAgIC8vIHN5bmNocm9ub3VzXG4gICAgdHJ5IHtcbiAgICAgIGZpbmRBdXRob3IoKTtcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9XG4gIFxuICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgY2F0Y2hcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICAnY2F0Y2gnOiBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuLypnbG9iYWwgc2VsZiovXG5mdW5jdGlvbiBwb2x5ZmlsbCQxKCkge1xuICAgIHZhciBsb2NhbCA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IGdsb2JhbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgIGlmIChQKSB7XG4gICAgICAgIHZhciBwcm9taXNlVG9TdHJpbmcgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gc2lsZW50bHkgaWdub3JlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2VUb1N0cmluZyA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsLlByb21pc2UgPSBQcm9taXNlJDI7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UkMi5wb2x5ZmlsbCA9IHBvbHlmaWxsJDE7XG5Qcm9taXNlJDIuUHJvbWlzZSA9IFByb21pc2UkMjtcblxucmV0dXJuIFByb21pc2UkMjtcblxufSkpKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXM2LXByb21pc2UubWFwXG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgQmluZGluZywgQ29uZmlndXJhdGlvbkVycm9yLCBGdW5jdGlvblJlc29sdmVyLCBJbnN0YW5jZVJlc29sdmVyLCBSZXNvbHV0aW9uRXJyb3IsIFNpbmdsZXRvbkxpZmVjeWNsZSwgVHJhbnNpZW50TGlmZWN5Y2xlLCBUeXBlUmVzb2x2ZXIsIF8sIGFzc2VydCwgY2hhaW4sIHN3ZWV0ZW4sXG4gICAgc2xpY2UgPSBbXS5zbGljZTtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIEZ1bmN0aW9uUmVzb2x2ZXIgPSByZXF1aXJlKCcuL3Jlc29sdmVycy9GdW5jdGlvblJlc29sdmVyJyk7XG5cbiAgSW5zdGFuY2VSZXNvbHZlciA9IHJlcXVpcmUoJy4vcmVzb2x2ZXJzL0luc3RhbmNlUmVzb2x2ZXInKTtcblxuICBUeXBlUmVzb2x2ZXIgPSByZXF1aXJlKCcuL3Jlc29sdmVycy9UeXBlUmVzb2x2ZXInKTtcblxuICBTaW5nbGV0b25MaWZlY3ljbGUgPSByZXF1aXJlKCcuL2xpZmVjeWNsZXMvU2luZ2xldG9uTGlmZWN5Y2xlJyk7XG5cbiAgVHJhbnNpZW50TGlmZWN5Y2xlID0gcmVxdWlyZSgnLi9saWZlY3ljbGVzL1RyYW5zaWVudExpZmVjeWNsZScpO1xuXG4gIENvbmZpZ3VyYXRpb25FcnJvciA9IHJlcXVpcmUoJy4vZXJyb3JzL0NvbmZpZ3VyYXRpb25FcnJvcicpO1xuXG4gIFJlc29sdXRpb25FcnJvciA9IHJlcXVpcmUoJy4vZXJyb3JzL1Jlc29sdXRpb25FcnJvcicpO1xuXG4gIHN3ZWV0ZW4gPSBmdW5jdGlvbih0eXBlLCBwcm9wZXJ0eSkge1xuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZS5wcm90b3R5cGUsIHByb3BlcnR5LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjaGFpbiA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgcmVzdWx0O1xuICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH07XG5cbiAgQmluZGluZyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBCaW5kaW5nKGZvcmdlLCBuYW1lKSB7XG4gICAgICB0aGlzLmZvcmdlID0gZm9yZ2U7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgYXNzZXJ0KHRoaXMuZm9yZ2UgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImZvcmdlXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGFzc2VydCh0aGlzLm5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgdGhpcy5saWZlY3ljbGUgPSBuZXcgU2luZ2xldG9uTGlmZWN5Y2xlKCk7XG4gICAgICB0aGlzW1wiYXJndW1lbnRzXCJdID0ge307XG4gICAgfVxuXG4gICAgQmluZGluZy5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uKGhpbnQpIHtcbiAgICAgIGlmICh0aGlzLnByZWRpY2F0ZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZShoaW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24oY29udGV4dCwgaGludCwgYXJncykge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChhcmdzID09IG51bGwpIHtcbiAgICAgICAgYXJncyA9IHt9O1xuICAgICAgfVxuICAgICAgYXNzZXJ0KGNvbnRleHQsICdUaGUgYXJndW1lbnQgXCJjb250ZXh0XCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGlmICh0aGlzLmxpZmVjeWNsZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBDb25maWd1cmF0aW9uRXJyb3IodGhpcy5uYW1lLCAnTm8gbGlmZWN5Y2xlIGRlZmluZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlc29sdmVyID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvbmZpZ3VyYXRpb25FcnJvcih0aGlzLm5hbWUsICdObyByZXNvbHZlciBkZWZpbmVkJyk7XG4gICAgICB9XG4gICAgICBpZiAoY29udGV4dC5oYXModGhpcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc29sdXRpb25FcnJvcih0aGlzLm5hbWUsIGhpbnQsIGNvbnRleHQsICdDaXJjdWxhciBkZXBlbmRlbmNpZXMgZGV0ZWN0ZWQnKTtcbiAgICAgIH1cbiAgICAgIGNvbnRleHQucHVzaCh0aGlzKTtcbiAgICAgIHJlc3VsdCA9IHRoaXMubGlmZWN5Y2xlLnJlc29sdmUodGhpcy5yZXNvbHZlciwgY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0LnBvcCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgc3dlZXRlbihCaW5kaW5nLCAndG8nKTtcblxuICAgIHN3ZWV0ZW4oQmluZGluZywgJ2FzJyk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS50eXBlID0gY2hhaW4oZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBhc3NlcnQodGFyZ2V0ICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJ0YXJnZXRcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZXIgPSBuZXcgVHlwZVJlc29sdmVyKHRoaXMuZm9yZ2UsIHRoaXMsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZVtcImZ1bmN0aW9uXCJdID0gY2hhaW4oZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICBhc3NlcnQodGFyZ2V0ICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJ0YXJnZXRcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZXIgPSBuZXcgRnVuY3Rpb25SZXNvbHZlcih0aGlzLmZvcmdlLCB0aGlzLCB0YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuaW5zdGFuY2UgPSBjaGFpbihmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGFzc2VydCh0YXJnZXQgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInRhcmdldFwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlciA9IG5ldyBJbnN0YW5jZVJlc29sdmVyKHRoaXMuZm9yZ2UsIHRoaXMsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zaW5nbGV0b24gPSBjaGFpbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpZmVjeWNsZSA9IG5ldyBTaW5nbGV0b25MaWZlY3ljbGUoKTtcbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnRyYW5zaWVudCA9IGNoYWluKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGlmZWN5Y2xlID0gbmV3IFRyYW5zaWVudExpZmVjeWNsZSgpO1xuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUud2hlbiA9IGNoYWluKGZ1bmN0aW9uKGNvbmRpdGlvbikge1xuICAgICAgYXNzZXJ0KGNvbmRpdGlvbiAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiY29uZGl0aW9uXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oY29uZGl0aW9uKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUgPSBjb25kaXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUgPSBmdW5jdGlvbihoaW50KSB7XG4gICAgICAgICAgcmV0dXJuIGhpbnQgPT09IGNvbmRpdGlvbjtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlW1wid2l0aFwiXSA9IGNoYWluKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzW1wiYXJndW1lbnRzXCJdID0gYXJncztcbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVwcywgcmVmLCB0b2tlbnM7XG4gICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIGlmICh0aGlzLnByZWRpY2F0ZSAhPSBudWxsKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKCcoY29uZGl0aW9uYWwpJyk7XG4gICAgICB9XG4gICAgICB0b2tlbnMucHVzaCh0aGlzLm5hbWUpO1xuICAgICAgdG9rZW5zLnB1c2goJy0+Jyk7XG4gICAgICB0b2tlbnMucHVzaCh0aGlzLnJlc29sdmVyICE9IG51bGwgPyB0aGlzLnJlc29sdmVyLnRvU3RyaW5nKCkgOiAnPHVuZGVmaW5lZCByZXNvbHZlcj4nKTtcbiAgICAgIHRva2Vucy5wdXNoKFwiKFwiICsgKHRoaXMubGlmZWN5Y2xlLnRvU3RyaW5nKCkpICsgXCIpXCIpO1xuICAgICAgaWYgKCgocmVmID0gdGhpcy5yZXNvbHZlci5kZXBlbmRlbmNpZXMpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgZGVwcyA9IF8ubWFwKHRoaXMucmVzb2x2ZXIuZGVwZW5kZW5jaWVzLCBmdW5jdGlvbihkZXApIHtcbiAgICAgICAgICBpZiAoZGVwLmhpbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlcC5uYW1lICsgXCI6XCIgKyBkZXAuaGludDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRlcC5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRva2Vucy5wdXNoKFwiZGVwZW5kcyBvbjogW1wiICsgKGRlcHMuam9pbignLCAnKSkgKyBcIl1cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW5zLmpvaW4oJyAnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJpbmRpbmc7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IEJpbmRpbmc7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgQ29udGV4dCwgXztcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIENvbnRleHQgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQ29udGV4dCgpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBbXTtcbiAgICB9XG5cbiAgICBDb250ZXh0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihiaW5kaW5nKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyh0aGlzLmJpbmRpbmdzLCBiaW5kaW5nKTtcbiAgICB9O1xuXG4gICAgQ29udGV4dC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKGJpbmRpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzLnB1c2goYmluZGluZyk7XG4gICAgfTtcblxuICAgIENvbnRleHQucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3MucG9wKCk7XG4gICAgfTtcblxuICAgIENvbnRleHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oaW5kZW50KSB7XG4gICAgICB2YXIgbGluZXMsIHNwYWNlcztcbiAgICAgIGlmIChpbmRlbnQgPT0gbnVsbCkge1xuICAgICAgICBpbmRlbnQgPSA0O1xuICAgICAgfVxuICAgICAgc3BhY2VzID0gQXJyYXkoaW5kZW50ICsgMSkuam9pbignICcpO1xuICAgICAgbGluZXMgPSBfLm1hcCh0aGlzLmJpbmRpbmdzLCBmdW5jdGlvbihiaW5kaW5nLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gXCJcIiArIHNwYWNlcyArIChpbmRleCArIDEpICsgXCI6IFwiICsgKGJpbmRpbmcudG9TdHJpbmcoKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaW5lcy5yZXZlcnNlKCkuam9pbignXFxuJyk7XG4gICAgfTtcblxuICAgIHJldHVybiBDb250ZXh0O1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0O1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIEluc3BlY3RvciwgXywgYXNzZXJ0O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgSW5zcGVjdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEluc3BlY3Rvcih1bm1hbmdsZU5hbWVzKSB7XG4gICAgICB0aGlzLnVubWFuZ2xlTmFtZXMgPSB1bm1hbmdsZU5hbWVzICE9IG51bGwgPyB1bm1hbmdsZU5hbWVzIDogZmFsc2U7XG4gICAgfVxuXG4gICAgSW5zcGVjdG9yLnByb3RvdHlwZS5nZXREZXBlbmRlbmNpZXMgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICB2YXIgaGludHMsIHBhcmFtcztcbiAgICAgIGFzc2VydChmdW5jICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJmdW5jXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHBhcmFtcyA9IHRoaXMuZ2V0UGFyYW1ldGVyTmFtZXMoZnVuYyk7XG4gICAgICBoaW50cyA9IHRoaXMuZ2V0RGVwZW5kZW5jeUhpbnRzKGZ1bmMpO1xuICAgICAgcmV0dXJuIF8ubWFwKHBhcmFtcywgZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgcmV0dXJuIChyZWYgPSBoaW50c1twYXJhbV0pICE9IG51bGwgPyByZWYgOiB7XG4gICAgICAgICAgbmFtZTogcGFyYW0sXG4gICAgICAgICAgYWxsOiBmYWxzZSxcbiAgICAgICAgICBoaW50OiB2b2lkIDBcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbnNwZWN0b3IucHJvdG90eXBlLmdldFBhcmFtZXRlck5hbWVzID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgdmFyIGFyZ3MsIG1hdGNoZXMsIHJlZ2V4O1xuICAgICAgYXNzZXJ0KGZ1bmMgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImZ1bmNcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcmVnZXggPSAvKD86ZnVuY3Rpb258Y29uc3RydWN0b3IpWyBBLVphLXowLTldKlxcKChbXildKykvZztcbiAgICAgIG1hdGNoZXMgPSByZWdleC5leGVjKGZ1bmMudG9TdHJpbmcoKSk7XG4gICAgICBpZiAoKG1hdGNoZXMgPT0gbnVsbCkgfHwgbWF0Y2hlc1sxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgYXJncyA9IG1hdGNoZXNbMV0uc3BsaXQoL1ssXFxzXSsvKTtcbiAgICAgIGlmICh0aGlzLnVubWFuZ2xlTmFtZXMpIHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKGFyZ3MsIGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgIHJldHVybiBhcmcucmVwbGFjZSgvXFxkKyQvLCAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEluc3BlY3Rvci5wcm90b3R5cGUuZ2V0RGVwZW5kZW5jeUhpbnRzID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgdmFyIGFsbCwgYXJndW1lbnQsIGRlcGVuZGVuY3ksIGhpbnQsIGhpbnRzLCBtYXRjaCwgbmFtZSwgcGF0dGVybiwgcmVmLCByZWdleDtcbiAgICAgIGFzc2VydChmdW5jICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJmdW5jXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHJlZ2V4ID0gL1wiKC4qPylcXHMqLT5cXHMqKGFsbCk/XFxzKiguKj8pXCI7L2dpO1xuICAgICAgaGludHMgPSB7fTtcbiAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4LmV4ZWMoZnVuYy50b1N0cmluZygpKSkge1xuICAgICAgICBwYXR0ZXJuID0gbWF0Y2hbMF0sIGFyZ3VtZW50ID0gbWF0Y2hbMV0sIGFsbCA9IG1hdGNoWzJdLCBkZXBlbmRlbmN5ID0gbWF0Y2hbM107XG4gICAgICAgIGlmIChhbGwgIT0gbnVsbCkge1xuICAgICAgICAgIGFsbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlcGVuZGVuY3kuaW5kZXhPZignOicpKSB7XG4gICAgICAgICAgcmVmID0gZGVwZW5kZW5jeS5zcGxpdCgvXFxzKjpcXHMqLywgMiksIG5hbWUgPSByZWZbMF0sIGhpbnQgPSByZWZbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmFtZSA9IGRlcGVuZGVuY3k7XG4gICAgICAgICAgaGludCA9IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICBoaW50c1thcmd1bWVudF0gPSB7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICBoaW50OiBoaW50XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gaGludHM7XG4gICAgfTtcblxuICAgIEluc3BlY3Rvci5wcm90b3R5cGUuaXNBdXRvQ29uc3RydWN0b3IgPSBmdW5jdGlvbihjb25zdHJ1Y3Rvcikge1xuICAgICAgdmFyIGJvZHksIG5hbWU7XG4gICAgICBhc3NlcnQoY29uc3RydWN0b3IgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImNvbnN0cnVjdG9yXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIG5hbWUgPSBjb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgYm9keSA9IGNvbnN0cnVjdG9yLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gYm9keS5pbmRleE9mKG5hbWUgKyBcIi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcIikgPiAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gSW5zcGVjdG9yO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBJbnNwZWN0b3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgQ29uZmlndXJhdGlvbkVycm9yLFxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgQ29uZmlndXJhdGlvbkVycm9yID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgICBleHRlbmQoQ29uZmlndXJhdGlvbkVycm9yLCBzdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIENvbmZpZ3VyYXRpb25FcnJvcihuYW1lLCBtZXNzYWdlKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBcIlRoZSBiaW5kaW5nIGZvciBjb21wb25lbnQgbmFtZWQgXCIgKyBuYW1lICsgXCIgaXMgbWlzY29uZmlndXJlZDogXCIgKyBtZXNzYWdlO1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgYXJndW1lbnRzLmNhbGxlZSk7XG4gICAgfVxuXG4gICAgQ29uZmlndXJhdGlvbkVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENvbmZpZ3VyYXRpb25FcnJvcjtcblxuICB9KShFcnJvcik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBDb25maWd1cmF0aW9uRXJyb3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgUmVzb2x1dGlvbkVycm9yLCB1dGlsO1xuXG4gIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbiAgUmVzb2x1dGlvbkVycm9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFJlc29sdXRpb25FcnJvcihuYW1lLCBoaW50LCBjb250ZXh0LCBtZXNzYWdlKSB7XG4gICAgICB0aGlzLm5hbWUgPSAnUmVzb2x1dGlvbkVycm9yJztcbiAgICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuZ2V0TWVzc2FnZShuYW1lLCBoaW50LCBjb250ZXh0LCBtZXNzYWdlKTtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGFyZ3VtZW50cy5jYWxsZWUpO1xuICAgIH1cblxuICAgIFJlc29sdXRpb25FcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2U7XG4gICAgfTtcblxuICAgIFJlc29sdXRpb25FcnJvci5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKG5hbWUsIGhpbnQsIGNvbnRleHQsIG1lc3NhZ2UpIHtcbiAgICAgIHZhciBsaW5lcztcbiAgICAgIGxpbmVzID0gW107XG4gICAgICBsaW5lcy5wdXNoKFwiQ291bGQgbm90IHJlc29sdmUgY29tcG9uZW50IG5hbWVkIFwiICsgbmFtZSArIFwiOiBcIiArIG1lc3NhZ2UpO1xuICAgICAgaWYgKGhpbnQgIT0gbnVsbCkge1xuICAgICAgICBsaW5lcy5wdXNoKCcgIFdpdGggcmVzb2x1dGlvbiBoaW50OicpO1xuICAgICAgICBsaW5lcy5wdXNoKFwiICAgIFwiICsgKHV0aWwuaW5zcGVjdChoaW50KSkpO1xuICAgICAgfVxuICAgICAgbGluZXMucHVzaCgnICBJbiByZXNvbHV0aW9uIGNvbnRleHQ6Jyk7XG4gICAgICBsaW5lcy5wdXNoKGNvbnRleHQudG9TdHJpbmcoKSk7XG4gICAgICBsaW5lcy5wdXNoKCcgIC0tLScpO1xuICAgICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUmVzb2x1dGlvbkVycm9yO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBSZXNvbHV0aW9uRXJyb3I7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgQmluZGluZywgQ29udGV4dCwgRm9yZ2UsIEluc3BlY3RvciwgUmVzb2x1dGlvbkVycm9yLCBfLCBhc3NlcnQ7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBCaW5kaW5nID0gcmVxdWlyZSgnLi9CaW5kaW5nJyk7XG5cbiAgQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpO1xuXG4gIEluc3BlY3RvciA9IHJlcXVpcmUoJy4vSW5zcGVjdG9yJyk7XG5cbiAgUmVzb2x1dGlvbkVycm9yID0gcmVxdWlyZSgnLi9lcnJvcnMvUmVzb2x1dGlvbkVycm9yJyk7XG5cbiAgRm9yZ2UgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRm9yZ2UoY29uZmlnKSB7XG4gICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XG4gICAgICAgIGNvbmZpZyA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgICAgdGhpcy51bm1hbmdsZU5hbWVzID0gKHJlZiA9IGNvbmZpZy51bm1hbmdsZU5hbWVzKSAhPSBudWxsID8gcmVmIDogdHJ1ZTtcbiAgICAgIHRoaXMuaW5zcGVjdG9yID0gKHJlZjEgPSBjb25maWcuaW5zcGVjdG9yKSAhPSBudWxsID8gcmVmMSA6IG5ldyBJbnNwZWN0b3IodGhpcy51bm1hbmdsZU5hbWVzKTtcbiAgICB9XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBiYXNlLCBiaW5kaW5nO1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgYXNzZXJ0KHRoaXMudmFsaWRhdGVOYW1lKG5hbWUpLCBcIkludmFsaWQgYmluZGluZyBuYW1lIFxcXCJcIiArIG5hbWUgKyBcIlxcXCJcIik7XG4gICAgICBiaW5kaW5nID0gbmV3IEJpbmRpbmcodGhpcywgbmFtZSk7XG4gICAgICAoKGJhc2UgPSB0aGlzLmJpbmRpbmdzKVtuYW1lXSAhPSBudWxsID8gYmFzZVtuYW1lXSA6IGJhc2VbbmFtZV0gPSBbXSkucHVzaChiaW5kaW5nKTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGNvdW50O1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgY291bnQgPSB0aGlzLmJpbmRpbmdzW25hbWVdICE9IG51bGwgPyB0aGlzLmJpbmRpbmdzW25hbWVdLmxlbmd0aCA6IDA7XG4gICAgICB0aGlzLmJpbmRpbmdzW25hbWVdID0gW107XG4gICAgICByZXR1cm4gY291bnQ7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5yZWJpbmQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICB0aGlzLnVuYmluZChuYW1lKTtcbiAgICAgIHJldHVybiB0aGlzLmJpbmQobmFtZSk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lLCBoaW50LCBhcmdzKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKG5hbWUsIG5ldyBDb250ZXh0KCksIGhpbnQsIGZhbHNlLCBhcmdzKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLmdldE9uZSA9IGZ1bmN0aW9uKG5hbWUsIGhpbnQsIGFyZ3MpIHtcbiAgICAgIHZhciBiaW5kaW5ncywgY29udGV4dDtcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgYmluZGluZ3MgPSB0aGlzLmdldE1hdGNoaW5nQmluZGluZ3MobmFtZSwgaGludCk7XG4gICAgICBpZiAoYmluZGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXNvbHV0aW9uRXJyb3IobmFtZSwgaGludCwgY29udGV4dCwgJ05vIG1hdGNoaW5nIGJpbmRpbmdzIHdlcmUgYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgICBpZiAoYmluZGluZ3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXNvbHV0aW9uRXJyb3IobmFtZSwgaGludCwgY29udGV4dCwgJ011bHRpcGxlIG1hdGNoaW5nIGJpbmRpbmdzIHdlcmUgYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlQmluZGluZ3MoY29udGV4dCwgYmluZGluZ3MsIGhpbnQsIGFyZ3MsIHRydWUpO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24obmFtZSwgYXJncykge1xuICAgICAgdmFyIGJpbmRpbmdzLCBjb250ZXh0O1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICBiaW5kaW5ncyA9IHRoaXMuYmluZGluZ3NbbmFtZV07XG4gICAgICBpZiAoISgoYmluZGluZ3MgIT0gbnVsbCA/IGJpbmRpbmdzLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzb2x1dGlvbkVycm9yKG5hbWUsIHZvaWQgMCwgY29udGV4dCwgJ05vIG1hdGNoaW5nIGJpbmRpbmdzIHdlcmUgYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlQmluZGluZ3MoY29udGV4dCwgYmluZGluZ3MsIHZvaWQgMCwgYXJncywgZmFsc2UpO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24odHlwZSwgYXJncykge1xuICAgICAgdmFyIGJpbmRpbmcsIGNvbnRleHQ7XG4gICAgICBhc3NlcnQodHlwZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwidHlwZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgIGJpbmRpbmcgPSBuZXcgQmluZGluZyh0aGlzLCB0eXBlLmNvbnN0cnVjdG9yLm5hbWUpLnR5cGUodHlwZSk7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlQmluZGluZ3MoY29udGV4dCwgW2JpbmRpbmddLCB2b2lkIDAsIGFyZ3MsIHRydWUpO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuZ2V0TWF0Y2hpbmdCaW5kaW5ncyA9IGZ1bmN0aW9uKG5hbWUsIGhpbnQpIHtcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzW25hbWVdID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMuYmluZGluZ3NbbmFtZV0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGIubWF0Y2hlcyhoaW50KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKG5hbWUsIGNvbnRleHQsIGhpbnQsIGFsbCwgYXJncykge1xuICAgICAgdmFyIGJpbmRpbmdzLCB1bndyYXA7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgfVxuICAgICAgaWYgKGFsbCkge1xuICAgICAgICBiaW5kaW5ncyA9IHRoaXMuYmluZGluZ3NbbmFtZV07XG4gICAgICAgIHVud3JhcCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluZGluZ3MgPSB0aGlzLmdldE1hdGNoaW5nQmluZGluZ3MobmFtZSwgaGludCk7XG4gICAgICAgIHVud3JhcCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoKGJpbmRpbmdzICE9IG51bGwgPyBiaW5kaW5ncy5sZW5ndGggOiB2b2lkIDApID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXNvbHV0aW9uRXJyb3IobmFtZSwgaGludCwgY29udGV4dCwgJ05vIG1hdGNoaW5nIGJpbmRpbmdzIHdlcmUgYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlQmluZGluZ3MoY29udGV4dCwgYmluZGluZ3MsIGhpbnQsIGFyZ3MsIHVud3JhcCk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5yZXNvbHZlQmluZGluZ3MgPSBmdW5jdGlvbihjb250ZXh0LCBiaW5kaW5ncywgaGludCwgYXJncywgdW53cmFwKSB7XG4gICAgICB2YXIgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBfLm1hcChiaW5kaW5ncywgZnVuY3Rpb24oYmluZGluZykge1xuICAgICAgICByZXR1cm4gYmluZGluZy5yZXNvbHZlKGNvbnRleHQsIGhpbnQsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgICBpZiAodW53cmFwICYmIHJlc3VsdHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZ3M7XG4gICAgICBiaW5kaW5ncyA9IF8uZmxhdHRlbihfLnZhbHVlcyh0aGlzLmJpbmRpbmdzKSk7XG4gICAgICByZXR1cm4gXy5pbnZva2UoYmluZGluZ3MsICd0b1N0cmluZycpLmpvaW4oJ1xcbicpO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUudmFsaWRhdGVOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgaWYgKHRoaXMudW5tYW5nbGVOYW1lcykge1xuICAgICAgICByZXR1cm4gL1teXFxkXSQvLnRlc3QobmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEZvcmdlO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBGb3JnZTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBMaWZlY3ljbGU7XG5cbiAgTGlmZWN5Y2xlID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIExpZmVjeWNsZSgpIHt9XG5cbiAgICBMaWZlY3ljbGUucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZXNvbHZlciwgY29udGV4dCwgYXJncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgaW1wbGVtZW50IHJlc29sdmUoKSBvbiBcIiArIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBMaWZlY3ljbGU7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IExpZmVjeWNsZTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBMaWZlY3ljbGUsIFNpbmdsZXRvbkxpZmVjeWNsZSwgYXNzZXJ0LFxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgTGlmZWN5Y2xlID0gcmVxdWlyZSgnLi9MaWZlY3ljbGUnKTtcblxuICBTaW5nbGV0b25MaWZlY3ljbGUgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgIGV4dGVuZChTaW5nbGV0b25MaWZlY3ljbGUsIHN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gU2luZ2xldG9uTGlmZWN5Y2xlKCkge1xuICAgICAgcmV0dXJuIFNpbmdsZXRvbkxpZmVjeWNsZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBTaW5nbGV0b25MaWZlY3ljbGUucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZXNvbHZlciwgY29udGV4dCwgYXJncykge1xuICAgICAgYXNzZXJ0KHJlc29sdmVyICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJyZXNvbHZlclwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBhc3NlcnQoY29udGV4dCAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiY29udGV4dFwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBpZiAodGhpcy5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSByZXNvbHZlci5yZXNvbHZlKGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfTtcblxuICAgIFNpbmdsZXRvbkxpZmVjeWNsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnc2luZ2xldG9uJztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNpbmdsZXRvbkxpZmVjeWNsZTtcblxuICB9KShMaWZlY3ljbGUpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gU2luZ2xldG9uTGlmZWN5Y2xlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIExpZmVjeWNsZSwgVHJhbnNpZW50TGlmZWN5Y2xlLCBhc3NlcnQsXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBMaWZlY3ljbGUgPSByZXF1aXJlKCcuL0xpZmVjeWNsZScpO1xuXG4gIFRyYW5zaWVudExpZmVjeWNsZSA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gICAgZXh0ZW5kKFRyYW5zaWVudExpZmVjeWNsZSwgc3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBUcmFuc2llbnRMaWZlY3ljbGUoKSB7XG4gICAgICByZXR1cm4gVHJhbnNpZW50TGlmZWN5Y2xlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIFRyYW5zaWVudExpZmVjeWNsZS5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHJlc29sdmVyLCBjb250ZXh0LCBhcmdzKSB7XG4gICAgICBhc3NlcnQocmVzb2x2ZXIgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInJlc29sdmVyXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGFzc2VydChjb250ZXh0ICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJjb250ZXh0XCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHJldHVybiByZXNvbHZlci5yZXNvbHZlKGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBUcmFuc2llbnRMaWZlY3ljbGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ3RyYW5zaWVudCc7XG4gICAgfTtcblxuICAgIHJldHVybiBUcmFuc2llbnRMaWZlY3ljbGU7XG5cbiAgfSkoTGlmZWN5Y2xlKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFRyYW5zaWVudExpZmVjeWNsZTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBGdW5jdGlvblJlc29sdmVyLCBSZXNvbHZlciwgXywgYXNzZXJ0LFxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBSZXNvbHZlciA9IHJlcXVpcmUoJy4vUmVzb2x2ZXInKTtcblxuICBGdW5jdGlvblJlc29sdmVyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgICBleHRlbmQoRnVuY3Rpb25SZXNvbHZlciwgc3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBGdW5jdGlvblJlc29sdmVyKGZvcmdlLCBiaW5kaW5nLCBmdW5jKSB7XG4gICAgICB0aGlzLmZ1bmMgPSBmdW5jO1xuICAgICAgRnVuY3Rpb25SZXNvbHZlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBmb3JnZSwgYmluZGluZyk7XG4gICAgICBhc3NlcnQodGhpcy5mdW5jICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJmdW5jXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gdGhpcy5mb3JnZS5pbnNwZWN0b3IuZ2V0RGVwZW5kZW5jaWVzKHRoaXMuZnVuYyk7XG4gICAgfVxuXG4gICAgRnVuY3Rpb25SZXNvbHZlci5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIGFyZ3MgPSB0aGlzLnJlc29sdmVEZXBlbmRlbmNpZXMoY29udGV4dCwgdGhpcy5kZXBlbmRlbmNpZXMsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHRoaXMuZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9O1xuXG4gICAgRnVuY3Rpb25SZXNvbHZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnZnVuY3Rpb24nO1xuICAgIH07XG5cbiAgICByZXR1cm4gRnVuY3Rpb25SZXNvbHZlcjtcblxuICB9KShSZXNvbHZlcik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvblJlc29sdmVyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIEluc3RhbmNlUmVzb2x2ZXIsIFJlc29sdmVyLCBfLCBhc3NlcnQsXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIFJlc29sdmVyID0gcmVxdWlyZSgnLi9SZXNvbHZlcicpO1xuXG4gIEluc3RhbmNlUmVzb2x2ZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgIGV4dGVuZChJbnN0YW5jZVJlc29sdmVyLCBzdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIEluc3RhbmNlUmVzb2x2ZXIoZm9yZ2UsIGJpbmRpbmcsIGluc3RhbmNlKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICBJbnN0YW5jZVJlc29sdmVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIGZvcmdlLCBiaW5kaW5nKTtcbiAgICAgIGFzc2VydCh0aGlzLmluc3RhbmNlICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJpbnN0YW5jZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgIH1cblxuICAgIEluc3RhbmNlUmVzb2x2ZXIucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9O1xuXG4gICAgSW5zdGFuY2VSZXNvbHZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAodGhpcy5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnPHVua25vd24gaW5zdGFuY2U+JztcbiAgICAgIH0gZWxzZSBpZiAoKChyZWYgPSB0aGlzLmluc3RhbmNlLmNvbnN0cnVjdG9yKSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwiYW4gaW5zdGFuY2Ugb2YgXCIgKyB0aGlzLmluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJhbiBpbnN0YW5jZSBvZiBcIiArICh0eXBlb2YgdGhpcy5pbnN0YW5jZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBJbnN0YW5jZVJlc29sdmVyO1xuXG4gIH0pKFJlc29sdmVyKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IEluc3RhbmNlUmVzb2x2ZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgUmVzb2x2ZXIsIF8sIGFzc2VydDtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIFJlc29sdmVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFJlc29sdmVyKGZvcmdlLCBiaW5kaW5nKSB7XG4gICAgICB0aGlzLmZvcmdlID0gZm9yZ2U7XG4gICAgICB0aGlzLmJpbmRpbmcgPSBiaW5kaW5nO1xuICAgICAgYXNzZXJ0KHRoaXMuZm9yZ2UgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImZvcmdlXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGFzc2VydCh0aGlzLmJpbmRpbmcgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImJpbmRpbmdcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgIH1cblxuICAgIFJlc29sdmVyLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgaW1wbGVtZW50IHJlc29sdmUoKSBvbiBcIiArIHRoaXMuY29uc3RydWN0b3IubmFtZSk7XG4gICAgfTtcblxuICAgIFJlc29sdmVyLnByb3RvdHlwZS5yZXNvbHZlRGVwZW5kZW5jaWVzID0gZnVuY3Rpb24oY29udGV4dCwgZGVwZW5kZW5jaWVzLCBhcmdzKSB7XG4gICAgICByZXR1cm4gXy5tYXAoZGVwZW5kZW5jaWVzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRlcCkge1xuICAgICAgICAgIHZhciBvdmVycmlkZSwgcmVmO1xuICAgICAgICAgIGlmIChkZXAubmFtZSA9PT0gJ2ZvcmdlJykge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmZvcmdlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdmVycmlkZSA9IChyZWYgPSBhcmdzW2RlcC5uYW1lXSkgIT0gbnVsbCA/IHJlZiA6IF90aGlzLmJpbmRpbmdbXCJhcmd1bWVudHNcIl1bZGVwLm5hbWVdO1xuICAgICAgICAgIHJldHVybiBvdmVycmlkZSAhPSBudWxsID8gb3ZlcnJpZGUgOiBfdGhpcy5mb3JnZS5yZXNvbHZlKGRlcC5uYW1lLCBjb250ZXh0LCBkZXAuaGludCwgZGVwLmFsbCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBSZXNvbHZlcjtcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gUmVzb2x2ZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgUmVzb2x2ZXIsIFR5cGVSZXNvbHZlciwgXywgYXNzZXJ0LFxuICAgIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBSZXNvbHZlciA9IHJlcXVpcmUoJy4vUmVzb2x2ZXInKTtcblxuICBUeXBlUmVzb2x2ZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgIGV4dGVuZChUeXBlUmVzb2x2ZXIsIHN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gVHlwZVJlc29sdmVyKGZvcmdlLCBiaW5kaW5nLCB0eXBlMSkge1xuICAgICAgdmFyIGNvbnN0cnVjdG9yO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTE7XG4gICAgICBUeXBlUmVzb2x2ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZm9yZ2UsIGJpbmRpbmcpO1xuICAgICAgYXNzZXJ0KHRoaXMudHlwZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwidHlwZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBjb25zdHJ1Y3RvciA9IHRoaXMuZmluZENvbnN0cnVjdG9yVG9JbnNwZWN0KHRoaXMudHlwZSk7XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IHRoaXMuZm9yZ2UuaW5zcGVjdG9yLmdldERlcGVuZGVuY2llcyhjb25zdHJ1Y3Rvcik7XG4gICAgfVxuXG4gICAgVHlwZVJlc29sdmVyLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgdmFyIGN0b3I7XG4gICAgICBhcmdzID0gdGhpcy5yZXNvbHZlRGVwZW5kZW5jaWVzKGNvbnRleHQsIHRoaXMuZGVwZW5kZW5jaWVzLCBhcmdzKTtcbiAgICAgIGN0b3IgPSB0aGlzLnR5cGUuYmluZC5hcHBseSh0aGlzLnR5cGUsIFtudWxsXS5jb25jYXQoYXJncykpO1xuICAgICAgcmV0dXJuIG5ldyBjdG9yKCk7XG4gICAgfTtcblxuICAgIFR5cGVSZXNvbHZlci5wcm90b3R5cGUuZmluZENvbnN0cnVjdG9yVG9JbnNwZWN0ID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgdmFyIGNvbnN0cnVjdG9yO1xuICAgICAgY29uc3RydWN0b3IgPSB0eXBlO1xuICAgICAgd2hpbGUgKHRoaXMuZm9yZ2UuaW5zcGVjdG9yLmlzQXV0b0NvbnN0cnVjdG9yKGNvbnN0cnVjdG9yKSkge1xuICAgICAgICBjb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yLl9fc3VwZXJfXy5jb25zdHJ1Y3RvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcbiAgICB9O1xuXG4gICAgVHlwZVJlc29sdmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwidHlwZXtcIiArIHRoaXMudHlwZS5uYW1lICsgXCJ9XCI7XG4gICAgfTtcblxuICAgIHJldHVybiBUeXBlUmVzb2x2ZXI7XG5cbiAgfSkoUmVzb2x2ZXIpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gVHlwZVJlc29sdmVyO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLyohXHJcbiAqIEtub2Nrb3V0IEphdmFTY3JpcHQgbGlicmFyeSB2My40LjJcclxuICogKGMpIFRoZSBLbm9ja291dC5qcyB0ZWFtIC0gaHR0cDovL2tub2Nrb3V0anMuY29tL1xyXG4gKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigpIHsoZnVuY3Rpb24obil7dmFyIHg9dGhpc3x8KDAsZXZhbCkoXCJ0aGlzXCIpLHQ9eC5kb2N1bWVudCxNPXgubmF2aWdhdG9yLHU9eC5qUXVlcnksSD14LkpTT047KGZ1bmN0aW9uKG4pe1wiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIixcInJlcXVpcmVcIl0sbik6XCJvYmplY3RcIj09PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9uKG1vZHVsZS5leHBvcnRzfHxleHBvcnRzKTpuKHgua289e30pfSkoZnVuY3Rpb24oTixPKXtmdW5jdGlvbiBKKGEsYyl7cmV0dXJuIG51bGw9PT1hfHx0eXBlb2YgYSBpbiBSP2E9PT1jOiExfWZ1bmN0aW9uIFMoYixjKXt2YXIgZDtyZXR1cm4gZnVuY3Rpb24oKXtkfHwoZD1hLmEuc2V0VGltZW91dChmdW5jdGlvbigpe2Q9bjtiKCl9LGMpKX19ZnVuY3Rpb24gVChiLGMpe3ZhciBkO3JldHVybiBmdW5jdGlvbigpe2NsZWFyVGltZW91dChkKTtkPWEuYS5zZXRUaW1lb3V0KGIsYyl9fWZ1bmN0aW9uIFUoYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjKXtjJiZjIT09RT9cImJlZm9yZUNoYW5nZVwiPT09Yz90aGlzLk9iKGEpOnRoaXMuSmEoYSxjKTp0aGlzLlBiKGEpfWZ1bmN0aW9uIFYoYSxjKXtudWxsIT09YyYmYy5rJiZjLmsoKX1mdW5jdGlvbiBXKGEsYyl7dmFyIGQ9dGhpcy5NYyxlPWRbc107ZS5UfHwodGhpcy5vYiYmdGhpcy5PYVtjXT8oZC5TYihjLGEsdGhpcy5PYVtjXSksdGhpcy5PYVtjXT1udWxsLC0tdGhpcy5vYik6ZS5zW2NdfHxkLlNiKGMsYSxlLnQ/eyQ6YX06ZC55YyhhKSksYS5IYSYmYS5IYygpKX1mdW5jdGlvbiBLKGIsYyxkLGUpe2EuZFtiXT17aW5pdDpmdW5jdGlvbihiLGcsaCxsLG0pe3ZhciBrLHI7YS5tKGZ1bmN0aW9uKCl7dmFyIHE9ZygpLHA9YS5hLmMocSkscD0hZCE9PSFwLEE9IXI7aWYoQXx8Y3x8cCE9PWspQSYmYS54YS5DYSgpJiYocj1hLmEud2EoYS5mLmNoaWxkTm9kZXMoYiksITApKSxwPyhBfHxhLmYuZmEoYixhLmEud2EocikpLGEuaGIoZT9lKG0scSk6bSxiKSk6YS5mLnphKGIpLGs9cH0sbnVsbCxcclxuICAgIHtpOmJ9KTtyZXR1cm57Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6ITB9fX07YS5oLnZhW2JdPSExO2EuZi5hYVtiXT0hMH12YXIgYT1cInVuZGVmaW5lZFwiIT09dHlwZW9mIE4/Tjp7fTthLmI9ZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9Yi5zcGxpdChcIi5cIiksZT1hLGY9MDtmPGQubGVuZ3RoLTE7ZisrKWU9ZVtkW2ZdXTtlW2RbZC5sZW5ndGgtMV1dPWN9O2EuSD1mdW5jdGlvbihhLGMsZCl7YVtjXT1kfTthLnZlcnNpb249XCIzLjQuMlwiO2EuYihcInZlcnNpb25cIixhLnZlcnNpb24pO2Eub3B0aW9ucz17ZGVmZXJVcGRhdGVzOiExLHVzZU9ubHlOYXRpdmVFdmVudHM6ITF9O2EuYT1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSxiKXtmb3IodmFyIGMgaW4gYSlhLmhhc093blByb3BlcnR5KGMpJiZiKGMsYVtjXSl9ZnVuY3Rpb24gYyhhLGIpe2lmKGIpZm9yKHZhciBjIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShjKSYmKGFbY109YltjXSk7cmV0dXJuIGF9ZnVuY3Rpb24gZChhLGIpe2EuX19wcm90b19fPVxyXG4gICAgYjtyZXR1cm4gYX1mdW5jdGlvbiBlKGIsYyxkLGUpe3ZhciBtPWJbY10ubWF0Y2gocil8fFtdO2EuYS5yKGQubWF0Y2gociksZnVuY3Rpb24oYil7YS5hLnJhKG0sYixlKX0pO2JbY109bS5qb2luKFwiIFwiKX12YXIgZj17X19wcm90b19fOltdfWluc3RhbmNlb2YgQXJyYXksZz1cImZ1bmN0aW9uXCI9PT10eXBlb2YgU3ltYm9sLGg9e30sbD17fTtoW00mJi9GaXJlZm94XFwvMi9pLnRlc3QoTS51c2VyQWdlbnQpP1wiS2V5Ym9hcmRFdmVudFwiOlwiVUlFdmVudHNcIl09W1wia2V5dXBcIixcImtleWRvd25cIixcImtleXByZXNzXCJdO2guTW91c2VFdmVudHM9XCJjbGljayBkYmxjbGljayBtb3VzZWRvd24gbW91c2V1cCBtb3VzZW1vdmUgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLnNwbGl0KFwiIFwiKTtiKGgsZnVuY3Rpb24oYSxiKXtpZihiLmxlbmd0aClmb3IodmFyIGM9MCxkPWIubGVuZ3RoO2M8ZDtjKyspbFtiW2NdXT1hfSk7dmFyIG09e3Byb3BlcnR5Y2hhbmdlOiEwfSxrPVxyXG4gICAgdCYmZnVuY3Rpb24oKXtmb3IodmFyIGE9MyxiPXQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxjPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpXCIpO2IuaW5uZXJIVE1MPVwiXFx4M2MhLS1baWYgZ3QgSUUgXCIrICsrYStcIl0+PGk+PC9pPjwhW2VuZGlmXS0tXFx4M2VcIixjWzBdOyk7cmV0dXJuIDQ8YT9hOm59KCkscj0vXFxTKy9nO3JldHVybntnYzpbXCJhdXRoZW50aWNpdHlfdG9rZW5cIiwvXl9fUmVxdWVzdFZlcmlmaWNhdGlvblRva2VuKF8uKik/JC9dLHI6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MCxkPWEubGVuZ3RoO2M8ZDtjKyspYihhW2NdLGMpfSxvOmZ1bmN0aW9uKGEsYil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YpcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYSxiKTtmb3IodmFyIGM9MCxkPWEubGVuZ3RoO2M8ZDtjKyspaWYoYVtjXT09PWIpcmV0dXJuIGM7cmV0dXJuLTF9LFZiOmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsZT1hLmxlbmd0aDtkPGU7ZCsrKWlmKGIuY2FsbChjLGFbZF0sZCkpcmV0dXJuIGFbZF07cmV0dXJuIG51bGx9LE5hOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLm8oYixjKTswPGQ/Yi5zcGxpY2UoZCwxKTowPT09ZCYmYi5zaGlmdCgpfSxXYjpmdW5jdGlvbihiKXtiPWJ8fFtdO2Zvcih2YXIgYz1bXSxkPTAsZT1iLmxlbmd0aDtkPGU7ZCsrKTA+YS5hLm8oYyxiW2RdKSYmYy5wdXNoKGJbZF0pO3JldHVybiBjfSxpYjpmdW5jdGlvbihhLGIpe2E9YXx8W107Zm9yKHZhciBjPVtdLGQ9MCxlPWEubGVuZ3RoO2Q8ZTtkKyspYy5wdXNoKGIoYVtkXSxkKSk7cmV0dXJuIGN9LE1hOmZ1bmN0aW9uKGEsYil7YT1hfHxbXTtmb3IodmFyIGM9W10sZD0wLGU9YS5sZW5ndGg7ZDxlO2QrKyliKGFbZF0sZCkmJmMucHVzaChhW2RdKTtyZXR1cm4gY30sdGE6ZnVuY3Rpb24oYSxiKXtpZihiIGluc3RhbmNlb2YgQXJyYXkpYS5wdXNoLmFwcGx5KGEsYik7ZWxzZSBmb3IodmFyIGM9MCxkPWIubGVuZ3RoO2M8XHJcbmQ7YysrKWEucHVzaChiW2NdKTtyZXR1cm4gYX0scmE6ZnVuY3Rpb24oYixjLGQpe3ZhciBlPWEuYS5vKGEuYS5CYihiKSxjKTswPmU/ZCYmYi5wdXNoKGMpOmR8fGIuc3BsaWNlKGUsMSl9LGxhOmYsZXh0ZW5kOmMsJGE6ZCxhYjpmP2Q6YyxEOmIsRWE6ZnVuY3Rpb24oYSxiKXtpZighYSlyZXR1cm4gYTt2YXIgYz17fSxkO2ZvcihkIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShkKSYmKGNbZF09YihhW2RdLGQsYSkpO3JldHVybiBjfSxyYjpmdW5jdGlvbihiKXtmb3IoO2IuZmlyc3RDaGlsZDspYS5yZW1vdmVOb2RlKGIuZmlyc3RDaGlsZCl9LG5jOmZ1bmN0aW9uKGIpe2I9YS5hLlcoYik7Zm9yKHZhciBjPShiWzBdJiZiWzBdLm93bmVyRG9jdW1lbnR8fHQpLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksZD0wLGU9Yi5sZW5ndGg7ZDxlO2QrKyljLmFwcGVuZENoaWxkKGEuYmEoYltkXSkpO3JldHVybiBjfSx3YTpmdW5jdGlvbihiLGMpe2Zvcih2YXIgZD0wLGU9Yi5sZW5ndGgsbT1bXTtkPGU7ZCsrKXt2YXIgaz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJbZF0uY2xvbmVOb2RlKCEwKTttLnB1c2goYz9hLmJhKGspOmspfXJldHVybiBtfSxmYTpmdW5jdGlvbihiLGMpe2EuYS5yYihiKTtpZihjKWZvcih2YXIgZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKyliLmFwcGVuZENoaWxkKGNbZF0pfSx1YzpmdW5jdGlvbihiLGMpe3ZhciBkPWIubm9kZVR5cGU/W2JdOmI7aWYoMDxkLmxlbmd0aCl7Zm9yKHZhciBlPWRbMF0sbT1lLnBhcmVudE5vZGUsaz0wLGY9Yy5sZW5ndGg7azxmO2srKyltLmluc2VydEJlZm9yZShjW2tdLGUpO2s9MDtmb3IoZj1kLmxlbmd0aDtrPGY7aysrKWEucmVtb3ZlTm9kZShkW2tdKX19LEJhOmZ1bmN0aW9uKGEsYil7aWYoYS5sZW5ndGgpe2ZvcihiPTg9PT1iLm5vZGVUeXBlJiZiLnBhcmVudE5vZGV8fGI7YS5sZW5ndGgmJmFbMF0ucGFyZW50Tm9kZSE9PWI7KWEuc3BsaWNlKDAsMSk7Zm9yKDsxPGEubGVuZ3RoJiZhW2EubGVuZ3RoLTFdLnBhcmVudE5vZGUhPT1iOylhLmxlbmd0aC0tO2lmKDE8YS5sZW5ndGgpe3ZhciBjPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhWzBdLGQ9YVthLmxlbmd0aC0xXTtmb3IoYS5sZW5ndGg9MDtjIT09ZDspYS5wdXNoKGMpLGM9Yy5uZXh0U2libGluZzthLnB1c2goZCl9fXJldHVybiBhfSx3YzpmdW5jdGlvbihhLGIpezc+az9hLnNldEF0dHJpYnV0ZShcInNlbGVjdGVkXCIsYik6YS5zZWxlY3RlZD1ifSxjYjpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09PWF8fGE9PT1uP1wiXCI6YS50cmltP2EudHJpbSgpOmEudG9TdHJpbmcoKS5yZXBsYWNlKC9eW1xcc1xceGEwXSt8W1xcc1xceGEwXSskL2csXCJcIil9LHNkOmZ1bmN0aW9uKGEsYil7YT1hfHxcIlwiO3JldHVybiBiLmxlbmd0aD5hLmxlbmd0aD8hMTphLnN1YnN0cmluZygwLGIubGVuZ3RoKT09PWJ9LFJjOmZ1bmN0aW9uKGEsYil7aWYoYT09PWIpcmV0dXJuITA7aWYoMTE9PT1hLm5vZGVUeXBlKXJldHVybiExO2lmKGIuY29udGFpbnMpcmV0dXJuIGIuY29udGFpbnMoMz09PWEubm9kZVR5cGU/YS5wYXJlbnROb2RlOmEpO2lmKGIuY29tcGFyZURvY3VtZW50UG9zaXRpb24pcmV0dXJuIDE2PT1cclxuICAgIChiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGEpJjE2KTtmb3IoO2EmJmEhPWI7KWE9YS5wYXJlbnROb2RlO3JldHVybiEhYX0scWI6ZnVuY3Rpb24oYil7cmV0dXJuIGEuYS5SYyhiLGIub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpfSxUYjpmdW5jdGlvbihiKXtyZXR1cm4hIWEuYS5WYihiLGEuYS5xYil9LEE6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmEudGFnTmFtZSYmYS50YWdOYW1lLnRvTG93ZXJDYXNlKCl9LFpiOmZ1bmN0aW9uKGIpe3JldHVybiBhLm9uRXJyb3I/ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIGIuYXBwbHkodGhpcyxhcmd1bWVudHMpfWNhdGNoKGMpe3Rocm93IGEub25FcnJvciYmYS5vbkVycm9yKGMpLGM7fX06Yn0sc2V0VGltZW91dDpmdW5jdGlvbihiLGMpe3JldHVybiBzZXRUaW1lb3V0KGEuYS5aYihiKSxjKX0sZGM6ZnVuY3Rpb24oYil7c2V0VGltZW91dChmdW5jdGlvbigpe2Eub25FcnJvciYmYS5vbkVycm9yKGIpO3Rocm93IGI7fSwwKX0scTpmdW5jdGlvbihiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMsZCl7dmFyIGU9YS5hLlpiKGQpO2Q9ayYmbVtjXTtpZihhLm9wdGlvbnMudXNlT25seU5hdGl2ZUV2ZW50c3x8ZHx8IXUpaWYoZHx8XCJmdW5jdGlvblwiIT10eXBlb2YgYi5hZGRFdmVudExpc3RlbmVyKWlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBiLmF0dGFjaEV2ZW50KXt2YXIgZj1mdW5jdGlvbihhKXtlLmNhbGwoYixhKX0sbD1cIm9uXCIrYztiLmF0dGFjaEV2ZW50KGwsZik7YS5hLkcucWEoYixmdW5jdGlvbigpe2IuZGV0YWNoRXZlbnQobCxmKX0pfWVsc2UgdGhyb3cgRXJyb3IoXCJCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBhZGRFdmVudExpc3RlbmVyIG9yIGF0dGFjaEV2ZW50XCIpO2Vsc2UgYi5hZGRFdmVudExpc3RlbmVyKGMsZSwhMSk7ZWxzZSB1KGIpLmJpbmQoYyxlKX0sRmE6ZnVuY3Rpb24oYixjKXtpZighYnx8IWIubm9kZVR5cGUpdGhyb3cgRXJyb3IoXCJlbGVtZW50IG11c3QgYmUgYSBET00gbm9kZSB3aGVuIGNhbGxpbmcgdHJpZ2dlckV2ZW50XCIpO3ZhciBkO1wiaW5wdXRcIj09PVxyXG5hLmEuQShiKSYmYi50eXBlJiZcImNsaWNrXCI9PWMudG9Mb3dlckNhc2UoKT8oZD1iLnR5cGUsZD1cImNoZWNrYm94XCI9PWR8fFwicmFkaW9cIj09ZCk6ZD0hMTtpZihhLm9wdGlvbnMudXNlT25seU5hdGl2ZUV2ZW50c3x8IXV8fGQpaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdC5jcmVhdGVFdmVudClpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBiLmRpc3BhdGNoRXZlbnQpZD10LmNyZWF0ZUV2ZW50KGxbY118fFwiSFRNTEV2ZW50c1wiKSxkLmluaXRFdmVudChjLCEwLCEwLHgsMCwwLDAsMCwwLCExLCExLCExLCExLDAsYiksYi5kaXNwYXRjaEV2ZW50KGQpO2Vsc2UgdGhyb3cgRXJyb3IoXCJUaGUgc3VwcGxpZWQgZWxlbWVudCBkb2Vzbid0IHN1cHBvcnQgZGlzcGF0Y2hFdmVudFwiKTtlbHNlIGlmKGQmJmIuY2xpY2spYi5jbGljaygpO2Vsc2UgaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGIuZmlyZUV2ZW50KWIuZmlyZUV2ZW50KFwib25cIitjKTtlbHNlIHRocm93IEVycm9yKFwiQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdHJpZ2dlcmluZyBldmVudHNcIik7XHJcbmVsc2UgdShiKS50cmlnZ2VyKGMpfSxjOmZ1bmN0aW9uKGIpe3JldHVybiBhLkkoYik/YigpOmJ9LEJiOmZ1bmN0aW9uKGIpe3JldHVybiBhLkkoYik/Yi5wKCk6Yn0sZmI6ZnVuY3Rpb24oYixjLGQpe3ZhciBrO2MmJihcIm9iamVjdFwiPT09dHlwZW9mIGIuY2xhc3NMaXN0PyhrPWIuY2xhc3NMaXN0W2Q/XCJhZGRcIjpcInJlbW92ZVwiXSxhLmEucihjLm1hdGNoKHIpLGZ1bmN0aW9uKGEpe2suY2FsbChiLmNsYXNzTGlzdCxhKX0pKTpcInN0cmluZ1wiPT09dHlwZW9mIGIuY2xhc3NOYW1lLmJhc2VWYWw/ZShiLmNsYXNzTmFtZSxcImJhc2VWYWxcIixjLGQpOmUoYixcImNsYXNzTmFtZVwiLGMsZCkpfSxiYjpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMpO2lmKG51bGw9PT1kfHxkPT09bilkPVwiXCI7dmFyIGU9YS5mLmZpcnN0Q2hpbGQoYik7IWV8fDMhPWUubm9kZVR5cGV8fGEuZi5uZXh0U2libGluZyhlKT9hLmYuZmEoYixbYi5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGQpXSk6ZS5kYXRhPVxyXG4gICAgZDthLmEuV2MoYil9LHZjOmZ1bmN0aW9uKGEsYil7YS5uYW1lPWI7aWYoNz49ayl0cnl7YS5tZXJnZUF0dHJpYnV0ZXModC5jcmVhdGVFbGVtZW50KFwiPGlucHV0IG5hbWU9J1wiK2EubmFtZStcIicvPlwiKSwhMSl9Y2F0Y2goYyl7fX0sV2M6ZnVuY3Rpb24oYSl7OTw9ayYmKGE9MT09YS5ub2RlVHlwZT9hOmEucGFyZW50Tm9kZSxhLnN0eWxlJiYoYS5zdHlsZS56b29tPWEuc3R5bGUuem9vbSkpfSxTYzpmdW5jdGlvbihhKXtpZihrKXt2YXIgYj1hLnN0eWxlLndpZHRoO2Euc3R5bGUud2lkdGg9MDthLnN0eWxlLndpZHRoPWJ9fSxuZDpmdW5jdGlvbihiLGMpe2I9YS5hLmMoYik7Yz1hLmEuYyhjKTtmb3IodmFyIGQ9W10sZT1iO2U8PWM7ZSsrKWQucHVzaChlKTtyZXR1cm4gZH0sVzpmdW5jdGlvbihhKXtmb3IodmFyIGI9W10sYz0wLGQ9YS5sZW5ndGg7YzxkO2MrKyliLnB1c2goYVtjXSk7cmV0dXJuIGJ9LGJjOmZ1bmN0aW9uKGEpe3JldHVybiBnP1N5bWJvbChhKTphfSx4ZDo2PT09ayxcclxuICAgIHlkOjc9PT1rLEM6ayxpYzpmdW5jdGlvbihiLGMpe2Zvcih2YXIgZD1hLmEuVyhiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikpLmNvbmNhdChhLmEuVyhiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGV4dGFyZWFcIikpKSxlPVwic3RyaW5nXCI9PXR5cGVvZiBjP2Z1bmN0aW9uKGEpe3JldHVybiBhLm5hbWU9PT1jfTpmdW5jdGlvbihhKXtyZXR1cm4gYy50ZXN0KGEubmFtZSl9LGs9W10sbT1kLmxlbmd0aC0xOzA8PW07bS0tKWUoZFttXSkmJmsucHVzaChkW21dKTtyZXR1cm4ga30sa2Q6ZnVuY3Rpb24oYil7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGImJihiPWEuYS5jYihiKSk/SCYmSC5wYXJzZT9ILnBhcnNlKGIpOihuZXcgRnVuY3Rpb24oXCJyZXR1cm4gXCIrYikpKCk6bnVsbH0sR2I6ZnVuY3Rpb24oYixjLGQpe2lmKCFIfHwhSC5zdHJpbmdpZnkpdGhyb3cgRXJyb3IoXCJDYW5ub3QgZmluZCBKU09OLnN0cmluZ2lmeSgpLiBTb21lIGJyb3dzZXJzIChlLmcuLCBJRSA8IDgpIGRvbid0IHN1cHBvcnQgaXQgbmF0aXZlbHksIGJ1dCB5b3UgY2FuIG92ZXJjb21lIHRoaXMgYnkgYWRkaW5nIGEgc2NyaXB0IHJlZmVyZW5jZSB0byBqc29uMi5qcywgZG93bmxvYWRhYmxlIGZyb20gaHR0cDovL3d3dy5qc29uLm9yZy9qc29uMi5qc1wiKTtcclxuICAgICAgICByZXR1cm4gSC5zdHJpbmdpZnkoYS5hLmMoYiksYyxkKX0sbGQ6ZnVuY3Rpb24oYyxkLGUpe2U9ZXx8e307dmFyIGs9ZS5wYXJhbXN8fHt9LG09ZS5pbmNsdWRlRmllbGRzfHx0aGlzLmdjLGY9YztpZihcIm9iamVjdFwiPT10eXBlb2YgYyYmXCJmb3JtXCI9PT1hLmEuQShjKSlmb3IodmFyIGY9Yy5hY3Rpb24sbD1tLmxlbmd0aC0xOzA8PWw7bC0tKWZvcih2YXIgZz1hLmEuaWMoYyxtW2xdKSxoPWcubGVuZ3RoLTE7MDw9aDtoLS0pa1tnW2hdLm5hbWVdPWdbaF0udmFsdWU7ZD1hLmEuYyhkKTt2YXIgcj10LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO3Iuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtyLmFjdGlvbj1mO3IubWV0aG9kPVwicG9zdFwiO2Zvcih2YXIgbiBpbiBkKWM9dC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksYy50eXBlPVwiaGlkZGVuXCIsYy5uYW1lPW4sYy52YWx1ZT1hLmEuR2IoYS5hLmMoZFtuXSkpLHIuYXBwZW5kQ2hpbGQoYyk7YihrLGZ1bmN0aW9uKGEsYil7dmFyIGM9dC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYy50eXBlPVwiaGlkZGVuXCI7Yy5uYW1lPWE7Yy52YWx1ZT1iO3IuYXBwZW5kQ2hpbGQoYyl9KTt0LmJvZHkuYXBwZW5kQ2hpbGQocik7ZS5zdWJtaXR0ZXI/ZS5zdWJtaXR0ZXIocik6ci5zdWJtaXQoKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHIpfSwwKX19fSgpO2EuYihcInV0aWxzXCIsYS5hKTthLmIoXCJ1dGlscy5hcnJheUZvckVhY2hcIixhLmEucik7YS5iKFwidXRpbHMuYXJyYXlGaXJzdFwiLGEuYS5WYik7YS5iKFwidXRpbHMuYXJyYXlGaWx0ZXJcIixhLmEuTWEpO2EuYihcInV0aWxzLmFycmF5R2V0RGlzdGluY3RWYWx1ZXNcIixhLmEuV2IpO2EuYihcInV0aWxzLmFycmF5SW5kZXhPZlwiLGEuYS5vKTthLmIoXCJ1dGlscy5hcnJheU1hcFwiLGEuYS5pYik7YS5iKFwidXRpbHMuYXJyYXlQdXNoQWxsXCIsYS5hLnRhKTthLmIoXCJ1dGlscy5hcnJheVJlbW92ZUl0ZW1cIixhLmEuTmEpO2EuYihcInV0aWxzLmV4dGVuZFwiLGEuYS5leHRlbmQpO2EuYihcInV0aWxzLmZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0XCIsXHJcbiAgICBhLmEuZ2MpO2EuYihcInV0aWxzLmdldEZvcm1GaWVsZHNcIixhLmEuaWMpO2EuYihcInV0aWxzLnBlZWtPYnNlcnZhYmxlXCIsYS5hLkJiKTthLmIoXCJ1dGlscy5wb3N0SnNvblwiLGEuYS5sZCk7YS5iKFwidXRpbHMucGFyc2VKc29uXCIsYS5hLmtkKTthLmIoXCJ1dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlclwiLGEuYS5xKTthLmIoXCJ1dGlscy5zdHJpbmdpZnlKc29uXCIsYS5hLkdiKTthLmIoXCJ1dGlscy5yYW5nZVwiLGEuYS5uZCk7YS5iKFwidXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzXCIsYS5hLmZiKTthLmIoXCJ1dGlscy50cmlnZ2VyRXZlbnRcIixhLmEuRmEpO2EuYihcInV0aWxzLnVud3JhcE9ic2VydmFibGVcIixhLmEuYyk7YS5iKFwidXRpbHMub2JqZWN0Rm9yRWFjaFwiLGEuYS5EKTthLmIoXCJ1dGlscy5hZGRPclJlbW92ZUl0ZW1cIixhLmEucmEpO2EuYihcInV0aWxzLnNldFRleHRDb250ZW50XCIsYS5hLmJiKTthLmIoXCJ1bndyYXBcIixhLmEuYyk7RnVuY3Rpb24ucHJvdG90eXBlLmJpbmR8fChGdW5jdGlvbi5wcm90b3R5cGUuYmluZD1cclxuICAgIGZ1bmN0aW9uKGEpe3ZhciBjPXRoaXM7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGMuYXBwbHkoYSxhcmd1bWVudHMpfTt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSk7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGU9ZC5zbGljZSgwKTtlLnB1c2guYXBwbHkoZSxhcmd1bWVudHMpO3JldHVybiBjLmFwcGx5KGEsZSl9fSk7YS5hLmU9bmV3IGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShiLGcpe3ZhciBoPWJbZF07aWYoIWh8fFwibnVsbFwiPT09aHx8IWVbaF0pe2lmKCFnKXJldHVybiBuO2g9YltkXT1cImtvXCIrYysrO2VbaF09e319cmV0dXJuIGVbaF19dmFyIGM9MCxkPVwiX19rb19fXCIrKG5ldyBEYXRlKS5nZXRUaW1lKCksZT17fTtyZXR1cm57Z2V0OmZ1bmN0aW9uKGMsZCl7dmFyIGU9YShjLCExKTtyZXR1cm4gZT09PW4/bjplW2RdfSxzZXQ6ZnVuY3Rpb24oYyxkLGUpe2lmKGUhPT1ufHxhKGMsITEpIT09bilhKGMsITApW2RdPVxyXG4gICAgZX0sY2xlYXI6ZnVuY3Rpb24oYSl7dmFyIGI9YVtkXTtyZXR1cm4gYj8oZGVsZXRlIGVbYl0sYVtkXT1udWxsLCEwKTohMX0sSjpmdW5jdGlvbigpe3JldHVybiBjKysgK2R9fX07YS5iKFwidXRpbHMuZG9tRGF0YVwiLGEuYS5lKTthLmIoXCJ1dGlscy5kb21EYXRhLmNsZWFyXCIsYS5hLmUuY2xlYXIpO2EuYS5HPW5ldyBmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixjKXt2YXIgZT1hLmEuZS5nZXQoYixkKTtlPT09biYmYyYmKGU9W10sYS5hLmUuc2V0KGIsZCxlKSk7cmV0dXJuIGV9ZnVuY3Rpb24gYyhkKXt2YXIgZT1iKGQsITEpO2lmKGUpZm9yKHZhciBlPWUuc2xpY2UoMCksbD0wO2w8ZS5sZW5ndGg7bCsrKWVbbF0oZCk7YS5hLmUuY2xlYXIoZCk7YS5hLkcuY2xlYW5FeHRlcm5hbERhdGEoZCk7aWYoZltkLm5vZGVUeXBlXSlmb3IoZT1kLmZpcnN0Q2hpbGQ7ZD1lOyllPWQubmV4dFNpYmxpbmcsOD09PWQubm9kZVR5cGUmJmMoZCl9dmFyIGQ9YS5hLmUuSigpLGU9ezE6ITAsODohMCw5OiEwfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGY9ezE6ITAsOTohMH07cmV0dXJue3FhOmZ1bmN0aW9uKGEsYyl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgYyl0aHJvdyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtiKGEsITApLnB1c2goYyl9LHRjOmZ1bmN0aW9uKGMsZSl7dmFyIGY9YihjLCExKTtmJiYoYS5hLk5hKGYsZSksMD09Zi5sZW5ndGgmJmEuYS5lLnNldChjLGQsbikpfSxiYTpmdW5jdGlvbihiKXtpZihlW2Iubm9kZVR5cGVdJiYoYyhiKSxmW2Iubm9kZVR5cGVdKSl7dmFyIGQ9W107YS5hLnRhKGQsYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikpO2Zvcih2YXIgbD0wLG09ZC5sZW5ndGg7bDxtO2wrKyljKGRbbF0pfXJldHVybiBifSxyZW1vdmVOb2RlOmZ1bmN0aW9uKGIpe2EuYmEoYik7Yi5wYXJlbnROb2RlJiZiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYil9LGNsZWFuRXh0ZXJuYWxEYXRhOmZ1bmN0aW9uKGEpe3UmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHUuY2xlYW5EYXRhJiZ1LmNsZWFuRGF0YShbYV0pfX19O1xyXG4gICAgYS5iYT1hLmEuRy5iYTthLnJlbW92ZU5vZGU9YS5hLkcucmVtb3ZlTm9kZTthLmIoXCJjbGVhbk5vZGVcIixhLmJhKTthLmIoXCJyZW1vdmVOb2RlXCIsYS5yZW1vdmVOb2RlKTthLmIoXCJ1dGlscy5kb21Ob2RlRGlzcG9zYWxcIixhLmEuRyk7YS5iKFwidXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFja1wiLGEuYS5HLnFhKTthLmIoXCJ1dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrXCIsYS5hLkcudGMpOyhmdW5jdGlvbigpe3ZhciBiPVswLFwiXCIsXCJcIl0sYz1bMSxcIjx0YWJsZT5cIixcIjwvdGFibGU+XCJdLGQ9WzMsXCI8dGFibGU+PHRib2R5Pjx0cj5cIixcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiXSxlPVsxLFwiPHNlbGVjdCBtdWx0aXBsZT0nbXVsdGlwbGUnPlwiLFwiPC9zZWxlY3Q+XCJdLGY9e3RoZWFkOmMsdGJvZHk6Yyx0Zm9vdDpjLHRyOlsyLFwiPHRhYmxlPjx0Ym9keT5cIixcIjwvdGJvZHk+PC90YWJsZT5cIl0sdGQ6ZCx0aDpkLG9wdGlvbjplLG9wdGdyb3VwOmV9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc9OD49YS5hLkM7YS5hLm5hPWZ1bmN0aW9uKGMsZCl7dmFyIGU7aWYodSlpZih1LnBhcnNlSFRNTCllPXUucGFyc2VIVE1MKGMsZCl8fFtdO2Vsc2V7aWYoKGU9dS5jbGVhbihbY10sZCkpJiZlWzBdKXtmb3IodmFyIGs9ZVswXTtrLnBhcmVudE5vZGUmJjExIT09ay5wYXJlbnROb2RlLm5vZGVUeXBlOylrPWsucGFyZW50Tm9kZTtrLnBhcmVudE5vZGUmJmsucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChrKX19ZWxzZXsoZT1kKXx8KGU9dCk7dmFyIGs9ZS5wYXJlbnRXaW5kb3d8fGUuZGVmYXVsdFZpZXd8fHgscj1hLmEuY2IoYykudG9Mb3dlckNhc2UoKSxxPWUuY3JlYXRlRWxlbWVudChcImRpdlwiKSxwO3A9KHI9ci5tYXRjaCgvXjwoW2Etel0rKVsgPl0vKSkmJmZbclsxXV18fGI7cj1wWzBdO3A9XCJpZ25vcmVkPGRpdj5cIitwWzFdK2MrcFsyXStcIjwvZGl2PlwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGsuaW5uZXJTaGl2P3EuYXBwZW5kQ2hpbGQoay5pbm5lclNoaXYocCkpOihnJiZlLmFwcGVuZENoaWxkKHEpLFxyXG4gICAgICAgIHEuaW5uZXJIVE1MPXAsZyYmcS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHEpKTtmb3IoO3ItLTspcT1xLmxhc3RDaGlsZDtlPWEuYS5XKHEubGFzdENoaWxkLmNoaWxkTm9kZXMpfXJldHVybiBlfTthLmEuRWI9ZnVuY3Rpb24oYixjKXthLmEucmIoYik7Yz1hLmEuYyhjKTtpZihudWxsIT09YyYmYyE9PW4paWYoXCJzdHJpbmdcIiE9dHlwZW9mIGMmJihjPWMudG9TdHJpbmcoKSksdSl1KGIpLmh0bWwoYyk7ZWxzZSBmb3IodmFyIGQ9YS5hLm5hKGMsYi5vd25lckRvY3VtZW50KSxlPTA7ZTxkLmxlbmd0aDtlKyspYi5hcHBlbmRDaGlsZChkW2VdKX19KSgpO2EuYihcInV0aWxzLnBhcnNlSHRtbEZyYWdtZW50XCIsYS5hLm5hKTthLmIoXCJ1dGlscy5zZXRIdG1sXCIsYS5hLkViKTthLk49ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGMsZSl7aWYoYylpZig4PT1jLm5vZGVUeXBlKXt2YXIgZj1hLk4ucGMoYy5ub2RlVmFsdWUpO251bGwhPWYmJmUucHVzaCh7UWM6YyxoZDpmfSl9ZWxzZSBpZigxPT1jLm5vZGVUeXBlKWZvcih2YXIgZj1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLGc9Yy5jaGlsZE5vZGVzLGg9Zy5sZW5ndGg7ZjxoO2YrKyliKGdbZl0sZSl9dmFyIGM9e307cmV0dXJue3liOmZ1bmN0aW9uKGEpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGEpdGhyb3cgRXJyb3IoXCJZb3UgY2FuIG9ubHkgcGFzcyBhIGZ1bmN0aW9uIHRvIGtvLm1lbW9pemF0aW9uLm1lbW9pemUoKVwiKTt2YXIgYj0oNDI5NDk2NzI5NiooMStNYXRoLnJhbmRvbSgpKXwwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpKyg0Mjk0OTY3Mjk2KigxK01hdGgucmFuZG9tKCkpfDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7Y1tiXT1hO3JldHVyblwiXFx4M2MhLS1ba29fbWVtbzpcIitiK1wiXS0tXFx4M2VcIn0sQmM6ZnVuY3Rpb24oYSxiKXt2YXIgZj1jW2FdO2lmKGY9PT1uKXRocm93IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhbnkgbWVtbyB3aXRoIElEIFwiK2ErXCIuIFBlcmhhcHMgaXQncyBhbHJlYWR5IGJlZW4gdW5tZW1vaXplZC5cIik7dHJ5e3JldHVybiBmLmFwcGx5KG51bGwsYnx8W10pLFxyXG4gICAgICAgICEwfWZpbmFsbHl7ZGVsZXRlIGNbYV19fSxDYzpmdW5jdGlvbihjLGUpe3ZhciBmPVtdO2IoYyxmKTtmb3IodmFyIGc9MCxoPWYubGVuZ3RoO2c8aDtnKyspe3ZhciBsPWZbZ10uUWMsbT1bbF07ZSYmYS5hLnRhKG0sZSk7YS5OLkJjKGZbZ10uaGQsbSk7bC5ub2RlVmFsdWU9XCJcIjtsLnBhcmVudE5vZGUmJmwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChsKX19LHBjOmZ1bmN0aW9uKGEpe3JldHVybihhPWEubWF0Y2goL15cXFtrb19tZW1vXFw6KC4qPylcXF0kLykpP2FbMV06bnVsbH19fSgpO2EuYihcIm1lbW9pemF0aW9uXCIsYS5OKTthLmIoXCJtZW1vaXphdGlvbi5tZW1vaXplXCIsYS5OLnliKTthLmIoXCJtZW1vaXphdGlvbi51bm1lbW9pemVcIixhLk4uQmMpO2EuYihcIm1lbW9pemF0aW9uLnBhcnNlTWVtb1RleHRcIixhLk4ucGMpO2EuYihcIm1lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50c1wiLGEuTi5DYyk7YS5aPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYigpe2lmKGUpZm9yKHZhciBiPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSxjPTAsbTtnPGU7KWlmKG09ZFtnKytdKXtpZihnPmIpe2lmKDVFMzw9KytjKXtnPWU7YS5hLmRjKEVycm9yKFwiJ1RvbyBtdWNoIHJlY3Vyc2lvbicgYWZ0ZXIgcHJvY2Vzc2luZyBcIitjK1wiIHRhc2sgZ3JvdXBzLlwiKSk7YnJlYWt9Yj1lfXRyeXttKCl9Y2F0Y2goayl7YS5hLmRjKGspfX19ZnVuY3Rpb24gYygpe2IoKTtnPWU9ZC5sZW5ndGg9MH12YXIgZD1bXSxlPTAsZj0xLGc9MDtyZXR1cm57c2NoZWR1bGVyOnguTXV0YXRpb25PYnNlcnZlcj9mdW5jdGlvbihhKXt2YXIgYj10LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7KG5ldyBNdXRhdGlvbk9ic2VydmVyKGEpKS5vYnNlcnZlKGIse2F0dHJpYnV0ZXM6ITB9KTtyZXR1cm4gZnVuY3Rpb24oKXtiLmNsYXNzTGlzdC50b2dnbGUoXCJmb29cIil9fShjKTp0JiZcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiaW4gdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpP2Z1bmN0aW9uKGEpe3ZhciBiPXQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtiLm9ucmVhZHlzdGF0ZWNoYW5nZT1cclxuICAgICAgICBmdW5jdGlvbigpe2Iub25yZWFkeXN0YXRlY2hhbmdlPW51bGw7dC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoYik7Yj1udWxsO2EoKX07dC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoYil9OmZ1bmN0aW9uKGEpe3NldFRpbWVvdXQoYSwwKX0sWmE6ZnVuY3Rpb24oYil7ZXx8YS5aLnNjaGVkdWxlcihjKTtkW2UrK109YjtyZXR1cm4gZisrfSxjYW5jZWw6ZnVuY3Rpb24oYSl7YS09Zi1lO2E+PWcmJmE8ZSYmKGRbYV09bnVsbCl9LHJlc2V0Rm9yVGVzdGluZzpmdW5jdGlvbigpe3ZhciBhPWUtZztnPWU9ZC5sZW5ndGg9MDtyZXR1cm4gYX0scmQ6Yn19KCk7YS5iKFwidGFza3NcIixhLlopO2EuYihcInRhc2tzLnNjaGVkdWxlXCIsYS5aLlphKTthLmIoXCJ0YXNrcy5ydW5FYXJseVwiLGEuWi5yZCk7YS5BYT17dGhyb3R0bGU6ZnVuY3Rpb24oYixjKXtiLnRocm90dGxlRXZhbHVhdGlvbj1jO3ZhciBkPW51bGw7cmV0dXJuIGEuQih7cmVhZDpiLHdyaXRlOmZ1bmN0aW9uKGUpe2NsZWFyVGltZW91dChkKTtcclxuICAgICAgICBkPWEuYS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YihlKX0sYyl9fSl9LHJhdGVMaW1pdDpmdW5jdGlvbihhLGMpe3ZhciBkLGUsZjtcIm51bWJlclwiPT10eXBlb2YgYz9kPWM6KGQ9Yy50aW1lb3V0LGU9Yy5tZXRob2QpO2EuZ2I9ITE7Zj1cIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiPT1lP1Q6UzthLldhKGZ1bmN0aW9uKGEpe3JldHVybiBmKGEsZCl9KX0sZGVmZXJyZWQ6ZnVuY3Rpb24oYixjKXtpZighMCE9PWMpdGhyb3cgRXJyb3IoXCJUaGUgJ2RlZmVycmVkJyBleHRlbmRlciBvbmx5IGFjY2VwdHMgdGhlIHZhbHVlICd0cnVlJywgYmVjYXVzZSBpdCBpcyBub3Qgc3VwcG9ydGVkIHRvIHR1cm4gZGVmZXJyYWwgb2ZmIG9uY2UgZW5hYmxlZC5cIik7Yi5nYnx8KGIuZ2I9ITAsYi5XYShmdW5jdGlvbihjKXt2YXIgZSxmPSExO3JldHVybiBmdW5jdGlvbigpe2lmKCFmKXthLlouY2FuY2VsKGUpO2U9YS5aLlphKGMpO3RyeXtmPSEwLGIubm90aWZ5U3Vic2NyaWJlcnMobixcImRpcnR5XCIpfWZpbmFsbHl7Zj1cclxuICAgICAgICAhMX19fX0pKX0sbm90aWZ5OmZ1bmN0aW9uKGEsYyl7YS5lcXVhbGl0eUNvbXBhcmVyPVwiYWx3YXlzXCI9PWM/bnVsbDpKfX07dmFyIFI9e3VuZGVmaW5lZDoxLFwiYm9vbGVhblwiOjEsbnVtYmVyOjEsc3RyaW5nOjF9O2EuYihcImV4dGVuZGVyc1wiLGEuQWEpO2EuemM9ZnVuY3Rpb24oYixjLGQpe3RoaXMuJD1iO3RoaXMuamI9Yzt0aGlzLlBjPWQ7dGhpcy5UPSExO2EuSCh0aGlzLFwiZGlzcG9zZVwiLHRoaXMuayl9O2EuemMucHJvdG90eXBlLms9ZnVuY3Rpb24oKXt0aGlzLlQ9ITA7dGhpcy5QYygpfTthLks9ZnVuY3Rpb24oKXthLmEuYWIodGhpcyxEKTtELnViKHRoaXMpfTt2YXIgRT1cImNoYW5nZVwiLEQ9e3ViOmZ1bmN0aW9uKGEpe2EuRj17Y2hhbmdlOltdfTthLlFiPTF9LFk6ZnVuY3Rpb24oYixjLGQpe3ZhciBlPXRoaXM7ZD1kfHxFO3ZhciBmPW5ldyBhLnpjKGUsYz9iLmJpbmQoYyk6YixmdW5jdGlvbigpe2EuYS5OYShlLkZbZF0sZik7ZS5LYSYmZS5LYShkKX0pO2UudWEmJmUudWEoZCk7XHJcbiAgICAgICAgZS5GW2RdfHwoZS5GW2RdPVtdKTtlLkZbZF0ucHVzaChmKTtyZXR1cm4gZn0sbm90aWZ5U3Vic2NyaWJlcnM6ZnVuY3Rpb24oYixjKXtjPWN8fEU7Yz09PUUmJnRoaXMuS2IoKTtpZih0aGlzLlJhKGMpKXt2YXIgZD1jPT09RSYmdGhpcy5GY3x8dGhpcy5GW2NdLnNsaWNlKDApO3RyeXthLmwuWGIoKTtmb3IodmFyIGU9MCxmO2Y9ZFtlXTsrK2UpZi5UfHxmLmpiKGIpfWZpbmFsbHl7YS5sLmVuZCgpfX19LFBhOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuUWJ9LFpjOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlBhKCkhPT1hfSxLYjpmdW5jdGlvbigpeysrdGhpcy5RYn0sV2E6ZnVuY3Rpb24oYil7dmFyIGM9dGhpcyxkPWEuSShjKSxlLGYsZyxoO2MuSmF8fChjLkphPWMubm90aWZ5U3Vic2NyaWJlcnMsYy5ub3RpZnlTdWJzY3JpYmVycz1VKTt2YXIgbD1iKGZ1bmN0aW9uKCl7Yy5IYT0hMTtkJiZoPT09YyYmKGg9Yy5NYj9jLk1iKCk6YygpKTt2YXIgYT1mfHxjLlVhKGcsaCk7Zj1lPSExO1xyXG4gICAgICAgIGEmJmMuSmEoZz1oKX0pO2MuUGI9ZnVuY3Rpb24oYSl7Yy5GYz1jLkZbRV0uc2xpY2UoMCk7Yy5IYT1lPSEwO2g9YTtsKCl9O2MuT2I9ZnVuY3Rpb24oYSl7ZXx8KGc9YSxjLkphKGEsXCJiZWZvcmVDaGFuZ2VcIikpfTtjLkhjPWZ1bmN0aW9uKCl7Yy5VYShnLGMucCghMCkpJiYoZj0hMCl9fSxSYTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5GW2FdJiZ0aGlzLkZbYV0ubGVuZ3RofSxYYzpmdW5jdGlvbihiKXtpZihiKXJldHVybiB0aGlzLkZbYl0mJnRoaXMuRltiXS5sZW5ndGh8fDA7dmFyIGM9MDthLmEuRCh0aGlzLkYsZnVuY3Rpb24oYSxiKXtcImRpcnR5XCIhPT1hJiYoYys9Yi5sZW5ndGgpfSk7cmV0dXJuIGN9LFVhOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIXRoaXMuZXF1YWxpdHlDb21wYXJlcnx8IXRoaXMuZXF1YWxpdHlDb21wYXJlcihhLGMpfSxleHRlbmQ6ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztiJiZhLmEuRChiLGZ1bmN0aW9uKGIsZSl7dmFyIGY9YS5BYVtiXTtcImZ1bmN0aW9uXCI9PVxyXG4gICAgdHlwZW9mIGYmJihjPWYoYyxlKXx8Yyl9KTtyZXR1cm4gY319O2EuSChELFwic3Vic2NyaWJlXCIsRC5ZKTthLkgoRCxcImV4dGVuZFwiLEQuZXh0ZW5kKTthLkgoRCxcImdldFN1YnNjcmlwdGlvbnNDb3VudFwiLEQuWGMpO2EuYS5sYSYmYS5hLiRhKEQsRnVuY3Rpb24ucHJvdG90eXBlKTthLksuZm49RDthLmxjPWZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT1hJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLlkmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEubm90aWZ5U3Vic2NyaWJlcnN9O2EuYihcInN1YnNjcmliYWJsZVwiLGEuSyk7YS5iKFwiaXNTdWJzY3JpYmFibGVcIixhLmxjKTthLnhhPWEubD1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSl7ZC5wdXNoKGUpO2U9YX1mdW5jdGlvbiBjKCl7ZT1kLnBvcCgpfXZhciBkPVtdLGUsZj0wO3JldHVybntYYjpiLGVuZDpjLHNjOmZ1bmN0aW9uKGIpe2lmKGUpe2lmKCFhLmxjKGIpKXRocm93IEVycm9yKFwiT25seSBzdWJzY3JpYmFibGUgdGhpbmdzIGNhbiBhY3QgYXMgZGVwZW5kZW5jaWVzXCIpO1xyXG4gICAgICAgIGUuamIuY2FsbChlLkxjLGIsYi5HY3x8KGIuR2M9KytmKSl9fSx3OmZ1bmN0aW9uKGEsZCxlKXt0cnl7cmV0dXJuIGIoKSxhLmFwcGx5KGQsZXx8W10pfWZpbmFsbHl7YygpfX0sQ2E6ZnVuY3Rpb24oKXtpZihlKXJldHVybiBlLm0uQ2EoKX0sVmE6ZnVuY3Rpb24oKXtpZihlKXJldHVybiBlLlZhfX19KCk7YS5iKFwiY29tcHV0ZWRDb250ZXh0XCIsYS54YSk7YS5iKFwiY29tcHV0ZWRDb250ZXh0LmdldERlcGVuZGVuY2llc0NvdW50XCIsYS54YS5DYSk7YS5iKFwiY29tcHV0ZWRDb250ZXh0LmlzSW5pdGlhbFwiLGEueGEuVmEpO2EuYihcImlnbm9yZURlcGVuZGVuY2llc1wiLGEud2Q9YS5sLncpO3ZhciBGPWEuYS5iYyhcIl9sYXRlc3RWYWx1ZVwiKTthLk89ZnVuY3Rpb24oYil7ZnVuY3Rpb24gYygpe2lmKDA8YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gYy5VYShjW0ZdLGFyZ3VtZW50c1swXSkmJihjLmlhKCksY1tGXT1hcmd1bWVudHNbMF0sYy5oYSgpKSx0aGlzO2EubC5zYyhjKTtyZXR1cm4gY1tGXX1cclxuICAgICAgICBjW0ZdPWI7YS5hLmxhfHxhLmEuZXh0ZW5kKGMsYS5LLmZuKTthLksuZm4udWIoYyk7YS5hLmFiKGMsQik7YS5vcHRpb25zLmRlZmVyVXBkYXRlcyYmYS5BYS5kZWZlcnJlZChjLCEwKTtyZXR1cm4gY307dmFyIEI9e2VxdWFsaXR5Q29tcGFyZXI6SixwOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbRl19LGhhOmZ1bmN0aW9uKCl7dGhpcy5ub3RpZnlTdWJzY3JpYmVycyh0aGlzW0ZdKX0saWE6ZnVuY3Rpb24oKXt0aGlzLm5vdGlmeVN1YnNjcmliZXJzKHRoaXNbRl0sXCJiZWZvcmVDaGFuZ2VcIil9fTthLmEubGEmJmEuYS4kYShCLGEuSy5mbik7dmFyIEk9YS5PLm1kPVwiX19rb19wcm90b19fXCI7QltJXT1hLk87YS5RYT1mdW5jdGlvbihiLGMpe3JldHVybiBudWxsPT09Ynx8Yj09PW58fGJbSV09PT1uPyExOmJbSV09PT1jPyEwOmEuUWEoYltJXSxjKX07YS5JPWZ1bmN0aW9uKGIpe3JldHVybiBhLlFhKGIsYS5PKX07YS5EYT1mdW5jdGlvbihiKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBiJiZcclxuICAgIGJbSV09PT1hLk98fFwiZnVuY3Rpb25cIj09dHlwZW9mIGImJmJbSV09PT1hLkImJmIuJGM/ITA6ITF9O2EuYihcIm9ic2VydmFibGVcIixhLk8pO2EuYihcImlzT2JzZXJ2YWJsZVwiLGEuSSk7YS5iKFwiaXNXcml0ZWFibGVPYnNlcnZhYmxlXCIsYS5EYSk7YS5iKFwiaXNXcml0YWJsZU9ic2VydmFibGVcIixhLkRhKTthLmIoXCJvYnNlcnZhYmxlLmZuXCIsQik7YS5IKEIsXCJwZWVrXCIsQi5wKTthLkgoQixcInZhbHVlSGFzTXV0YXRlZFwiLEIuaGEpO2EuSChCLFwidmFsdWVXaWxsTXV0YXRlXCIsQi5pYSk7YS5tYT1mdW5jdGlvbihiKXtiPWJ8fFtdO2lmKFwib2JqZWN0XCIhPXR5cGVvZiBifHwhKFwibGVuZ3RoXCJpbiBiKSl0aHJvdyBFcnJvcihcIlRoZSBhcmd1bWVudCBwYXNzZWQgd2hlbiBpbml0aWFsaXppbmcgYW4gb2JzZXJ2YWJsZSBhcnJheSBtdXN0IGJlIGFuIGFycmF5LCBvciBudWxsLCBvciB1bmRlZmluZWQuXCIpO2I9YS5PKGIpO2EuYS5hYihiLGEubWEuZm4pO3JldHVybiBiLmV4dGVuZCh7dHJhY2tBcnJheUNoYW5nZXM6ITB9KX07XHJcbiAgICBhLm1hLmZuPXtyZW1vdmU6ZnVuY3Rpb24oYil7Zm9yKHZhciBjPXRoaXMucCgpLGQ9W10sZT1cImZ1bmN0aW9uXCIhPXR5cGVvZiBifHxhLkkoYik/ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1ifTpiLGY9MDtmPGMubGVuZ3RoO2YrKyl7dmFyIGc9Y1tmXTtlKGcpJiYoMD09PWQubGVuZ3RoJiZ0aGlzLmlhKCksZC5wdXNoKGcpLGMuc3BsaWNlKGYsMSksZi0tKX1kLmxlbmd0aCYmdGhpcy5oYSgpO3JldHVybiBkfSxyZW1vdmVBbGw6ZnVuY3Rpb24oYil7aWYoYj09PW4pe3ZhciBjPXRoaXMucCgpLGQ9Yy5zbGljZSgwKTt0aGlzLmlhKCk7Yy5zcGxpY2UoMCxjLmxlbmd0aCk7dGhpcy5oYSgpO3JldHVybiBkfXJldHVybiBiP3RoaXMucmVtb3ZlKGZ1bmN0aW9uKGMpe3JldHVybiAwPD1hLmEubyhiLGMpfSk6W119LGRlc3Ryb3k6ZnVuY3Rpb24oYil7dmFyIGM9dGhpcy5wKCksZD1cImZ1bmN0aW9uXCIhPXR5cGVvZiBifHxhLkkoYik/ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1ifTpiO3RoaXMuaWEoKTtcclxuICAgICAgICBmb3IodmFyIGU9Yy5sZW5ndGgtMTswPD1lO2UtLSlkKGNbZV0pJiYoY1tlXS5fZGVzdHJveT0hMCk7dGhpcy5oYSgpfSxkZXN0cm95QWxsOmZ1bmN0aW9uKGIpe3JldHVybiBiPT09bj90aGlzLmRlc3Ryb3koZnVuY3Rpb24oKXtyZXR1cm4hMH0pOmI/dGhpcy5kZXN0cm95KGZ1bmN0aW9uKGMpe3JldHVybiAwPD1hLmEubyhiLGMpfSk6W119LGluZGV4T2Y6ZnVuY3Rpb24oYil7dmFyIGM9dGhpcygpO3JldHVybiBhLmEubyhjLGIpfSxyZXBsYWNlOmZ1bmN0aW9uKGEsYyl7dmFyIGQ9dGhpcy5pbmRleE9mKGEpOzA8PWQmJih0aGlzLmlhKCksdGhpcy5wKClbZF09Yyx0aGlzLmhhKCkpfX07YS5hLmxhJiZhLmEuJGEoYS5tYS5mbixhLk8uZm4pO2EuYS5yKFwicG9wIHB1c2ggcmV2ZXJzZSBzaGlmdCBzb3J0IHNwbGljZSB1bnNoaWZ0XCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGIpe2EubWEuZm5bYl09ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnAoKTt0aGlzLmlhKCk7dGhpcy5ZYihhLGIsYXJndW1lbnRzKTtcclxuICAgICAgICB2YXIgZD1hW2JdLmFwcGx5KGEsYXJndW1lbnRzKTt0aGlzLmhhKCk7cmV0dXJuIGQ9PT1hP3RoaXM6ZH19KTthLmEucihbXCJzbGljZVwiXSxmdW5jdGlvbihiKXthLm1hLmZuW2JdPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcygpO3JldHVybiBhW2JdLmFwcGx5KGEsYXJndW1lbnRzKX19KTthLmIoXCJvYnNlcnZhYmxlQXJyYXlcIixhLm1hKTthLkFhLnRyYWNrQXJyYXlDaGFuZ2VzPWZ1bmN0aW9uKGIsYyl7ZnVuY3Rpb24gZCgpe2lmKCFlKXtlPSEwO2w9Yi5ub3RpZnlTdWJzY3JpYmVycztiLm5vdGlmeVN1YnNjcmliZXJzPWZ1bmN0aW9uKGEsYil7YiYmYiE9PUV8fCsraDtyZXR1cm4gbC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O3ZhciBjPVtdLmNvbmNhdChiLnAoKXx8W10pO2Y9bnVsbDtnPWIuWShmdW5jdGlvbihkKXtkPVtdLmNvbmNhdChkfHxbXSk7aWYoYi5SYShcImFycmF5Q2hhbmdlXCIpKXt2YXIgZTtpZighZnx8MTxoKWY9YS5hLmxiKGMsZCxiLmtiKTtlPWZ9Yz1kO2Y9bnVsbDtoPTA7XHJcbiAgICAgICAgZSYmZS5sZW5ndGgmJmIubm90aWZ5U3Vic2NyaWJlcnMoZSxcImFycmF5Q2hhbmdlXCIpfSl9fWIua2I9e307YyYmXCJvYmplY3RcIj09dHlwZW9mIGMmJmEuYS5leHRlbmQoYi5rYixjKTtiLmtiLnNwYXJzZT0hMDtpZighYi5ZYil7dmFyIGU9ITEsZj1udWxsLGcsaD0wLGwsbT1iLnVhLGs9Yi5LYTtiLnVhPWZ1bmN0aW9uKGEpe20mJm0uY2FsbChiLGEpO1wiYXJyYXlDaGFuZ2VcIj09PWEmJmQoKX07Yi5LYT1mdW5jdGlvbihhKXtrJiZrLmNhbGwoYixhKTtcImFycmF5Q2hhbmdlXCIhPT1hfHxiLlJhKFwiYXJyYXlDaGFuZ2VcIil8fChsJiYoYi5ub3RpZnlTdWJzY3JpYmVycz1sLGw9biksZy5rKCksZT0hMSl9O2IuWWI9ZnVuY3Rpb24oYixjLGQpe2Z1bmN0aW9uIGsoYSxiLGMpe3JldHVybiBtW20ubGVuZ3RoXT17c3RhdHVzOmEsdmFsdWU6YixpbmRleDpjfX1pZihlJiYhaCl7dmFyIG09W10sbD1iLmxlbmd0aCxnPWQubGVuZ3RoLEc9MDtzd2l0Y2goYyl7Y2FzZSBcInB1c2hcIjpHPWw7Y2FzZSBcInVuc2hpZnRcIjpmb3IoYz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDA7YzxnO2MrKylrKFwiYWRkZWRcIixkW2NdLEcrYyk7YnJlYWs7Y2FzZSBcInBvcFwiOkc9bC0xO2Nhc2UgXCJzaGlmdFwiOmwmJmsoXCJkZWxldGVkXCIsYltHXSxHKTticmVhaztjYXNlIFwic3BsaWNlXCI6Yz1NYXRoLm1pbihNYXRoLm1heCgwLDA+ZFswXT9sK2RbMF06ZFswXSksbCk7Zm9yKHZhciBsPTE9PT1nP2w6TWF0aC5taW4oYysoZFsxXXx8MCksbCksZz1jK2ctMixHPU1hdGgubWF4KGwsZyksbj1bXSxzPVtdLHc9MjtjPEc7KytjLCsrdyljPGwmJnMucHVzaChrKFwiZGVsZXRlZFwiLGJbY10sYykpLGM8ZyYmbi5wdXNoKGsoXCJhZGRlZFwiLGRbd10sYykpO2EuYS5oYyhzLG4pO2JyZWFrO2RlZmF1bHQ6cmV0dXJufWY9bX19fX07dmFyIHM9YS5hLmJjKFwiX3N0YXRlXCIpO2EubT1hLkI9ZnVuY3Rpb24oYixjLGQpe2Z1bmN0aW9uIGUoKXtpZigwPGFyZ3VtZW50cy5sZW5ndGgpe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBmKWYuYXBwbHkoZy5zYixhcmd1bWVudHMpO2Vsc2UgdGhyb3cgRXJyb3IoXCJDYW5ub3Qgd3JpdGUgYSB2YWx1ZSB0byBhIGtvLmNvbXB1dGVkIHVubGVzcyB5b3Ugc3BlY2lmeSBhICd3cml0ZScgb3B0aW9uLiBJZiB5b3Ugd2lzaCB0byByZWFkIHRoZSBjdXJyZW50IHZhbHVlLCBkb24ndCBwYXNzIGFueSBwYXJhbWV0ZXJzLlwiKTtcclxuICAgICAgICByZXR1cm4gdGhpc31hLmwuc2MoZSk7KGcuVnx8Zy50JiZlLlNhKCkpJiZlLlUoKTtyZXR1cm4gZy5NfVwib2JqZWN0XCI9PT10eXBlb2YgYj9kPWI6KGQ9ZHx8e30sYiYmKGQucmVhZD1iKSk7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZC5yZWFkKXRocm93IEVycm9yKFwiUGFzcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGtvLmNvbXB1dGVkXCIpO3ZhciBmPWQud3JpdGUsZz17TTpuLGRhOiEwLFY6ITAsVGE6ITEsSGI6ITEsVDohMSxZYTohMSx0OiExLG9kOmQucmVhZCxzYjpjfHxkLm93bmVyLGk6ZC5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWR8fGQuaXx8bnVsbCx5YTpkLmRpc3Bvc2VXaGVufHxkLnlhLHBiOm51bGwsczp7fSxMOjAsZmM6bnVsbH07ZVtzXT1nO2UuJGM9XCJmdW5jdGlvblwiPT09dHlwZW9mIGY7YS5hLmxhfHxhLmEuZXh0ZW5kKGUsYS5LLmZuKTthLksuZm4udWIoZSk7YS5hLmFiKGUseik7ZC5wdXJlPyhnLllhPSEwLGcudD0hMCxhLmEuZXh0ZW5kKGUsXHJcbiAgICAgICAgWSkpOmQuZGVmZXJFdmFsdWF0aW9uJiZhLmEuZXh0ZW5kKGUsWik7YS5vcHRpb25zLmRlZmVyVXBkYXRlcyYmYS5BYS5kZWZlcnJlZChlLCEwKTtnLmkmJihnLkhiPSEwLGcuaS5ub2RlVHlwZXx8KGcuaT1udWxsKSk7Zy50fHxkLmRlZmVyRXZhbHVhdGlvbnx8ZS5VKCk7Zy5pJiZlLmNhKCkmJmEuYS5HLnFhKGcuaSxnLnBiPWZ1bmN0aW9uKCl7ZS5rKCl9KTtyZXR1cm4gZX07dmFyIHo9e2VxdWFsaXR5Q29tcGFyZXI6SixDYTpmdW5jdGlvbigpe3JldHVybiB0aGlzW3NdLkx9LFNiOmZ1bmN0aW9uKGEsYyxkKXtpZih0aGlzW3NdLllhJiZjPT09dGhpcyl0aHJvdyBFcnJvcihcIkEgJ3B1cmUnIGNvbXB1dGVkIG11c3Qgbm90IGJlIGNhbGxlZCByZWN1cnNpdmVseVwiKTt0aGlzW3NdLnNbYV09ZDtkLklhPXRoaXNbc10uTCsrO2QucGE9Yy5QYSgpfSxTYTpmdW5jdGlvbigpe3ZhciBhLGMsZD10aGlzW3NdLnM7Zm9yKGEgaW4gZClpZihkLmhhc093blByb3BlcnR5KGEpJiYoYz1kW2FdLHRoaXMub2EmJlxyXG4gICAgICAgIGMuJC5IYXx8Yy4kLlpjKGMucGEpKSlyZXR1cm4hMH0sZ2Q6ZnVuY3Rpb24oKXt0aGlzLm9hJiYhdGhpc1tzXS5UYSYmdGhpcy5vYSghMSl9LGNhOmZ1bmN0aW9uKCl7dmFyIGE9dGhpc1tzXTtyZXR1cm4gYS5WfHwwPGEuTH0scWQ6ZnVuY3Rpb24oKXt0aGlzLkhhP3RoaXNbc10uViYmKHRoaXNbc10uZGE9ITApOnRoaXMuZWMoKX0seWM6ZnVuY3Rpb24oYSl7aWYoYS5nYiYmIXRoaXNbc10uaSl7dmFyIGM9YS5ZKHRoaXMuZ2QsdGhpcyxcImRpcnR5XCIpLGQ9YS5ZKHRoaXMucWQsdGhpcyk7cmV0dXJueyQ6YSxrOmZ1bmN0aW9uKCl7Yy5rKCk7ZC5rKCl9fX1yZXR1cm4gYS5ZKHRoaXMuZWMsdGhpcyl9LGVjOmZ1bmN0aW9uKCl7dmFyIGI9dGhpcyxjPWIudGhyb3R0bGVFdmFsdWF0aW9uO2MmJjA8PWM/KGNsZWFyVGltZW91dCh0aGlzW3NdLmZjKSx0aGlzW3NdLmZjPWEuYS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5VKCEwKX0sYykpOmIub2E/Yi5vYSghMCk6Yi5VKCEwKX0sVTpmdW5jdGlvbihiKXt2YXIgYz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tzXSxkPWMueWEsZT0hMTtpZighYy5UYSYmIWMuVCl7aWYoYy5pJiYhYS5hLnFiKGMuaSl8fGQmJmQoKSl7aWYoIWMuSGIpe3RoaXMuaygpO3JldHVybn19ZWxzZSBjLkhiPSExO2MuVGE9ITA7dHJ5e2U9dGhpcy5WYyhiKX1maW5hbGx5e2MuVGE9ITF9Yy5MfHx0aGlzLmsoKTtyZXR1cm4gZX19LFZjOmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXNbc10sZD0hMSxlPWMuWWE/bjohYy5MLGY9e01jOnRoaXMsT2E6Yy5zLG9iOmMuTH07YS5sLlhiKHtMYzpmLGpiOlcsbTp0aGlzLFZhOmV9KTtjLnM9e307Yy5MPTA7Zj10aGlzLlVjKGMsZik7dGhpcy5VYShjLk0sZikmJihjLnR8fHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoYy5NLFwiYmVmb3JlQ2hhbmdlXCIpLGMuTT1mLGMudD90aGlzLktiKCk6YiYmdGhpcy5ub3RpZnlTdWJzY3JpYmVycyhjLk0pLGQ9ITApO2UmJnRoaXMubm90aWZ5U3Vic2NyaWJlcnMoYy5NLFwiYXdha2VcIik7cmV0dXJuIGR9LFVjOmZ1bmN0aW9uKGIsYyl7dHJ5e3ZhciBkPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIub2Q7cmV0dXJuIGIuc2I/ZC5jYWxsKGIuc2IpOmQoKX1maW5hbGx5e2EubC5lbmQoKSxjLm9iJiYhYi50JiZhLmEuRChjLk9hLFYpLGIuZGE9Yi5WPSExfX0scDpmdW5jdGlvbihhKXt2YXIgYz10aGlzW3NdOyhjLlYmJihhfHwhYy5MKXx8Yy50JiZ0aGlzLlNhKCkpJiZ0aGlzLlUoKTtyZXR1cm4gYy5NfSxXYTpmdW5jdGlvbihiKXthLksuZm4uV2EuY2FsbCh0aGlzLGIpO3RoaXMuTWI9ZnVuY3Rpb24oKXt0aGlzW3NdLmRhP3RoaXMuVSgpOnRoaXNbc10uVj0hMTtyZXR1cm4gdGhpc1tzXS5NfTt0aGlzLm9hPWZ1bmN0aW9uKGEpe3RoaXMuT2IodGhpc1tzXS5NKTt0aGlzW3NdLlY9ITA7YSYmKHRoaXNbc10uZGE9ITApO3RoaXMuUGIodGhpcyl9fSxrOmZ1bmN0aW9uKCl7dmFyIGI9dGhpc1tzXTshYi50JiZiLnMmJmEuYS5EKGIucyxmdW5jdGlvbihhLGIpe2IuayYmYi5rKCl9KTtiLmkmJmIucGImJmEuYS5HLnRjKGIuaSxiLnBiKTtiLnM9bnVsbDtiLkw9MDtiLlQ9ITA7Yi5kYT1cclxuICAgICAgICAhMTtiLlY9ITE7Yi50PSExO2IuaT1udWxsfX0sWT17dWE6ZnVuY3Rpb24oYil7dmFyIGM9dGhpcyxkPWNbc107aWYoIWQuVCYmZC50JiZcImNoYW5nZVwiPT1iKXtkLnQ9ITE7aWYoZC5kYXx8Yy5TYSgpKWQucz1udWxsLGQuTD0wLGMuVSgpJiZjLktiKCk7ZWxzZXt2YXIgZT1bXTthLmEuRChkLnMsZnVuY3Rpb24oYSxiKXtlW2IuSWFdPWF9KTthLmEucihlLGZ1bmN0aW9uKGEsYil7dmFyIGU9ZC5zW2FdLGw9Yy55YyhlLiQpO2wuSWE9YjtsLnBhPWUucGE7ZC5zW2FdPWx9KX1kLlR8fGMubm90aWZ5U3Vic2NyaWJlcnMoZC5NLFwiYXdha2VcIil9fSxLYTpmdW5jdGlvbihiKXt2YXIgYz10aGlzW3NdO2MuVHx8XCJjaGFuZ2VcIiE9Ynx8dGhpcy5SYShcImNoYW5nZVwiKXx8KGEuYS5EKGMucyxmdW5jdGlvbihhLGIpe2IuayYmKGMuc1thXT17JDpiLiQsSWE6Yi5JYSxwYTpiLnBhfSxiLmsoKSl9KSxjLnQ9ITAsdGhpcy5ub3RpZnlTdWJzY3JpYmVycyhuLFwiYXNsZWVwXCIpKX0sUGE6ZnVuY3Rpb24oKXt2YXIgYj1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tzXTtiLnQmJihiLmRhfHx0aGlzLlNhKCkpJiZ0aGlzLlUoKTtyZXR1cm4gYS5LLmZuLlBhLmNhbGwodGhpcyl9fSxaPXt1YTpmdW5jdGlvbihhKXtcImNoYW5nZVwiIT1hJiZcImJlZm9yZUNoYW5nZVwiIT1hfHx0aGlzLnAoKX19O2EuYS5sYSYmYS5hLiRhKHosYS5LLmZuKTt2YXIgUD1hLk8ubWQ7YS5tW1BdPWEuTzt6W1BdPWEubTthLmJkPWZ1bmN0aW9uKGIpe3JldHVybiBhLlFhKGIsYS5tKX07YS5jZD1mdW5jdGlvbihiKXtyZXR1cm4gYS5RYShiLGEubSkmJmJbc10mJmJbc10uWWF9O2EuYihcImNvbXB1dGVkXCIsYS5tKTthLmIoXCJkZXBlbmRlbnRPYnNlcnZhYmxlXCIsYS5tKTthLmIoXCJpc0NvbXB1dGVkXCIsYS5iZCk7YS5iKFwiaXNQdXJlQ29tcHV0ZWRcIixhLmNkKTthLmIoXCJjb21wdXRlZC5mblwiLHopO2EuSCh6LFwicGVla1wiLHoucCk7YS5IKHosXCJkaXNwb3NlXCIsei5rKTthLkgoeixcImlzQWN0aXZlXCIsei5jYSk7YS5IKHosXCJnZXREZXBlbmRlbmNpZXNDb3VudFwiLHouQ2EpO2EucmM9XHJcbiAgICAgICAgZnVuY3Rpb24oYixjKXtpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilyZXR1cm4gYS5tKGIsYyx7cHVyZTohMH0pO2I9YS5hLmV4dGVuZCh7fSxiKTtiLnB1cmU9ITA7cmV0dXJuIGEubShiLGMpfTthLmIoXCJwdXJlQ29tcHV0ZWRcIixhLnJjKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEsZixnKXtnPWd8fG5ldyBkO2E9ZihhKTtpZihcIm9iamVjdFwiIT10eXBlb2YgYXx8bnVsbD09PWF8fGE9PT1ufHxhIGluc3RhbmNlb2YgUmVnRXhwfHxhIGluc3RhbmNlb2YgRGF0ZXx8YSBpbnN0YW5jZW9mIFN0cmluZ3x8YSBpbnN0YW5jZW9mIE51bWJlcnx8YSBpbnN0YW5jZW9mIEJvb2xlYW4pcmV0dXJuIGE7dmFyIGg9YSBpbnN0YW5jZW9mIEFycmF5P1tdOnt9O2cuc2F2ZShhLGgpO2MoYSxmdW5jdGlvbihjKXt2YXIgZD1mKGFbY10pO3N3aXRjaCh0eXBlb2YgZCl7Y2FzZSBcImJvb2xlYW5cIjpjYXNlIFwibnVtYmVyXCI6Y2FzZSBcInN0cmluZ1wiOmNhc2UgXCJmdW5jdGlvblwiOmhbY109ZDticmVhaztjYXNlIFwib2JqZWN0XCI6Y2FzZSBcInVuZGVmaW5lZFwiOnZhciBrPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuZ2V0KGQpO2hbY109ayE9PW4/azpiKGQsZixnKX19KTtyZXR1cm4gaH1mdW5jdGlvbiBjKGEsYil7aWYoYSBpbnN0YW5jZW9mIEFycmF5KXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKyliKGMpO1wiZnVuY3Rpb25cIj09dHlwZW9mIGEudG9KU09OJiZiKFwidG9KU09OXCIpfWVsc2UgZm9yKGMgaW4gYSliKGMpfWZ1bmN0aW9uIGQoKXt0aGlzLmtleXM9W107dGhpcy5MYj1bXX1hLkFjPWZ1bmN0aW9uKGMpe2lmKDA9PWFyZ3VtZW50cy5sZW5ndGgpdGhyb3cgRXJyb3IoXCJXaGVuIGNhbGxpbmcga28udG9KUywgcGFzcyB0aGUgb2JqZWN0IHlvdSB3YW50IHRvIGNvbnZlcnQuXCIpO3JldHVybiBiKGMsZnVuY3Rpb24oYil7Zm9yKHZhciBjPTA7YS5JKGIpJiYxMD5jO2MrKyliPWIoKTtyZXR1cm4gYn0pfTthLnRvSlNPTj1mdW5jdGlvbihiLGMsZCl7Yj1hLkFjKGIpO3JldHVybiBhLmEuR2IoYixjLGQpfTtkLnByb3RvdHlwZT17c2F2ZTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5vKHRoaXMua2V5cyxcclxuICAgICAgICBiKTswPD1kP3RoaXMuTGJbZF09YzoodGhpcy5rZXlzLnB1c2goYiksdGhpcy5MYi5wdXNoKGMpKX0sZ2V0OmZ1bmN0aW9uKGIpe2I9YS5hLm8odGhpcy5rZXlzLGIpO3JldHVybiAwPD1iP3RoaXMuTGJbYl06bn19fSkoKTthLmIoXCJ0b0pTXCIsYS5BYyk7YS5iKFwidG9KU09OXCIsYS50b0pTT04pOyhmdW5jdGlvbigpe2Euaj17dTpmdW5jdGlvbihiKXtzd2l0Y2goYS5hLkEoYikpe2Nhc2UgXCJvcHRpb25cIjpyZXR1cm4hMD09PWIuX19rb19faGFzRG9tRGF0YU9wdGlvblZhbHVlX18/YS5hLmUuZ2V0KGIsYS5kLm9wdGlvbnMuemIpOjc+PWEuYS5DP2IuZ2V0QXR0cmlidXRlTm9kZShcInZhbHVlXCIpJiZiLmdldEF0dHJpYnV0ZU5vZGUoXCJ2YWx1ZVwiKS5zcGVjaWZpZWQ/Yi52YWx1ZTpiLnRleHQ6Yi52YWx1ZTtjYXNlIFwic2VsZWN0XCI6cmV0dXJuIDA8PWIuc2VsZWN0ZWRJbmRleD9hLmoudShiLm9wdGlvbnNbYi5zZWxlY3RlZEluZGV4XSk6bjtkZWZhdWx0OnJldHVybiBiLnZhbHVlfX0samE6ZnVuY3Rpb24oYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyxkKXtzd2l0Y2goYS5hLkEoYikpe2Nhc2UgXCJvcHRpb25cIjpzd2l0Y2godHlwZW9mIGMpe2Nhc2UgXCJzdHJpbmdcIjphLmEuZS5zZXQoYixhLmQub3B0aW9ucy56YixuKTtcIl9fa29fX2hhc0RvbURhdGFPcHRpb25WYWx1ZV9fXCJpbiBiJiZkZWxldGUgYi5fX2tvX19oYXNEb21EYXRhT3B0aW9uVmFsdWVfXztiLnZhbHVlPWM7YnJlYWs7ZGVmYXVsdDphLmEuZS5zZXQoYixhLmQub3B0aW9ucy56YixjKSxiLl9fa29fX2hhc0RvbURhdGFPcHRpb25WYWx1ZV9fPSEwLGIudmFsdWU9XCJudW1iZXJcIj09PXR5cGVvZiBjP2M6XCJcIn1icmVhaztjYXNlIFwic2VsZWN0XCI6aWYoXCJcIj09PWN8fG51bGw9PT1jKWM9bjtmb3IodmFyIGU9LTEsZj0wLGc9Yi5vcHRpb25zLmxlbmd0aCxoO2Y8ZzsrK2YpaWYoaD1hLmoudShiLm9wdGlvbnNbZl0pLGg9PWN8fFwiXCI9PWgmJmM9PT1uKXtlPWY7YnJlYWt9aWYoZHx8MDw9ZXx8Yz09PW4mJjE8Yi5zaXplKWIuc2VsZWN0ZWRJbmRleD1lO2JyZWFrO2RlZmF1bHQ6aWYobnVsbD09PVxyXG4gICAgICAgIGN8fGM9PT1uKWM9XCJcIjtiLnZhbHVlPWN9fX19KSgpO2EuYihcInNlbGVjdEV4dGVuc2lvbnNcIixhLmopO2EuYihcInNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlXCIsYS5qLnUpO2EuYihcInNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZVwiLGEuai5qYSk7YS5oPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiKXtiPWEuYS5jYihiKTsxMjM9PT1iLmNoYXJDb2RlQXQoMCkmJihiPWIuc2xpY2UoMSwtMSkpO3ZhciBjPVtdLGQ9Yi5tYXRjaChlKSxyLGg9W10scD0wO2lmKGQpe2QucHVzaChcIixcIik7Zm9yKHZhciBBPTAseTt5PWRbQV07KytBKXt2YXIgdj15LmNoYXJDb2RlQXQoMCk7aWYoNDQ9PT12KXtpZigwPj1wKXtjLnB1c2gociYmaC5sZW5ndGg/e2tleTpyLHZhbHVlOmguam9pbihcIlwiKX06e3Vua25vd246cnx8aC5qb2luKFwiXCIpfSk7cj1wPTA7aD1bXTtjb250aW51ZX19ZWxzZSBpZig1OD09PXYpe2lmKCFwJiYhciYmMT09PWgubGVuZ3RoKXtyPWgucG9wKCk7Y29udGludWV9fWVsc2UgNDc9PT1cclxuICAgIHYmJkEmJjE8eS5sZW5ndGg/KHY9ZFtBLTFdLm1hdGNoKGYpKSYmIWdbdlswXV0mJihiPWIuc3Vic3RyKGIuaW5kZXhPZih5KSsxKSxkPWIubWF0Y2goZSksZC5wdXNoKFwiLFwiKSxBPS0xLHk9XCIvXCIpOjQwPT09dnx8MTIzPT09dnx8OTE9PT12PysrcDo0MT09PXZ8fDEyNT09PXZ8fDkzPT09dj8tLXA6cnx8aC5sZW5ndGh8fDM0IT09diYmMzkhPT12fHwoeT15LnNsaWNlKDEsLTEpKTtoLnB1c2goeSl9fXJldHVybiBjfXZhciBjPVtcInRydWVcIixcImZhbHNlXCIsXCJudWxsXCIsXCJ1bmRlZmluZWRcIl0sZD0vXig/OlskX2Etel1bJFxcd10qfCguKykoXFwuXFxzKlskX2Etel1bJFxcd10qfFxcWy4rXFxdKSkkL2ksZT1SZWdFeHAoXCJcXFwiKD86W15cXFwiXFxcXFxcXFxdfFxcXFxcXFxcLikqXFxcInwnKD86W14nXFxcXFxcXFxdfFxcXFxcXFxcLikqJ3wvKD86W14vXFxcXFxcXFxdfFxcXFxcXFxcLikqL3cqfFteXFxcXHM6LC9dW14sXFxcIid7fSgpLzpbXFxcXF1dKlteXFxcXHMsXFxcIid7fSgpLzpbXFxcXF1dfFteXFxcXHNdXCIsXCJnXCIpLGY9L1tcXF0pXCInQS1aYS16MC05XyRdKyQvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZz17XCJpblwiOjEsXCJyZXR1cm5cIjoxLFwidHlwZW9mXCI6MX0saD17fTtyZXR1cm57dmE6W10sZ2E6aCxBYjpiLFhhOmZ1bmN0aW9uKGUsbSl7ZnVuY3Rpb24gayhiLGUpe3ZhciBtO2lmKCFBKXt2YXIgbD1hLmdldEJpbmRpbmdIYW5kbGVyKGIpO2lmKGwmJmwucHJlcHJvY2VzcyYmIShlPWwucHJlcHJvY2VzcyhlLGIsaykpKXJldHVybjtpZihsPWhbYl0pbT1lLDA8PWEuYS5vKGMsbSk/bT0hMToobD1tLm1hdGNoKGQpLG09bnVsbD09PWw/ITE6bFsxXT9cIk9iamVjdChcIitsWzFdK1wiKVwiK2xbMl06bSksbD1tO2wmJmcucHVzaChcIidcIitiK1wiJzpmdW5jdGlvbihfeil7XCIrbStcIj1fen1cIil9cCYmKGU9XCJmdW5jdGlvbigpe3JldHVybiBcIitlK1wiIH1cIik7Zi5wdXNoKFwiJ1wiK2IrXCInOlwiK2UpfW09bXx8e307dmFyIGY9W10sZz1bXSxwPW0udmFsdWVBY2Nlc3NvcnMsQT1tLmJpbmRpbmdQYXJhbXMseT1cInN0cmluZ1wiPT09dHlwZW9mIGU/YihlKTplO2EuYS5yKHksZnVuY3Rpb24oYSl7ayhhLmtleXx8XHJcbiAgICAgICAgYS51bmtub3duLGEudmFsdWUpfSk7Zy5sZW5ndGgmJmsoXCJfa29fcHJvcGVydHlfd3JpdGVyc1wiLFwie1wiK2cuam9pbihcIixcIikrXCIgfVwiKTtyZXR1cm4gZi5qb2luKFwiLFwiKX0sZmQ6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKylpZihhW2NdLmtleT09YilyZXR1cm4hMDtyZXR1cm4hMX0sR2E6ZnVuY3Rpb24oYixjLGQsZSxmKXtpZihiJiZhLkkoYikpIWEuRGEoYil8fGYmJmIucCgpPT09ZXx8YihlKTtlbHNlIGlmKChiPWMuZ2V0KFwiX2tvX3Byb3BlcnR5X3dyaXRlcnNcIikpJiZiW2RdKWJbZF0oZSl9fX0oKTthLmIoXCJleHByZXNzaW9uUmV3cml0aW5nXCIsYS5oKTthLmIoXCJleHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1wiLGEuaC52YSk7YS5iKFwiZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWxcIixhLmguQWIpO2EuYihcImV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzXCIsYS5oLlhhKTthLmIoXCJleHByZXNzaW9uUmV3cml0aW5nLl90d29XYXlCaW5kaW5nc1wiLFxyXG4gICAgICAgIGEuaC5nYSk7YS5iKFwianNvbkV4cHJlc3Npb25SZXdyaXRpbmdcIixhLmgpO2EuYihcImpzb25FeHByZXNzaW9uUmV3cml0aW5nLmluc2VydFByb3BlcnR5QWNjZXNzb3JzSW50b0pzb25cIixhLmguWGEpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSl7cmV0dXJuIDg9PWEubm9kZVR5cGUmJmcudGVzdChmP2EudGV4dDphLm5vZGVWYWx1ZSl9ZnVuY3Rpb24gYyhhKXtyZXR1cm4gOD09YS5ub2RlVHlwZSYmaC50ZXN0KGY/YS50ZXh0OmEubm9kZVZhbHVlKX1mdW5jdGlvbiBkKGEsZCl7Zm9yKHZhciBlPWEsZj0xLGw9W107ZT1lLm5leHRTaWJsaW5nOyl7aWYoYyhlKSYmKGYtLSwwPT09ZikpcmV0dXJuIGw7bC5wdXNoKGUpO2IoZSkmJmYrK31pZighZCl0aHJvdyBFcnJvcihcIkNhbm5vdCBmaW5kIGNsb3NpbmcgY29tbWVudCB0YWcgdG8gbWF0Y2g6IFwiK2Eubm9kZVZhbHVlKTtyZXR1cm4gbnVsbH1mdW5jdGlvbiBlKGEsYil7dmFyIGM9ZChhLGIpO3JldHVybiBjPzA8Yy5sZW5ndGg/Y1tjLmxlbmd0aC1cclxuICAgIDFdLm5leHRTaWJsaW5nOmEubmV4dFNpYmxpbmc6bnVsbH12YXIgZj10JiZcIlxceDNjIS0tdGVzdC0tXFx4M2VcIj09PXQuY3JlYXRlQ29tbWVudChcInRlc3RcIikudGV4dCxnPWY/L15cXHgzYyEtLVxccyprbyg/OlxccysoW1xcc1xcU10rKSk/XFxzKi0tXFx4M2UkLzovXlxccyprbyg/OlxccysoW1xcc1xcU10rKSk/XFxzKiQvLGg9Zj8vXlxceDNjIS0tXFxzKlxcL2tvXFxzKi0tXFx4M2UkLzovXlxccypcXC9rb1xccyokLyxsPXt1bDohMCxvbDohMH07YS5mPXthYTp7fSxjaGlsZE5vZGVzOmZ1bmN0aW9uKGEpe3JldHVybiBiKGEpP2QoYSk6YS5jaGlsZE5vZGVzfSx6YTpmdW5jdGlvbihjKXtpZihiKGMpKXtjPWEuZi5jaGlsZE5vZGVzKGMpO2Zvcih2YXIgZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKylhLnJlbW92ZU5vZGUoY1tkXSl9ZWxzZSBhLmEucmIoYyl9LGZhOmZ1bmN0aW9uKGMsZCl7aWYoYihjKSl7YS5mLnphKGMpO2Zvcih2YXIgZT1jLm5leHRTaWJsaW5nLGY9MCxsPWQubGVuZ3RoO2Y8bDtmKyspZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkW2ZdLFxyXG4gICAgICAgIGUpfWVsc2UgYS5hLmZhKGMsZCl9LHFjOmZ1bmN0aW9uKGEsYyl7YihhKT9hLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGMsYS5uZXh0U2libGluZyk6YS5maXJzdENoaWxkP2EuaW5zZXJ0QmVmb3JlKGMsYS5maXJzdENoaWxkKTphLmFwcGVuZENoaWxkKGMpfSxrYzpmdW5jdGlvbihjLGQsZSl7ZT9iKGMpP2MucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZCxlLm5leHRTaWJsaW5nKTplLm5leHRTaWJsaW5nP2MuaW5zZXJ0QmVmb3JlKGQsZS5uZXh0U2libGluZyk6Yy5hcHBlbmRDaGlsZChkKTphLmYucWMoYyxkKX0sZmlyc3RDaGlsZDpmdW5jdGlvbihhKXtyZXR1cm4gYihhKT8hYS5uZXh0U2libGluZ3x8YyhhLm5leHRTaWJsaW5nKT9udWxsOmEubmV4dFNpYmxpbmc6YS5maXJzdENoaWxkfSxuZXh0U2libGluZzpmdW5jdGlvbihhKXtiKGEpJiYoYT1lKGEpKTtyZXR1cm4gYS5uZXh0U2libGluZyYmYyhhLm5leHRTaWJsaW5nKT9udWxsOmEubmV4dFNpYmxpbmd9LFljOmIsdmQ6ZnVuY3Rpb24oYSl7cmV0dXJuKGE9XHJcbiAgICAgICAgKGY/YS50ZXh0OmEubm9kZVZhbHVlKS5tYXRjaChnKSk/YVsxXTpudWxsfSxvYzpmdW5jdGlvbihkKXtpZihsW2EuYS5BKGQpXSl7dmFyIGs9ZC5maXJzdENoaWxkO2lmKGspe2RvIGlmKDE9PT1rLm5vZGVUeXBlKXt2YXIgZjtmPWsuZmlyc3RDaGlsZDt2YXIgZz1udWxsO2lmKGYpe2RvIGlmKGcpZy5wdXNoKGYpO2Vsc2UgaWYoYihmKSl7dmFyIGg9ZShmLCEwKTtoP2Y9aDpnPVtmXX1lbHNlIGMoZikmJihnPVtmXSk7d2hpbGUoZj1mLm5leHRTaWJsaW5nKX1pZihmPWcpZm9yKGc9ay5uZXh0U2libGluZyxoPTA7aDxmLmxlbmd0aDtoKyspZz9kLmluc2VydEJlZm9yZShmW2hdLGcpOmQuYXBwZW5kQ2hpbGQoZltoXSl9d2hpbGUoaz1rLm5leHRTaWJsaW5nKX19fX19KSgpO2EuYihcInZpcnR1YWxFbGVtZW50c1wiLGEuZik7YS5iKFwidmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1wiLGEuZi5hYSk7YS5iKFwidmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZVwiLGEuZi56YSk7YS5iKFwidmlydHVhbEVsZW1lbnRzLmluc2VydEFmdGVyXCIsXHJcbiAgICAgICAgYS5mLmtjKTthLmIoXCJ2aXJ0dWFsRWxlbWVudHMucHJlcGVuZFwiLGEuZi5xYyk7YS5iKFwidmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlblwiLGEuZi5mYSk7KGZ1bmN0aW9uKCl7YS5TPWZ1bmN0aW9uKCl7dGhpcy5LYz17fX07YS5hLmV4dGVuZChhLlMucHJvdG90eXBlLHtub2RlSGFzQmluZGluZ3M6ZnVuY3Rpb24oYil7c3dpdGNoKGIubm9kZVR5cGUpe2Nhc2UgMTpyZXR1cm4gbnVsbCE9Yi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIil8fGEuZy5nZXRDb21wb25lbnROYW1lRm9yTm9kZShiKTtjYXNlIDg6cmV0dXJuIGEuZi5ZYyhiKTtkZWZhdWx0OnJldHVybiExfX0sZ2V0QmluZGluZ3M6ZnVuY3Rpb24oYixjKXt2YXIgZD10aGlzLmdldEJpbmRpbmdzU3RyaW5nKGIsYyksZD1kP3RoaXMucGFyc2VCaW5kaW5nc1N0cmluZyhkLGMsYik6bnVsbDtyZXR1cm4gYS5nLlJiKGQsYixjLCExKX0sZ2V0QmluZGluZ0FjY2Vzc29yczpmdW5jdGlvbihiLGMpe3ZhciBkPXRoaXMuZ2V0QmluZGluZ3NTdHJpbmcoYixcclxuICAgICAgICBjKSxkPWQ/dGhpcy5wYXJzZUJpbmRpbmdzU3RyaW5nKGQsYyxiLHt2YWx1ZUFjY2Vzc29yczohMH0pOm51bGw7cmV0dXJuIGEuZy5SYihkLGIsYywhMCl9LGdldEJpbmRpbmdzU3RyaW5nOmZ1bmN0aW9uKGIpe3N3aXRjaChiLm5vZGVUeXBlKXtjYXNlIDE6cmV0dXJuIGIuZ2V0QXR0cmlidXRlKFwiZGF0YS1iaW5kXCIpO2Nhc2UgODpyZXR1cm4gYS5mLnZkKGIpO2RlZmF1bHQ6cmV0dXJuIG51bGx9fSxwYXJzZUJpbmRpbmdzU3RyaW5nOmZ1bmN0aW9uKGIsYyxkLGUpe3RyeXt2YXIgZj10aGlzLktjLGc9YisoZSYmZS52YWx1ZUFjY2Vzc29yc3x8XCJcIiksaDtpZighKGg9ZltnXSkpe3ZhciBsLG09XCJ3aXRoKCRjb250ZXh0KXt3aXRoKCRkYXRhfHx7fSl7cmV0dXJue1wiK2EuaC5YYShiLGUpK1wifX19XCI7bD1uZXcgRnVuY3Rpb24oXCIkY29udGV4dFwiLFwiJGVsZW1lbnRcIixtKTtoPWZbZ109bH1yZXR1cm4gaChjLGQpfWNhdGNoKGspe3Rocm93IGsubWVzc2FnZT1cIlVuYWJsZSB0byBwYXJzZSBiaW5kaW5ncy5cXG5CaW5kaW5ncyB2YWx1ZTogXCIrXHJcbiAgICAgICAgYitcIlxcbk1lc3NhZ2U6IFwiK2subWVzc2FnZSxrO319fSk7YS5TLmluc3RhbmNlPW5ldyBhLlN9KSgpO2EuYihcImJpbmRpbmdQcm92aWRlclwiLGEuUyk7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYX19ZnVuY3Rpb24gYyhhKXtyZXR1cm4gYSgpfWZ1bmN0aW9uIGQoYil7cmV0dXJuIGEuYS5FYShhLmwudyhiKSxmdW5jdGlvbihhLGMpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBiKClbY119fSl9ZnVuY3Rpb24gZShjLGUsayl7cmV0dXJuXCJmdW5jdGlvblwiPT09dHlwZW9mIGM/ZChjLmJpbmQobnVsbCxlLGspKTphLmEuRWEoYyxiKX1mdW5jdGlvbiBmKGEsYil7cmV0dXJuIGQodGhpcy5nZXRCaW5kaW5ncy5iaW5kKHRoaXMsYSxiKSl9ZnVuY3Rpb24gZyhiLGMsZCl7dmFyIGUsaz1hLmYuZmlyc3RDaGlsZChjKSxmPWEuUy5pbnN0YW5jZSxtPWYucHJlcHJvY2Vzc05vZGU7aWYobSl7Zm9yKDtlPWs7KWs9YS5mLm5leHRTaWJsaW5nKGUpLFxyXG4gICAgICAgIG0uY2FsbChmLGUpO2s9YS5mLmZpcnN0Q2hpbGQoYyl9Zm9yKDtlPWs7KWs9YS5mLm5leHRTaWJsaW5nKGUpLGgoYixlLGQpfWZ1bmN0aW9uIGgoYixjLGQpe3ZhciBlPSEwLGs9MT09PWMubm9kZVR5cGU7ayYmYS5mLm9jKGMpO2lmKGsmJmR8fGEuUy5pbnN0YW5jZS5ub2RlSGFzQmluZGluZ3MoYykpZT1tKGMsbnVsbCxiLGQpLnNob3VsZEJpbmREZXNjZW5kYW50cztlJiYhclthLmEuQShjKV0mJmcoYixjLCFrKX1mdW5jdGlvbiBsKGIpe3ZhciBjPVtdLGQ9e30sZT1bXTthLmEuRChiLGZ1bmN0aW9uIFgoayl7aWYoIWRba10pe3ZhciBmPWEuZ2V0QmluZGluZ0hhbmRsZXIoayk7ZiYmKGYuYWZ0ZXImJihlLnB1c2goayksYS5hLnIoZi5hZnRlcixmdW5jdGlvbihjKXtpZihiW2NdKXtpZigtMSE9PWEuYS5vKGUsYykpdGhyb3cgRXJyb3IoXCJDYW5ub3QgY29tYmluZSB0aGUgZm9sbG93aW5nIGJpbmRpbmdzLCBiZWNhdXNlIHRoZXkgaGF2ZSBhIGN5Y2xpYyBkZXBlbmRlbmN5OiBcIitlLmpvaW4oXCIsIFwiKSk7XHJcbiAgICAgICAgWChjKX19KSxlLmxlbmd0aC0tKSxjLnB1c2goe2tleTprLGpjOmZ9KSk7ZFtrXT0hMH19KTtyZXR1cm4gY31mdW5jdGlvbiBtKGIsZCxlLGspe3ZhciBtPWEuYS5lLmdldChiLHEpO2lmKCFkKXtpZihtKXRocm93IEVycm9yKFwiWW91IGNhbm5vdCBhcHBseSBiaW5kaW5ncyBtdWx0aXBsZSB0aW1lcyB0byB0aGUgc2FtZSBlbGVtZW50LlwiKTthLmEuZS5zZXQoYixxLCEwKX0hbSYmayYmYS54YyhiLGUpO3ZhciBnO2lmKGQmJlwiZnVuY3Rpb25cIiE9PXR5cGVvZiBkKWc9ZDtlbHNle3ZhciBoPWEuUy5pbnN0YW5jZSxyPWguZ2V0QmluZGluZ0FjY2Vzc29yc3x8ZixwPWEuQihmdW5jdGlvbigpeyhnPWQ/ZChlLGIpOnIuY2FsbChoLGIsZSkpJiZlLlEmJmUuUSgpO3JldHVybiBnfSxudWxsLHtpOmJ9KTtnJiZwLmNhKCl8fChwPW51bGwpfXZhciBzO2lmKGcpe3ZhciB0PXA/ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGMocCgpW2FdKX19OmZ1bmN0aW9uKGEpe3JldHVybiBnW2FdfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdT1mdW5jdGlvbigpe3JldHVybiBhLmEuRWEocD9wKCk6ZyxjKX07dS5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIGdbYV0mJmModChhKSl9O3UuaGFzPWZ1bmN0aW9uKGEpe3JldHVybiBhIGluIGd9O2s9bChnKTthLmEucihrLGZ1bmN0aW9uKGMpe3ZhciBkPWMuamMuaW5pdCxrPWMuamMudXBkYXRlLGY9Yy5rZXk7aWYoOD09PWIubm9kZVR5cGUmJiFhLmYuYWFbZl0pdGhyb3cgRXJyb3IoXCJUaGUgYmluZGluZyAnXCIrZitcIicgY2Fubm90IGJlIHVzZWQgd2l0aCB2aXJ0dWFsIGVsZW1lbnRzXCIpO3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkJiZhLmwudyhmdW5jdGlvbigpe3ZhciBhPWQoYix0KGYpLHUsZS4kZGF0YSxlKTtpZihhJiZhLmNvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzKXtpZihzIT09bil0aHJvdyBFcnJvcihcIk11bHRpcGxlIGJpbmRpbmdzIChcIitzK1wiIGFuZCBcIitmK1wiKSBhcmUgdHJ5aW5nIHRvIGNvbnRyb2wgZGVzY2VuZGFudCBiaW5kaW5ncyBvZiB0aGUgc2FtZSBlbGVtZW50LiBZb3UgY2Fubm90IHVzZSB0aGVzZSBiaW5kaW5ncyB0b2dldGhlciBvbiB0aGUgc2FtZSBlbGVtZW50LlwiKTtcclxuICAgICAgICBzPWZ9fSksXCJmdW5jdGlvblwiPT10eXBlb2YgayYmYS5CKGZ1bmN0aW9uKCl7ayhiLHQoZiksdSxlLiRkYXRhLGUpfSxudWxsLHtpOmJ9KX1jYXRjaChtKXt0aHJvdyBtLm1lc3NhZ2U9J1VuYWJsZSB0byBwcm9jZXNzIGJpbmRpbmcgXCInK2YrXCI6IFwiK2dbZl0rJ1wiXFxuTWVzc2FnZTogJyttLm1lc3NhZ2UsbTt9fSl9cmV0dXJue3Nob3VsZEJpbmREZXNjZW5kYW50czpzPT09bn19ZnVuY3Rpb24gayhiKXtyZXR1cm4gYiYmYiBpbnN0YW5jZW9mIGEuUj9iOm5ldyBhLlIoYil9YS5kPXt9O3ZhciByPXtzY3JpcHQ6ITAsdGV4dGFyZWE6ITAsdGVtcGxhdGU6ITB9O2EuZ2V0QmluZGluZ0hhbmRsZXI9ZnVuY3Rpb24oYil7cmV0dXJuIGEuZFtiXX07YS5SPWZ1bmN0aW9uKGIsYyxkLGUsayl7ZnVuY3Rpb24gZigpe3ZhciBrPWc/YigpOmIsbT1hLmEuYyhrKTtjPyhjLlEmJmMuUSgpLGEuYS5leHRlbmQobCxjKSxsLlE9cik6KGwuJHBhcmVudHM9W10sbC4kcm9vdD1tLGwua289YSk7bC4kcmF3RGF0YT1cclxuICAgICAgICBrO2wuJGRhdGE9bTtkJiYobFtkXT1tKTtlJiZlKGwsYyxtKTtyZXR1cm4gbC4kZGF0YX1mdW5jdGlvbiBtKCl7cmV0dXJuIGgmJiFhLmEuVGIoaCl9dmFyIGw9dGhpcyxnPVwiZnVuY3Rpb25cIj09dHlwZW9mIGImJiFhLkkoYiksaCxyO2smJmsuZXhwb3J0RGVwZW5kZW5jaWVzP2YoKToocj1hLkIoZixudWxsLHt5YTptLGk6ITB9KSxyLmNhKCkmJihsLlE9cixyLmVxdWFsaXR5Q29tcGFyZXI9bnVsbCxoPVtdLHIuRGM9ZnVuY3Rpb24oYil7aC5wdXNoKGIpO2EuYS5HLnFhKGIsZnVuY3Rpb24oYil7YS5hLk5hKGgsYik7aC5sZW5ndGh8fChyLmsoKSxsLlE9cj1uKX0pfSkpfTthLlIucHJvdG90eXBlLmNyZWF0ZUNoaWxkQ29udGV4dD1mdW5jdGlvbihiLGMsZCxlKXtyZXR1cm4gbmV3IGEuUihiLHRoaXMsYyxmdW5jdGlvbihhLGIpe2EuJHBhcmVudENvbnRleHQ9YjthLiRwYXJlbnQ9Yi4kZGF0YTthLiRwYXJlbnRzPShiLiRwYXJlbnRzfHxbXSkuc2xpY2UoMCk7YS4kcGFyZW50cy51bnNoaWZ0KGEuJHBhcmVudCk7XHJcbiAgICAgICAgZCYmZChhKX0sZSl9O2EuUi5wcm90b3R5cGUuZXh0ZW5kPWZ1bmN0aW9uKGIpe3JldHVybiBuZXcgYS5SKHRoaXMuUXx8dGhpcy4kZGF0YSx0aGlzLG51bGwsZnVuY3Rpb24oYyxkKXtjLiRyYXdEYXRhPWQuJHJhd0RhdGE7YS5hLmV4dGVuZChjLFwiZnVuY3Rpb25cIj09dHlwZW9mIGI/YigpOmIpfSl9O2EuUi5wcm90b3R5cGUuYWM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5jcmVhdGVDaGlsZENvbnRleHQoYSxiLG51bGwse2V4cG9ydERlcGVuZGVuY2llczohMH0pfTt2YXIgcT1hLmEuZS5KKCkscD1hLmEuZS5KKCk7YS54Yz1mdW5jdGlvbihiLGMpe2lmKDI9PWFyZ3VtZW50cy5sZW5ndGgpYS5hLmUuc2V0KGIscCxjKSxjLlEmJmMuUS5EYyhiKTtlbHNlIHJldHVybiBhLmEuZS5nZXQoYixwKX07YS5MYT1mdW5jdGlvbihiLGMsZCl7MT09PWIubm9kZVR5cGUmJmEuZi5vYyhiKTtyZXR1cm4gbShiLGMsayhkKSwhMCl9O2EuSWM9ZnVuY3Rpb24oYixjLGQpe2Q9ayhkKTtyZXR1cm4gYS5MYShiLFxyXG4gICAgICAgIGUoYyxkLGIpLGQpfTthLmhiPWZ1bmN0aW9uKGEsYil7MSE9PWIubm9kZVR5cGUmJjghPT1iLm5vZGVUeXBlfHxnKGsoYSksYiwhMCl9O2EuVWI9ZnVuY3Rpb24oYSxiKXshdSYmeC5qUXVlcnkmJih1PXgualF1ZXJ5KTtpZihiJiYxIT09Yi5ub2RlVHlwZSYmOCE9PWIubm9kZVR5cGUpdGhyb3cgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzOiBmaXJzdCBwYXJhbWV0ZXIgc2hvdWxkIGJlIHlvdXIgdmlldyBtb2RlbDsgc2Vjb25kIHBhcmFtZXRlciBzaG91bGQgYmUgYSBET00gbm9kZVwiKTtiPWJ8fHguZG9jdW1lbnQuYm9keTtoKGsoYSksYiwhMCl9O2EubmI9ZnVuY3Rpb24oYil7c3dpdGNoKGIubm9kZVR5cGUpe2Nhc2UgMTpjYXNlIDg6dmFyIGM9YS54YyhiKTtpZihjKXJldHVybiBjO2lmKGIucGFyZW50Tm9kZSlyZXR1cm4gYS5uYihiLnBhcmVudE5vZGUpfXJldHVybiBufTthLk9jPWZ1bmN0aW9uKGIpe3JldHVybihiPWEubmIoYikpP2IuJGRhdGE6bn07YS5iKFwiYmluZGluZ0hhbmRsZXJzXCIsXHJcbiAgICAgICAgYS5kKTthLmIoXCJhcHBseUJpbmRpbmdzXCIsYS5VYik7YS5iKFwiYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHNcIixhLmhiKTthLmIoXCJhcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGVcIixhLkxhKTthLmIoXCJhcHBseUJpbmRpbmdzVG9Ob2RlXCIsYS5JYyk7YS5iKFwiY29udGV4dEZvclwiLGEubmIpO2EuYihcImRhdGFGb3JcIixhLk9jKX0pKCk7KGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGMoYyxlKXt2YXIgbT1mLmhhc093blByb3BlcnR5KGMpP2ZbY106YixrO20/bS5ZKGUpOihtPWZbY109bmV3IGEuSyxtLlkoZSksZChjLGZ1bmN0aW9uKGIsZCl7dmFyIGU9ISghZHx8IWQuc3luY2hyb25vdXMpO2dbY109e2RlZmluaXRpb246YixkZDplfTtkZWxldGUgZltjXTtrfHxlP20ubm90aWZ5U3Vic2NyaWJlcnMoYik6YS5aLlphKGZ1bmN0aW9uKCl7bS5ub3RpZnlTdWJzY3JpYmVycyhiKX0pfSksaz0hMCl9ZnVuY3Rpb24gZChhLGIpe2UoXCJnZXRDb25maWdcIixbYV0sZnVuY3Rpb24oYyl7Yz9lKFwibG9hZENvbXBvbmVudFwiLFxyXG4gICAgICAgIFthLGNdLGZ1bmN0aW9uKGEpe2IoYSxjKX0pOmIobnVsbCxudWxsKX0pfWZ1bmN0aW9uIGUoYyxkLGYsayl7a3x8KGs9YS5nLmxvYWRlcnMuc2xpY2UoMCkpO3ZhciBnPWsuc2hpZnQoKTtpZihnKXt2YXIgcT1nW2NdO2lmKHEpe3ZhciBwPSExO2lmKHEuYXBwbHkoZyxkLmNvbmNhdChmdW5jdGlvbihhKXtwP2YobnVsbCk6bnVsbCE9PWE/ZihhKTplKGMsZCxmLGspfSkpIT09YiYmKHA9ITAsIWcuc3VwcHJlc3NMb2FkZXJFeGNlcHRpb25zKSl0aHJvdyBFcnJvcihcIkNvbXBvbmVudCBsb2FkZXJzIG11c3Qgc3VwcGx5IHZhbHVlcyBieSBpbnZva2luZyB0aGUgY2FsbGJhY2ssIG5vdCBieSByZXR1cm5pbmcgdmFsdWVzIHN5bmNocm9ub3VzbHkuXCIpO31lbHNlIGUoYyxkLGYsayl9ZWxzZSBmKG51bGwpfXZhciBmPXt9LGc9e307YS5nPXtnZXQ6ZnVuY3Rpb24oZCxlKXt2YXIgZj1nLmhhc093blByb3BlcnR5KGQpP2dbZF06YjtmP2YuZGQ/YS5sLncoZnVuY3Rpb24oKXtlKGYuZGVmaW5pdGlvbil9KTpcclxuICAgICAgICBhLlouWmEoZnVuY3Rpb24oKXtlKGYuZGVmaW5pdGlvbil9KTpjKGQsZSl9LCRiOmZ1bmN0aW9uKGEpe2RlbGV0ZSBnW2FdfSxOYjplfTthLmcubG9hZGVycz1bXTthLmIoXCJjb21wb25lbnRzXCIsYS5nKTthLmIoXCJjb21wb25lbnRzLmdldFwiLGEuZy5nZXQpO2EuYihcImNvbXBvbmVudHMuY2xlYXJDYWNoZWREZWZpbml0aW9uXCIsYS5nLiRiKX0pKCk7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGMsZCxlKXtmdW5jdGlvbiBnKCl7MD09PS0teSYmZShoKX12YXIgaD17fSx5PTIsdj1kLnRlbXBsYXRlO2Q9ZC52aWV3TW9kZWw7dj9mKGMsdixmdW5jdGlvbihjKXthLmcuTmIoXCJsb2FkVGVtcGxhdGVcIixbYixjXSxmdW5jdGlvbihhKXtoLnRlbXBsYXRlPWE7ZygpfSl9KTpnKCk7ZD9mKGMsZCxmdW5jdGlvbihjKXthLmcuTmIoXCJsb2FkVmlld01vZGVsXCIsW2IsY10sZnVuY3Rpb24oYSl7aFtsXT1hO2coKX0pfSk6ZygpfWZ1bmN0aW9uIGMoYSxiLGQpe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBiKWQoZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBiKGEpfSk7XHJcbiAgICBlbHNlIGlmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBiW2xdKWQoYltsXSk7ZWxzZSBpZihcImluc3RhbmNlXCJpbiBiKXt2YXIgZT1iLmluc3RhbmNlO2QoZnVuY3Rpb24oKXtyZXR1cm4gZX0pfWVsc2VcInZpZXdNb2RlbFwiaW4gYj9jKGEsYi52aWV3TW9kZWwsZCk6YShcIlVua25vd24gdmlld01vZGVsIHZhbHVlOiBcIitiKX1mdW5jdGlvbiBkKGIpe3N3aXRjaChhLmEuQShiKSl7Y2FzZSBcInNjcmlwdFwiOnJldHVybiBhLmEubmEoYi50ZXh0KTtjYXNlIFwidGV4dGFyZWFcIjpyZXR1cm4gYS5hLm5hKGIudmFsdWUpO2Nhc2UgXCJ0ZW1wbGF0ZVwiOmlmKGUoYi5jb250ZW50KSlyZXR1cm4gYS5hLndhKGIuY29udGVudC5jaGlsZE5vZGVzKX1yZXR1cm4gYS5hLndhKGIuY2hpbGROb2Rlcyl9ZnVuY3Rpb24gZShhKXtyZXR1cm4geC5Eb2N1bWVudEZyYWdtZW50P2EgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50OmEmJjExPT09YS5ub2RlVHlwZX1mdW5jdGlvbiBmKGEsYixjKXtcInN0cmluZ1wiPT09dHlwZW9mIGIucmVxdWlyZT9cclxuICAgICAgICBPfHx4LnJlcXVpcmU/KE98fHgucmVxdWlyZSkoW2IucmVxdWlyZV0sYyk6YShcIlVzZXMgcmVxdWlyZSwgYnV0IG5vIEFNRCBsb2FkZXIgaXMgcHJlc2VudFwiKTpjKGIpfWZ1bmN0aW9uIGcoYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3Rocm93IEVycm9yKFwiQ29tcG9uZW50ICdcIithK1wiJzogXCIrYik7fX12YXIgaD17fTthLmcucmVnaXN0ZXI9ZnVuY3Rpb24oYixjKXtpZighYyl0aHJvdyBFcnJvcihcIkludmFsaWQgY29uZmlndXJhdGlvbiBmb3IgXCIrYik7aWYoYS5nLndiKGIpKXRocm93IEVycm9yKFwiQ29tcG9uZW50IFwiK2IrXCIgaXMgYWxyZWFkeSByZWdpc3RlcmVkXCIpO2hbYl09Y307YS5nLndiPWZ1bmN0aW9uKGEpe3JldHVybiBoLmhhc093blByb3BlcnR5KGEpfTthLmcudWQ9ZnVuY3Rpb24oYil7ZGVsZXRlIGhbYl07YS5nLiRiKGIpfTthLmcuY2M9e2dldENvbmZpZzpmdW5jdGlvbihhLGIpe2IoaC5oYXNPd25Qcm9wZXJ0eShhKT9oW2FdOm51bGwpfSxsb2FkQ29tcG9uZW50OmZ1bmN0aW9uKGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLGQpe3ZhciBlPWcoYSk7ZihlLGMsZnVuY3Rpb24oYyl7YihhLGUsYyxkKX0pfSxsb2FkVGVtcGxhdGU6ZnVuY3Rpb24oYixjLGYpe2I9ZyhiKTtpZihcInN0cmluZ1wiPT09dHlwZW9mIGMpZihhLmEubmEoYykpO2Vsc2UgaWYoYyBpbnN0YW5jZW9mIEFycmF5KWYoYyk7ZWxzZSBpZihlKGMpKWYoYS5hLlcoYy5jaGlsZE5vZGVzKSk7ZWxzZSBpZihjLmVsZW1lbnQpaWYoYz1jLmVsZW1lbnQseC5IVE1MRWxlbWVudD9jIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ6YyYmYy50YWdOYW1lJiYxPT09Yy5ub2RlVHlwZSlmKGQoYykpO2Vsc2UgaWYoXCJzdHJpbmdcIj09PXR5cGVvZiBjKXt2YXIgbD10LmdldEVsZW1lbnRCeUlkKGMpO2w/ZihkKGwpKTpiKFwiQ2Fubm90IGZpbmQgZWxlbWVudCB3aXRoIElEIFwiK2MpfWVsc2UgYihcIlVua25vd24gZWxlbWVudCB0eXBlOiBcIitjKTtlbHNlIGIoXCJVbmtub3duIHRlbXBsYXRlIHZhbHVlOiBcIitjKX0sbG9hZFZpZXdNb2RlbDpmdW5jdGlvbihhLGIsZCl7YyhnKGEpLFxyXG4gICAgICAgIGIsZCl9fTt2YXIgbD1cImNyZWF0ZVZpZXdNb2RlbFwiO2EuYihcImNvbXBvbmVudHMucmVnaXN0ZXJcIixhLmcucmVnaXN0ZXIpO2EuYihcImNvbXBvbmVudHMuaXNSZWdpc3RlcmVkXCIsYS5nLndiKTthLmIoXCJjb21wb25lbnRzLnVucmVnaXN0ZXJcIixhLmcudWQpO2EuYihcImNvbXBvbmVudHMuZGVmYXVsdExvYWRlclwiLGEuZy5jYyk7YS5nLmxvYWRlcnMucHVzaChhLmcuY2MpO2EuZy5FYz1ofSkoKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsZSl7dmFyIGY9Yi5nZXRBdHRyaWJ1dGUoXCJwYXJhbXNcIik7aWYoZil7dmFyIGY9Yy5wYXJzZUJpbmRpbmdzU3RyaW5nKGYsZSxiLHt2YWx1ZUFjY2Vzc29yczohMCxiaW5kaW5nUGFyYW1zOiEwfSksZj1hLmEuRWEoZixmdW5jdGlvbihjKXtyZXR1cm4gYS5tKGMsbnVsbCx7aTpifSl9KSxnPWEuYS5FYShmLGZ1bmN0aW9uKGMpe3ZhciBlPWMucCgpO3JldHVybiBjLmNhKCk/YS5tKHtyZWFkOmZ1bmN0aW9uKCl7cmV0dXJuIGEuYS5jKGMoKSl9LHdyaXRlOmEuRGEoZSkmJlxyXG4gICAgZnVuY3Rpb24oYSl7YygpKGEpfSxpOmJ9KTplfSk7Zy5oYXNPd25Qcm9wZXJ0eShcIiRyYXdcIil8fChnLiRyYXc9Zik7cmV0dXJuIGd9cmV0dXJueyRyYXc6e319fWEuZy5nZXRDb21wb25lbnROYW1lRm9yTm9kZT1mdW5jdGlvbihiKXt2YXIgYz1hLmEuQShiKTtpZihhLmcud2IoYykmJigtMSE9Yy5pbmRleE9mKFwiLVwiKXx8XCJbb2JqZWN0IEhUTUxVbmtub3duRWxlbWVudF1cIj09XCJcIitifHw4Pj1hLmEuQyYmYi50YWdOYW1lPT09YykpcmV0dXJuIGN9O2EuZy5SYj1mdW5jdGlvbihjLGUsZixnKXtpZigxPT09ZS5ub2RlVHlwZSl7dmFyIGg9YS5nLmdldENvbXBvbmVudE5hbWVGb3JOb2RlKGUpO2lmKGgpe2M9Y3x8e307aWYoYy5jb21wb25lbnQpdGhyb3cgRXJyb3IoJ0Nhbm5vdCB1c2UgdGhlIFwiY29tcG9uZW50XCIgYmluZGluZyBvbiBhIGN1c3RvbSBlbGVtZW50IG1hdGNoaW5nIGEgY29tcG9uZW50Jyk7dmFyIGw9e25hbWU6aCxwYXJhbXM6YihlLGYpfTtjLmNvbXBvbmVudD1nP2Z1bmN0aW9uKCl7cmV0dXJuIGx9OlxyXG4gICAgICAgIGx9fXJldHVybiBjfTt2YXIgYz1uZXcgYS5TOzk+YS5hLkMmJihhLmcucmVnaXN0ZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3QuY3JlYXRlRWxlbWVudChiKTtyZXR1cm4gYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fShhLmcucmVnaXN0ZXIpLHQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudD1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1iKCksZj1hLmcuRWMsZztmb3IoZyBpbiBmKWYuaGFzT3duUHJvcGVydHkoZykmJmMuY3JlYXRlRWxlbWVudChnKTtyZXR1cm4gY319KHQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCkpfSkoKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhiLGMsZCl7Yz1jLnRlbXBsYXRlO2lmKCFjKXRocm93IEVycm9yKFwiQ29tcG9uZW50ICdcIitiK1wiJyBoYXMgbm8gdGVtcGxhdGVcIik7Yj1hLmEud2EoYyk7YS5mLmZhKGQsYil9ZnVuY3Rpb24gZChhLGIsYyxkKXt2YXIgZT1hLmNyZWF0ZVZpZXdNb2RlbDtyZXR1cm4gZT9lLmNhbGwoYSxcclxuICAgICAgICBkLHtlbGVtZW50OmIsdGVtcGxhdGVOb2RlczpjfSk6ZH12YXIgZT0wO2EuZC5jb21wb25lbnQ9e2luaXQ6ZnVuY3Rpb24oZixnLGgsbCxtKXtmdW5jdGlvbiBrKCl7dmFyIGE9ciYmci5kaXNwb3NlO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBhJiZhLmNhbGwocik7cT1yPW51bGx9dmFyIHIscSxwPWEuYS5XKGEuZi5jaGlsZE5vZGVzKGYpKTthLmEuRy5xYShmLGspO2EubShmdW5jdGlvbigpe3ZhciBsPWEuYS5jKGcoKSksaCx2O1wic3RyaW5nXCI9PT10eXBlb2YgbD9oPWw6KGg9YS5hLmMobC5uYW1lKSx2PWEuYS5jKGwucGFyYW1zKSk7aWYoIWgpdGhyb3cgRXJyb3IoXCJObyBjb21wb25lbnQgbmFtZSBzcGVjaWZpZWRcIik7dmFyIG49cT0rK2U7YS5nLmdldChoLGZ1bmN0aW9uKGUpe2lmKHE9PT1uKXtrKCk7aWYoIWUpdGhyb3cgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCAnXCIraCtcIidcIik7YyhoLGUsZik7dmFyIGw9ZChlLGYscCx2KTtlPW0uY3JlYXRlQ2hpbGRDb250ZXh0KGwsYixmdW5jdGlvbihhKXthLiRjb21wb25lbnQ9XHJcbiAgICAgICAgbDthLiRjb21wb25lbnRUZW1wbGF0ZU5vZGVzPXB9KTtyPWw7YS5oYihlLGYpfX0pfSxudWxsLHtpOmZ9KTtyZXR1cm57Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6ITB9fX07YS5mLmFhLmNvbXBvbmVudD0hMH0pKCk7dmFyIFE9e1wiY2xhc3NcIjpcImNsYXNzTmFtZVwiLFwiZm9yXCI6XCJodG1sRm9yXCJ9O2EuZC5hdHRyPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKCkpfHx7fTthLmEuRChkLGZ1bmN0aW9uKGMsZCl7ZD1hLmEuYyhkKTt2YXIgZz0hMT09PWR8fG51bGw9PT1kfHxkPT09bjtnJiZiLnJlbW92ZUF0dHJpYnV0ZShjKTs4Pj1hLmEuQyYmYyBpbiBRPyhjPVFbY10sZz9iLnJlbW92ZUF0dHJpYnV0ZShjKTpiW2NdPWQpOmd8fGIuc2V0QXR0cmlidXRlKGMsZC50b1N0cmluZygpKTtcIm5hbWVcIj09PWMmJmEuYS52YyhiLGc/XCJcIjpkLnRvU3RyaW5nKCkpfSl9fTsoZnVuY3Rpb24oKXthLmQuY2hlY2tlZD17YWZ0ZXI6W1widmFsdWVcIixcImF0dHJcIl0saW5pdDpmdW5jdGlvbihiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLGQpe2Z1bmN0aW9uIGUoKXt2YXIgZT1iLmNoZWNrZWQsZj1wP2coKTplO2lmKCFhLnhhLlZhKCkmJighbHx8ZSkpe3ZhciBoPWEubC53KGMpO2lmKGspe3ZhciBtPXI/aC5wKCk6aDtxIT09Zj8oZSYmKGEuYS5yYShtLGYsITApLGEuYS5yYShtLHEsITEpKSxxPWYpOmEuYS5yYShtLGYsZSk7ciYmYS5EYShoKSYmaChtKX1lbHNlIGEuaC5HYShoLGQsXCJjaGVja2VkXCIsZiwhMCl9fWZ1bmN0aW9uIGYoKXt2YXIgZD1hLmEuYyhjKCkpO2IuY2hlY2tlZD1rPzA8PWEuYS5vKGQsZygpKTpoP2Q6ZygpPT09ZH12YXIgZz1hLnJjKGZ1bmN0aW9uKCl7cmV0dXJuIGQuaGFzKFwiY2hlY2tlZFZhbHVlXCIpP2EuYS5jKGQuZ2V0KFwiY2hlY2tlZFZhbHVlXCIpKTpkLmhhcyhcInZhbHVlXCIpP2EuYS5jKGQuZ2V0KFwidmFsdWVcIikpOmIudmFsdWV9KSxoPVwiY2hlY2tib3hcIj09Yi50eXBlLGw9XCJyYWRpb1wiPT1iLnR5cGU7aWYoaHx8bCl7dmFyIG09YygpLGs9aCYmYS5hLmMobSlpbnN0YW5jZW9mIEFycmF5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByPSEoayYmbS5wdXNoJiZtLnNwbGljZSkscT1rP2coKTpuLHA9bHx8aztsJiYhYi5uYW1lJiZhLmQudW5pcXVlTmFtZS5pbml0KGIsZnVuY3Rpb24oKXtyZXR1cm4hMH0pO2EubShlLG51bGwse2k6Yn0pO2EuYS5xKGIsXCJjbGlja1wiLGUpO2EubShmLG51bGwse2k6Yn0pO209bn19fTthLmguZ2EuY2hlY2tlZD0hMDthLmQuY2hlY2tlZFZhbHVlPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXtiLnZhbHVlPWEuYS5jKGMoKSl9fX0pKCk7YS5kLmNzcz17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYygpKTtudWxsIT09ZCYmXCJvYmplY3RcIj09dHlwZW9mIGQ/YS5hLkQoZCxmdW5jdGlvbihjLGQpe2Q9YS5hLmMoZCk7YS5hLmZiKGIsYyxkKX0pOihkPWEuYS5jYihTdHJpbmcoZHx8XCJcIikpLGEuYS5mYihiLGIuX19rb19fY3NzVmFsdWUsITEpLGIuX19rb19fY3NzVmFsdWU9ZCxhLmEuZmIoYixkLCEwKSl9fTthLmQuZW5hYmxlPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKCkpO1xyXG4gICAgICAgIGQmJmIuZGlzYWJsZWQ/Yi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTpkfHxiLmRpc2FibGVkfHwoYi5kaXNhYmxlZD0hMCl9fTthLmQuZGlzYWJsZT17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7YS5kLmVuYWJsZS51cGRhdGUoYixmdW5jdGlvbigpe3JldHVybiFhLmEuYyhjKCkpfSl9fTthLmQuZXZlbnQ9e2luaXQ6ZnVuY3Rpb24oYixjLGQsZSxmKXt2YXIgZz1jKCl8fHt9O2EuYS5EKGcsZnVuY3Rpb24oZyl7XCJzdHJpbmdcIj09dHlwZW9mIGcmJmEuYS5xKGIsZyxmdW5jdGlvbihiKXt2YXIgbSxrPWMoKVtnXTtpZihrKXt0cnl7dmFyIHI9YS5hLlcoYXJndW1lbnRzKTtlPWYuJGRhdGE7ci51bnNoaWZ0KGUpO209ay5hcHBseShlLHIpfWZpbmFsbHl7ITAhPT1tJiYoYi5wcmV2ZW50RGVmYXVsdD9iLnByZXZlbnREZWZhdWx0KCk6Yi5yZXR1cm5WYWx1ZT0hMSl9ITE9PT1kLmdldChnK1wiQnViYmxlXCIpJiYoYi5jYW5jZWxCdWJibGU9ITAsYi5zdG9wUHJvcGFnYXRpb24mJmIuc3RvcFByb3BhZ2F0aW9uKCkpfX0pfSl9fTtcclxuICAgIGEuZC5mb3JlYWNoPXttYzpmdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1iKCksZD1hLmEuQmIoYyk7aWYoIWR8fFwibnVtYmVyXCI9PXR5cGVvZiBkLmxlbmd0aClyZXR1cm57Zm9yZWFjaDpjLHRlbXBsYXRlRW5naW5lOmEuWC52Yn07YS5hLmMoYyk7cmV0dXJue2ZvcmVhY2g6ZC5kYXRhLGFzOmQuYXMsaW5jbHVkZURlc3Ryb3llZDpkLmluY2x1ZGVEZXN0cm95ZWQsYWZ0ZXJBZGQ6ZC5hZnRlckFkZCxiZWZvcmVSZW1vdmU6ZC5iZWZvcmVSZW1vdmUsYWZ0ZXJSZW5kZXI6ZC5hZnRlclJlbmRlcixiZWZvcmVNb3ZlOmQuYmVmb3JlTW92ZSxhZnRlck1vdmU6ZC5hZnRlck1vdmUsdGVtcGxhdGVFbmdpbmU6YS5YLnZifX19LGluaXQ6ZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5kLnRlbXBsYXRlLmluaXQoYixhLmQuZm9yZWFjaC5tYyhjKSl9LHVwZGF0ZTpmdW5jdGlvbihiLGMsZCxlLGYpe3JldHVybiBhLmQudGVtcGxhdGUudXBkYXRlKGIsYS5kLmZvcmVhY2gubWMoYyksXHJcbiAgICAgICAgZCxlLGYpfX07YS5oLnZhLmZvcmVhY2g9ITE7YS5mLmFhLmZvcmVhY2g9ITA7YS5kLmhhc2ZvY3VzPXtpbml0OmZ1bmN0aW9uKGIsYyxkKXtmdW5jdGlvbiBlKGUpe2IuX19rb19oYXNmb2N1c1VwZGF0aW5nPSEwO3ZhciBmPWIub3duZXJEb2N1bWVudDtpZihcImFjdGl2ZUVsZW1lbnRcImluIGYpe3ZhciBnO3RyeXtnPWYuYWN0aXZlRWxlbWVudH1jYXRjaChrKXtnPWYuYm9keX1lPWc9PT1ifWY9YygpO2EuaC5HYShmLGQsXCJoYXNmb2N1c1wiLGUsITApO2IuX19rb19oYXNmb2N1c0xhc3RWYWx1ZT1lO2IuX19rb19oYXNmb2N1c1VwZGF0aW5nPSExfXZhciBmPWUuYmluZChudWxsLCEwKSxnPWUuYmluZChudWxsLCExKTthLmEucShiLFwiZm9jdXNcIixmKTthLmEucShiLFwiZm9jdXNpblwiLGYpO2EuYS5xKGIsXCJibHVyXCIsZyk7YS5hLnEoYixcImZvY3Vzb3V0XCIsZyl9LHVwZGF0ZTpmdW5jdGlvbihiLGMpe3ZhciBkPSEhYS5hLmMoYygpKTtiLl9fa29faGFzZm9jdXNVcGRhdGluZ3x8Yi5fX2tvX2hhc2ZvY3VzTGFzdFZhbHVlPT09XHJcbiAgICBkfHwoZD9iLmZvY3VzKCk6Yi5ibHVyKCksIWQmJmIuX19rb19oYXNmb2N1c0xhc3RWYWx1ZSYmYi5vd25lckRvY3VtZW50LmJvZHkuZm9jdXMoKSxhLmwudyhhLmEuRmEsbnVsbCxbYixkP1wiZm9jdXNpblwiOlwiZm9jdXNvdXRcIl0pKX19O2EuaC5nYS5oYXNmb2N1cz0hMDthLmQuaGFzRm9jdXM9YS5kLmhhc2ZvY3VzO2EuaC5nYS5oYXNGb2N1cz0hMDthLmQuaHRtbD17aW5pdDpmdW5jdGlvbigpe3JldHVybntjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczohMH19LHVwZGF0ZTpmdW5jdGlvbihiLGMpe2EuYS5FYihiLGMoKSl9fTtLKFwiaWZcIik7SyhcImlmbm90XCIsITEsITApO0soXCJ3aXRoXCIsITAsITEsZnVuY3Rpb24oYSxjKXtyZXR1cm4gYS5hYyhjKX0pO3ZhciBMPXt9O2EuZC5vcHRpb25zPXtpbml0OmZ1bmN0aW9uKGIpe2lmKFwic2VsZWN0XCIhPT1hLmEuQShiKSl0aHJvdyBFcnJvcihcIm9wdGlvbnMgYmluZGluZyBhcHBsaWVzIG9ubHkgdG8gU0VMRUNUIGVsZW1lbnRzXCIpO2Zvcig7MDxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5sZW5ndGg7KWIucmVtb3ZlKDApO3JldHVybntjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczohMH19LHVwZGF0ZTpmdW5jdGlvbihiLGMsZCl7ZnVuY3Rpb24gZSgpe3JldHVybiBhLmEuTWEoYi5vcHRpb25zLGZ1bmN0aW9uKGEpe3JldHVybiBhLnNlbGVjdGVkfSl9ZnVuY3Rpb24gZihhLGIsYyl7dmFyIGQ9dHlwZW9mIGI7cmV0dXJuXCJmdW5jdGlvblwiPT1kP2IoYSk6XCJzdHJpbmdcIj09ZD9hW2JdOmN9ZnVuY3Rpb24gZyhjLGUpe2lmKEEmJmspYS5qLmphKGIsYS5hLmMoZC5nZXQoXCJ2YWx1ZVwiKSksITApO2Vsc2UgaWYocC5sZW5ndGgpe3ZhciBmPTA8PWEuYS5vKHAsYS5qLnUoZVswXSkpO2EuYS53YyhlWzBdLGYpO0EmJiFmJiZhLmwudyhhLmEuRmEsbnVsbCxbYixcImNoYW5nZVwiXSl9fXZhciBoPWIubXVsdGlwbGUsbD0wIT1iLmxlbmd0aCYmaD9iLnNjcm9sbFRvcDpudWxsLG09YS5hLmMoYygpKSxrPWQuZ2V0KFwidmFsdWVBbGxvd1Vuc2V0XCIpJiZkLmhhcyhcInZhbHVlXCIpLHI9XHJcbiAgICAgICAgZC5nZXQoXCJvcHRpb25zSW5jbHVkZURlc3Ryb3llZFwiKTtjPXt9O3ZhciBxLHA9W107a3x8KGg/cD1hLmEuaWIoZSgpLGEuai51KTowPD1iLnNlbGVjdGVkSW5kZXgmJnAucHVzaChhLmoudShiLm9wdGlvbnNbYi5zZWxlY3RlZEluZGV4XSkpKTttJiYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIG0ubGVuZ3RoJiYobT1bbV0pLHE9YS5hLk1hKG0sZnVuY3Rpb24oYil7cmV0dXJuIHJ8fGI9PT1ufHxudWxsPT09Ynx8IWEuYS5jKGIuX2Rlc3Ryb3kpfSksZC5oYXMoXCJvcHRpb25zQ2FwdGlvblwiKSYmKG09YS5hLmMoZC5nZXQoXCJvcHRpb25zQ2FwdGlvblwiKSksbnVsbCE9PW0mJm0hPT1uJiZxLnVuc2hpZnQoTCkpKTt2YXIgQT0hMTtjLmJlZm9yZVJlbW92ZT1mdW5jdGlvbihhKXtiLnJlbW92ZUNoaWxkKGEpfTttPWc7ZC5oYXMoXCJvcHRpb25zQWZ0ZXJSZW5kZXJcIikmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGQuZ2V0KFwib3B0aW9uc0FmdGVyUmVuZGVyXCIpJiYobT1mdW5jdGlvbihiLGMpe2coMCxjKTtcclxuICAgICAgICBhLmwudyhkLmdldChcIm9wdGlvbnNBZnRlclJlbmRlclwiKSxudWxsLFtjWzBdLGIhPT1MP2I6bl0pfSk7YS5hLkRiKGIscSxmdW5jdGlvbihjLGUsZyl7Zy5sZW5ndGgmJihwPSFrJiZnWzBdLnNlbGVjdGVkP1thLmoudShnWzBdKV06W10sQT0hMCk7ZT1iLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtjPT09TD8oYS5hLmJiKGUsZC5nZXQoXCJvcHRpb25zQ2FwdGlvblwiKSksYS5qLmphKGUsbikpOihnPWYoYyxkLmdldChcIm9wdGlvbnNWYWx1ZVwiKSxjKSxhLmouamEoZSxhLmEuYyhnKSksYz1mKGMsZC5nZXQoXCJvcHRpb25zVGV4dFwiKSxnKSxhLmEuYmIoZSxjKSk7cmV0dXJuW2VdfSxjLG0pO2EubC53KGZ1bmN0aW9uKCl7az9hLmouamEoYixhLmEuYyhkLmdldChcInZhbHVlXCIpKSwhMCk6KGg/cC5sZW5ndGgmJmUoKS5sZW5ndGg8cC5sZW5ndGg6cC5sZW5ndGgmJjA8PWIuc2VsZWN0ZWRJbmRleD9hLmoudShiLm9wdGlvbnNbYi5zZWxlY3RlZEluZGV4XSkhPT1wWzBdOlxyXG4gICAgICAgIHAubGVuZ3RofHwwPD1iLnNlbGVjdGVkSW5kZXgpJiZhLmEuRmEoYixcImNoYW5nZVwiKX0pO2EuYS5TYyhiKTtsJiYyMDxNYXRoLmFicyhsLWIuc2Nyb2xsVG9wKSYmKGIuc2Nyb2xsVG9wPWwpfX07YS5kLm9wdGlvbnMuemI9YS5hLmUuSigpO2EuZC5zZWxlY3RlZE9wdGlvbnM9e2FmdGVyOltcIm9wdGlvbnNcIixcImZvcmVhY2hcIl0saW5pdDpmdW5jdGlvbihiLGMsZCl7YS5hLnEoYixcImNoYW5nZVwiLGZ1bmN0aW9uKCl7dmFyIGU9YygpLGY9W107YS5hLnIoYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKSxmdW5jdGlvbihiKXtiLnNlbGVjdGVkJiZmLnB1c2goYS5qLnUoYikpfSk7YS5oLkdhKGUsZCxcInNlbGVjdGVkT3B0aW9uc1wiLGYpfSl9LHVwZGF0ZTpmdW5jdGlvbihiLGMpe2lmKFwic2VsZWN0XCIhPWEuYS5BKGIpKXRocm93IEVycm9yKFwidmFsdWVzIGJpbmRpbmcgYXBwbGllcyBvbmx5IHRvIFNFTEVDVCBlbGVtZW50c1wiKTt2YXIgZD1hLmEuYyhjKCkpLGU9Yi5zY3JvbGxUb3A7XHJcbiAgICAgICAgZCYmXCJudW1iZXJcIj09dHlwZW9mIGQubGVuZ3RoJiZhLmEucihiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwib3B0aW9uXCIpLGZ1bmN0aW9uKGIpe3ZhciBjPTA8PWEuYS5vKGQsYS5qLnUoYikpO2Iuc2VsZWN0ZWQhPWMmJmEuYS53YyhiLGMpfSk7Yi5zY3JvbGxUb3A9ZX19O2EuaC5nYS5zZWxlY3RlZE9wdGlvbnM9ITA7YS5kLnN0eWxlPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKCl8fHt9KTthLmEuRChkLGZ1bmN0aW9uKGMsZCl7ZD1hLmEuYyhkKTtpZihudWxsPT09ZHx8ZD09PW58fCExPT09ZClkPVwiXCI7Yi5zdHlsZVtjXT1kfSl9fTthLmQuc3VibWl0PXtpbml0OmZ1bmN0aW9uKGIsYyxkLGUsZil7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgYygpKXRocm93IEVycm9yKFwiVGhlIHZhbHVlIGZvciBhIHN1Ym1pdCBiaW5kaW5nIG11c3QgYmUgYSBmdW5jdGlvblwiKTthLmEucShiLFwic3VibWl0XCIsZnVuY3Rpb24oYSl7dmFyIGQsZT1jKCk7dHJ5e2Q9ZS5jYWxsKGYuJGRhdGEsXHJcbiAgICAgICAgYil9ZmluYWxseXshMCE9PWQmJihhLnByZXZlbnREZWZhdWx0P2EucHJldmVudERlZmF1bHQoKTphLnJldHVyblZhbHVlPSExKX19KX19O2EuZC50ZXh0PXtpbml0OmZ1bmN0aW9uKCl7cmV0dXJue2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiEwfX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyl7YS5hLmJiKGIsYygpKX19O2EuZi5hYS50ZXh0PSEwOyhmdW5jdGlvbigpe2lmKHgmJngubmF2aWdhdG9yKXZhciBiPWZ1bmN0aW9uKGEpe2lmKGEpcmV0dXJuIHBhcnNlRmxvYXQoYVsxXSl9LGM9eC5vcGVyYSYmeC5vcGVyYS52ZXJzaW9uJiZwYXJzZUludCh4Lm9wZXJhLnZlcnNpb24oKSksZD14Lm5hdmlnYXRvci51c2VyQWdlbnQsZT1iKGQubWF0Y2goL14oPzooPyFjaHJvbWUpLikqdmVyc2lvblxcLyhbXiBdKikgc2FmYXJpL2kpKSxmPWIoZC5tYXRjaCgvRmlyZWZveFxcLyhbXiBdKikvKSk7aWYoMTA+YS5hLkMpdmFyIGc9YS5hLmUuSigpLGg9YS5hLmUuSigpLGw9ZnVuY3Rpb24oYil7dmFyIGM9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVFbGVtZW50OyhjPWMmJmEuYS5lLmdldChjLGgpKSYmYyhiKX0sbT1mdW5jdGlvbihiLGMpe3ZhciBkPWIub3duZXJEb2N1bWVudDthLmEuZS5nZXQoZCxnKXx8KGEuYS5lLnNldChkLGcsITApLGEuYS5xKGQsXCJzZWxlY3Rpb25jaGFuZ2VcIixsKSk7YS5hLmUuc2V0KGIsaCxjKX07YS5kLnRleHRJbnB1dD17aW5pdDpmdW5jdGlvbihiLGQsZyl7ZnVuY3Rpb24gbChjLGQpe2EuYS5xKGIsYyxkKX1mdW5jdGlvbiBoKCl7dmFyIGM9YS5hLmMoZCgpKTtpZihudWxsPT09Y3x8Yz09PW4pYz1cIlwiO3UhPT1uJiZjPT09dT9hLmEuc2V0VGltZW91dChoLDQpOmIudmFsdWUhPT1jJiYocz1jLGIudmFsdWU9Yyl9ZnVuY3Rpb24geSgpe3R8fCh1PWIudmFsdWUsdD1hLmEuc2V0VGltZW91dCh2LDQpKX1mdW5jdGlvbiB2KCl7Y2xlYXJUaW1lb3V0KHQpO3U9dD1uO3ZhciBjPWIudmFsdWU7cyE9PWMmJihzPWMsYS5oLkdhKGQoKSxnLFwidGV4dElucHV0XCIsYykpfXZhciBzPWIudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LHUseD05PT1hLmEuQz95OnY7MTA+YS5hLkM/KGwoXCJwcm9wZXJ0eWNoYW5nZVwiLGZ1bmN0aW9uKGEpe1widmFsdWVcIj09PWEucHJvcGVydHlOYW1lJiZ4KGEpfSksOD09YS5hLkMmJihsKFwia2V5dXBcIix2KSxsKFwia2V5ZG93blwiLHYpKSw4PD1hLmEuQyYmKG0oYix4KSxsKFwiZHJhZ2VuZFwiLHkpKSk6KGwoXCJpbnB1dFwiLHYpLDU+ZSYmXCJ0ZXh0YXJlYVwiPT09YS5hLkEoYik/KGwoXCJrZXlkb3duXCIseSksbChcInBhc3RlXCIseSksbChcImN1dFwiLHkpKToxMT5jP2woXCJrZXlkb3duXCIseSk6ND5mJiYobChcIkRPTUF1dG9Db21wbGV0ZVwiLHYpLGwoXCJkcmFnZHJvcFwiLHYpLGwoXCJkcm9wXCIsdikpKTtsKFwiY2hhbmdlXCIsdik7YS5tKGgsbnVsbCx7aTpifSl9fTthLmguZ2EudGV4dElucHV0PSEwO2EuZC50ZXh0aW5wdXQ9e3ByZXByb2Nlc3M6ZnVuY3Rpb24oYSxiLGMpe2MoXCJ0ZXh0SW5wdXRcIixhKX19fSkoKTthLmQudW5pcXVlTmFtZT17aW5pdDpmdW5jdGlvbihiLGMpe2lmKGMoKSl7dmFyIGQ9XCJrb191bmlxdWVfXCIrXHJcbiAgICAgICAgKythLmQudW5pcXVlTmFtZS5OYzthLmEudmMoYixkKX19fTthLmQudW5pcXVlTmFtZS5OYz0wO2EuZC52YWx1ZT17YWZ0ZXI6W1wib3B0aW9uc1wiLFwiZm9yZWFjaFwiXSxpbml0OmZ1bmN0aW9uKGIsYyxkKXtpZihcImlucHV0XCIhPWIudGFnTmFtZS50b0xvd2VyQ2FzZSgpfHxcImNoZWNrYm94XCIhPWIudHlwZSYmXCJyYWRpb1wiIT1iLnR5cGUpe3ZhciBlPVtcImNoYW5nZVwiXSxmPWQuZ2V0KFwidmFsdWVVcGRhdGVcIiksZz0hMSxoPW51bGw7ZiYmKFwic3RyaW5nXCI9PXR5cGVvZiBmJiYoZj1bZl0pLGEuYS50YShlLGYpLGU9YS5hLldiKGUpKTt2YXIgbD1mdW5jdGlvbigpe2g9bnVsbDtnPSExO3ZhciBlPWMoKSxmPWEuai51KGIpO2EuaC5HYShlLGQsXCJ2YWx1ZVwiLGYpfTshYS5hLkN8fFwiaW5wdXRcIiE9Yi50YWdOYW1lLnRvTG93ZXJDYXNlKCl8fFwidGV4dFwiIT1iLnR5cGV8fFwib2ZmXCI9PWIuYXV0b2NvbXBsZXRlfHxiLmZvcm0mJlwib2ZmXCI9PWIuZm9ybS5hdXRvY29tcGxldGV8fC0xIT1hLmEubyhlLFwicHJvcGVydHljaGFuZ2VcIil8fFxyXG4gICAgKGEuYS5xKGIsXCJwcm9wZXJ0eWNoYW5nZVwiLGZ1bmN0aW9uKCl7Zz0hMH0pLGEuYS5xKGIsXCJmb2N1c1wiLGZ1bmN0aW9uKCl7Zz0hMX0pLGEuYS5xKGIsXCJibHVyXCIsZnVuY3Rpb24oKXtnJiZsKCl9KSk7YS5hLnIoZSxmdW5jdGlvbihjKXt2YXIgZD1sO2EuYS5zZChjLFwiYWZ0ZXJcIikmJihkPWZ1bmN0aW9uKCl7aD1hLmoudShiKTthLmEuc2V0VGltZW91dChsLDApfSxjPWMuc3Vic3RyaW5nKDUpKTthLmEucShiLGMsZCl9KTt2YXIgbT1mdW5jdGlvbigpe3ZhciBlPWEuYS5jKGMoKSksZj1hLmoudShiKTtpZihudWxsIT09aCYmZT09PWgpYS5hLnNldFRpbWVvdXQobSwwKTtlbHNlIGlmKGUhPT1mKWlmKFwic2VsZWN0XCI9PT1hLmEuQShiKSl7dmFyIGc9ZC5nZXQoXCJ2YWx1ZUFsbG93VW5zZXRcIiksZj1mdW5jdGlvbigpe2Euai5qYShiLGUsZyl9O2YoKTtnfHxlPT09YS5qLnUoYik/YS5hLnNldFRpbWVvdXQoZiwwKTphLmwudyhhLmEuRmEsbnVsbCxbYixcImNoYW5nZVwiXSl9ZWxzZSBhLmouamEoYixcclxuICAgICAgICBlKX07YS5tKG0sbnVsbCx7aTpifSl9ZWxzZSBhLkxhKGIse2NoZWNrZWRWYWx1ZTpjfSl9LHVwZGF0ZTpmdW5jdGlvbigpe319O2EuaC5nYS52YWx1ZT0hMDthLmQudmlzaWJsZT17dXBkYXRlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYygpKSxlPVwibm9uZVwiIT1iLnN0eWxlLmRpc3BsYXk7ZCYmIWU/Yi5zdHlsZS5kaXNwbGF5PVwiXCI6IWQmJmUmJihiLnN0eWxlLmRpc3BsYXk9XCJub25lXCIpfX07KGZ1bmN0aW9uKGIpe2EuZFtiXT17aW5pdDpmdW5jdGlvbihjLGQsZSxmLGcpe3JldHVybiBhLmQuZXZlbnQuaW5pdC5jYWxsKHRoaXMsYyxmdW5jdGlvbigpe3ZhciBhPXt9O2FbYl09ZCgpO3JldHVybiBhfSxlLGYsZyl9fX0pKFwiY2xpY2tcIik7YS5QPWZ1bmN0aW9uKCl7fTthLlAucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlU291cmNlPWZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoXCJPdmVycmlkZSByZW5kZXJUZW1wbGF0ZVNvdXJjZVwiKTt9O2EuUC5wcm90b3R5cGUuY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrPVxyXG4gICAgICAgIGZ1bmN0aW9uKCl7dGhyb3cgRXJyb3IoXCJPdmVycmlkZSBjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2tcIik7fTthLlAucHJvdG90eXBlLm1ha2VUZW1wbGF0ZVNvdXJjZT1mdW5jdGlvbihiLGMpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBiKXtjPWN8fHQ7dmFyIGQ9Yy5nZXRFbGVtZW50QnlJZChiKTtpZighZCl0aHJvdyBFcnJvcihcIkNhbm5vdCBmaW5kIHRlbXBsYXRlIHdpdGggSUQgXCIrYik7cmV0dXJuIG5ldyBhLnYubihkKX1pZigxPT1iLm5vZGVUeXBlfHw4PT1iLm5vZGVUeXBlKXJldHVybiBuZXcgYS52LnNhKGIpO3Rocm93IEVycm9yKFwiVW5rbm93biB0ZW1wbGF0ZSB0eXBlOiBcIitiKTt9O2EuUC5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGU9ZnVuY3Rpb24oYSxjLGQsZSl7YT10aGlzLm1ha2VUZW1wbGF0ZVNvdXJjZShhLGUpO3JldHVybiB0aGlzLnJlbmRlclRlbXBsYXRlU291cmNlKGEsYyxkLGUpfTthLlAucHJvdG90eXBlLmlzVGVtcGxhdGVSZXdyaXR0ZW49ZnVuY3Rpb24oYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjKXtyZXR1cm4hMT09PXRoaXMuYWxsb3dUZW1wbGF0ZVJld3JpdGluZz8hMDp0aGlzLm1ha2VUZW1wbGF0ZVNvdXJjZShhLGMpLmRhdGEoXCJpc1Jld3JpdHRlblwiKX07YS5QLnByb3RvdHlwZS5yZXdyaXRlVGVtcGxhdGU9ZnVuY3Rpb24oYSxjLGQpe2E9dGhpcy5tYWtlVGVtcGxhdGVTb3VyY2UoYSxkKTtjPWMoYS50ZXh0KCkpO2EudGV4dChjKTthLmRhdGEoXCJpc1Jld3JpdHRlblwiLCEwKX07YS5iKFwidGVtcGxhdGVFbmdpbmVcIixhLlApO2EuSWI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsYyxkLGgpe2I9YS5oLkFiKGIpO2Zvcih2YXIgbD1hLmgudmEsbT0wO208Yi5sZW5ndGg7bSsrKXt2YXIgaz1iW21dLmtleTtpZihsLmhhc093blByb3BlcnR5KGspKXt2YXIgcj1sW2tdO2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiByKXtpZihrPXIoYlttXS52YWx1ZSkpdGhyb3cgRXJyb3Ioayk7fWVsc2UgaWYoIXIpdGhyb3cgRXJyb3IoXCJUaGlzIHRlbXBsYXRlIGVuZ2luZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnXCIrXHJcbiAgICAgICAgaytcIicgYmluZGluZyB3aXRoaW4gaXRzIHRlbXBsYXRlc1wiKTt9fWQ9XCJrby5fX3RyX2FtYnRucyhmdW5jdGlvbigkY29udGV4dCwkZWxlbWVudCl7cmV0dXJuKGZ1bmN0aW9uKCl7cmV0dXJueyBcIithLmguWGEoYix7dmFsdWVBY2Nlc3NvcnM6ITB9KStcIiB9IH0pKCl9LCdcIitkLnRvTG93ZXJDYXNlKCkrXCInKVwiO3JldHVybiBoLmNyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jayhkKStjfXZhciBjPS8oPChbYS16XStcXGQqKSg/OlxccysoPyFkYXRhLWJpbmRcXHMqPVxccyopW2EtejAtOVxcLV0rKD86PSg/OlxcXCJbXlxcXCJdKlxcXCJ8XFwnW15cXCddKlxcJ3xbXj5dKikpPykqXFxzKylkYXRhLWJpbmRcXHMqPVxccyooW1wiJ10pKFtcXHNcXFNdKj8pXFwzL2dpLGQ9L1xceDNjIS0tXFxzKmtvXFxiXFxzKihbXFxzXFxTXSo/KVxccyotLVxceDNlL2c7cmV0dXJue1RjOmZ1bmN0aW9uKGIsYyxkKXtjLmlzVGVtcGxhdGVSZXdyaXR0ZW4oYixkKXx8Yy5yZXdyaXRlVGVtcGxhdGUoYixmdW5jdGlvbihiKXtyZXR1cm4gYS5JYi5qZChiLFxyXG4gICAgICAgIGMpfSxkKX0samQ6ZnVuY3Rpb24oYSxmKXtyZXR1cm4gYS5yZXBsYWNlKGMsZnVuY3Rpb24oYSxjLGQsZSxrKXtyZXR1cm4gYihrLGMsZCxmKX0pLnJlcGxhY2UoZCxmdW5jdGlvbihhLGMpe3JldHVybiBiKGMsXCJcXHgzYyEtLSBrbyAtLVxceDNlXCIsXCIjY29tbWVudFwiLGYpfSl9LEpjOmZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuTi55YihmdW5jdGlvbihkLGgpe3ZhciBsPWQubmV4dFNpYmxpbmc7bCYmbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09YyYmYS5MYShsLGIsaCl9KX19fSgpO2EuYihcIl9fdHJfYW1idG5zXCIsYS5JYi5KYyk7KGZ1bmN0aW9uKCl7YS52PXt9O2Eudi5uPWZ1bmN0aW9uKGIpe2lmKHRoaXMubj1iKXt2YXIgYz1hLmEuQShiKTt0aGlzLmViPVwic2NyaXB0XCI9PT1jPzE6XCJ0ZXh0YXJlYVwiPT09Yz8yOlwidGVtcGxhdGVcIj09YyYmYi5jb250ZW50JiYxMT09PWIuY29udGVudC5ub2RlVHlwZT8zOjR9fTthLnYubi5wcm90b3R5cGUudGV4dD1mdW5jdGlvbigpe3ZhciBiPTE9PT1cclxuICAgIHRoaXMuZWI/XCJ0ZXh0XCI6Mj09PXRoaXMuZWI/XCJ2YWx1ZVwiOlwiaW5uZXJIVE1MXCI7aWYoMD09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5uW2JdO3ZhciBjPWFyZ3VtZW50c1swXTtcImlubmVySFRNTFwiPT09Yj9hLmEuRWIodGhpcy5uLGMpOnRoaXMubltiXT1jfTt2YXIgYj1hLmEuZS5KKCkrXCJfXCI7YS52Lm4ucHJvdG90eXBlLmRhdGE9ZnVuY3Rpb24oYyl7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGEuYS5lLmdldCh0aGlzLm4sYitjKTthLmEuZS5zZXQodGhpcy5uLGIrYyxhcmd1bWVudHNbMV0pfTt2YXIgYz1hLmEuZS5KKCk7YS52Lm4ucHJvdG90eXBlLm5vZGVzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcy5uO2lmKDA9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuKGEuYS5lLmdldChiLGMpfHx7fSkubWJ8fCgzPT09dGhpcy5lYj9iLmNvbnRlbnQ6ND09PXRoaXMuZWI/YjpuKTthLmEuZS5zZXQoYixjLHttYjphcmd1bWVudHNbMF19KX07YS52LnNhPWZ1bmN0aW9uKGEpe3RoaXMubj1cclxuICAgICAgICBhfTthLnYuc2EucHJvdG90eXBlPW5ldyBhLnYubjthLnYuc2EucHJvdG90eXBlLnRleHQ9ZnVuY3Rpb24oKXtpZigwPT1hcmd1bWVudHMubGVuZ3RoKXt2YXIgYj1hLmEuZS5nZXQodGhpcy5uLGMpfHx7fTtiLkpiPT09biYmYi5tYiYmKGIuSmI9Yi5tYi5pbm5lckhUTUwpO3JldHVybiBiLkpifWEuYS5lLnNldCh0aGlzLm4sYyx7SmI6YXJndW1lbnRzWzBdfSl9O2EuYihcInRlbXBsYXRlU291cmNlc1wiLGEudik7YS5iKFwidGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnRcIixhLnYubik7YS5iKFwidGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlXCIsYS52LnNhKX0pKCk7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGMsZCl7dmFyIGU7Zm9yKGM9YS5mLm5leHRTaWJsaW5nKGMpO2ImJihlPWIpIT09YzspYj1hLmYubmV4dFNpYmxpbmcoZSksZChlLGIpfWZ1bmN0aW9uIGMoYyxkKXtpZihjLmxlbmd0aCl7dmFyIGU9Y1swXSxmPWNbYy5sZW5ndGgtMV0sZz1lLnBhcmVudE5vZGUsaD1cclxuICAgICAgICBhLlMuaW5zdGFuY2Usbj1oLnByZXByb2Nlc3NOb2RlO2lmKG4pe2IoZSxmLGZ1bmN0aW9uKGEsYil7dmFyIGM9YS5wcmV2aW91c1NpYmxpbmcsZD1uLmNhbGwoaCxhKTtkJiYoYT09PWUmJihlPWRbMF18fGIpLGE9PT1mJiYoZj1kW2QubGVuZ3RoLTFdfHxjKSl9KTtjLmxlbmd0aD0wO2lmKCFlKXJldHVybjtlPT09Zj9jLnB1c2goZSk6KGMucHVzaChlLGYpLGEuYS5CYShjLGcpKX1iKGUsZixmdW5jdGlvbihiKXsxIT09Yi5ub2RlVHlwZSYmOCE9PWIubm9kZVR5cGV8fGEuVWIoZCxiKX0pO2IoZSxmLGZ1bmN0aW9uKGIpezEhPT1iLm5vZGVUeXBlJiY4IT09Yi5ub2RlVHlwZXx8YS5OLkNjKGIsW2RdKX0pO2EuYS5CYShjLGcpfX1mdW5jdGlvbiBkKGEpe3JldHVybiBhLm5vZGVUeXBlP2E6MDxhLmxlbmd0aD9hWzBdOm51bGx9ZnVuY3Rpb24gZShiLGUsZixoLHEpe3E9cXx8e307dmFyIHA9KGImJmQoYil8fGZ8fHt9KS5vd25lckRvY3VtZW50LG49cS50ZW1wbGF0ZUVuZ2luZXx8ZztcclxuICAgICAgICBhLkliLlRjKGYsbixwKTtmPW4ucmVuZGVyVGVtcGxhdGUoZixoLHEscCk7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGYubGVuZ3RofHwwPGYubGVuZ3RoJiZcIm51bWJlclwiIT10eXBlb2YgZlswXS5ub2RlVHlwZSl0aHJvdyBFcnJvcihcIlRlbXBsYXRlIGVuZ2luZSBtdXN0IHJldHVybiBhbiBhcnJheSBvZiBET00gbm9kZXNcIik7cD0hMTtzd2l0Y2goZSl7Y2FzZSBcInJlcGxhY2VDaGlsZHJlblwiOmEuZi5mYShiLGYpO3A9ITA7YnJlYWs7Y2FzZSBcInJlcGxhY2VOb2RlXCI6YS5hLnVjKGIsZik7cD0hMDticmVhaztjYXNlIFwiaWdub3JlVGFyZ2V0Tm9kZVwiOmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoXCJVbmtub3duIHJlbmRlck1vZGU6IFwiK2UpO31wJiYoYyhmLGgpLHEuYWZ0ZXJSZW5kZXImJmEubC53KHEuYWZ0ZXJSZW5kZXIsbnVsbCxbZixoLiRkYXRhXSkpO3JldHVybiBmfWZ1bmN0aW9uIGYoYixjLGQpe3JldHVybiBhLkkoYik/YigpOlwiZnVuY3Rpb25cIj09PXR5cGVvZiBiP2IoYyxkKTpifVxyXG4gICAgICAgIHZhciBnO2EuRmI9ZnVuY3Rpb24oYil7aWYoYiE9biYmIShiIGluc3RhbmNlb2YgYS5QKSl0aHJvdyBFcnJvcihcInRlbXBsYXRlRW5naW5lIG11c3QgaW5oZXJpdCBmcm9tIGtvLnRlbXBsYXRlRW5naW5lXCIpO2c9Yn07YS5DYj1mdW5jdGlvbihiLGMsayxoLHEpe2s9a3x8e307aWYoKGsudGVtcGxhdGVFbmdpbmV8fGcpPT1uKXRocm93IEVycm9yKFwiU2V0IGEgdGVtcGxhdGUgZW5naW5lIGJlZm9yZSBjYWxsaW5nIHJlbmRlclRlbXBsYXRlXCIpO3E9cXx8XCJyZXBsYWNlQ2hpbGRyZW5cIjtpZihoKXt2YXIgcD1kKGgpO3JldHVybiBhLkIoZnVuY3Rpb24oKXt2YXIgZz1jJiZjIGluc3RhbmNlb2YgYS5SP2M6bmV3IGEuUihjLG51bGwsbnVsbCxudWxsLHtleHBvcnREZXBlbmRlbmNpZXM6ITB9KSxuPWYoYixnLiRkYXRhLGcpLGc9ZShoLHEsbixnLGspO1wicmVwbGFjZU5vZGVcIj09cSYmKGg9ZyxwPWQoaCkpfSxudWxsLHt5YTpmdW5jdGlvbigpe3JldHVybiFwfHwhYS5hLnFiKHApfSxpOnAmJlxyXG4gICAgICAgIFwicmVwbGFjZU5vZGVcIj09cT9wLnBhcmVudE5vZGU6cH0pfXJldHVybiBhLk4ueWIoZnVuY3Rpb24oZCl7YS5DYihiLGMsayxkLFwicmVwbGFjZU5vZGVcIil9KX07YS5wZD1mdW5jdGlvbihiLGQsZyxoLHEpe2Z1bmN0aW9uIHAoYSxiKXtjKGIsdCk7Zy5hZnRlclJlbmRlciYmZy5hZnRlclJlbmRlcihiLGEpO3Q9bnVsbH1mdW5jdGlvbiBzKGEsYyl7dD1xLmNyZWF0ZUNoaWxkQ29udGV4dChhLGcuYXMsZnVuY3Rpb24oYSl7YS4kaW5kZXg9Y30pO3ZhciBkPWYoYixhLHQpO3JldHVybiBlKG51bGwsXCJpZ25vcmVUYXJnZXROb2RlXCIsZCx0LGcpfXZhciB0O3JldHVybiBhLkIoZnVuY3Rpb24oKXt2YXIgYj1hLmEuYyhkKXx8W107XCJ1bmRlZmluZWRcIj09dHlwZW9mIGIubGVuZ3RoJiYoYj1bYl0pO2I9YS5hLk1hKGIsZnVuY3Rpb24oYil7cmV0dXJuIGcuaW5jbHVkZURlc3Ryb3llZHx8Yj09PW58fG51bGw9PT1ifHwhYS5hLmMoYi5fZGVzdHJveSl9KTthLmwudyhhLmEuRGIsbnVsbCxbaCxiLFxyXG4gICAgICAgICAgICBzLGcscF0pfSxudWxsLHtpOmh9KX07dmFyIGg9YS5hLmUuSigpO2EuZC50ZW1wbGF0ZT17aW5pdDpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMoKSk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGR8fGQubmFtZSlhLmYuemEoYik7ZWxzZXtpZihcIm5vZGVzXCJpbiBkKXtpZihkPWQubm9kZXN8fFtdLGEuSShkKSl0aHJvdyBFcnJvcignVGhlIFwibm9kZXNcIiBvcHRpb24gbXVzdCBiZSBhIHBsYWluLCBub24tb2JzZXJ2YWJsZSBhcnJheS4nKTt9ZWxzZSBkPWEuZi5jaGlsZE5vZGVzKGIpO2Q9YS5hLm5jKGQpOyhuZXcgYS52LnNhKGIpKS5ub2RlcyhkKX1yZXR1cm57Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6ITB9fSx1cGRhdGU6ZnVuY3Rpb24oYixjLGQsZSxmKXt2YXIgZz1jKCk7Yz1hLmEuYyhnKTtkPSEwO2U9bnVsbDtcInN0cmluZ1wiPT10eXBlb2YgYz9jPXt9OihnPWMubmFtZSxcImlmXCJpbiBjJiYoZD1hLmEuYyhjW1wiaWZcIl0pKSxkJiZcImlmbm90XCJpbiBjJiYoZD0hYS5hLmMoYy5pZm5vdCkpKTtcclxuICAgICAgICAgICAgXCJmb3JlYWNoXCJpbiBjP2U9YS5wZChnfHxiLGQmJmMuZm9yZWFjaHx8W10sYyxiLGYpOmQ/KGY9XCJkYXRhXCJpbiBjP2YuYWMoYy5kYXRhLGMuYXMpOmYsZT1hLkNiKGd8fGIsZixjLGIpKTphLmYuemEoYik7Zj1lOyhjPWEuYS5lLmdldChiLGgpKSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYy5rJiZjLmsoKTthLmEuZS5zZXQoYixoLGYmJmYuY2EoKT9mOm4pfX07YS5oLnZhLnRlbXBsYXRlPWZ1bmN0aW9uKGIpe2I9YS5oLkFiKGIpO3JldHVybiAxPT1iLmxlbmd0aCYmYlswXS51bmtub3dufHxhLmguZmQoYixcIm5hbWVcIik/bnVsbDpcIlRoaXMgdGVtcGxhdGUgZW5naW5lIGRvZXMgbm90IHN1cHBvcnQgYW5vbnltb3VzIHRlbXBsYXRlcyBuZXN0ZWQgd2l0aGluIGl0cyB0ZW1wbGF0ZXNcIn07YS5mLmFhLnRlbXBsYXRlPSEwfSkoKTthLmIoXCJzZXRUZW1wbGF0ZUVuZ2luZVwiLGEuRmIpO2EuYihcInJlbmRlclRlbXBsYXRlXCIsYS5DYik7YS5hLmhjPWZ1bmN0aW9uKGEsYyxkKXtpZihhLmxlbmd0aCYmXHJcbiAgICAgICAgYy5sZW5ndGgpe3ZhciBlLGYsZyxoLGw7Zm9yKGU9Zj0wOyghZHx8ZTxkKSYmKGg9YVtmXSk7KytmKXtmb3IoZz0wO2w9Y1tnXTsrK2cpaWYoaC52YWx1ZT09PWwudmFsdWUpe2gubW92ZWQ9bC5pbmRleDtsLm1vdmVkPWguaW5kZXg7Yy5zcGxpY2UoZywxKTtlPWc9MDticmVha31lKz1nfX19O2EuYS5sYj1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixkLGUsZixnKXt2YXIgaD1NYXRoLm1pbixsPU1hdGgubWF4LG09W10sayxuPWIubGVuZ3RoLHEscD1kLmxlbmd0aCxzPXAtbnx8MSx0PW4rcCsxLHYsdSx4O2ZvcihrPTA7azw9bjtrKyspZm9yKHU9dixtLnB1c2godj1bXSkseD1oKHAsaytzKSxxPWwoMCxrLTEpO3E8PXg7cSsrKXZbcV09cT9rP2Jbay0xXT09PWRbcS0xXT91W3EtMV06aCh1W3FdfHx0LHZbcS0xXXx8dCkrMTpxKzE6aysxO2g9W107bD1bXTtzPVtdO2s9bjtmb3IocT1wO2t8fHE7KXA9bVtrXVtxXS0xLHEmJnA9PT1tW2tdW3EtMV0/bC5wdXNoKGhbaC5sZW5ndGhdPXtzdGF0dXM6ZSxcclxuICAgICAgICB2YWx1ZTpkWy0tcV0saW5kZXg6cX0pOmsmJnA9PT1tW2stMV1bcV0/cy5wdXNoKGhbaC5sZW5ndGhdPXtzdGF0dXM6Zix2YWx1ZTpiWy0ta10saW5kZXg6a30pOigtLXEsLS1rLGcuc3BhcnNlfHxoLnB1c2goe3N0YXR1czpcInJldGFpbmVkXCIsdmFsdWU6ZFtxXX0pKTthLmEuaGMocyxsLCFnLmRvbnRMaW1pdE1vdmVzJiYxMCpuKTtyZXR1cm4gaC5yZXZlcnNlKCl9cmV0dXJuIGZ1bmN0aW9uKGEsZCxlKXtlPVwiYm9vbGVhblwiPT09dHlwZW9mIGU/e2RvbnRMaW1pdE1vdmVzOmV9OmV8fHt9O2E9YXx8W107ZD1kfHxbXTtyZXR1cm4gYS5sZW5ndGg8ZC5sZW5ndGg/YihhLGQsXCJhZGRlZFwiLFwiZGVsZXRlZFwiLGUpOmIoZCxhLFwiZGVsZXRlZFwiLFwiYWRkZWRcIixlKX19KCk7YS5iKFwidXRpbHMuY29tcGFyZUFycmF5c1wiLGEuYS5sYik7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGMsZCxoLGwpe3ZhciBtPVtdLGs9YS5CKGZ1bmN0aW9uKCl7dmFyIGs9YyhkLGwsYS5hLkJhKG0sYikpfHxbXTswPFxyXG4gICAgbS5sZW5ndGgmJihhLmEudWMobSxrKSxoJiZhLmwudyhoLG51bGwsW2QsayxsXSkpO20ubGVuZ3RoPTA7YS5hLnRhKG0sayl9LG51bGwse2k6Yix5YTpmdW5jdGlvbigpe3JldHVybiFhLmEuVGIobSl9fSk7cmV0dXJue2VhOm0sQjprLmNhKCk/azpufX12YXIgYz1hLmEuZS5KKCksZD1hLmEuZS5KKCk7YS5hLkRiPWZ1bmN0aW9uKGUsZixnLGgsbCl7ZnVuY3Rpb24gbShiLGMpe3c9cVtjXTt1IT09YyYmKERbYl09dyk7dy50Yih1KyspO2EuYS5CYSh3LmVhLGUpO3QucHVzaCh3KTt6LnB1c2godyl9ZnVuY3Rpb24gayhiLGMpe2lmKGIpZm9yKHZhciBkPTAsZT1jLmxlbmd0aDtkPGU7ZCsrKWNbZF0mJmEuYS5yKGNbZF0uZWEsZnVuY3Rpb24oYSl7YihhLGQsY1tkXS5rYSl9KX1mPWZ8fFtdO2g9aHx8e307dmFyIHI9YS5hLmUuZ2V0KGUsYyk9PT1uLHE9YS5hLmUuZ2V0KGUsYyl8fFtdLHA9YS5hLmliKHEsZnVuY3Rpb24oYSl7cmV0dXJuIGEua2F9KSxzPWEuYS5sYihwLGYsaC5kb250TGltaXRNb3ZlcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdD1bXSx2PTAsdT0wLHg9W10sej1bXTtmPVtdO2Zvcih2YXIgRD1bXSxwPVtdLHcsQz0wLEIsRTtCPXNbQ107QysrKXN3aXRjaChFPUIubW92ZWQsQi5zdGF0dXMpe2Nhc2UgXCJkZWxldGVkXCI6RT09PW4mJih3PXFbdl0sdy5CJiYody5CLmsoKSx3LkI9biksYS5hLkJhKHcuZWEsZSkubGVuZ3RoJiYoaC5iZWZvcmVSZW1vdmUmJih0LnB1c2godyksei5wdXNoKHcpLHcua2E9PT1kP3c9bnVsbDpmW0NdPXcpLHcmJngucHVzaC5hcHBseSh4LHcuZWEpKSk7disrO2JyZWFrO2Nhc2UgXCJyZXRhaW5lZFwiOm0oQyx2KyspO2JyZWFrO2Nhc2UgXCJhZGRlZFwiOkUhPT1uP20oQyxFKToodz17a2E6Qi52YWx1ZSx0YjphLk8odSsrKX0sdC5wdXNoKHcpLHoucHVzaCh3KSxyfHwocFtDXT13KSl9YS5hLmUuc2V0KGUsYyx0KTtrKGguYmVmb3JlTW92ZSxEKTthLmEucih4LGguYmVmb3JlUmVtb3ZlP2EuYmE6YS5yZW1vdmVOb2RlKTtmb3IodmFyIEM9MCxyPWEuZi5maXJzdENoaWxkKGUpLEY7dz16W0NdO0MrKyl7dy5lYXx8XHJcbiAgICBhLmEuZXh0ZW5kKHcsYihlLGcsdy5rYSxsLHcudGIpKTtmb3Iodj0wO3M9dy5lYVt2XTtyPXMubmV4dFNpYmxpbmcsRj1zLHYrKylzIT09ciYmYS5mLmtjKGUscyxGKTshdy5hZCYmbCYmKGwody5rYSx3LmVhLHcudGIpLHcuYWQ9ITApfWsoaC5iZWZvcmVSZW1vdmUsZik7Zm9yKEM9MDtDPGYubGVuZ3RoOysrQylmW0NdJiYoZltDXS5rYT1kKTtrKGguYWZ0ZXJNb3ZlLEQpO2soaC5hZnRlckFkZCxwKX19KSgpO2EuYihcInV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmdcIixhLmEuRGIpO2EuWD1mdW5jdGlvbigpe3RoaXMuYWxsb3dUZW1wbGF0ZVJld3JpdGluZz0hMX07YS5YLnByb3RvdHlwZT1uZXcgYS5QO2EuWC5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGVTb3VyY2U9ZnVuY3Rpb24oYixjLGQsZSl7aWYoYz0oOT5hLmEuQz8wOmIubm9kZXMpP2Iubm9kZXMoKTpudWxsKXJldHVybiBhLmEuVyhjLmNsb25lTm9kZSghMCkuY2hpbGROb2Rlcyk7Yj1iLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gYS5hLm5hKGIsZSl9O2EuWC52Yj1uZXcgYS5YO2EuRmIoYS5YLnZiKTthLmIoXCJuYXRpdmVUZW1wbGF0ZUVuZ2luZVwiLGEuWCk7KGZ1bmN0aW9uKCl7YS54Yj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZWQ9ZnVuY3Rpb24oKXtpZighdXx8IXUudG1wbClyZXR1cm4gMDt0cnl7aWYoMDw9dS50bXBsLnRhZy50bXBsLm9wZW4udG9TdHJpbmcoKS5pbmRleE9mKFwiX19cIikpcmV0dXJuIDJ9Y2F0Y2goYSl7fXJldHVybiAxfSgpO3RoaXMucmVuZGVyVGVtcGxhdGVTb3VyY2U9ZnVuY3Rpb24oYixlLGYsZyl7Zz1nfHx0O2Y9Znx8e307aWYoMj5hKXRocm93IEVycm9yKFwiWW91ciB2ZXJzaW9uIG9mIGpRdWVyeS50bXBsIGlzIHRvbyBvbGQuIFBsZWFzZSB1cGdyYWRlIHRvIGpRdWVyeS50bXBsIDEuMC4wcHJlIG9yIGxhdGVyLlwiKTt2YXIgaD1iLmRhdGEoXCJwcmVjb21waWxlZFwiKTtofHwoaD1iLnRleHQoKXx8XCJcIixoPXUudGVtcGxhdGUobnVsbCxcInt7a29fd2l0aCAkaXRlbS5rb0JpbmRpbmdDb250ZXh0fX1cIitcclxuICAgICAgICBoK1wie3sva29fd2l0aH19XCIpLGIuZGF0YShcInByZWNvbXBpbGVkXCIsaCkpO2I9W2UuJGRhdGFdO2U9dS5leHRlbmQoe2tvQmluZGluZ0NvbnRleHQ6ZX0sZi50ZW1wbGF0ZU9wdGlvbnMpO2U9dS50bXBsKGgsYixlKTtlLmFwcGVuZFRvKGcuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7dS5mcmFnbWVudHM9e307cmV0dXJuIGV9O3RoaXMuY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrPWZ1bmN0aW9uKGEpe3JldHVyblwie3trb19jb2RlICgoZnVuY3Rpb24oKSB7IHJldHVybiBcIithK1wiIH0pKCkpIH19XCJ9O3RoaXMuYWRkVGVtcGxhdGU9ZnVuY3Rpb24oYSxiKXt0LndyaXRlKFwiPHNjcmlwdCB0eXBlPSd0ZXh0L2h0bWwnIGlkPSdcIithK1wiJz5cIitiK1wiXFx4M2Mvc2NyaXB0PlwiKX07MDxhJiYodS50bXBsLnRhZy5rb19jb2RlPXtvcGVuOlwiX18ucHVzaCgkMSB8fCAnJyk7XCJ9LHUudG1wbC50YWcua29fd2l0aD17b3BlbjpcIndpdGgoJDEpIHtcIixjbG9zZTpcIn0gXCJ9KX07YS54Yi5wcm90b3R5cGU9XHJcbiAgICAgICAgbmV3IGEuUDt2YXIgYj1uZXcgYS54YjswPGIuZWQmJmEuRmIoYik7YS5iKFwianF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lXCIsYS54Yil9KSgpfSl9KSgpO30pKCk7XHJcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kLFxuICAgIG5hdGl2ZUNyZWF0ZSAgICAgICA9IE9iamVjdC5jcmVhdGU7XG5cbiAgLy8gTmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOC4zJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIG90aGVyKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBIG1vc3RseS1pbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZFxuICAvLyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXJcbiAgLy8gaWRlbnRpdHksIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICB2YXIgY2IgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBjYih2YWx1ZSwgY29udGV4dCwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCB1bmRlZmluZWRPbmx5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICAgIGwgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoIXVuZGVmaW5lZE9ubHkgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIHZhciBiYXNlQ3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBwcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgLy8gQXZvaWRzIGEgdmVyeSBuYXN0eSBpT1MgOCBKSVQgYnVnIG9uIEFSTS02NC4gIzIwOTRcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBnZXRMZW5ndGggPSBwcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gIH07XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIHJlZHVjaW5nIGZ1bmN0aW9uIGl0ZXJhdGluZyBsZWZ0IG9yIHJpZ2h0LlxuICBmdW5jdGlvbiBjcmVhdGVSZWR1Y2UoZGlyKSB7XG4gICAgLy8gT3B0aW1pemVkIGl0ZXJhdG9yIGZ1bmN0aW9uIGFzIHVzaW5nIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAvLyBpbiB0aGUgbWFpbiBmdW5jdGlvbiB3aWxsIGRlb3B0aW1pemUgdGhlLCBzZWUgIzE5OTEuXG4gICAgZnVuY3Rpb24gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCkge1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICAgIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBpbml0aWFsIHZhbHVlIGlmIG5vbmUgaXMgcHJvdmlkZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgbWVtbyA9IG9ialtrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGRpcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXk7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGtleSA9IF8uZmluZEluZGV4KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0gXy5maW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwICYmIGtleSAhPT0gLTEpIHJldHVybiBvYmpba2V5XTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBmdW5jID0gaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXTtcbiAgICAgIHJldHVybiBmdW5jID09IG51bGwgPyBmdW5jIDogZnVuYy5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNldCA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBzZXQubGVuZ3RoO1xuICAgIHZhciBzaHVmZmxlZCA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCByYW5kOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKDAsIGluZGV4KTtcbiAgICAgIGlmIChyYW5kICE9PSBpbmRleCkgc2h1ZmZsZWRbaW5kZXhdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHNldFtpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRlZS5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICAgIChwcmVkaWNhdGUodmFsdWUsIGtleSwgb2JqKSA/IHBhc3MgOiBmYWlsKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgcmV0dXJuIF8uaW5pdGlhbChhcnJheSwgYXJyYXkubGVuZ3RoIC0gbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIF8ucmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBzdGFydEluZGV4KSB7XG4gICAgdmFyIG91dHB1dCA9IFtdLCBpZHggPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldLFxuICAgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG4gICAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgICAgaWYgKCFpIHx8IHNlZW4gIT09IGNvbXB1dGVkKSByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHNlZW4gPSBjb21wdXRlZDtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfLmNvbnRhaW5zKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuemlwKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ29tcGxlbWVudCBvZiBfLnppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXNcbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCBnZXRMZW5ndGgpLmxlbmd0aCB8fCAwO1xuICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IF8ucGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGZpbmRJbmRleCBhbmQgZmluZExhc3RJbmRleCBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoMSk7XG4gIF8uZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBpbmRleE9mIGFuZCBsYXN0SW5kZXhPZiBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlSW5kZXhGaW5kZXIoZGlyLCBwcmVkaWNhdGVGaW5kLCBzb3J0ZWRJbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgaXRlbSwgaWR4KSB7XG4gICAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICBpZiAodHlwZW9mIGlkeCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgaSA9IGlkeCA+PSAwID8gaWR4IDogTWF0aC5tYXgoaWR4ICsgbGVuZ3RoLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIF8uaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigxLCBfLmZpbmRJbmRleCwgXy5zb3J0ZWRJbmRleCk7XG4gIF8ubGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgXy5maW5kTGFzdEluZGV4KTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChzdG9wID09IG51bGwpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSBvYmplY3QuXG4gIC8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gIC8vIGNyZWF0ZWQgb2JqZWN0LlxuICBfLmNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIGlmIChwcm9wcykgXy5leHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIC8vIEl0J3MgZG9uZSBoZXJlIHNpbmNlIHdlIG9ubHkgbmVlZCB0aGVtIGZvciBvYmplY3RzIGFuZCBhcnJheXMgY29tcGFyaXNvbi5cbiAgICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gICAgYlN0YWNrID0gYlN0YWNrIHx8IFtdO1xuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoYXJlQXJyYXlzKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFlcShhW2xlbmd0aF0sIGJbbGVuZ3RoXSwgYVN0YWNrLCBiU3RhY2spKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgdmFyIGtleXMgPSBfLmtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgaWYgKF8ua2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBrZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSAmJiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopIHx8IF8uaXNBcmd1bWVudHMob2JqKSkpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBfLmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAsIGlzRXJyb3IuXG4gIF8uZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJywgJ0Vycm9yJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSA8IDkpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgLy8gSUUgMTEgKCMxNjIxKSwgYW5kIGluIFNhZmFyaSA4ICgjMTkyOSkuXG4gIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT09ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIF8ucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mXG4gIC8vIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXIgPSBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIGF0dHJzID0gXy5leHRlbmRPd24oe30sIGF0dHJzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5pc01hdGNoKG9iaiwgYXR0cnMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZFxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIF8ua2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9O1xuICBfLmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcbiAgXy51bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIGZhbGxiYWNrKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB2b2lkIDAgOiBvYmplY3RbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICB2YWx1ZSA9IGZhbGxiYWNrO1xuICAgIH1cbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVyLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZlc3QuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIF8ucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3h5IGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfLnByb3RvdHlwZS52YWx1ZU9mID0gXy5wcm90b3R5cGUudG9KU09OID0gXy5wcm90b3R5cGUudmFsdWU7XG5cbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImltcG9ydCB7S25vY2tvdXRJbml0aWFsaXplcn0gZnJvbSAnLi9rbm9ja291dC9Lbm9ja291dEluaXRpYWxpemVyJztcbmltcG9ydCB7UGFyYW1SZWFkZXJ9IGZyb20gJy4vY29tbW9uL1BhcmFtUmVhZGVyJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICcuL1JvdXRlcic7XG5pbXBvcnQge1NlcnZlckFjdGlvbnN9IGZyb20gJy4vY29tbW9uL1NlcnZlckFjdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuXG4gICAgcHJpdmF0ZSBwYXJhbVJlYWRlcjogUGFyYW1SZWFkZXI7XG4gICAgcHJpdmF0ZSBrbm9ja291dEluaXRpYWxpemVyOiBLbm9ja291dEluaXRpYWxpemVyO1xuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXI7XG4gICAgcHJpdmF0ZSBzZXJ2ZXJBY3Rpb25zOiBTZXJ2ZXJBY3Rpb25zO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICBrbm9ja291dEluaXRpYWxpemVyOiBLbm9ja291dEluaXRpYWxpemVyLFxuICAgICAgICBwYXJhbVJlYWRlcjogUGFyYW1SZWFkZXIsXG4gICAgICAgIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBzZXJ2ZXJBY3Rpb25zOiBTZXJ2ZXJBY3Rpb25zXG4gICAgKSB7XG4gICAgICAgIHRoaXMua25vY2tvdXRJbml0aWFsaXplciA9IGtub2Nrb3V0SW5pdGlhbGl6ZXI7XG4gICAgICAgIHRoaXMucGFyYW1SZWFkZXIgPSBwYXJhbVJlYWRlcjtcbiAgICAgICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XG4gICAgICAgIHRoaXMuc2VydmVyQWN0aW9ucyA9IHNlcnZlckFjdGlvbnM7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bigpIHtcbiAgICAgICAgbGV0IHJvb21JZCA9IHRoaXMucGFyYW1SZWFkZXIuZ2V0UXVlcnlWYXJpYWJsZSgncm9vbUlkJyk7XG5cbiAgICAgICAgdGhpcy5rbm9ja291dEluaXRpYWxpemVyLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIucmVuZGVyTGF5b3V0KCk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIucmVuZGVyUGFnZShyb29tSWQpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Q29udGVudERlcGVuZGVuY2llc30gZnJvbSAnLi9jb250ZW50L0NvbnRlbnREZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHtLbm9ja291dERlcGVuZGVuY2llc30gZnJvbSAnLi9rbm9ja291dC9rbm9ja291dERlcGVuZGVuY2llcyc7XG5pbXBvcnQge1BhcmFtUmVhZGVyfSBmcm9tICcuL2NvbW1vbi9QYXJhbVJlYWRlcic7XG5pbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tICcuL0FwcGxpY2F0aW9uJztcbmltcG9ydCB7VXNlckFjdGlvbnN9IGZyb20gJy4vVXNlckFjdGlvbnMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJy4vUm91dGVyJztcbmltcG9ydCB7U2VydmVyQWN0aW9uc30gZnJvbSAnLi9jb21tb24vU2VydmVyQWN0aW9ucyc7XG5pbXBvcnQge1hoclJlcXVlc3R9IGZyb20gJy4vY29tbW9uL1hoclJlcXVlc3QnO1xuaW1wb3J0IEZvcmdlID0gcmVxdWlyZSgnZm9yZ2UtZGknKTtcbmltcG9ydCB7WGhyUG9zdH0gZnJvbSAnLi9jb21tb24vWGhyUG9zdCc7XG5cbmV4cG9ydCBjbGFzcyBEZXBlbmRlbmNpZXMge1xuICAgIHByaXZhdGUgZm9yZ2U6IEZvcmdlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZvcmdlID0gbmV3IEZvcmdlKCk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBPYmplY3Q+KG5hbWU6IHN0cmluZyk6IFQge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JnZS5nZXQobmFtZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJlZ2lzdGVyRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ25hbWUnKS50by5pbnN0YW5jZSgnJyk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnYXBwbGljYXRpb24nKS50by50eXBlKEFwcGxpY2F0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckRPTUVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJBcHBEZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5yZWdpc3RlclNlcnZlckRhdGEoKTtcbiAgICAgICAgbmV3IENvbnRlbnREZXBlbmRlbmNpZXModGhpcy5mb3JnZSk7XG4gICAgICAgIG5ldyBLbm9ja291dERlcGVuZGVuY2llcyh0aGlzLmZvcmdlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHJlZ2lzdGVyU2VydmVyRGF0YSgpIHtcbiAgICAgICAgbGV0IHNlcnZlckFjdGlvbnMgPSB0aGlzLmZvcmdlLmdldDxTZXJ2ZXJBY3Rpb25zPignc2VydmVyQWN0aW9ucycpO1xuICAgICAgICBsZXQgcm9vbXMgPSBhd2FpdCBzZXJ2ZXJBY3Rpb25zLmdldFJvb21zKCk7XG4gICAgICAgIGxldCBjb21tb25Jc3N1ZXMgPSBhd2FpdCBzZXJ2ZXJBY3Rpb25zLmdldENvbW1vbklzc3VlcygpO1xuXG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgncm9vbXMnKS50by5pbnN0YW5jZShyb29tcyk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnY29tbW9uSXNzdWVzJykudG8uaW5zdGFuY2UoY29tbW9uSXNzdWVzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZ2lzdGVyQXBwRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3BhcmFtUmVhZGVyJykudG8udHlwZShQYXJhbVJlYWRlcik7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgndXNlckFjdGlvbnMnKS50by50eXBlKFVzZXJBY3Rpb25zKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdyb3V0ZXInKS50by50eXBlKFJvdXRlcik7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgneGhyUmVxdWVzdCcpLnRvLnR5cGUoWGhyUmVxdWVzdCk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgneGhyUG9zdCcpLnRvLnR5cGUoWGhyUG9zdCk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnc2VydmVyQWN0aW9ucycpLnRvLnR5cGUoU2VydmVyQWN0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWdpc3RlckRPTUVsZW1lbnRzKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICAgICAgICBsZXQgc2lkZWJhck5vZGUgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXInKTtcblxuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3Jvb3ROb2RlJykudG8uaW5zdGFuY2Uobm9kZSk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnc2lkZWJhck5vZGUnKS50by5pbnN0YW5jZShzaWRlYmFyTm9kZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtpc0NvbXBvbmVudE5hbWV9IGZyb20gJy4va25vY2tvdXQvY29uZmlnL0NvbXBvbmVudHMnO1xuaW1wb3J0ICogYXMga28gZnJvbSAna25vY2tvdXQnO1xuaW1wb3J0IHtDb21wb25lbnRSZXNvbHZlcn0gZnJvbSAnLi9jb250ZW50L2NvbXBvbmVudHMvQ29tcG9uZW50UmVzb2x2ZXInO1xuaW1wb3J0IHtQYWdlUmVuZGVyZXJ9IGZyb20gJy4vY29udGVudC9QYWdlUmVuZGVyZXInO1xuXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBsYXlvdXRNYXAgPSB7XG4gICAgICAgICdncm91cHMnOiAncm9vbUdyb3VwcycsXG4gICAgICAgICdjaXJjbGUnOiAncm9vbUNpcmN1bGFyJyxcbiAgICAgICAgJ2FuZ2xlZCc6ICdyb29tR3JvdXBzQW5nbGVkJ1xuICAgIH07XG4gICAgcHJpdmF0ZSBwYWdlUmVuZGVyZXI6IFBhZ2VSZW5kZXJlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IElOSVRJQUxfUEFHRSA9ICdob21lJztcbiAgICBwcml2YXRlIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRSZXNvbHZlcjtcbiAgICBwcml2YXRlIHJvb21zOiBBcnJheTxhbnk+O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICBwYWdlUmVuZGVyZXI6IFBhZ2VSZW5kZXJlcixcbiAgICAgICAgY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudFJlc29sdmVyLFxuICAgICAgICByb29tczogQXJyYXk8YW55PlxuICAgICkge1xuICAgICAgICB0aGlzLnBhZ2VSZW5kZXJlciA9IHBhZ2VSZW5kZXJlcjtcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZXNvbHZlciA9IGNvbXBvbmVudFJlc29sdmVyO1xuICAgICAgICB0aGlzLnJvb21zID0gcm9vbXM7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlckxheW91dCgpIHtcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIuZ2V0Q29tcG9uZW50QnlNb2R1bGVOYW1lKCdzaWRlYmFyJyk7XG4gICAgICAgIGtvLmFwcGx5QmluZGluZ3MoY29tcG9uZW50LCB0aGlzLnBhZ2VSZW5kZXJlci5nZXRMYXlvdXROb2RlKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXJQYWdlKHJvb21JZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxldCByb29tID0gdGhpcy5yb29tcy5maWx0ZXIoKHJvb20pID0+IHJvb20ucm9vbUlkID09PSByb29tSWQpWzBdO1xuICAgICAgICBsZXQgY29tcG9uZW50TmFtZSA9IHRoaXMuZ2V0Q29tcG9uZW50TmFtZUJ5Um9vbUlkKHJvb20pO1xuICAgICAgICBjb25zb2xlLmxvZygnbG9hZGluZyBjb21wb25lbnQ6IFwiJyArIGNvbXBvbmVudE5hbWUgKyAnXCInKTtcblxuICAgICAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRSZXNvbHZlci5nZXRDb21wb25lbnRCeU1vZHVsZU5hbWUoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGNvbXBvbmVudCk7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5wYWdlUmVuZGVyZXIucmVuZGVyUm9vdENvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpO1xuXG4gICAgICAgIGtvLmFwcGx5QmluZGluZ3MoY29tcG9uZW50LCBub2RlKTtcbiAgICAgICAgY29tcG9uZW50Lm9uTG9hZChyb29tKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbXBvbmVudE5hbWVCeVJvb21JZChyb29tKSB7XG4gICAgICAgIGxldCBjb21wb25lbnROYW1lID0gdGhpcy5JTklUSUFMX1BBR0U7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByb29tICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBSb3V0ZXIubGF5b3V0TWFwW3Jvb20ubGF5b3V0XTtcbiAgICAgICAgICAgIGlmIChpc0NvbXBvbmVudE5hbWUobmFtZSkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZSA9IG5hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGByb3V0ZTogXCIke25hbWV9XCIgbm90IGZvdW5kLCByZWRpcmVjdGluZyB0byBob21lIHBhZ2UuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcG9uZW50TmFtZTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0lzc3VlfSBmcm9tICcuL2NvbW1vbi9Jc3N1ZSc7XG5pbXBvcnQge1hoclBvc3R9IGZyb20gJy4vY29tbW9uL1hoclBvc3QnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVXNlckFjdGlvbnMge1xuICAgIHByaXZhdGUgeGhyUG9zdDogWGhyUG9zdDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4aHJQb3N0OiBYaHJQb3N0KSB7XG4gICAgICAgIHRoaXMueGhyUG9zdCA9IHhoclBvc3Q7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHNlbmROZXdDb21tb25Jc3N1ZVRvU2VydmVyKGNvbW1vbklzc3VlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMueGhyUG9zdC5wb3N0SnNvblRvVXJsKCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYWRkQ29tbW9uSXNzdWUnLCBKU09OLnN0cmluZ2lmeShjb21tb25Jc3N1ZSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBzZW5kSXNzdWVzVG9NYWlsU2VydmVyKGlzc3VlczogaXNzdWVNZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnhoclBvc3QucG9zdEpzb25Ub1VybCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3NlbmRNYWlsJywgSlNPTi5zdHJpbmdpZnkoaXNzdWVzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHNlbmRDaGFuZ2VSb29tQ29udGFjdFRvTWFpbFNlcnZlcihyb29tOiBzdHJpbmcsIGNoYW5nZVJvb21Db250YWN0OiBjaGFuZ2VSb29tQ29udGFjdEJvZHkpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMueGhyUG9zdC5wb3N0SnNvblRvVXJsKCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvY2hhbmdlUm9vbUNvbnRhY3QvJyArIHJvb20sIEpTT04uc3RyaW5naWZ5KGNoYW5nZVJvb21Db250YWN0KSk7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgY2hhbmdlUm9vbUNvbnRhY3RCb2R5IHtcbiAgICBjb250YWN0OiBzdHJpbmc7XG4gICAgY29udGFjdE1haWw6IHN0cmluZztcbn1cblxuXG5pbnRlcmZhY2UgaXNzdWVNZXNzYWdlIHtcbiAgICBpc3N1ZXM6IEFycmF5PElzc3VlPjtcbiAgICBhZGRUZWFjaGVyc1RvTWFpbExpc3Q6IGJvb2xlYW47XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cblxuaW1wb3J0IHtwb2x5ZmlsbH0gZnJvbSAnZXM2LXByb21pc2UnO1xuaW1wb3J0IHtEZXBlbmRlbmNpZXN9IGZyb20gJy4vRGVwZW5kZW5jaWVzJztcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vQXBwbGljYXRpb24nO1xuXG5wb2x5ZmlsbCgpO1xuXG5uZXcgZnVuY3Rpb24gKCkge1xuICAgIG5ldyBEZXBlbmRlbmNpZXMoKVxuICAgICAgICAucmVnaXN0ZXJEZXBlbmRlbmNpZXMoKVxuICAgICAgICAudGhlbigoZGVwZW5kZW5jaWVzKSA9PiB7XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICAuZ2V0PEFwcGxpY2F0aW9uPignYXBwbGljYXRpb24nKVxuICAgICAgICAgICAgICAgIC5ydW4oKTtcbiAgICAgICAgfSk7XG59KCk7XG5cblxuXG5cbiIsImV4cG9ydCBjbGFzcyBJc3N1ZSB7XG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG4gICAgcHVibGljIGRldmljZUlkOiBudW1iZXI7XG4gICAgcHVibGljIHJlY2lwaWVudHM6IEFycmF5PHN0cmluZz47XG4gICAgcHVibGljIHJvb21JZDogc3RyaW5nO1xuICAgIHB1YmxpYyBpc3N1ZUlkOiBudW1iZXI7XG59XG4iLCJpbXBvcnQge0lzc3VlfSBmcm9tICcuL0lzc3VlJztcblxuZXhwb3J0IGNsYXNzIElzc3VlRm9ybUNvbnRhaW5lciB7XG5cbiAgICBwcml2YXRlIGlzc3VlQ29udGFpbmVyID0gW107XG5cblxuICAgIHB1YmxpYyBhZGRJc3N1ZShpc3N1ZTogSXNzdWUpIHtcbiAgICAgICAgdGhpcy5pc3N1ZUNvbnRhaW5lci5wdXNoKGlzc3VlKTtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCBjbGFzcyBQYXJhbVJlYWRlciB7XG4gICAgcHVibGljIGdldFF1ZXJ5VmFyaWFibGUodmFyaWFibGUpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcbiAgICAgICAgbGV0IHZhcnMgPSBxdWVyeS5zcGxpdCgnJicpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwYWlyID0gdmFyc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgaWYgKGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKSA9PSB2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAvLyB0aHJvdyBFcnJvcignUXVlcnkgdmFyaWFibGUgJyArIHZhcmlhYmxlICsgJyBub3QgZm91bmQnKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVzb2x2ZXI8VD4ge1xuICAgIHByaXZhdGUgY2xhc3NlczogQXJyYXk8VD47XG5cbiAgICAvL3RvZG8gYWRkIGNhY2hpbmdcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY2xhc3NlczogQXJyYXk8VD4pIHtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gY2xhc3NlcztcbiAgICB9XG5cbiAgICAvL3RvZG8gY29uc2lkZXIgc3Ryb25nZXIgdHlwZSBmb3IgY2xhc3NUb1Jlc29sdmVcbiAgICBwdWJsaWMgZ2V0U2VydmljZUJ5Sm9iTmFtZShjbGFzc1RvUmVzb2x2ZTogc3RyaW5nKTogVCB7XG4gICAgICAgIGxldCByZWMgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzZXNbaW5kZXhdLmNvbnN0cnVjdG9yLm5hbWUgPT09IGNsYXNzVG9SZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tpbmRleF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA8IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCByZXNvbHZlIHNlcnZpY2U6ICcgKyBjbGFzc1RvUmVzb2x2ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWMoaW5kZXggLSAxKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHJldHVybiByZWModGhpcy5jbGFzc2VzLmxlbmd0aCAtIDEpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7WGhyUmVxdWVzdH0gZnJvbSAnLi9YaHJSZXF1ZXN0JztcblxuZXhwb3J0IGNsYXNzIFNlcnZlckFjdGlvbnMge1xuICAgIHByaXZhdGUgeGhyUmVxdWVzdDogWGhyUmVxdWVzdDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4aHJSZXF1ZXN0OiBYaHJSZXF1ZXN0KSB7XG4gICAgICAgIHRoaXMueGhyUmVxdWVzdCA9IHhoclJlcXVlc3Q7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGdldENvbW1vbklzc3VlcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgY29tbW9uSXNzdWVzID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnhoclJlcXVlc3QucmVxdWVzdEZyb21VcmwoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9jb21tb25Jc3N1ZXMnKTtcbiAgICAgICAgICAgIGNvbW1vbklzc3VlcyA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21tb25Jc3N1ZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGdldFJvb21zKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCByb29tcyA9IFtdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnhoclJlcXVlc3QucmVxdWVzdEZyb21VcmwoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9yb29tcycpO1xuICAgICAgICAgICAgcm9vbXMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm9vbXM7XG4gICAgfVxuXG4gICAgcHVibGljIHNlbmRNYWlsKCkge1xuICAgICAgICAvLyB0b2RvIGltcGxlbWVudFxuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBYaHJQb3N0IHtcblxuICAgIHB1YmxpYyBwb3N0SnNvblRvVXJsKHVybCwganNvblN0cmluZykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ3RpbWVvdXQnKTtcbiAgICAgICAgICAgIH0sIDYwMDAwKTtcblxuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcignY2FjaGUtY29udHJvbCcsICduby1jYWNoZScpO1xuXG4gICAgICAgICAgICB4aHIuc2VuZChqc29uU3RyaW5nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFhoclJlcXVlc3Qge1xuXG4gICAgcHVibGljIHJlcXVlc3RGcm9tVXJsKHJlcXVlc3RVcmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogKHJlc3BvbnNlOiBzdHJpbmcpID0+IHZvaWQsIHJlamVjdDogKGVycm9yOiBzdHJpbmcgfCBFcnJvcikgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTogbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHhocjogWE1MSHR0cFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJlc3BvbnNlVGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ25vcGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCByZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcImNhY2hlLWNvbnRyb2xcIiwgXCJuby1jYWNoZVwiKTtcblxuICAgICAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7U2lkZWJhcn0gZnJvbSAnLi9jb21wb25lbnRzL3NpZGViYXIvc2lkZWJhcic7XG5pbXBvcnQge1BhZ2VSZW5kZXJlcn0gZnJvbSAnLi9QYWdlUmVuZGVyZXInO1xuaW1wb3J0IHtIb21lfSBmcm9tICcuL2NvbXBvbmVudHMvaG9tZS9ob21lJztcbmltcG9ydCB7Q29tcG9uZW50UmVzb2x2ZXJ9IGZyb20gJy4vY29tcG9uZW50cy9Db21wb25lbnRSZXNvbHZlcic7XG5pbXBvcnQgRm9yZ2UgPSByZXF1aXJlKFwiZm9yZ2UtZGlcIik7XG5pbXBvcnQge1Jvb21Hcm91cHN9IGZyb20gJy4vY29tcG9uZW50cy9yb29tR3JvdXBzL3Jvb21Hcm91cHMnO1xuaW1wb3J0IHtSb29tR3JvdXBzQW5nbGVkfSBmcm9tICcuL2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkJztcbmltcG9ydCB7Um9vbUNpcmN1bGFyfSBmcm9tICcuL2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhcic7XG5pbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5cbmV4cG9ydCBjbGFzcyBDb250ZW50RGVwZW5kZW5jaWVzIHtcbiAgICBwcml2YXRlIGZvcmdlOiBGb3JnZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihmb3JnZTogRm9yZ2UpIHtcbiAgICAgICAgdGhpcy5mb3JnZSA9IGZvcmdlO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQ29tcG9uZW50cygpO1xuICAgICAgICAvLyB0aGlzLnJlZ2lzdGVyQ29udHJvbGxlcnMoKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck90aGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyT3RoZXIoKSB7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgndmlld01vZGVsVXBkYXRlcicpLnRvLnR5cGUoVmlld01vZGVsVXBkYXRlcik7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgncGFnZVJlbmRlcmVyJykudG8udHlwZShQYWdlUmVuZGVyZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2lzc3VlRm9ybUNvbnRhaW5lcicpLnRvLnR5cGUoSXNzdWVGb3JtQ29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJDb21wb25lbnRzKCkge1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudHMnKS50by50eXBlKEhvbWUpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudHMnKS50by50eXBlKFNpZGViYXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudHMnKS50by50eXBlKFJvb21Hcm91cHMpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudHMnKS50by50eXBlKFJvb21Hcm91cHNBbmdsZWQpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudHMnKS50by50eXBlKFJvb21DaXJjdWxhcik7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnY29tcG9uZW50UmVzb2x2ZXInKS50by50eXBlKENvbXBvbmVudFJlc29sdmVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJDb250cm9sbGVycygpIHtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRDb250cm9sbGVyTWFwcGluZycpLnRvLmluc3RhbmNlKGNvbXBvbmVudENvbnRyb2xsZXJNYXBwaW5nKTtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb250cm9sbGVycycpLnRvLnR5cGUoU2lkZWJhckNvbnRyb2xsZXIpO1xuICAgICAgICAvLyB0aGlzLmZvcmdlLmJpbmQoJ2NvbnRyb2xsZXJzJykudG8udHlwZShTaW5nbGVDb21wb25lbnRDb250cm9sbGVyKTtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb250cm9sbGVycycpLnRvLnR5cGUoSG9tZUNvbnRyb2xsZXIpO1xuICAgICAgICAvLyB0aGlzLmZvcmdlLmJpbmQoJ2NvbnRyb2xsZXJSZXNvbHZlcicpLnRvLnR5cGUoQ29udHJvbGxlclJlc29sdmVyKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL0NvbXBvbmVudCc7XG5cbmV4cG9ydCBjbGFzcyBQYWdlUmVuZGVyZXIge1xuICAgIHByaXZhdGUgcm9vdE5vZGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgc2lkZWJhck5vZGU6IEhUTUxFbGVtZW50O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHJvb3ROb2RlOiBIVE1MRWxlbWVudCwgc2lkZWJhck5vZGU6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGUgPSByb290Tm9kZTtcbiAgICAgICAgdGhpcy5zaWRlYmFyTm9kZSA9IHNpZGViYXJOb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMYXlvdXROb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaWRlYmFyTm9kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyUm9vdENvbXBvbmVudChtb2R1bGVOYW1lOiBzdHJpbmcsIGNvbXBvbmVudDogQ29tcG9uZW50KTogYW55IHtcbiAgICAgICAgdGhpcy5yb290Tm9kZS5pbm5lckhUTUwgPSBgPGRpdj48ZGl2IGlkPVwiJHttb2R1bGVOYW1lfVwiIGRhdGEtYmluZD0nY29tcG9uZW50OiBcIiR7bW9kdWxlTmFtZX1cIic+PC9kaXY+PC9kaXY+YDtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnJvb3ROb2RlLmNoaWxkcmVuWzBdO1xuICAgICAgICBjb21wb25lbnQub25SZW5kZXIoKTtcblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG59XG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50IHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCB1cGRhdGU6ICgpID0+IHZvaWQ7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFVwZGF0ZSgpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvblJlbmRlcigpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWQocm9vbT86IGFueSkge1xuXG4gICAgfVxuXG4gICAgcHVibGljIG9uSW5pdCgpIHtcbiAgICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHtSZXNvbHZlcn0gZnJvbSAnLi4vLi4vY29tbW9uL1Jlc29sdmVyJztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudFJlc29sdmVyIGV4dGVuZHMgUmVzb2x2ZXI8Q29tcG9uZW50PiB7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRMaXN0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbXBvbmVudHM6IEFycmF5PENvbXBvbmVudD4sIGNvbXBvbmVudENsYXNzTWFwcGluZzogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICAgICAgICBzdXBlcihjb21wb25lbnRzKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRMaXN0ID0gY29tcG9uZW50Q2xhc3NNYXBwaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb21wb25lbnQoY2xhc3NUb1Jlc29sdmU6IHN0cmluZyk6IENvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRTZXJ2aWNlQnlKb2JOYW1lKGNsYXNzVG9SZXNvbHZlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50QnlNb2R1bGVOYW1lKG1vZHVsZU5hbWU6IHN0cmluZyk6IENvbXBvbmVudCB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb21wb25lbnRMaXN0W21vZHVsZU5hbWVdICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbm90IGZvdW5kOiAnICsgbW9kdWxlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2xhc3NUb1Jlc29sdmUgPSB0aGlzLmNvbXBvbmVudExpc3RbbW9kdWxlTmFtZV07XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudChjbGFzc1RvUmVzb2x2ZSk7XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5tb2RhbCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aWR0aDogODAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgfVxcblxcbi5yb29tLWNvbnRhaW5lciB7XFxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgfVxcblxcbi50YWJsZS1ncm91cCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB3aWR0aDogNDAlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICBoZWlnaHQ6IDMwJTtcXG4gIG1hcmdpbjogNCUgNCU7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XFxuICAudGFibGUtZ3JvdXAudGVhY2hlci1kZXNrIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICBib3R0b206IDUlO1xcbiAgICBoZWlnaHQ6IDEwJTtcXG4gICAgd2lkdGg6IDIwJTtcXG4gICAgbGVmdDogNjAlO1xcbiAgICBtYXJnaW46IDA7IH1cXG5cXG4uZGV2aWNlIHtcXG4gIGhlaWdodDogNTBweDtcXG4gIHdpZHRoOiA1MHB4O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBjdXJzb3I6IHBvaW50ZXI7IH1cXG4gIC5kZXZpY2UudG9wIHtcXG4gICAgbGVmdDogMjAlO1xcbiAgICB0b3A6IDEwJTsgfVxcbiAgLmRldmljZS5ib3QtcmlnaHQge1xcbiAgICByaWdodDogMTAlO1xcbiAgICBib3R0b206IDIwJTsgfVxcbiAgLmRldmljZS5ib3QtbGVmdCB7XFxuICAgIGxlZnQ6IDEwJTtcXG4gICAgYm90dG9tOiAyMCU7IH1cXG4gIC5kZXZpY2U6aG92ZXIge1xcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibHVlOyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgxPkJpdHRlIHcmYXVtbDtobGVuIFNpZSBlaW5lbiBSYXVtIGF1cy48L2gxPlxcblwiO1xuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4uL0NvbXBvbmVudCc7XG5cblxuZXhwb3J0IGNsYXNzIEhvbWUgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTVBPTkVOVF9OQU1FID0gJ2hvbWUnO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihIb21lLkNPTVBPTkVOVF9OQU1FKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlVmlld01vZGVsKHZpZXdNb2RlbDogYW55KSB7XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5yb29tLWNvbnRhaW5lciB7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwYWRkaW5nOiAyMHB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWFyZ2luLWJvdHRvbTogMjAwcHg7IH1cXG5cXG4udGFibGVDaXJjdWxhciB7XFxuICBoZWlnaHQ6IDc1JTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGRpc3BsYXk6IGJsb2NrOyB9XFxuICAudGFibGVDaXJjdWxhciB0ciB7XFxuICAgIGhlaWdodDogMjAlOyB9XFxuICAudGFibGVDaXJjdWxhciB0ZCB7XFxuICAgIHdpZHRoOiAyMCU7IH1cXG5cXG4udGFibGUtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZmxvYXQ6IGxlZnQ7XFxuICB3aWR0aDogMzAlO1xcbiAgYm9yZGVyOiAycHggc29saWQgIzMzMztcXG4gIGhlaWdodDogMjAlO1xcbiAgbWFyZ2luOiAyLjUlIDIuNSUgMCAwO1xcbiAgcGFkZGluZzogMi41JSAwIDIuNSUgMi41JTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cXG4gIC50YWJsZS1ncm91cC50ZWFjaGVyLWRlc2sge1xcbiAgICBoZWlnaHQ6IDIwJTtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBmbG9hdDogcmlnaHQ7XFxuICAgIGJvdHRvbTogMDtcXG4gICAgbGVmdDogMDtcXG4gICAgd2lkdGg6IDUwJTsgfVxcbiAgICAudGFibGUtZ3JvdXAudGVhY2hlci1kZXNrIC5kZXZpY2Uge1xcbiAgICAgIGhlaWdodDogOTUlO1xcbiAgICAgIHdpZHRoOiAzMCU7IH1cXG5cXG4uZGV2aWNlIHtcXG4gIGhlaWdodDogMjAlO1xcbiAgd2lkdGg6IDIwJTtcXG4gIGJvcmRlcjogM3B4IHNvbGlkICNlZWU7IH1cXG4gIC5kZXZpY2UuZmlsbGVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgIGJvcmRlcjogbm9uZTsgfVxcbiAgLmRldmljZS5lbXB0eSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gICAgYm9yZGVyOiBub25lOyB9XFxuICAuZGV2aWNlLmNvbm5lY3RvciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lOyB9XFxuICAuZGV2aWNlIHNwYW4sIC5kZXZpY2UgaDMge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHRvcDogNDAlO1xcbiAgICB0cmFuc2xhdGVZOiAtNTAlOyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgyIGNsYXNzPVxcXCJyb29tLXRpdGxlXFxcIj5SYXVtOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUlkXFxcIj48L3NwYW4+IFJhdW1iZXRyZXVlcjogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21Db250YWN0XFxcIj48L3NwYW4+PC9oMj48aW1nXFxuICAgIHNyYz1cXFwic3R5bGVzL2VkaXQucG5nXFxcIiBhbHQ9XFxcIlxcXCIgY2xhc3M9XFxcImVkaXRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2V0Q2hhbmdlQ29udGFjdCh0cnVlKVxcXCJcXG4+XFxuXFxuPGRpdiBjbGFzcz1cXFwicm9vbS1jb250YWluZXJcXFwiPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZUNpcmN1bGFyXFxcIj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAxPC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0zXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDMpXFxcIj48c3Bhbj4zPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGNvbm5lY3RvclxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtNFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg0KVxcXCI+PHNwYW4+NDwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAyPC9oMz48L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0xXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEpXFxcIj48c3Bhbj4xPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMilcXFwiPjxzcGFuPjI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZW1wdHlcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNSlcXFwiPjxzcGFuPjU8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtNlxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg2KVxcXCI+PHNwYW4+Njwvc3Bhbj48L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBlbXB0eVxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZW1wdHlcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGVtcHR5XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBlbXB0eVxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgY29ubmVjdG9yXFxcIj48L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS03XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDcpXFxcIj48c3Bhbj43PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLThcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOClcXFwiPjxzcGFuPjg8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZW1wdHlcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlXFxcIiBpZD1cXFwiZGV2aWNlLTExXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDExKVxcXCI+PHNwYW4+MTE8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTIpXFxcIj48c3Bhbj4xMjwvc3Bhbj48L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAzPC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS05XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDkpXFxcIj48c3Bhbj45PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGNvbm5lY3RvclxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTBcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTApXFxcIj48c3Bhbj4xMDwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCA0PC9oMz48L2Rpdj5cXG5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwIHRlYWNoZXItZGVza1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTMpXFxcIj48c3Bhbj5MZWhyZXI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTQpXFxcIj48c3Bhbj5CZWFtZXI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTUpXFxcIj48c3Bhbj5XZWl0ZXJlPC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJjaGFuZ2VDb250YWN0UG9wdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogJHBhcmVudC5zaG93Q2hhbmdlQ29udGFjdFxcXCI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnJvb21Db250YWN0SW5wdXRcXFwiID5cXG4gICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQucm9vbUNvbnRhY3RNYWlsSW5wdXRcXFwiID5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNoYW5nZUNvbnRhY3QoKVxcXCI+UmF1bWJldHJldWVyICZhdW1sO25kZXJuPC9hPlxcbiAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGFib3J0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNldENoYW5nZUNvbnRhY3QoZmFsc2UpXFxcIj5BYmJyZWNoZW48L2E+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwibW9kYWwgZGlzYWJsZWRcXFwiIGlkPVxcXCJtb2RhbFxcXCI+XFxuICAgIDxoMz5GZWhsZXJwcm90b2tvbGwgZiZ1dW1sO3IgR2VyJmF1bWw7dDogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50Lmlzc3VlRGV2aWNlSWRcXFwiPjwvc3Bhbj4gbWVsZGVuPC9oMz5cXG4gICAgPGZvcm0+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgU3RhbmRhcmRmZWhsZXI6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRWluZSBMaXN0ZSBtaXQgaCZhdW1sO2ZpZyBhdWZ0cmV0ZW5kZW4gRmVobGVybi5cXG4gICAgICAgICAgICAgICAgU29sbHRlbiBTaWUgZWluZW4gYW5kZXJlbiBGZWhsZXIgd2llZGVyaG9sdCBmZXN0c3RlbGxlbiwgayZvdW1sO25uZW4gU2llIElobiBtaXQgZGVtIEJ1dHRvbiB1bnRlbiB6dXIgTGlzdGUgaGluenVmJnV1bWw7Z2VuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGlkPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczogJHBhcmVudC5jb21tb25Jc3N1ZU5hbWVMaXN0LCBzZWxlY3RlZE9wdGlvbnM6ICRwYXJlbnQuc2VsZWN0ZWRDb21tb25Jc3N1ZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxvcHRpb24gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9vcHRpb24+XFxuICAgICAgICAgICAgPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvbiB0ZW1wbGF0ZS1zYXZlXFxcIiBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNhdmVBc1RlbXBsYXRlKClcXFwiPlN0YW5kYXJkZmVobGVyIHNwZWljaGVybjwvYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmV0cmVmZjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCJcXG4gICAgICAgICAgICAgICAgZGF0YS10b29sdGlwPVxcXCJHZWJlbiBTaWUgZWluZW4gVGl0ZWwgZiZ1dW1sO3IgSWhyZW4gRmVobGVyIGFuLiBEZXIgVGl0ZWwgd2lyZCBmJnV1bWw7ciBkZW4gQmV0cmVmZiBkZXIgRS1NYWlscyB2ZXJ3ZW5kZXQuXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwidGl0bGVcXFwiIG5hbWU9XFxcInRpdGxlXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnRpdGxlXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIEJlc2NocmVpYnVuZyo6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiUGZsaWNodGZlbGQhIEdlYmVuIFNpZSBoaWVyIGVpbmUgQmVzY2hyZWlidW5nIElocmVzIEZlaGxlcnMgYW4uXFxuICAgICAgICAgICAgICAgIEZhbGxzIFNpZSBlaW5lbiBTdGFuZGFyZGZlaGxlciBtZWxkZW4gbSZvdW1sO2NodGVuLCBrJm91bWw7bm5lbiBTaWUgaWhuIGhpZXIgd2VpdGVyIHNwZXppZml6aWVyZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiZGVzY3JpcHRpb25cXFwiIG5hbWU9XFxcImRlc2NyaXB0aW9uXFxcIiBtYXhsZW5ndGg9XFxcIjUwMFxcXCIgcmVxdWlyZWQgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5kZXNjcmlwdGlvblxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgTGVocmVyIGJlbmFjaHJpY2h0aWdlbjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCJcXG4gICAgICAgICAgICAgICAgZGF0YS10b29sdGlwPVxcXCJGYWxscyBhdXNnZXcmYXVtbDtobHQsIHdpcmQgZWluZSBFLU1haWwgYW4gYWxsZSBMZWhyZXIgdmVyc2NoaWNrdCwgZGllIG5hY2ggUGxhbiBpbiBkaWVzZW0gUmF1bSB1bnRlcnJpY2h0ZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiY29udGFjdE1haWwtdGVhY2hlcnNcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6ICRwYXJlbnQuYWRkVGVhY2hlcnNUb01haWxcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgUEMtV2Vya3N0YXR0IGJlbmFjaHJpY2h0aWdlbjpcXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJGYWxscyBhdXNnZXcmYXVtbDtobHQsIHdpcmQgZWluZSBFLU1haWwgYW4gZGllIFBDLVdlcmtzdGF0dCB2ZXJzY2hpY2t0LlxcXCI+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImNvbnRhY3RNYWlsLXdvcmtzaG9wXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiAkcGFyZW50LmFkZFdvcmtzaG9wVG9NYWlsXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcblxcbiAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiA1cHhcXFwiPlxcbiAgICAgICAgICAgIFJhdW1iZXRyZXVlcjpcXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJEZXIgUmF1bWJldHJldWVyIHdpcmQgJnV1bWw7YmVyIGplZGVuIEZlaGxlciBpbiBLZW5udG5pcyBnZXNldHp0LlxcXCI+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUNvbnRhY3RNYWlsXFxcIiBzdHlsZT1cXFwiY29sb3I6ICM4ODhcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgd2VpdGVyZSBFbXBmJmF1bWw7bmdlcjogPHNwYW5cXG4gICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJFaW5lIExpc3RlIGFuIHp1cyZhdW1sO3R6bGljaGVuIEVtcCZhdW1sO25nZXJuLiBUcmVubmVuIFNpZSBtZWhyZXJlIEUtTWFpbC1BZHJlc3NlbiBtaXQgZWluZW0gS29tbWEuXFxcIlxcbiAgICAgICAgPmk8L3NwYW4+IDx0ZXh0YXJlYSBjbGFzcz1cXFwicmVjaXBpZW50c1xcXCIgbmFtZT1cXFwicmVjaXBpZW50c1xcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5pc3N1ZVJlY2lwaWVudHNcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICA8L2xhYmVsPlxcblxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWJvcnRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2FuY2VsSXNzdWUoKVxcXCI+QWJicmVjaGVuPC9hPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gY29uZmlybVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5hZGRJc3N1ZSgpXFxcIj5Qcm90b2tvbGwgYXVmbmVobWVuPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgPC9mb3JtPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcInRvYXN0IGVycm9yXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRwYXJlbnQuc2hvd0Vycm9yXFxcIj5cXG4gICAgPHAgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LmVycm9yXFxcIj48L3A+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuaGlkZVRvYXN0KClcXFwiIHZhbHVlPVxcXCJYXFxcIiA+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiaXNzdWUtbGlzdFxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImlzc3VlLWl0ZW1zXFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6ICRwYXJlbnQuaXNzdWVMaXN0XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtaXRlbVxcXCI+XFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGV2aWNlSWRcXFwiPjwvc3Bhbj4sXFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IGRlc2NyaXB0aW9uXFxcIj48L3NwYW4+LFxcbiAgICAgICAgICAgIEVtcGYmYXVtbDtuZ2VyOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHJlY2lwaWVudHNcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHJlbW92ZVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZWxldGVJc3N1ZShpc3N1ZUlkKVxcXCI+RW50ZmVybmVuPC9hPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhY3Rpb25zXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLWNsZWFyXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNsZWFySXNzdWVzKClcXFwiPkxpc3RlIGRlciBGZWhsZXJwcm90b2tvbGxlIGxlZXJlbjwvYT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLXNlbmRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2VuZElzc3VlcygpXFxcIj5MaXN0ZSBkZXIgRmVobGVycHJvdG9rb2xsZSBhYnNlbmRlbjwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4iLCJpbXBvcnQge1Jvb21MYXlvdXR9IGZyb20gJy4uL3Jvb20vUm9vbUxheW91dCc7XG5pbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBSb29tQ2lyY3VsYXIgZXh0ZW5kcyBSb29tTGF5b3V0IHtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTVBPTkVOVF9OQU1FID0gJ3Jvb21DaXJjdWxhcic7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21tb25Jc3N1ZXM6IGFueSwgaXNzdWVGb3JtQ29udGFpbmVyOiBJc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucykge1xuICAgICAgICBzdXBlcihjb21tb25Jc3N1ZXMsIGlzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnMsIFJvb21DaXJjdWxhci5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uUmVuZGVyKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFJvb21DaXJjdWxhci5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG59XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIucm9vbS1jb250YWluZXIge1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBmbG9hdDogbGVmdDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcGFkZGluZy10b3A6IDUlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWFyZ2luLWJvdHRvbTogMjAwcHg7IH1cXG5cXG4udGFibGUtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZmxvYXQ6IGxlZnQ7XFxuICB3aWR0aDogNDAlO1xcbiAgYm9yZGVyOiAycHggc29saWQgIzMzMztcXG4gIGhlaWdodDogMzAlO1xcbiAgbWFyZ2luLWJvdHRvbTogNSU7XFxuICBwYWRkaW5nOiAyLjUlIDAgMi41JSAyLjUlO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxcbiAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayB7XFxuICAgIGhlaWdodDogMjAlO1xcbiAgICBtYXJnaW46IDBweCA1JSA1JSAwcHg7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZmxvYXQ6IHJpZ2h0O1xcbiAgICBib3R0b206IDA7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHdpZHRoOiA1MCU7IH1cXG4gICAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayAuZGV2aWNlIHtcXG4gICAgICBoZWlnaHQ6IDk1JTtcXG4gICAgICB3aWR0aDogMjglOyB9XFxuICAudGFibGUtZ3JvdXA6bnRoLW9mLXR5cGUoZXZlbikge1xcbiAgICBtYXJnaW4tbGVmdDogMjAlOyB9XFxuXFxuLmRldmljZSB7XFxuICBoZWlnaHQ6IDQ1JTtcXG4gIHdpZHRoOiA0NSU7XFxuICBtYXJnaW46IDAgNSUgNSUgMDsgfVxcbiAgLmRldmljZS50b3Age1xcbiAgICBsZWZ0OiAwO1xcbiAgICB0b3A6IDA7IH1cXG4gIC5kZXZpY2UuYm90LXJpZ2h0IHtcXG4gICAgcmlnaHQ6IDA7XFxuICAgIGJvdHRvbTogMDsgfVxcbiAgLmRldmljZS5ib3QtbGVmdCB7XFxuICAgIGxlZnQ6IDA7XFxuICAgIGJvdHRvbTogMDsgfVxcbiAgLmRldmljZS5maWxsZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7IH1cXG4gIC5kZXZpY2U6aG92ZXIge1xcbiAgICAvKmJvcmRlcjogMnB4IHNvbGlkIGJsdWU7Ki9cXG4gICAgYm9yZGVyOiBub25lOyB9XFxuICAuZGV2aWNlIHNwYW4ge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHRvcDogNDAlO1xcbiAgICB0cmFuc2xhdGVZOiAtNTAlOyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgyIGNsYXNzPVxcXCJyb29tLXRpdGxlXFxcIj5SYXVtOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUlkXFxcIj48L3NwYW4+IFJhdW1iZXRyZXVlcjogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21Db250YWN0XFxcIj48L3NwYW4+PC9oMj48aW1nXFxuICAgIHNyYz1cXFwic3R5bGVzL2VkaXQucG5nXFxcIiBhbHQ9XFxcIlxcXCIgY2xhc3M9XFxcImVkaXRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2V0Q2hhbmdlQ29udGFjdCh0cnVlKVxcXCI+XFxuXFxuPGRpdiBjbGFzcz1cXFwicm9vbS1jb250YWluZXJcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTFcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMSlcXFwiPjxzcGFuPjE8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMTwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtMlxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygyKVxcXCI+PHNwYW4+Mjwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygzKVxcXCI+PHNwYW4+Mzwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAyPC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtNFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg0KVxcXCI+PHNwYW4+NDwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS01XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDUpXFxcIj48c3Bhbj41PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS02XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDYpXFxcIj48c3Bhbj42PC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS03XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDcpXFxcIj48c3Bhbj43PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGZpbGxlclxcXCI+PGgzPlRpc2NoIDM8L2gzPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLThcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOClcXFwiPjxzcGFuPjg8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTlcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOSlcXFwiPjxzcGFuPjk8L3NwYW4+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cCBleHRlbmRlZFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggNDwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTEwXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDEwKVxcXCI+PHNwYW4+MTA8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtMTFcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTEpXFxcIj48c3Bhbj4xMTwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtMTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTIpXFxcIj48c3Bhbj4xMjwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwIHRlYWNoZXItZGVza1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTMpXFxcIj48c3Bhbj5MZWhyZXI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTQpXFxcIj48c3Bhbj5CZWFtZXI8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2VcXFwiIGlkPVxcXCJkZXZpY2UtMTVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTUpXFxcIj48c3Bhbj5XZWl0ZXJlPC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJjaGFuZ2VDb250YWN0UG9wdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogJHBhcmVudC5zaG93Q2hhbmdlQ29udGFjdFxcXCI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnJvb21Db250YWN0SW5wdXRcXFwiID5cXG4gICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQucm9vbUNvbnRhY3RNYWlsSW5wdXRcXFwiID5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNoYW5nZUNvbnRhY3QoKVxcXCI+UmF1bWJldHJldWVyICZhdW1sO25kZXJuPC9hPlxcbiAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGFib3J0XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNldENoYW5nZUNvbnRhY3QoZmFsc2UpXFxcIj5BYmJyZWNoZW48L2E+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwibW9kYWwgZGlzYWJsZWRcXFwiIGlkPVxcXCJtb2RhbFxcXCI+XFxuICAgIDxoMz5GZWhsZXJwcm90b2tvbGwgZiZ1dW1sO3IgR2VyJmF1bWw7dDogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50Lmlzc3VlRGV2aWNlSWRcXFwiPjwvc3Bhbj4gbWVsZGVuPC9oMz5cXG4gICAgPGZvcm0+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgU3RhbmRhcmRmZWhsZXI6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiRWluZSBMaXN0ZSBtaXQgaCZhdW1sO2ZpZyBhdWZ0cmV0ZW5kZW4gRmVobGVybi5cXG4gICAgICAgICAgICAgICAgU29sbHRlbiBTaWUgZWluZW4gYW5kZXJlbiBGZWhsZXIgd2llZGVyaG9sdCBmZXN0c3RlbGxlbiwgayZvdW1sO25uZW4gU2llIElobiBtaXQgZGVtIEJ1dHRvbiB1bnRlbiB6dXIgTGlzdGUgaGluenVmJnV1bWw7Z2VuLlxcXCJcXG4gICAgICAgICAgICA+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGlkPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczogJHBhcmVudC5jb21tb25Jc3N1ZU5hbWVMaXN0LCBzZWxlY3RlZE9wdGlvbnM6ICRwYXJlbnQuc2VsZWN0ZWRDb21tb25Jc3N1ZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxvcHRpb24gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9vcHRpb24+XFxuICAgICAgICAgICAgPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvbiB0ZW1wbGF0ZS1zYXZlXFxcIiBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNhdmVBc1RlbXBsYXRlKClcXFwiPlN0YW5kYXJkZmVobGVyIHNwZWljaGVybjwvYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmV0cmVmZjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCJcXG4gICAgICAgICAgICAgICAgZGF0YS10b29sdGlwPVxcXCJHZWJlbiBTaWUgZWluZW4gVGl0ZWwgZiZ1dW1sO3IgSWhyZW4gRmVobGVyIGFuLiBEZXIgVGl0ZWwgd2lyZCBmJnV1bWw7ciBkZW4gQmV0cmVmZiBkZXIgRS1NYWlscyB2ZXJ3ZW5kZXQuXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwidGl0bGVcXFwiIG5hbWU9XFxcInRpdGxlXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnRpdGxlXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIEJlc2NocmVpYnVuZyo6XFxuICAgICAgICAgICAgPHNwYW5cXG4gICAgICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiUGZsaWNodGZlbGQhIEdlYmVuIFNpZSBoaWVyIGVpbmUgQmVzY2hyZWlidW5nIElocmVzIEZlaGxlcnMgYW4uXFxuICAgICAgICAgICAgICAgIEZhbGxzIFNpZSBlaW5lbiBTdGFuZGFyZGZlaGxlciBtZWxkZW4gbSZvdW1sO2NodGVuLCBrJm91bWw7bm5lbiBTaWUgaWhuIGhpZXIgd2VpdGVyIHNwZXppZml6aWVyZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiZGVzY3JpcHRpb25cXFwiIG5hbWU9XFxcImRlc2NyaXB0aW9uXFxcIiBtYXhsZW5ndGg9XFxcIjUwMFxcXCIgcmVxdWlyZWQgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5kZXNjcmlwdGlvblxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgTGVocmVyIGJlbmFjaHJpY2h0aWdlbjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCJcXG4gICAgICAgICAgICAgICAgZGF0YS10b29sdGlwPVxcXCJGYWxscyBhdXNnZXcmYXVtbDtobHQsIHdpcmQgZWluZSBFLU1haWwgYW4gYWxsZSBMZWhyZXIgdmVyc2NoaWNrdCwgZGllIG5hY2ggUGxhbiBpbiBkaWVzZW0gUmF1bSB1bnRlcnJpY2h0ZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiY29udGFjdE1haWwtdGVhY2hlcnNcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6ICRwYXJlbnQuYWRkVGVhY2hlcnNUb01haWxcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgUEMtV2Vya3N0YXR0IGJlbmFjaHJpY2h0aWdlbjpcXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJGYWxscyBhdXNnZXcmYXVtbDtobHQsIHdpcmQgZWluZSBFLU1haWwgYW4gZGllIFBDLVdlcmtzdGF0dCB2ZXJzY2hpY2t0LlxcXCI+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImNvbnRhY3RNYWlsLXdvcmtzaG9wXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiAkcGFyZW50LmFkZFdvcmtzaG9wVG9NYWlsXFxcIiA+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgPGJyPlxcblxcbiAgICAgICAgPGxhYmVsIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiA1cHhcXFwiPlxcbiAgICAgICAgICAgIFJhdW1iZXRyZXVlcjpcXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJEZXIgUmF1bWJldHJldWVyIHdpcmQgJnV1bWw7YmVyIGplZGVuIEZlaGxlciBpbiBLZW5udG5pcyBnZXNldHp0LlxcXCI+aTwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUNvbnRhY3RNYWlsXFxcIiBzdHlsZT1cXFwiY29sb3I6ICM4ODhcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgd2VpdGVyZSBFbXBmJmF1bWw7bmdlcjogPHNwYW5cXG4gICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJFaW5lIExpc3RlIGFuIHp1cyZhdW1sO3R6bGljaGVuIEVtcCZhdW1sO25nZXJuLiBUcmVubmVuIFNpZSBtZWhyZXJlIEUtTWFpbC1BZHJlc3NlbiBtaXQgZWluZW0gS29tbWEuXFxcIlxcbiAgICAgICAgPmk8L3NwYW4+IDx0ZXh0YXJlYSBjbGFzcz1cXFwicmVjaXBpZW50c1xcXCIgbmFtZT1cXFwicmVjaXBpZW50c1xcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5pc3N1ZVJlY2lwaWVudHNcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICA8L2xhYmVsPlxcblxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWJvcnRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2FuY2VsSXNzdWUoKVxcXCI+QWJicmVjaGVuPC9hPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gY29uZmlybVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5hZGRJc3N1ZSgpXFxcIj5Qcm90b2tvbGwgYXVmbmVobWVuPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgPC9mb3JtPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcInRvYXN0IGVycm9yXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRwYXJlbnQuc2hvd0Vycm9yXFxcIj5cXG4gICAgPHAgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LmVycm9yXFxcIj48L3A+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuaGlkZVRvYXN0KClcXFwiIHZhbHVlPVxcXCJYXFxcIiA+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwiaXNzdWUtbGlzdFxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImlzc3VlLWl0ZW1zXFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6ICRwYXJlbnQuaXNzdWVMaXN0XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtaXRlbVxcXCI+XFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiB0aXRsZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGV2aWNlSWRcXFwiPjwvc3Bhbj4sXFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IGRlc2NyaXB0aW9uXFxcIj48L3NwYW4+LFxcbiAgICAgICAgICAgIEVtcGYmYXVtbDtuZ2VyOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHJlY2lwaWVudHNcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHJlbW92ZVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZWxldGVJc3N1ZShpc3N1ZUlkKVxcXCI+RW50ZmVybmVuPC9hPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhY3Rpb25zXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLWNsZWFyXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNsZWFySXNzdWVzKClcXFwiPkxpc3RlIGRlciBGZWhsZXJwcm90b2tvbGxlIGxlZXJlbjwvYT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLXNlbmRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2VuZElzc3VlcygpXFxcIj5MaXN0ZSBkZXIgRmVobGVycHJvdG9rb2xsZSBhYnNlbmRlbjwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4iLCJpbXBvcnQge1Jvb21MYXlvdXR9IGZyb20gJy4uL3Jvb20vUm9vbUxheW91dCc7XG5pbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBSb29tR3JvdXBzQW5nbGVkIGV4dGVuZHMgUm9vbUxheW91dCB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT01QT05FTlRfTkFNRSA9ICdyb29tR3JvdXBzQW5nbGVkJztcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbW1vbklzc3VlczogYW55LCBpc3N1ZUZvcm1Db250YWluZXI6IElzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnM6IFVzZXJBY3Rpb25zKSB7XG4gICAgICAgIHN1cGVyKGNvbW1vbklzc3VlcywgaXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9ucywgUm9vbUdyb3Vwc0FuZ2xlZC5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uUmVuZGVyKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFJvb21Hcm91cHNBbmdsZWQuQ09NUE9ORU5UX05BTUUpO1xuICAgIH1cbn1cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIi5yb29tLWNvbnRhaW5lciB7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwYWRkaW5nOiA1JSAwIDAgNSU7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBtYXJnaW4tYm90dG9tOiAyMDBweDsgfVxcblxcbi50YWJsZS1ncm91cCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBmbG9hdDogbGVmdDtcXG4gIHdpZHRoOiA0NSU7XFxuICBib3JkZXI6IDJweCBzb2xpZCAjMzMzO1xcbiAgaGVpZ2h0OiAzMCU7XFxuICBtYXJnaW46IDAgNSUgNSUgMDtcXG4gIHBhZGRpbmc6IDIuNSUgMCAyLjUlIDIuNSU7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XFxuICAudGFibGUtZ3JvdXAudGVhY2hlci1kZXNrIHtcXG4gICAgaGVpZ2h0OiAyMCU7XFxuICAgIG1hcmdpbjogMHB4IDUlIDUlIDBweDtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBmbG9hdDogcmlnaHQ7XFxuICAgIGJvdHRvbTogMDtcXG4gICAgbGVmdDogMDtcXG4gICAgd2lkdGg6IDUwJTsgfVxcbiAgICAudGFibGUtZ3JvdXAudGVhY2hlci1kZXNrIC5kZXZpY2Uge1xcbiAgICAgIGhlaWdodDogOTUlO1xcbiAgICAgIHdpZHRoOiAyOCU7IH1cXG5cXG4uZGV2aWNlIHtcXG4gIGhlaWdodDogNDUlO1xcbiAgd2lkdGg6IDQ1JTtcXG4gIG1hcmdpbjogMCA1JSA1JSAwOyB9XFxuICAuZGV2aWNlLnRvcCB7XFxuICAgIGxlZnQ6IDA7XFxuICAgIHRvcDogMDsgfVxcbiAgLmRldmljZS5ib3QtcmlnaHQge1xcbiAgICByaWdodDogMDtcXG4gICAgYm90dG9tOiAwOyB9XFxuICAuZGV2aWNlLmJvdC1sZWZ0IHtcXG4gICAgbGVmdDogMDtcXG4gICAgYm90dG9tOiAwOyB9XFxuICAuZGV2aWNlLmZpbGxlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxcbiAgLmRldmljZTpob3ZlciB7XFxuICAgIC8qYm9yZGVyOiAycHggc29saWQgYmx1ZTsqL1xcbiAgICBib3JkZXI6IG5vbmU7IH1cXG4gIC5kZXZpY2Ugc3BhbiB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdG9wOiA0MCU7XFxuICAgIHRyYW5zbGF0ZVk6IC01MCU7IH1cXG5cIjtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDIgY2xhc3M9XFxcInJvb20tdGl0bGVcXFwiPlJhdW06IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5yb29tSWRcXFwiPjwvc3Bhbj4gUmF1bWJldHJldWVyOiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQucm9vbUNvbnRhY3RcXFwiPjwvc3Bhbj48L2gyPjxpbWdcXG4gICAgc3JjPVxcXCJzdHlsZXMvZWRpdC5wbmdcXFwiIGFsdD1cXFwiXFxcIiBjbGFzcz1cXFwiZWRpdFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zZXRDaGFuZ2VDb250YWN0KHRydWUpXFxcIlxcbj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJyb29tLWNvbnRhaW5lclxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtMVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxKVxcXCI+PHNwYW4+MTwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCAxPC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS0yXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDIpXFxcIj48c3Bhbj4yPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS0zXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDMpXFxcIj48c3Bhbj4zPC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS00XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDQpXFxcIj48c3Bhbj40PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGZpbGxlclxcXCI+PGgzPlRpc2NoIDI8L2gzPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNSlcXFwiPjxzcGFuPjU8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTZcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNilcXFwiPjxzcGFuPjY8L3NwYW4+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTdcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNylcXFwiPjxzcGFuPjc8L3NwYW4+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgZmlsbGVyXFxcIj48aDM+VGlzY2ggMzwvaDM+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtOFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg4KVxcXCI+PHNwYW4+ODwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtOVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg5KVxcXCI+PHNwYW4+OTwvc3Bhbj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwIGV4dGVuZGVkXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtMTBcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTApXFxcIj48c3Bhbj4xMDwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBmaWxsZXJcXFwiPjxoMz5UaXNjaCA0PC9oMz48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS0xMVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMSlcXFwiPjxzcGFuPjExPC9zcGFuPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS0xMlxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMilcXFwiPjxzcGFuPjEyPC9zcGFuPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXAgdGVhY2hlci1kZXNrXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0xM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMylcXFwiPjxzcGFuPkxlaHJlcjwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0xNFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxNClcXFwiPjxzcGFuPkJlYW1lcjwvc3Bhbj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0xNVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxNSlcXFwiPjxzcGFuPldlaXRlcmU8L3NwYW4+PC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcImNoYW5nZUNvbnRhY3RQb3B1cFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiAkcGFyZW50LnNob3dDaGFuZ2VDb250YWN0XFxcIj5cXG5cXG4gICAgPGxhYmVsIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiA1cHhcXFwiPlxcbiAgICAgICAgTmFtZTpcXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LnJvb21Db250YWN0SW5wdXRcXFwiID5cXG4gICAgPC9sYWJlbD5cXG4gICAgPGxhYmVsIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiA1cHhcXFwiPlxcbiAgICAgICAgRS1NYWlsIEFkcmVzc2U6XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5yb29tQ29udGFjdE1haWxJbnB1dFxcXCIgPlxcbiAgICA8L2xhYmVsPlxcblxcbiAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGNvbmZpcm1cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2hhbmdlQ29udGFjdCgpXFxcIj5SYXVtYmV0cmV1ZXIgJmF1bWw7bmRlcm48L2E+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWJvcnRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2V0Q2hhbmdlQ29udGFjdChmYWxzZSlcXFwiPkFiYnJlY2hlbjwvYT5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJtb2RhbCBkaXNhYmxlZFxcXCIgaWQ9XFxcIm1vZGFsXFxcIj5cXG4gICAgPGgzPkZlaGxlcnByb3Rva29sbCBmJnV1bWw7ciBHZXImYXVtbDt0OiA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQuaXNzdWVEZXZpY2VJZFxcXCI+PC9zcGFuPiBtZWxkZW48L2gzPlxcbiAgICA8Zm9ybT5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICBTdGFuZGFyZGZlaGxlcjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJFaW5lIExpc3RlIG1pdCBoJmF1bWw7ZmlnIGF1ZnRyZXRlbmRlbiBGZWhsZXJuLlxcbiAgICAgICAgICAgICAgICBTb2xsdGVuIFNpZSBlaW5lbiBhbmRlcmVuIEZlaGxlciB3aWVkZXJob2x0IGZlc3RzdGVsbGVuLCBrJm91bWw7bm5lbiBTaWUgSWhuIG1pdCBkZW0gQnV0dG9uIHVudGVuIHp1ciBMaXN0ZSBoaW56dWYmdXVtbDtnZW4uXFxcIlxcbiAgICAgICAgICAgID5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcInRlbXBsYXRlLXNlbGVjdFxcXCIgaWQ9XFxcInRlbXBsYXRlLXNlbGVjdFxcXCIgZGF0YS1iaW5kPVxcXCJvcHRpb25zOiAkcGFyZW50LmNvbW1vbklzc3VlTmFtZUxpc3QsIHNlbGVjdGVkT3B0aW9uczogJHBhcmVudC5zZWxlY3RlZENvbW1vbklzc3VlXFxcIj5cXG4gICAgICAgICAgICAgICAgPG9wdGlvbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHRpdGxlXFxcIj48L29wdGlvbj5cXG4gICAgICAgICAgICA8L3NlbGVjdD5cXG4gICAgICAgICAgICA8YSBjbGFzcz1cXFwiYnV0dG9uIHRlbXBsYXRlLXNhdmVcXFwiIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2F2ZUFzVGVtcGxhdGUoKVxcXCI+U3RhbmRhcmRmZWhsZXIgc3BlaWNoZXJuPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICBCZXRyZWZmOlxcbiAgICAgICAgICAgIDxzcGFuXFxuICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIlxcbiAgICAgICAgICAgICAgICBkYXRhLXRvb2x0aXA9XFxcIkdlYmVuIFNpZSBlaW5lbiBUaXRlbCBmJnV1bWw7ciBJaHJlbiBGZWhsZXIgYW4uIERlciBUaXRlbCB3aXJkIGYmdXVtbDtyIGRlbiBCZXRyZWZmIGRlciBFLU1haWxzIHZlcndlbmRldC5cXFwiXFxuICAgICAgICAgICAgPmk8L3NwYW4+XFxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJ0aXRsZVxcXCIgbmFtZT1cXFwidGl0bGVcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQudGl0bGVcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nKjpcXG4gICAgICAgICAgICA8c3BhblxcbiAgICAgICAgICAgICAgICBjbGFzcz1cXFwidG9vbHRpcCBwb3BSaWdodFxcXCIgZGF0YS10b29sdGlwPVxcXCJQZmxpY2h0ZmVsZCEgR2ViZW4gU2llIGhpZXIgZWluZSBCZXNjaHJlaWJ1bmcgSWhyZXMgRmVobGVycyBhbi5cXG4gICAgICAgICAgICAgICAgRmFsbHMgU2llIGVpbmVuIFN0YW5kYXJkZmVobGVyIG1lbGRlbiBtJm91bWw7Y2h0ZW4sIGsmb3VtbDtubmVuIFNpZSBpaG4gaGllciB3ZWl0ZXIgc3BlemlmaXppZXJlbi5cXFwiXFxuICAgICAgICAgICAgPmk8L3NwYW4+XFxuICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVxcXCJkZXNjcmlwdGlvblxcXCIgbmFtZT1cXFwiZGVzY3JpcHRpb25cXFwiIG1heGxlbmd0aD1cXFwiNTAwXFxcIiByZXF1aXJlZCBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50LmRlc2NyaXB0aW9uXFxcIj48L3RleHRhcmVhPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICBMZWhyZXIgYmVuYWNocmljaHRpZ2VuOlxcbiAgICAgICAgICAgIDxzcGFuXFxuICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIlxcbiAgICAgICAgICAgICAgICBkYXRhLXRvb2x0aXA9XFxcIkZhbGxzIGF1c2dldyZhdW1sO2hsdCwgd2lyZCBlaW5lIEUtTWFpbCBhbiBhbGxlIExlaHJlciB2ZXJzY2hpY2t0LCBkaWUgbmFjaCBQbGFuIGluIGRpZXNlbSBSYXVtIHVudGVycmljaHRlbi5cXFwiXFxuICAgICAgICAgICAgPmk8L3NwYW4+XFxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJjb250YWN0TWFpbC10ZWFjaGVyc1xcXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDogJHBhcmVudC5hZGRUZWFjaGVyc1RvTWFpbFxcXCIgPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICBQQy1XZXJrc3RhdHQgYmVuYWNocmljaHRpZ2VuOlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIkZhbGxzIGF1c2dldyZhdW1sO2hsdCwgd2lyZCBlaW5lIEUtTWFpbCBhbiBkaWUgUEMtV2Vya3N0YXR0IHZlcnNjaGlja3QuXFxcIj5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiY29udGFjdE1haWwtd29ya3Nob3BcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6ICRwYXJlbnQuYWRkV29ya3Nob3BUb01haWxcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuXFxuICAgICAgICA8bGFiZWwgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDVweFxcXCI+XFxuICAgICAgICAgICAgUmF1bWJldHJldWVyOlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIkRlciBSYXVtYmV0cmV1ZXIgd2lyZCAmdXVtbDtiZXIgamVkZW4gRmVobGVyIGluIEtlbm50bmlzIGdlc2V0enQuXFxcIj5pPC9zcGFuPlxcbiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5yb29tQ29udGFjdE1haWxcXFwiIHN0eWxlPVxcXCJjb2xvcjogIzg4OFxcXCI+PC9zcGFuPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDxicj5cXG4gICAgICAgIDxsYWJlbD5cXG4gICAgICAgICAgICB3ZWl0ZXJlIEVtcGYmYXVtbDtuZ2VyOiA8c3BhblxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJ0b29sdGlwIHBvcFJpZ2h0XFxcIiBkYXRhLXRvb2x0aXA9XFxcIkVpbmUgTGlzdGUgYW4genVzJmF1bWw7dHpsaWNoZW4gRW1wJmF1bWw7bmdlcm4uIFRyZW5uZW4gU2llIG1laHJlcmUgRS1NYWlsLUFkcmVzc2VuIG1pdCBlaW5lbSBLb21tYS5cXFwiXFxuICAgICAgICA+aTwvc3Bhbj4gPHRleHRhcmVhIGNsYXNzPVxcXCJyZWNpcGllbnRzXFxcIiBuYW1lPVxcXCJyZWNpcGllbnRzXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiAkcGFyZW50Lmlzc3VlUmVjaXBpZW50c1xcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuXFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhYm9ydFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jYW5jZWxJc3N1ZSgpXFxcIj5BYmJyZWNoZW48L2E+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmFkZElzc3VlKClcXFwiPlByb3Rva29sbCBhdWZuZWhtZW48L2E+XFxuICAgICAgICA8L2xhYmVsPlxcbiAgICA8L2Zvcm0+XFxuPC9kaXY+XFxuXFxuPGRpdiBjbGFzcz1cXFwidG9hc3QgZXJyb3JcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogJHBhcmVudC5zaG93RXJyb3JcXFwiPlxcbiAgICA8cCBkYXRhLWJpbmQ9XFxcInRleHQ6ICRwYXJlbnQuZXJyb3JcXFwiPjwvcD5cXG4gICAgPGlucHV0IHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5oaWRlVG9hc3QoKVxcXCIgdmFsdWU9XFxcIlhcXFwiID5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJpc3N1ZS1saXN0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiaXNzdWUtaXRlbXNcXFwiIGRhdGEtYmluZD1cXFwiZm9yZWFjaDogJHBhcmVudC5pc3N1ZUxpc3RcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1pdGVtXFxcIj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHRpdGxlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgR2VyJmF1bWw7dDogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiBkZXZpY2VJZFxcXCI+PC9zcGFuPixcXG4gICAgICAgICAgICBCZXNjaHJlaWJ1bmc6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGVzY3JpcHRpb25cXFwiPjwvc3Bhbj4sXFxuICAgICAgICAgICAgRW1wZiZhdW1sO25nZXI6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogcmVjaXBpZW50c1xcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gcmVtb3ZlXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRlbGV0ZUlzc3VlKGlzc3VlSWQpXFxcIj5FbnRmZXJuZW48L2E+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcImFjdGlvbnNcXFwiPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhY3Rpb24tY2xlYXJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuY2xlYXJJc3N1ZXMoKVxcXCI+TGlzdGUgZGVyIEZlaGxlcnByb3Rva29sbGUgbGVlcmVuPC9hPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhY3Rpb24tc2VuZFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5zZW5kSXNzdWVzKClcXFwiPkxpc3RlIGRlciBGZWhsZXJwcm90b2tvbGxlIGFic2VuZGVuPC9hPlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiIsImltcG9ydCB7SXNzdWVGb3JtQ29udGFpbmVyfSBmcm9tICcuLi8uLi8uLi9jb21tb24vSXNzdWVGb3JtQ29udGFpbmVyJztcbmltcG9ydCB7VXNlckFjdGlvbnN9IGZyb20gJy4uLy4uLy4uL1VzZXJBY3Rpb25zJztcbmltcG9ydCB7Um9vbUxheW91dH0gZnJvbSAnLi4vcm9vbS9Sb29tTGF5b3V0JztcblxuXG5leHBvcnQgY2xhc3MgUm9vbUdyb3VwcyBleHRlbmRzIFJvb21MYXlvdXQge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ09NUE9ORU5UX05BTUUgPSAncm9vbUdyb3Vwcyc7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21tb25Jc3N1ZXM6IGFueSwgaXNzdWVGb3JtQ29udGFpbmVyOiBJc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucykge1xuICAgICAgICBzdXBlcihjb21tb25Jc3N1ZXMsIGlzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnMsIFJvb21Hcm91cHMuQ09NUE9ORU5UX05BTUUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblJlbmRlcigpe1xuICAgICAgICBjb25zb2xlLmxvZyhSb29tR3JvdXBzLkNPTVBPTkVOVF9OQU1FKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi4vQ29tcG9uZW50JztcbmltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAna25vY2tvdXQnO1xuaW1wb3J0IHtJc3N1ZX0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlJztcbmltcG9ydCB7SXNzdWVGb3JtQ29udGFpbmVyfSBmcm9tICcuLi8uLi8uLi9jb21tb24vSXNzdWVGb3JtQ29udGFpbmVyJztcbmltcG9ydCB7VXNlckFjdGlvbnN9IGZyb20gJy4uLy4uLy4uL1VzZXJBY3Rpb25zJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJvb21MYXlvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHByaXZhdGUgc3RhdGljIERFU0NSSVBUSU9OX0lOVkFMSUQgPSAnQml0dGUgZ2ViZW4gU2llIGVpbmUgQmVzY2hyZWlidW5nIHp1bSBhdWZnZXRyZXRlbmVuIEZlaGxlciBhbi4nO1xuICAgIHByaXZhdGUgc3RhdGljIFdPUktTSE9QX01BSUwgPSAncGMtd2Vya3N0YXR0QGdzby1rb2Vsbi5kZSc7XG4gICAgcHVibGljIHJvb21JZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0aXRsZSA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHB1YmxpYyBkZXNjcmlwdGlvbiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHB1YmxpYyBpc3N1ZUxpc3QgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIHB1YmxpYyBzZWxlY3RlZENvbW1vbklzc3VlID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgcHVibGljIGNvbW1vbklzc3VlTmFtZUxpc3Q6IEFycmF5PGFueT4gPSBbJ0ZlaGxlciBhdXN3XFx1MDBlNGhsZW4nXTtcbiAgICBwdWJsaWMgc2hvd0Vycm9yOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgcHVibGljIGVycm9yOiBPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwdWJsaWMgc2hvd0NoYW5nZUNvbnRhY3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICBwdWJsaWMgcm9vbUNvbnRhY3Q6IE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHB1YmxpYyByb29tQ29udGFjdE1haWxJbnB1dDogT2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgcHVibGljIHJvb21Db250YWN0SW5wdXQ6IE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHByaXZhdGUgY29tbW9uSXNzdWVMaXN0O1xuICAgIHByaXZhdGUgaXNzdWVGb3JtQ29udGFpbmVyOiBJc3N1ZUZvcm1Db250YWluZXI7XG4gICAgcHJpdmF0ZSBpc3N1ZURldmljZUlkOiBPYnNlcnZhYmxlPG51bWJlcj4gPSBrby5vYnNlcnZhYmxlKDApO1xuICAgIHByaXZhdGUgaXNzdWVSZWNpcGllbnRzID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgcHJpdmF0ZSB1c2VyQWN0aW9uczogVXNlckFjdGlvbnM7XG4gICAgcHJpdmF0ZSBpc3N1ZUNvdW50ZXIgPSAwO1xuICAgIHByaXZhdGUgcm9vbTogYW55O1xuICAgIHByaXZhdGUgcm9vbUNvbnRhY3RNYWlsOiBPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwcml2YXRlIGFkZFRlYWNoZXJzVG9NYWlsOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgcHJpdmF0ZSBhZGRXb3Jrc2hvcFRvTWFpbDogT2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbW1vbklzc3VlczogYW55LCBpc3N1ZUZvcm1Db250YWluZXI6IElzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnM6IFVzZXJBY3Rpb25zLCBjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHN1cGVyKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICB0aGlzLmNvbW1vbklzc3VlTGlzdCA9IGNvbW1vbklzc3VlcztcbiAgICAgICAgdGhpcy5pc3N1ZUZvcm1Db250YWluZXIgPSBpc3N1ZUZvcm1Db250YWluZXI7XG4gICAgICAgIHRoaXMudXNlckFjdGlvbnMgPSB1c2VyQWN0aW9ucztcblxuICAgICAgICBmb3IgKGxldCBjb21tb25Jc3N1ZSBvZiBjb21tb25Jc3N1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbW9uSXNzdWVOYW1lTGlzdC5wdXNoKGNvbW1vbklzc3VlLnRpdGxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDb21tb25Jc3N1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRJc3N1ZSA9ICh0aGlzLmNvbW1vbklzc3VlTGlzdC5maWx0ZXIoKGNvbW1vbklzc3VlKSA9PiBjb21tb25Jc3N1ZS50aXRsZSA9PT0gbmV3VmFsdWVbMF0pKVswXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZWN0ZWRJc3N1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uKHNlbGVjdGVkSXNzdWUuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVSZWNpcGllbnRzKHNlbGVjdGVkSXNzdWUuYWRkaXRpb25hbFJlY2lwaWVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUoc2VsZWN0ZWRJc3N1ZS50aXRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENoYW5nZUNvbnRhY3Qoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0NoYW5nZUNvbnRhY3Qoc3RhdGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlQXNUZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdDb21tb25Jc3N1ZSA9IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbi5wZWVrKCksXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFJlY2lwaWVudHM6IHRoaXMuaXNzdWVSZWNpcGllbnRzLnBlZWsoKSxcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZS5wZWVrKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudXNlckFjdGlvbnNcbiAgICAgICAgICAgICAgICAuc2VuZE5ld0NvbW1vbklzc3VlVG9TZXJ2ZXIobmV3Q29tbW9uSXNzdWUpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndW5hYmxlIHRvIHNlbmQgbmV3IGNvbW1vbiBpc3N1ZSB0byBTZXJ2ZXIsIHBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJJc3N1ZXMoKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RldmljZScpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZWxlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBlbGVtZW50cy5pdGVtKGluZGV4KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzc3VlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNzdWVMaXN0KFtdKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VuZElzc3VlcygpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzc3VlTGlzdC5wZWVrKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckFjdGlvbnMuc2VuZElzc3Vlc1RvTWFpbFNlcnZlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUZWFjaGVyc1RvTWFpbExpc3Q6IHRoaXMuYWRkVGVhY2hlcnNUb01haWwucGVlaygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiB0aGlzLmlzc3VlTGlzdC5wZWVrKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odGhpcy5pc3N1ZUxpc3QoW10pKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndW5hYmxlIHRvIHNlbmQgSXNzdWVzIHRvIFNlcnZlciwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdubyBpc3N1ZXMgdG8gc2VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBjaGFuZ2VDb250YWN0KCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zaG93Q2hhbmdlQ29udGFjdChmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnJvb21Db250YWN0KHRoaXMucm9vbUNvbnRhY3RJbnB1dC5wZWVrKCkpO1xuICAgICAgICAgICAgdGhpcy5yb29tQ29udGFjdE1haWwodGhpcy5yb29tQ29udGFjdE1haWxJbnB1dC5wZWVrKCkpO1xuXG4gICAgICAgICAgICB0aGlzLnVzZXJBY3Rpb25zLnNlbmRDaGFuZ2VSb29tQ29udGFjdFRvTWFpbFNlcnZlcihcbiAgICAgICAgICAgICAgICB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3Q6IHRoaXMucm9vbUNvbnRhY3RJbnB1dC5wZWVrKCksXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3RNYWlsOiB0aGlzLnJvb21Db250YWN0TWFpbElucHV0LnBlZWsoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgcHVibGljIGRlbGV0ZUlzc3VlKGlzc3VlSWQpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdJc3N1ZUxpc3QgPSB0aGlzLmlzc3VlTGlzdC5wZWVrKCk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBuZXdJc3N1ZUxpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlzc3VlID0gbmV3SXNzdWVMaXN0W2luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoaXNzdWUuaXNzdWVJZCA9PT0gaXNzdWVJZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVsZXRlZElzc3VlID0gbmV3SXNzdWVMaXN0LnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVEZXZpY2VJc3N1ZUNsYXNzSWZOb0xvbmdlckluSXNzdWVMaXN0KGRlbGV0ZWRJc3N1ZVswXS5kZXZpY2VJZCwgbmV3SXNzdWVMaXN0KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzc3VlTGlzdChuZXdJc3N1ZUxpc3QpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGRldmljZUhhc0lzc3VlcyhkZXZpY2VJZCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpc3N1ZSBvZiB0aGlzLmlzc3VlTGlzdC5wZWVrKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNzdWUuZGV2aWNlSWQgPT09IGRldmljZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5jZWxJc3N1ZSgpIHtcbiAgICAgICAgbGV0IG1vZGFsRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpO1xuICAgICAgICBtb2RhbEVsZW1lbnQuY2xhc3NOYW1lID0gbW9kYWxFbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCdhY3RpdmUnLCAnZGlzYWJsZWQnKTtcblxuICAgICAgICB0aGlzLnJlc2V0Rm9ybUZpZWxkcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRJc3N1ZSgpIHtcbiAgICAgICAgbGV0IG1vZGFsRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNzdWVEZXZpY2VJZC5wZWVrKCkgIT09IDApIHtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uLnBlZWsoKSA9PT0gJycgfHwgdGhpcy5kZXNjcmlwdGlvbi5wZWVrKCkubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFJvb21MYXlvdXQuREVTQ1JJUFRJT05fSU5WQUxJRCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCcnKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNzdWUgPSBuZXcgSXNzdWUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpc3N1ZS50aXRsZSA9IHRoaXMudGl0bGUucGVlaygpO1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZS5kZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb24ucGVlaygpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjaXBpZW50cyA9IHRoaXMuaXNzdWVSZWNpcGllbnRzLnBlZWsoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hZGRXb3Jrc2hvcFRvTWFpbC5wZWVrKCkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY2lwaWVudHMgKz0gUm9vbUxheW91dC5XT1JLU0hPUF9NQUlMO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc3N1ZVJlY2lwaWVudHMucGVlaygpLmluZGV4T2YoJywnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZS5yZWNpcGllbnRzID0gcmVjaXBpZW50cy50cmltKCkuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlLnJlY2lwaWVudHMgPSBbcmVjaXBpZW50c107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpc3N1ZS5kZXZpY2VJZCA9IHRoaXMuaXNzdWVEZXZpY2VJZC5wZWVrKCk7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlLmlzc3VlSWQgPSB0aGlzLmlzc3VlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZS5yb29tSWQgPSB0aGlzLnJvb21JZDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRldmljZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGV2aWNlLScgKyBpc3N1ZS5kZXZpY2VJZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpc3N1ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVMaXN0LnB1c2goaXNzdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzc3VlRm9ybUNvbnRhaW5lci5hZGRJc3N1ZShpc3N1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsRWxlbWVudC5jbGFzc05hbWUgPSBtb2RhbEVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoJ2FjdGl2ZScsICdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0Rm9ybUZpZWxkcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Mb2FkKHJvb20pIHtcbiAgICAgICAgdGhpcy5yb29tSWQgPSByb29tLnJvb21JZDtcbiAgICAgICAgdGhpcy5yb29tQ29udGFjdChyb29tLmNvbnRhY3QpO1xuICAgICAgICB0aGlzLnJvb21Db250YWN0SW5wdXQocm9vbS5jb250YWN0KTtcbiAgICAgICAgdGhpcy5yb29tQ29udGFjdE1haWwocm9vbS5jb250YWN0TWFpbCk7XG4gICAgICAgIHRoaXMucm9vbUNvbnRhY3RNYWlsSW5wdXQocm9vbS5jb250YWN0TWFpbCk7XG4gICAgICAgIHRoaXMucm9vbSA9IHJvb207XG4gICAgfVxuXG4gICAgcHVibGljIGRldmljZUNsaWNrKGRldmljZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBtb2RhbEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwnKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrJyArIGRldmljZSk7XG4gICAgICAgICAgICBtb2RhbEVsZW1lbnQuY2xhc3NOYW1lID0gbW9kYWxFbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCdkaXNhYmxlZCcsICdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuaXNzdWVEZXZpY2VJZChwYXJzZUludChkZXZpY2UpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZVRvYXN0KCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLnNob3dFcnJvcihmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmVycm9yKCcnKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0Rm9ybUZpZWxkcygpIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbignJyk7XG4gICAgICAgIHRoaXMuaXNzdWVSZWNpcGllbnRzKCcnKTtcbiAgICAgICAgdGhpcy50aXRsZSgnJyk7XG4gICAgICAgIHRoaXMuYWRkVGVhY2hlcnNUb01haWwoZmFsc2UpO1xuICAgICAgICB0aGlzLmFkZFdvcmtzaG9wVG9NYWlsKGZhbHNlKTtcbiAgICAgICAgdGhpcy5pc3N1ZURldmljZUlkKDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlRGV2aWNlSXNzdWVDbGFzc0lmTm9Mb25nZXJJbklzc3VlTGlzdChkZXZpY2VJZCwgaXNzdWVzKSB7XG4gICAgICAgIGxldCBpc3N1ZXNXaXRoQ3VycmVudERldmljZUlkID0gaXNzdWVzLmZpbHRlcigoaXNzdWUpID0+IGlzc3VlLmRldmljZUlkID09PSBkZXZpY2VJZCk7XG5cbiAgICAgICAgaWYgKGlzc3Vlc1dpdGhDdXJyZW50RGV2aWNlSWQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGV2aWNlLScgKyBkZXZpY2VJZCk7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzc3VlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuc2lkZWJhci1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM5M2Q1MztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHdpZHRoOiAxNTBweDsgfVxcbiAgQG1lZGlhIChtaW4td2lkdGg6IDkwMHB4KSB7XFxuICAgIC5zaWRlYmFyLWNvbnRhaW5lciB7XFxuICAgICAgd2lkdGg6IDI1MHB4OyB9IH1cXG5cXG4uc2lkZWJhciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwYWRkaW5nOiAyNXB4OyB9XFxuXFxuLnNpZGViYXItbGlzdCB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiAxMDAlOyB9XFxuICAuc2lkZWJhci1saXN0IC5pY29uIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICAgIGZsb2F0OiBsZWZ0O1xcbiAgICBtYXJnaW4tbGVmdDogMTVweDtcXG4gICAgbWFyZ2luLXRvcDogNXB4OyB9XFxuICAuc2lkZWJhci1saXN0IGEge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBwYWRkaW5nOiA1cHggMzVweDtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgICB3aWR0aDogMTAwJTsgfVxcbiAgLnNpZGViYXItbGlzdCAuaXRlbSB7XFxuICAgIG1hcmdpbjogNXB4IDA7IH1cXG4gICAgLnNpZGViYXItbGlzdCAuaXRlbS5hY3RpdmUgYSB7XFxuICAgICAgYm9yZGVyLWxlZnQ6IDVweCBzb2xpZCAjM2M3N2JlOyB9XFxuICAgIC5zaWRlYmFyLWxpc3QgLml0ZW06aG92ZXIge1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0ZTUzNzE7IH1cXG4gIC5zaWRlYmFyLWxpc3QgLnNldGl0ZW0ge1xcbiAgICBtYXJnaW4tbGVmdDogNXB4OyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPCEtLTxkaXYgZGF0YS1iaW5kPVxcXCJ0ZXh0OiBKU09OLnN0cmluZ2lmeSgkcGFyZW50KVxcXCI+PC9kaXY+LS0+XFxuXFxuPG5hdiBjbGFzcz1cXFwic2lkZWJhci1saXN0XFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6IHtkYXRhOiB3aW5nTGlzdCwgYXM6ICd3aW5nJ31cXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtIGFjdGl2ZVxcXCI+XFxuICAgICAgICA8YSBocmVmPVxcXCIjXFxcIj48c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHdpbmdcXFwiPjwvc3Bhbj48L2E+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGRhdGEtYmluZD1cXFwiZm9yZWFjaDoge2RhdGE6ICRwYXJlbnQuZ2V0Um9vbXNCeVdpbmcod2luZyksIGFzOiAncm9vbSd9XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0gc2V0aXRlbSBhY3RpdmVcXFwiPlxcbiAgICAgICAgICAgIDxhIGRhdGEtYmluZD1cXFwiYXR0cjoge2hyZWY6ICc/cGFnZT1yb29tJnJvb21JZD0nK3Jvb20ucm9vbUlkfVxcXCI+PHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiByb29tLnJvb21JZFxcXCI+PC9zcGFuPjwvYT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L25hdj5cXG5cIjtcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuLi9Db21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgU2lkZWJhciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT01QT05FTlRfTkFNRSA9ICdzaWRlYmFyJztcbiAgICBwdWJsaWMgcm9vbXM6IEFycmF5PGFueT47XG4gICAgcHVibGljIHdpbmdMaXN0ID0gW107XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3Iocm9vbXM6IGFueSkge1xuICAgICAgICBzdXBlcihTaWRlYmFyLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5yb29tcyA9IHJvb21zO1xuICAgICAgICB0aGlzLndpbmdMaXN0ID0gdGhpcy5nZXRVbmlxdWVLZXlzKHJvb21zLCAnd2luZycpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGlmIChhIDwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGEgPiBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBnZXRGbG9vckxpc3RGb3JXaW5nKHdpbmc6IHN0cmluZykge1xuICAgICAgICBsZXQgd2luZ1Jvb21zID0gdGhpcy5yb29tcy5maWx0ZXIoKHJvb20pID0+IHJvb20ud2luZyA9PT0gd2luZyk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFVuaXF1ZUtleXMod2luZ1Jvb21zLCAnZmxvb3InKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Um9vbXMod2luZywgZmxvb3IpIHtcblxuICAgICAgICBsZXQgZmlsdGVyZWRSb29tcyA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLndpbmcgPT09IHdpbmcgJiYgcm9vbS5mbG9vciA9PT0gZmxvb3IpO1xuICAgICAgICByZXR1cm4gZmlsdGVyZWRSb29tcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYS5zdWJzdHIoMSkgPCBiLnN1YnN0cigxKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGEuc3Vic3RyKDEpID4gYi5zdWJzdHIoMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJldHVybiB0aGlzLnJvb21zLmZpbHRlcigocm9vbSkgPT4gcm9vbS53aW5nID09PSB3aW5nICYmIHJvb20uZmxvb3IgPT09IGZsb29yKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Um9vbXNCeVdpbmcod2luZykge1xuICAgICAgICBsZXQgZmlsdGVyZWRSb29tcyA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLndpbmcgPT09IHdpbmcpO1xuICAgICAgICByZXR1cm4gZmlsdGVyZWRSb29tcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYS5yb29tSWQgPCBiLnJvb21JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGEucm9vbUlkID4gYi5yb29tSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIHNpZGViYXInKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlVmlld01vZGVsKHZpZXdNb2RlbDogYW55KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFVuaXF1ZUtleXMoYXJyLCBwcm9wZXJ0eSkge1xuICAgICAgICBsZXQgdSA9IHt9LCBhID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgaWYgKCF1Lmhhc093blByb3BlcnR5KGFycltpXVtwcm9wZXJ0eV0pKSB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGFycltpXVtwcm9wZXJ0eV0pO1xuICAgICAgICAgICAgICAgIHVbYXJyW2ldW3Byb3BlcnR5XV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuLi9jb250ZW50L2NvbXBvbmVudHMvQ29tcG9uZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBLbm9ja291dENvbXBvbmVudCB7XG5cbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB0ZW1wbGF0ZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2aWV3TW9kZWw6IHsgaW5zdGFuY2U6IENvbXBvbmVudCB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IodGVtcGxhdGU6IHN0cmluZywgY29tcG9uZW50OiBDb21wb25lbnQpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gY29tcG9uZW50Lm5hbWU7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgdGhpcy52aWV3TW9kZWwgPSB7aW5zdGFuY2U6IGNvbXBvbmVudH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHtTdHlsZXNTdXBwbGllcn0gZnJvbSBcIi4vY29uZmlnL1N0eWxlc1wiO1xuaW1wb3J0IHtUZW1wbGF0ZVN1cHBsaWVyfSBmcm9tIFwiLi9jb25maWcvVGVtcGxhdGVzXCI7XG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4uL2NvbnRlbnQvY29tcG9uZW50cy9Db21wb25lbnRcIjtcbmltcG9ydCB7S25vY2tvdXRDb21wb25lbnR9IGZyb20gXCIuL0tub2Nrb3V0Q29tcG9uZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBrbm9ja291dENvbXBvbmVudEZhY3Rvcnkge1xuXG4gICAgcHJpdmF0ZSBzdHlsZXNTdXBwbGllcjogU3R5bGVzU3VwcGxpZXI7XG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVN1cHBsaWVyOiBUZW1wbGF0ZVN1cHBsaWVyO1xuICAgIHByaXZhdGUgY29tcG9uZW50czogQXJyYXk8Q29tcG9uZW50PjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgdGVtcGxhdGVTdXBwbGllcjogVGVtcGxhdGVTdXBwbGllcixcbiAgICAgICAgc3R5bGVzU3VwcGxpZXI6IFN0eWxlc1N1cHBsaWVyLFxuICAgICAgICBjb21wb25lbnRzOiBBcnJheTxDb21wb25lbnQ+XG4gICAgKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVTdXBwbGllciA9IHRlbXBsYXRlU3VwcGxpZXI7XG4gICAgICAgIHRoaXMuc3R5bGVzU3VwcGxpZXIgPSBzdHlsZXNTdXBwbGllcjtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gY29tcG9uZW50cztcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlS25vY2tvdXRDb21wb25lbnRzKCk6IEFycmF5PEtub2Nrb3V0Q29tcG9uZW50PiB7XG4gICAgICAgIGxldCBrbm9ja291dENvbXBvbmVudHM6IEFycmF5PEtub2Nrb3V0Q29tcG9uZW50PiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGtub2Nrb3V0Q29tcG9uZW50cy5wdXNoKHRoaXMuY3JlYXRlS25vY2tvdXRDb21wb25lbnQoY29tcG9uZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga25vY2tvdXRDb21wb25lbnRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVLbm9ja291dENvbXBvbmVudChjb21wb25lbnQ6IENvbXBvbmVudCk6IEtub2Nrb3V0Q29tcG9uZW50IHtcbiAgICAgICAgbGV0IGNvbXBvbmVudE5hbWUgPSB0aGlzLmdldENvbXBvbmVudE5hbWUoY29tcG9uZW50KTtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gJzxzdHlsZT4nICsgdGhpcy5zdHlsZXNTdXBwbGllci5nZXRTdHlsZXMoY29tcG9uZW50TmFtZSkgKyAnPC9zdHlsZT4nICsgdGhpcy50ZW1wbGF0ZVN1cHBsaWVyLmdldFRlbXBsYXRlKGNvbXBvbmVudE5hbWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgS25vY2tvdXRDb21wb25lbnQodGVtcGxhdGUsIGNvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb21wb25lbnROYW1lKGNvbXBvbmVudDogQ29tcG9uZW50KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQubmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IG5hbWUgaXMgbWlzc2luZy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wb25lbnQubmFtZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcbmltcG9ydCB7S25vY2tvdXRDb21wb25lbnR9IGZyb20gXCIuL2tub2NrT3V0Q29tcG9uZW50XCI7XG5pbXBvcnQge0hhbmRsZXJ9IGZyb20gXCIuL2hhbmRsZXJzL0hhbmRsZXJcIjtcblxuZXhwb3J0IGNsYXNzIEtub2Nrb3V0SW5pdGlhbGl6ZXIge1xuXG4gICAgcHJpdmF0ZSBrbm9ja291dENvbXBvbmVudHM6IEFycmF5PEtub2Nrb3V0Q29tcG9uZW50PjtcbiAgICBwcml2YXRlIGtub2Nrb3V0SGFuZGxlcnM6IEFycmF5PEhhbmRsZXI+O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICBrbm9ja291dENvbXBvbmVudHM6IEFycmF5PEtub2Nrb3V0Q29tcG9uZW50PixcbiAgICAgICAga25vY2tvdXRIYW5kbGVyczogQXJyYXk8SGFuZGxlcj4sXG4gICAgKSB7XG4gICAgICAgIHRoaXMua25vY2tvdXRDb21wb25lbnRzID0ga25vY2tvdXRDb21wb25lbnRzO1xuICAgICAgICB0aGlzLmtub2Nrb3V0SGFuZGxlcnMgPSBrbm9ja291dEhhbmRsZXJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0aWFsaXplKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmtub2Nrb3V0Q29tcG9uZW50cyk7XG4gICAgICAgIGZvciAobGV0IGtub2Nrb3V0Q29tcG9uZW50IG9mIHRoaXMua25vY2tvdXRDb21wb25lbnRzKSB7XG4gICAgICAgICAgICBrby5jb21wb25lbnRzLnJlZ2lzdGVyKGtub2Nrb3V0Q29tcG9uZW50Lm5hbWUsIGtub2Nrb3V0Q29tcG9uZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5rbm9ja291dEhhbmRsZXJzKSB7XG4gICAgICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNbaGFuZGxlci5uYW1lXSA9IGhhbmRsZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3QgY29tcG9uZW50Q2xhc3NNYXBwaW5nID0ge1xuICAgIGhvbWU6ICdIb21lJyxcbiAgICBzaWRlYmFyOiAnU2lkZWJhcicsXG4gICAgcm9vbUdyb3VwczogJ1Jvb21Hcm91cHMnLFxuICAgIHJvb21DaXJjdWxhcjogJ1Jvb21DaXJjdWxhcicsXG4gICAgcm9vbUdyb3Vwc0FuZ2xlZDogJ1Jvb21Hcm91cHNBbmdsZWQnXG59O1xuXG5leHBvcnQgdHlwZSBDb21wb25lbnROYW1lID0ga2V5b2YgdHlwZW9mIGNvbXBvbmVudENsYXNzTWFwcGluZztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcG9uZW50TmFtZSh4OiBzdHJpbmcpOiB4IGlzIENvbXBvbmVudE5hbWUge1xuICAgIGZvciAobGV0IGNvbXBvbmVudCBpbiBjb21wb25lbnRDbGFzc01hcHBpbmcpIHtcbiAgICAgICAgaWYgKHggPT09IGNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG4iLCJjb25zdCBzdHlsZXMgPSB7XG4gICAgLy8gcm9vbTogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXHJvb21cXFxccm9vbS5jc3MnKSxcbiAgICAvLyBpc3N1ZUZvcm06IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxpc3N1ZUZvcm1cXFxcaXNzdWVGb3JtLmNzcycpLFxuICAgIHNpZGViYXI6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxzaWRlYmFyXFxcXHNpZGViYXIuY3NzJyksXG4gICAgaG9tZTogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXGhvbWVcXFxcaG9tZS5jc3MnKSxcbiAgICByb29tR3JvdXBzOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc1xcXFxyb29tR3JvdXBzLmNzcycpLFxuICAgIHJvb21Hcm91cHNBbmdsZWQ6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tR3JvdXBzQW5nbGVkXFxcXHJvb21Hcm91cHNBbmdsZWQuY3NzJyksXG4gICAgcm9vbUNpcmN1bGFyOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUNpcmN1bGFyXFxcXHJvb21DaXJjdWxhci5jc3MnKSxcbn07XG5cbmV4cG9ydCBjbGFzcyBTdHlsZXNTdXBwbGllciB7XG4gICAgcHVibGljIGdldFN0eWxlcyhzdHlsZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgc3R5bGUgPSBzdHlsZXNbc3R5bGVOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVmZXJlbmNlZCBTdHlsZXMgbm90IGZvdW5kIGZvcjogXCInICsgc3R5bGVOYW1lICsgJ1wiJyk7XG4gICAgfVxufVxuIiwiY29uc3QgdGVtcGxhdGVzID0ge1xuICAgIC8vIHJvb206IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tXFxcXHJvb20uaHRtbCcpLFxuICAgIC8vIGlzc3VlRm9ybTogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXGlzc3VlRm9ybVxcXFxpc3N1ZUZvcm0uaHRtbCcpLFxuICAgIHNpZGViYXI6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxzaWRlYmFyXFxcXHNpZGViYXIuaHRtbCcpLFxuICAgIGhvbWU6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxob21lXFxcXGhvbWUuaHRtbCcpLFxuICAgIHJvb21Hcm91cHM6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tR3JvdXBzXFxcXHJvb21Hcm91cHMuaHRtbCcpLFxuICAgIHJvb21Hcm91cHNBbmdsZWQ6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tR3JvdXBzQW5nbGVkXFxcXHJvb21Hcm91cHNBbmdsZWQuaHRtbCcpLFxuICAgIHJvb21DaXJjdWxhcjogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXHJvb21DaXJjdWxhclxcXFxyb29tQ2lyY3VsYXIuaHRtbCcpXG59O1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVTdXBwbGllciB7XG4gICAgcHVibGljIGdldFRlbXBsYXRlKHRlbXBsYXRlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IHRlbXBsYXRlc1t0ZW1wbGF0ZU5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWZlcmVuY2VkIHRlbXBsYXRlIG5vdCBmb3VuZCBmb3I6ICcgKyB0ZW1wbGF0ZU5hbWUpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7QWxsQmluZGluZ3NBY2Nlc3NvciwgQmluZGluZ0NvbnRleHR9IGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7SGFuZGxlcn0gZnJvbSAnLi9IYW5kbGVyJztcbmltcG9ydCB7VXNlckFjdGlvbnN9IGZyb20gJy4uLy4uL1VzZXJBY3Rpb25zJztcblxuZXhwb3J0IGNsYXNzIExpbmtIYW5kbGVyIGltcGxlbWVudHMgSGFuZGxlciB7XG5cbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgdXNlckFjdGlvbnM6IFVzZXJBY3Rpb25zO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucykge1xuICAgICAgICB0aGlzLnVzZXJBY3Rpb25zID0gdXNlckFjdGlvbnM7XG4gICAgICAgIHRoaXMubmFtZSA9ICdsaW5rJztcbiAgICAgICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoZWxlbWVudDogYW55LCB2YWx1ZUFjY2Vzc29yOiAoKSA9PiBhbnksIGFsbEJpbmRpbmdzQWNjZXNzb3I6IEFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbDogYW55LCBiaW5kaW5nQ29udGV4dDogQmluZGluZ0NvbnRleHQ8YW55Pikge1xuICAgICAgICBsZXQgYWNjZXNzb3I6ICgpID0+IGFueSA9IHRoaXMuY3VzdG9tQWNjZXNzb3IodmFsdWVBY2Nlc3NvcigpLCB2aWV3TW9kZWwsIGFsbEJpbmRpbmdzQWNjZXNzb3IpO1xuICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNcbiAgICAgICAgICAuY2xpY2tcbiAgICAgICAgICAuaW5pdChlbGVtZW50LCBhY2Nlc3NvciwgYWxsQmluZGluZ3NBY2Nlc3Nvciwgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjdXN0b21BY2Nlc3NvcihvcmlnaW5hbEZ1bmN0aW9uLCB2aWV3TW9kZWwsIGFsbEJpbmRpbmdzQWNjZXNzb3IpOiBhbnkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5nc0FjY2Vzc29yKCkuY29uZGl0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHZpZXdNb2RlbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlTmFtZTogc3RyaW5nID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckFjdGlvbnMuY2hhbmdlUGFnZShtb2R1bGVOYW1lKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH1cbn1cbiIsImltcG9ydCBGb3JnZSA9IHJlcXVpcmUoXCJmb3JnZS1kaVwiKTtcbmltcG9ydCB7TGlua0hhbmRsZXJ9IGZyb20gXCIuL2hhbmRsZXJzL0xpbmtcIjtcbmltcG9ydCB7U3R5bGVzU3VwcGxpZXJ9IGZyb20gXCIuL2NvbmZpZy9TdHlsZXNcIjtcbmltcG9ydCB7VGVtcGxhdGVTdXBwbGllcn0gZnJvbSBcIi4vY29uZmlnL1RlbXBsYXRlc1wiO1xuaW1wb3J0IHtrbm9ja291dENvbXBvbmVudEZhY3Rvcnl9IGZyb20gXCIuL0tub2Nrb3V0Q29tcG9uZW50RmFjdG9yeVwiO1xuaW1wb3J0IHtjb21wb25lbnRDbGFzc01hcHBpbmd9IGZyb20gXCIuL2NvbmZpZy9Db21wb25lbnRzXCI7XG5pbXBvcnQge0tub2Nrb3V0SW5pdGlhbGl6ZXJ9IGZyb20gXCIuL0tub2Nrb3V0SW5pdGlhbGl6ZXJcIjtcblxuZXhwb3J0IGNsYXNzIEtub2Nrb3V0RGVwZW5kZW5jaWVzIHtcbiAgICBwcml2YXRlIGZvcmdlOiBGb3JnZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihmb3JnZTogRm9yZ2UpIHtcbiAgICAgICAgdGhpcy5mb3JnZSA9IGZvcmdlO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyS25vY2tvdXRTZXJ2aWNlcygpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyS25vY2tvdXRNb2R1bGVzKCk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnY29tcG9uZW50Q2xhc3NNYXBwaW5nJykudG8uaW5zdGFuY2UoY29tcG9uZW50Q2xhc3NNYXBwaW5nKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdrbm9ja291dEluaXRpYWxpemVyJykudG8udHlwZShLbm9ja291dEluaXRpYWxpemVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJLbm9ja291dFNlcnZpY2VzKCkge1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2tub2Nrb3V0SGFuZGxlcnMnKS50by50eXBlKExpbmtIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJLbm9ja291dE1vZHVsZXMoKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgna25vY2tvdXRIYW5kbGVycycpLnRvLnR5cGUoTGlua0hhbmRsZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3N0eWxlc1N1cHBsaWVyJykudG8udHlwZShTdHlsZXNTdXBwbGllcik7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgndGVtcGxhdGVTdXBwbGllcicpLnRvLnR5cGUoVGVtcGxhdGVTdXBwbGllcik7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnY29tcG9uZW50U2V0dXAnKS50by50eXBlKGtub2Nrb3V0Q29tcG9uZW50RmFjdG9yeSk7XG5cbiAgICAgICAgbGV0IGNvbXBvbmVudFNldHVwOiBrbm9ja291dENvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmZvcmdlLmdldDxrbm9ja291dENvbXBvbmVudEZhY3Rvcnk+KCdjb21wb25lbnRTZXR1cCcpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2tub2Nrb3V0Q29tcG9uZW50cycpLnRvLmZ1bmN0aW9uKGNvbXBvbmVudFNldHVwLmNyZWF0ZUtub2Nrb3V0Q29tcG9uZW50cy5iaW5kKGNvbXBvbmVudFNldHVwKSk7XG4gICAgfVxufVxuIl19
