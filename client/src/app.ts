/// <reference path="../typings/index.d.ts" />

import {polyfill} from 'es6-promise';
import {Dependencies} from './Dependencies';
import {Application} from './Application';

polyfill();
// require("es6-promise").polyfill();

console.log('test');

new function () {
    new Dependencies()
        .get<Application>('application')
        .run();
}();




