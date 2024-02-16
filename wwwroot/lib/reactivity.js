"use strict";

/**
 * @typedef { {lazy: boolean, setup: (() => void)?} } Options
 */

/**
 * @typedef { { refs: Array<Set<Effect>>, handler: () => void } } Effect
 */

/**
 * @typedef {String | Number | Symbol} Key
 * @typedef {Object} Target
 */

/**
 * @template T
 * @typedef { { value: T} } Ref<T>
 */


export const [watchEffect, ref, reactive] = (function() {
    /** @type {WeakMap<Target, Map<Key, Set<Effect>>>}*/
    const subscriptions = new WeakMap();

    /**
     * @param {Target} target
     * @param {Key} key
     * @return Set<Effect>
     */
    function getSubscribersForProperty(target, key) {
        if (!subscriptions.has(target)) {
            subscriptions.set(target, new Map());
        }

        if (!subscriptions.get(target)?.has(key)) {
            subscriptions.get(target)?.set(key, new Set());
        }
        const result = subscriptions.get(target)?.get(key);
        if (result === undefined) {
            throw Error(`Couldn't found the subscribers for property ${key} of target ${JSON.stringify(target)}`);
        }
        return result;
    }
    /** @type {Array<Effect>}*/
    let currentEffects = [];

    /**
     * @param {Target} target
     * @param {Key} key
     */
    function track(target, key) {
        if (currentEffects.length > 0) {
            const currentEffect = currentEffects[currentEffects.length - 1];
            const effects = getSubscribersForProperty(target, key);
            effects.add(currentEffect);
            currentEffect.refs.push(effects);
        }
    }

    /**
     * @param {Target} target
     * @param {Key} key
     */
    function trigger(target, key) {
        const effects = getSubscribersForProperty(target, key);
        effects.forEach((effect) => effect.handler());
    }

    // TODO: Return a function that allows to remove this effect
    // * @returns {Effect} An object representing the reference to the watched effect.

    /**
     * Execute update function whenever a reactive effect is changed in the
     * current context.
     * @param {() => void} update
     * @param {Options} options
     */
    const watchEffect = (update, options = { lazy: false, setup: null }) => {
        const { lazy, setup } = options;

        /** @type {Effect}*/
        const effect = Object.create(null);
        effect.handler = () => {
            currentEffects.push(effect);
            update();
            currentEffects.pop();
        };
        effect.refs = [];
        if (!lazy) {
            if (setup) {
                currentEffects.push(effect);
                setup();
                currentEffects.pop();
            } else {
                effect.handler();
            }
        }
        return () => {
            const { refs } = effect;
            if (refs.length) {
                for (const ref of refs) {
                    ref.delete(effect);
                }
            }
            refs.length = 0;
        };
    }

    /**
     * @template T
     * @param {T} value
     * @returns { Ref<T> }
     */
    const ref = (value) => {
        return {
            get value() {
                track(this, 'value');
                return value;
            },
            /**
             * @param { T } other
             */
            set value(other) {
                const isTrigger = value !== other;
                value = other;
                if (isTrigger) {
                    trigger(this, 'value');
                }
            },
        };
    };

    /**
     * @param {Object} object
     */
    const reactive = (object) => {
        return new Proxy(object, {
            /**
             * @param {Target} target
             * @param {Key} key
             * @returns {any}
             */
            get(target, key) {
                track(target, key);
                // Symbol is not a valid indexer and that annoys me
                // @ts-ignore
                return target[key];
            },
            /**
             * @param {Target} target
             * @param {Key} key
             * @param {any} value
             */
            set(target, key, value) {
                // @ts-ignore
                const oldValue = target[key];
                if (oldValue !== value) {
                    // @ts-ignore
                    target[key] = value;
                    trigger(target, key);
                    return true;
                }
                return false;
            }
        });
    };

    return [watchEffect, ref, reactive];
}());

