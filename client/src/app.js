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
module.exports = "<h1>Please select a room</h1>\n";

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
    function Home(commonIssues) {
        var _this = _super.call(this, Home.COMPONENT_NAME) || this;
        _this.commonIssueList = commonIssues;
        return _this;
    }
    Home.prototype.updateViewModel = function (viewModel) {
    };
    Home.prototype.onRender = function () {
        console.log('rendering home');
    };
    Home.prototype.onLoad = function () {
        console.log('home loaded');
        var elem = document.getElementById('template-select');
        var b = elem instanceof HTMLElement;
        console.log(b);
    };
    Home.prototype.onInit = function () {
        console.log('init home');
    };
    Home.prototype.deviceClick = function (device) {
        return function () {
            console.log('click' + device);
        };
    };
    Home.COMPONENT_NAME = 'home';
    return Home;
}(Component_1.Component));
exports.Home = Home;
},{"../Component":36}],41:[function(require,module,exports){
module.exports = ".room-container {\n  align-items: flex-start;\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: flex;\n  flex-wrap: wrap;\n  height: 100%;\n  width: 100%;\n  position: relative; }\n\n.table-group {\n  position: relative;\n  width: 40%;\n  border: 1px solid black;\n  height: 30%;\n  margin: 4% 4%;\n  box-sizing: border-box; }\n  .table-group.teacher-desk {\n    position: absolute;\n    bottom: 5%;\n    height: 10%;\n    width: 20%;\n    left: 60%;\n    margin: 0; }\n\n.device {\n  height: 50px;\n  width: 50px;\n  position: absolute;\n  border: 2px solid black;\n  cursor: pointer; }\n  .device.top {\n    left: 20%;\n    top: 10%; }\n  .device.bot-right {\n    right: 10%;\n    bottom: 20%; }\n  .device.bot-left {\n    left: 10%;\n    bottom: 20%; }\n  .device:hover {\n    border: 2px solid blue; }\n";

},{}],42:[function(require,module,exports){
module.exports = "some Room, or not!\n\n<div class=\"room-container\">\n\n    <div class=\"table-group\">\n        <div class=\"device top\"></div>\n        <div class=\"device bot-left\"></div>\n        <div class=\"device bot-right\"></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\"></div>\n        <div class=\"device bot-left\"></div>\n        <div class=\"device bot-right\"></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\"></div>\n        <div class=\"device bot-left\"></div>\n        <div class=\"device bot-right\"></div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\"></div>\n        <div class=\"device bot-left\"></div>\n        <div class=\"device bot-right\"></div>\n    </div>\n\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\"></div>\n    </div>\n</div>\n";

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
    RoomCircular.COMPONENT_NAME = 'roomCircular';
    return RoomCircular;
}(RoomLayout_1.RoomLayout));
exports.RoomCircular = RoomCircular;
},{"../room/RoomLayout":50}],44:[function(require,module,exports){
module.exports = ".room-container {\n  align-items: flex-start;\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: flex;\n  flex-wrap: wrap;\n  height: 100%;\n  position: relative;\n  width: 100%; }\n\n.table-group {\n  border: 1px solid black;\n  box-sizing: border-box;\n  height: 30%;\n  margin: 4% 4%;\n  position: relative;\n  width: 40%; }\n  .table-group.teacher-desk {\n    bottom: 5%;\n    height: 10%;\n    left: 60%;\n    margin: 0;\n    position: absolute;\n    width: 20%; }\n\n.device {\n  border: 2px solid black;\n  cursor: pointer;\n  height: 50px;\n  position: absolute;\n  width: 50px; }\n  .device.top {\n    left: 20%;\n    top: 10%; }\n  .device.bot-right {\n    bottom: 20%;\n    right: 10%; }\n  .device.bot-left {\n    bottom: 20%;\n    left: 10%; }\n  .device:hover {\n    border: 2px solid blue; }\n";

},{}],45:[function(require,module,exports){
module.exports = "<div class=\"room-container\">\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\">1</div>\n        <div class=\"device bot-left\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\">2</div>\n        <div class=\"device bot-right\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\">3</div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\">4</div>\n        <div class=\"device bot-left\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\">5</div>\n        <div class=\"device bot-right\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\">6</div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\">7</div>\n        <div class=\"device bot-left\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\">8</div>\n        <div class=\"device bot-right\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\">9</div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\">10</div>\n        <div class=\"device bot-left\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\">11</div>\n        <div class=\"device bot-right\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\">12</div>\n    </div>\n\n    <div class=\"table-group teacher-desk\">\n        <div class=\"device\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\">13</div>\n    </div>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h2>neuen Fehler f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h2>\n    <form>\n        <label>\n            Templates: <select\n            class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\"\n        >\n            <option data-bind=\"text: title\"></option>\n        </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff: <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung: <textarea class=\"description\" name=\"description\" data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            weitere Emp&auml;nger: <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea><span\n            class=\"tooltip popRight\" data-tooltip=\"eine Liste an zus&auml;tzlichen Emp&auml;ngern. Email adressen sind mit einem Komma trennen.\"\n        >[i]</span>\n        </label>\n        <!--//data bind foreach recipients-list-->\n        <!--additional recipients: -->\n        <!--<div class=\"recipients-list\">-->\n        <!--<div class=\"class\" data-bind=\"click: $parent.removeRecipient($index)\"></div>-->\n        <!--</div>-->\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">ok</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            <span data-bind=\"text: description.substr(0, 10) + '...'\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">remove</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Problemberichtliste leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Problembericht absenden</a>\n    </div>\n</div>\n";

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
    RoomGroupsAngled.COMPONENT_NAME = 'roomGroupsAngled';
    return RoomGroupsAngled;
}(RoomLayout_1.RoomLayout));
exports.RoomGroupsAngled = RoomGroupsAngled;
},{"../room/RoomLayout":50}],47:[function(require,module,exports){
module.exports = ".room-container {\n  align-items: flex-start;\n  border: 1px solid black;\n  box-sizing: border-box;\n  display: flex;\n  flex-wrap: wrap;\n  height: 100%;\n  width: 100%; }\n\n.modal {\n  background-color: white;\n  border: 1px solid black;\n  left: 50%;\n  padding: 20px;\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 350px; }\n  .modal.disabled {\n    display: none; }\n  .modal .template-select {\n    margin: 5px 0;\n    width: 100%; }\n  .modal .template-save {\n    float: right; }\n  .modal .title {\n    margin: 5px 0;\n    width: 100%; }\n  .modal .recipients {\n    height: 21px;\n    margin: 0 0 20px;\n    width: 340px; }\n  .modal .description {\n    height: 90px;\n    width: 330px; }\n  .modal .abort {\n    float: right; }\n  .modal .confirm {\n    float: left; }\n  .modal h2 {\n    margin: 0 0 20px; }\n\n.issue-list {\n  background-color: white;\n  border: 1px solid #4e5371;\n  bottom: 0;\n  height: 200px;\n  left: 50%;\n  min-height: 200px;\n  min-width: 810px;\n  overflow: scroll;\n  position: fixed;\n  transform: translate(-50%, 0);\n  width: 500px; }\n  .issue-list .remove {\n    float: right;\n    margin-top: -5px; }\n\n.list-item {\n  border-bottom: 1px solid #e5e5e5;\n  box-sizing: border-box;\n  padding: 10px; }\n\n.actions {\n  bottom: 0; }\n  .actions .button {\n    float: left;\n    width: 50%; }\n\n.table-group {\n  position: relative;\n  width: 30%;\n  border: 1px solid black;\n  height: 40%;\n  margin: 4% 10%;\n  box-sizing: border-box; }\n  .table-group.extended {\n    height: 45%;\n    margin-top: -20px; }\n    .table-group.extended .device.bot-right {\n      bottom: 40%; }\n    .table-group.extended .device.bot-left {\n      bottom: 40%; }\n    .table-group.extended .device.bottom {\n      bottom: 10%;\n      right: 20%; }\n\n.device {\n  height: 50px;\n  width: 50px;\n  position: absolute;\n  border: 2px solid green;\n  cursor: pointer; }\n  .device.top {\n    left: 20%;\n    top: 10%; }\n  .device.bot-right {\n    right: 10%;\n    bottom: 20%; }\n  .device.bot-left {\n    left: 10%;\n    bottom: 20%; }\n  .device:hover {\n    border: 2px solid blue; }\n  .device.issue {\n    border: 2px solid red; }\n";

},{}],48:[function(require,module,exports){
module.exports = "<h1>Raum: <span data-bind=\"text: $parent.roomId\"></span> Ansprechspartner: <span data-bind=\"text: $parent.roomContact\"></span></h1>\n\n<div class=\"room-container\">\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-1\" data-bind=\"click: $parent.deviceClick(1)\">1</div>\n        <div class=\"device bot-left\" id=\"device-2\" data-bind=\"click: $parent.deviceClick(2)\">2</div>\n        <div class=\"device bot-right\" id=\"device-3\" data-bind=\"click: $parent.deviceClick(3)\">3</div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-4\" data-bind=\"click: $parent.deviceClick(4)\">4</div>\n        <div class=\"device bot-left\" id=\"device-5\" data-bind=\"click: $parent.deviceClick(5)\">5</div>\n        <div class=\"device bot-right\" id=\"device-6\" data-bind=\"click: $parent.deviceClick(6)\">6</div>\n    </div>\n    <div class=\"table-group\">\n        <div class=\"device top\" id=\"device-7\" data-bind=\"click: $parent.deviceClick(7)\">7</div>\n        <div class=\"device bot-left\" id=\"device-8\" data-bind=\"click: $parent.deviceClick(8)\">8</div>\n        <div class=\"device bot-right\" id=\"device-9\" data-bind=\"click: $parent.deviceClick(9)\">9</div>\n    </div>\n    <div class=\"table-group extended\">\n        <div class=\"device top\" id=\"device-10\" data-bind=\"click: $parent.deviceClick(10)\">10</div>\n        <div class=\"device bot-left\" id=\"device-11\" data-bind=\"click: $parent.deviceClick(11)\">11</div>\n        <div class=\"device bot-right\" id=\"device-12\" data-bind=\"click: $parent.deviceClick(12)\">12</div>\n        <div class=\"device bottom\" id=\"device-13\" data-bind=\"click: $parent.deviceClick(13)\">13</div>\n    </div>\n</div>\n\n<div class=\"modal disabled\" id=\"modal\">\n    <h2>neuen Fehler f&uuml;r Ger&auml;t: <span data-bind=\"text: $parent.issueDeviceId\"></span> melden</h2>\n    <form>\n        <label>\n            Templates: <select\n            class=\"template-select\" id=\"template-select\" data-bind=\"options: $parent.commonIssueNameList, selectedOptions: $parent.selectedCommonIssue\"\n        >\n            <option data-bind=\"text: title\"></option>\n        </select>\n            <a class=\"button template-save\" href=\"#\" data-bind=\"click: $parent.saveAsTemplate()\">speichern</a>\n        </label>\n        <br>\n        <label>\n            Betreff: <input class=\"title\" name=\"title\" type=\"text\" data-bind=\"value: $parent.title\" >\n        </label>\n        <br>\n        <label>\n            Beschreibung: <textarea class=\"description\" name=\"description\" data-bind=\"value: $parent.description\"></textarea>\n        </label>\n        <br>\n        <label>\n            weitere Emp&auml;nger: <textarea class=\"recipients\" name=\"recipients\" data-bind=\"value: $parent.issueRecipients\"></textarea><span\n            class=\"tooltip popRight\" data-tooltip=\"eine Liste an zus&auml;tzlichen Emp&auml;ngern. Email adressen sind mit einem Komma trennen.\"\n        >[i]</span>\n        </label>\n        <!--//data bind foreach recipients-list-->\n        <!--additional recipients: -->\n        <!--<div class=\"recipients-list\">-->\n        <!--<div class=\"class\" data-bind=\"click: $parent.removeRecipient($index)\"></div>-->\n        <!--</div>-->\n\n        <label>\n            <a href=\"#\" class=\"button abort\" data-bind=\"click: $parent.cancelIssue()\">abbrechen</a>\n            <a href=\"#\" class=\"button confirm\" data-bind=\"click: $parent.addIssue()\">ok</a>\n        </label>\n    </form>\n</div>\n\n<div class=\"issue-list\">\n    <div class=\"issue-items\" data-bind=\"foreach: $parent.issueList\">\n        <div class=\"list-item\">\n            <span data-bind=\"text: title\"></span>\n            <span data-bind=\"text: description.substr(0, 10) + '...'\"></span>\n            Ger&auml;t: <span data-bind=\"text: deviceId\"></span>\n            Empf&auml;nger: <span data-bind=\"text: recipients\"></span>\n            <a href=\"#\" class=\"button remove\" data-bind=\"click: $parent.deleteIssue(issueId)\">remove</a>\n        </div>\n    </div>\n\n    <div class=\"actions\">\n        <a href=\"#\" class=\"button action-clear\" data-bind=\"click: $parent.clearIssues()\">Problemberichtliste leeren</a>\n        <a href=\"#\" class=\"button action-send\" data-bind=\"click: $parent.sendIssues()\">Problembericht absenden</a>\n    </div>\n</div>\n";

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
        _this.commonIssueNameList = ['Fehler Template'];
        _this.issueDeviceId = ko.observable(0);
        _this.issueRecipients = ko.observable('');
        _this.issueCounter = 0;
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
                element.className = element.className.replace('issue', '');
            }
            _this.issueList([]);
        };
    };
    RoomLayout.prototype.sendIssues = function () {
        var _this = this;
        return function () {
            if (_this.issueList.peek().length > 0) {
                _this.userActions.sendIssuesToMailServer(_this.issueList.peek())
                    .then(_this.issueList([]))["catch"](function () {
                    console.error('unable to send Issues to Server, please try again later');
                });
            }
            else {
                console.warn('no issues to send');
            }
        };
    };
    RoomLayout.prototype.deleteIssue = function (issueId) {
        var _this = this;
        return function () {
            var newIssueList = _this.issueList.peek();
            for (var index = 0; index < newIssueList.length; index++) {
                var issue = newIssueList[index];
                if (issue.issueId === issueId) {
                    console.log('splicing');
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
                var issue = new Issue_1.Issue();
                issue.title = _this.title.peek();
                issue.description = _this.description.peek();
                console.log(_this.issueRecipients.peek());
                if (_this.issueRecipients.peek().indexOf(',') > -1) {
                    issue.recipients = (_this.issueRecipients.peek()).split(',');
                }
                else {
                    issue.recipients = [_this.issueRecipients.peek()];
                }
                issue.deviceId = _this.issueDeviceId.peek();
                issue.issueId = _this.issueCounter++;
                issue.roomId = _this.roomId;
                var deviceElement = document.getElementById('device-' + issue.deviceId);
                deviceElement.className += ' issue';
                console.log(issue);
                _this.issueList.push(issue);
                _this.issueFormContainer.addIssue(issue);
                modalElement.className = modalElement.className.replace('active', 'disabled');
                _this.resetFormFields();
            }
        };
    };
    RoomLayout.prototype.onLoad = function (room) {
        console.log(room.contact);
        this.roomId = room.roomId;
        this.roomContact = room.contact;
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
    RoomLayout.prototype.resetFormFields = function () {
        this.description('');
        this.issueRecipients('');
        this.title('');
        this.issueDeviceId(0);
    };
    RoomLayout.prototype.removeDeviceIssueClassIfNoLongerInIssueList = function (deviceId, issues) {
        var issuesWithCurrentDeviceId = issues.filter(function (issue) { return issue.deviceId === deviceId; });
        if (issuesWithCurrentDeviceId.length < 1) {
            var element = document.getElementById('device-' + deviceId);
            element.className = element.className.replace('issue', '');
        }
    };
    return RoomLayout;
}(Component_1.Component));
exports.RoomLayout = RoomLayout;
},{"../../../common/Issue":27,"../Component":36,"knockout":16}],51:[function(require,module,exports){
module.exports = ".sidebar-container {\n  background-color: #393d53;\n  box-sizing: border-box;\n  display: block;\n  width: 250px; }\n  @media (min-width: 900px) {\n    .sidebar-container {\n      width: 350px; } }\n\n.sidebar {\n  box-sizing: border-box;\n  display: block;\n  padding: 25px; }\n\n.sidebar-list {\n  color: white;\n  list-style: none;\n  padding: 0;\n  width: 100%; }\n  .sidebar-list .icon {\n    display: block;\n    float: left;\n    margin-left: 15px;\n    margin-top: 5px; }\n  .sidebar-list a {\n    box-sizing: border-box;\n    color: white;\n    display: block;\n    padding: 5px 35px;\n    text-decoration: none;\n    width: 100%; }\n  .sidebar-list .item {\n    margin: 5px 0; }\n    .sidebar-list .item.active a {\n      border-left: 5px solid #4ea1ff; }\n    .sidebar-list .item:hover {\n      background-color: #4e5371; }\n  .sidebar-list .setitem {\n    margin-left: 5px; }\n";

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
        console.log(filteredRooms);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL0JpbmRpbmcuanMiLCJub2RlX21vZHVsZXMvZm9yZ2UtZGkvQ29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9JbnNwZWN0b3IuanMiLCJub2RlX21vZHVsZXMvZm9yZ2UtZGkvZXJyb3JzL0NvbmZpZ3VyYXRpb25FcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9lcnJvcnMvUmVzb2x1dGlvbkVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvTGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvU2luZ2xldG9uTGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL2xpZmVjeWNsZXMvVHJhbnNpZW50TGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9GdW5jdGlvblJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9JbnN0YW5jZVJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2ZvcmdlLWRpL3Jlc29sdmVycy9SZXNvbHZlci5qcyIsIm5vZGVfbW9kdWxlcy9mb3JnZS1kaS9yZXNvbHZlcnMvVHlwZVJlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL2tub2Nrb3V0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9BcHBsaWNhdGlvbi50cyIsInNyYy9EZXBlbmRlbmNpZXMudHMiLCJzcmMvUm91dGVyLnRzIiwic3JjL1VzZXJBY3Rpb25zLnRzIiwic3JjL2FwcC50cyIsInNyYy9jb21tb24vSXNzdWUudHMiLCJzcmMvY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lci50cyIsInNyYy9jb21tb24vUGFyYW1SZWFkZXIudHMiLCJzcmMvY29tbW9uL1Jlc29sdmVyLnRzIiwic3JjL2NvbW1vbi9TZXJ2ZXJBY3Rpb25zLnRzIiwic3JjL2NvbW1vbi9YaHJQb3N0LnRzIiwic3JjL2NvbW1vbi9YaHJSZXF1ZXN0LnRzIiwic3JjL2NvbnRlbnQvQ29udGVudERlcGVuZGVuY2llcy50cyIsInNyYy9jb250ZW50L1BhZ2VSZW5kZXJlci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvQ29tcG9uZW50LnRzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9Db21wb25lbnRSZXNvbHZlci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvaG9tZS9ob21lLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvaG9tZS9ob21lLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL2hvbWUvaG9tZS50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhci5jc3MiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21DaXJjdWxhci9yb29tQ2lyY3VsYXIuaHRtbCIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUNpcmN1bGFyL3Jvb21DaXJjdWxhci50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwc0FuZ2xlZC9yb29tR3JvdXBzQW5nbGVkLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21Hcm91cHNBbmdsZWQvcm9vbUdyb3Vwc0FuZ2xlZC50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzLmNzcyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzLmh0bWwiLCJzcmMvY29udGVudC9jb21wb25lbnRzL3Jvb21Hcm91cHMvcm9vbUdyb3Vwcy50cyIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvcm9vbS9Sb29tTGF5b3V0LnRzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuY3NzIiwic3JjL2NvbnRlbnQvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuaHRtbCIsInNyYy9jb250ZW50L2NvbXBvbmVudHMvc2lkZWJhci9zaWRlYmFyLnRzIiwic3JjL2tub2Nrb3V0L0tub2Nrb3V0Q29tcG9uZW50LnRzIiwic3JjL2tub2Nrb3V0L0tub2Nrb3V0Q29tcG9uZW50RmFjdG9yeS50cyIsInNyYy9rbm9ja291dC9Lbm9ja291dEluaXRpYWxpemVyLnRzIiwic3JjL2tub2Nrb3V0L2NvbmZpZy9Db21wb25lbnRzLnRzIiwic3JjL2tub2Nrb3V0L2NvbmZpZy9TdHlsZXMudHMiLCJzcmMva25vY2tvdXQvY29uZmlnL1RlbXBsYXRlcy50cyIsInNyYy9rbm9ja291dC9oYW5kbGVycy9MaW5rLnRzIiwic3JjL2tub2Nrb3V0L2tub2Nrb3V0RGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBZ0IsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxtREFBd0IsQ0FBQyxDQUFDO1FBRXBFLElBQUksY0FBYyxHQUE2QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBMkIsZ0JBQWdCLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFRLENBQUEsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDcEgsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0F4QkEsQUF3QkMsSUFBQTtBQXhCWSxvREFBb0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wYXJlIGFuZCBpc0J1ZmZlciB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2Jsb2IvNjgwZTllNWU0ODhmMjJhYWMyNzU5OWE1N2RjODQ0YTYzMTU5MjhkZC9pbmRleC5qc1xuLy8gb3JpZ2luYWwgbm90aWNlOlxuXG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciB4ID0gYS5sZW5ndGg7XG4gIHZhciB5ID0gYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV07XG4gICAgICB5ID0gYltpXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoeSA8IHgpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgaWYgKGdsb2JhbC5CdWZmZXIgJiYgdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKTtcbiAgfVxuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKTtcbn1cblxuLy8gYmFzZWQgb24gbm9kZSBhc3NlcnQsIG9yaWdpbmFsIG5vdGljZTpcblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBmdW5jdGlvbnNIYXZlTmFtZXMgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9vKCkge30ubmFtZSA9PT0gJ2Zvbyc7XG59KCkpO1xuZnVuY3Rpb24gcFRvU3RyaW5nIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zikge1xuICBpZiAoaXNCdWZmZXIoYXJyYnVmKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKTtcbiAgfVxuICBpZiAoIWFycmJ1Zikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyYnVmLmJ1ZmZlciAmJiBhcnJidWYuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG52YXIgcmVnZXggPSAvXFxzKmZ1bmN0aW9uXFxzKyhbXlxcKFxcc10qKVxccyovO1xuLy8gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9mdW5jdGlvbi5wcm90b3R5cGUubmFtZS9ibG9iL2FkZWVlZWM4YmZjYzYwNjhiMTg3ZDdkOWZiM2Q1YmIxZDNhMzA4OTkvaW1wbGVtZW50YXRpb24uanNcbmZ1bmN0aW9uIGdldE5hbWUoZnVuYykge1xuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmMubmFtZTtcbiAgfVxuICB2YXIgc3RyID0gZnVuYy50b1N0cmluZygpO1xuICB2YXIgbWF0Y2ggPSBzdHIubWF0Y2gocmVnZXgpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gZ2V0TmFtZShzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZykge1xuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzIHx8ICF1dGlsLmlzRnVuY3Rpb24oc29tZXRoaW5nKSkge1xuICAgIHJldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKTtcbiAgfVxuICB2YXIgcmF3bmFtZSA9IGdldE5hbWUoc29tZXRoaW5nKTtcbiAgdmFyIG5hbWUgPSByYXduYW1lID8gJzogJyArIHJhd25hbWUgOiAnJztcbiAgcmV0dXJuICdbRnVuY3Rpb24nICsgIG5hbWUgKyAnXSc7XG59XG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5hY3R1YWwpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5kZWVwU3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBkZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwU3RyaWN0RXF1YWwnLCBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgJiYgaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKChhY3R1YWwgPT09IG51bGwgfHwgdHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgKGV4cGVjdGVkID09PSBudWxsIHx8IHR5cGVvZiBleHBlY3RlZCAhPT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIHN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIGluc3RhbmNlcyBvZiB0eXBlZCBhcnJheXMsIHdyYXAgdGhlaXIgdW5kZXJseWluZ1xuICAvLyBBcnJheUJ1ZmZlcnMgaW4gYSBCdWZmZXIgZWFjaCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZVxuICAvLyBUaGlzIG9wdGltaXphdGlvbiByZXF1aXJlcyB0aGUgYXJyYXlzIHRvIGhhdmUgdGhlIHNhbWUgdHlwZSBhcyBjaGVja2VkIGJ5XG4gIC8vIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgKGFrYSBwVG9TdHJpbmcpLiBOZXZlciBwZXJmb3JtIGJpbmFyeVxuICAvLyBjb21wYXJpc29ucyBmb3IgRmxvYXQqQXJyYXlzLCB0aG91Z2gsIHNpbmNlIGUuZy4gKzAgPT09IC0wIGJ1dCB0aGVpclxuICAvLyBiaXQgcGF0dGVybnMgYXJlIG5vdCBpZGVudGljYWwuXG4gIH0gZWxzZSBpZiAoaXNWaWV3KGFjdHVhbCkgJiYgaXNWaWV3KGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgIHBUb1N0cmluZyhhY3R1YWwpID09PSBwVG9TdHJpbmcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgIShhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHxcbiAgICAgICAgICAgICAgIGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkpIHtcbiAgICByZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxcbiAgICAgICAgICAgICAgICAgICBuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKSA9PT0gMDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgIT09IGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBtZW1vcyA9IG1lbW9zIHx8IHthY3R1YWw6IFtdLCBleHBlY3RlZDogW119O1xuXG4gICAgdmFyIGFjdHVhbEluZGV4ID0gbWVtb3MuYWN0dWFsLmluZGV4T2YoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsSW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAoYWN0dWFsSW5kZXggPT09IG1lbW9zLmV4cGVjdGVkLmluZGV4T2YoZXhwZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7XG4gICAgbWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG5cbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYiwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykge1xuICBpZiAoYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSlcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgaWYgKHN0cmljdCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgIT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSk7XG4gIHZhciBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIsIHN0cmljdCk7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKTtcbiAgdmFyIGtiID0gb2JqZWN0S2V5cyhiKTtcbiAgdmFyIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT09IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQubm90RGVlcFN0cmljdEVxdWFsID0gbm90RGVlcFN0cmljdEVxdWFsO1xuZnVuY3Rpb24gbm90RGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwU3RyaWN0RXF1YWwnLCBub3REZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59XG5cblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElnbm9yZS4gIFRoZSBpbnN0YW5jZW9mIGNoZWNrIGRvZXNuJ3Qgd29yayBmb3IgYXJyb3cgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIF90cnlCbG9jayhibG9jaykge1xuICB2YXIgZXJyb3I7XG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgYmxvY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJsb2NrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICBhY3R1YWwgPSBfdHJ5QmxvY2soYmxvY2spO1xuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIHVzZXJQcm92aWRlZE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZyc7XG4gIHZhciBpc1Vud2FudGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIHV0aWwuaXNFcnJvcihhY3R1YWwpO1xuICB2YXIgaXNVbmV4cGVjdGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIGFjdHVhbCAmJiAhZXhwZWN0ZWQ7XG5cbiAgaWYgKChpc1Vud2FudGVkRXhjZXB0aW9uICYmXG4gICAgICB1c2VyUHJvdmlkZWRNZXNzYWdlICYmXG4gICAgICBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHxcbiAgICAgIGlzVW5leHBlY3RlZEV4Y2VwdGlvbikge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyh0cnVlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MoZmFsc2UsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB0aHJvdyBlcnI7IH07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjEuMVxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgeDtcbiAgcmV0dXJuIHggIT09IG51bGwgJiYgKHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdmdW5jdGlvbicpO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoQXJyYXkuaXNBcnJheSkge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbn1cblxudmFyIGlzQXJyYXkgPSBfaXNBcnJheTtcblxudmFyIGxlbiA9IDA7XG52YXIgdmVydHhOZXh0ID0gdW5kZWZpbmVkO1xudmFyIGN1c3RvbVNjaGVkdWxlckZuID0gdW5kZWZpbmVkO1xuXG52YXIgYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gIHF1ZXVlW2xlbiArIDFdID0gYXJnO1xuICBsZW4gKz0gMjtcbiAgaWYgKGxlbiA9PT0gMikge1xuICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBpZiAoY3VzdG9tU2NoZWR1bGVyRm4pIHtcbiAgICAgIGN1c3RvbVNjaGVkdWxlckZuKGZsdXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xufVxuXG5mdW5jdGlvbiBzZXRBc2FwKGFzYXBGbikge1xuICBhc2FwID0gYXNhcEZuO1xufVxuXG52YXIgYnJvd3NlcldpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkO1xudmFyIGJyb3dzZXJHbG9iYWwgPSBicm93c2VyV2luZG93IHx8IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICh7fSkudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4vLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxudmFyIGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbi8vIHZlcnR4XG5mdW5jdGlvbiB1c2VWZXJ0eFRpbWVyKCkge1xuICBpZiAodHlwZW9mIHZlcnR4TmV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmVydHhOZXh0KGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBub2RlLmRhdGEgPSBpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMjtcbiAgfTtcbn1cblxuLy8gd2ViIHdvcmtlclxuZnVuY3Rpb24gdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIGVzNi1wcm9taXNlIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIGdsb2JhbFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWxTZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuXG4gICAgY2FsbGJhY2soYXJnKTtcblxuICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIGF0dGVtcHRWZXJ0eCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICB2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgIHJldHVybiB1c2VWZXJ0eFRpbWVyKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xuICB9XG59XG5cbnZhciBzY2hlZHVsZUZsdXNoID0gdW5kZWZpbmVkO1xuLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbmlmIChpc05vZGUpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG59IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG59IGVsc2UgaWYgKGlzV29ya2VyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNZXNzYWdlQ2hhbm5lbCgpO1xufSBlbHNlIGlmIChicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IGF0dGVtcHRWZXJ0eCgpO1xufSBlbHNlIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICB2YXIgcGFyZW50ID0gdGhpcztcblxuICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoY2hpbGRbUFJPTUlTRV9JRF0gPT09IHVuZGVmaW5lZCkge1xuICAgIG1ha2VQcm9taXNlKGNoaWxkKTtcbiAgfVxuXG4gIHZhciBfc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gIGlmIChfc3RhdGUpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gX2FyZ3VtZW50c1tfc3RhdGUgLSAxXTtcbiAgICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2soX3N0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pKCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlc29sdmVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVzb2x2ZWQgd2l0aCB0aGVcbiAgcGFzc2VkIGB2YWx1ZWAuIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZXNvbHZlKDEpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgxKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlc29sdmVcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHZhbHVlYFxuKi9cbmZ1bmN0aW9uIHJlc29sdmUkMShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBQRU5ESU5HID0gdm9pZCAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgPSAyO1xuXG52YXIgR0VUX1RIRU5fRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbihwcm9taXNlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBHRVRfVEhFTl9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlUaGVuKHRoZW4kJDEsIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgdHJ5IHtcbiAgICB0aGVuJCQxLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4kJDEpIHtcbiAgYXNhcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICB2YXIgZXJyb3IgPSB0cnlUaGVuKHRoZW4kJDEsIHRoZW5hYmxlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfVxuICB9LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQxKSB7XG4gIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmIHRoZW4kJDEgPT09IHRoZW4gJiYgbWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3Rvci5yZXNvbHZlID09PSByZXNvbHZlJDEpIHtcbiAgICBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhlbiQkMSA9PT0gR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCBHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0aGVuJCQxID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoZW4kJDEpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIHNlbGZGdWxmaWxsbWVudCgpKTtcbiAgfSBlbHNlIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGdldFRoZW4odmFsdWUpKTtcbiAgfSBlbHNlIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gIH1cblxuICBwdWJsaXNoKHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRDtcblxuICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwcm9taXNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHVuZGVmaW5lZCxcbiAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gRXJyb3JPYmplY3QoKSB7XG4gIHRoaXMuZXJyb3IgPSBudWxsO1xufVxuXG52YXIgVFJZX0NBVENIX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgcmV0dXJuIFRSWV9DQVRDSF9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2NlZWRlZCA9IHVuZGVmaW5lZCxcbiAgICAgIGZhaWxlZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICB2YWx1ZSA9IHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgdmFsdWUuZXJyb3IgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgcmVqZWN0KHByb21pc2UsIGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gRlVMRklMTEVEKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBFbnVtZXJhdG9yJDEoQ29uc3RydWN0b3IsIGlucHV0KSB7XG4gIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmICghdGhpcy5wcm9taXNlW1BST01JU0VfSURdKSB7XG4gICAgbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICB0aGlzLl9lbnVtZXJhdGUoaW5wdXQpO1xuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59XG5cbkVudW1lcmF0b3IkMS5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvciQxLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24gKGVudHJ5LCBpKSB7XG4gIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgdmFyIHJlc29sdmUkJDEgPSBjLnJlc29sdmU7XG5cbiAgaWYgKHJlc29sdmUkJDEgPT09IHJlc29sdmUkMSkge1xuICAgIHZhciBfdGhlbiA9IGdldFRoZW4oZW50cnkpO1xuXG4gICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XG4gICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlJDIpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobm9vcCk7XG4gICAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCBfdGhlbik7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbiAocmVzb2x2ZSQkMSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSQkMShlbnRyeSk7XG4gICAgICB9KSwgaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQxKGVudHJ5KSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IkMS5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uIChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yJDEucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbiAocHJvbWlzZSwgaSkge1xuICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoUkVKRUNURUQsIGksIHJlYXNvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gIGBQcm9taXNlLmFsbGAgYWNjZXB0cyBhbiBhcnJheSBvZiBwcm9taXNlcywgYW5kIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaFxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMgZm9yIHRoZSBwYXNzZWQgcHJvbWlzZXMsIG9yXG4gIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gYmUgcmVqZWN0ZWQuIEl0IGNhc3RzIGFsbFxuICBlbGVtZW50cyBvZiB0aGUgcGFzc2VkIGl0ZXJhYmxlIHRvIHByb21pc2VzIGFzIGl0IHJ1bnMgdGhpcyBhbGdvcml0aG0uXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlc29sdmUoMik7XG4gIGxldCBwcm9taXNlMyA9IHJlc29sdmUoMyk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgbGV0IHByb21pc2UzID0gcmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gZW50cmllcyBhcnJheSBvZiBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuICBAc3RhdGljXG4qL1xuZnVuY3Rpb24gYWxsJDEoZW50cmllcykge1xuICByZXR1cm4gbmV3IEVudW1lcmF0b3IkMSh0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZSQxKGVudHJpZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkoZW50cmllcykpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChfLCByZWplY3QpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkIGByZWFzb25gLlxuICBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlbiBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QkMShyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5mdW5jdGlvbiBQcm9taXNlJDIocmVzb2x2ZXIpIHtcbiAgdGhpc1tQUk9NSVNFX0lEXSA9IG5leHRJZCgpO1xuICB0aGlzLl9yZXN1bHQgPSB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpZiAobm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbmVlZHNSZXNvbHZlcigpO1xuICAgIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlJDIgPyBpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBuZWVkc05ldygpO1xuICB9XG59XG5cblByb21pc2UkMi5hbGwgPSBhbGwkMTtcblByb21pc2UkMi5yYWNlID0gcmFjZSQxO1xuUHJvbWlzZSQyLnJlc29sdmUgPSByZXNvbHZlJDE7XG5Qcm9taXNlJDIucmVqZWN0ID0gcmVqZWN0JDE7XG5Qcm9taXNlJDIuX3NldFNjaGVkdWxlciA9IHNldFNjaGVkdWxlcjtcblByb21pc2UkMi5fc2V0QXNhcCA9IHNldEFzYXA7XG5Qcm9taXNlJDIuX2FzYXAgPSBhc2FwO1xuXG5Qcm9taXNlJDIucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSQyLFxuXG4gIC8qKlxuICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIENoYWluaW5nXG4gICAgLS0tLS0tLS1cbiAgXG4gICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgfSk7XG4gIFxuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgIH0pO1xuICAgIGBgYFxuICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBc3NpbWlsYXRpb25cbiAgICAtLS0tLS0tLS0tLS1cbiAgXG4gICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgU2ltcGxlIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgcmVzdWx0O1xuICBcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgYXV0aG9yLCBib29rcztcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICBcbiAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgXG4gICAgfVxuICBcbiAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRBdXRob3IoKS5cbiAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgdGhlblxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICB0aGVuOiB0aGVuLFxuXG4gIC8qKlxuICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBcbiAgICBgYGBqc1xuICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgIH1cbiAgXG4gICAgLy8gc3luY2hyb25vdXNcbiAgICB0cnkge1xuICAgICAgZmluZEF1dGhvcigpO1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH1cbiAgXG4gICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCBjYXRjaFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gICdjYXRjaCc6IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9XG59O1xuXG4vKmdsb2JhbCBzZWxmKi9cbmZ1bmN0aW9uIHBvbHlmaWxsJDEoKSB7XG4gICAgdmFyIGxvY2FsID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gICAgaWYgKFApIHtcbiAgICAgICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBzaWxlbnRseSBpZ25vcmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2UkMjtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZSQyLnBvbHlmaWxsID0gcG9seWZpbGwkMTtcblByb21pc2UkMi5Qcm9taXNlID0gUHJvbWlzZSQyO1xuXG5yZXR1cm4gUHJvbWlzZSQyO1xuXG59KSkpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczYtcHJvbWlzZS5tYXBcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBCaW5kaW5nLCBDb25maWd1cmF0aW9uRXJyb3IsIEZ1bmN0aW9uUmVzb2x2ZXIsIEluc3RhbmNlUmVzb2x2ZXIsIFJlc29sdXRpb25FcnJvciwgU2luZ2xldG9uTGlmZWN5Y2xlLCBUcmFuc2llbnRMaWZlY3ljbGUsIFR5cGVSZXNvbHZlciwgXywgYXNzZXJ0LCBjaGFpbiwgc3dlZXRlbixcbiAgICBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgRnVuY3Rpb25SZXNvbHZlciA9IHJlcXVpcmUoJy4vcmVzb2x2ZXJzL0Z1bmN0aW9uUmVzb2x2ZXInKTtcblxuICBJbnN0YW5jZVJlc29sdmVyID0gcmVxdWlyZSgnLi9yZXNvbHZlcnMvSW5zdGFuY2VSZXNvbHZlcicpO1xuXG4gIFR5cGVSZXNvbHZlciA9IHJlcXVpcmUoJy4vcmVzb2x2ZXJzL1R5cGVSZXNvbHZlcicpO1xuXG4gIFNpbmdsZXRvbkxpZmVjeWNsZSA9IHJlcXVpcmUoJy4vbGlmZWN5Y2xlcy9TaW5nbGV0b25MaWZlY3ljbGUnKTtcblxuICBUcmFuc2llbnRMaWZlY3ljbGUgPSByZXF1aXJlKCcuL2xpZmVjeWNsZXMvVHJhbnNpZW50TGlmZWN5Y2xlJyk7XG5cbiAgQ29uZmlndXJhdGlvbkVycm9yID0gcmVxdWlyZSgnLi9lcnJvcnMvQ29uZmlndXJhdGlvbkVycm9yJyk7XG5cbiAgUmVzb2x1dGlvbkVycm9yID0gcmVxdWlyZSgnLi9lcnJvcnMvUmVzb2x1dGlvbkVycm9yJyk7XG5cbiAgc3dlZXRlbiA9IGZ1bmN0aW9uKHR5cGUsIHByb3BlcnR5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNoYWluID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCByZXN1bHQ7XG4gICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfTtcblxuICBCaW5kaW5nID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJpbmRpbmcoZm9yZ2UsIG5hbWUpIHtcbiAgICAgIHRoaXMuZm9yZ2UgPSBmb3JnZTtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICBhc3NlcnQodGhpcy5mb3JnZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiZm9yZ2VcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgYXNzZXJ0KHRoaXMubmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICB0aGlzLmxpZmVjeWNsZSA9IG5ldyBTaW5nbGV0b25MaWZlY3ljbGUoKTtcbiAgICAgIHRoaXNbXCJhcmd1bWVudHNcIl0gPSB7fTtcbiAgICB9XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oaGludCkge1xuICAgICAgaWYgKHRoaXMucHJlZGljYXRlICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlKGhpbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihjb250ZXh0LCBoaW50LCBhcmdzKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKGFyZ3MgPT0gbnVsbCkge1xuICAgICAgICBhcmdzID0ge307XG4gICAgICB9XG4gICAgICBhc3NlcnQoY29udGV4dCwgJ1RoZSBhcmd1bWVudCBcImNvbnRleHRcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgaWYgKHRoaXMubGlmZWN5Y2xlID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IENvbmZpZ3VyYXRpb25FcnJvcih0aGlzLm5hbWUsICdObyBsaWZlY3ljbGUgZGVmaW5lZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVzb2x2ZXIgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgQ29uZmlndXJhdGlvbkVycm9yKHRoaXMubmFtZSwgJ05vIHJlc29sdmVyIGRlZmluZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250ZXh0Lmhhcyh0aGlzKSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzb2x1dGlvbkVycm9yKHRoaXMubmFtZSwgaGludCwgY29udGV4dCwgJ0NpcmN1bGFyIGRlcGVuZGVuY2llcyBkZXRlY3RlZCcpO1xuICAgICAgfVxuICAgICAgY29udGV4dC5wdXNoKHRoaXMpO1xuICAgICAgcmVzdWx0ID0gdGhpcy5saWZlY3ljbGUucmVzb2x2ZSh0aGlzLnJlc29sdmVyLCBjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQucG9wKCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBzd2VldGVuKEJpbmRpbmcsICd0bycpO1xuXG4gICAgc3dlZXRlbihCaW5kaW5nLCAnYXMnKTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnR5cGUgPSBjaGFpbihmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGFzc2VydCh0YXJnZXQgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInRhcmdldFwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlciA9IG5ldyBUeXBlUmVzb2x2ZXIodGhpcy5mb3JnZSwgdGhpcywgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlW1wiZnVuY3Rpb25cIl0gPSBjaGFpbihmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIGFzc2VydCh0YXJnZXQgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInRhcmdldFwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlciA9IG5ldyBGdW5jdGlvblJlc29sdmVyKHRoaXMuZm9yZ2UsIHRoaXMsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5pbnN0YW5jZSA9IGNoYWluKGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgYXNzZXJ0KHRhcmdldCAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwidGFyZ2V0XCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVyID0gbmV3IEluc3RhbmNlUmVzb2x2ZXIodGhpcy5mb3JnZSwgdGhpcywgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnNpbmdsZXRvbiA9IGNoYWluKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGlmZWN5Y2xlID0gbmV3IFNpbmdsZXRvbkxpZmVjeWNsZSgpO1xuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudHJhbnNpZW50ID0gY2hhaW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGUgPSBuZXcgVHJhbnNpZW50TGlmZWN5Y2xlKCk7XG4gICAgfSk7XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS53aGVuID0gY2hhaW4oZnVuY3Rpb24oY29uZGl0aW9uKSB7XG4gICAgICBhc3NlcnQoY29uZGl0aW9uICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJjb25kaXRpb25cIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihjb25kaXRpb24pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZSA9IGNvbmRpdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZSA9IGZ1bmN0aW9uKGhpbnQpIHtcbiAgICAgICAgICByZXR1cm4gaGludCA9PT0gY29uZGl0aW9uO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGVbXCJ3aXRoXCJdID0gY2hhaW4oZnVuY3Rpb24oYXJncykge1xuICAgICAgcmV0dXJuIHRoaXNbXCJhcmd1bWVudHNcIl0gPSBhcmdzO1xuICAgIH0pO1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZXBzLCByZWYsIHRva2VucztcbiAgICAgIHRva2VucyA9IFtdO1xuICAgICAgaWYgKHRoaXMucHJlZGljYXRlICE9IG51bGwpIHtcbiAgICAgICAgdG9rZW5zLnB1c2goJyhjb25kaXRpb25hbCknKTtcbiAgICAgIH1cbiAgICAgIHRva2Vucy5wdXNoKHRoaXMubmFtZSk7XG4gICAgICB0b2tlbnMucHVzaCgnLT4nKTtcbiAgICAgIHRva2Vucy5wdXNoKHRoaXMucmVzb2x2ZXIgIT0gbnVsbCA/IHRoaXMucmVzb2x2ZXIudG9TdHJpbmcoKSA6ICc8dW5kZWZpbmVkIHJlc29sdmVyPicpO1xuICAgICAgdG9rZW5zLnB1c2goXCIoXCIgKyAodGhpcy5saWZlY3ljbGUudG9TdHJpbmcoKSkgKyBcIilcIik7XG4gICAgICBpZiAoKChyZWYgPSB0aGlzLnJlc29sdmVyLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgICBkZXBzID0gXy5tYXAodGhpcy5yZXNvbHZlci5kZXBlbmRlbmNpZXMsIGZ1bmN0aW9uKGRlcCkge1xuICAgICAgICAgIGlmIChkZXAuaGludCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVwLm5hbWUgKyBcIjpcIiArIGRlcC5oaW50O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGVwLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdG9rZW5zLnB1c2goXCJkZXBlbmRzIG9uOiBbXCIgKyAoZGVwcy5qb2luKCcsICcpKSArIFwiXVwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbnMuam9pbignICcpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQmluZGluZztcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gQmluZGluZztcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBDb250ZXh0LCBfO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgQ29udGV4dCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBDb250ZXh0KCkge1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgIH1cblxuICAgIENvbnRleHQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGJpbmRpbmcpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKHRoaXMuYmluZGluZ3MsIGJpbmRpbmcpO1xuICAgIH07XG5cbiAgICBDb250ZXh0LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oYmluZGluZykge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3MucHVzaChiaW5kaW5nKTtcbiAgICB9O1xuXG4gICAgQ29udGV4dC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncy5wb3AoKTtcbiAgICB9O1xuXG4gICAgQ29udGV4dC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihpbmRlbnQpIHtcbiAgICAgIHZhciBsaW5lcywgc3BhY2VzO1xuICAgICAgaWYgKGluZGVudCA9PSBudWxsKSB7XG4gICAgICAgIGluZGVudCA9IDQ7XG4gICAgICB9XG4gICAgICBzcGFjZXMgPSBBcnJheShpbmRlbnQgKyAxKS5qb2luKCcgJyk7XG4gICAgICBsaW5lcyA9IF8ubWFwKHRoaXMuYmluZGluZ3MsIGZ1bmN0aW9uKGJpbmRpbmcsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBcIlwiICsgc3BhY2VzICsgKGluZGV4ICsgMSkgKyBcIjogXCIgKyAoYmluZGluZy50b1N0cmluZygpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpbmVzLnJldmVyc2UoKS5qb2luKCdcXG4nKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENvbnRleHQ7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IENvbnRleHQ7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgSW5zcGVjdG9yLCBfLCBhc3NlcnQ7XG5cbiAgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbiAgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuICBJbnNwZWN0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gSW5zcGVjdG9yKHVubWFuZ2xlTmFtZXMpIHtcbiAgICAgIHRoaXMudW5tYW5nbGVOYW1lcyA9IHVubWFuZ2xlTmFtZXMgIT0gbnVsbCA/IHVubWFuZ2xlTmFtZXMgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBJbnNwZWN0b3IucHJvdG90eXBlLmdldERlcGVuZGVuY2llcyA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHZhciBoaW50cywgcGFyYW1zO1xuICAgICAgYXNzZXJ0KGZ1bmMgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImZ1bmNcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcGFyYW1zID0gdGhpcy5nZXRQYXJhbWV0ZXJOYW1lcyhmdW5jKTtcbiAgICAgIGhpbnRzID0gdGhpcy5nZXREZXBlbmRlbmN5SGludHMoZnVuYyk7XG4gICAgICByZXR1cm4gXy5tYXAocGFyYW1zLCBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgICB2YXIgcmVmO1xuICAgICAgICByZXR1cm4gKHJlZiA9IGhpbnRzW3BhcmFtXSkgIT0gbnVsbCA/IHJlZiA6IHtcbiAgICAgICAgICBuYW1lOiBwYXJhbSxcbiAgICAgICAgICBhbGw6IGZhbHNlLFxuICAgICAgICAgIGhpbnQ6IHZvaWQgMFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEluc3BlY3Rvci5wcm90b3R5cGUuZ2V0UGFyYW1ldGVyTmFtZXMgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICB2YXIgYXJncywgbWF0Y2hlcywgcmVnZXg7XG4gICAgICBhc3NlcnQoZnVuYyAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiZnVuY1wiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICByZWdleCA9IC8oPzpmdW5jdGlvbnxjb25zdHJ1Y3RvcilbIEEtWmEtejAtOV0qXFwoKFteKV0rKS9nO1xuICAgICAgbWF0Y2hlcyA9IHJlZ2V4LmV4ZWMoZnVuYy50b1N0cmluZygpKTtcbiAgICAgIGlmICgobWF0Y2hlcyA9PSBudWxsKSB8fCBtYXRjaGVzWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBhcmdzID0gbWF0Y2hlc1sxXS5zcGxpdCgvWyxcXHNdKy8pO1xuICAgICAgaWYgKHRoaXMudW5tYW5nbGVOYW1lcykge1xuICAgICAgICByZXR1cm4gXy5tYXAoYXJncywgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgcmV0dXJuIGFyZy5yZXBsYWNlKC9cXGQrJC8sICcnKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXJncztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgSW5zcGVjdG9yLnByb3RvdHlwZS5nZXREZXBlbmRlbmN5SGludHMgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgICB2YXIgYWxsLCBhcmd1bWVudCwgZGVwZW5kZW5jeSwgaGludCwgaGludHMsIG1hdGNoLCBuYW1lLCBwYXR0ZXJuLCByZWYsIHJlZ2V4O1xuICAgICAgYXNzZXJ0KGZ1bmMgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImZ1bmNcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcmVnZXggPSAvXCIoLio/KVxccyotPlxccyooYWxsKT9cXHMqKC4qPylcIjsvZ2k7XG4gICAgICBoaW50cyA9IHt9O1xuICAgICAgd2hpbGUgKG1hdGNoID0gcmVnZXguZXhlYyhmdW5jLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgIHBhdHRlcm4gPSBtYXRjaFswXSwgYXJndW1lbnQgPSBtYXRjaFsxXSwgYWxsID0gbWF0Y2hbMl0sIGRlcGVuZGVuY3kgPSBtYXRjaFszXTtcbiAgICAgICAgaWYgKGFsbCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVwZW5kZW5jeS5pbmRleE9mKCc6JykpIHtcbiAgICAgICAgICByZWYgPSBkZXBlbmRlbmN5LnNwbGl0KC9cXHMqOlxccyovLCAyKSwgbmFtZSA9IHJlZlswXSwgaGludCA9IHJlZlsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuYW1lID0gZGVwZW5kZW5jeTtcbiAgICAgICAgICBoaW50ID0gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIGhpbnRzW2FyZ3VtZW50XSA9IHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGFsbDogYWxsLFxuICAgICAgICAgIGhpbnQ6IGhpbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoaW50cztcbiAgICB9O1xuXG4gICAgSW5zcGVjdG9yLnByb3RvdHlwZS5pc0F1dG9Db25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGNvbnN0cnVjdG9yKSB7XG4gICAgICB2YXIgYm9keSwgbmFtZTtcbiAgICAgIGFzc2VydChjb25zdHJ1Y3RvciAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiY29uc3RydWN0b3JcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgbmFtZSA9IGNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICBib2R5ID0gY29uc3RydWN0b3IudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBib2R5LmluZGV4T2YobmFtZSArIFwiLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1wiKSA+IDA7XG4gICAgfTtcblxuICAgIHJldHVybiBJbnNwZWN0b3I7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IEluc3BlY3RvcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBDb25maWd1cmF0aW9uRXJyb3IsXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBDb25maWd1cmF0aW9uRXJyb3IgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgIGV4dGVuZChDb25maWd1cmF0aW9uRXJyb3IsIHN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gQ29uZmlndXJhdGlvbkVycm9yKG5hbWUsIG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubWVzc2FnZSA9IFwiVGhlIGJpbmRpbmcgZm9yIGNvbXBvbmVudCBuYW1lZCBcIiArIG5hbWUgKyBcIiBpcyBtaXNjb25maWd1cmVkOiBcIiArIG1lc3NhZ2U7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBhcmd1bWVudHMuY2FsbGVlKTtcbiAgICB9XG5cbiAgICBDb25maWd1cmF0aW9uRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tZXNzYWdlO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29uZmlndXJhdGlvbkVycm9yO1xuXG4gIH0pKEVycm9yKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IENvbmZpZ3VyYXRpb25FcnJvcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBSZXNvbHV0aW9uRXJyb3IsIHV0aWw7XG5cbiAgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuICBSZXNvbHV0aW9uRXJyb3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gUmVzb2x1dGlvbkVycm9yKG5hbWUsIGhpbnQsIGNvbnRleHQsIG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubmFtZSA9ICdSZXNvbHV0aW9uRXJyb3InO1xuICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5nZXRNZXNzYWdlKG5hbWUsIGhpbnQsIGNvbnRleHQsIG1lc3NhZ2UpO1xuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgYXJndW1lbnRzLmNhbGxlZSk7XG4gICAgfVxuXG4gICAgUmVzb2x1dGlvbkVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgUmVzb2x1dGlvbkVycm9yLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24obmFtZSwgaGludCwgY29udGV4dCwgbWVzc2FnZSkge1xuICAgICAgdmFyIGxpbmVzO1xuICAgICAgbGluZXMgPSBbXTtcbiAgICAgIGxpbmVzLnB1c2goXCJDb3VsZCBub3QgcmVzb2x2ZSBjb21wb25lbnQgbmFtZWQgXCIgKyBuYW1lICsgXCI6IFwiICsgbWVzc2FnZSk7XG4gICAgICBpZiAoaGludCAhPSBudWxsKSB7XG4gICAgICAgIGxpbmVzLnB1c2goJyAgV2l0aCByZXNvbHV0aW9uIGhpbnQ6Jyk7XG4gICAgICAgIGxpbmVzLnB1c2goXCIgICAgXCIgKyAodXRpbC5pbnNwZWN0KGhpbnQpKSk7XG4gICAgICB9XG4gICAgICBsaW5lcy5wdXNoKCcgIEluIHJlc29sdXRpb24gY29udGV4dDonKTtcbiAgICAgIGxpbmVzLnB1c2goY29udGV4dC50b1N0cmluZygpKTtcbiAgICAgIGxpbmVzLnB1c2goJyAgLS0tJyk7XG4gICAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gICAgfTtcblxuICAgIHJldHVybiBSZXNvbHV0aW9uRXJyb3I7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFJlc29sdXRpb25FcnJvcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBCaW5kaW5nLCBDb250ZXh0LCBGb3JnZSwgSW5zcGVjdG9yLCBSZXNvbHV0aW9uRXJyb3IsIF8sIGFzc2VydDtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIEJpbmRpbmcgPSByZXF1aXJlKCcuL0JpbmRpbmcnKTtcblxuICBDb250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0Jyk7XG5cbiAgSW5zcGVjdG9yID0gcmVxdWlyZSgnLi9JbnNwZWN0b3InKTtcblxuICBSZXNvbHV0aW9uRXJyb3IgPSByZXF1aXJlKCcuL2Vycm9ycy9SZXNvbHV0aW9uRXJyb3InKTtcblxuICBGb3JnZSA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBGb3JnZShjb25maWcpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcbiAgICAgICAgY29uZmlnID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICB0aGlzLnVubWFuZ2xlTmFtZXMgPSAocmVmID0gY29uZmlnLnVubWFuZ2xlTmFtZXMpICE9IG51bGwgPyByZWYgOiB0cnVlO1xuICAgICAgdGhpcy5pbnNwZWN0b3IgPSAocmVmMSA9IGNvbmZpZy5pbnNwZWN0b3IpICE9IG51bGwgPyByZWYxIDogbmV3IEluc3BlY3Rvcih0aGlzLnVubWFuZ2xlTmFtZXMpO1xuICAgIH1cblxuICAgIEZvcmdlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGJhc2UsIGJpbmRpbmc7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBhc3NlcnQodGhpcy52YWxpZGF0ZU5hbWUobmFtZSksIFwiSW52YWxpZCBiaW5kaW5nIG5hbWUgXFxcIlwiICsgbmFtZSArIFwiXFxcIlwiKTtcbiAgICAgIGJpbmRpbmcgPSBuZXcgQmluZGluZyh0aGlzLCBuYW1lKTtcbiAgICAgICgoYmFzZSA9IHRoaXMuYmluZGluZ3MpW25hbWVdICE9IG51bGwgPyBiYXNlW25hbWVdIDogYmFzZVtuYW1lXSA9IFtdKS5wdXNoKGJpbmRpbmcpO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY291bnQ7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBjb3VudCA9IHRoaXMuYmluZGluZ3NbbmFtZV0gIT0gbnVsbCA/IHRoaXMuYmluZGluZ3NbbmFtZV0ubGVuZ3RoIDogMDtcbiAgICAgIHRoaXMuYmluZGluZ3NbbmFtZV0gPSBbXTtcbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLnJlYmluZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHRoaXMudW5iaW5kKG5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuYmluZChuYW1lKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUsIGhpbnQsIGFyZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmUobmFtZSwgbmV3IENvbnRleHQoKSwgaGludCwgZmFsc2UsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBGb3JnZS5wcm90b3R5cGUuZ2V0T25lID0gZnVuY3Rpb24obmFtZSwgaGludCwgYXJncykge1xuICAgICAgdmFyIGJpbmRpbmdzLCBjb250ZXh0O1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICBiaW5kaW5ncyA9IHRoaXMuZ2V0TWF0Y2hpbmdCaW5kaW5ncyhuYW1lLCBoaW50KTtcbiAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc29sdXRpb25FcnJvcihuYW1lLCBoaW50LCBjb250ZXh0LCAnTm8gbWF0Y2hpbmcgYmluZGluZ3Mgd2VyZSBhdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc29sdXRpb25FcnJvcihuYW1lLCBoaW50LCBjb250ZXh0LCAnTXVsdGlwbGUgbWF0Y2hpbmcgYmluZGluZ3Mgd2VyZSBhdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVCaW5kaW5ncyhjb250ZXh0LCBiaW5kaW5ncywgaGludCwgYXJncywgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihuYW1lLCBhcmdzKSB7XG4gICAgICB2YXIgYmluZGluZ3MsIGNvbnRleHQ7XG4gICAgICBhc3NlcnQobmFtZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwibmFtZVwiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgICBjb250ZXh0ID0gbmV3IENvbnRleHQoKTtcbiAgICAgIGJpbmRpbmdzID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcbiAgICAgIGlmICghKChiaW5kaW5ncyAhPSBudWxsID8gYmluZGluZ3MubGVuZ3RoIDogdm9pZCAwKSA+IDApKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXNvbHV0aW9uRXJyb3IobmFtZSwgdm9pZCAwLCBjb250ZXh0LCAnTm8gbWF0Y2hpbmcgYmluZGluZ3Mgd2VyZSBhdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVCaW5kaW5ncyhjb250ZXh0LCBiaW5kaW5ncywgdm9pZCAwLCBhcmdzLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbih0eXBlLCBhcmdzKSB7XG4gICAgICB2YXIgYmluZGluZywgY29udGV4dDtcbiAgICAgIGFzc2VydCh0eXBlICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJ0eXBlXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGNvbnRleHQgPSBuZXcgQ29udGV4dCgpO1xuICAgICAgYmluZGluZyA9IG5ldyBCaW5kaW5nKHRoaXMsIHR5cGUuY29uc3RydWN0b3IubmFtZSkudHlwZSh0eXBlKTtcbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVCaW5kaW5ncyhjb250ZXh0LCBbYmluZGluZ10sIHZvaWQgMCwgYXJncywgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5nZXRNYXRjaGluZ0JpbmRpbmdzID0gZnVuY3Rpb24obmFtZSwgaGludCkge1xuICAgICAgYXNzZXJ0KG5hbWUgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcIm5hbWVcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgaWYgKHRoaXMuYmluZGluZ3NbbmFtZV0gPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5iaW5kaW5nc1tuYW1lXSwgZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5tYXRjaGVzKGhpbnQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24obmFtZSwgY29udGV4dCwgaGludCwgYWxsLCBhcmdzKSB7XG4gICAgICB2YXIgYmluZGluZ3MsIHVud3JhcDtcbiAgICAgIGFzc2VydChuYW1lICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJuYW1lXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICAgICAgY29udGV4dCA9IG5ldyBDb250ZXh0KCk7XG4gICAgICB9XG4gICAgICBpZiAoYWxsKSB7XG4gICAgICAgIGJpbmRpbmdzID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcbiAgICAgICAgdW53cmFwID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiaW5kaW5ncyA9IHRoaXMuZ2V0TWF0Y2hpbmdCaW5kaW5ncyhuYW1lLCBoaW50KTtcbiAgICAgICAgdW53cmFwID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICgoYmluZGluZ3MgIT0gbnVsbCA/IGJpbmRpbmdzLmxlbmd0aCA6IHZvaWQgMCkgPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc29sdXRpb25FcnJvcihuYW1lLCBoaW50LCBjb250ZXh0LCAnTm8gbWF0Y2hpbmcgYmluZGluZ3Mgd2VyZSBhdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmVCaW5kaW5ncyhjb250ZXh0LCBiaW5kaW5ncywgaGludCwgYXJncywgdW53cmFwKTtcbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLnJlc29sdmVCaW5kaW5ncyA9IGZ1bmN0aW9uKGNvbnRleHQsIGJpbmRpbmdzLCBoaW50LCBhcmdzLCB1bndyYXApIHtcbiAgICAgIHZhciByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IF8ubWFwKGJpbmRpbmdzLCBmdW5jdGlvbihiaW5kaW5nKSB7XG4gICAgICAgIHJldHVybiBiaW5kaW5nLnJlc29sdmUoY29udGV4dCwgaGludCwgYXJncyk7XG4gICAgICB9KTtcbiAgICAgIGlmICh1bndyYXAgJiYgcmVzdWx0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRm9yZ2UucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5ncztcbiAgICAgIGJpbmRpbmdzID0gXy5mbGF0dGVuKF8udmFsdWVzKHRoaXMuYmluZGluZ3MpKTtcbiAgICAgIHJldHVybiBfLmludm9rZShiaW5kaW5ncywgJ3RvU3RyaW5nJykuam9pbignXFxuJyk7XG4gICAgfTtcblxuICAgIEZvcmdlLnByb3RvdHlwZS52YWxpZGF0ZU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBpZiAodGhpcy51bm1hbmdsZU5hbWVzKSB7XG4gICAgICAgIHJldHVybiAvW15cXGRdJC8udGVzdChuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gRm9yZ2U7XG5cbiAgfSkoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IEZvcmdlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIExpZmVjeWNsZTtcblxuICBMaWZlY3ljbGUgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gTGlmZWN5Y2xlKCkge31cblxuICAgIExpZmVjeWNsZS5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHJlc29sdmVyLCBjb250ZXh0LCBhcmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBpbXBsZW1lbnQgcmVzb2x2ZSgpIG9uIFwiICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIExpZmVjeWNsZTtcblxuICB9KSgpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gTGlmZWN5Y2xlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIExpZmVjeWNsZSwgU2luZ2xldG9uTGlmZWN5Y2xlLCBhc3NlcnQsXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBMaWZlY3ljbGUgPSByZXF1aXJlKCcuL0xpZmVjeWNsZScpO1xuXG4gIFNpbmdsZXRvbkxpZmVjeWNsZSA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gICAgZXh0ZW5kKFNpbmdsZXRvbkxpZmVjeWNsZSwgc3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBTaW5nbGV0b25MaWZlY3ljbGUoKSB7XG4gICAgICByZXR1cm4gU2luZ2xldG9uTGlmZWN5Y2xlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIFNpbmdsZXRvbkxpZmVjeWNsZS5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHJlc29sdmVyLCBjb250ZXh0LCBhcmdzKSB7XG4gICAgICBhc3NlcnQocmVzb2x2ZXIgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcInJlc29sdmVyXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGFzc2VydChjb250ZXh0ICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJjb250ZXh0XCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGlmICh0aGlzLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHJlc29sdmVyLnJlc29sdmUoY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9O1xuXG4gICAgU2luZ2xldG9uTGlmZWN5Y2xlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdzaW5nbGV0b24nO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2luZ2xldG9uTGlmZWN5Y2xlO1xuXG4gIH0pKExpZmVjeWNsZSk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBTaW5nbGV0b25MaWZlY3ljbGU7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgTGlmZWN5Y2xlLCBUcmFuc2llbnRMaWZlY3ljbGUsIGFzc2VydCxcbiAgICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIExpZmVjeWNsZSA9IHJlcXVpcmUoJy4vTGlmZWN5Y2xlJyk7XG5cbiAgVHJhbnNpZW50TGlmZWN5Y2xlID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgICBleHRlbmQoVHJhbnNpZW50TGlmZWN5Y2xlLCBzdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIFRyYW5zaWVudExpZmVjeWNsZSgpIHtcbiAgICAgIHJldHVybiBUcmFuc2llbnRMaWZlY3ljbGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgVHJhbnNpZW50TGlmZWN5Y2xlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVzb2x2ZXIsIGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIGFzc2VydChyZXNvbHZlciAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwicmVzb2x2ZXJcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgYXNzZXJ0KGNvbnRleHQgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImNvbnRleHRcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgcmV0dXJuIHJlc29sdmVyLnJlc29sdmUoY29udGV4dCwgYXJncyk7XG4gICAgfTtcblxuICAgIFRyYW5zaWVudExpZmVjeWNsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAndHJhbnNpZW50JztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRyYW5zaWVudExpZmVjeWNsZTtcblxuICB9KShMaWZlY3ljbGUpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gVHJhbnNpZW50TGlmZWN5Y2xlO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEwLjBcbihmdW5jdGlvbigpIHtcbiAgdmFyIEZ1bmN0aW9uUmVzb2x2ZXIsIFJlc29sdmVyLCBfLCBhc3NlcnQsXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIFJlc29sdmVyID0gcmVxdWlyZSgnLi9SZXNvbHZlcicpO1xuXG4gIEZ1bmN0aW9uUmVzb2x2ZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICAgIGV4dGVuZChGdW5jdGlvblJlc29sdmVyLCBzdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIEZ1bmN0aW9uUmVzb2x2ZXIoZm9yZ2UsIGJpbmRpbmcsIGZ1bmMpIHtcbiAgICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gICAgICBGdW5jdGlvblJlc29sdmVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIGZvcmdlLCBiaW5kaW5nKTtcbiAgICAgIGFzc2VydCh0aGlzLmZ1bmMgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImZ1bmNcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSB0aGlzLmZvcmdlLmluc3BlY3Rvci5nZXREZXBlbmRlbmNpZXModGhpcy5mdW5jKTtcbiAgICB9XG5cbiAgICBGdW5jdGlvblJlc29sdmVyLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xuICAgICAgYXJncyA9IHRoaXMucmVzb2x2ZURlcGVuZGVuY2llcyhjb250ZXh0LCB0aGlzLmRlcGVuZGVuY2llcywgYXJncyk7XG4gICAgICByZXR1cm4gdGhpcy5mdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBGdW5jdGlvblJlc29sdmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdmdW5jdGlvbic7XG4gICAgfTtcblxuICAgIHJldHVybiBGdW5jdGlvblJlc29sdmVyO1xuXG4gIH0pKFJlc29sdmVyKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uUmVzb2x2ZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTAuMFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgSW5zdGFuY2VSZXNvbHZlciwgUmVzb2x2ZXIsIF8sIGFzc2VydCxcbiAgICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgUmVzb2x2ZXIgPSByZXF1aXJlKCcuL1Jlc29sdmVyJyk7XG5cbiAgSW5zdGFuY2VSZXNvbHZlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gICAgZXh0ZW5kKEluc3RhbmNlUmVzb2x2ZXIsIHN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gSW5zdGFuY2VSZXNvbHZlcihmb3JnZSwgYmluZGluZywgaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgIEluc3RhbmNlUmVzb2x2ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZm9yZ2UsIGJpbmRpbmcpO1xuICAgICAgYXNzZXJ0KHRoaXMuaW5zdGFuY2UgIT0gbnVsbCwgJ1RoZSBhcmd1bWVudCBcImluc3RhbmNlXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgfVxuXG4gICAgSW5zdGFuY2VSZXNvbHZlci5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKGNvbnRleHQsIGFyZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH07XG5cbiAgICBJbnN0YW5jZVJlc29sdmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmICh0aGlzLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICc8dW5rbm93biBpbnN0YW5jZT4nO1xuICAgICAgfSBlbHNlIGlmICgoKHJlZiA9IHRoaXMuaW5zdGFuY2UuY29uc3RydWN0b3IpICE9IG51bGwgPyByZWYubmFtZSA6IHZvaWQgMCkgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJhbiBpbnN0YW5jZSBvZiBcIiArIHRoaXMuaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcImFuIGluc3RhbmNlIG9mIFwiICsgKHR5cGVvZiB0aGlzLmluc3RhbmNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEluc3RhbmNlUmVzb2x2ZXI7XG5cbiAgfSkoUmVzb2x2ZXIpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gSW5zdGFuY2VSZXNvbHZlcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBSZXNvbHZlciwgXywgYXNzZXJ0O1xuXG4gIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG4gIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbiAgUmVzb2x2ZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gUmVzb2x2ZXIoZm9yZ2UsIGJpbmRpbmcpIHtcbiAgICAgIHRoaXMuZm9yZ2UgPSBmb3JnZTtcbiAgICAgIHRoaXMuYmluZGluZyA9IGJpbmRpbmc7XG4gICAgICBhc3NlcnQodGhpcy5mb3JnZSAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiZm9yZ2VcIiBtdXN0IGhhdmUgYSB2YWx1ZScpO1xuICAgICAgYXNzZXJ0KHRoaXMuYmluZGluZyAhPSBudWxsLCAnVGhlIGFyZ3VtZW50IFwiYmluZGluZ1wiIG11c3QgaGF2ZSBhIHZhbHVlJyk7XG4gICAgfVxuXG4gICAgUmVzb2x2ZXIucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBpbXBsZW1lbnQgcmVzb2x2ZSgpIG9uIFwiICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICB9O1xuXG4gICAgUmVzb2x2ZXIucHJvdG90eXBlLnJlc29sdmVEZXBlbmRlbmNpZXMgPSBmdW5jdGlvbihjb250ZXh0LCBkZXBlbmRlbmNpZXMsIGFyZ3MpIHtcbiAgICAgIHJldHVybiBfLm1hcChkZXBlbmRlbmNpZXMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGVwKSB7XG4gICAgICAgICAgdmFyIG92ZXJyaWRlLCByZWY7XG4gICAgICAgICAgaWYgKGRlcC5uYW1lID09PSAnZm9yZ2UnKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZm9yZ2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIG92ZXJyaWRlID0gKHJlZiA9IGFyZ3NbZGVwLm5hbWVdKSAhPSBudWxsID8gcmVmIDogX3RoaXMuYmluZGluZ1tcImFyZ3VtZW50c1wiXVtkZXAubmFtZV07XG4gICAgICAgICAgcmV0dXJuIG92ZXJyaWRlICE9IG51bGwgPyBvdmVycmlkZSA6IF90aGlzLmZvcmdlLnJlc29sdmUoZGVwLm5hbWUsIGNvbnRleHQsIGRlcC5oaW50LCBkZXAuYWxsKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlc29sdmVyO1xuXG4gIH0pKCk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBSZXNvbHZlcjtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMC4wXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBSZXNvbHZlciwgVHlwZVJlc29sdmVyLCBfLCBhc3NlcnQsXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuICBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4gIFJlc29sdmVyID0gcmVxdWlyZSgnLi9SZXNvbHZlcicpO1xuXG4gIFR5cGVSZXNvbHZlciA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gICAgZXh0ZW5kKFR5cGVSZXNvbHZlciwgc3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBUeXBlUmVzb2x2ZXIoZm9yZ2UsIGJpbmRpbmcsIHR5cGUxKSB7XG4gICAgICB2YXIgY29uc3RydWN0b3I7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlMTtcbiAgICAgIFR5cGVSZXNvbHZlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBmb3JnZSwgYmluZGluZyk7XG4gICAgICBhc3NlcnQodGhpcy50eXBlICE9IG51bGwsICdUaGUgYXJndW1lbnQgXCJ0eXBlXCIgbXVzdCBoYXZlIGEgdmFsdWUnKTtcbiAgICAgIGNvbnN0cnVjdG9yID0gdGhpcy5maW5kQ29uc3RydWN0b3JUb0luc3BlY3QodGhpcy50eXBlKTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gdGhpcy5mb3JnZS5pbnNwZWN0b3IuZ2V0RGVwZW5kZW5jaWVzKGNvbnN0cnVjdG9yKTtcbiAgICB9XG5cbiAgICBUeXBlUmVzb2x2ZXIucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgICB2YXIgY3RvcjtcbiAgICAgIGFyZ3MgPSB0aGlzLnJlc29sdmVEZXBlbmRlbmNpZXMoY29udGV4dCwgdGhpcy5kZXBlbmRlbmNpZXMsIGFyZ3MpO1xuICAgICAgY3RvciA9IHRoaXMudHlwZS5iaW5kLmFwcGx5KHRoaXMudHlwZSwgW251bGxdLmNvbmNhdChhcmdzKSk7XG4gICAgICByZXR1cm4gbmV3IGN0b3IoKTtcbiAgICB9O1xuXG4gICAgVHlwZVJlc29sdmVyLnByb3RvdHlwZS5maW5kQ29uc3RydWN0b3JUb0luc3BlY3QgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICB2YXIgY29uc3RydWN0b3I7XG4gICAgICBjb25zdHJ1Y3RvciA9IHR5cGU7XG4gICAgICB3aGlsZSAodGhpcy5mb3JnZS5pbnNwZWN0b3IuaXNBdXRvQ29uc3RydWN0b3IoY29uc3RydWN0b3IpKSB7XG4gICAgICAgIGNvbnN0cnVjdG9yID0gY29uc3RydWN0b3IuX19zdXBlcl9fLmNvbnN0cnVjdG9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICAgIH07XG5cbiAgICBUeXBlUmVzb2x2ZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXCJ0eXBle1wiICsgdGhpcy50eXBlLm5hbWUgKyBcIn1cIjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFR5cGVSZXNvbHZlcjtcblxuICB9KShSZXNvbHZlcik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBUeXBlUmVzb2x2ZXI7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvKiFcclxuICogS25vY2tvdXQgSmF2YVNjcmlwdCBsaWJyYXJ5IHYzLjQuMlxyXG4gKiAoYykgVGhlIEtub2Nrb3V0LmpzIHRlYW0gLSBodHRwOi8va25vY2tvdXRqcy5jb20vXHJcbiAqIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCkgeyhmdW5jdGlvbihuKXt2YXIgeD10aGlzfHwoMCxldmFsKShcInRoaXNcIiksdD14LmRvY3VtZW50LE09eC5uYXZpZ2F0b3IsdT14LmpRdWVyeSxIPXguSlNPTjsoZnVuY3Rpb24obil7XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiLFwicmVxdWlyZVwiXSxuKTpcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP24obW9kdWxlLmV4cG9ydHN8fGV4cG9ydHMpOm4oeC5rbz17fSl9KShmdW5jdGlvbihOLE8pe2Z1bmN0aW9uIEooYSxjKXtyZXR1cm4gbnVsbD09PWF8fHR5cGVvZiBhIGluIFI/YT09PWM6ITF9ZnVuY3Rpb24gUyhiLGMpe3ZhciBkO3JldHVybiBmdW5jdGlvbigpe2R8fChkPWEuYS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZD1uO2IoKX0sYykpfX1mdW5jdGlvbiBUKGIsYyl7dmFyIGQ7cmV0dXJuIGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGQpO2Q9YS5hLnNldFRpbWVvdXQoYixjKX19ZnVuY3Rpb24gVShhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMpe2MmJmMhPT1FP1wiYmVmb3JlQ2hhbmdlXCI9PT1jP3RoaXMuT2IoYSk6dGhpcy5KYShhLGMpOnRoaXMuUGIoYSl9ZnVuY3Rpb24gVihhLGMpe251bGwhPT1jJiZjLmsmJmMuaygpfWZ1bmN0aW9uIFcoYSxjKXt2YXIgZD10aGlzLk1jLGU9ZFtzXTtlLlR8fCh0aGlzLm9iJiZ0aGlzLk9hW2NdPyhkLlNiKGMsYSx0aGlzLk9hW2NdKSx0aGlzLk9hW2NdPW51bGwsLS10aGlzLm9iKTplLnNbY118fGQuU2IoYyxhLGUudD97JDphfTpkLnljKGEpKSxhLkhhJiZhLkhjKCkpfWZ1bmN0aW9uIEsoYixjLGQsZSl7YS5kW2JdPXtpbml0OmZ1bmN0aW9uKGIsZyxoLGwsbSl7dmFyIGsscjthLm0oZnVuY3Rpb24oKXt2YXIgcT1nKCkscD1hLmEuYyhxKSxwPSFkIT09IXAsQT0hcjtpZihBfHxjfHxwIT09aylBJiZhLnhhLkNhKCkmJihyPWEuYS53YShhLmYuY2hpbGROb2RlcyhiKSwhMCkpLHA/KEF8fGEuZi5mYShiLGEuYS53YShyKSksYS5oYihlP2UobSxxKTptLGIpKTphLmYuemEoYiksaz1wfSxudWxsLFxyXG4gICAge2k6Yn0pO3JldHVybntjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczohMH19fTthLmgudmFbYl09ITE7YS5mLmFhW2JdPSEwfXZhciBhPVwidW5kZWZpbmVkXCIhPT10eXBlb2YgTj9OOnt9O2EuYj1mdW5jdGlvbihiLGMpe2Zvcih2YXIgZD1iLnNwbGl0KFwiLlwiKSxlPWEsZj0wO2Y8ZC5sZW5ndGgtMTtmKyspZT1lW2RbZl1dO2VbZFtkLmxlbmd0aC0xXV09Y307YS5IPWZ1bmN0aW9uKGEsYyxkKXthW2NdPWR9O2EudmVyc2lvbj1cIjMuNC4yXCI7YS5iKFwidmVyc2lvblwiLGEudmVyc2lvbik7YS5vcHRpb25zPXtkZWZlclVwZGF0ZXM6ITEsdXNlT25seU5hdGl2ZUV2ZW50czohMX07YS5hPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhLGIpe2Zvcih2YXIgYyBpbiBhKWEuaGFzT3duUHJvcGVydHkoYykmJmIoYyxhW2NdKX1mdW5jdGlvbiBjKGEsYil7aWYoYilmb3IodmFyIGMgaW4gYiliLmhhc093blByb3BlcnR5KGMpJiYoYVtjXT1iW2NdKTtyZXR1cm4gYX1mdW5jdGlvbiBkKGEsYil7YS5fX3Byb3RvX189XHJcbiAgICBiO3JldHVybiBhfWZ1bmN0aW9uIGUoYixjLGQsZSl7dmFyIG09YltjXS5tYXRjaChyKXx8W107YS5hLnIoZC5tYXRjaChyKSxmdW5jdGlvbihiKXthLmEucmEobSxiLGUpfSk7YltjXT1tLmpvaW4oXCIgXCIpfXZhciBmPXtfX3Byb3RvX186W119aW5zdGFuY2VvZiBBcnJheSxnPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBTeW1ib2wsaD17fSxsPXt9O2hbTSYmL0ZpcmVmb3hcXC8yL2kudGVzdChNLnVzZXJBZ2VudCk/XCJLZXlib2FyZEV2ZW50XCI6XCJVSUV2ZW50c1wiXT1bXCJrZXl1cFwiLFwia2V5ZG93blwiLFwia2V5cHJlc3NcIl07aC5Nb3VzZUV2ZW50cz1cImNsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlXCIuc3BsaXQoXCIgXCIpO2IoaCxmdW5jdGlvbihhLGIpe2lmKGIubGVuZ3RoKWZvcih2YXIgYz0wLGQ9Yi5sZW5ndGg7YzxkO2MrKylsW2JbY11dPWF9KTt2YXIgbT17cHJvcGVydHljaGFuZ2U6ITB9LGs9XHJcbiAgICB0JiZmdW5jdGlvbigpe2Zvcih2YXIgYT0zLGI9dC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGM9Yi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlcIik7Yi5pbm5lckhUTUw9XCJcXHgzYyEtLVtpZiBndCBJRSBcIisgKythK1wiXT48aT48L2k+PCFbZW5kaWZdLS1cXHgzZVwiLGNbMF07KTtyZXR1cm4gNDxhP2E6bn0oKSxyPS9cXFMrL2c7cmV0dXJue2djOltcImF1dGhlbnRpY2l0eV90b2tlblwiLC9eX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW4oXy4qKT8kL10scjpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGg7YzxkO2MrKyliKGFbY10sYyl9LG86ZnVuY3Rpb24oYSxiKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZilyZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChhLGIpO2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGg7YzxkO2MrKylpZihhW2NdPT09YilyZXR1cm4gYztyZXR1cm4tMX0sVmI6ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxlPWEubGVuZ3RoO2Q8ZTtkKyspaWYoYi5jYWxsKGMsYVtkXSxkKSlyZXR1cm4gYVtkXTtyZXR1cm4gbnVsbH0sTmE6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEubyhiLGMpOzA8ZD9iLnNwbGljZShkLDEpOjA9PT1kJiZiLnNoaWZ0KCl9LFdiOmZ1bmN0aW9uKGIpe2I9Ynx8W107Zm9yKHZhciBjPVtdLGQ9MCxlPWIubGVuZ3RoO2Q8ZTtkKyspMD5hLmEubyhjLGJbZF0pJiZjLnB1c2goYltkXSk7cmV0dXJuIGN9LGliOmZ1bmN0aW9uKGEsYil7YT1hfHxbXTtmb3IodmFyIGM9W10sZD0wLGU9YS5sZW5ndGg7ZDxlO2QrKyljLnB1c2goYihhW2RdLGQpKTtyZXR1cm4gY30sTWE6ZnVuY3Rpb24oYSxiKXthPWF8fFtdO2Zvcih2YXIgYz1bXSxkPTAsZT1hLmxlbmd0aDtkPGU7ZCsrKWIoYVtkXSxkKSYmYy5wdXNoKGFbZF0pO3JldHVybiBjfSx0YTpmdW5jdGlvbihhLGIpe2lmKGIgaW5zdGFuY2VvZiBBcnJheSlhLnB1c2guYXBwbHkoYSxiKTtlbHNlIGZvcih2YXIgYz0wLGQ9Yi5sZW5ndGg7YzxcclxuZDtjKyspYS5wdXNoKGJbY10pO3JldHVybiBhfSxyYTpmdW5jdGlvbihiLGMsZCl7dmFyIGU9YS5hLm8oYS5hLkJiKGIpLGMpOzA+ZT9kJiZiLnB1c2goYyk6ZHx8Yi5zcGxpY2UoZSwxKX0sbGE6ZixleHRlbmQ6YywkYTpkLGFiOmY/ZDpjLEQ6YixFYTpmdW5jdGlvbihhLGIpe2lmKCFhKXJldHVybiBhO3ZhciBjPXt9LGQ7Zm9yKGQgaW4gYSlhLmhhc093blByb3BlcnR5KGQpJiYoY1tkXT1iKGFbZF0sZCxhKSk7cmV0dXJuIGN9LHJiOmZ1bmN0aW9uKGIpe2Zvcig7Yi5maXJzdENoaWxkOylhLnJlbW92ZU5vZGUoYi5maXJzdENoaWxkKX0sbmM6ZnVuY3Rpb24oYil7Yj1hLmEuVyhiKTtmb3IodmFyIGM9KGJbMF0mJmJbMF0ub3duZXJEb2N1bWVudHx8dCkuY3JlYXRlRWxlbWVudChcImRpdlwiKSxkPTAsZT1iLmxlbmd0aDtkPGU7ZCsrKWMuYXBwZW5kQ2hpbGQoYS5iYShiW2RdKSk7cmV0dXJuIGN9LHdhOmZ1bmN0aW9uKGIsYyl7Zm9yKHZhciBkPTAsZT1iLmxlbmd0aCxtPVtdO2Q8ZTtkKyspe3ZhciBrPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYltkXS5jbG9uZU5vZGUoITApO20ucHVzaChjP2EuYmEoayk6ayl9cmV0dXJuIG19LGZhOmZ1bmN0aW9uKGIsYyl7YS5hLnJiKGIpO2lmKGMpZm9yKHZhciBkPTAsZT1jLmxlbmd0aDtkPGU7ZCsrKWIuYXBwZW5kQ2hpbGQoY1tkXSl9LHVjOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9Yi5ub2RlVHlwZT9bYl06YjtpZigwPGQubGVuZ3RoKXtmb3IodmFyIGU9ZFswXSxtPWUucGFyZW50Tm9kZSxrPTAsZj1jLmxlbmd0aDtrPGY7aysrKW0uaW5zZXJ0QmVmb3JlKGNba10sZSk7az0wO2ZvcihmPWQubGVuZ3RoO2s8ZjtrKyspYS5yZW1vdmVOb2RlKGRba10pfX0sQmE6ZnVuY3Rpb24oYSxiKXtpZihhLmxlbmd0aCl7Zm9yKGI9OD09PWIubm9kZVR5cGUmJmIucGFyZW50Tm9kZXx8YjthLmxlbmd0aCYmYVswXS5wYXJlbnROb2RlIT09YjspYS5zcGxpY2UoMCwxKTtmb3IoOzE8YS5sZW5ndGgmJmFbYS5sZW5ndGgtMV0ucGFyZW50Tm9kZSE9PWI7KWEubGVuZ3RoLS07aWYoMTxhLmxlbmd0aCl7dmFyIGM9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbMF0sZD1hW2EubGVuZ3RoLTFdO2ZvcihhLmxlbmd0aD0wO2MhPT1kOylhLnB1c2goYyksYz1jLm5leHRTaWJsaW5nO2EucHVzaChkKX19cmV0dXJuIGF9LHdjOmZ1bmN0aW9uKGEsYil7Nz5rP2Euc2V0QXR0cmlidXRlKFwic2VsZWN0ZWRcIixiKTphLnNlbGVjdGVkPWJ9LGNiOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT09YXx8YT09PW4/XCJcIjphLnRyaW0/YS50cmltKCk6YS50b1N0cmluZygpLnJlcGxhY2UoL15bXFxzXFx4YTBdK3xbXFxzXFx4YTBdKyQvZyxcIlwiKX0sc2Q6ZnVuY3Rpb24oYSxiKXthPWF8fFwiXCI7cmV0dXJuIGIubGVuZ3RoPmEubGVuZ3RoPyExOmEuc3Vic3RyaW5nKDAsYi5sZW5ndGgpPT09Yn0sUmM6ZnVuY3Rpb24oYSxiKXtpZihhPT09YilyZXR1cm4hMDtpZigxMT09PWEubm9kZVR5cGUpcmV0dXJuITE7aWYoYi5jb250YWlucylyZXR1cm4gYi5jb250YWlucygzPT09YS5ub2RlVHlwZT9hLnBhcmVudE5vZGU6YSk7aWYoYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbilyZXR1cm4gMTY9PVxyXG4gICAgKGIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYSkmMTYpO2Zvcig7YSYmYSE9YjspYT1hLnBhcmVudE5vZGU7cmV0dXJuISFhfSxxYjpmdW5jdGlvbihiKXtyZXR1cm4gYS5hLlJjKGIsYi5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCl9LFRiOmZ1bmN0aW9uKGIpe3JldHVybiEhYS5hLlZiKGIsYS5hLnFiKX0sQTpmdW5jdGlvbihhKXtyZXR1cm4gYSYmYS50YWdOYW1lJiZhLnRhZ05hbWUudG9Mb3dlckNhc2UoKX0sWmI6ZnVuY3Rpb24oYil7cmV0dXJuIGEub25FcnJvcj9mdW5jdGlvbigpe3RyeXtyZXR1cm4gYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9Y2F0Y2goYyl7dGhyb3cgYS5vbkVycm9yJiZhLm9uRXJyb3IoYyksYzt9fTpifSxzZXRUaW1lb3V0OmZ1bmN0aW9uKGIsYyl7cmV0dXJuIHNldFRpbWVvdXQoYS5hLlpiKGIpLGMpfSxkYzpmdW5jdGlvbihiKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5vbkVycm9yJiZhLm9uRXJyb3IoYik7dGhyb3cgYjt9LDApfSxxOmZ1bmN0aW9uKGIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyxkKXt2YXIgZT1hLmEuWmIoZCk7ZD1rJiZtW2NdO2lmKGEub3B0aW9ucy51c2VPbmx5TmF0aXZlRXZlbnRzfHxkfHwhdSlpZihkfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBiLmFkZEV2ZW50TGlzdGVuZXIpaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGIuYXR0YWNoRXZlbnQpe3ZhciBmPWZ1bmN0aW9uKGEpe2UuY2FsbChiLGEpfSxsPVwib25cIitjO2IuYXR0YWNoRXZlbnQobCxmKTthLmEuRy5xYShiLGZ1bmN0aW9uKCl7Yi5kZXRhY2hFdmVudChsLGYpfSl9ZWxzZSB0aHJvdyBFcnJvcihcIkJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGFkZEV2ZW50TGlzdGVuZXIgb3IgYXR0YWNoRXZlbnRcIik7ZWxzZSBiLmFkZEV2ZW50TGlzdGVuZXIoYyxlLCExKTtlbHNlIHUoYikuYmluZChjLGUpfSxGYTpmdW5jdGlvbihiLGMpe2lmKCFifHwhYi5ub2RlVHlwZSl0aHJvdyBFcnJvcihcImVsZW1lbnQgbXVzdCBiZSBhIERPTSBub2RlIHdoZW4gY2FsbGluZyB0cmlnZ2VyRXZlbnRcIik7dmFyIGQ7XCJpbnB1dFwiPT09XHJcbmEuYS5BKGIpJiZiLnR5cGUmJlwiY2xpY2tcIj09Yy50b0xvd2VyQ2FzZSgpPyhkPWIudHlwZSxkPVwiY2hlY2tib3hcIj09ZHx8XCJyYWRpb1wiPT1kKTpkPSExO2lmKGEub3B0aW9ucy51c2VPbmx5TmF0aXZlRXZlbnRzfHwhdXx8ZClpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LmNyZWF0ZUV2ZW50KWlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGIuZGlzcGF0Y2hFdmVudClkPXQuY3JlYXRlRXZlbnQobFtjXXx8XCJIVE1MRXZlbnRzXCIpLGQuaW5pdEV2ZW50KGMsITAsITAseCwwLDAsMCwwLDAsITEsITEsITEsITEsMCxiKSxiLmRpc3BhdGNoRXZlbnQoZCk7ZWxzZSB0aHJvdyBFcnJvcihcIlRoZSBzdXBwbGllZCBlbGVtZW50IGRvZXNuJ3Qgc3VwcG9ydCBkaXNwYXRjaEV2ZW50XCIpO2Vsc2UgaWYoZCYmYi5jbGljayliLmNsaWNrKCk7ZWxzZSBpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgYi5maXJlRXZlbnQpYi5maXJlRXZlbnQoXCJvblwiK2MpO2Vsc2UgdGhyb3cgRXJyb3IoXCJCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0cmlnZ2VyaW5nIGV2ZW50c1wiKTtcclxuZWxzZSB1KGIpLnRyaWdnZXIoYyl9LGM6ZnVuY3Rpb24oYil7cmV0dXJuIGEuSShiKT9iKCk6Yn0sQmI6ZnVuY3Rpb24oYil7cmV0dXJuIGEuSShiKT9iLnAoKTpifSxmYjpmdW5jdGlvbihiLGMsZCl7dmFyIGs7YyYmKFwib2JqZWN0XCI9PT10eXBlb2YgYi5jbGFzc0xpc3Q/KGs9Yi5jbGFzc0xpc3RbZD9cImFkZFwiOlwicmVtb3ZlXCJdLGEuYS5yKGMubWF0Y2gociksZnVuY3Rpb24oYSl7ay5jYWxsKGIuY2xhc3NMaXN0LGEpfSkpOlwic3RyaW5nXCI9PT10eXBlb2YgYi5jbGFzc05hbWUuYmFzZVZhbD9lKGIuY2xhc3NOYW1lLFwiYmFzZVZhbFwiLGMsZCk6ZShiLFwiY2xhc3NOYW1lXCIsYyxkKSl9LGJiOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYyk7aWYobnVsbD09PWR8fGQ9PT1uKWQ9XCJcIjt2YXIgZT1hLmYuZmlyc3RDaGlsZChiKTshZXx8MyE9ZS5ub2RlVHlwZXx8YS5mLm5leHRTaWJsaW5nKGUpP2EuZi5mYShiLFtiLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZCldKTplLmRhdGE9XHJcbiAgICBkO2EuYS5XYyhiKX0sdmM6ZnVuY3Rpb24oYSxiKXthLm5hbWU9YjtpZig3Pj1rKXRyeXthLm1lcmdlQXR0cmlidXRlcyh0LmNyZWF0ZUVsZW1lbnQoXCI8aW5wdXQgbmFtZT0nXCIrYS5uYW1lK1wiJy8+XCIpLCExKX1jYXRjaChjKXt9fSxXYzpmdW5jdGlvbihhKXs5PD1rJiYoYT0xPT1hLm5vZGVUeXBlP2E6YS5wYXJlbnROb2RlLGEuc3R5bGUmJihhLnN0eWxlLnpvb209YS5zdHlsZS56b29tKSl9LFNjOmZ1bmN0aW9uKGEpe2lmKGspe3ZhciBiPWEuc3R5bGUud2lkdGg7YS5zdHlsZS53aWR0aD0wO2Euc3R5bGUud2lkdGg9Yn19LG5kOmZ1bmN0aW9uKGIsYyl7Yj1hLmEuYyhiKTtjPWEuYS5jKGMpO2Zvcih2YXIgZD1bXSxlPWI7ZTw9YztlKyspZC5wdXNoKGUpO3JldHVybiBkfSxXOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1bXSxjPTAsZD1hLmxlbmd0aDtjPGQ7YysrKWIucHVzaChhW2NdKTtyZXR1cm4gYn0sYmM6ZnVuY3Rpb24oYSl7cmV0dXJuIGc/U3ltYm9sKGEpOmF9LHhkOjY9PT1rLFxyXG4gICAgeWQ6Nz09PWssQzprLGljOmZ1bmN0aW9uKGIsYyl7Zm9yKHZhciBkPWEuYS5XKGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSkuY29uY2F0KGEuYS5XKGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZXh0YXJlYVwiKSkpLGU9XCJzdHJpbmdcIj09dHlwZW9mIGM/ZnVuY3Rpb24oYSl7cmV0dXJuIGEubmFtZT09PWN9OmZ1bmN0aW9uKGEpe3JldHVybiBjLnRlc3QoYS5uYW1lKX0saz1bXSxtPWQubGVuZ3RoLTE7MDw9bTttLS0pZShkW21dKSYmay5wdXNoKGRbbV0pO3JldHVybiBrfSxrZDpmdW5jdGlvbihiKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYiYmKGI9YS5hLmNiKGIpKT9IJiZILnBhcnNlP0gucGFyc2UoYik6KG5ldyBGdW5jdGlvbihcInJldHVybiBcIitiKSkoKTpudWxsfSxHYjpmdW5jdGlvbihiLGMsZCl7aWYoIUh8fCFILnN0cmluZ2lmeSl0aHJvdyBFcnJvcihcIkNhbm5vdCBmaW5kIEpTT04uc3RyaW5naWZ5KCkuIFNvbWUgYnJvd3NlcnMgKGUuZy4sIElFIDwgOCkgZG9uJ3Qgc3VwcG9ydCBpdCBuYXRpdmVseSwgYnV0IHlvdSBjYW4gb3ZlcmNvbWUgdGhpcyBieSBhZGRpbmcgYSBzY3JpcHQgcmVmZXJlbmNlIHRvIGpzb24yLmpzLCBkb3dubG9hZGFibGUgZnJvbSBodHRwOi8vd3d3Lmpzb24ub3JnL2pzb24yLmpzXCIpO1xyXG4gICAgICAgIHJldHVybiBILnN0cmluZ2lmeShhLmEuYyhiKSxjLGQpfSxsZDpmdW5jdGlvbihjLGQsZSl7ZT1lfHx7fTt2YXIgaz1lLnBhcmFtc3x8e30sbT1lLmluY2x1ZGVGaWVsZHN8fHRoaXMuZ2MsZj1jO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBjJiZcImZvcm1cIj09PWEuYS5BKGMpKWZvcih2YXIgZj1jLmFjdGlvbixsPW0ubGVuZ3RoLTE7MDw9bDtsLS0pZm9yKHZhciBnPWEuYS5pYyhjLG1bbF0pLGg9Zy5sZW5ndGgtMTswPD1oO2gtLSlrW2dbaF0ubmFtZV09Z1toXS52YWx1ZTtkPWEuYS5jKGQpO3ZhciByPXQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7ci5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO3IuYWN0aW9uPWY7ci5tZXRob2Q9XCJwb3N0XCI7Zm9yKHZhciBuIGluIGQpYz10LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxjLnR5cGU9XCJoaWRkZW5cIixjLm5hbWU9bixjLnZhbHVlPWEuYS5HYihhLmEuYyhkW25dKSksci5hcHBlbmRDaGlsZChjKTtiKGssZnVuY3Rpb24oYSxiKXt2YXIgYz10LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBjLnR5cGU9XCJoaWRkZW5cIjtjLm5hbWU9YTtjLnZhbHVlPWI7ci5hcHBlbmRDaGlsZChjKX0pO3QuYm9keS5hcHBlbmRDaGlsZChyKTtlLnN1Ym1pdHRlcj9lLnN1Ym1pdHRlcihyKTpyLnN1Ym1pdCgpO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocil9LDApfX19KCk7YS5iKFwidXRpbHNcIixhLmEpO2EuYihcInV0aWxzLmFycmF5Rm9yRWFjaFwiLGEuYS5yKTthLmIoXCJ1dGlscy5hcnJheUZpcnN0XCIsYS5hLlZiKTthLmIoXCJ1dGlscy5hcnJheUZpbHRlclwiLGEuYS5NYSk7YS5iKFwidXRpbHMuYXJyYXlHZXREaXN0aW5jdFZhbHVlc1wiLGEuYS5XYik7YS5iKFwidXRpbHMuYXJyYXlJbmRleE9mXCIsYS5hLm8pO2EuYihcInV0aWxzLmFycmF5TWFwXCIsYS5hLmliKTthLmIoXCJ1dGlscy5hcnJheVB1c2hBbGxcIixhLmEudGEpO2EuYihcInV0aWxzLmFycmF5UmVtb3ZlSXRlbVwiLGEuYS5OYSk7YS5iKFwidXRpbHMuZXh0ZW5kXCIsYS5hLmV4dGVuZCk7YS5iKFwidXRpbHMuZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3RcIixcclxuICAgIGEuYS5nYyk7YS5iKFwidXRpbHMuZ2V0Rm9ybUZpZWxkc1wiLGEuYS5pYyk7YS5iKFwidXRpbHMucGVla09ic2VydmFibGVcIixhLmEuQmIpO2EuYihcInV0aWxzLnBvc3RKc29uXCIsYS5hLmxkKTthLmIoXCJ1dGlscy5wYXJzZUpzb25cIixhLmEua2QpO2EuYihcInV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyXCIsYS5hLnEpO2EuYihcInV0aWxzLnN0cmluZ2lmeUpzb25cIixhLmEuR2IpO2EuYihcInV0aWxzLnJhbmdlXCIsYS5hLm5kKTthLmIoXCJ1dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3NcIixhLmEuZmIpO2EuYihcInV0aWxzLnRyaWdnZXJFdmVudFwiLGEuYS5GYSk7YS5iKFwidXRpbHMudW53cmFwT2JzZXJ2YWJsZVwiLGEuYS5jKTthLmIoXCJ1dGlscy5vYmplY3RGb3JFYWNoXCIsYS5hLkQpO2EuYihcInV0aWxzLmFkZE9yUmVtb3ZlSXRlbVwiLGEuYS5yYSk7YS5iKFwidXRpbHMuc2V0VGV4dENvbnRlbnRcIixhLmEuYmIpO2EuYihcInVud3JhcFwiLGEuYS5jKTtGdW5jdGlvbi5wcm90b3R5cGUuYmluZHx8KEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kPVxyXG4gICAgZnVuY3Rpb24oYSl7dmFyIGM9dGhpcztpZigxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYy5hcHBseShhLGFyZ3VtZW50cyl9O3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgZT1kLnNsaWNlKDApO2UucHVzaC5hcHBseShlLGFyZ3VtZW50cyk7cmV0dXJuIGMuYXBwbHkoYSxlKX19KTthLmEuZT1uZXcgZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGIsZyl7dmFyIGg9YltkXTtpZighaHx8XCJudWxsXCI9PT1ofHwhZVtoXSl7aWYoIWcpcmV0dXJuIG47aD1iW2RdPVwia29cIitjKys7ZVtoXT17fX1yZXR1cm4gZVtoXX12YXIgYz0wLGQ9XCJfX2tvX19cIisobmV3IERhdGUpLmdldFRpbWUoKSxlPXt9O3JldHVybntnZXQ6ZnVuY3Rpb24oYyxkKXt2YXIgZT1hKGMsITEpO3JldHVybiBlPT09bj9uOmVbZF19LHNldDpmdW5jdGlvbihjLGQsZSl7aWYoZSE9PW58fGEoYywhMSkhPT1uKWEoYywhMClbZF09XHJcbiAgICBlfSxjbGVhcjpmdW5jdGlvbihhKXt2YXIgYj1hW2RdO3JldHVybiBiPyhkZWxldGUgZVtiXSxhW2RdPW51bGwsITApOiExfSxKOmZ1bmN0aW9uKCl7cmV0dXJuIGMrKyArZH19fTthLmIoXCJ1dGlscy5kb21EYXRhXCIsYS5hLmUpO2EuYihcInV0aWxzLmRvbURhdGEuY2xlYXJcIixhLmEuZS5jbGVhcik7YS5hLkc9bmV3IGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGMpe3ZhciBlPWEuYS5lLmdldChiLGQpO2U9PT1uJiZjJiYoZT1bXSxhLmEuZS5zZXQoYixkLGUpKTtyZXR1cm4gZX1mdW5jdGlvbiBjKGQpe3ZhciBlPWIoZCwhMSk7aWYoZSlmb3IodmFyIGU9ZS5zbGljZSgwKSxsPTA7bDxlLmxlbmd0aDtsKyspZVtsXShkKTthLmEuZS5jbGVhcihkKTthLmEuRy5jbGVhbkV4dGVybmFsRGF0YShkKTtpZihmW2Qubm9kZVR5cGVdKWZvcihlPWQuZmlyc3RDaGlsZDtkPWU7KWU9ZC5uZXh0U2libGluZyw4PT09ZC5ub2RlVHlwZSYmYyhkKX12YXIgZD1hLmEuZS5KKCksZT17MTohMCw4OiEwLDk6ITB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZj17MTohMCw5OiEwfTtyZXR1cm57cWE6ZnVuY3Rpb24oYSxjKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBjKXRocm93IEVycm9yKFwiQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO2IoYSwhMCkucHVzaChjKX0sdGM6ZnVuY3Rpb24oYyxlKXt2YXIgZj1iKGMsITEpO2YmJihhLmEuTmEoZixlKSwwPT1mLmxlbmd0aCYmYS5hLmUuc2V0KGMsZCxuKSl9LGJhOmZ1bmN0aW9uKGIpe2lmKGVbYi5ub2RlVHlwZV0mJihjKGIpLGZbYi5ub2RlVHlwZV0pKXt2YXIgZD1bXTthLmEudGEoZCxiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSk7Zm9yKHZhciBsPTAsbT1kLmxlbmd0aDtsPG07bCsrKWMoZFtsXSl9cmV0dXJuIGJ9LHJlbW92ZU5vZGU6ZnVuY3Rpb24oYil7YS5iYShiKTtiLnBhcmVudE5vZGUmJmIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiKX0sY2xlYW5FeHRlcm5hbERhdGE6ZnVuY3Rpb24oYSl7dSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdS5jbGVhbkRhdGEmJnUuY2xlYW5EYXRhKFthXSl9fX07XHJcbiAgICBhLmJhPWEuYS5HLmJhO2EucmVtb3ZlTm9kZT1hLmEuRy5yZW1vdmVOb2RlO2EuYihcImNsZWFuTm9kZVwiLGEuYmEpO2EuYihcInJlbW92ZU5vZGVcIixhLnJlbW92ZU5vZGUpO2EuYihcInV0aWxzLmRvbU5vZGVEaXNwb3NhbFwiLGEuYS5HKTthLmIoXCJ1dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrXCIsYS5hLkcucWEpO2EuYihcInV0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVEaXNwb3NlQ2FsbGJhY2tcIixhLmEuRy50Yyk7KGZ1bmN0aW9uKCl7dmFyIGI9WzAsXCJcIixcIlwiXSxjPVsxLFwiPHRhYmxlPlwiLFwiPC90YWJsZT5cIl0sZD1bMyxcIjx0YWJsZT48dGJvZHk+PHRyPlwiLFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCJdLGU9WzEsXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsXCI8L3NlbGVjdD5cIl0sZj17dGhlYWQ6Yyx0Ym9keTpjLHRmb290OmMsdHI6WzIsXCI8dGFibGU+PHRib2R5PlwiLFwiPC90Ym9keT48L3RhYmxlPlwiXSx0ZDpkLHRoOmQsb3B0aW9uOmUsb3B0Z3JvdXA6ZX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZz04Pj1hLmEuQzthLmEubmE9ZnVuY3Rpb24oYyxkKXt2YXIgZTtpZih1KWlmKHUucGFyc2VIVE1MKWU9dS5wYXJzZUhUTUwoYyxkKXx8W107ZWxzZXtpZigoZT11LmNsZWFuKFtjXSxkKSkmJmVbMF0pe2Zvcih2YXIgaz1lWzBdO2sucGFyZW50Tm9kZSYmMTEhPT1rLnBhcmVudE5vZGUubm9kZVR5cGU7KWs9ay5wYXJlbnROb2RlO2sucGFyZW50Tm9kZSYmay5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGspfX1lbHNleyhlPWQpfHwoZT10KTt2YXIgaz1lLnBhcmVudFdpbmRvd3x8ZS5kZWZhdWx0Vmlld3x8eCxyPWEuYS5jYihjKS50b0xvd2VyQ2FzZSgpLHE9ZS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHA7cD0ocj1yLm1hdGNoKC9ePChbYS16XSspWyA+XS8pKSYmZltyWzFdXXx8YjtyPXBbMF07cD1cImlnbm9yZWQ8ZGl2PlwiK3BbMV0rYytwWzJdK1wiPC9kaXY+XCI7XCJmdW5jdGlvblwiPT10eXBlb2Ygay5pbm5lclNoaXY/cS5hcHBlbmRDaGlsZChrLmlubmVyU2hpdihwKSk6KGcmJmUuYXBwZW5kQ2hpbGQocSksXHJcbiAgICAgICAgcS5pbm5lckhUTUw9cCxnJiZxLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocSkpO2Zvcig7ci0tOylxPXEubGFzdENoaWxkO2U9YS5hLlcocS5sYXN0Q2hpbGQuY2hpbGROb2Rlcyl9cmV0dXJuIGV9O2EuYS5FYj1mdW5jdGlvbihiLGMpe2EuYS5yYihiKTtjPWEuYS5jKGMpO2lmKG51bGwhPT1jJiZjIT09bilpZihcInN0cmluZ1wiIT10eXBlb2YgYyYmKGM9Yy50b1N0cmluZygpKSx1KXUoYikuaHRtbChjKTtlbHNlIGZvcih2YXIgZD1hLmEubmEoYyxiLm93bmVyRG9jdW1lbnQpLGU9MDtlPGQubGVuZ3RoO2UrKyliLmFwcGVuZENoaWxkKGRbZV0pfX0pKCk7YS5iKFwidXRpbHMucGFyc2VIdG1sRnJhZ21lbnRcIixhLmEubmEpO2EuYihcInV0aWxzLnNldEh0bWxcIixhLmEuRWIpO2EuTj1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYyxlKXtpZihjKWlmKDg9PWMubm9kZVR5cGUpe3ZhciBmPWEuTi5wYyhjLm5vZGVWYWx1ZSk7bnVsbCE9ZiYmZS5wdXNoKHtRYzpjLGhkOmZ9KX1lbHNlIGlmKDE9PWMubm9kZVR5cGUpZm9yKHZhciBmPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsZz1jLmNoaWxkTm9kZXMsaD1nLmxlbmd0aDtmPGg7ZisrKWIoZ1tmXSxlKX12YXIgYz17fTtyZXR1cm57eWI6ZnVuY3Rpb24oYSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgYSl0aHJvdyBFcnJvcihcIllvdSBjYW4gb25seSBwYXNzIGEgZnVuY3Rpb24gdG8ga28ubWVtb2l6YXRpb24ubWVtb2l6ZSgpXCIpO3ZhciBiPSg0Mjk0OTY3Mjk2KigxK01hdGgucmFuZG9tKCkpfDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSkrKDQyOTQ5NjcyOTYqKDErTWF0aC5yYW5kb20oKSl8MCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtjW2JdPWE7cmV0dXJuXCJcXHgzYyEtLVtrb19tZW1vOlwiK2IrXCJdLS1cXHgzZVwifSxCYzpmdW5jdGlvbihhLGIpe3ZhciBmPWNbYV07aWYoZj09PW4pdGhyb3cgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGFueSBtZW1vIHdpdGggSUQgXCIrYStcIi4gUGVyaGFwcyBpdCdzIGFscmVhZHkgYmVlbiB1bm1lbW9pemVkLlwiKTt0cnl7cmV0dXJuIGYuYXBwbHkobnVsbCxifHxbXSksXHJcbiAgICAgICAgITB9ZmluYWxseXtkZWxldGUgY1thXX19LENjOmZ1bmN0aW9uKGMsZSl7dmFyIGY9W107YihjLGYpO2Zvcih2YXIgZz0wLGg9Zi5sZW5ndGg7ZzxoO2crKyl7dmFyIGw9ZltnXS5RYyxtPVtsXTtlJiZhLmEudGEobSxlKTthLk4uQmMoZltnXS5oZCxtKTtsLm5vZGVWYWx1ZT1cIlwiO2wucGFyZW50Tm9kZSYmbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGwpfX0scGM6ZnVuY3Rpb24oYSl7cmV0dXJuKGE9YS5tYXRjaCgvXlxcW2tvX21lbW9cXDooLio/KVxcXSQvKSk/YVsxXTpudWxsfX19KCk7YS5iKFwibWVtb2l6YXRpb25cIixhLk4pO2EuYihcIm1lbW9pemF0aW9uLm1lbW9pemVcIixhLk4ueWIpO2EuYihcIm1lbW9pemF0aW9uLnVubWVtb2l6ZVwiLGEuTi5CYyk7YS5iKFwibWVtb2l6YXRpb24ucGFyc2VNZW1vVGV4dFwiLGEuTi5wYyk7YS5iKFwibWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzXCIsYS5OLkNjKTthLlo9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKCl7aWYoZSlmb3IodmFyIGI9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLGM9MCxtO2c8ZTspaWYobT1kW2crK10pe2lmKGc+Yil7aWYoNUUzPD0rK2Mpe2c9ZTthLmEuZGMoRXJyb3IoXCInVG9vIG11Y2ggcmVjdXJzaW9uJyBhZnRlciBwcm9jZXNzaW5nIFwiK2MrXCIgdGFzayBncm91cHMuXCIpKTticmVha31iPWV9dHJ5e20oKX1jYXRjaChrKXthLmEuZGMoayl9fX1mdW5jdGlvbiBjKCl7YigpO2c9ZT1kLmxlbmd0aD0wfXZhciBkPVtdLGU9MCxmPTEsZz0wO3JldHVybntzY2hlZHVsZXI6eC5NdXRhdGlvbk9ic2VydmVyP2Z1bmN0aW9uKGEpe3ZhciBiPXQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsobmV3IE11dGF0aW9uT2JzZXJ2ZXIoYSkpLm9ic2VydmUoYix7YXR0cmlidXRlczohMH0pO3JldHVybiBmdW5jdGlvbigpe2IuY2xhc3NMaXN0LnRvZ2dsZShcImZvb1wiKX19KGMpOnQmJlwib25yZWFkeXN0YXRlY2hhbmdlXCJpbiB0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik/ZnVuY3Rpb24oYSl7dmFyIGI9dC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2Iub25yZWFkeXN0YXRlY2hhbmdlPVxyXG4gICAgICAgIGZ1bmN0aW9uKCl7Yi5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbDt0LmRvY3VtZW50RWxlbWVudC5yZW1vdmVDaGlsZChiKTtiPW51bGw7YSgpfTt0LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChiKX06ZnVuY3Rpb24oYSl7c2V0VGltZW91dChhLDApfSxaYTpmdW5jdGlvbihiKXtlfHxhLlouc2NoZWR1bGVyKGMpO2RbZSsrXT1iO3JldHVybiBmKyt9LGNhbmNlbDpmdW5jdGlvbihhKXthLT1mLWU7YT49ZyYmYTxlJiYoZFthXT1udWxsKX0scmVzZXRGb3JUZXN0aW5nOmZ1bmN0aW9uKCl7dmFyIGE9ZS1nO2c9ZT1kLmxlbmd0aD0wO3JldHVybiBhfSxyZDpifX0oKTthLmIoXCJ0YXNrc1wiLGEuWik7YS5iKFwidGFza3Muc2NoZWR1bGVcIixhLlouWmEpO2EuYihcInRhc2tzLnJ1bkVhcmx5XCIsYS5aLnJkKTthLkFhPXt0aHJvdHRsZTpmdW5jdGlvbihiLGMpe2IudGhyb3R0bGVFdmFsdWF0aW9uPWM7dmFyIGQ9bnVsbDtyZXR1cm4gYS5CKHtyZWFkOmIsd3JpdGU6ZnVuY3Rpb24oZSl7Y2xlYXJUaW1lb3V0KGQpO1xyXG4gICAgICAgIGQ9YS5hLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiKGUpfSxjKX19KX0scmF0ZUxpbWl0OmZ1bmN0aW9uKGEsYyl7dmFyIGQsZSxmO1wibnVtYmVyXCI9PXR5cGVvZiBjP2Q9YzooZD1jLnRpbWVvdXQsZT1jLm1ldGhvZCk7YS5nYj0hMTtmPVwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCI9PWU/VDpTO2EuV2EoZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSxkKX0pfSxkZWZlcnJlZDpmdW5jdGlvbihiLGMpe2lmKCEwIT09Yyl0aHJvdyBFcnJvcihcIlRoZSAnZGVmZXJyZWQnIGV4dGVuZGVyIG9ubHkgYWNjZXB0cyB0aGUgdmFsdWUgJ3RydWUnLCBiZWNhdXNlIGl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gdHVybiBkZWZlcnJhbCBvZmYgb25jZSBlbmFibGVkLlwiKTtiLmdifHwoYi5nYj0hMCxiLldhKGZ1bmN0aW9uKGMpe3ZhciBlLGY9ITE7cmV0dXJuIGZ1bmN0aW9uKCl7aWYoIWYpe2EuWi5jYW5jZWwoZSk7ZT1hLlouWmEoYyk7dHJ5e2Y9ITAsYi5ub3RpZnlTdWJzY3JpYmVycyhuLFwiZGlydHlcIil9ZmluYWxseXtmPVxyXG4gICAgICAgICExfX19fSkpfSxub3RpZnk6ZnVuY3Rpb24oYSxjKXthLmVxdWFsaXR5Q29tcGFyZXI9XCJhbHdheXNcIj09Yz9udWxsOkp9fTt2YXIgUj17dW5kZWZpbmVkOjEsXCJib29sZWFuXCI6MSxudW1iZXI6MSxzdHJpbmc6MX07YS5iKFwiZXh0ZW5kZXJzXCIsYS5BYSk7YS56Yz1mdW5jdGlvbihiLGMsZCl7dGhpcy4kPWI7dGhpcy5qYj1jO3RoaXMuUGM9ZDt0aGlzLlQ9ITE7YS5IKHRoaXMsXCJkaXNwb3NlXCIsdGhpcy5rKX07YS56Yy5wcm90b3R5cGUuaz1mdW5jdGlvbigpe3RoaXMuVD0hMDt0aGlzLlBjKCl9O2EuSz1mdW5jdGlvbigpe2EuYS5hYih0aGlzLEQpO0QudWIodGhpcyl9O3ZhciBFPVwiY2hhbmdlXCIsRD17dWI6ZnVuY3Rpb24oYSl7YS5GPXtjaGFuZ2U6W119O2EuUWI9MX0sWTpmdW5jdGlvbihiLGMsZCl7dmFyIGU9dGhpcztkPWR8fEU7dmFyIGY9bmV3IGEuemMoZSxjP2IuYmluZChjKTpiLGZ1bmN0aW9uKCl7YS5hLk5hKGUuRltkXSxmKTtlLkthJiZlLkthKGQpfSk7ZS51YSYmZS51YShkKTtcclxuICAgICAgICBlLkZbZF18fChlLkZbZF09W10pO2UuRltkXS5wdXNoKGYpO3JldHVybiBmfSxub3RpZnlTdWJzY3JpYmVyczpmdW5jdGlvbihiLGMpe2M9Y3x8RTtjPT09RSYmdGhpcy5LYigpO2lmKHRoaXMuUmEoYykpe3ZhciBkPWM9PT1FJiZ0aGlzLkZjfHx0aGlzLkZbY10uc2xpY2UoMCk7dHJ5e2EubC5YYigpO2Zvcih2YXIgZT0wLGY7Zj1kW2VdOysrZSlmLlR8fGYuamIoYil9ZmluYWxseXthLmwuZW5kKCl9fX0sUGE6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5RYn0sWmM6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuUGEoKSE9PWF9LEtiOmZ1bmN0aW9uKCl7Kyt0aGlzLlFifSxXYTpmdW5jdGlvbihiKXt2YXIgYz10aGlzLGQ9YS5JKGMpLGUsZixnLGg7Yy5KYXx8KGMuSmE9Yy5ub3RpZnlTdWJzY3JpYmVycyxjLm5vdGlmeVN1YnNjcmliZXJzPVUpO3ZhciBsPWIoZnVuY3Rpb24oKXtjLkhhPSExO2QmJmg9PT1jJiYoaD1jLk1iP2MuTWIoKTpjKCkpO3ZhciBhPWZ8fGMuVWEoZyxoKTtmPWU9ITE7XHJcbiAgICAgICAgYSYmYy5KYShnPWgpfSk7Yy5QYj1mdW5jdGlvbihhKXtjLkZjPWMuRltFXS5zbGljZSgwKTtjLkhhPWU9ITA7aD1hO2woKX07Yy5PYj1mdW5jdGlvbihhKXtlfHwoZz1hLGMuSmEoYSxcImJlZm9yZUNoYW5nZVwiKSl9O2MuSGM9ZnVuY3Rpb24oKXtjLlVhKGcsYy5wKCEwKSkmJihmPSEwKX19LFJhOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLkZbYV0mJnRoaXMuRlthXS5sZW5ndGh9LFhjOmZ1bmN0aW9uKGIpe2lmKGIpcmV0dXJuIHRoaXMuRltiXSYmdGhpcy5GW2JdLmxlbmd0aHx8MDt2YXIgYz0wO2EuYS5EKHRoaXMuRixmdW5jdGlvbihhLGIpe1wiZGlydHlcIiE9PWEmJihjKz1iLmxlbmd0aCl9KTtyZXR1cm4gY30sVWE6ZnVuY3Rpb24oYSxjKXtyZXR1cm4hdGhpcy5lcXVhbGl0eUNvbXBhcmVyfHwhdGhpcy5lcXVhbGl0eUNvbXBhcmVyKGEsYyl9LGV4dGVuZDpmdW5jdGlvbihiKXt2YXIgYz10aGlzO2ImJmEuYS5EKGIsZnVuY3Rpb24oYixlKXt2YXIgZj1hLkFhW2JdO1wiZnVuY3Rpb25cIj09XHJcbiAgICB0eXBlb2YgZiYmKGM9ZihjLGUpfHxjKX0pO3JldHVybiBjfX07YS5IKEQsXCJzdWJzY3JpYmVcIixELlkpO2EuSChELFwiZXh0ZW5kXCIsRC5leHRlbmQpO2EuSChELFwiZ2V0U3Vic2NyaXB0aW9uc0NvdW50XCIsRC5YYyk7YS5hLmxhJiZhLmEuJGEoRCxGdW5jdGlvbi5wcm90b3R5cGUpO2EuSy5mbj1EO2EubGM9ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPWEmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuWSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5ub3RpZnlTdWJzY3JpYmVyc307YS5iKFwic3Vic2NyaWJhYmxlXCIsYS5LKTthLmIoXCJpc1N1YnNjcmliYWJsZVwiLGEubGMpO2EueGE9YS5sPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhKXtkLnB1c2goZSk7ZT1hfWZ1bmN0aW9uIGMoKXtlPWQucG9wKCl9dmFyIGQ9W10sZSxmPTA7cmV0dXJue1hiOmIsZW5kOmMsc2M6ZnVuY3Rpb24oYil7aWYoZSl7aWYoIWEubGMoYikpdGhyb3cgRXJyb3IoXCJPbmx5IHN1YnNjcmliYWJsZSB0aGluZ3MgY2FuIGFjdCBhcyBkZXBlbmRlbmNpZXNcIik7XHJcbiAgICAgICAgZS5qYi5jYWxsKGUuTGMsYixiLkdjfHwoYi5HYz0rK2YpKX19LHc6ZnVuY3Rpb24oYSxkLGUpe3RyeXtyZXR1cm4gYigpLGEuYXBwbHkoZCxlfHxbXSl9ZmluYWxseXtjKCl9fSxDYTpmdW5jdGlvbigpe2lmKGUpcmV0dXJuIGUubS5DYSgpfSxWYTpmdW5jdGlvbigpe2lmKGUpcmV0dXJuIGUuVmF9fX0oKTthLmIoXCJjb21wdXRlZENvbnRleHRcIixhLnhhKTthLmIoXCJjb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnRcIixhLnhhLkNhKTthLmIoXCJjb21wdXRlZENvbnRleHQuaXNJbml0aWFsXCIsYS54YS5WYSk7YS5iKFwiaWdub3JlRGVwZW5kZW5jaWVzXCIsYS53ZD1hLmwudyk7dmFyIEY9YS5hLmJjKFwiX2xhdGVzdFZhbHVlXCIpO2EuTz1mdW5jdGlvbihiKXtmdW5jdGlvbiBjKCl7aWYoMDxhcmd1bWVudHMubGVuZ3RoKXJldHVybiBjLlVhKGNbRl0sYXJndW1lbnRzWzBdKSYmKGMuaWEoKSxjW0ZdPWFyZ3VtZW50c1swXSxjLmhhKCkpLHRoaXM7YS5sLnNjKGMpO3JldHVybiBjW0ZdfVxyXG4gICAgICAgIGNbRl09YjthLmEubGF8fGEuYS5leHRlbmQoYyxhLksuZm4pO2EuSy5mbi51YihjKTthLmEuYWIoYyxCKTthLm9wdGlvbnMuZGVmZXJVcGRhdGVzJiZhLkFhLmRlZmVycmVkKGMsITApO3JldHVybiBjfTt2YXIgQj17ZXF1YWxpdHlDb21wYXJlcjpKLHA6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tGXX0saGE6ZnVuY3Rpb24oKXt0aGlzLm5vdGlmeVN1YnNjcmliZXJzKHRoaXNbRl0pfSxpYTpmdW5jdGlvbigpe3RoaXMubm90aWZ5U3Vic2NyaWJlcnModGhpc1tGXSxcImJlZm9yZUNoYW5nZVwiKX19O2EuYS5sYSYmYS5hLiRhKEIsYS5LLmZuKTt2YXIgST1hLk8ubWQ9XCJfX2tvX3Byb3RvX19cIjtCW0ldPWEuTzthLlFhPWZ1bmN0aW9uKGIsYyl7cmV0dXJuIG51bGw9PT1ifHxiPT09bnx8YltJXT09PW4/ITE6YltJXT09PWM/ITA6YS5RYShiW0ldLGMpfTthLkk9ZnVuY3Rpb24oYil7cmV0dXJuIGEuUWEoYixhLk8pfTthLkRhPWZ1bmN0aW9uKGIpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGImJlxyXG4gICAgYltJXT09PWEuT3x8XCJmdW5jdGlvblwiPT10eXBlb2YgYiYmYltJXT09PWEuQiYmYi4kYz8hMDohMX07YS5iKFwib2JzZXJ2YWJsZVwiLGEuTyk7YS5iKFwiaXNPYnNlcnZhYmxlXCIsYS5JKTthLmIoXCJpc1dyaXRlYWJsZU9ic2VydmFibGVcIixhLkRhKTthLmIoXCJpc1dyaXRhYmxlT2JzZXJ2YWJsZVwiLGEuRGEpO2EuYihcIm9ic2VydmFibGUuZm5cIixCKTthLkgoQixcInBlZWtcIixCLnApO2EuSChCLFwidmFsdWVIYXNNdXRhdGVkXCIsQi5oYSk7YS5IKEIsXCJ2YWx1ZVdpbGxNdXRhdGVcIixCLmlhKTthLm1hPWZ1bmN0aW9uKGIpe2I9Ynx8W107aWYoXCJvYmplY3RcIiE9dHlwZW9mIGJ8fCEoXCJsZW5ndGhcImluIGIpKXRocm93IEVycm9yKFwiVGhlIGFyZ3VtZW50IHBhc3NlZCB3aGVuIGluaXRpYWxpemluZyBhbiBvYnNlcnZhYmxlIGFycmF5IG11c3QgYmUgYW4gYXJyYXksIG9yIG51bGwsIG9yIHVuZGVmaW5lZC5cIik7Yj1hLk8oYik7YS5hLmFiKGIsYS5tYS5mbik7cmV0dXJuIGIuZXh0ZW5kKHt0cmFja0FycmF5Q2hhbmdlczohMH0pfTtcclxuICAgIGEubWEuZm49e3JlbW92ZTpmdW5jdGlvbihiKXtmb3IodmFyIGM9dGhpcy5wKCksZD1bXSxlPVwiZnVuY3Rpb25cIiE9dHlwZW9mIGJ8fGEuSShiKT9mdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9OmIsZj0wO2Y8Yy5sZW5ndGg7ZisrKXt2YXIgZz1jW2ZdO2UoZykmJigwPT09ZC5sZW5ndGgmJnRoaXMuaWEoKSxkLnB1c2goZyksYy5zcGxpY2UoZiwxKSxmLS0pfWQubGVuZ3RoJiZ0aGlzLmhhKCk7cmV0dXJuIGR9LHJlbW92ZUFsbDpmdW5jdGlvbihiKXtpZihiPT09bil7dmFyIGM9dGhpcy5wKCksZD1jLnNsaWNlKDApO3RoaXMuaWEoKTtjLnNwbGljZSgwLGMubGVuZ3RoKTt0aGlzLmhhKCk7cmV0dXJuIGR9cmV0dXJuIGI/dGhpcy5yZW1vdmUoZnVuY3Rpb24oYyl7cmV0dXJuIDA8PWEuYS5vKGIsYyl9KTpbXX0sZGVzdHJveTpmdW5jdGlvbihiKXt2YXIgYz10aGlzLnAoKSxkPVwiZnVuY3Rpb25cIiE9dHlwZW9mIGJ8fGEuSShiKT9mdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9OmI7dGhpcy5pYSgpO1xyXG4gICAgICAgIGZvcih2YXIgZT1jLmxlbmd0aC0xOzA8PWU7ZS0tKWQoY1tlXSkmJihjW2VdLl9kZXN0cm95PSEwKTt0aGlzLmhhKCl9LGRlc3Ryb3lBbGw6ZnVuY3Rpb24oYil7cmV0dXJuIGI9PT1uP3RoaXMuZGVzdHJveShmdW5jdGlvbigpe3JldHVybiEwfSk6Yj90aGlzLmRlc3Ryb3koZnVuY3Rpb24oYyl7cmV0dXJuIDA8PWEuYS5vKGIsYyl9KTpbXX0saW5kZXhPZjpmdW5jdGlvbihiKXt2YXIgYz10aGlzKCk7cmV0dXJuIGEuYS5vKGMsYil9LHJlcGxhY2U6ZnVuY3Rpb24oYSxjKXt2YXIgZD10aGlzLmluZGV4T2YoYSk7MDw9ZCYmKHRoaXMuaWEoKSx0aGlzLnAoKVtkXT1jLHRoaXMuaGEoKSl9fTthLmEubGEmJmEuYS4kYShhLm1hLmZuLGEuTy5mbik7YS5hLnIoXCJwb3AgcHVzaCByZXZlcnNlIHNoaWZ0IHNvcnQgc3BsaWNlIHVuc2hpZnRcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYil7YS5tYS5mbltiXT1mdW5jdGlvbigpe3ZhciBhPXRoaXMucCgpO3RoaXMuaWEoKTt0aGlzLlliKGEsYixhcmd1bWVudHMpO1xyXG4gICAgICAgIHZhciBkPWFbYl0uYXBwbHkoYSxhcmd1bWVudHMpO3RoaXMuaGEoKTtyZXR1cm4gZD09PWE/dGhpczpkfX0pO2EuYS5yKFtcInNsaWNlXCJdLGZ1bmN0aW9uKGIpe2EubWEuZm5bYl09ZnVuY3Rpb24oKXt2YXIgYT10aGlzKCk7cmV0dXJuIGFbYl0uYXBwbHkoYSxhcmd1bWVudHMpfX0pO2EuYihcIm9ic2VydmFibGVBcnJheVwiLGEubWEpO2EuQWEudHJhY2tBcnJheUNoYW5nZXM9ZnVuY3Rpb24oYixjKXtmdW5jdGlvbiBkKCl7aWYoIWUpe2U9ITA7bD1iLm5vdGlmeVN1YnNjcmliZXJzO2Iubm90aWZ5U3Vic2NyaWJlcnM9ZnVuY3Rpb24oYSxiKXtiJiZiIT09RXx8KytoO3JldHVybiBsLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07dmFyIGM9W10uY29uY2F0KGIucCgpfHxbXSk7Zj1udWxsO2c9Yi5ZKGZ1bmN0aW9uKGQpe2Q9W10uY29uY2F0KGR8fFtdKTtpZihiLlJhKFwiYXJyYXlDaGFuZ2VcIikpe3ZhciBlO2lmKCFmfHwxPGgpZj1hLmEubGIoYyxkLGIua2IpO2U9Zn1jPWQ7Zj1udWxsO2g9MDtcclxuICAgICAgICBlJiZlLmxlbmd0aCYmYi5ub3RpZnlTdWJzY3JpYmVycyhlLFwiYXJyYXlDaGFuZ2VcIil9KX19Yi5rYj17fTtjJiZcIm9iamVjdFwiPT10eXBlb2YgYyYmYS5hLmV4dGVuZChiLmtiLGMpO2Iua2Iuc3BhcnNlPSEwO2lmKCFiLlliKXt2YXIgZT0hMSxmPW51bGwsZyxoPTAsbCxtPWIudWEsaz1iLkthO2IudWE9ZnVuY3Rpb24oYSl7bSYmbS5jYWxsKGIsYSk7XCJhcnJheUNoYW5nZVwiPT09YSYmZCgpfTtiLkthPWZ1bmN0aW9uKGEpe2smJmsuY2FsbChiLGEpO1wiYXJyYXlDaGFuZ2VcIiE9PWF8fGIuUmEoXCJhcnJheUNoYW5nZVwiKXx8KGwmJihiLm5vdGlmeVN1YnNjcmliZXJzPWwsbD1uKSxnLmsoKSxlPSExKX07Yi5ZYj1mdW5jdGlvbihiLGMsZCl7ZnVuY3Rpb24gayhhLGIsYyl7cmV0dXJuIG1bbS5sZW5ndGhdPXtzdGF0dXM6YSx2YWx1ZTpiLGluZGV4OmN9fWlmKGUmJiFoKXt2YXIgbT1bXSxsPWIubGVuZ3RoLGc9ZC5sZW5ndGgsRz0wO3N3aXRjaChjKXtjYXNlIFwicHVzaFwiOkc9bDtjYXNlIFwidW5zaGlmdFwiOmZvcihjPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMDtjPGc7YysrKWsoXCJhZGRlZFwiLGRbY10sRytjKTticmVhaztjYXNlIFwicG9wXCI6Rz1sLTE7Y2FzZSBcInNoaWZ0XCI6bCYmayhcImRlbGV0ZWRcIixiW0ddLEcpO2JyZWFrO2Nhc2UgXCJzcGxpY2VcIjpjPU1hdGgubWluKE1hdGgubWF4KDAsMD5kWzBdP2wrZFswXTpkWzBdKSxsKTtmb3IodmFyIGw9MT09PWc/bDpNYXRoLm1pbihjKyhkWzFdfHwwKSxsKSxnPWMrZy0yLEc9TWF0aC5tYXgobCxnKSxuPVtdLHM9W10sdz0yO2M8RzsrK2MsKyt3KWM8bCYmcy5wdXNoKGsoXCJkZWxldGVkXCIsYltjXSxjKSksYzxnJiZuLnB1c2goayhcImFkZGVkXCIsZFt3XSxjKSk7YS5hLmhjKHMsbik7YnJlYWs7ZGVmYXVsdDpyZXR1cm59Zj1tfX19fTt2YXIgcz1hLmEuYmMoXCJfc3RhdGVcIik7YS5tPWEuQj1mdW5jdGlvbihiLGMsZCl7ZnVuY3Rpb24gZSgpe2lmKDA8YXJndW1lbnRzLmxlbmd0aCl7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGYpZi5hcHBseShnLnNiLGFyZ3VtZW50cyk7ZWxzZSB0aHJvdyBFcnJvcihcIkNhbm5vdCB3cml0ZSBhIHZhbHVlIHRvIGEga28uY29tcHV0ZWQgdW5sZXNzIHlvdSBzcGVjaWZ5IGEgJ3dyaXRlJyBvcHRpb24uIElmIHlvdSB3aXNoIHRvIHJlYWQgdGhlIGN1cnJlbnQgdmFsdWUsIGRvbid0IHBhc3MgYW55IHBhcmFtZXRlcnMuXCIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzfWEubC5zYyhlKTsoZy5WfHxnLnQmJmUuU2EoKSkmJmUuVSgpO3JldHVybiBnLk19XCJvYmplY3RcIj09PXR5cGVvZiBiP2Q9YjooZD1kfHx7fSxiJiYoZC5yZWFkPWIpKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBkLnJlYWQpdGhyb3cgRXJyb3IoXCJQYXNzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUga28uY29tcHV0ZWRcIik7dmFyIGY9ZC53cml0ZSxnPXtNOm4sZGE6ITAsVjohMCxUYTohMSxIYjohMSxUOiExLFlhOiExLHQ6ITEsb2Q6ZC5yZWFkLHNiOmN8fGQub3duZXIsaTpkLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZHx8ZC5pfHxudWxsLHlhOmQuZGlzcG9zZVdoZW58fGQueWEscGI6bnVsbCxzOnt9LEw6MCxmYzpudWxsfTtlW3NdPWc7ZS4kYz1cImZ1bmN0aW9uXCI9PT10eXBlb2YgZjthLmEubGF8fGEuYS5leHRlbmQoZSxhLksuZm4pO2EuSy5mbi51YihlKTthLmEuYWIoZSx6KTtkLnB1cmU/KGcuWWE9ITAsZy50PSEwLGEuYS5leHRlbmQoZSxcclxuICAgICAgICBZKSk6ZC5kZWZlckV2YWx1YXRpb24mJmEuYS5leHRlbmQoZSxaKTthLm9wdGlvbnMuZGVmZXJVcGRhdGVzJiZhLkFhLmRlZmVycmVkKGUsITApO2cuaSYmKGcuSGI9ITAsZy5pLm5vZGVUeXBlfHwoZy5pPW51bGwpKTtnLnR8fGQuZGVmZXJFdmFsdWF0aW9ufHxlLlUoKTtnLmkmJmUuY2EoKSYmYS5hLkcucWEoZy5pLGcucGI9ZnVuY3Rpb24oKXtlLmsoKX0pO3JldHVybiBlfTt2YXIgej17ZXF1YWxpdHlDb21wYXJlcjpKLENhOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbc10uTH0sU2I6ZnVuY3Rpb24oYSxjLGQpe2lmKHRoaXNbc10uWWEmJmM9PT10aGlzKXRocm93IEVycm9yKFwiQSAncHVyZScgY29tcHV0ZWQgbXVzdCBub3QgYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5XCIpO3RoaXNbc10uc1thXT1kO2QuSWE9dGhpc1tzXS5MKys7ZC5wYT1jLlBhKCl9LFNhOmZ1bmN0aW9uKCl7dmFyIGEsYyxkPXRoaXNbc10ucztmb3IoYSBpbiBkKWlmKGQuaGFzT3duUHJvcGVydHkoYSkmJihjPWRbYV0sdGhpcy5vYSYmXHJcbiAgICAgICAgYy4kLkhhfHxjLiQuWmMoYy5wYSkpKXJldHVybiEwfSxnZDpmdW5jdGlvbigpe3RoaXMub2EmJiF0aGlzW3NdLlRhJiZ0aGlzLm9hKCExKX0sY2E6ZnVuY3Rpb24oKXt2YXIgYT10aGlzW3NdO3JldHVybiBhLlZ8fDA8YS5MfSxxZDpmdW5jdGlvbigpe3RoaXMuSGE/dGhpc1tzXS5WJiYodGhpc1tzXS5kYT0hMCk6dGhpcy5lYygpfSx5YzpmdW5jdGlvbihhKXtpZihhLmdiJiYhdGhpc1tzXS5pKXt2YXIgYz1hLlkodGhpcy5nZCx0aGlzLFwiZGlydHlcIiksZD1hLlkodGhpcy5xZCx0aGlzKTtyZXR1cm57JDphLGs6ZnVuY3Rpb24oKXtjLmsoKTtkLmsoKX19fXJldHVybiBhLlkodGhpcy5lYyx0aGlzKX0sZWM6ZnVuY3Rpb24oKXt2YXIgYj10aGlzLGM9Yi50aHJvdHRsZUV2YWx1YXRpb247YyYmMDw9Yz8oY2xlYXJUaW1lb3V0KHRoaXNbc10uZmMpLHRoaXNbc10uZmM9YS5hLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLlUoITApfSxjKSk6Yi5vYT9iLm9hKCEwKTpiLlUoITApfSxVOmZ1bmN0aW9uKGIpe3ZhciBjPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3NdLGQ9Yy55YSxlPSExO2lmKCFjLlRhJiYhYy5UKXtpZihjLmkmJiFhLmEucWIoYy5pKXx8ZCYmZCgpKXtpZighYy5IYil7dGhpcy5rKCk7cmV0dXJufX1lbHNlIGMuSGI9ITE7Yy5UYT0hMDt0cnl7ZT10aGlzLlZjKGIpfWZpbmFsbHl7Yy5UYT0hMX1jLkx8fHRoaXMuaygpO3JldHVybiBlfX0sVmM6ZnVuY3Rpb24oYil7dmFyIGM9dGhpc1tzXSxkPSExLGU9Yy5ZYT9uOiFjLkwsZj17TWM6dGhpcyxPYTpjLnMsb2I6Yy5MfTthLmwuWGIoe0xjOmYsamI6VyxtOnRoaXMsVmE6ZX0pO2Mucz17fTtjLkw9MDtmPXRoaXMuVWMoYyxmKTt0aGlzLlVhKGMuTSxmKSYmKGMudHx8dGhpcy5ub3RpZnlTdWJzY3JpYmVycyhjLk0sXCJiZWZvcmVDaGFuZ2VcIiksYy5NPWYsYy50P3RoaXMuS2IoKTpiJiZ0aGlzLm5vdGlmeVN1YnNjcmliZXJzKGMuTSksZD0hMCk7ZSYmdGhpcy5ub3RpZnlTdWJzY3JpYmVycyhjLk0sXCJhd2FrZVwiKTtyZXR1cm4gZH0sVWM6ZnVuY3Rpb24oYixjKXt0cnl7dmFyIGQ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5vZDtyZXR1cm4gYi5zYj9kLmNhbGwoYi5zYik6ZCgpfWZpbmFsbHl7YS5sLmVuZCgpLGMub2ImJiFiLnQmJmEuYS5EKGMuT2EsViksYi5kYT1iLlY9ITF9fSxwOmZ1bmN0aW9uKGEpe3ZhciBjPXRoaXNbc107KGMuViYmKGF8fCFjLkwpfHxjLnQmJnRoaXMuU2EoKSkmJnRoaXMuVSgpO3JldHVybiBjLk19LFdhOmZ1bmN0aW9uKGIpe2EuSy5mbi5XYS5jYWxsKHRoaXMsYik7dGhpcy5NYj1mdW5jdGlvbigpe3RoaXNbc10uZGE/dGhpcy5VKCk6dGhpc1tzXS5WPSExO3JldHVybiB0aGlzW3NdLk19O3RoaXMub2E9ZnVuY3Rpb24oYSl7dGhpcy5PYih0aGlzW3NdLk0pO3RoaXNbc10uVj0hMDthJiYodGhpc1tzXS5kYT0hMCk7dGhpcy5QYih0aGlzKX19LGs6ZnVuY3Rpb24oKXt2YXIgYj10aGlzW3NdOyFiLnQmJmIucyYmYS5hLkQoYi5zLGZ1bmN0aW9uKGEsYil7Yi5rJiZiLmsoKX0pO2IuaSYmYi5wYiYmYS5hLkcudGMoYi5pLGIucGIpO2Iucz1udWxsO2IuTD0wO2IuVD0hMDtiLmRhPVxyXG4gICAgICAgICExO2IuVj0hMTtiLnQ9ITE7Yi5pPW51bGx9fSxZPXt1YTpmdW5jdGlvbihiKXt2YXIgYz10aGlzLGQ9Y1tzXTtpZighZC5UJiZkLnQmJlwiY2hhbmdlXCI9PWIpe2QudD0hMTtpZihkLmRhfHxjLlNhKCkpZC5zPW51bGwsZC5MPTAsYy5VKCkmJmMuS2IoKTtlbHNle3ZhciBlPVtdO2EuYS5EKGQucyxmdW5jdGlvbihhLGIpe2VbYi5JYV09YX0pO2EuYS5yKGUsZnVuY3Rpb24oYSxiKXt2YXIgZT1kLnNbYV0sbD1jLnljKGUuJCk7bC5JYT1iO2wucGE9ZS5wYTtkLnNbYV09bH0pfWQuVHx8Yy5ub3RpZnlTdWJzY3JpYmVycyhkLk0sXCJhd2FrZVwiKX19LEthOmZ1bmN0aW9uKGIpe3ZhciBjPXRoaXNbc107Yy5UfHxcImNoYW5nZVwiIT1ifHx0aGlzLlJhKFwiY2hhbmdlXCIpfHwoYS5hLkQoYy5zLGZ1bmN0aW9uKGEsYil7Yi5rJiYoYy5zW2FdPXskOmIuJCxJYTpiLklhLHBhOmIucGF9LGIuaygpKX0pLGMudD0hMCx0aGlzLm5vdGlmeVN1YnNjcmliZXJzKG4sXCJhc2xlZXBcIikpfSxQYTpmdW5jdGlvbigpe3ZhciBiPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3NdO2IudCYmKGIuZGF8fHRoaXMuU2EoKSkmJnRoaXMuVSgpO3JldHVybiBhLksuZm4uUGEuY2FsbCh0aGlzKX19LFo9e3VhOmZ1bmN0aW9uKGEpe1wiY2hhbmdlXCIhPWEmJlwiYmVmb3JlQ2hhbmdlXCIhPWF8fHRoaXMucCgpfX07YS5hLmxhJiZhLmEuJGEoeixhLksuZm4pO3ZhciBQPWEuTy5tZDthLm1bUF09YS5PO3pbUF09YS5tO2EuYmQ9ZnVuY3Rpb24oYil7cmV0dXJuIGEuUWEoYixhLm0pfTthLmNkPWZ1bmN0aW9uKGIpe3JldHVybiBhLlFhKGIsYS5tKSYmYltzXSYmYltzXS5ZYX07YS5iKFwiY29tcHV0ZWRcIixhLm0pO2EuYihcImRlcGVuZGVudE9ic2VydmFibGVcIixhLm0pO2EuYihcImlzQ29tcHV0ZWRcIixhLmJkKTthLmIoXCJpc1B1cmVDb21wdXRlZFwiLGEuY2QpO2EuYihcImNvbXB1dGVkLmZuXCIseik7YS5IKHosXCJwZWVrXCIsei5wKTthLkgoeixcImRpc3Bvc2VcIix6LmspO2EuSCh6LFwiaXNBY3RpdmVcIix6LmNhKTthLkgoeixcImdldERlcGVuZGVuY2llc0NvdW50XCIsei5DYSk7YS5yYz1cclxuICAgICAgICBmdW5jdGlvbihiLGMpe2lmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBiKXJldHVybiBhLm0oYixjLHtwdXJlOiEwfSk7Yj1hLmEuZXh0ZW5kKHt9LGIpO2IucHVyZT0hMDtyZXR1cm4gYS5tKGIsYyl9O2EuYihcInB1cmVDb21wdXRlZFwiLGEucmMpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSxmLGcpe2c9Z3x8bmV3IGQ7YT1mKGEpO2lmKFwib2JqZWN0XCIhPXR5cGVvZiBhfHxudWxsPT09YXx8YT09PW58fGEgaW5zdGFuY2VvZiBSZWdFeHB8fGEgaW5zdGFuY2VvZiBEYXRlfHxhIGluc3RhbmNlb2YgU3RyaW5nfHxhIGluc3RhbmNlb2YgTnVtYmVyfHxhIGluc3RhbmNlb2YgQm9vbGVhbilyZXR1cm4gYTt2YXIgaD1hIGluc3RhbmNlb2YgQXJyYXk/W106e307Zy5zYXZlKGEsaCk7YyhhLGZ1bmN0aW9uKGMpe3ZhciBkPWYoYVtjXSk7c3dpdGNoKHR5cGVvZiBkKXtjYXNlIFwiYm9vbGVhblwiOmNhc2UgXCJudW1iZXJcIjpjYXNlIFwic3RyaW5nXCI6Y2FzZSBcImZ1bmN0aW9uXCI6aFtjXT1kO2JyZWFrO2Nhc2UgXCJvYmplY3RcIjpjYXNlIFwidW5kZWZpbmVkXCI6dmFyIGs9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5nZXQoZCk7aFtjXT1rIT09bj9rOmIoZCxmLGcpfX0pO3JldHVybiBofWZ1bmN0aW9uIGMoYSxiKXtpZihhIGluc3RhbmNlb2YgQXJyYXkpe2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKWIoYyk7XCJmdW5jdGlvblwiPT10eXBlb2YgYS50b0pTT04mJmIoXCJ0b0pTT05cIil9ZWxzZSBmb3IoYyBpbiBhKWIoYyl9ZnVuY3Rpb24gZCgpe3RoaXMua2V5cz1bXTt0aGlzLkxiPVtdfWEuQWM9ZnVuY3Rpb24oYyl7aWYoMD09YXJndW1lbnRzLmxlbmd0aCl0aHJvdyBFcnJvcihcIldoZW4gY2FsbGluZyBrby50b0pTLCBwYXNzIHRoZSBvYmplY3QgeW91IHdhbnQgdG8gY29udmVydC5cIik7cmV0dXJuIGIoYyxmdW5jdGlvbihiKXtmb3IodmFyIGM9MDthLkkoYikmJjEwPmM7YysrKWI9YigpO3JldHVybiBifSl9O2EudG9KU09OPWZ1bmN0aW9uKGIsYyxkKXtiPWEuQWMoYik7cmV0dXJuIGEuYS5HYihiLGMsZCl9O2QucHJvdG90eXBlPXtzYXZlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLm8odGhpcy5rZXlzLFxyXG4gICAgICAgIGIpOzA8PWQ/dGhpcy5MYltkXT1jOih0aGlzLmtleXMucHVzaChiKSx0aGlzLkxiLnB1c2goYykpfSxnZXQ6ZnVuY3Rpb24oYil7Yj1hLmEubyh0aGlzLmtleXMsYik7cmV0dXJuIDA8PWI/dGhpcy5MYltiXTpufX19KSgpO2EuYihcInRvSlNcIixhLkFjKTthLmIoXCJ0b0pTT05cIixhLnRvSlNPTik7KGZ1bmN0aW9uKCl7YS5qPXt1OmZ1bmN0aW9uKGIpe3N3aXRjaChhLmEuQShiKSl7Y2FzZSBcIm9wdGlvblwiOnJldHVybiEwPT09Yi5fX2tvX19oYXNEb21EYXRhT3B0aW9uVmFsdWVfXz9hLmEuZS5nZXQoYixhLmQub3B0aW9ucy56Yik6Nz49YS5hLkM/Yi5nZXRBdHRyaWJ1dGVOb2RlKFwidmFsdWVcIikmJmIuZ2V0QXR0cmlidXRlTm9kZShcInZhbHVlXCIpLnNwZWNpZmllZD9iLnZhbHVlOmIudGV4dDpiLnZhbHVlO2Nhc2UgXCJzZWxlY3RcIjpyZXR1cm4gMDw9Yi5zZWxlY3RlZEluZGV4P2Euai51KGIub3B0aW9uc1tiLnNlbGVjdGVkSW5kZXhdKTpuO2RlZmF1bHQ6cmV0dXJuIGIudmFsdWV9fSxqYTpmdW5jdGlvbihiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLGQpe3N3aXRjaChhLmEuQShiKSl7Y2FzZSBcIm9wdGlvblwiOnN3aXRjaCh0eXBlb2YgYyl7Y2FzZSBcInN0cmluZ1wiOmEuYS5lLnNldChiLGEuZC5vcHRpb25zLnpiLG4pO1wiX19rb19faGFzRG9tRGF0YU9wdGlvblZhbHVlX19cImluIGImJmRlbGV0ZSBiLl9fa29fX2hhc0RvbURhdGFPcHRpb25WYWx1ZV9fO2IudmFsdWU9YzticmVhaztkZWZhdWx0OmEuYS5lLnNldChiLGEuZC5vcHRpb25zLnpiLGMpLGIuX19rb19faGFzRG9tRGF0YU9wdGlvblZhbHVlX189ITAsYi52YWx1ZT1cIm51bWJlclwiPT09dHlwZW9mIGM/YzpcIlwifWJyZWFrO2Nhc2UgXCJzZWxlY3RcIjppZihcIlwiPT09Y3x8bnVsbD09PWMpYz1uO2Zvcih2YXIgZT0tMSxmPTAsZz1iLm9wdGlvbnMubGVuZ3RoLGg7ZjxnOysrZilpZihoPWEuai51KGIub3B0aW9uc1tmXSksaD09Y3x8XCJcIj09aCYmYz09PW4pe2U9ZjticmVha31pZihkfHwwPD1lfHxjPT09biYmMTxiLnNpemUpYi5zZWxlY3RlZEluZGV4PWU7YnJlYWs7ZGVmYXVsdDppZihudWxsPT09XHJcbiAgICAgICAgY3x8Yz09PW4pYz1cIlwiO2IudmFsdWU9Y319fX0pKCk7YS5iKFwic2VsZWN0RXh0ZW5zaW9uc1wiLGEuaik7YS5iKFwic2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWVcIixhLmoudSk7YS5iKFwic2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlXCIsYS5qLmphKTthLmg9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIpe2I9YS5hLmNiKGIpOzEyMz09PWIuY2hhckNvZGVBdCgwKSYmKGI9Yi5zbGljZSgxLC0xKSk7dmFyIGM9W10sZD1iLm1hdGNoKGUpLHIsaD1bXSxwPTA7aWYoZCl7ZC5wdXNoKFwiLFwiKTtmb3IodmFyIEE9MCx5O3k9ZFtBXTsrK0Epe3ZhciB2PXkuY2hhckNvZGVBdCgwKTtpZig0ND09PXYpe2lmKDA+PXApe2MucHVzaChyJiZoLmxlbmd0aD97a2V5OnIsdmFsdWU6aC5qb2luKFwiXCIpfTp7dW5rbm93bjpyfHxoLmpvaW4oXCJcIil9KTtyPXA9MDtoPVtdO2NvbnRpbnVlfX1lbHNlIGlmKDU4PT09dil7aWYoIXAmJiFyJiYxPT09aC5sZW5ndGgpe3I9aC5wb3AoKTtjb250aW51ZX19ZWxzZSA0Nz09PVxyXG4gICAgdiYmQSYmMTx5Lmxlbmd0aD8odj1kW0EtMV0ubWF0Y2goZikpJiYhZ1t2WzBdXSYmKGI9Yi5zdWJzdHIoYi5pbmRleE9mKHkpKzEpLGQ9Yi5tYXRjaChlKSxkLnB1c2goXCIsXCIpLEE9LTEseT1cIi9cIik6NDA9PT12fHwxMjM9PT12fHw5MT09PXY/KytwOjQxPT09dnx8MTI1PT09dnx8OTM9PT12Py0tcDpyfHxoLmxlbmd0aHx8MzQhPT12JiYzOSE9PXZ8fCh5PXkuc2xpY2UoMSwtMSkpO2gucHVzaCh5KX19cmV0dXJuIGN9dmFyIGM9W1widHJ1ZVwiLFwiZmFsc2VcIixcIm51bGxcIixcInVuZGVmaW5lZFwiXSxkPS9eKD86WyRfYS16XVskXFx3XSp8KC4rKShcXC5cXHMqWyRfYS16XVskXFx3XSp8XFxbLitcXF0pKSQvaSxlPVJlZ0V4cChcIlxcXCIoPzpbXlxcXCJcXFxcXFxcXF18XFxcXFxcXFwuKSpcXFwifCcoPzpbXidcXFxcXFxcXF18XFxcXFxcXFwuKSonfC8oPzpbXi9cXFxcXFxcXF18XFxcXFxcXFwuKSovdyp8W15cXFxcczosL11bXixcXFwiJ3t9KCkvOltcXFxcXV0qW15cXFxccyxcXFwiJ3t9KCkvOltcXFxcXV18W15cXFxcc11cIixcImdcIiksZj0vW1xcXSlcIidBLVphLXowLTlfJF0rJC8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnPXtcImluXCI6MSxcInJldHVyblwiOjEsXCJ0eXBlb2ZcIjoxfSxoPXt9O3JldHVybnt2YTpbXSxnYTpoLEFiOmIsWGE6ZnVuY3Rpb24oZSxtKXtmdW5jdGlvbiBrKGIsZSl7dmFyIG07aWYoIUEpe3ZhciBsPWEuZ2V0QmluZGluZ0hhbmRsZXIoYik7aWYobCYmbC5wcmVwcm9jZXNzJiYhKGU9bC5wcmVwcm9jZXNzKGUsYixrKSkpcmV0dXJuO2lmKGw9aFtiXSltPWUsMDw9YS5hLm8oYyxtKT9tPSExOihsPW0ubWF0Y2goZCksbT1udWxsPT09bD8hMTpsWzFdP1wiT2JqZWN0KFwiK2xbMV0rXCIpXCIrbFsyXTptKSxsPW07bCYmZy5wdXNoKFwiJ1wiK2IrXCInOmZ1bmN0aW9uKF96KXtcIittK1wiPV96fVwiKX1wJiYoZT1cImZ1bmN0aW9uKCl7cmV0dXJuIFwiK2UrXCIgfVwiKTtmLnB1c2goXCInXCIrYitcIic6XCIrZSl9bT1tfHx7fTt2YXIgZj1bXSxnPVtdLHA9bS52YWx1ZUFjY2Vzc29ycyxBPW0uYmluZGluZ1BhcmFtcyx5PVwic3RyaW5nXCI9PT10eXBlb2YgZT9iKGUpOmU7YS5hLnIoeSxmdW5jdGlvbihhKXtrKGEua2V5fHxcclxuICAgICAgICBhLnVua25vd24sYS52YWx1ZSl9KTtnLmxlbmd0aCYmayhcIl9rb19wcm9wZXJ0eV93cml0ZXJzXCIsXCJ7XCIrZy5qb2luKFwiLFwiKStcIiB9XCIpO3JldHVybiBmLmpvaW4oXCIsXCIpfSxmZDpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKWlmKGFbY10ua2V5PT1iKXJldHVybiEwO3JldHVybiExfSxHYTpmdW5jdGlvbihiLGMsZCxlLGYpe2lmKGImJmEuSShiKSkhYS5EYShiKXx8ZiYmYi5wKCk9PT1lfHxiKGUpO2Vsc2UgaWYoKGI9Yy5nZXQoXCJfa29fcHJvcGVydHlfd3JpdGVyc1wiKSkmJmJbZF0pYltkXShlKX19fSgpO2EuYihcImV4cHJlc3Npb25SZXdyaXRpbmdcIixhLmgpO2EuYihcImV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzXCIsYS5oLnZhKTthLmIoXCJleHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbFwiLGEuaC5BYik7YS5iKFwiZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3NcIixhLmguWGEpO2EuYihcImV4cHJlc3Npb25SZXdyaXRpbmcuX3R3b1dheUJpbmRpbmdzXCIsXHJcbiAgICAgICAgYS5oLmdhKTthLmIoXCJqc29uRXhwcmVzc2lvblJld3JpdGluZ1wiLGEuaCk7YS5iKFwianNvbkV4cHJlc3Npb25SZXdyaXRpbmcuaW5zZXJ0UHJvcGVydHlBY2Nlc3NvcnNJbnRvSnNvblwiLGEuaC5YYSk7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhKXtyZXR1cm4gOD09YS5ub2RlVHlwZSYmZy50ZXN0KGY/YS50ZXh0OmEubm9kZVZhbHVlKX1mdW5jdGlvbiBjKGEpe3JldHVybiA4PT1hLm5vZGVUeXBlJiZoLnRlc3QoZj9hLnRleHQ6YS5ub2RlVmFsdWUpfWZ1bmN0aW9uIGQoYSxkKXtmb3IodmFyIGU9YSxmPTEsbD1bXTtlPWUubmV4dFNpYmxpbmc7KXtpZihjKGUpJiYoZi0tLDA9PT1mKSlyZXR1cm4gbDtsLnB1c2goZSk7YihlKSYmZisrfWlmKCFkKXRocm93IEVycm9yKFwiQ2Fubm90IGZpbmQgY2xvc2luZyBjb21tZW50IHRhZyB0byBtYXRjaDogXCIrYS5ub2RlVmFsdWUpO3JldHVybiBudWxsfWZ1bmN0aW9uIGUoYSxiKXt2YXIgYz1kKGEsYik7cmV0dXJuIGM/MDxjLmxlbmd0aD9jW2MubGVuZ3RoLVxyXG4gICAgMV0ubmV4dFNpYmxpbmc6YS5uZXh0U2libGluZzpudWxsfXZhciBmPXQmJlwiXFx4M2MhLS10ZXN0LS1cXHgzZVwiPT09dC5jcmVhdGVDb21tZW50KFwidGVzdFwiKS50ZXh0LGc9Zj8vXlxceDNjIS0tXFxzKmtvKD86XFxzKyhbXFxzXFxTXSspKT9cXHMqLS1cXHgzZSQvOi9eXFxzKmtvKD86XFxzKyhbXFxzXFxTXSspKT9cXHMqJC8saD1mPy9eXFx4M2MhLS1cXHMqXFwva29cXHMqLS1cXHgzZSQvOi9eXFxzKlxcL2tvXFxzKiQvLGw9e3VsOiEwLG9sOiEwfTthLmY9e2FhOnt9LGNoaWxkTm9kZXM6ZnVuY3Rpb24oYSl7cmV0dXJuIGIoYSk/ZChhKTphLmNoaWxkTm9kZXN9LHphOmZ1bmN0aW9uKGMpe2lmKGIoYykpe2M9YS5mLmNoaWxkTm9kZXMoYyk7Zm9yKHZhciBkPTAsZT1jLmxlbmd0aDtkPGU7ZCsrKWEucmVtb3ZlTm9kZShjW2RdKX1lbHNlIGEuYS5yYihjKX0sZmE6ZnVuY3Rpb24oYyxkKXtpZihiKGMpKXthLmYuemEoYyk7Zm9yKHZhciBlPWMubmV4dFNpYmxpbmcsZj0wLGw9ZC5sZW5ndGg7ZjxsO2YrKyllLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRbZl0sXHJcbiAgICAgICAgZSl9ZWxzZSBhLmEuZmEoYyxkKX0scWM6ZnVuY3Rpb24oYSxjKXtiKGEpP2EucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYyxhLm5leHRTaWJsaW5nKTphLmZpcnN0Q2hpbGQ/YS5pbnNlcnRCZWZvcmUoYyxhLmZpcnN0Q2hpbGQpOmEuYXBwZW5kQ2hpbGQoYyl9LGtjOmZ1bmN0aW9uKGMsZCxlKXtlP2IoYyk/Yy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkLGUubmV4dFNpYmxpbmcpOmUubmV4dFNpYmxpbmc/Yy5pbnNlcnRCZWZvcmUoZCxlLm5leHRTaWJsaW5nKTpjLmFwcGVuZENoaWxkKGQpOmEuZi5xYyhjLGQpfSxmaXJzdENoaWxkOmZ1bmN0aW9uKGEpe3JldHVybiBiKGEpPyFhLm5leHRTaWJsaW5nfHxjKGEubmV4dFNpYmxpbmcpP251bGw6YS5uZXh0U2libGluZzphLmZpcnN0Q2hpbGR9LG5leHRTaWJsaW5nOmZ1bmN0aW9uKGEpe2IoYSkmJihhPWUoYSkpO3JldHVybiBhLm5leHRTaWJsaW5nJiZjKGEubmV4dFNpYmxpbmcpP251bGw6YS5uZXh0U2libGluZ30sWWM6Yix2ZDpmdW5jdGlvbihhKXtyZXR1cm4oYT1cclxuICAgICAgICAoZj9hLnRleHQ6YS5ub2RlVmFsdWUpLm1hdGNoKGcpKT9hWzFdOm51bGx9LG9jOmZ1bmN0aW9uKGQpe2lmKGxbYS5hLkEoZCldKXt2YXIgaz1kLmZpcnN0Q2hpbGQ7aWYoayl7ZG8gaWYoMT09PWsubm9kZVR5cGUpe3ZhciBmO2Y9ay5maXJzdENoaWxkO3ZhciBnPW51bGw7aWYoZil7ZG8gaWYoZylnLnB1c2goZik7ZWxzZSBpZihiKGYpKXt2YXIgaD1lKGYsITApO2g/Zj1oOmc9W2ZdfWVsc2UgYyhmKSYmKGc9W2ZdKTt3aGlsZShmPWYubmV4dFNpYmxpbmcpfWlmKGY9Zylmb3IoZz1rLm5leHRTaWJsaW5nLGg9MDtoPGYubGVuZ3RoO2grKylnP2QuaW5zZXJ0QmVmb3JlKGZbaF0sZyk6ZC5hcHBlbmRDaGlsZChmW2hdKX13aGlsZShrPWsubmV4dFNpYmxpbmcpfX19fX0pKCk7YS5iKFwidmlydHVhbEVsZW1lbnRzXCIsYS5mKTthLmIoXCJ2aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzXCIsYS5mLmFhKTthLmIoXCJ2aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlXCIsYS5mLnphKTthLmIoXCJ2aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXJcIixcclxuICAgICAgICBhLmYua2MpO2EuYihcInZpcnR1YWxFbGVtZW50cy5wcmVwZW5kXCIsYS5mLnFjKTthLmIoXCJ2aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuXCIsYS5mLmZhKTsoZnVuY3Rpb24oKXthLlM9ZnVuY3Rpb24oKXt0aGlzLktjPXt9fTthLmEuZXh0ZW5kKGEuUy5wcm90b3R5cGUse25vZGVIYXNCaW5kaW5nczpmdW5jdGlvbihiKXtzd2l0Y2goYi5ub2RlVHlwZSl7Y2FzZSAxOnJldHVybiBudWxsIT1iLmdldEF0dHJpYnV0ZShcImRhdGEtYmluZFwiKXx8YS5nLmdldENvbXBvbmVudE5hbWVGb3JOb2RlKGIpO2Nhc2UgODpyZXR1cm4gYS5mLlljKGIpO2RlZmF1bHQ6cmV0dXJuITF9fSxnZXRCaW5kaW5nczpmdW5jdGlvbihiLGMpe3ZhciBkPXRoaXMuZ2V0QmluZGluZ3NTdHJpbmcoYixjKSxkPWQ/dGhpcy5wYXJzZUJpbmRpbmdzU3RyaW5nKGQsYyxiKTpudWxsO3JldHVybiBhLmcuUmIoZCxiLGMsITEpfSxnZXRCaW5kaW5nQWNjZXNzb3JzOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9dGhpcy5nZXRCaW5kaW5nc1N0cmluZyhiLFxyXG4gICAgICAgIGMpLGQ9ZD90aGlzLnBhcnNlQmluZGluZ3NTdHJpbmcoZCxjLGIse3ZhbHVlQWNjZXNzb3JzOiEwfSk6bnVsbDtyZXR1cm4gYS5nLlJiKGQsYixjLCEwKX0sZ2V0QmluZGluZ3NTdHJpbmc6ZnVuY3Rpb24oYil7c3dpdGNoKGIubm9kZVR5cGUpe2Nhc2UgMTpyZXR1cm4gYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWJpbmRcIik7Y2FzZSA4OnJldHVybiBhLmYudmQoYik7ZGVmYXVsdDpyZXR1cm4gbnVsbH19LHBhcnNlQmluZGluZ3NTdHJpbmc6ZnVuY3Rpb24oYixjLGQsZSl7dHJ5e3ZhciBmPXRoaXMuS2MsZz1iKyhlJiZlLnZhbHVlQWNjZXNzb3JzfHxcIlwiKSxoO2lmKCEoaD1mW2ddKSl7dmFyIGwsbT1cIndpdGgoJGNvbnRleHQpe3dpdGgoJGRhdGF8fHt9KXtyZXR1cm57XCIrYS5oLlhhKGIsZSkrXCJ9fX1cIjtsPW5ldyBGdW5jdGlvbihcIiRjb250ZXh0XCIsXCIkZWxlbWVudFwiLG0pO2g9ZltnXT1sfXJldHVybiBoKGMsZCl9Y2F0Y2goayl7dGhyb3cgay5tZXNzYWdlPVwiVW5hYmxlIHRvIHBhcnNlIGJpbmRpbmdzLlxcbkJpbmRpbmdzIHZhbHVlOiBcIitcclxuICAgICAgICBiK1wiXFxuTWVzc2FnZTogXCIray5tZXNzYWdlLGs7fX19KTthLlMuaW5zdGFuY2U9bmV3IGEuU30pKCk7YS5iKFwiYmluZGluZ1Byb3ZpZGVyXCIsYS5TKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhfX1mdW5jdGlvbiBjKGEpe3JldHVybiBhKCl9ZnVuY3Rpb24gZChiKXtyZXR1cm4gYS5hLkVhKGEubC53KGIpLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGIoKVtjXX19KX1mdW5jdGlvbiBlKGMsZSxrKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYz9kKGMuYmluZChudWxsLGUsaykpOmEuYS5FYShjLGIpfWZ1bmN0aW9uIGYoYSxiKXtyZXR1cm4gZCh0aGlzLmdldEJpbmRpbmdzLmJpbmQodGhpcyxhLGIpKX1mdW5jdGlvbiBnKGIsYyxkKXt2YXIgZSxrPWEuZi5maXJzdENoaWxkKGMpLGY9YS5TLmluc3RhbmNlLG09Zi5wcmVwcm9jZXNzTm9kZTtpZihtKXtmb3IoO2U9azspaz1hLmYubmV4dFNpYmxpbmcoZSksXHJcbiAgICAgICAgbS5jYWxsKGYsZSk7az1hLmYuZmlyc3RDaGlsZChjKX1mb3IoO2U9azspaz1hLmYubmV4dFNpYmxpbmcoZSksaChiLGUsZCl9ZnVuY3Rpb24gaChiLGMsZCl7dmFyIGU9ITAsaz0xPT09Yy5ub2RlVHlwZTtrJiZhLmYub2MoYyk7aWYoayYmZHx8YS5TLmluc3RhbmNlLm5vZGVIYXNCaW5kaW5ncyhjKSllPW0oYyxudWxsLGIsZCkuc2hvdWxkQmluZERlc2NlbmRhbnRzO2UmJiFyW2EuYS5BKGMpXSYmZyhiLGMsIWspfWZ1bmN0aW9uIGwoYil7dmFyIGM9W10sZD17fSxlPVtdO2EuYS5EKGIsZnVuY3Rpb24gWChrKXtpZighZFtrXSl7dmFyIGY9YS5nZXRCaW5kaW5nSGFuZGxlcihrKTtmJiYoZi5hZnRlciYmKGUucHVzaChrKSxhLmEucihmLmFmdGVyLGZ1bmN0aW9uKGMpe2lmKGJbY10pe2lmKC0xIT09YS5hLm8oZSxjKSl0aHJvdyBFcnJvcihcIkNhbm5vdCBjb21iaW5lIHRoZSBmb2xsb3dpbmcgYmluZGluZ3MsIGJlY2F1c2UgdGhleSBoYXZlIGEgY3ljbGljIGRlcGVuZGVuY3k6IFwiK2Uuam9pbihcIiwgXCIpKTtcclxuICAgICAgICBYKGMpfX0pLGUubGVuZ3RoLS0pLGMucHVzaCh7a2V5OmssamM6Zn0pKTtkW2tdPSEwfX0pO3JldHVybiBjfWZ1bmN0aW9uIG0oYixkLGUsayl7dmFyIG09YS5hLmUuZ2V0KGIscSk7aWYoIWQpe2lmKG0pdGhyb3cgRXJyb3IoXCJZb3UgY2Fubm90IGFwcGx5IGJpbmRpbmdzIG11bHRpcGxlIHRpbWVzIHRvIHRoZSBzYW1lIGVsZW1lbnQuXCIpO2EuYS5lLnNldChiLHEsITApfSFtJiZrJiZhLnhjKGIsZSk7dmFyIGc7aWYoZCYmXCJmdW5jdGlvblwiIT09dHlwZW9mIGQpZz1kO2Vsc2V7dmFyIGg9YS5TLmluc3RhbmNlLHI9aC5nZXRCaW5kaW5nQWNjZXNzb3JzfHxmLHA9YS5CKGZ1bmN0aW9uKCl7KGc9ZD9kKGUsYik6ci5jYWxsKGgsYixlKSkmJmUuUSYmZS5RKCk7cmV0dXJuIGd9LG51bGwse2k6Yn0pO2cmJnAuY2EoKXx8KHA9bnVsbCl9dmFyIHM7aWYoZyl7dmFyIHQ9cD9mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYyhwKClbYV0pfX06ZnVuY3Rpb24oYSl7cmV0dXJuIGdbYV19LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1PWZ1bmN0aW9uKCl7cmV0dXJuIGEuYS5FYShwP3AoKTpnLGMpfTt1LmdldD1mdW5jdGlvbihhKXtyZXR1cm4gZ1thXSYmYyh0KGEpKX07dS5oYXM9ZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW4gZ307az1sKGcpO2EuYS5yKGssZnVuY3Rpb24oYyl7dmFyIGQ9Yy5qYy5pbml0LGs9Yy5qYy51cGRhdGUsZj1jLmtleTtpZig4PT09Yi5ub2RlVHlwZSYmIWEuZi5hYVtmXSl0aHJvdyBFcnJvcihcIlRoZSBiaW5kaW5nICdcIitmK1wiJyBjYW5ub3QgYmUgdXNlZCB3aXRoIHZpcnR1YWwgZWxlbWVudHNcIik7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIGQmJmEubC53KGZ1bmN0aW9uKCl7dmFyIGE9ZChiLHQoZiksdSxlLiRkYXRhLGUpO2lmKGEmJmEuY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3Mpe2lmKHMhPT1uKXRocm93IEVycm9yKFwiTXVsdGlwbGUgYmluZGluZ3MgKFwiK3MrXCIgYW5kIFwiK2YrXCIpIGFyZSB0cnlpbmcgdG8gY29udHJvbCBkZXNjZW5kYW50IGJpbmRpbmdzIG9mIHRoZSBzYW1lIGVsZW1lbnQuIFlvdSBjYW5ub3QgdXNlIHRoZXNlIGJpbmRpbmdzIHRvZ2V0aGVyIG9uIHRoZSBzYW1lIGVsZW1lbnQuXCIpO1xyXG4gICAgICAgIHM9Zn19KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBrJiZhLkIoZnVuY3Rpb24oKXtrKGIsdChmKSx1LGUuJGRhdGEsZSl9LG51bGwse2k6Yn0pfWNhdGNoKG0pe3Rocm93IG0ubWVzc2FnZT0nVW5hYmxlIHRvIHByb2Nlc3MgYmluZGluZyBcIicrZitcIjogXCIrZ1tmXSsnXCJcXG5NZXNzYWdlOiAnK20ubWVzc2FnZSxtO319KX1yZXR1cm57c2hvdWxkQmluZERlc2NlbmRhbnRzOnM9PT1ufX1mdW5jdGlvbiBrKGIpe3JldHVybiBiJiZiIGluc3RhbmNlb2YgYS5SP2I6bmV3IGEuUihiKX1hLmQ9e307dmFyIHI9e3NjcmlwdDohMCx0ZXh0YXJlYTohMCx0ZW1wbGF0ZTohMH07YS5nZXRCaW5kaW5nSGFuZGxlcj1mdW5jdGlvbihiKXtyZXR1cm4gYS5kW2JdfTthLlI9ZnVuY3Rpb24oYixjLGQsZSxrKXtmdW5jdGlvbiBmKCl7dmFyIGs9Zz9iKCk6YixtPWEuYS5jKGspO2M/KGMuUSYmYy5RKCksYS5hLmV4dGVuZChsLGMpLGwuUT1yKToobC4kcGFyZW50cz1bXSxsLiRyb290PW0sbC5rbz1hKTtsLiRyYXdEYXRhPVxyXG4gICAgICAgIGs7bC4kZGF0YT1tO2QmJihsW2RdPW0pO2UmJmUobCxjLG0pO3JldHVybiBsLiRkYXRhfWZ1bmN0aW9uIG0oKXtyZXR1cm4gaCYmIWEuYS5UYihoKX12YXIgbD10aGlzLGc9XCJmdW5jdGlvblwiPT10eXBlb2YgYiYmIWEuSShiKSxoLHI7ayYmay5leHBvcnREZXBlbmRlbmNpZXM/ZigpOihyPWEuQihmLG51bGwse3lhOm0saTohMH0pLHIuY2EoKSYmKGwuUT1yLHIuZXF1YWxpdHlDb21wYXJlcj1udWxsLGg9W10sci5EYz1mdW5jdGlvbihiKXtoLnB1c2goYik7YS5hLkcucWEoYixmdW5jdGlvbihiKXthLmEuTmEoaCxiKTtoLmxlbmd0aHx8KHIuaygpLGwuUT1yPW4pfSl9KSl9O2EuUi5wcm90b3R5cGUuY3JlYXRlQ2hpbGRDb250ZXh0PWZ1bmN0aW9uKGIsYyxkLGUpe3JldHVybiBuZXcgYS5SKGIsdGhpcyxjLGZ1bmN0aW9uKGEsYil7YS4kcGFyZW50Q29udGV4dD1iO2EuJHBhcmVudD1iLiRkYXRhO2EuJHBhcmVudHM9KGIuJHBhcmVudHN8fFtdKS5zbGljZSgwKTthLiRwYXJlbnRzLnVuc2hpZnQoYS4kcGFyZW50KTtcclxuICAgICAgICBkJiZkKGEpfSxlKX07YS5SLnByb3RvdHlwZS5leHRlbmQ9ZnVuY3Rpb24oYil7cmV0dXJuIG5ldyBhLlIodGhpcy5RfHx0aGlzLiRkYXRhLHRoaXMsbnVsbCxmdW5jdGlvbihjLGQpe2MuJHJhd0RhdGE9ZC4kcmF3RGF0YTthLmEuZXh0ZW5kKGMsXCJmdW5jdGlvblwiPT10eXBlb2YgYj9iKCk6Yil9KX07YS5SLnByb3RvdHlwZS5hYz1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmNyZWF0ZUNoaWxkQ29udGV4dChhLGIsbnVsbCx7ZXhwb3J0RGVwZW5kZW5jaWVzOiEwfSl9O3ZhciBxPWEuYS5lLkooKSxwPWEuYS5lLkooKTthLnhjPWZ1bmN0aW9uKGIsYyl7aWYoMj09YXJndW1lbnRzLmxlbmd0aClhLmEuZS5zZXQoYixwLGMpLGMuUSYmYy5RLkRjKGIpO2Vsc2UgcmV0dXJuIGEuYS5lLmdldChiLHApfTthLkxhPWZ1bmN0aW9uKGIsYyxkKXsxPT09Yi5ub2RlVHlwZSYmYS5mLm9jKGIpO3JldHVybiBtKGIsYyxrKGQpLCEwKX07YS5JYz1mdW5jdGlvbihiLGMsZCl7ZD1rKGQpO3JldHVybiBhLkxhKGIsXHJcbiAgICAgICAgZShjLGQsYiksZCl9O2EuaGI9ZnVuY3Rpb24oYSxiKXsxIT09Yi5ub2RlVHlwZSYmOCE9PWIubm9kZVR5cGV8fGcoayhhKSxiLCEwKX07YS5VYj1mdW5jdGlvbihhLGIpeyF1JiZ4LmpRdWVyeSYmKHU9eC5qUXVlcnkpO2lmKGImJjEhPT1iLm5vZGVUeXBlJiY4IT09Yi5ub2RlVHlwZSl0aHJvdyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3M6IGZpcnN0IHBhcmFtZXRlciBzaG91bGQgYmUgeW91ciB2aWV3IG1vZGVsOyBzZWNvbmQgcGFyYW1ldGVyIHNob3VsZCBiZSBhIERPTSBub2RlXCIpO2I9Ynx8eC5kb2N1bWVudC5ib2R5O2goayhhKSxiLCEwKX07YS5uYj1mdW5jdGlvbihiKXtzd2l0Y2goYi5ub2RlVHlwZSl7Y2FzZSAxOmNhc2UgODp2YXIgYz1hLnhjKGIpO2lmKGMpcmV0dXJuIGM7aWYoYi5wYXJlbnROb2RlKXJldHVybiBhLm5iKGIucGFyZW50Tm9kZSl9cmV0dXJuIG59O2EuT2M9ZnVuY3Rpb24oYil7cmV0dXJuKGI9YS5uYihiKSk/Yi4kZGF0YTpufTthLmIoXCJiaW5kaW5nSGFuZGxlcnNcIixcclxuICAgICAgICBhLmQpO2EuYihcImFwcGx5QmluZGluZ3NcIixhLlViKTthLmIoXCJhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50c1wiLGEuaGIpO2EuYihcImFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZVwiLGEuTGEpO2EuYihcImFwcGx5QmluZGluZ3NUb05vZGVcIixhLkljKTthLmIoXCJjb250ZXh0Rm9yXCIsYS5uYik7YS5iKFwiZGF0YUZvclwiLGEuT2MpfSkoKTsoZnVuY3Rpb24oYil7ZnVuY3Rpb24gYyhjLGUpe3ZhciBtPWYuaGFzT3duUHJvcGVydHkoYyk/ZltjXTpiLGs7bT9tLlkoZSk6KG09ZltjXT1uZXcgYS5LLG0uWShlKSxkKGMsZnVuY3Rpb24oYixkKXt2YXIgZT0hKCFkfHwhZC5zeW5jaHJvbm91cyk7Z1tjXT17ZGVmaW5pdGlvbjpiLGRkOmV9O2RlbGV0ZSBmW2NdO2t8fGU/bS5ub3RpZnlTdWJzY3JpYmVycyhiKTphLlouWmEoZnVuY3Rpb24oKXttLm5vdGlmeVN1YnNjcmliZXJzKGIpfSl9KSxrPSEwKX1mdW5jdGlvbiBkKGEsYil7ZShcImdldENvbmZpZ1wiLFthXSxmdW5jdGlvbihjKXtjP2UoXCJsb2FkQ29tcG9uZW50XCIsXHJcbiAgICAgICAgW2EsY10sZnVuY3Rpb24oYSl7YihhLGMpfSk6YihudWxsLG51bGwpfSl9ZnVuY3Rpb24gZShjLGQsZixrKXtrfHwoaz1hLmcubG9hZGVycy5zbGljZSgwKSk7dmFyIGc9ay5zaGlmdCgpO2lmKGcpe3ZhciBxPWdbY107aWYocSl7dmFyIHA9ITE7aWYocS5hcHBseShnLGQuY29uY2F0KGZ1bmN0aW9uKGEpe3A/ZihudWxsKTpudWxsIT09YT9mKGEpOmUoYyxkLGYsayl9KSkhPT1iJiYocD0hMCwhZy5zdXBwcmVzc0xvYWRlckV4Y2VwdGlvbnMpKXRocm93IEVycm9yKFwiQ29tcG9uZW50IGxvYWRlcnMgbXVzdCBzdXBwbHkgdmFsdWVzIGJ5IGludm9raW5nIHRoZSBjYWxsYmFjaywgbm90IGJ5IHJldHVybmluZyB2YWx1ZXMgc3luY2hyb25vdXNseS5cIik7fWVsc2UgZShjLGQsZixrKX1lbHNlIGYobnVsbCl9dmFyIGY9e30sZz17fTthLmc9e2dldDpmdW5jdGlvbihkLGUpe3ZhciBmPWcuaGFzT3duUHJvcGVydHkoZCk/Z1tkXTpiO2Y/Zi5kZD9hLmwudyhmdW5jdGlvbigpe2UoZi5kZWZpbml0aW9uKX0pOlxyXG4gICAgICAgIGEuWi5aYShmdW5jdGlvbigpe2UoZi5kZWZpbml0aW9uKX0pOmMoZCxlKX0sJGI6ZnVuY3Rpb24oYSl7ZGVsZXRlIGdbYV19LE5iOmV9O2EuZy5sb2FkZXJzPVtdO2EuYihcImNvbXBvbmVudHNcIixhLmcpO2EuYihcImNvbXBvbmVudHMuZ2V0XCIsYS5nLmdldCk7YS5iKFwiY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb25cIixhLmcuJGIpfSkoKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsYyxkLGUpe2Z1bmN0aW9uIGcoKXswPT09LS15JiZlKGgpfXZhciBoPXt9LHk9Mix2PWQudGVtcGxhdGU7ZD1kLnZpZXdNb2RlbDt2P2YoYyx2LGZ1bmN0aW9uKGMpe2EuZy5OYihcImxvYWRUZW1wbGF0ZVwiLFtiLGNdLGZ1bmN0aW9uKGEpe2gudGVtcGxhdGU9YTtnKCl9KX0pOmcoKTtkP2YoYyxkLGZ1bmN0aW9uKGMpe2EuZy5OYihcImxvYWRWaWV3TW9kZWxcIixbYixjXSxmdW5jdGlvbihhKXtoW2xdPWE7ZygpfSl9KTpnKCl9ZnVuY3Rpb24gYyhhLGIsZCl7aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGIpZChmdW5jdGlvbihhKXtyZXR1cm4gbmV3IGIoYSl9KTtcclxuICAgIGVsc2UgaWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGJbbF0pZChiW2xdKTtlbHNlIGlmKFwiaW5zdGFuY2VcImluIGIpe3ZhciBlPWIuaW5zdGFuY2U7ZChmdW5jdGlvbigpe3JldHVybiBlfSl9ZWxzZVwidmlld01vZGVsXCJpbiBiP2MoYSxiLnZpZXdNb2RlbCxkKTphKFwiVW5rbm93biB2aWV3TW9kZWwgdmFsdWU6IFwiK2IpfWZ1bmN0aW9uIGQoYil7c3dpdGNoKGEuYS5BKGIpKXtjYXNlIFwic2NyaXB0XCI6cmV0dXJuIGEuYS5uYShiLnRleHQpO2Nhc2UgXCJ0ZXh0YXJlYVwiOnJldHVybiBhLmEubmEoYi52YWx1ZSk7Y2FzZSBcInRlbXBsYXRlXCI6aWYoZShiLmNvbnRlbnQpKXJldHVybiBhLmEud2EoYi5jb250ZW50LmNoaWxkTm9kZXMpfXJldHVybiBhLmEud2EoYi5jaGlsZE5vZGVzKX1mdW5jdGlvbiBlKGEpe3JldHVybiB4LkRvY3VtZW50RnJhZ21lbnQ/YSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQ6YSYmMTE9PT1hLm5vZGVUeXBlfWZ1bmN0aW9uIGYoYSxiLGMpe1wic3RyaW5nXCI9PT10eXBlb2YgYi5yZXF1aXJlP1xyXG4gICAgICAgIE98fHgucmVxdWlyZT8oT3x8eC5yZXF1aXJlKShbYi5yZXF1aXJlXSxjKTphKFwiVXNlcyByZXF1aXJlLCBidXQgbm8gQU1EIGxvYWRlciBpcyBwcmVzZW50XCIpOmMoYil9ZnVuY3Rpb24gZyhhKXtyZXR1cm4gZnVuY3Rpb24oYil7dGhyb3cgRXJyb3IoXCJDb21wb25lbnQgJ1wiK2ErXCInOiBcIitiKTt9fXZhciBoPXt9O2EuZy5yZWdpc3Rlcj1mdW5jdGlvbihiLGMpe2lmKCFjKXRocm93IEVycm9yKFwiSW52YWxpZCBjb25maWd1cmF0aW9uIGZvciBcIitiKTtpZihhLmcud2IoYikpdGhyb3cgRXJyb3IoXCJDb21wb25lbnQgXCIrYitcIiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRcIik7aFtiXT1jfTthLmcud2I9ZnVuY3Rpb24oYSl7cmV0dXJuIGguaGFzT3duUHJvcGVydHkoYSl9O2EuZy51ZD1mdW5jdGlvbihiKXtkZWxldGUgaFtiXTthLmcuJGIoYil9O2EuZy5jYz17Z2V0Q29uZmlnOmZ1bmN0aW9uKGEsYil7YihoLmhhc093blByb3BlcnR5KGEpP2hbYV06bnVsbCl9LGxvYWRDb21wb25lbnQ6ZnVuY3Rpb24oYSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMsZCl7dmFyIGU9ZyhhKTtmKGUsYyxmdW5jdGlvbihjKXtiKGEsZSxjLGQpfSl9LGxvYWRUZW1wbGF0ZTpmdW5jdGlvbihiLGMsZil7Yj1nKGIpO2lmKFwic3RyaW5nXCI9PT10eXBlb2YgYylmKGEuYS5uYShjKSk7ZWxzZSBpZihjIGluc3RhbmNlb2YgQXJyYXkpZihjKTtlbHNlIGlmKGUoYykpZihhLmEuVyhjLmNoaWxkTm9kZXMpKTtlbHNlIGlmKGMuZWxlbWVudClpZihjPWMuZWxlbWVudCx4LkhUTUxFbGVtZW50P2MgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDpjJiZjLnRhZ05hbWUmJjE9PT1jLm5vZGVUeXBlKWYoZChjKSk7ZWxzZSBpZihcInN0cmluZ1wiPT09dHlwZW9mIGMpe3ZhciBsPXQuZ2V0RWxlbWVudEJ5SWQoYyk7bD9mKGQobCkpOmIoXCJDYW5ub3QgZmluZCBlbGVtZW50IHdpdGggSUQgXCIrYyl9ZWxzZSBiKFwiVW5rbm93biBlbGVtZW50IHR5cGU6IFwiK2MpO2Vsc2UgYihcIlVua25vd24gdGVtcGxhdGUgdmFsdWU6IFwiK2MpfSxsb2FkVmlld01vZGVsOmZ1bmN0aW9uKGEsYixkKXtjKGcoYSksXHJcbiAgICAgICAgYixkKX19O3ZhciBsPVwiY3JlYXRlVmlld01vZGVsXCI7YS5iKFwiY29tcG9uZW50cy5yZWdpc3RlclwiLGEuZy5yZWdpc3Rlcik7YS5iKFwiY29tcG9uZW50cy5pc1JlZ2lzdGVyZWRcIixhLmcud2IpO2EuYihcImNvbXBvbmVudHMudW5yZWdpc3RlclwiLGEuZy51ZCk7YS5iKFwiY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyXCIsYS5nLmNjKTthLmcubG9hZGVycy5wdXNoKGEuZy5jYyk7YS5nLkVjPWh9KSgpOyhmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixlKXt2YXIgZj1iLmdldEF0dHJpYnV0ZShcInBhcmFtc1wiKTtpZihmKXt2YXIgZj1jLnBhcnNlQmluZGluZ3NTdHJpbmcoZixlLGIse3ZhbHVlQWNjZXNzb3JzOiEwLGJpbmRpbmdQYXJhbXM6ITB9KSxmPWEuYS5FYShmLGZ1bmN0aW9uKGMpe3JldHVybiBhLm0oYyxudWxsLHtpOmJ9KX0pLGc9YS5hLkVhKGYsZnVuY3Rpb24oYyl7dmFyIGU9Yy5wKCk7cmV0dXJuIGMuY2EoKT9hLm0oe3JlYWQ6ZnVuY3Rpb24oKXtyZXR1cm4gYS5hLmMoYygpKX0sd3JpdGU6YS5EYShlKSYmXHJcbiAgICBmdW5jdGlvbihhKXtjKCkoYSl9LGk6Yn0pOmV9KTtnLmhhc093blByb3BlcnR5KFwiJHJhd1wiKXx8KGcuJHJhdz1mKTtyZXR1cm4gZ31yZXR1cm57JHJhdzp7fX19YS5nLmdldENvbXBvbmVudE5hbWVGb3JOb2RlPWZ1bmN0aW9uKGIpe3ZhciBjPWEuYS5BKGIpO2lmKGEuZy53YihjKSYmKC0xIT1jLmluZGV4T2YoXCItXCIpfHxcIltvYmplY3QgSFRNTFVua25vd25FbGVtZW50XVwiPT1cIlwiK2J8fDg+PWEuYS5DJiZiLnRhZ05hbWU9PT1jKSlyZXR1cm4gY307YS5nLlJiPWZ1bmN0aW9uKGMsZSxmLGcpe2lmKDE9PT1lLm5vZGVUeXBlKXt2YXIgaD1hLmcuZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUoZSk7aWYoaCl7Yz1jfHx7fTtpZihjLmNvbXBvbmVudCl0aHJvdyBFcnJvcignQ2Fubm90IHVzZSB0aGUgXCJjb21wb25lbnRcIiBiaW5kaW5nIG9uIGEgY3VzdG9tIGVsZW1lbnQgbWF0Y2hpbmcgYSBjb21wb25lbnQnKTt2YXIgbD17bmFtZTpoLHBhcmFtczpiKGUsZil9O2MuY29tcG9uZW50PWc/ZnVuY3Rpb24oKXtyZXR1cm4gbH06XHJcbiAgICAgICAgbH19cmV0dXJuIGN9O3ZhciBjPW5ldyBhLlM7OT5hLmEuQyYmKGEuZy5yZWdpc3Rlcj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7dC5jcmVhdGVFbGVtZW50KGIpO3JldHVybiBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KGEuZy5yZWdpc3RlciksdC5jcmVhdGVEb2N1bWVudEZyYWdtZW50PWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbigpe3ZhciBjPWIoKSxmPWEuZy5FYyxnO2ZvcihnIGluIGYpZi5oYXNPd25Qcm9wZXJ0eShnKSYmYy5jcmVhdGVFbGVtZW50KGcpO3JldHVybiBjfX0odC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KSl9KSgpOyhmdW5jdGlvbihiKXtmdW5jdGlvbiBjKGIsYyxkKXtjPWMudGVtcGxhdGU7aWYoIWMpdGhyb3cgRXJyb3IoXCJDb21wb25lbnQgJ1wiK2IrXCInIGhhcyBubyB0ZW1wbGF0ZVwiKTtiPWEuYS53YShjKTthLmYuZmEoZCxiKX1mdW5jdGlvbiBkKGEsYixjLGQpe3ZhciBlPWEuY3JlYXRlVmlld01vZGVsO3JldHVybiBlP2UuY2FsbChhLFxyXG4gICAgICAgIGQse2VsZW1lbnQ6Yix0ZW1wbGF0ZU5vZGVzOmN9KTpkfXZhciBlPTA7YS5kLmNvbXBvbmVudD17aW5pdDpmdW5jdGlvbihmLGcsaCxsLG0pe2Z1bmN0aW9uIGsoKXt2YXIgYT1yJiZyLmRpc3Bvc2U7XCJmdW5jdGlvblwiPT09dHlwZW9mIGEmJmEuY2FsbChyKTtxPXI9bnVsbH12YXIgcixxLHA9YS5hLlcoYS5mLmNoaWxkTm9kZXMoZikpO2EuYS5HLnFhKGYsayk7YS5tKGZ1bmN0aW9uKCl7dmFyIGw9YS5hLmMoZygpKSxoLHY7XCJzdHJpbmdcIj09PXR5cGVvZiBsP2g9bDooaD1hLmEuYyhsLm5hbWUpLHY9YS5hLmMobC5wYXJhbXMpKTtpZighaCl0aHJvdyBFcnJvcihcIk5vIGNvbXBvbmVudCBuYW1lIHNwZWNpZmllZFwiKTt2YXIgbj1xPSsrZTthLmcuZ2V0KGgsZnVuY3Rpb24oZSl7aWYocT09PW4pe2soKTtpZighZSl0aHJvdyBFcnJvcihcIlVua25vd24gY29tcG9uZW50ICdcIitoK1wiJ1wiKTtjKGgsZSxmKTt2YXIgbD1kKGUsZixwLHYpO2U9bS5jcmVhdGVDaGlsZENvbnRleHQobCxiLGZ1bmN0aW9uKGEpe2EuJGNvbXBvbmVudD1cclxuICAgICAgICBsO2EuJGNvbXBvbmVudFRlbXBsYXRlTm9kZXM9cH0pO3I9bDthLmhiKGUsZil9fSl9LG51bGwse2k6Zn0pO3JldHVybntjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczohMH19fTthLmYuYWEuY29tcG9uZW50PSEwfSkoKTt2YXIgUT17XCJjbGFzc1wiOlwiY2xhc3NOYW1lXCIsXCJmb3JcIjpcImh0bWxGb3JcIn07YS5kLmF0dHI9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMoKSl8fHt9O2EuYS5EKGQsZnVuY3Rpb24oYyxkKXtkPWEuYS5jKGQpO3ZhciBnPSExPT09ZHx8bnVsbD09PWR8fGQ9PT1uO2cmJmIucmVtb3ZlQXR0cmlidXRlKGMpOzg+PWEuYS5DJiZjIGluIFE/KGM9UVtjXSxnP2IucmVtb3ZlQXR0cmlidXRlKGMpOmJbY109ZCk6Z3x8Yi5zZXRBdHRyaWJ1dGUoYyxkLnRvU3RyaW5nKCkpO1wibmFtZVwiPT09YyYmYS5hLnZjKGIsZz9cIlwiOmQudG9TdHJpbmcoKSl9KX19OyhmdW5jdGlvbigpe2EuZC5jaGVja2VkPXthZnRlcjpbXCJ2YWx1ZVwiLFwiYXR0clwiXSxpbml0OmZ1bmN0aW9uKGIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMsZCl7ZnVuY3Rpb24gZSgpe3ZhciBlPWIuY2hlY2tlZCxmPXA/ZygpOmU7aWYoIWEueGEuVmEoKSYmKCFsfHxlKSl7dmFyIGg9YS5sLncoYyk7aWYoayl7dmFyIG09cj9oLnAoKTpoO3EhPT1mPyhlJiYoYS5hLnJhKG0sZiwhMCksYS5hLnJhKG0scSwhMSkpLHE9Zik6YS5hLnJhKG0sZixlKTtyJiZhLkRhKGgpJiZoKG0pfWVsc2UgYS5oLkdhKGgsZCxcImNoZWNrZWRcIixmLCEwKX19ZnVuY3Rpb24gZigpe3ZhciBkPWEuYS5jKGMoKSk7Yi5jaGVja2VkPWs/MDw9YS5hLm8oZCxnKCkpOmg/ZDpnKCk9PT1kfXZhciBnPWEucmMoZnVuY3Rpb24oKXtyZXR1cm4gZC5oYXMoXCJjaGVja2VkVmFsdWVcIik/YS5hLmMoZC5nZXQoXCJjaGVja2VkVmFsdWVcIikpOmQuaGFzKFwidmFsdWVcIik/YS5hLmMoZC5nZXQoXCJ2YWx1ZVwiKSk6Yi52YWx1ZX0pLGg9XCJjaGVja2JveFwiPT1iLnR5cGUsbD1cInJhZGlvXCI9PWIudHlwZTtpZihofHxsKXt2YXIgbT1jKCksaz1oJiZhLmEuYyhtKWluc3RhbmNlb2YgQXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI9IShrJiZtLnB1c2gmJm0uc3BsaWNlKSxxPWs/ZygpOm4scD1sfHxrO2wmJiFiLm5hbWUmJmEuZC51bmlxdWVOYW1lLmluaXQoYixmdW5jdGlvbigpe3JldHVybiEwfSk7YS5tKGUsbnVsbCx7aTpifSk7YS5hLnEoYixcImNsaWNrXCIsZSk7YS5tKGYsbnVsbCx7aTpifSk7bT1ufX19O2EuaC5nYS5jaGVja2VkPSEwO2EuZC5jaGVja2VkVmFsdWU9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe2IudmFsdWU9YS5hLmMoYygpKX19fSkoKTthLmQuY3NzPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKCkpO251bGwhPT1kJiZcIm9iamVjdFwiPT10eXBlb2YgZD9hLmEuRChkLGZ1bmN0aW9uKGMsZCl7ZD1hLmEuYyhkKTthLmEuZmIoYixjLGQpfSk6KGQ9YS5hLmNiKFN0cmluZyhkfHxcIlwiKSksYS5hLmZiKGIsYi5fX2tvX19jc3NWYWx1ZSwhMSksYi5fX2tvX19jc3NWYWx1ZT1kLGEuYS5mYihiLGQsITApKX19O2EuZC5lbmFibGU9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMoKSk7XHJcbiAgICAgICAgZCYmYi5kaXNhYmxlZD9iLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpOmR8fGIuZGlzYWJsZWR8fChiLmRpc2FibGVkPSEwKX19O2EuZC5kaXNhYmxlPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXthLmQuZW5hYmxlLnVwZGF0ZShiLGZ1bmN0aW9uKCl7cmV0dXJuIWEuYS5jKGMoKSl9KX19O2EuZC5ldmVudD17aW5pdDpmdW5jdGlvbihiLGMsZCxlLGYpe3ZhciBnPWMoKXx8e307YS5hLkQoZyxmdW5jdGlvbihnKXtcInN0cmluZ1wiPT10eXBlb2YgZyYmYS5hLnEoYixnLGZ1bmN0aW9uKGIpe3ZhciBtLGs9YygpW2ddO2lmKGspe3RyeXt2YXIgcj1hLmEuVyhhcmd1bWVudHMpO2U9Zi4kZGF0YTtyLnVuc2hpZnQoZSk7bT1rLmFwcGx5KGUscil9ZmluYWxseXshMCE9PW0mJihiLnByZXZlbnREZWZhdWx0P2IucHJldmVudERlZmF1bHQoKTpiLnJldHVyblZhbHVlPSExKX0hMT09PWQuZ2V0KGcrXCJCdWJibGVcIikmJihiLmNhbmNlbEJ1YmJsZT0hMCxiLnN0b3BQcm9wYWdhdGlvbiYmYi5zdG9wUHJvcGFnYXRpb24oKSl9fSl9KX19O1xyXG4gICAgYS5kLmZvcmVhY2g9e21jOmZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbigpe3ZhciBjPWIoKSxkPWEuYS5CYihjKTtpZighZHx8XCJudW1iZXJcIj09dHlwZW9mIGQubGVuZ3RoKXJldHVybntmb3JlYWNoOmMsdGVtcGxhdGVFbmdpbmU6YS5YLnZifTthLmEuYyhjKTtyZXR1cm57Zm9yZWFjaDpkLmRhdGEsYXM6ZC5hcyxpbmNsdWRlRGVzdHJveWVkOmQuaW5jbHVkZURlc3Ryb3llZCxhZnRlckFkZDpkLmFmdGVyQWRkLGJlZm9yZVJlbW92ZTpkLmJlZm9yZVJlbW92ZSxhZnRlclJlbmRlcjpkLmFmdGVyUmVuZGVyLGJlZm9yZU1vdmU6ZC5iZWZvcmVNb3ZlLGFmdGVyTW92ZTpkLmFmdGVyTW92ZSx0ZW1wbGF0ZUVuZ2luZTphLlgudmJ9fX0saW5pdDpmdW5jdGlvbihiLGMpe3JldHVybiBhLmQudGVtcGxhdGUuaW5pdChiLGEuZC5mb3JlYWNoLm1jKGMpKX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyxkLGUsZil7cmV0dXJuIGEuZC50ZW1wbGF0ZS51cGRhdGUoYixhLmQuZm9yZWFjaC5tYyhjKSxcclxuICAgICAgICBkLGUsZil9fTthLmgudmEuZm9yZWFjaD0hMTthLmYuYWEuZm9yZWFjaD0hMDthLmQuaGFzZm9jdXM9e2luaXQ6ZnVuY3Rpb24oYixjLGQpe2Z1bmN0aW9uIGUoZSl7Yi5fX2tvX2hhc2ZvY3VzVXBkYXRpbmc9ITA7dmFyIGY9Yi5vd25lckRvY3VtZW50O2lmKFwiYWN0aXZlRWxlbWVudFwiaW4gZil7dmFyIGc7dHJ5e2c9Zi5hY3RpdmVFbGVtZW50fWNhdGNoKGspe2c9Zi5ib2R5fWU9Zz09PWJ9Zj1jKCk7YS5oLkdhKGYsZCxcImhhc2ZvY3VzXCIsZSwhMCk7Yi5fX2tvX2hhc2ZvY3VzTGFzdFZhbHVlPWU7Yi5fX2tvX2hhc2ZvY3VzVXBkYXRpbmc9ITF9dmFyIGY9ZS5iaW5kKG51bGwsITApLGc9ZS5iaW5kKG51bGwsITEpO2EuYS5xKGIsXCJmb2N1c1wiLGYpO2EuYS5xKGIsXCJmb2N1c2luXCIsZik7YS5hLnEoYixcImJsdXJcIixnKTthLmEucShiLFwiZm9jdXNvdXRcIixnKX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9ISFhLmEuYyhjKCkpO2IuX19rb19oYXNmb2N1c1VwZGF0aW5nfHxiLl9fa29faGFzZm9jdXNMYXN0VmFsdWU9PT1cclxuICAgIGR8fChkP2IuZm9jdXMoKTpiLmJsdXIoKSwhZCYmYi5fX2tvX2hhc2ZvY3VzTGFzdFZhbHVlJiZiLm93bmVyRG9jdW1lbnQuYm9keS5mb2N1cygpLGEubC53KGEuYS5GYSxudWxsLFtiLGQ/XCJmb2N1c2luXCI6XCJmb2N1c291dFwiXSkpfX07YS5oLmdhLmhhc2ZvY3VzPSEwO2EuZC5oYXNGb2N1cz1hLmQuaGFzZm9jdXM7YS5oLmdhLmhhc0ZvY3VzPSEwO2EuZC5odG1sPXtpbml0OmZ1bmN0aW9uKCl7cmV0dXJue2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiEwfX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyl7YS5hLkViKGIsYygpKX19O0soXCJpZlwiKTtLKFwiaWZub3RcIiwhMSwhMCk7SyhcIndpdGhcIiwhMCwhMSxmdW5jdGlvbihhLGMpe3JldHVybiBhLmFjKGMpfSk7dmFyIEw9e307YS5kLm9wdGlvbnM9e2luaXQ6ZnVuY3Rpb24oYil7aWYoXCJzZWxlY3RcIiE9PWEuYS5BKGIpKXRocm93IEVycm9yKFwib3B0aW9ucyBiaW5kaW5nIGFwcGxpZXMgb25seSB0byBTRUxFQ1QgZWxlbWVudHNcIik7Zm9yKDswPFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLmxlbmd0aDspYi5yZW1vdmUoMCk7cmV0dXJue2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiEwfX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyxkKXtmdW5jdGlvbiBlKCl7cmV0dXJuIGEuYS5NYShiLm9wdGlvbnMsZnVuY3Rpb24oYSl7cmV0dXJuIGEuc2VsZWN0ZWR9KX1mdW5jdGlvbiBmKGEsYixjKXt2YXIgZD10eXBlb2YgYjtyZXR1cm5cImZ1bmN0aW9uXCI9PWQ/YihhKTpcInN0cmluZ1wiPT1kP2FbYl06Y31mdW5jdGlvbiBnKGMsZSl7aWYoQSYmaylhLmouamEoYixhLmEuYyhkLmdldChcInZhbHVlXCIpKSwhMCk7ZWxzZSBpZihwLmxlbmd0aCl7dmFyIGY9MDw9YS5hLm8ocCxhLmoudShlWzBdKSk7YS5hLndjKGVbMF0sZik7QSYmIWYmJmEubC53KGEuYS5GYSxudWxsLFtiLFwiY2hhbmdlXCJdKX19dmFyIGg9Yi5tdWx0aXBsZSxsPTAhPWIubGVuZ3RoJiZoP2Iuc2Nyb2xsVG9wOm51bGwsbT1hLmEuYyhjKCkpLGs9ZC5nZXQoXCJ2YWx1ZUFsbG93VW5zZXRcIikmJmQuaGFzKFwidmFsdWVcIikscj1cclxuICAgICAgICBkLmdldChcIm9wdGlvbnNJbmNsdWRlRGVzdHJveWVkXCIpO2M9e307dmFyIHEscD1bXTtrfHwoaD9wPWEuYS5pYihlKCksYS5qLnUpOjA8PWIuc2VsZWN0ZWRJbmRleCYmcC5wdXNoKGEuai51KGIub3B0aW9uc1tiLnNlbGVjdGVkSW5kZXhdKSkpO20mJihcInVuZGVmaW5lZFwiPT10eXBlb2YgbS5sZW5ndGgmJihtPVttXSkscT1hLmEuTWEobSxmdW5jdGlvbihiKXtyZXR1cm4gcnx8Yj09PW58fG51bGw9PT1ifHwhYS5hLmMoYi5fZGVzdHJveSl9KSxkLmhhcyhcIm9wdGlvbnNDYXB0aW9uXCIpJiYobT1hLmEuYyhkLmdldChcIm9wdGlvbnNDYXB0aW9uXCIpKSxudWxsIT09bSYmbSE9PW4mJnEudW5zaGlmdChMKSkpO3ZhciBBPSExO2MuYmVmb3JlUmVtb3ZlPWZ1bmN0aW9uKGEpe2IucmVtb3ZlQ2hpbGQoYSl9O209ZztkLmhhcyhcIm9wdGlvbnNBZnRlclJlbmRlclwiKSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZC5nZXQoXCJvcHRpb25zQWZ0ZXJSZW5kZXJcIikmJihtPWZ1bmN0aW9uKGIsYyl7ZygwLGMpO1xyXG4gICAgICAgIGEubC53KGQuZ2V0KFwib3B0aW9uc0FmdGVyUmVuZGVyXCIpLG51bGwsW2NbMF0sYiE9PUw/YjpuXSl9KTthLmEuRGIoYixxLGZ1bmN0aW9uKGMsZSxnKXtnLmxlbmd0aCYmKHA9IWsmJmdbMF0uc2VsZWN0ZWQ/W2Euai51KGdbMF0pXTpbXSxBPSEwKTtlPWIub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO2M9PT1MPyhhLmEuYmIoZSxkLmdldChcIm9wdGlvbnNDYXB0aW9uXCIpKSxhLmouamEoZSxuKSk6KGc9ZihjLGQuZ2V0KFwib3B0aW9uc1ZhbHVlXCIpLGMpLGEuai5qYShlLGEuYS5jKGcpKSxjPWYoYyxkLmdldChcIm9wdGlvbnNUZXh0XCIpLGcpLGEuYS5iYihlLGMpKTtyZXR1cm5bZV19LGMsbSk7YS5sLncoZnVuY3Rpb24oKXtrP2Euai5qYShiLGEuYS5jKGQuZ2V0KFwidmFsdWVcIikpLCEwKTooaD9wLmxlbmd0aCYmZSgpLmxlbmd0aDxwLmxlbmd0aDpwLmxlbmd0aCYmMDw9Yi5zZWxlY3RlZEluZGV4P2Euai51KGIub3B0aW9uc1tiLnNlbGVjdGVkSW5kZXhdKSE9PXBbMF06XHJcbiAgICAgICAgcC5sZW5ndGh8fDA8PWIuc2VsZWN0ZWRJbmRleCkmJmEuYS5GYShiLFwiY2hhbmdlXCIpfSk7YS5hLlNjKGIpO2wmJjIwPE1hdGguYWJzKGwtYi5zY3JvbGxUb3ApJiYoYi5zY3JvbGxUb3A9bCl9fTthLmQub3B0aW9ucy56Yj1hLmEuZS5KKCk7YS5kLnNlbGVjdGVkT3B0aW9ucz17YWZ0ZXI6W1wib3B0aW9uc1wiLFwiZm9yZWFjaFwiXSxpbml0OmZ1bmN0aW9uKGIsYyxkKXthLmEucShiLFwiY2hhbmdlXCIsZnVuY3Rpb24oKXt2YXIgZT1jKCksZj1bXTthLmEucihiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwib3B0aW9uXCIpLGZ1bmN0aW9uKGIpe2Iuc2VsZWN0ZWQmJmYucHVzaChhLmoudShiKSl9KTthLmguR2EoZSxkLFwic2VsZWN0ZWRPcHRpb25zXCIsZil9KX0sdXBkYXRlOmZ1bmN0aW9uKGIsYyl7aWYoXCJzZWxlY3RcIiE9YS5hLkEoYikpdGhyb3cgRXJyb3IoXCJ2YWx1ZXMgYmluZGluZyBhcHBsaWVzIG9ubHkgdG8gU0VMRUNUIGVsZW1lbnRzXCIpO3ZhciBkPWEuYS5jKGMoKSksZT1iLnNjcm9sbFRvcDtcclxuICAgICAgICBkJiZcIm51bWJlclwiPT10eXBlb2YgZC5sZW5ndGgmJmEuYS5yKGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvcHRpb25cIiksZnVuY3Rpb24oYil7dmFyIGM9MDw9YS5hLm8oZCxhLmoudShiKSk7Yi5zZWxlY3RlZCE9YyYmYS5hLndjKGIsYyl9KTtiLnNjcm9sbFRvcD1lfX07YS5oLmdhLnNlbGVjdGVkT3B0aW9ucz0hMDthLmQuc3R5bGU9e3VwZGF0ZTpmdW5jdGlvbihiLGMpe3ZhciBkPWEuYS5jKGMoKXx8e30pO2EuYS5EKGQsZnVuY3Rpb24oYyxkKXtkPWEuYS5jKGQpO2lmKG51bGw9PT1kfHxkPT09bnx8ITE9PT1kKWQ9XCJcIjtiLnN0eWxlW2NdPWR9KX19O2EuZC5zdWJtaXQ9e2luaXQ6ZnVuY3Rpb24oYixjLGQsZSxmKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBjKCkpdGhyb3cgRXJyb3IoXCJUaGUgdmFsdWUgZm9yIGEgc3VibWl0IGJpbmRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO2EuYS5xKGIsXCJzdWJtaXRcIixmdW5jdGlvbihhKXt2YXIgZCxlPWMoKTt0cnl7ZD1lLmNhbGwoZi4kZGF0YSxcclxuICAgICAgICBiKX1maW5hbGx5eyEwIT09ZCYmKGEucHJldmVudERlZmF1bHQ/YS5wcmV2ZW50RGVmYXVsdCgpOmEucmV0dXJuVmFsdWU9ITEpfX0pfX07YS5kLnRleHQ9e2luaXQ6ZnVuY3Rpb24oKXtyZXR1cm57Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6ITB9fSx1cGRhdGU6ZnVuY3Rpb24oYixjKXthLmEuYmIoYixjKCkpfX07YS5mLmFhLnRleHQ9ITA7KGZ1bmN0aW9uKCl7aWYoeCYmeC5uYXZpZ2F0b3IpdmFyIGI9ZnVuY3Rpb24oYSl7aWYoYSlyZXR1cm4gcGFyc2VGbG9hdChhWzFdKX0sYz14Lm9wZXJhJiZ4Lm9wZXJhLnZlcnNpb24mJnBhcnNlSW50KHgub3BlcmEudmVyc2lvbigpKSxkPXgubmF2aWdhdG9yLnVzZXJBZ2VudCxlPWIoZC5tYXRjaCgvXig/Oig/IWNocm9tZSkuKSp2ZXJzaW9uXFwvKFteIF0qKSBzYWZhcmkvaSkpLGY9YihkLm1hdGNoKC9GaXJlZm94XFwvKFteIF0qKS8pKTtpZigxMD5hLmEuQyl2YXIgZz1hLmEuZS5KKCksaD1hLmEuZS5KKCksbD1mdW5jdGlvbihiKXt2YXIgYz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUVsZW1lbnQ7KGM9YyYmYS5hLmUuZ2V0KGMsaCkpJiZjKGIpfSxtPWZ1bmN0aW9uKGIsYyl7dmFyIGQ9Yi5vd25lckRvY3VtZW50O2EuYS5lLmdldChkLGcpfHwoYS5hLmUuc2V0KGQsZywhMCksYS5hLnEoZCxcInNlbGVjdGlvbmNoYW5nZVwiLGwpKTthLmEuZS5zZXQoYixoLGMpfTthLmQudGV4dElucHV0PXtpbml0OmZ1bmN0aW9uKGIsZCxnKXtmdW5jdGlvbiBsKGMsZCl7YS5hLnEoYixjLGQpfWZ1bmN0aW9uIGgoKXt2YXIgYz1hLmEuYyhkKCkpO2lmKG51bGw9PT1jfHxjPT09biljPVwiXCI7dSE9PW4mJmM9PT11P2EuYS5zZXRUaW1lb3V0KGgsNCk6Yi52YWx1ZSE9PWMmJihzPWMsYi52YWx1ZT1jKX1mdW5jdGlvbiB5KCl7dHx8KHU9Yi52YWx1ZSx0PWEuYS5zZXRUaW1lb3V0KHYsNCkpfWZ1bmN0aW9uIHYoKXtjbGVhclRpbWVvdXQodCk7dT10PW47dmFyIGM9Yi52YWx1ZTtzIT09YyYmKHM9YyxhLmguR2EoZCgpLGcsXCJ0ZXh0SW5wdXRcIixjKSl9dmFyIHM9Yi52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQsdSx4PTk9PWEuYS5DP3k6djsxMD5hLmEuQz8obChcInByb3BlcnR5Y2hhbmdlXCIsZnVuY3Rpb24oYSl7XCJ2YWx1ZVwiPT09YS5wcm9wZXJ0eU5hbWUmJngoYSl9KSw4PT1hLmEuQyYmKGwoXCJrZXl1cFwiLHYpLGwoXCJrZXlkb3duXCIsdikpLDg8PWEuYS5DJiYobShiLHgpLGwoXCJkcmFnZW5kXCIseSkpKToobChcImlucHV0XCIsdiksNT5lJiZcInRleHRhcmVhXCI9PT1hLmEuQShiKT8obChcImtleWRvd25cIix5KSxsKFwicGFzdGVcIix5KSxsKFwiY3V0XCIseSkpOjExPmM/bChcImtleWRvd25cIix5KTo0PmYmJihsKFwiRE9NQXV0b0NvbXBsZXRlXCIsdiksbChcImRyYWdkcm9wXCIsdiksbChcImRyb3BcIix2KSkpO2woXCJjaGFuZ2VcIix2KTthLm0oaCxudWxsLHtpOmJ9KX19O2EuaC5nYS50ZXh0SW5wdXQ9ITA7YS5kLnRleHRpbnB1dD17cHJlcHJvY2VzczpmdW5jdGlvbihhLGIsYyl7YyhcInRleHRJbnB1dFwiLGEpfX19KSgpO2EuZC51bmlxdWVOYW1lPXtpbml0OmZ1bmN0aW9uKGIsYyl7aWYoYygpKXt2YXIgZD1cImtvX3VuaXF1ZV9cIitcclxuICAgICAgICArK2EuZC51bmlxdWVOYW1lLk5jO2EuYS52YyhiLGQpfX19O2EuZC51bmlxdWVOYW1lLk5jPTA7YS5kLnZhbHVlPXthZnRlcjpbXCJvcHRpb25zXCIsXCJmb3JlYWNoXCJdLGluaXQ6ZnVuY3Rpb24oYixjLGQpe2lmKFwiaW5wdXRcIiE9Yi50YWdOYW1lLnRvTG93ZXJDYXNlKCl8fFwiY2hlY2tib3hcIiE9Yi50eXBlJiZcInJhZGlvXCIhPWIudHlwZSl7dmFyIGU9W1wiY2hhbmdlXCJdLGY9ZC5nZXQoXCJ2YWx1ZVVwZGF0ZVwiKSxnPSExLGg9bnVsbDtmJiYoXCJzdHJpbmdcIj09dHlwZW9mIGYmJihmPVtmXSksYS5hLnRhKGUsZiksZT1hLmEuV2IoZSkpO3ZhciBsPWZ1bmN0aW9uKCl7aD1udWxsO2c9ITE7dmFyIGU9YygpLGY9YS5qLnUoYik7YS5oLkdhKGUsZCxcInZhbHVlXCIsZil9OyFhLmEuQ3x8XCJpbnB1dFwiIT1iLnRhZ05hbWUudG9Mb3dlckNhc2UoKXx8XCJ0ZXh0XCIhPWIudHlwZXx8XCJvZmZcIj09Yi5hdXRvY29tcGxldGV8fGIuZm9ybSYmXCJvZmZcIj09Yi5mb3JtLmF1dG9jb21wbGV0ZXx8LTEhPWEuYS5vKGUsXCJwcm9wZXJ0eWNoYW5nZVwiKXx8XHJcbiAgICAoYS5hLnEoYixcInByb3BlcnR5Y2hhbmdlXCIsZnVuY3Rpb24oKXtnPSEwfSksYS5hLnEoYixcImZvY3VzXCIsZnVuY3Rpb24oKXtnPSExfSksYS5hLnEoYixcImJsdXJcIixmdW5jdGlvbigpe2cmJmwoKX0pKTthLmEucihlLGZ1bmN0aW9uKGMpe3ZhciBkPWw7YS5hLnNkKGMsXCJhZnRlclwiKSYmKGQ9ZnVuY3Rpb24oKXtoPWEuai51KGIpO2EuYS5zZXRUaW1lb3V0KGwsMCl9LGM9Yy5zdWJzdHJpbmcoNSkpO2EuYS5xKGIsYyxkKX0pO3ZhciBtPWZ1bmN0aW9uKCl7dmFyIGU9YS5hLmMoYygpKSxmPWEuai51KGIpO2lmKG51bGwhPT1oJiZlPT09aClhLmEuc2V0VGltZW91dChtLDApO2Vsc2UgaWYoZSE9PWYpaWYoXCJzZWxlY3RcIj09PWEuYS5BKGIpKXt2YXIgZz1kLmdldChcInZhbHVlQWxsb3dVbnNldFwiKSxmPWZ1bmN0aW9uKCl7YS5qLmphKGIsZSxnKX07ZigpO2d8fGU9PT1hLmoudShiKT9hLmEuc2V0VGltZW91dChmLDApOmEubC53KGEuYS5GYSxudWxsLFtiLFwiY2hhbmdlXCJdKX1lbHNlIGEuai5qYShiLFxyXG4gICAgICAgIGUpfTthLm0obSxudWxsLHtpOmJ9KX1lbHNlIGEuTGEoYix7Y2hlY2tlZFZhbHVlOmN9KX0sdXBkYXRlOmZ1bmN0aW9uKCl7fX07YS5oLmdhLnZhbHVlPSEwO2EuZC52aXNpYmxlPXt1cGRhdGU6ZnVuY3Rpb24oYixjKXt2YXIgZD1hLmEuYyhjKCkpLGU9XCJub25lXCIhPWIuc3R5bGUuZGlzcGxheTtkJiYhZT9iLnN0eWxlLmRpc3BsYXk9XCJcIjohZCYmZSYmKGIuc3R5bGUuZGlzcGxheT1cIm5vbmVcIil9fTsoZnVuY3Rpb24oYil7YS5kW2JdPXtpbml0OmZ1bmN0aW9uKGMsZCxlLGYsZyl7cmV0dXJuIGEuZC5ldmVudC5pbml0LmNhbGwodGhpcyxjLGZ1bmN0aW9uKCl7dmFyIGE9e307YVtiXT1kKCk7cmV0dXJuIGF9LGUsZixnKX19fSkoXCJjbGlja1wiKTthLlA9ZnVuY3Rpb24oKXt9O2EuUC5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGVTb3VyY2U9ZnVuY3Rpb24oKXt0aHJvdyBFcnJvcihcIk92ZXJyaWRlIHJlbmRlclRlbXBsYXRlU291cmNlXCIpO307YS5QLnByb3RvdHlwZS5jcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2s9XHJcbiAgICAgICAgZnVuY3Rpb24oKXt0aHJvdyBFcnJvcihcIk92ZXJyaWRlIGNyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9ja1wiKTt9O2EuUC5wcm90b3R5cGUubWFrZVRlbXBsYXRlU291cmNlPWZ1bmN0aW9uKGIsYyl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe2M9Y3x8dDt2YXIgZD1jLmdldEVsZW1lbnRCeUlkKGIpO2lmKCFkKXRocm93IEVycm9yKFwiQ2Fubm90IGZpbmQgdGVtcGxhdGUgd2l0aCBJRCBcIitiKTtyZXR1cm4gbmV3IGEudi5uKGQpfWlmKDE9PWIubm9kZVR5cGV8fDg9PWIubm9kZVR5cGUpcmV0dXJuIG5ldyBhLnYuc2EoYik7dGhyb3cgRXJyb3IoXCJVbmtub3duIHRlbXBsYXRlIHR5cGU6IFwiK2IpO307YS5QLnByb3RvdHlwZS5yZW5kZXJUZW1wbGF0ZT1mdW5jdGlvbihhLGMsZCxlKXthPXRoaXMubWFrZVRlbXBsYXRlU291cmNlKGEsZSk7cmV0dXJuIHRoaXMucmVuZGVyVGVtcGxhdGVTb3VyY2UoYSxjLGQsZSl9O2EuUC5wcm90b3R5cGUuaXNUZW1wbGF0ZVJld3JpdHRlbj1mdW5jdGlvbihhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMpe3JldHVybiExPT09dGhpcy5hbGxvd1RlbXBsYXRlUmV3cml0aW5nPyEwOnRoaXMubWFrZVRlbXBsYXRlU291cmNlKGEsYykuZGF0YShcImlzUmV3cml0dGVuXCIpfTthLlAucHJvdG90eXBlLnJld3JpdGVUZW1wbGF0ZT1mdW5jdGlvbihhLGMsZCl7YT10aGlzLm1ha2VUZW1wbGF0ZVNvdXJjZShhLGQpO2M9YyhhLnRleHQoKSk7YS50ZXh0KGMpO2EuZGF0YShcImlzUmV3cml0dGVuXCIsITApfTthLmIoXCJ0ZW1wbGF0ZUVuZ2luZVwiLGEuUCk7YS5JYj1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixjLGQsaCl7Yj1hLmguQWIoYik7Zm9yKHZhciBsPWEuaC52YSxtPTA7bTxiLmxlbmd0aDttKyspe3ZhciBrPWJbbV0ua2V5O2lmKGwuaGFzT3duUHJvcGVydHkoaykpe3ZhciByPWxba107aWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIHIpe2lmKGs9cihiW21dLnZhbHVlKSl0aHJvdyBFcnJvcihrKTt9ZWxzZSBpZighcil0aHJvdyBFcnJvcihcIlRoaXMgdGVtcGxhdGUgZW5naW5lIGRvZXMgbm90IHN1cHBvcnQgdGhlICdcIitcclxuICAgICAgICBrK1wiJyBiaW5kaW5nIHdpdGhpbiBpdHMgdGVtcGxhdGVzXCIpO319ZD1cImtvLl9fdHJfYW1idG5zKGZ1bmN0aW9uKCRjb250ZXh0LCRlbGVtZW50KXtyZXR1cm4oZnVuY3Rpb24oKXtyZXR1cm57IFwiK2EuaC5YYShiLHt2YWx1ZUFjY2Vzc29yczohMH0pK1wiIH0gfSkoKX0sJ1wiK2QudG9Mb3dlckNhc2UoKStcIicpXCI7cmV0dXJuIGguY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrKGQpK2N9dmFyIGM9Lyg8KFthLXpdK1xcZCopKD86XFxzKyg/IWRhdGEtYmluZFxccyo9XFxzKilbYS16MC05XFwtXSsoPzo9KD86XFxcIlteXFxcIl0qXFxcInxcXCdbXlxcJ10qXFwnfFtePl0qKSk/KSpcXHMrKWRhdGEtYmluZFxccyo9XFxzKihbXCInXSkoW1xcc1xcU10qPylcXDMvZ2ksZD0vXFx4M2MhLS1cXHMqa29cXGJcXHMqKFtcXHNcXFNdKj8pXFxzKi0tXFx4M2UvZztyZXR1cm57VGM6ZnVuY3Rpb24oYixjLGQpe2MuaXNUZW1wbGF0ZVJld3JpdHRlbihiLGQpfHxjLnJld3JpdGVUZW1wbGF0ZShiLGZ1bmN0aW9uKGIpe3JldHVybiBhLkliLmpkKGIsXHJcbiAgICAgICAgYyl9LGQpfSxqZDpmdW5jdGlvbihhLGYpe3JldHVybiBhLnJlcGxhY2UoYyxmdW5jdGlvbihhLGMsZCxlLGspe3JldHVybiBiKGssYyxkLGYpfSkucmVwbGFjZShkLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGIoYyxcIlxceDNjIS0tIGtvIC0tXFx4M2VcIixcIiNjb21tZW50XCIsZil9KX0sSmM6ZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5OLnliKGZ1bmN0aW9uKGQsaCl7dmFyIGw9ZC5uZXh0U2libGluZztsJiZsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1jJiZhLkxhKGwsYixoKX0pfX19KCk7YS5iKFwiX190cl9hbWJ0bnNcIixhLkliLkpjKTsoZnVuY3Rpb24oKXthLnY9e307YS52Lm49ZnVuY3Rpb24oYil7aWYodGhpcy5uPWIpe3ZhciBjPWEuYS5BKGIpO3RoaXMuZWI9XCJzY3JpcHRcIj09PWM/MTpcInRleHRhcmVhXCI9PT1jPzI6XCJ0ZW1wbGF0ZVwiPT1jJiZiLmNvbnRlbnQmJjExPT09Yi5jb250ZW50Lm5vZGVUeXBlPzM6NH19O2Eudi5uLnByb3RvdHlwZS50ZXh0PWZ1bmN0aW9uKCl7dmFyIGI9MT09PVxyXG4gICAgdGhpcy5lYj9cInRleHRcIjoyPT09dGhpcy5lYj9cInZhbHVlXCI6XCJpbm5lckhUTUxcIjtpZigwPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLm5bYl07dmFyIGM9YXJndW1lbnRzWzBdO1wiaW5uZXJIVE1MXCI9PT1iP2EuYS5FYih0aGlzLm4sYyk6dGhpcy5uW2JdPWN9O3ZhciBiPWEuYS5lLkooKStcIl9cIjthLnYubi5wcm90b3R5cGUuZGF0YT1mdW5jdGlvbihjKXtpZigxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gYS5hLmUuZ2V0KHRoaXMubixiK2MpO2EuYS5lLnNldCh0aGlzLm4sYitjLGFyZ3VtZW50c1sxXSl9O3ZhciBjPWEuYS5lLkooKTthLnYubi5wcm90b3R5cGUubm9kZXM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzLm47aWYoMD09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4oYS5hLmUuZ2V0KGIsYyl8fHt9KS5tYnx8KDM9PT10aGlzLmViP2IuY29udGVudDo0PT09dGhpcy5lYj9iOm4pO2EuYS5lLnNldChiLGMse21iOmFyZ3VtZW50c1swXX0pfTthLnYuc2E9ZnVuY3Rpb24oYSl7dGhpcy5uPVxyXG4gICAgICAgIGF9O2Eudi5zYS5wcm90b3R5cGU9bmV3IGEudi5uO2Eudi5zYS5wcm90b3R5cGUudGV4dD1mdW5jdGlvbigpe2lmKDA9PWFyZ3VtZW50cy5sZW5ndGgpe3ZhciBiPWEuYS5lLmdldCh0aGlzLm4sYyl8fHt9O2IuSmI9PT1uJiZiLm1iJiYoYi5KYj1iLm1iLmlubmVySFRNTCk7cmV0dXJuIGIuSmJ9YS5hLmUuc2V0KHRoaXMubixjLHtKYjphcmd1bWVudHNbMF19KX07YS5iKFwidGVtcGxhdGVTb3VyY2VzXCIsYS52KTthLmIoXCJ0ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudFwiLGEudi5uKTthLmIoXCJ0ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGVcIixhLnYuc2EpfSkoKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsYyxkKXt2YXIgZTtmb3IoYz1hLmYubmV4dFNpYmxpbmcoYyk7YiYmKGU9YikhPT1jOyliPWEuZi5uZXh0U2libGluZyhlKSxkKGUsYil9ZnVuY3Rpb24gYyhjLGQpe2lmKGMubGVuZ3RoKXt2YXIgZT1jWzBdLGY9Y1tjLmxlbmd0aC0xXSxnPWUucGFyZW50Tm9kZSxoPVxyXG4gICAgICAgIGEuUy5pbnN0YW5jZSxuPWgucHJlcHJvY2Vzc05vZGU7aWYobil7YihlLGYsZnVuY3Rpb24oYSxiKXt2YXIgYz1hLnByZXZpb3VzU2libGluZyxkPW4uY2FsbChoLGEpO2QmJihhPT09ZSYmKGU9ZFswXXx8YiksYT09PWYmJihmPWRbZC5sZW5ndGgtMV18fGMpKX0pO2MubGVuZ3RoPTA7aWYoIWUpcmV0dXJuO2U9PT1mP2MucHVzaChlKTooYy5wdXNoKGUsZiksYS5hLkJhKGMsZykpfWIoZSxmLGZ1bmN0aW9uKGIpezEhPT1iLm5vZGVUeXBlJiY4IT09Yi5ub2RlVHlwZXx8YS5VYihkLGIpfSk7YihlLGYsZnVuY3Rpb24oYil7MSE9PWIubm9kZVR5cGUmJjghPT1iLm5vZGVUeXBlfHxhLk4uQ2MoYixbZF0pfSk7YS5hLkJhKGMsZyl9fWZ1bmN0aW9uIGQoYSl7cmV0dXJuIGEubm9kZVR5cGU/YTowPGEubGVuZ3RoP2FbMF06bnVsbH1mdW5jdGlvbiBlKGIsZSxmLGgscSl7cT1xfHx7fTt2YXIgcD0oYiYmZChiKXx8Znx8e30pLm93bmVyRG9jdW1lbnQsbj1xLnRlbXBsYXRlRW5naW5lfHxnO1xyXG4gICAgICAgIGEuSWIuVGMoZixuLHApO2Y9bi5yZW5kZXJUZW1wbGF0ZShmLGgscSxwKTtpZihcIm51bWJlclwiIT10eXBlb2YgZi5sZW5ndGh8fDA8Zi5sZW5ndGgmJlwibnVtYmVyXCIhPXR5cGVvZiBmWzBdLm5vZGVUeXBlKXRocm93IEVycm9yKFwiVGVtcGxhdGUgZW5naW5lIG11c3QgcmV0dXJuIGFuIGFycmF5IG9mIERPTSBub2Rlc1wiKTtwPSExO3N3aXRjaChlKXtjYXNlIFwicmVwbGFjZUNoaWxkcmVuXCI6YS5mLmZhKGIsZik7cD0hMDticmVhaztjYXNlIFwicmVwbGFjZU5vZGVcIjphLmEudWMoYixmKTtwPSEwO2JyZWFrO2Nhc2UgXCJpZ25vcmVUYXJnZXROb2RlXCI6YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVua25vd24gcmVuZGVyTW9kZTogXCIrZSk7fXAmJihjKGYsaCkscS5hZnRlclJlbmRlciYmYS5sLncocS5hZnRlclJlbmRlcixudWxsLFtmLGguJGRhdGFdKSk7cmV0dXJuIGZ9ZnVuY3Rpb24gZihiLGMsZCl7cmV0dXJuIGEuSShiKT9iKCk6XCJmdW5jdGlvblwiPT09dHlwZW9mIGI/YihjLGQpOmJ9XHJcbiAgICAgICAgdmFyIGc7YS5GYj1mdW5jdGlvbihiKXtpZihiIT1uJiYhKGIgaW5zdGFuY2VvZiBhLlApKXRocm93IEVycm9yKFwidGVtcGxhdGVFbmdpbmUgbXVzdCBpbmhlcml0IGZyb20ga28udGVtcGxhdGVFbmdpbmVcIik7Zz1ifTthLkNiPWZ1bmN0aW9uKGIsYyxrLGgscSl7az1rfHx7fTtpZigoay50ZW1wbGF0ZUVuZ2luZXx8Zyk9PW4pdGhyb3cgRXJyb3IoXCJTZXQgYSB0ZW1wbGF0ZSBlbmdpbmUgYmVmb3JlIGNhbGxpbmcgcmVuZGVyVGVtcGxhdGVcIik7cT1xfHxcInJlcGxhY2VDaGlsZHJlblwiO2lmKGgpe3ZhciBwPWQoaCk7cmV0dXJuIGEuQihmdW5jdGlvbigpe3ZhciBnPWMmJmMgaW5zdGFuY2VvZiBhLlI/YzpuZXcgYS5SKGMsbnVsbCxudWxsLG51bGwse2V4cG9ydERlcGVuZGVuY2llczohMH0pLG49ZihiLGcuJGRhdGEsZyksZz1lKGgscSxuLGcsayk7XCJyZXBsYWNlTm9kZVwiPT1xJiYoaD1nLHA9ZChoKSl9LG51bGwse3lhOmZ1bmN0aW9uKCl7cmV0dXJuIXB8fCFhLmEucWIocCl9LGk6cCYmXHJcbiAgICAgICAgXCJyZXBsYWNlTm9kZVwiPT1xP3AucGFyZW50Tm9kZTpwfSl9cmV0dXJuIGEuTi55YihmdW5jdGlvbihkKXthLkNiKGIsYyxrLGQsXCJyZXBsYWNlTm9kZVwiKX0pfTthLnBkPWZ1bmN0aW9uKGIsZCxnLGgscSl7ZnVuY3Rpb24gcChhLGIpe2MoYix0KTtnLmFmdGVyUmVuZGVyJiZnLmFmdGVyUmVuZGVyKGIsYSk7dD1udWxsfWZ1bmN0aW9uIHMoYSxjKXt0PXEuY3JlYXRlQ2hpbGRDb250ZXh0KGEsZy5hcyxmdW5jdGlvbihhKXthLiRpbmRleD1jfSk7dmFyIGQ9ZihiLGEsdCk7cmV0dXJuIGUobnVsbCxcImlnbm9yZVRhcmdldE5vZGVcIixkLHQsZyl9dmFyIHQ7cmV0dXJuIGEuQihmdW5jdGlvbigpe3ZhciBiPWEuYS5jKGQpfHxbXTtcInVuZGVmaW5lZFwiPT10eXBlb2YgYi5sZW5ndGgmJihiPVtiXSk7Yj1hLmEuTWEoYixmdW5jdGlvbihiKXtyZXR1cm4gZy5pbmNsdWRlRGVzdHJveWVkfHxiPT09bnx8bnVsbD09PWJ8fCFhLmEuYyhiLl9kZXN0cm95KX0pO2EubC53KGEuYS5EYixudWxsLFtoLGIsXHJcbiAgICAgICAgICAgIHMsZyxwXSl9LG51bGwse2k6aH0pfTt2YXIgaD1hLmEuZS5KKCk7YS5kLnRlbXBsYXRlPXtpbml0OmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5hLmMoYygpKTtpZihcInN0cmluZ1wiPT10eXBlb2YgZHx8ZC5uYW1lKWEuZi56YShiKTtlbHNle2lmKFwibm9kZXNcImluIGQpe2lmKGQ9ZC5ub2Rlc3x8W10sYS5JKGQpKXRocm93IEVycm9yKCdUaGUgXCJub2Rlc1wiIG9wdGlvbiBtdXN0IGJlIGEgcGxhaW4sIG5vbi1vYnNlcnZhYmxlIGFycmF5LicpO31lbHNlIGQ9YS5mLmNoaWxkTm9kZXMoYik7ZD1hLmEubmMoZCk7KG5ldyBhLnYuc2EoYikpLm5vZGVzKGQpfXJldHVybntjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczohMH19LHVwZGF0ZTpmdW5jdGlvbihiLGMsZCxlLGYpe3ZhciBnPWMoKTtjPWEuYS5jKGcpO2Q9ITA7ZT1udWxsO1wic3RyaW5nXCI9PXR5cGVvZiBjP2M9e306KGc9Yy5uYW1lLFwiaWZcImluIGMmJihkPWEuYS5jKGNbXCJpZlwiXSkpLGQmJlwiaWZub3RcImluIGMmJihkPSFhLmEuYyhjLmlmbm90KSkpO1xyXG4gICAgICAgICAgICBcImZvcmVhY2hcImluIGM/ZT1hLnBkKGd8fGIsZCYmYy5mb3JlYWNofHxbXSxjLGIsZik6ZD8oZj1cImRhdGFcImluIGM/Zi5hYyhjLmRhdGEsYy5hcyk6ZixlPWEuQ2IoZ3x8YixmLGMsYikpOmEuZi56YShiKTtmPWU7KGM9YS5hLmUuZ2V0KGIsaCkpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBjLmsmJmMuaygpO2EuYS5lLnNldChiLGgsZiYmZi5jYSgpP2Y6bil9fTthLmgudmEudGVtcGxhdGU9ZnVuY3Rpb24oYil7Yj1hLmguQWIoYik7cmV0dXJuIDE9PWIubGVuZ3RoJiZiWzBdLnVua25vd258fGEuaC5mZChiLFwibmFtZVwiKT9udWxsOlwiVGhpcyB0ZW1wbGF0ZSBlbmdpbmUgZG9lcyBub3Qgc3VwcG9ydCBhbm9ueW1vdXMgdGVtcGxhdGVzIG5lc3RlZCB3aXRoaW4gaXRzIHRlbXBsYXRlc1wifTthLmYuYWEudGVtcGxhdGU9ITB9KSgpO2EuYihcInNldFRlbXBsYXRlRW5naW5lXCIsYS5GYik7YS5iKFwicmVuZGVyVGVtcGxhdGVcIixhLkNiKTthLmEuaGM9ZnVuY3Rpb24oYSxjLGQpe2lmKGEubGVuZ3RoJiZcclxuICAgICAgICBjLmxlbmd0aCl7dmFyIGUsZixnLGgsbDtmb3IoZT1mPTA7KCFkfHxlPGQpJiYoaD1hW2ZdKTsrK2Ype2ZvcihnPTA7bD1jW2ddOysrZylpZihoLnZhbHVlPT09bC52YWx1ZSl7aC5tb3ZlZD1sLmluZGV4O2wubW92ZWQ9aC5pbmRleDtjLnNwbGljZShnLDEpO2U9Zz0wO2JyZWFrfWUrPWd9fX07YS5hLmxiPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGQsZSxmLGcpe3ZhciBoPU1hdGgubWluLGw9TWF0aC5tYXgsbT1bXSxrLG49Yi5sZW5ndGgscSxwPWQubGVuZ3RoLHM9cC1ufHwxLHQ9bitwKzEsdix1LHg7Zm9yKGs9MDtrPD1uO2srKylmb3IodT12LG0ucHVzaCh2PVtdKSx4PWgocCxrK3MpLHE9bCgwLGstMSk7cTw9eDtxKyspdltxXT1xP2s/YltrLTFdPT09ZFtxLTFdP3VbcS0xXTpoKHVbcV18fHQsdltxLTFdfHx0KSsxOnErMTprKzE7aD1bXTtsPVtdO3M9W107az1uO2ZvcihxPXA7a3x8cTspcD1tW2tdW3FdLTEscSYmcD09PW1ba11bcS0xXT9sLnB1c2goaFtoLmxlbmd0aF09e3N0YXR1czplLFxyXG4gICAgICAgIHZhbHVlOmRbLS1xXSxpbmRleDpxfSk6ayYmcD09PW1bay0xXVtxXT9zLnB1c2goaFtoLmxlbmd0aF09e3N0YXR1czpmLHZhbHVlOmJbLS1rXSxpbmRleDprfSk6KC0tcSwtLWssZy5zcGFyc2V8fGgucHVzaCh7c3RhdHVzOlwicmV0YWluZWRcIix2YWx1ZTpkW3FdfSkpO2EuYS5oYyhzLGwsIWcuZG9udExpbWl0TW92ZXMmJjEwKm4pO3JldHVybiBoLnJldmVyc2UoKX1yZXR1cm4gZnVuY3Rpb24oYSxkLGUpe2U9XCJib29sZWFuXCI9PT10eXBlb2YgZT97ZG9udExpbWl0TW92ZXM6ZX06ZXx8e307YT1hfHxbXTtkPWR8fFtdO3JldHVybiBhLmxlbmd0aDxkLmxlbmd0aD9iKGEsZCxcImFkZGVkXCIsXCJkZWxldGVkXCIsZSk6YihkLGEsXCJkZWxldGVkXCIsXCJhZGRlZFwiLGUpfX0oKTthLmIoXCJ1dGlscy5jb21wYXJlQXJyYXlzXCIsYS5hLmxiKTsoZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsYyxkLGgsbCl7dmFyIG09W10saz1hLkIoZnVuY3Rpb24oKXt2YXIgaz1jKGQsbCxhLmEuQmEobSxiKSl8fFtdOzA8XHJcbiAgICBtLmxlbmd0aCYmKGEuYS51YyhtLGspLGgmJmEubC53KGgsbnVsbCxbZCxrLGxdKSk7bS5sZW5ndGg9MDthLmEudGEobSxrKX0sbnVsbCx7aTpiLHlhOmZ1bmN0aW9uKCl7cmV0dXJuIWEuYS5UYihtKX19KTtyZXR1cm57ZWE6bSxCOmsuY2EoKT9rOm59fXZhciBjPWEuYS5lLkooKSxkPWEuYS5lLkooKTthLmEuRGI9ZnVuY3Rpb24oZSxmLGcsaCxsKXtmdW5jdGlvbiBtKGIsYyl7dz1xW2NdO3UhPT1jJiYoRFtiXT13KTt3LnRiKHUrKyk7YS5hLkJhKHcuZWEsZSk7dC5wdXNoKHcpO3oucHVzaCh3KX1mdW5jdGlvbiBrKGIsYyl7aWYoYilmb3IodmFyIGQ9MCxlPWMubGVuZ3RoO2Q8ZTtkKyspY1tkXSYmYS5hLnIoY1tkXS5lYSxmdW5jdGlvbihhKXtiKGEsZCxjW2RdLmthKX0pfWY9Znx8W107aD1ofHx7fTt2YXIgcj1hLmEuZS5nZXQoZSxjKT09PW4scT1hLmEuZS5nZXQoZSxjKXx8W10scD1hLmEuaWIocSxmdW5jdGlvbihhKXtyZXR1cm4gYS5rYX0pLHM9YS5hLmxiKHAsZixoLmRvbnRMaW1pdE1vdmVzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0PVtdLHY9MCx1PTAseD1bXSx6PVtdO2Y9W107Zm9yKHZhciBEPVtdLHA9W10sdyxDPTAsQixFO0I9c1tDXTtDKyspc3dpdGNoKEU9Qi5tb3ZlZCxCLnN0YXR1cyl7Y2FzZSBcImRlbGV0ZWRcIjpFPT09biYmKHc9cVt2XSx3LkImJih3LkIuaygpLHcuQj1uKSxhLmEuQmEody5lYSxlKS5sZW5ndGgmJihoLmJlZm9yZVJlbW92ZSYmKHQucHVzaCh3KSx6LnB1c2godyksdy5rYT09PWQ/dz1udWxsOmZbQ109dyksdyYmeC5wdXNoLmFwcGx5KHgsdy5lYSkpKTt2Kys7YnJlYWs7Y2FzZSBcInJldGFpbmVkXCI6bShDLHYrKyk7YnJlYWs7Y2FzZSBcImFkZGVkXCI6RSE9PW4/bShDLEUpOih3PXtrYTpCLnZhbHVlLHRiOmEuTyh1KyspfSx0LnB1c2godyksei5wdXNoKHcpLHJ8fChwW0NdPXcpKX1hLmEuZS5zZXQoZSxjLHQpO2soaC5iZWZvcmVNb3ZlLEQpO2EuYS5yKHgsaC5iZWZvcmVSZW1vdmU/YS5iYTphLnJlbW92ZU5vZGUpO2Zvcih2YXIgQz0wLHI9YS5mLmZpcnN0Q2hpbGQoZSksRjt3PXpbQ107QysrKXt3LmVhfHxcclxuICAgIGEuYS5leHRlbmQodyxiKGUsZyx3LmthLGwsdy50YikpO2Zvcih2PTA7cz13LmVhW3ZdO3I9cy5uZXh0U2libGluZyxGPXMsdisrKXMhPT1yJiZhLmYua2MoZSxzLEYpOyF3LmFkJiZsJiYobCh3LmthLHcuZWEsdy50Yiksdy5hZD0hMCl9ayhoLmJlZm9yZVJlbW92ZSxmKTtmb3IoQz0wO0M8Zi5sZW5ndGg7KytDKWZbQ10mJihmW0NdLmthPWQpO2soaC5hZnRlck1vdmUsRCk7ayhoLmFmdGVyQWRkLHApfX0pKCk7YS5iKFwidXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZ1wiLGEuYS5EYik7YS5YPWZ1bmN0aW9uKCl7dGhpcy5hbGxvd1RlbXBsYXRlUmV3cml0aW5nPSExfTthLlgucHJvdG90eXBlPW5ldyBhLlA7YS5YLnByb3RvdHlwZS5yZW5kZXJUZW1wbGF0ZVNvdXJjZT1mdW5jdGlvbihiLGMsZCxlKXtpZihjPSg5PmEuYS5DPzA6Yi5ub2Rlcyk/Yi5ub2RlcygpOm51bGwpcmV0dXJuIGEuYS5XKGMuY2xvbmVOb2RlKCEwKS5jaGlsZE5vZGVzKTtiPWIudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBhLmEubmEoYixlKX07YS5YLnZiPW5ldyBhLlg7YS5GYihhLlgudmIpO2EuYihcIm5hdGl2ZVRlbXBsYXRlRW5naW5lXCIsYS5YKTsoZnVuY3Rpb24oKXthLnhiPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5lZD1mdW5jdGlvbigpe2lmKCF1fHwhdS50bXBsKXJldHVybiAwO3RyeXtpZigwPD11LnRtcGwudGFnLnRtcGwub3Blbi50b1N0cmluZygpLmluZGV4T2YoXCJfX1wiKSlyZXR1cm4gMn1jYXRjaChhKXt9cmV0dXJuIDF9KCk7dGhpcy5yZW5kZXJUZW1wbGF0ZVNvdXJjZT1mdW5jdGlvbihiLGUsZixnKXtnPWd8fHQ7Zj1mfHx7fTtpZigyPmEpdGhyb3cgRXJyb3IoXCJZb3VyIHZlcnNpb24gb2YgalF1ZXJ5LnRtcGwgaXMgdG9vIG9sZC4gUGxlYXNlIHVwZ3JhZGUgdG8galF1ZXJ5LnRtcGwgMS4wLjBwcmUgb3IgbGF0ZXIuXCIpO3ZhciBoPWIuZGF0YShcInByZWNvbXBpbGVkXCIpO2h8fChoPWIudGV4dCgpfHxcIlwiLGg9dS50ZW1wbGF0ZShudWxsLFwie3trb193aXRoICRpdGVtLmtvQmluZGluZ0NvbnRleHR9fVwiK1xyXG4gICAgICAgIGgrXCJ7ey9rb193aXRofX1cIiksYi5kYXRhKFwicHJlY29tcGlsZWRcIixoKSk7Yj1bZS4kZGF0YV07ZT11LmV4dGVuZCh7a29CaW5kaW5nQ29udGV4dDplfSxmLnRlbXBsYXRlT3B0aW9ucyk7ZT11LnRtcGwoaCxiLGUpO2UuYXBwZW5kVG8oZy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTt1LmZyYWdtZW50cz17fTtyZXR1cm4gZX07dGhpcy5jcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2s9ZnVuY3Rpb24oYSl7cmV0dXJuXCJ7e2tvX2NvZGUgKChmdW5jdGlvbigpIHsgcmV0dXJuIFwiK2ErXCIgfSkoKSkgfX1cIn07dGhpcy5hZGRUZW1wbGF0ZT1mdW5jdGlvbihhLGIpe3Qud3JpdGUoXCI8c2NyaXB0IHR5cGU9J3RleHQvaHRtbCcgaWQ9J1wiK2ErXCInPlwiK2IrXCJcXHgzYy9zY3JpcHQ+XCIpfTswPGEmJih1LnRtcGwudGFnLmtvX2NvZGU9e29wZW46XCJfXy5wdXNoKCQxIHx8ICcnKTtcIn0sdS50bXBsLnRhZy5rb193aXRoPXtvcGVuOlwid2l0aCgkMSkge1wiLGNsb3NlOlwifSBcIn0pfTthLnhiLnByb3RvdHlwZT1cclxuICAgICAgICBuZXcgYS5QO3ZhciBiPW5ldyBhLnhiOzA8Yi5lZCYmYS5GYihiKTthLmIoXCJqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmVcIixhLnhiKX0pKCl9KX0pKCk7fSkoKTtcclxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjMnO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIHByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIGNvbGxlY3Rpb24gbWV0aG9kcyB0byBkZXRlcm1pbmUgd2hldGhlciBhIGNvbGxlY3Rpb25cbiAgLy8gc2hvdWxkIGJlIGl0ZXJhdGVkIGFzIGFuIGFycmF5IG9yIGFzIGFuIG9iamVjdFxuICAvLyBSZWxhdGVkOiBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIGdldExlbmd0aCA9IHByb3BlcnR5KCdsZW5ndGgnKTtcbiAgdmFyIGlzQXJyYXlMaWtlID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBPcHRpbWl6ZWQgaXRlcmF0b3IgZnVuY3Rpb24gYXMgdXNpbmcgYXJndW1lbnRzLmxlbmd0aFxuICAgIC8vIGluIHRoZSBtYWluIGZ1bmN0aW9uIHdpbGwgZGVvcHRpbWl6ZSB0aGUsIHNlZSAjMTk5MS5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGluaXRpYWwgdmFsdWUgaWYgbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpO1xuICAgIH07XG4gIH1cblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGNyZWF0ZVJlZHVjZSgtMSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAga2V5ID0gXy5maW5kSW5kZXgob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfLmZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIGl0ZW0sIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggIT0gJ251bWJlcicgfHwgZ3VhcmQpIGZyb21JbmRleCA9IDA7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdO1xuICAgICAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IGZ1bmMgOiBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gXy5pbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sIGlkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggfHwgMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vZmxhdHRlbiBjdXJyZW50IGxldmVsIG9mIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3RcbiAgICAgICAgaWYgKCFzaGFsbG93KSB2YWx1ZSA9IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIHN0cmljdCk7XG4gICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICBvdXRwdXQubGVuZ3RoICs9IGxlbjtcbiAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghc3RyaWN0KSB7XG4gICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpLCBhcnJheSkgOiB2YWx1ZTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gXy5wbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgZmluZEluZGV4IGFuZCBmaW5kTGFzdEluZGV4IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcbiAgXy5maW5kTGFzdEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGluZGV4T2YgYW5kIGxhc3RJbmRleE9mIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzb3J0ZWRJbmRleCAmJiBpZHggJiYgbGVuZ3RoKSB7XG4gICAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2lkeF0gPT09IGl0ZW0gPyBpZHggOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgXy5pc05hTik7XG4gICAgICAgIHJldHVybiBpZHggPj0gMCA/IGlkeCArIGkgOiAtMTtcbiAgICAgIH1cbiAgICAgIGZvciAoaWR4ID0gZGlyID4gMCA/IGkgOiBsZW5ndGggLSAxOyBpZHggPj0gMCAmJiBpZHggPCBsZW5ndGg7IGlkeCArPSBkaXIpIHtcbiAgICAgICAgaWYgKGFycmF5W2lkeF0gPT09IGl0ZW0pIHJldHVybiBpZHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIF8uZmluZEluZGV4LCBfLnNvcnRlZEluZGV4KTtcbiAgXy5sYXN0SW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKC0xLCBfLmZpbmRMYXN0SW5kZXgpO1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKHN0b3AgPT0gbnVsbCkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW5ndGg7IGlkeCsrLCBzdGFydCArPSBzdGVwKSB7XG4gICAgICByYW5nZVtpZHhdID0gc3RhcnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yXG4gIC8vIG9yIGEgbm9ybWFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50c1xuICB2YXIgZXhlY3V0ZUJvdW5kID0gZnVuY3Rpb24oc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQmluZCBtdXN0IGJlIGNhbGxlZCBvbiBhIGZ1bmN0aW9uJyk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IF8gPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIHRoaXMsIHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwga2V5O1xuICAgIGlmIChsZW5ndGggPD0gMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBhcmd1bWVudHNbaV07XG4gICAgICBvYmpba2V5XSA9IF8uYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgICAgaWYgKCFfLmhhcyhjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IF8ucGFydGlhbChfLmRlbGF5LCBfLCAxKTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBfLm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxhc3QgPSBfLm5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgXy5uZWdhdGUgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCB1cCB0byAoYnV0IG5vdCBpbmNsdWRpbmcpIHRoZSBOdGggY2FsbC5cbiAgXy5iZWZvcmUgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gXy5wYXJ0aWFsKF8uYmVmb3JlLCAyKTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSAoXy5pc0Z1bmN0aW9uKGNvbnN0cnVjdG9yKSAmJiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpIHx8IE9ialByb3RvO1xuXG4gICAgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG4gICAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICAgIGlmIChfLmhhcyhvYmosIHByb3ApICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSBrZXlzLnB1c2gocHJvcCk7XG5cbiAgICB3aGlsZSAobm9uRW51bUlkeC0tKSB7XG4gICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25vbkVudW1JZHhdO1xuICAgICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSAhPT0gcHJvdG9bcHJvcF0gJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIHtcbiAgICAgICAga2V5cy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgYWxsIHRoZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG4gIF8uYWxsS2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgb2JqZWN0XG4gIC8vIEluIGNvbnRyYXN0IHRvIF8ubWFwIGl0IHJldHVybnMgYW4gb2JqZWN0XG4gIF8ubWFwT2JqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdHMgPSB7fSxcbiAgICAgICAgICBjdXJyZW50S2V5O1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIHJlc3VsdHNbY3VycmVudEtleV0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocylcbiAgLy8gKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24pXG4gIF8uZXh0ZW5kT3duID0gXy5hc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihfLmtleXMpO1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGtleSBvbiBhbiBvYmplY3QgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRLZXkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKSwga2V5O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmplY3QsIG9pdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fSwgb2JqID0gb2JqZWN0LCBpdGVyYXRlZSwga2V5cztcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvaXRlcmF0ZWUpKSB7XG4gICAgICBrZXlzID0gXy5hbGxLZXlzKG9iaik7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2Iob2l0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHsgcmV0dXJuIGtleSBpbiBvYmo7IH07XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5tYXAoZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gXy5waWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIF8uY3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBfLmV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5pc01hdGNoID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKGF0dHJzKSwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG5cbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoXy5rZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IGtleXNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopICYmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikgfHwgXy5pc0FyZ3VtZW50cyhvYmopKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIF8ua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvci5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnLCAnRXJyb3InXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaGFzKG9iaiwgJ2NhbGxlZScpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLm5vb3AgPSBmdW5jdGlvbigpe307XG5cbiAgXy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgXy5wcm9wZXJ0eU9mID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gZnVuY3Rpb24oKXt9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2ZcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlciA9IF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgYXR0cnMgPSBfLmV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0ZWUoaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG4gIHZhciB1bmVzY2FwZU1hcCA9IF8uaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgXy5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xuICAgIHZhciB0ZXN0UmVnZXhwID0gUmVnRXhwKHNvdXJjZSk7XG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICAgIHJldHVybiB0ZXN0UmVnZXhwLnRlc3Qoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleHAsIGVzY2FwZXIpIDogc3RyaW5nO1xuICAgIH07XG4gIH07XG4gIF8uZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICBfLnVuZXNjYXBlID0gY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgZmFsbGJhY2spIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHZvaWQgMCA6IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHZhbHVlID0gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuICB2YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdO1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIHNldHRpbmdzLCBvbGRTZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZXIsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB2YXIgYXJndW1lbnQgPSBzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJztcbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24uIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PT0gJ3NoaWZ0JyB8fCBuYW1lID09PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuICBfLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59LmNhbGwodGhpcykpO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiaW1wb3J0IHtLbm9ja291dEluaXRpYWxpemVyfSBmcm9tICcuL2tub2Nrb3V0L0tub2Nrb3V0SW5pdGlhbGl6ZXInO1xuaW1wb3J0IHtQYXJhbVJlYWRlcn0gZnJvbSAnLi9jb21tb24vUGFyYW1SZWFkZXInO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJy4vUm91dGVyJztcbmltcG9ydCB7U2VydmVyQWN0aW9uc30gZnJvbSAnLi9jb21tb24vU2VydmVyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG5cbiAgICBwcml2YXRlIHBhcmFtUmVhZGVyOiBQYXJhbVJlYWRlcjtcbiAgICBwcml2YXRlIGtub2Nrb3V0SW5pdGlhbGl6ZXI6IEtub2Nrb3V0SW5pdGlhbGl6ZXI7XG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcjtcbiAgICBwcml2YXRlIHNlcnZlckFjdGlvbnM6IFNlcnZlckFjdGlvbnM7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIGtub2Nrb3V0SW5pdGlhbGl6ZXI6IEtub2Nrb3V0SW5pdGlhbGl6ZXIsXG4gICAgICAgIHBhcmFtUmVhZGVyOiBQYXJhbVJlYWRlcixcbiAgICAgICAgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHNlcnZlckFjdGlvbnM6IFNlcnZlckFjdGlvbnNcbiAgICApIHtcbiAgICAgICAgdGhpcy5rbm9ja291dEluaXRpYWxpemVyID0ga25vY2tvdXRJbml0aWFsaXplcjtcbiAgICAgICAgdGhpcy5wYXJhbVJlYWRlciA9IHBhcmFtUmVhZGVyO1xuICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcbiAgICAgICAgdGhpcy5zZXJ2ZXJBY3Rpb25zID0gc2VydmVyQWN0aW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcnVuKCkge1xuICAgICAgICBsZXQgcm9vbUlkID0gdGhpcy5wYXJhbVJlYWRlci5nZXRRdWVyeVZhcmlhYmxlKCdyb29tSWQnKTtcblxuICAgICAgICB0aGlzLmtub2Nrb3V0SW5pdGlhbGl6ZXIuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLnJvdXRlci5yZW5kZXJMYXlvdXQoKTtcblxuICAgICAgICB0aGlzLnJvdXRlci5yZW5kZXJQYWdlKHJvb21JZCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb250ZW50RGVwZW5kZW5jaWVzfSBmcm9tICcuL2NvbnRlbnQvQ29udGVudERlcGVuZGVuY2llcyc7XG5pbXBvcnQge0tub2Nrb3V0RGVwZW5kZW5jaWVzfSBmcm9tICcuL2tub2Nrb3V0L2tub2Nrb3V0RGVwZW5kZW5jaWVzJztcbmltcG9ydCB7UGFyYW1SZWFkZXJ9IGZyb20gJy4vY29tbW9uL1BhcmFtUmVhZGVyJztcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vQXBwbGljYXRpb24nO1xuaW1wb3J0IHtVc2VyQWN0aW9uc30gZnJvbSAnLi9Vc2VyQWN0aW9ucyc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnLi9Sb3V0ZXInO1xuaW1wb3J0IHtTZXJ2ZXJBY3Rpb25zfSBmcm9tICcuL2NvbW1vbi9TZXJ2ZXJBY3Rpb25zJztcbmltcG9ydCB7WGhyUmVxdWVzdH0gZnJvbSAnLi9jb21tb24vWGhyUmVxdWVzdCc7XG5pbXBvcnQgRm9yZ2UgPSByZXF1aXJlKCdmb3JnZS1kaScpO1xuaW1wb3J0IHtYaHJQb3N0fSBmcm9tICcuL2NvbW1vbi9YaHJQb3N0JztcblxuZXhwb3J0IGNsYXNzIERlcGVuZGVuY2llcyB7XG4gICAgcHJpdmF0ZSBmb3JnZTogRm9yZ2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UgPSBuZXcgRm9yZ2UoKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQ8VCBleHRlbmRzIE9iamVjdD4obmFtZTogc3RyaW5nKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcmdlLmdldChuYW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVnaXN0ZXJEZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgnbmFtZScpLnRvLmluc3RhbmNlKCcnKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdhcHBsaWNhdGlvbicpLnRvLnR5cGUoQXBwbGljYXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRE9NRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckFwcERlcGVuZGVuY2llcygpO1xuICAgICAgICBhd2FpdCB0aGlzLnJlZ2lzdGVyU2VydmVyRGF0YSgpO1xuICAgICAgICBuZXcgQ29udGVudERlcGVuZGVuY2llcyh0aGlzLmZvcmdlKTtcbiAgICAgICAgbmV3IEtub2Nrb3V0RGVwZW5kZW5jaWVzKHRoaXMuZm9yZ2UpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgcmVnaXN0ZXJTZXJ2ZXJEYXRhKCkge1xuICAgICAgICBsZXQgc2VydmVyQWN0aW9ucyA9IHRoaXMuZm9yZ2UuZ2V0PFNlcnZlckFjdGlvbnM+KCdzZXJ2ZXJBY3Rpb25zJyk7XG4gICAgICAgIGxldCByb29tcyA9IGF3YWl0IHNlcnZlckFjdGlvbnMuZ2V0Um9vbXMoKTtcbiAgICAgICAgbGV0IGNvbW1vbklzc3VlcyA9IGF3YWl0IHNlcnZlckFjdGlvbnMuZ2V0Q29tbW9uSXNzdWVzKCk7XG5cbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdyb29tcycpLnRvLmluc3RhbmNlKHJvb21zKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21tb25Jc3N1ZXMnKS50by5pbnN0YW5jZShjb21tb25Jc3N1ZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVnaXN0ZXJBcHBEZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgncGFyYW1SZWFkZXInKS50by50eXBlKFBhcmFtUmVhZGVyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCd1c2VyQWN0aW9ucycpLnRvLnR5cGUoVXNlckFjdGlvbnMpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3JvdXRlcicpLnRvLnR5cGUoUm91dGVyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCd4aHJSZXF1ZXN0JykudG8udHlwZShYaHJSZXF1ZXN0KTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCd4aHJQb3N0JykudG8udHlwZShYaHJQb3N0KTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdzZXJ2ZXJBY3Rpb25zJykudG8udHlwZShTZXJ2ZXJBY3Rpb25zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZ2lzdGVyRE9NRWxlbWVudHMoKSB7XG4gICAgICAgIGxldCBub2RlID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG4gICAgICAgIGxldCBzaWRlYmFyTm9kZSA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhcicpO1xuXG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgncm9vdE5vZGUnKS50by5pbnN0YW5jZShub2RlKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdzaWRlYmFyTm9kZScpLnRvLmluc3RhbmNlKHNpZGViYXJOb2RlKTtcbiAgICB9XG59XG5cbiIsImltcG9ydCB7aXNDb21wb25lbnROYW1lfSBmcm9tICcuL2tub2Nrb3V0L2NvbmZpZy9Db21wb25lbnRzJztcbmltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7Q29tcG9uZW50UmVzb2x2ZXJ9IGZyb20gJy4vY29udGVudC9jb21wb25lbnRzL0NvbXBvbmVudFJlc29sdmVyJztcbmltcG9ydCB7UGFnZVJlbmRlcmVyfSBmcm9tICcuL2NvbnRlbnQvUGFnZVJlbmRlcmVyJztcblxuZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgbGF5b3V0TWFwID0ge1xuICAgICAgICAnZ3JvdXBzJzogJ3Jvb21Hcm91cHMnLFxuICAgICAgICAnY2lyY2xlJzogJ3Jvb21DaXJjdWxhcicsXG4gICAgICAgICdhbmdsZWQnOiAncm9vbUdyb3Vwc0FuZ2xlZCdcbiAgICB9O1xuICAgIHByaXZhdGUgcGFnZVJlbmRlcmVyOiBQYWdlUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBJTklUSUFMX1BBR0UgPSAnaG9tZSc7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50UmVzb2x2ZXI7XG4gICAgcHJpdmF0ZSByb29tczogQXJyYXk8YW55PjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcGFnZVJlbmRlcmVyOiBQYWdlUmVuZGVyZXIsXG4gICAgICAgIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRSZXNvbHZlcixcbiAgICAgICAgcm9vbXM6IEFycmF5PGFueT5cbiAgICApIHtcbiAgICAgICAgdGhpcy5wYWdlUmVuZGVyZXIgPSBwYWdlUmVuZGVyZXI7XG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVzb2x2ZXIgPSBjb21wb25lbnRSZXNvbHZlcjtcbiAgICAgICAgdGhpcy5yb29tcyA9IHJvb21zO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXJMYXlvdXQoKSB7XG4gICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLmdldENvbXBvbmVudEJ5TW9kdWxlTmFtZSgnc2lkZWJhcicpO1xuICAgICAgICBrby5hcHBseUJpbmRpbmdzKGNvbXBvbmVudCwgdGhpcy5wYWdlUmVuZGVyZXIuZ2V0TGF5b3V0Tm9kZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyUGFnZShyb29tSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgcm9vbSA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLnJvb21JZCA9PT0gcm9vbUlkKVswXTtcbiAgICAgICAgbGV0IGNvbXBvbmVudE5hbWUgPSB0aGlzLmdldENvbXBvbmVudE5hbWVCeVJvb21JZChyb29tKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvYWRpbmcgY29tcG9uZW50OiBcIicgKyBjb21wb25lbnROYW1lICsgJ1wiJyk7XG5cbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIuZ2V0Q29tcG9uZW50QnlNb2R1bGVOYW1lKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhjb21wb25lbnQpO1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMucGFnZVJlbmRlcmVyLnJlbmRlclJvb3RDb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KTtcblxuICAgICAgICBrby5hcHBseUJpbmRpbmdzKGNvbXBvbmVudCwgbm9kZSk7XG4gICAgICAgIGNvbXBvbmVudC5vbkxvYWQocm9vbSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb21wb25lbnROYW1lQnlSb29tSWQocm9vbSkge1xuICAgICAgICBsZXQgY29tcG9uZW50TmFtZSA9IHRoaXMuSU5JVElBTF9QQUdFO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygcm9vbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0gUm91dGVyLmxheW91dE1hcFtyb29tLmxheW91dF07XG4gICAgICAgICAgICBpZiAoaXNDb21wb25lbnROYW1lKG5hbWUpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcm91dGU6IFwiJHtuYW1lfVwiIG5vdCBmb3VuZCwgcmVkaXJlY3RpbmcgdG8gaG9tZSBwYWdlLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE5hbWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtJc3N1ZX0gZnJvbSAnLi9jb21tb24vSXNzdWUnO1xuaW1wb3J0IHtYaHJQb3N0fSBmcm9tICcuL2NvbW1vbi9YaHJQb3N0JztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFVzZXJBY3Rpb25zIHtcbiAgICBwcml2YXRlIHhoclBvc3Q6IFhoclBvc3Q7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeGhyUG9zdDogWGhyUG9zdCkge1xuICAgICAgICB0aGlzLnhoclBvc3QgPSB4aHJQb3N0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBzZW5kTmV3Q29tbW9uSXNzdWVUb1NlcnZlcihjb21tb25Jc3N1ZTogYW55KSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnhoclBvc3QucG9zdEpzb25Ub1VybCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2FkZENvbW1vbklzc3VlJywgSlNPTi5zdHJpbmdpZnkoY29tbW9uSXNzdWUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgc2VuZElzc3Vlc1RvTWFpbFNlcnZlcihpc3N1ZXM6IEFycmF5PElzc3VlPikge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy54aHJQb3N0LnBvc3RKc29uVG9VcmwoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZW5kTWFpbCcsIEpTT04uc3RyaW5naWZ5KGlzc3VlcykpO1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxuXG5pbXBvcnQge3BvbHlmaWxsfSBmcm9tICdlczYtcHJvbWlzZSc7XG5pbXBvcnQge0RlcGVuZGVuY2llc30gZnJvbSAnLi9EZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9BcHBsaWNhdGlvbic7XG5cbnBvbHlmaWxsKCk7XG5cbm5ldyBmdW5jdGlvbiAoKSB7XG4gICAgbmV3IERlcGVuZGVuY2llcygpXG4gICAgICAgIC5yZWdpc3RlckRlcGVuZGVuY2llcygpXG4gICAgICAgIC50aGVuKChkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgICAgIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgIC5nZXQ8QXBwbGljYXRpb24+KCdhcHBsaWNhdGlvbicpXG4gICAgICAgICAgICAgICAgLnJ1bigpO1xuICAgICAgICB9KTtcbn0oKTtcblxuXG5cblxuIiwiZXhwb3J0IGNsYXNzIElzc3VlIHtcbiAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZztcbiAgICBwdWJsaWMgZGV2aWNlSWQ6IG51bWJlcjtcbiAgICBwdWJsaWMgcmVjaXBpZW50czogQXJyYXk8c3RyaW5nPjtcbiAgICBwdWJsaWMgcm9vbUlkOiBzdHJpbmc7XG4gICAgcHVibGljIGlzc3VlSWQ6IG51bWJlcjtcbn1cbiIsImltcG9ydCB7SXNzdWV9IGZyb20gJy4vSXNzdWUnO1xuXG5leHBvcnQgY2xhc3MgSXNzdWVGb3JtQ29udGFpbmVyIHtcblxuICAgIHByaXZhdGUgaXNzdWVDb250YWluZXIgPSBbXTtcblxuXG4gICAgcHVibGljIGFkZElzc3VlKGlzc3VlOiBJc3N1ZSkge1xuICAgICAgICB0aGlzLmlzc3VlQ29udGFpbmVyLnB1c2goaXNzdWUpO1xuICAgIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmFtUmVhZGVyIHtcclxuICAgIHB1YmxpYyBnZXRRdWVyeVZhcmlhYmxlKHZhcmlhYmxlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcclxuICAgICAgICBsZXQgdmFycyA9IHF1ZXJ5LnNwbGl0KCcmJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWlyID0gdmFyc1tpXS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICBpZiAoZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pID09IHZhcmlhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIC8vIHRocm93IEVycm9yKCdRdWVyeSB2YXJpYWJsZSAnICsgdmFyaWFibGUgKyAnIG5vdCBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBSZXNvbHZlcjxUPiB7XHJcbiAgICBwcml2YXRlIGNsYXNzZXM6IEFycmF5PFQ+O1xyXG5cclxuICAgIC8vdG9kbyBhZGQgY2FjaGluZ1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNsYXNzZXM6IEFycmF5PFQ+KSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gY2xhc3NlcztcclxuICAgIH1cclxuXHJcbiAgICAvL3RvZG8gY29uc2lkZXIgc3Ryb25nZXIgdHlwZSBmb3IgY2xhc3NUb1Jlc29sdmVcclxuICAgIHB1YmxpYyBnZXRTZXJ2aWNlQnlKb2JOYW1lKGNsYXNzVG9SZXNvbHZlOiBzdHJpbmcpOiBUIHtcclxuICAgICAgICBsZXQgcmVjID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzZXNbaW5kZXhdLmNvbnN0cnVjdG9yLm5hbWUgPT09IGNsYXNzVG9SZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgcmVzb2x2ZSBzZXJ2aWNlOiAnICsgY2xhc3NUb1Jlc29sdmUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVjKGluZGV4IC0gMSk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjKHRoaXMuY2xhc3Nlcy5sZW5ndGggLSAxKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1hoclJlcXVlc3R9IGZyb20gJy4vWGhyUmVxdWVzdCc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJBY3Rpb25zIHtcbiAgICBwcml2YXRlIHhoclJlcXVlc3Q6IFhoclJlcXVlc3Q7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeGhyUmVxdWVzdDogWGhyUmVxdWVzdCkge1xuICAgICAgICB0aGlzLnhoclJlcXVlc3QgPSB4aHJSZXF1ZXN0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRDb21tb25Jc3N1ZXMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGNvbW1vbklzc3VlcyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy54aHJSZXF1ZXN0LnJlcXVlc3RGcm9tVXJsKCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvY29tbW9uSXNzdWVzJyk7XG4gICAgICAgICAgICBjb21tb25Jc3N1ZXMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tbW9uSXNzdWVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXRSb29tcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgcm9vbXMgPSBbXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy54aHJSZXF1ZXN0LnJlcXVlc3RGcm9tVXJsKCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvcm9vbXMnKTtcbiAgICAgICAgICAgIHJvb21zID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvb21zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZW5kTWFpbCgpIHtcbiAgICAgICAgLy8gdG9kbyBpbXBsZW1lbnRcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgWGhyUG9zdCB7XG5cbiAgICBwdWJsaWMgcG9zdEpzb25Ub1VybCh1cmwsIGpzb25TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCd0aW1lb3V0Jyk7XG4gICAgICAgICAgICB9LCA2MDAwMCk7XG5cbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgdXJsKTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcblxuICAgICAgICAgICAgeGhyLnNlbmQoanNvblN0cmluZyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBYaHJSZXF1ZXN0IHtcblxuICAgIHB1YmxpYyByZXF1ZXN0RnJvbVVybChyZXF1ZXN0VXJsOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IChyZXNwb25zZTogc3RyaW5nKSA9PiB2b2lkLCByZWplY3Q6IChlcnJvcjogc3RyaW5nIHwgRXJyb3IpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGE6IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB4aHI6IFhNTEh0dHBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yZXNwb25zZVRleHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdub3BlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB4aHIub3BlbignR0VUJywgcmVxdWVzdFVybCk7XG4gICAgICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJjYWNoZS1jb250cm9sXCIsIFwibm8tY2FjaGVcIik7XG5cbiAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQge1NpZGViYXJ9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXInO1xuaW1wb3J0IHtQYWdlUmVuZGVyZXJ9IGZyb20gJy4vUGFnZVJlbmRlcmVyJztcbmltcG9ydCB7SG9tZX0gZnJvbSAnLi9jb21wb25lbnRzL2hvbWUvaG9tZSc7XG5pbXBvcnQge0NvbXBvbmVudFJlc29sdmVyfSBmcm9tICcuL2NvbXBvbmVudHMvQ29tcG9uZW50UmVzb2x2ZXInO1xuaW1wb3J0IEZvcmdlID0gcmVxdWlyZShcImZvcmdlLWRpXCIpO1xuaW1wb3J0IHtSb29tR3JvdXBzfSBmcm9tICcuL2NvbXBvbmVudHMvcm9vbUdyb3Vwcy9yb29tR3JvdXBzJztcbmltcG9ydCB7Um9vbUdyb3Vwc0FuZ2xlZH0gZnJvbSAnLi9jb21wb25lbnRzL3Jvb21Hcm91cHNBbmdsZWQvcm9vbUdyb3Vwc0FuZ2xlZCc7XG5pbXBvcnQge1Jvb21DaXJjdWxhcn0gZnJvbSAnLi9jb21wb25lbnRzL3Jvb21DaXJjdWxhci9yb29tQ2lyY3VsYXInO1xuaW1wb3J0IHtJc3N1ZUZvcm1Db250YWluZXJ9IGZyb20gJy4uL2NvbW1vbi9Jc3N1ZUZvcm1Db250YWluZXInO1xuXG5leHBvcnQgY2xhc3MgQ29udGVudERlcGVuZGVuY2llcyB7XG4gICAgcHJpdmF0ZSBmb3JnZTogRm9yZ2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZm9yZ2U6IEZvcmdlKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UgPSBmb3JnZTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckNvbXBvbmVudHMoKTtcbiAgICAgICAgLy8gdGhpcy5yZWdpc3RlckNvbnRyb2xsZXJzKCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJPdGhlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck90aGVyKCkge1xuICAgICAgICAvLyB0aGlzLmZvcmdlLmJpbmQoJ3ZpZXdNb2RlbFVwZGF0ZXInKS50by50eXBlKFZpZXdNb2RlbFVwZGF0ZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3BhZ2VSZW5kZXJlcicpLnRvLnR5cGUoUGFnZVJlbmRlcmVyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdpc3N1ZUZvcm1Db250YWluZXInKS50by50eXBlKElzc3VlRm9ybUNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyQ29tcG9uZW50cygpIHtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShIb21lKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShTaWRlYmFyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShSb29tR3JvdXBzKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShSb29tR3JvdXBzQW5nbGVkKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdjb21wb25lbnRzJykudG8udHlwZShSb29tQ2lyY3VsYXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudFJlc29sdmVyJykudG8udHlwZShDb21wb25lbnRSZXNvbHZlcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyQ29udHJvbGxlcnMoKSB7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgnY29tcG9uZW50Q29udHJvbGxlck1hcHBpbmcnKS50by5pbnN0YW5jZShjb21wb25lbnRDb250cm9sbGVyTWFwcGluZyk7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgnY29udHJvbGxlcnMnKS50by50eXBlKFNpZGViYXJDb250cm9sbGVyKTtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb250cm9sbGVycycpLnRvLnR5cGUoU2luZ2xlQ29tcG9uZW50Q29udHJvbGxlcik7XG4gICAgICAgIC8vIHRoaXMuZm9yZ2UuYmluZCgnY29udHJvbGxlcnMnKS50by50eXBlKEhvbWVDb250cm9sbGVyKTtcbiAgICAgICAgLy8gdGhpcy5mb3JnZS5iaW5kKCdjb250cm9sbGVyUmVzb2x2ZXInKS50by50eXBlKENvbnRyb2xsZXJSZXNvbHZlcik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9Db21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgUGFnZVJlbmRlcmVyIHtcbiAgICBwcml2YXRlIHJvb3ROb2RlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHNpZGViYXJOb2RlOiBIVE1MRWxlbWVudDtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihyb290Tm9kZTogSFRNTEVsZW1lbnQsIHNpZGViYXJOb2RlOiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnJvb3ROb2RlID0gcm9vdE5vZGU7XG4gICAgICAgIHRoaXMuc2lkZWJhck5vZGUgPSBzaWRlYmFyTm9kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TGF5b3V0Tm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2lkZWJhck5vZGU7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlclJvb3RDb21wb25lbnQobW9kdWxlTmFtZTogc3RyaW5nLCBjb21wb25lbnQ6IENvbXBvbmVudCk6IGFueSB7XG4gICAgICAgIHRoaXMucm9vdE5vZGUuaW5uZXJIVE1MID0gYDxkaXY+PGRpdiBpZD1cIiR7bW9kdWxlTmFtZX1cIiBkYXRhLWJpbmQ9J2NvbXBvbmVudDogXCIke21vZHVsZU5hbWV9XCInPjwvZGl2PjwvZGl2PmA7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5yb290Tm9kZS5jaGlsZHJlblswXTtcbiAgICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxufVxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgdXBkYXRlOiAoKSA9PiB2b2lkO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRVcGRhdGUoKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgb25SZW5kZXIoKSB7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgb25Mb2FkKHJvb20/OiBhbnkpIHtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvbkluaXQoKSB7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7UmVzb2x2ZXJ9IGZyb20gJy4uLy4uL2NvbW1vbi9SZXNvbHZlcic7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRSZXNvbHZlciBleHRlbmRzIFJlc29sdmVyPENvbXBvbmVudD4ge1xuICAgIHByaXZhdGUgY29tcG9uZW50TGlzdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21wb25lbnRzOiBBcnJheTxDb21wb25lbnQ+LCBjb21wb25lbnRDbGFzc01hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcbiAgICAgICAgc3VwZXIoY29tcG9uZW50cyk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50TGlzdCA9IGNvbXBvbmVudENsYXNzTWFwcGluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50KGNsYXNzVG9SZXNvbHZlOiBzdHJpbmcpOiBDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0U2VydmljZUJ5Sm9iTmFtZShjbGFzc1RvUmVzb2x2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbXBvbmVudEJ5TW9kdWxlTmFtZShtb2R1bGVOYW1lOiBzdHJpbmcpOiBDb21wb25lbnQge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29tcG9uZW50TGlzdFttb2R1bGVOYW1lXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IG5vdCBmb3VuZDogJyArIG1vZHVsZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNsYXNzVG9SZXNvbHZlID0gdGhpcy5jb21wb25lbnRMaXN0W21vZHVsZU5hbWVdO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoY2xhc3NUb1Jlc29sdmUpO1xuICAgIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIubW9kYWwge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2lkdGg6IDgwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7IH1cXG5cXG4ucm9vbS1jb250YWluZXIge1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7IH1cXG5cXG4udGFibGUtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDQwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgaGVpZ2h0OiAzMCU7XFxuICBtYXJnaW46IDQlIDQlO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxcbiAgLnRhYmxlLWdyb3VwLnRlYWNoZXItZGVzayB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgYm90dG9tOiA1JTtcXG4gICAgaGVpZ2h0OiAxMCU7XFxuICAgIHdpZHRoOiAyMCU7XFxuICAgIGxlZnQ6IDYwJTtcXG4gICAgbWFyZ2luOiAwOyB9XFxuXFxuLmRldmljZSB7XFxuICBoZWlnaHQ6IDUwcHg7XFxuICB3aWR0aDogNTBweDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbiAgY3Vyc29yOiBwb2ludGVyOyB9XFxuICAuZGV2aWNlLnRvcCB7XFxuICAgIGxlZnQ6IDIwJTtcXG4gICAgdG9wOiAxMCU7IH1cXG4gIC5kZXZpY2UuYm90LXJpZ2h0IHtcXG4gICAgcmlnaHQ6IDEwJTtcXG4gICAgYm90dG9tOiAyMCU7IH1cXG4gIC5kZXZpY2UuYm90LWxlZnQge1xcbiAgICBsZWZ0OiAxMCU7XFxuICAgIGJvdHRvbTogMjAlOyB9XFxuICAuZGV2aWNlOmhvdmVyIHtcXG4gICAgYm9yZGVyOiAycHggc29saWQgYmx1ZTsgfVxcblwiO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMT5QbGVhc2Ugc2VsZWN0IGEgcm9vbTwvaDE+XFxuXCI7XG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi4vQ29tcG9uZW50JztcblxuXG5leHBvcnQgY2xhc3MgSG9tZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ09NUE9ORU5UX05BTUUgPSAnaG9tZSc7XG5cbiAgICBwcml2YXRlIGNvbW1vbklzc3VlTGlzdDtcbiAgICBwcml2YXRlIHRlbXBsYXRlU2VsZWN0b3I6IEhUTUxFbGVtZW50O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbW1vbklzc3VlczogYW55KSB7XG4gICAgICAgIHN1cGVyKEhvbWUuQ09NUE9ORU5UX05BTUUpO1xuICAgICAgICB0aGlzLmNvbW1vbklzc3VlTGlzdCA9IGNvbW1vbklzc3VlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlVmlld01vZGVsKHZpZXdNb2RlbDogYW55KSB7XG4gICAgfVxuXG4gICAgcHVibGljIG9uUmVuZGVyKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVuZGVyaW5nIGhvbWUnKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdob21lIGxvYWRlZCcpO1xuICAgICAgICBsZXQgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZS1zZWxlY3QnKTtcbiAgICAgICAgbGV0IGIgPSBlbGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnNvbGUubG9nKGIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkluaXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbml0IGhvbWUnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGV2aWNlQ2xpY2soZGV2aWNlOiBzdHJpbmcpIHtcbiAgICAgICAgLy8gbGV0IHRlbXBsYXRlU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGUtc2VsZWN0Jyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRlbXBsYXRlU2VsZWN0b3IpO1xuICAgICAgICAvLyBpZiAodGVtcGxhdGVTZWxlY3RvciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIC8vICAgICB0aGlzLnRlbXBsYXRlU2VsZWN0b3IgPSB0ZW1wbGF0ZVNlbGVjdG9yO1xuICAgICAgICAvLyAgICAgdGVtcGxhdGVTZWxlY3Rvci5vbmNoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuZ2VkJyk7XG4gICAgICAgIC8vICAgICB9O1xuICAgICAgICAvLyB9XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snICsgZGV2aWNlKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLnJvb20tY29udGFpbmVyIHtcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlOyB9XFxuXFxuLnRhYmxlLWdyb3VwIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiA0MCU7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGhlaWdodDogMzAlO1xcbiAgbWFyZ2luOiA0JSA0JTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cXG4gIC50YWJsZS1ncm91cC50ZWFjaGVyLWRlc2sge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIGJvdHRvbTogNSU7XFxuICAgIGhlaWdodDogMTAlO1xcbiAgICB3aWR0aDogMjAlO1xcbiAgICBsZWZ0OiA2MCU7XFxuICAgIG1hcmdpbjogMDsgfVxcblxcbi5kZXZpY2Uge1xcbiAgaGVpZ2h0OiA1MHB4O1xcbiAgd2lkdGg6IDUwcHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXG4gIGN1cnNvcjogcG9pbnRlcjsgfVxcbiAgLmRldmljZS50b3Age1xcbiAgICBsZWZ0OiAyMCU7XFxuICAgIHRvcDogMTAlOyB9XFxuICAuZGV2aWNlLmJvdC1yaWdodCB7XFxuICAgIHJpZ2h0OiAxMCU7XFxuICAgIGJvdHRvbTogMjAlOyB9XFxuICAuZGV2aWNlLmJvdC1sZWZ0IHtcXG4gICAgbGVmdDogMTAlO1xcbiAgICBib3R0b206IDIwJTsgfVxcbiAgLmRldmljZTpob3ZlciB7XFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsdWU7IH1cXG5cIjtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJzb21lIFJvb20sIG9yIG5vdCFcXG5cXG48ZGl2IGNsYXNzPVxcXCJyb29tLWNvbnRhaW5lclxcXCI+XFxuXFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCI+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIj48L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiPjwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXAgdGVhY2hlci1kZXNrXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCI+PC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xuIiwiaW1wb3J0IHtSb29tTGF5b3V0fSBmcm9tICcuLi9yb29tL1Jvb21MYXlvdXQnO1xuaW1wb3J0IHtJc3N1ZUZvcm1Db250YWluZXJ9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9Jc3N1ZUZvcm1Db250YWluZXInO1xuaW1wb3J0IHtVc2VyQWN0aW9uc30gZnJvbSAnLi4vLi4vLi4vVXNlckFjdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgUm9vbUNpcmN1bGFyIGV4dGVuZHMgUm9vbUxheW91dCB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT01QT05FTlRfTkFNRSA9ICdyb29tQ2lyY3VsYXInO1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbW9uSXNzdWVzOiBhbnksIGlzc3VlRm9ybUNvbnRhaW5lcjogSXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9uczogVXNlckFjdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoY29tbW9uSXNzdWVzLCBpc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zLCBSb29tQ2lyY3VsYXIuQ09NUE9ORU5UX05BTUUpO1xuICAgIH1cblxufVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiLnJvb20tY29udGFpbmVyIHtcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMDAlOyB9XFxuXFxuLnRhYmxlLWdyb3VwIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGhlaWdodDogMzAlO1xcbiAgbWFyZ2luOiA0JSA0JTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiA0MCU7IH1cXG4gIC50YWJsZS1ncm91cC50ZWFjaGVyLWRlc2sge1xcbiAgICBib3R0b206IDUlO1xcbiAgICBoZWlnaHQ6IDEwJTtcXG4gICAgbGVmdDogNjAlO1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDIwJTsgfVxcblxcbi5kZXZpY2Uge1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBoZWlnaHQ6IDUwcHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aWR0aDogNTBweDsgfVxcbiAgLmRldmljZS50b3Age1xcbiAgICBsZWZ0OiAyMCU7XFxuICAgIHRvcDogMTAlOyB9XFxuICAuZGV2aWNlLmJvdC1yaWdodCB7XFxuICAgIGJvdHRvbTogMjAlO1xcbiAgICByaWdodDogMTAlOyB9XFxuICAuZGV2aWNlLmJvdC1sZWZ0IHtcXG4gICAgYm90dG9tOiAyMCU7XFxuICAgIGxlZnQ6IDEwJTsgfVxcbiAgLmRldmljZTpob3ZlciB7XFxuICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsdWU7IH1cXG5cIjtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJyb29tLWNvbnRhaW5lclxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtMVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxKVxcXCI+MTwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMilcXFwiPjI8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygzKVxcXCI+MzwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS00XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDQpXFxcIj40PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtNVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg1KVxcXCI+NTwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS02XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDYpXFxcIj42PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTdcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNylcXFwiPjc8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS04XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDgpXFxcIj44PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTlcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOSlcXFwiPjk8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtMTBcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTApXFxcIj4xMDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTExXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDExKVxcXCI+MTE8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtMTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTIpXFxcIj4xMjwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXAgdGVhY2hlci1kZXNrXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZVxcXCIgaWQ9XFxcImRldmljZS0xM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMylcXFwiPjEzPC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsIGRpc2FibGVkXFxcIiBpZD1cXFwibW9kYWxcXFwiPlxcbiAgICA8aDI+bmV1ZW4gRmVobGVyIGYmdXVtbDtyIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5pc3N1ZURldmljZUlkXFxcIj48L3NwYW4+IG1lbGRlbjwvaDI+XFxuICAgIDxmb3JtPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIFRlbXBsYXRlczogPHNlbGVjdFxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGlkPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczogJHBhcmVudC5jb21tb25Jc3N1ZU5hbWVMaXN0LCBzZWxlY3RlZE9wdGlvbnM6ICRwYXJlbnQuc2VsZWN0ZWRDb21tb25Jc3N1ZVxcXCJcXG4gICAgICAgID5cXG4gICAgICAgICAgICA8b3B0aW9uIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvb3B0aW9uPlxcbiAgICAgICAgPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvbiB0ZW1wbGF0ZS1zYXZlXFxcIiBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNhdmVBc1RlbXBsYXRlKClcXFwiPnNwZWljaGVybjwvYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmV0cmVmZjogPGlucHV0IGNsYXNzPVxcXCJ0aXRsZVxcXCIgbmFtZT1cXFwidGl0bGVcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQudGl0bGVcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nOiA8dGV4dGFyZWEgY2xhc3M9XFxcImRlc2NyaXB0aW9uXFxcIiBuYW1lPVxcXCJkZXNjcmlwdGlvblxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5kZXNjcmlwdGlvblxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgd2VpdGVyZSBFbXAmYXVtbDtuZ2VyOiA8dGV4dGFyZWEgY2xhc3M9XFxcInJlY2lwaWVudHNcXFwiIG5hbWU9XFxcInJlY2lwaWVudHNcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQuaXNzdWVSZWNpcGllbnRzXFxcIj48L3RleHRhcmVhPjxzcGFuXFxuICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiZWluZSBMaXN0ZSBhbiB6dXMmYXVtbDt0emxpY2hlbiBFbXAmYXVtbDtuZ2Vybi4gRW1haWwgYWRyZXNzZW4gc2luZCBtaXQgZWluZW0gS29tbWEgdHJlbm5lbi5cXFwiXFxuICAgICAgICA+W2ldPC9zcGFuPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDwhLS0vL2RhdGEgYmluZCBmb3JlYWNoIHJlY2lwaWVudHMtbGlzdC0tPlxcbiAgICAgICAgPCEtLWFkZGl0aW9uYWwgcmVjaXBpZW50czogLS0+XFxuICAgICAgICA8IS0tPGRpdiBjbGFzcz1cXFwicmVjaXBpZW50cy1saXN0XFxcIj4tLT5cXG4gICAgICAgIDwhLS08ZGl2IGNsYXNzPVxcXCJjbGFzc1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5yZW1vdmVSZWNpcGllbnQoJGluZGV4KVxcXCI+PC9kaXY+LS0+XFxuICAgICAgICA8IS0tPC9kaXY+LS0+XFxuXFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhYm9ydFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jYW5jZWxJc3N1ZSgpXFxcIj5hYmJyZWNoZW48L2E+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmFkZElzc3VlKClcXFwiPm9rPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgPC9mb3JtPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcImlzc3VlLWxpc3RcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpc3N1ZS1pdGVtc1xcXCIgZGF0YS1iaW5kPVxcXCJmb3JlYWNoOiAkcGFyZW50Lmlzc3VlTGlzdFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWl0ZW1cXFwiPlxcbiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IGRlc2NyaXB0aW9uLnN1YnN0cigwLCAxMCkgKyAnLi4uJ1xcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGV2aWNlSWRcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICBFbXBmJmF1bWw7bmdlcjogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiByZWNpcGllbnRzXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiByZW1vdmVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGVsZXRlSXNzdWUoaXNzdWVJZClcXFwiPnJlbW92ZTwvYT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYWN0aW9uc1xcXCI+XFxuICAgICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGFjdGlvbi1jbGVhclxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jbGVhcklzc3VlcygpXFxcIj5Qcm9ibGVtYmVyaWNodGxpc3RlIGxlZXJlbjwvYT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLXNlbmRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2VuZElzc3VlcygpXFxcIj5Qcm9ibGVtYmVyaWNodCBhYnNlbmRlbjwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4iLCJpbXBvcnQge1Jvb21MYXlvdXR9IGZyb20gJy4uL3Jvb20vUm9vbUxheW91dCc7XG5pbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBSb29tR3JvdXBzQW5nbGVkIGV4dGVuZHMgUm9vbUxheW91dCB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT01QT05FTlRfTkFNRSA9ICdyb29tR3JvdXBzQW5nbGVkJztcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbW1vbklzc3VlczogYW55LCBpc3N1ZUZvcm1Db250YWluZXI6IElzc3VlRm9ybUNvbnRhaW5lciwgdXNlckFjdGlvbnM6IFVzZXJBY3Rpb25zKSB7XG4gICAgICAgIHN1cGVyKGNvbW1vbklzc3VlcywgaXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9ucywgUm9vbUdyb3Vwc0FuZ2xlZC5DT01QT05FTlRfTkFNRSk7XG4gICAgfVxuXG59XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIucm9vbS1jb250YWluZXIge1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7IH1cXG5cXG4ubW9kYWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGxlZnQ6IDUwJTtcXG4gIHBhZGRpbmc6IDIwcHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgd2lkdGg6IDM1MHB4OyB9XFxuICAubW9kYWwuZGlzYWJsZWQge1xcbiAgICBkaXNwbGF5OiBub25lOyB9XFxuICAubW9kYWwgLnRlbXBsYXRlLXNlbGVjdCB7XFxuICAgIG1hcmdpbjogNXB4IDA7XFxuICAgIHdpZHRoOiAxMDAlOyB9XFxuICAubW9kYWwgLnRlbXBsYXRlLXNhdmUge1xcbiAgICBmbG9hdDogcmlnaHQ7IH1cXG4gIC5tb2RhbCAudGl0bGUge1xcbiAgICBtYXJnaW46IDVweCAwO1xcbiAgICB3aWR0aDogMTAwJTsgfVxcbiAgLm1vZGFsIC5yZWNpcGllbnRzIHtcXG4gICAgaGVpZ2h0OiAyMXB4O1xcbiAgICBtYXJnaW46IDAgMCAyMHB4O1xcbiAgICB3aWR0aDogMzQwcHg7IH1cXG4gIC5tb2RhbCAuZGVzY3JpcHRpb24ge1xcbiAgICBoZWlnaHQ6IDkwcHg7XFxuICAgIHdpZHRoOiAzMzBweDsgfVxcbiAgLm1vZGFsIC5hYm9ydCB7XFxuICAgIGZsb2F0OiByaWdodDsgfVxcbiAgLm1vZGFsIC5jb25maXJtIHtcXG4gICAgZmxvYXQ6IGxlZnQ7IH1cXG4gIC5tb2RhbCBoMiB7XFxuICAgIG1hcmdpbjogMCAwIDIwcHg7IH1cXG5cXG4uaXNzdWUtbGlzdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM0ZTUzNzE7XFxuICBib3R0b206IDA7XFxuICBoZWlnaHQ6IDIwMHB4O1xcbiAgbGVmdDogNTAlO1xcbiAgbWluLWhlaWdodDogMjAwcHg7XFxuICBtaW4td2lkdGg6IDgxMHB4O1xcbiAgb3ZlcmZsb3c6IHNjcm9sbDtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApO1xcbiAgd2lkdGg6IDUwMHB4OyB9XFxuICAuaXNzdWUtbGlzdCAucmVtb3ZlIHtcXG4gICAgZmxvYXQ6IHJpZ2h0O1xcbiAgICBtYXJnaW4tdG9wOiAtNXB4OyB9XFxuXFxuLmxpc3QtaXRlbSB7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U1ZTVlNTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwYWRkaW5nOiAxMHB4OyB9XFxuXFxuLmFjdGlvbnMge1xcbiAgYm90dG9tOiAwOyB9XFxuICAuYWN0aW9ucyAuYnV0dG9uIHtcXG4gICAgZmxvYXQ6IGxlZnQ7XFxuICAgIHdpZHRoOiA1MCU7IH1cXG5cXG4udGFibGUtZ3JvdXAge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDMwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgaGVpZ2h0OiA0MCU7XFxuICBtYXJnaW46IDQlIDEwJTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cXG4gIC50YWJsZS1ncm91cC5leHRlbmRlZCB7XFxuICAgIGhlaWdodDogNDUlO1xcbiAgICBtYXJnaW4tdG9wOiAtMjBweDsgfVxcbiAgICAudGFibGUtZ3JvdXAuZXh0ZW5kZWQgLmRldmljZS5ib3QtcmlnaHQge1xcbiAgICAgIGJvdHRvbTogNDAlOyB9XFxuICAgIC50YWJsZS1ncm91cC5leHRlbmRlZCAuZGV2aWNlLmJvdC1sZWZ0IHtcXG4gICAgICBib3R0b206IDQwJTsgfVxcbiAgICAudGFibGUtZ3JvdXAuZXh0ZW5kZWQgLmRldmljZS5ib3R0b20ge1xcbiAgICAgIGJvdHRvbTogMTAlO1xcbiAgICAgIHJpZ2h0OiAyMCU7IH1cXG5cXG4uZGV2aWNlIHtcXG4gIGhlaWdodDogNTBweDtcXG4gIHdpZHRoOiA1MHB4O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyOiAycHggc29saWQgZ3JlZW47XFxuICBjdXJzb3I6IHBvaW50ZXI7IH1cXG4gIC5kZXZpY2UudG9wIHtcXG4gICAgbGVmdDogMjAlO1xcbiAgICB0b3A6IDEwJTsgfVxcbiAgLmRldmljZS5ib3QtcmlnaHQge1xcbiAgICByaWdodDogMTAlO1xcbiAgICBib3R0b206IDIwJTsgfVxcbiAgLmRldmljZS5ib3QtbGVmdCB7XFxuICAgIGxlZnQ6IDEwJTtcXG4gICAgYm90dG9tOiAyMCU7IH1cXG4gIC5kZXZpY2U6aG92ZXIge1xcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibHVlOyB9XFxuICAuZGV2aWNlLmlzc3VlIHtcXG4gICAgYm9yZGVyOiAycHggc29saWQgcmVkOyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgxPlJhdW06IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5yb29tSWRcXFwiPjwvc3Bhbj4gQW5zcHJlY2hzcGFydG5lcjogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcGFyZW50LnJvb21Db250YWN0XFxcIj48L3NwYW4+PC9oMT5cXG5cXG48ZGl2IGNsYXNzPVxcXCJyb29tLWNvbnRhaW5lclxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtMVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxKVxcXCI+MTwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMilcXFwiPjI8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygzKVxcXCI+MzwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGFibGUtZ3JvdXBcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIHRvcFxcXCIgaWQ9XFxcImRldmljZS00XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDQpXFxcIj40PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LWxlZnRcXFwiIGlkPVxcXCJkZXZpY2UtNVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljayg1KVxcXCI+NTwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1yaWdodFxcXCIgaWQ9XFxcImRldmljZS02XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDYpXFxcIj42PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1ncm91cFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgdG9wXFxcIiBpZD1cXFwiZGV2aWNlLTdcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soNylcXFwiPjc8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtbGVmdFxcXCIgaWQ9XFxcImRldmljZS04XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDgpXFxcIj44PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXZpY2UgYm90LXJpZ2h0XFxcIiBpZD1cXFwiZGV2aWNlLTlcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soOSlcXFwiPjk8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLWdyb3VwIGV4dGVuZGVkXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSB0b3BcXFwiIGlkPVxcXCJkZXZpY2UtMTBcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTApXFxcIj4xMDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdC1sZWZ0XFxcIiBpZD1cXFwiZGV2aWNlLTExXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmRldmljZUNsaWNrKDExKVxcXCI+MTE8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImRldmljZSBib3QtcmlnaHRcXFwiIGlkPVxcXCJkZXZpY2UtMTJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGV2aWNlQ2xpY2soMTIpXFxcIj4xMjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGV2aWNlIGJvdHRvbVxcXCIgaWQ9XFxcImRldmljZS0xM1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5kZXZpY2VDbGljaygxMylcXFwiPjEzPC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcIm1vZGFsIGRpc2FibGVkXFxcIiBpZD1cXFwibW9kYWxcXFwiPlxcbiAgICA8aDI+bmV1ZW4gRmVobGVyIGYmdXVtbDtyIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHBhcmVudC5pc3N1ZURldmljZUlkXFxcIj48L3NwYW4+IG1lbGRlbjwvaDI+XFxuICAgIDxmb3JtPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICAgIFRlbXBsYXRlczogPHNlbGVjdFxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGlkPVxcXCJ0ZW1wbGF0ZS1zZWxlY3RcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczogJHBhcmVudC5jb21tb25Jc3N1ZU5hbWVMaXN0LCBzZWxlY3RlZE9wdGlvbnM6ICRwYXJlbnQuc2VsZWN0ZWRDb21tb25Jc3N1ZVxcXCJcXG4gICAgICAgID5cXG4gICAgICAgICAgICA8b3B0aW9uIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvb3B0aW9uPlxcbiAgICAgICAgPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvbiB0ZW1wbGF0ZS1zYXZlXFxcIiBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LnNhdmVBc1RlbXBsYXRlKClcXFwiPnNwZWljaGVybjwvYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmV0cmVmZjogPGlucHV0IGNsYXNzPVxcXCJ0aXRsZVxcXCIgbmFtZT1cXFwidGl0bGVcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQudGl0bGVcXFwiID5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgQmVzY2hyZWlidW5nOiA8dGV4dGFyZWEgY2xhc3M9XFxcImRlc2NyaXB0aW9uXFxcIiBuYW1lPVxcXCJkZXNjcmlwdGlvblxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTogJHBhcmVudC5kZXNjcmlwdGlvblxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgICA8YnI+XFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgd2VpdGVyZSBFbXAmYXVtbDtuZ2VyOiA8dGV4dGFyZWEgY2xhc3M9XFxcInJlY2lwaWVudHNcXFwiIG5hbWU9XFxcInJlY2lwaWVudHNcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6ICRwYXJlbnQuaXNzdWVSZWNpcGllbnRzXFxcIj48L3RleHRhcmVhPjxzcGFuXFxuICAgICAgICAgICAgY2xhc3M9XFxcInRvb2x0aXAgcG9wUmlnaHRcXFwiIGRhdGEtdG9vbHRpcD1cXFwiZWluZSBMaXN0ZSBhbiB6dXMmYXVtbDt0emxpY2hlbiBFbXAmYXVtbDtuZ2Vybi4gRW1haWwgYWRyZXNzZW4gc2luZCBtaXQgZWluZW0gS29tbWEgdHJlbm5lbi5cXFwiXFxuICAgICAgICA+W2ldPC9zcGFuPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgIDwhLS0vL2RhdGEgYmluZCBmb3JlYWNoIHJlY2lwaWVudHMtbGlzdC0tPlxcbiAgICAgICAgPCEtLWFkZGl0aW9uYWwgcmVjaXBpZW50czogLS0+XFxuICAgICAgICA8IS0tPGRpdiBjbGFzcz1cXFwicmVjaXBpZW50cy1saXN0XFxcIj4tLT5cXG4gICAgICAgIDwhLS08ZGl2IGNsYXNzPVxcXCJjbGFzc1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5yZW1vdmVSZWNpcGllbnQoJGluZGV4KVxcXCI+PC9kaXY+LS0+XFxuICAgICAgICA8IS0tPC9kaXY+LS0+XFxuXFxuICAgICAgICA8bGFiZWw+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBhYm9ydFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jYW5jZWxJc3N1ZSgpXFxcIj5hYmJyZWNoZW48L2E+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiBjb25maXJtXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmFkZElzc3VlKClcXFwiPm9rPC9hPlxcbiAgICAgICAgPC9sYWJlbD5cXG4gICAgPC9mb3JtPlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcImlzc3VlLWxpc3RcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpc3N1ZS1pdGVtc1xcXCIgZGF0YS1iaW5kPVxcXCJmb3JlYWNoOiAkcGFyZW50Lmlzc3VlTGlzdFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWl0ZW1cXFwiPlxcbiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IGRlc2NyaXB0aW9uLnN1YnN0cigwLCAxMCkgKyAnLi4uJ1xcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIEdlciZhdW1sO3Q6IDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogZGV2aWNlSWRcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICBFbXBmJmF1bWw7bmdlcjogPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiByZWNpcGllbnRzXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImJ1dHRvbiByZW1vdmVcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuZGVsZXRlSXNzdWUoaXNzdWVJZClcXFwiPnJlbW92ZTwvYT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwiYWN0aW9uc1xcXCI+XFxuICAgICAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGFjdGlvbi1jbGVhclxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jbGVhcklzc3VlcygpXFxcIj5Qcm9ibGVtYmVyaWNodGxpc3RlIGxlZXJlbjwvYT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJidXR0b24gYWN0aW9uLXNlbmRcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQuc2VuZElzc3VlcygpXFxcIj5Qcm9ibGVtYmVyaWNodCBhYnNlbmRlbjwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCI7XG4iLCJpbXBvcnQge0lzc3VlRm9ybUNvbnRhaW5lcn0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL0lzc3VlRm9ybUNvbnRhaW5lcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi8uLi9Vc2VyQWN0aW9ucyc7XG5pbXBvcnQge1Jvb21MYXlvdXR9IGZyb20gJy4uL3Jvb20vUm9vbUxheW91dCc7XG5cblxuZXhwb3J0IGNsYXNzIFJvb21Hcm91cHMgZXh0ZW5kcyBSb29tTGF5b3V0IHtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTVBPTkVOVF9OQU1FID0gJ3Jvb21Hcm91cHMnO1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbW9uSXNzdWVzOiBhbnksIGlzc3VlRm9ybUNvbnRhaW5lcjogSXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9uczogVXNlckFjdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoY29tbW9uSXNzdWVzLCBpc3N1ZUZvcm1Db250YWluZXIsIHVzZXJBY3Rpb25zLCBSb29tR3JvdXBzLkNPTVBPTkVOVF9OQU1FKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuLi9Db21wb25lbnQnO1xuaW1wb3J0ICogYXMga28gZnJvbSAna25vY2tvdXQnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQge0lzc3VlfSBmcm9tICcuLi8uLi8uLi9jb21tb24vSXNzdWUnO1xuaW1wb3J0IHtJc3N1ZUZvcm1Db250YWluZXJ9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9Jc3N1ZUZvcm1Db250YWluZXInO1xuaW1wb3J0IHtVc2VyQWN0aW9uc30gZnJvbSAnLi4vLi4vLi4vVXNlckFjdGlvbnMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm9vbUxheW91dCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgcHVibGljIHJvb21JZDogc3RyaW5nO1xuICAgIHB1YmxpYyB0aXRsZSA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHB1YmxpYyBkZXNjcmlwdGlvbiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHB1YmxpYyBpc3N1ZUxpc3QgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIHB1YmxpYyByb29tQ29udGFjdDogc3RyaW5nO1xuICAgIHB1YmxpYyBzZWxlY3RlZENvbW1vbklzc3VlID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgcHVibGljIGNvbW1vbklzc3VlTmFtZUxpc3Q6IEFycmF5PGFueT4gPSBbJ0ZlaGxlciBUZW1wbGF0ZSddO1xuICAgIHByaXZhdGUgY29tbW9uSXNzdWVMaXN0O1xuICAgIHByaXZhdGUgdGVtcGxhdGVTZWxlY3RvcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpc3N1ZUZvcm1Db250YWluZXI6IElzc3VlRm9ybUNvbnRhaW5lcjtcbiAgICBwcml2YXRlIGlzc3VlRGV2aWNlSWQ6IE9ic2VydmFibGU8bnVtYmVyPiA9IGtvLm9ic2VydmFibGUoMCk7XG4gICAgcHJpdmF0ZSBpc3N1ZVJlY2lwaWVudHMgPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBwcml2YXRlIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucztcbiAgICBwcml2YXRlIGlzc3VlQ291bnRlciA9IDA7XG4gICAgcHJpdmF0ZSByb29tOiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbW9uSXNzdWVzOiBhbnksIGlzc3VlRm9ybUNvbnRhaW5lcjogSXNzdWVGb3JtQ29udGFpbmVyLCB1c2VyQWN0aW9uczogVXNlckFjdGlvbnMsIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgc3VwZXIoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIHRoaXMuY29tbW9uSXNzdWVMaXN0ID0gY29tbW9uSXNzdWVzO1xuICAgICAgICB0aGlzLmlzc3VlRm9ybUNvbnRhaW5lciA9IGlzc3VlRm9ybUNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy51c2VyQWN0aW9ucyA9IHVzZXJBY3Rpb25zO1xuXG4gICAgICAgIGZvciAobGV0IGNvbW1vbklzc3VlIG9mIGNvbW1vbklzc3Vlcykge1xuICAgICAgICAgICAgdGhpcy5jb21tb25Jc3N1ZU5hbWVMaXN0LnB1c2goY29tbW9uSXNzdWUudGl0bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZENvbW1vbklzc3VlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZElzc3VlID0gKHRoaXMuY29tbW9uSXNzdWVMaXN0LmZpbHRlcigoY29tbW9uSXNzdWUpID0+IGNvbW1vbklzc3VlLnRpdGxlID09PSBuZXdWYWx1ZVswXSkpWzBdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RlZElzc3VlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24oc2VsZWN0ZWRJc3N1ZS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5pc3N1ZVJlY2lwaWVudHMoc2VsZWN0ZWRJc3N1ZS5hZGRpdGlvbmFsUmVjaXBpZW50cyk7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZShzZWxlY3RlZElzc3VlLnRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZUFzVGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3Q29tbW9uSXNzdWUgPSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24ucGVlaygpLFxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxSZWNpcGllbnRzOiB0aGlzLmlzc3VlUmVjaXBpZW50cy5wZWVrKCksXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMudGl0bGUucGVlaygpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnVzZXJBY3Rpb25zXG4gICAgICAgICAgICAgICAgLnNlbmROZXdDb21tb25Jc3N1ZVRvU2VydmVyKG5ld0NvbW1vbklzc3VlKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3VuYWJsZSB0byBzZW5kIG5ldyBjb21tb24gaXNzdWUgdG8gU2VydmVyLCBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFySXNzdWVzKCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXZpY2UnKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gZWxlbWVudHMuaXRlbShpbmRleCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCdpc3N1ZScsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pc3N1ZUxpc3QoW10pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZW5kSXNzdWVzKCkge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNzdWVMaXN0LnBlZWsoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyQWN0aW9ucy5zZW5kSXNzdWVzVG9NYWlsU2VydmVyKHRoaXMuaXNzdWVMaXN0LnBlZWsoKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odGhpcy5pc3N1ZUxpc3QoW10pKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndW5hYmxlIHRvIHNlbmQgSXNzdWVzIHRvIFNlcnZlciwgcGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdubyBpc3N1ZXMgdG8gc2VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWxldGVJc3N1ZShpc3N1ZUlkKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3SXNzdWVMaXN0ID0gdGhpcy5pc3N1ZUxpc3QucGVlaygpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbmV3SXNzdWVMaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBpc3N1ZSA9IG5ld0lzc3VlTGlzdFtpbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKGlzc3VlLmlzc3VlSWQgPT09IGlzc3VlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NwbGljaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWxldGVkSXNzdWUgPSBuZXdJc3N1ZUxpc3Quc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZURldmljZUlzc3VlQ2xhc3NJZk5vTG9uZ2VySW5Jc3N1ZUxpc3QoZGVsZXRlZElzc3VlWzBdLmRldmljZUlkLCBuZXdJc3N1ZUxpc3QpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVMaXN0KG5ld0lzc3VlTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGV2aWNlSGFzSXNzdWVzKGRldmljZUlkKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGlzc3VlIG9mIHRoaXMuaXNzdWVMaXN0LnBlZWsoKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc3N1ZS5kZXZpY2VJZCA9PT0gZGV2aWNlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGNhbmNlbElzc3VlKCkge1xuICAgICAgICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XG4gICAgICAgIG1vZGFsRWxlbWVudC5jbGFzc05hbWUgPSBtb2RhbEVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoJ2FjdGl2ZScsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIHRoaXMucmVzZXRGb3JtRmllbGRzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZElzc3VlKCkge1xuICAgICAgICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc3N1ZURldmljZUlkLnBlZWsoKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxldCBpc3N1ZSA9IG5ldyBJc3N1ZSgpO1xuICAgICAgICAgICAgICAgIGlzc3VlLnRpdGxlID0gdGhpcy50aXRsZS5wZWVrKCk7XG4gICAgICAgICAgICAgICAgaXNzdWUuZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uLnBlZWsoKTtcbiAgICAgICAgICAgICAgICAvLyB0b2RvIGZpeG1lXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5pc3N1ZVJlY2lwaWVudHMucGVlaygpKTtcbiAgICAgICAgICAgICAgICAvLyBpc3N1ZS5yZWNpcGllbnRzID0gKHRoaXMucm9vbS5jb250YWN0TWFpbCArICcsJyArIHRoaXMuaXNzdWVSZWNpcGllbnRzLnBlZWsoKSkuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzc3VlUmVjaXBpZW50cy5wZWVrKCkuaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWUucmVjaXBpZW50cyA9ICh0aGlzLmlzc3VlUmVjaXBpZW50cy5wZWVrKCkpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWUucmVjaXBpZW50cyA9IFt0aGlzLmlzc3VlUmVjaXBpZW50cy5wZWVrKCldO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlzc3VlLmRldmljZUlkID0gdGhpcy5pc3N1ZURldmljZUlkLnBlZWsoKTtcbiAgICAgICAgICAgICAgICBpc3N1ZS5pc3N1ZUlkID0gdGhpcy5pc3N1ZUNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICBpc3N1ZS5yb29tSWQgPSB0aGlzLnJvb21JZDtcbiAgICAgICAgICAgICAgICBsZXQgZGV2aWNlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXZpY2UtJyArIGlzc3VlLmRldmljZUlkKTtcblxuICAgICAgICAgICAgICAgIGRldmljZUVsZW1lbnQuY2xhc3NOYW1lICs9ICcgaXNzdWUnO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXNzdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVMaXN0LnB1c2goaXNzdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNzdWVGb3JtQ29udGFpbmVyLmFkZElzc3VlKGlzc3VlKTtcbiAgICAgICAgICAgICAgICBtb2RhbEVsZW1lbnQuY2xhc3NOYW1lID0gbW9kYWxFbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCdhY3RpdmUnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0Rm9ybUZpZWxkcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkxvYWQocm9vbSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyb29tLmNvbnRhY3QpO1xuICAgICAgICB0aGlzLnJvb21JZCA9IHJvb20ucm9vbUlkO1xuICAgICAgICB0aGlzLnJvb21Db250YWN0ID0gcm9vbS5jb250YWN0O1xuICAgICAgICB0aGlzLnJvb20gPSByb29tO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXZpY2VDbGljayhkZXZpY2U6IHN0cmluZykge1xuICAgICAgICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljaycgKyBkZXZpY2UpO1xuICAgICAgICAgICAgbW9kYWxFbGVtZW50LmNsYXNzTmFtZSA9IG1vZGFsRWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgnZGlzYWJsZWQnLCAnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmlzc3VlRGV2aWNlSWQocGFyc2VJbnQoZGV2aWNlKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldEZvcm1GaWVsZHMoKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24oJycpO1xuICAgICAgICB0aGlzLmlzc3VlUmVjaXBpZW50cygnJyk7XG4gICAgICAgIHRoaXMudGl0bGUoJycpO1xuICAgICAgICB0aGlzLmlzc3VlRGV2aWNlSWQoMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVEZXZpY2VJc3N1ZUNsYXNzSWZOb0xvbmdlckluSXNzdWVMaXN0KGRldmljZUlkLCBpc3N1ZXMpIHtcbiAgICAgICAgbGV0IGlzc3Vlc1dpdGhDdXJyZW50RGV2aWNlSWQgPSBpc3N1ZXMuZmlsdGVyKChpc3N1ZSkgPT4gaXNzdWUuZGV2aWNlSWQgPT09IGRldmljZUlkKTtcblxuICAgICAgICBpZiAoaXNzdWVzV2l0aEN1cnJlbnREZXZpY2VJZC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXZpY2UtJyArIGRldmljZUlkKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZSgnaXNzdWUnLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIuc2lkZWJhci1jb250YWluZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM5M2Q1MztcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHdpZHRoOiAyNTBweDsgfVxcbiAgQG1lZGlhIChtaW4td2lkdGg6IDkwMHB4KSB7XFxuICAgIC5zaWRlYmFyLWNvbnRhaW5lciB7XFxuICAgICAgd2lkdGg6IDM1MHB4OyB9IH1cXG5cXG4uc2lkZWJhciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwYWRkaW5nOiAyNXB4OyB9XFxuXFxuLnNpZGViYXItbGlzdCB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiAxMDAlOyB9XFxuICAuc2lkZWJhci1saXN0IC5pY29uIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICAgIGZsb2F0OiBsZWZ0O1xcbiAgICBtYXJnaW4tbGVmdDogMTVweDtcXG4gICAgbWFyZ2luLXRvcDogNXB4OyB9XFxuICAuc2lkZWJhci1saXN0IGEge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBwYWRkaW5nOiA1cHggMzVweDtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgICB3aWR0aDogMTAwJTsgfVxcbiAgLnNpZGViYXItbGlzdCAuaXRlbSB7XFxuICAgIG1hcmdpbjogNXB4IDA7IH1cXG4gICAgLnNpZGViYXItbGlzdCAuaXRlbS5hY3RpdmUgYSB7XFxuICAgICAgYm9yZGVyLWxlZnQ6IDVweCBzb2xpZCAjNGVhMWZmOyB9XFxuICAgIC5zaWRlYmFyLWxpc3QgLml0ZW06aG92ZXIge1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0ZTUzNzE7IH1cXG4gIC5zaWRlYmFyLWxpc3QgLnNldGl0ZW0ge1xcbiAgICBtYXJnaW4tbGVmdDogNXB4OyB9XFxuXCI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPCEtLTxkaXYgZGF0YS1iaW5kPVxcXCJ0ZXh0OiBKU09OLnN0cmluZ2lmeSgkcGFyZW50KVxcXCI+PC9kaXY+LS0+XFxuXFxuPG5hdiBjbGFzcz1cXFwic2lkZWJhci1saXN0XFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6IHtkYXRhOiB3aW5nTGlzdCwgYXM6ICd3aW5nJ31cXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJpdGVtIGFjdGl2ZVxcXCI+XFxuICAgICAgICA8YSBocmVmPVxcXCIjXFxcIj48c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHdpbmdcXFwiPjwvc3Bhbj48L2E+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8ZGl2IGRhdGEtYmluZD1cXFwiZm9yZWFjaDoge2RhdGE6ICRwYXJlbnQuZ2V0Um9vbXNCeVdpbmcod2luZyksIGFzOiAncm9vbSd9XFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIml0ZW0gc2V0aXRlbSBhY3RpdmVcXFwiPlxcbiAgICAgICAgICAgIDxhIGRhdGEtYmluZD1cXFwiYXR0cjoge2hyZWY6ICc/cGFnZT1yb29tJnJvb21JZD0nK3Jvb20ucm9vbUlkfVxcXCI+PHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiByb29tLnJvb21JZFxcXCI+PC9zcGFuPjwvYT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L25hdj5cXG5cIjtcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuLi9Db21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgU2lkZWJhciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT01QT05FTlRfTkFNRSA9ICdzaWRlYmFyJztcbiAgICBwdWJsaWMgcm9vbXM6IEFycmF5PGFueT47XG4gICAgcHVibGljIHdpbmdMaXN0ID0gW107XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3Iocm9vbXM6IGFueSkge1xuICAgICAgICBzdXBlcihTaWRlYmFyLkNPTVBPTkVOVF9OQU1FKTtcbiAgICAgICAgdGhpcy5yb29tcyA9IHJvb21zO1xuICAgICAgICB0aGlzLndpbmdMaXN0ID0gdGhpcy5nZXRVbmlxdWVLZXlzKHJvb21zLCAnd2luZycpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGlmIChhIDwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGEgPiBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBnZXRGbG9vckxpc3RGb3JXaW5nKHdpbmc6IHN0cmluZykge1xuICAgICAgICBsZXQgd2luZ1Jvb21zID0gdGhpcy5yb29tcy5maWx0ZXIoKHJvb20pID0+IHJvb20ud2luZyA9PT0gd2luZyk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFVuaXF1ZUtleXMod2luZ1Jvb21zLCAnZmxvb3InKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Um9vbXMod2luZywgZmxvb3IpIHtcblxuICAgICAgICBsZXQgZmlsdGVyZWRSb29tcyA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLndpbmcgPT09IHdpbmcgJiYgcm9vbS5mbG9vciA9PT0gZmxvb3IpO1xuICAgICAgICByZXR1cm4gZmlsdGVyZWRSb29tcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYS5zdWJzdHIoMSkgPCBiLnN1YnN0cigxKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGEuc3Vic3RyKDEpID4gYi5zdWJzdHIoMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJldHVybiB0aGlzLnJvb21zLmZpbHRlcigocm9vbSkgPT4gcm9vbS53aW5nID09PSB3aW5nICYmIHJvb20uZmxvb3IgPT09IGZsb29yKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Um9vbXNCeVdpbmcod2luZykge1xuICAgICAgICBsZXQgZmlsdGVyZWRSb29tcyA9IHRoaXMucm9vbXMuZmlsdGVyKChyb29tKSA9PiByb29tLndpbmcgPT09IHdpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXJlZFJvb21zKTtcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUm9vbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgaWYgKGEucm9vbUlkIDwgYi5yb29tSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhLnJvb21JZCA+IGIucm9vbUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Mb2FkKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbG9hZGluZyBzaWRlYmFyJyk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVZpZXdNb2RlbCh2aWV3TW9kZWw6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRVbmlxdWVLZXlzKGFyciwgcHJvcGVydHkpIHtcbiAgICAgICAgbGV0IHUgPSB7fSwgYSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghdS5oYXNPd25Qcm9wZXJ0eShhcnJbaV1bcHJvcGVydHldKSkge1xuICAgICAgICAgICAgICAgIGEucHVzaChhcnJbaV1bcHJvcGVydHldKTtcbiAgICAgICAgICAgICAgICB1W2FycltpXVtwcm9wZXJ0eV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi4vY29udGVudC9jb21wb25lbnRzL0NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEtub2Nrb3V0Q29tcG9uZW50IHtcclxuXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHRlbXBsYXRlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdmlld01vZGVsOiB7IGluc3RhbmNlOiBDb21wb25lbnQgfVxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZTogc3RyaW5nLCBjb21wb25lbnQ6IENvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IGNvbXBvbmVudC5uYW1lO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcclxuICAgICAgICB0aGlzLnZpZXdNb2RlbCA9IHtpbnN0YW5jZTogY29tcG9uZW50fTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1N0eWxlc1N1cHBsaWVyfSBmcm9tIFwiLi9jb25maWcvU3R5bGVzXCI7XHJcbmltcG9ydCB7VGVtcGxhdGVTdXBwbGllcn0gZnJvbSBcIi4vY29uZmlnL1RlbXBsYXRlc1wiO1xyXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4uL2NvbnRlbnQvY29tcG9uZW50cy9Db21wb25lbnRcIjtcclxuaW1wb3J0IHtLbm9ja291dENvbXBvbmVudH0gZnJvbSBcIi4vS25vY2tvdXRDb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBrbm9ja291dENvbXBvbmVudEZhY3Rvcnkge1xyXG5cclxuICAgIHByaXZhdGUgc3R5bGVzU3VwcGxpZXI6IFN0eWxlc1N1cHBsaWVyO1xyXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVN1cHBsaWVyOiBUZW1wbGF0ZVN1cHBsaWVyO1xyXG4gICAgcHJpdmF0ZSBjb21wb25lbnRzOiBBcnJheTxDb21wb25lbnQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICB0ZW1wbGF0ZVN1cHBsaWVyOiBUZW1wbGF0ZVN1cHBsaWVyLFxyXG4gICAgICAgIHN0eWxlc1N1cHBsaWVyOiBTdHlsZXNTdXBwbGllcixcclxuICAgICAgICBjb21wb25lbnRzOiBBcnJheTxDb21wb25lbnQ+XHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlU3VwcGxpZXIgPSB0ZW1wbGF0ZVN1cHBsaWVyO1xyXG4gICAgICAgIHRoaXMuc3R5bGVzU3VwcGxpZXIgPSBzdHlsZXNTdXBwbGllcjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVLbm9ja291dENvbXBvbmVudHMoKTogQXJyYXk8S25vY2tvdXRDb21wb25lbnQ+IHtcclxuICAgICAgICBsZXQga25vY2tvdXRDb21wb25lbnRzOiBBcnJheTxLbm9ja291dENvbXBvbmVudD4gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICBrbm9ja291dENvbXBvbmVudHMucHVzaCh0aGlzLmNyZWF0ZUtub2Nrb3V0Q29tcG9uZW50KGNvbXBvbmVudCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGtub2Nrb3V0Q29tcG9uZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlS25vY2tvdXRDb21wb25lbnQoY29tcG9uZW50OiBDb21wb25lbnQpOiBLbm9ja291dENvbXBvbmVudCB7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudE5hbWUgPSB0aGlzLmdldENvbXBvbmVudE5hbWUoY29tcG9uZW50KTtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSAnPHN0eWxlPicgKyB0aGlzLnN0eWxlc1N1cHBsaWVyLmdldFN0eWxlcyhjb21wb25lbnROYW1lKSArICc8L3N0eWxlPicgKyB0aGlzLnRlbXBsYXRlU3VwcGxpZXIuZ2V0VGVtcGxhdGUoY29tcG9uZW50TmFtZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgS25vY2tvdXRDb21wb25lbnQodGVtcGxhdGUsIGNvbXBvbmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb21wb25lbnROYW1lKGNvbXBvbmVudDogQ29tcG9uZW50KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5uYW1lID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBuYW1lIGlzIG1pc3NpbmcuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29tcG9uZW50Lm5hbWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XG5pbXBvcnQge0tub2Nrb3V0Q29tcG9uZW50fSBmcm9tIFwiLi9rbm9ja091dENvbXBvbmVudFwiO1xuaW1wb3J0IHtIYW5kbGVyfSBmcm9tIFwiLi9oYW5kbGVycy9IYW5kbGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBLbm9ja291dEluaXRpYWxpemVyIHtcblxuICAgIHByaXZhdGUga25vY2tvdXRDb21wb25lbnRzOiBBcnJheTxLbm9ja291dENvbXBvbmVudD47XG4gICAgcHJpdmF0ZSBrbm9ja291dEhhbmRsZXJzOiBBcnJheTxIYW5kbGVyPjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAga25vY2tvdXRDb21wb25lbnRzOiBBcnJheTxLbm9ja291dENvbXBvbmVudD4sXG4gICAgICAgIGtub2Nrb3V0SGFuZGxlcnM6IEFycmF5PEhhbmRsZXI+LFxuICAgICkge1xuICAgICAgICB0aGlzLmtub2Nrb3V0Q29tcG9uZW50cyA9IGtub2Nrb3V0Q29tcG9uZW50cztcbiAgICAgICAgdGhpcy5rbm9ja291dEhhbmRsZXJzID0ga25vY2tvdXRIYW5kbGVycztcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5rbm9ja291dENvbXBvbmVudHMpO1xuICAgICAgICBmb3IgKGxldCBrbm9ja291dENvbXBvbmVudCBvZiB0aGlzLmtub2Nrb3V0Q29tcG9uZW50cykge1xuICAgICAgICAgICAga28uY29tcG9uZW50cy5yZWdpc3Rlcihrbm9ja291dENvbXBvbmVudC5uYW1lLCBrbm9ja291dENvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMua25vY2tvdXRIYW5kbGVycykge1xuICAgICAgICAgICAga28uYmluZGluZ0hhbmRsZXJzW2hhbmRsZXIubmFtZV0gPSBoYW5kbGVyO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGNvbXBvbmVudENsYXNzTWFwcGluZyA9IHtcbiAgICBob21lOiAnSG9tZScsXG4gICAgc2lkZWJhcjogJ1NpZGViYXInLFxuICAgIHJvb21Hcm91cHM6ICdSb29tR3JvdXBzJyxcbiAgICByb29tQ2lyY3VsYXI6ICdSb29tQ2lyY3VsYXInLFxuICAgIHJvb21Hcm91cHNBbmdsZWQ6ICdSb29tR3JvdXBzQW5nbGVkJ1xufTtcblxuZXhwb3J0IHR5cGUgQ29tcG9uZW50TmFtZSA9IGtleW9mIHR5cGVvZiBjb21wb25lbnRDbGFzc01hcHBpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBvbmVudE5hbWUoeDogc3RyaW5nKTogeCBpcyBDb21wb25lbnROYW1lIHtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgaW4gY29tcG9uZW50Q2xhc3NNYXBwaW5nKSB7XG4gICAgICAgIGlmICh4ID09PSBjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiY29uc3Qgc3R5bGVzID0ge1xuICAgIC8vIHJvb206IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tXFxcXHJvb20uY3NzJyksXG4gICAgLy8gaXNzdWVGb3JtOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcaXNzdWVGb3JtXFxcXGlzc3VlRm9ybS5jc3MnKSxcbiAgICBzaWRlYmFyOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcc2lkZWJhclxcXFxzaWRlYmFyLmNzcycpLFxuICAgIGhvbWU6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxob21lXFxcXGhvbWUuY3NzJyksXG4gICAgcm9vbUdyb3VwczogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXHJvb21Hcm91cHNcXFxccm9vbUdyb3Vwcy5jc3MnKSxcbiAgICByb29tR3JvdXBzQW5nbGVkOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc0FuZ2xlZFxcXFxyb29tR3JvdXBzQW5nbGVkLmNzcycpLFxuICAgIHJvb21DaXJjdWxhcjogcmVxdWlyZSgnLi5cXFxcLi5cXFxcY29udGVudFxcXFxjb21wb25lbnRzXFxcXHJvb21DaXJjdWxhclxcXFxyb29tQ2lyY3VsYXIuY3NzJyksXG59O1xuXG5leHBvcnQgY2xhc3MgU3R5bGVzU3VwcGxpZXIge1xuICAgIHB1YmxpYyBnZXRTdHlsZXMoc3R5bGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHN0eWxlID0gc3R5bGVzW3N0eWxlTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlZmVyZW5jZWQgU3R5bGVzIG5vdCBmb3VuZCBmb3I6IFwiJyArIHN0eWxlTmFtZSArICdcIicpO1xuICAgIH1cbn1cbiIsImNvbnN0IHRlbXBsYXRlcyA9IHtcbiAgICAvLyByb29tOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbVxcXFxyb29tLmh0bWwnKSxcbiAgICAvLyBpc3N1ZUZvcm06IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxpc3N1ZUZvcm1cXFxcaXNzdWVGb3JtLmh0bWwnKSxcbiAgICBzaWRlYmFyOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcc2lkZWJhclxcXFxzaWRlYmFyLmh0bWwnKSxcbiAgICBob21lOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxcaG9tZVxcXFxob21lLmh0bWwnKSxcbiAgICByb29tR3JvdXBzOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc1xcXFxyb29tR3JvdXBzLmh0bWwnKSxcbiAgICByb29tR3JvdXBzQW5nbGVkOiByZXF1aXJlKCcuLlxcXFwuLlxcXFxjb250ZW50XFxcXGNvbXBvbmVudHNcXFxccm9vbUdyb3Vwc0FuZ2xlZFxcXFxyb29tR3JvdXBzQW5nbGVkLmh0bWwnKSxcbiAgICByb29tQ2lyY3VsYXI6IHJlcXVpcmUoJy4uXFxcXC4uXFxcXGNvbnRlbnRcXFxcY29tcG9uZW50c1xcXFxyb29tQ2lyY3VsYXJcXFxccm9vbUNpcmN1bGFyLmh0bWwnKVxufTtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlU3VwcGxpZXIge1xuICAgIHB1YmxpYyBnZXRUZW1wbGF0ZSh0ZW1wbGF0ZU5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSB0ZW1wbGF0ZXNbdGVtcGxhdGVOYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncmVmZXJlbmNlZCB0ZW1wbGF0ZSBub3QgZm91bmQgZm9yOiAnICsgdGVtcGxhdGVOYW1lKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQge0FsbEJpbmRpbmdzQWNjZXNzb3IsIEJpbmRpbmdDb250ZXh0fSBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQge0hhbmRsZXJ9IGZyb20gJy4vSGFuZGxlcic7XG5pbXBvcnQge1VzZXJBY3Rpb25zfSBmcm9tICcuLi8uLi9Vc2VyQWN0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBMaW5rSGFuZGxlciBpbXBsZW1lbnRzIEhhbmRsZXIge1xuXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIHVzZXJBY3Rpb25zOiBVc2VyQWN0aW9ucztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih1c2VyQWN0aW9uczogVXNlckFjdGlvbnMpIHtcbiAgICAgICAgdGhpcy51c2VyQWN0aW9ucyA9IHVzZXJBY3Rpb25zO1xuICAgICAgICB0aGlzLm5hbWUgPSAnbGluayc7XG4gICAgICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KGVsZW1lbnQ6IGFueSwgdmFsdWVBY2Nlc3NvcjogKCkgPT4gYW55LCBhbGxCaW5kaW5nc0FjY2Vzc29yOiBBbGxCaW5kaW5nc0FjY2Vzc29yLCB2aWV3TW9kZWw6IGFueSwgYmluZGluZ0NvbnRleHQ6IEJpbmRpbmdDb250ZXh0PGFueT4pIHtcbiAgICAgICAgbGV0IGFjY2Vzc29yOiAoKSA9PiBhbnkgPSB0aGlzLmN1c3RvbUFjY2Vzc29yKHZhbHVlQWNjZXNzb3IoKSwgdmlld01vZGVsLCBhbGxCaW5kaW5nc0FjY2Vzc29yKTtcbiAgICAgICAga28uYmluZGluZ0hhbmRsZXJzXG4gICAgICAgICAgLmNsaWNrXG4gICAgICAgICAgLmluaXQoZWxlbWVudCwgYWNjZXNzb3IsIGFsbEJpbmRpbmdzQWNjZXNzb3IsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3VzdG9tQWNjZXNzb3Iob3JpZ2luYWxGdW5jdGlvbiwgdmlld01vZGVsLCBhbGxCaW5kaW5nc0FjY2Vzc29yKTogYW55IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3NBY2Nlc3NvcigpLmNvbmRpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh2aWV3TW9kZWwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZU5hbWU6IHN0cmluZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJBY3Rpb25zLmNoYW5nZVBhZ2UobW9kdWxlTmFtZSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgRm9yZ2UgPSByZXF1aXJlKFwiZm9yZ2UtZGlcIik7XG5pbXBvcnQge0xpbmtIYW5kbGVyfSBmcm9tIFwiLi9oYW5kbGVycy9MaW5rXCI7XG5pbXBvcnQge1N0eWxlc1N1cHBsaWVyfSBmcm9tIFwiLi9jb25maWcvU3R5bGVzXCI7XG5pbXBvcnQge1RlbXBsYXRlU3VwcGxpZXJ9IGZyb20gXCIuL2NvbmZpZy9UZW1wbGF0ZXNcIjtcbmltcG9ydCB7a25vY2tvdXRDb21wb25lbnRGYWN0b3J5fSBmcm9tIFwiLi9Lbm9ja291dENvbXBvbmVudEZhY3RvcnlcIjtcbmltcG9ydCB7Y29tcG9uZW50Q2xhc3NNYXBwaW5nfSBmcm9tIFwiLi9jb25maWcvQ29tcG9uZW50c1wiO1xuaW1wb3J0IHtLbm9ja291dEluaXRpYWxpemVyfSBmcm9tIFwiLi9Lbm9ja291dEluaXRpYWxpemVyXCI7XG5cbmV4cG9ydCBjbGFzcyBLbm9ja291dERlcGVuZGVuY2llcyB7XG4gICAgcHJpdmF0ZSBmb3JnZTogRm9yZ2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZm9yZ2U6IEZvcmdlKSB7XG4gICAgICAgIHRoaXMuZm9yZ2UgPSBmb3JnZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlcktub2Nrb3V0U2VydmljZXMoKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlcktub2Nrb3V0TW9kdWxlcygpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudENsYXNzTWFwcGluZycpLnRvLmluc3RhbmNlKGNvbXBvbmVudENsYXNzTWFwcGluZyk7XG4gICAgICAgIHRoaXMuZm9yZ2UuYmluZCgna25vY2tvdXRJbml0aWFsaXplcicpLnRvLnR5cGUoS25vY2tvdXRJbml0aWFsaXplcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyS25vY2tvdXRTZXJ2aWNlcygpIHtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdrbm9ja291dEhhbmRsZXJzJykudG8udHlwZShMaW5rSGFuZGxlcik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyS25vY2tvdXRNb2R1bGVzKCkge1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2tub2Nrb3V0SGFuZGxlcnMnKS50by50eXBlKExpbmtIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdzdHlsZXNTdXBwbGllcicpLnRvLnR5cGUoU3R5bGVzU3VwcGxpZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ3RlbXBsYXRlU3VwcGxpZXInKS50by50eXBlKFRlbXBsYXRlU3VwcGxpZXIpO1xuICAgICAgICB0aGlzLmZvcmdlLmJpbmQoJ2NvbXBvbmVudFNldHVwJykudG8udHlwZShrbm9ja291dENvbXBvbmVudEZhY3RvcnkpO1xuXG4gICAgICAgIGxldCBjb21wb25lbnRTZXR1cDoga25vY2tvdXRDb21wb25lbnRGYWN0b3J5ID0gdGhpcy5mb3JnZS5nZXQ8a25vY2tvdXRDb21wb25lbnRGYWN0b3J5PignY29tcG9uZW50U2V0dXAnKTtcbiAgICAgICAgdGhpcy5mb3JnZS5iaW5kKCdrbm9ja291dENvbXBvbmVudHMnKS50by5mdW5jdGlvbihjb21wb25lbnRTZXR1cC5jcmVhdGVLbm9ja291dENvbXBvbmVudHMuYmluZChjb21wb25lbnRTZXR1cCkpO1xuICAgIH1cbn1cbiJdfQ==
