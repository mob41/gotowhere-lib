//Event
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Event triggered on UI back navigation
 */
export const EVENT_UI_BACK = 'gotowhere-lib/EVENT_UI_BACK';

/**
 * Event triggered on device location change
 */
export const EVENT_LOCATION_CHANGE = 'gotowhere-lib/EVENT_LOCATION_CHANGE';

/**
 * Event triggered on device location initialization success
 */
export const EVENT_LOCATION_SUCCESS = 'gotowhere-lib/EVENT_LOCATION_SUCCESS';

/**
 * Event triggered on device location initialization error
 */
export const EVENT_LOCATION_ERROR = 'gotowhere-lib/EVENT_LOCATION_ERROR';

/**
 * Event triggered on custom location selected
 */
export const EVENT_LOCATION_SELECTED = 'gotowhere-lib/EVENT_LOCATION_SELECTED';

/**
 * Event triggered on map center changed
 */
export const EVENT_MAP_CENTER_CHANGED = 'gotowhere-lib/EVENT_MAP_CENTER_CHANGED';

/**
 * Registered event listeners
 */
export let eventListeners: {
    [key: string]: { (...args: any[]): void }[];
} = {};

/**
 * Dispatch specified event with arguments passed to the listeners
 * @param event Event name
 * @param args Event arguments
 */
export function dispatch(event: string, ...args: any[]): void {
    if (typeof event !== 'string') {
        throw new TypeError('Event name must be a string.');
    }

    if (!eventListeners[event]) {
        return;
    }
    for (const listener of eventListeners[event]) {
        if (listener) {
            listener(...args);
        } else {
            off(event, listener);
        }
    }
}

/**
 * Register a listener to listen for the specified event
 * @param event Event name
 * @param listener Event listener
 */
export function on(event: string, listener: { (...args: any[]): void }): void {
    if (typeof event !== 'string') {
        throw new TypeError('Event name must be a string.');
    }

    if (typeof listener !== 'function') {
        throw new TypeError('Event listener must be a function.');
    }

    if (!eventListeners[event]) {
        eventListeners[event] = [];
    }
    eventListeners[event].push(listener);
}

/**
 * Unregister the listener of the specified event
 * @param event Event name
 * @param listener Event listener
 */
export function off(event: string, listener: { (...args: any[]): void }): void {
    if (typeof event !== 'string') {
        throw new TypeError('Event name must be a string.');
    }

    if (typeof listener !== 'function') {
        throw new TypeError('Event listener must be a function.');
    }

    if (!eventListeners[event]) {
        return;
    }
    const index = eventListeners[event].indexOf(listener);
    if (index === -1) {
        return;
    }
    eventListeners[event].splice(index, 1);
}

/**
 * Unregister all event listeners
 */
export function offAll(): void {
    eventListeners = {};
}
