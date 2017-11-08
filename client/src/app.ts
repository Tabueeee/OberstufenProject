/// <reference path="../typings/index.d.ts" />

import {polyfill} from 'es6-promise';
import {Dependencies} from './Dependencies';
import {Application} from './Application';

polyfill();

new function () {
    new Dependencies()
        .registerDependencies()
        .then((dependencies) => {
            dependencies
                .get<Application>('application')
                .run();
        });
}();




