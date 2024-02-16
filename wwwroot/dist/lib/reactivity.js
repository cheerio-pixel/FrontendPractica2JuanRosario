"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = exports.ref = exports.watchEffect = void 0;
/**
 * @typedef { {lazy: boolean} } Options
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
_a = (function () {
    /** @type {WeakMap<Target, Map<Key, Set<Effect>>>}*/
    const subscriptions = new WeakMap();
    /**
     * @param {Target} target
     * @param {Key} key
     * @return Set<Effect>
     */
    function getSubscribersForProperty(target, key) {
        var _a, _b, _c;
        if (!subscriptions.has(target)) {
            subscriptions.set(target, new Map());
        }
        if (!((_a = subscriptions.get(target)) === null || _a === void 0 ? void 0 : _a.has(key))) {
            (_b = subscriptions.get(target)) === null || _b === void 0 ? void 0 : _b.set(key, new Set());
        }
        const result = (_c = subscriptions.get(target)) === null || _c === void 0 ? void 0 : _c.get(key);
        if (result === undefined) {
            throw Error(`Couldn't found the subscribers for property ${key} of target ${JSON.stringify(target)}`);
        }
        return result;
    }
    /** @type {Effect?}*/
    let currentEffect;
    /**
     * @param {Target} target
     * @param {Key} key
     */
    function track(target, key) {
        if (currentEffect) {
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
    const watchEffect = (update, options = { lazy: false }) => {
        const { lazy } = options;
        /** @type {Effect}*/
        const effect = Object.create(null);
        effect.handler = () => {
            currentEffect = effect;
            update();
            currentEffect = null;
        };
        effect.refs = [];
        if (!lazy) {
            effect.handler();
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
    };
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
                value = other;
                trigger(this, 'value');
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
}()), exports.watchEffect = _a[0], exports.ref = _a[1], exports.reactive = _a[2];
