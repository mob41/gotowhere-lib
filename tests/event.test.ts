//Event Test
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import { event } from '../src';
import { expect } from 'chai';

const TEST_EVENT_1 = 'gotowhere-lib/tests/TEST_EVENT_1';
const TEST_EVENT_2 = 'gotowhere-lib/tests/TEST_EVENT_2';
const TEST_EVENT_3 = 'gotowhere-lib/tests/TEST_EVENT_3';

describe('event', function () {
    let dispatched: boolean;
    let returnedArgs: any[];
    const args = [12345678, 'testing123', false];

    let expectedListeners: {
        [key: string]: any[];
    };

    const testEvent1Listener = () => {
        dispatched = true;
    };

    const testEvent2Listener = () => {};

    const testEvent3Listener = (...args: any[]) => {
        returnedArgs = args;
    };

    before(() => {
        dispatched = false;
        returnedArgs = [];
        expectedListeners = {};
        expectedListeners[TEST_EVENT_1] = [testEvent1Listener];
        expectedListeners[TEST_EVENT_2] = [testEvent2Listener];
        expectedListeners[TEST_EVENT_3] = [testEvent3Listener];
    });

    describe('#on()', function () {
        it('should have two listeners registered for TEST_EVENT_1 and TEST_EVENT_2', function () {
            event.on(TEST_EVENT_1, testEvent1Listener);
            event.on(TEST_EVENT_2, testEvent2Listener);
            event.on(TEST_EVENT_3, testEvent3Listener);
            expect(event.eventListeners).to.deep.equal(expectedListeners);
        });

        it('should throw type error on invalid event name type provided', function () {
            expect(function () {
                event.on(<any>12345678, () => {});
            }).to.throw(TypeError);
        });

        it('should throw type error on invalid event listener type provided', function () {
            expect(function () {
                event.on(TEST_EVENT_1, <any>12345678);
            }).to.throw(TypeError);
        });
    });

    describe('#dispatch()', function () {
        it('should trigger TEST_EVENT_1 registered listeners on dispatch', function () {
            event.dispatch(TEST_EVENT_1);
            expect(dispatched).to.equal(true);
        });

        it('should return provided arguments to listeners of TEST_EVENT_3 on dispatch', function () {
            event.dispatch(TEST_EVENT_3, ...args);
            expect(returnedArgs).to.deep.equal(args);
        });

        it('should throw type error on invalid event name type provided', function () {
            expect(function () {
                event.dispatch(<any>12345678);
            }).to.throw(TypeError);
        });
    });

    describe('#off()', function () {
        it('should unregister the specified listener of TEST_EVENT_1', function () {
            event.off(TEST_EVENT_1, testEvent1Listener);
            expectedListeners[TEST_EVENT_1].pop();
            expect(event.eventListeners).to.deep.equal(expectedListeners);
        });

        it('should throw type error on invalid event name type provided', function () {
            expect(function () {
                event.off(<any>12345678, () => {});
            }).to.throw(TypeError);
        });

        it('should throw type error on invalid event listener type provided', function () {
            expect(function () {
                event.off(TEST_EVENT_2, <any>12345678);
            }).to.throw(TypeError);
        });
    });

    describe('#offAll()', function () {
        it('should unregister all listeners', function () {
            event.offAll();
            expect(event.eventListeners).to.deep.equal({});
        });
    });
});
