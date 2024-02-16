"use strict";

import { Component } from './Components.js';
import { Element } from './Element.js';
import { hookOnMounted } from './hooks.js';

/**
 * @typedef {import('./Element.js').Element} Element
 */

/** @type {WeakMap<HTMLElement, (event: any) => any>}*/

const listeners = new WeakMap();

/**
 * @param { HTMLElement } $el
 * @param { any } value
 * @param { any } prop
 * @param { Element? } virtElement
 */
export const setAttribute = ($el, prop, value, virtElement) => {
    try {
        if (typeof value === "function") {
            // @ts-ignore
            $el["on" + prop] = value; // So simple
            // const current = listeners.get($el);
            // if (current) {
            //     if (current.toString() === value.toString()) {
            //         return;
            //     }
            //     $el.removeEventListener(prop, current);
            // }
            // $el.addEventListener(prop, value);
            // listeners.set($el, value);
        } else {
            $el.setAttribute(prop, value);
        }
    } catch (/** @type {any}*/ e) {
        if (e.name === "InvalidCharacterError") {
            throw new Error(`The property '${prop}' has an invalid name: element = ${JSON.stringify(virtElement, null, 2)}`);
        } else {
            throw e;
        }
    }
}

/**
 * @param {any} element
 * @returns {HTMLElement | Text}
 */
export const render = (element, _toMount = false) => {
    if (!(element instanceof Element)) {
        return renderAny(element);
    }

    /** @type {HTMLElement}*/
    const $el = document.createElement(element.type);

    // const $el = document.createElement(element.type);

    for (const prop in element.props) {
        setAttribute($el, prop, element.props[prop], element);
    }
    if (element.children == null || !(typeof element.children[Symbol.iterator] === 'function')) {
        throw new Error(`Children of element ${JSON.stringify(element, null, 2)}} are not iterable: Children: ${JSON.stringify(element.children, null, 2)}`);
    }

    for (const child of element.children) {
        /** @type {HTMLElement | Text}*/
        if (child instanceof Array) {
            throw new Error(`Child of type array in a context is not allowed: Context ${JSON.stringify(element, null, 2)}`);
        }
        let $child = render(child);
        $el.appendChild($child);
        if (child instanceof Element) {
            if (child.onRender != null) {
                const boundOnRender = child.onRender.bind(child);
                child.onRender = null;
                boundOnRender($child);
            }
        }
    }
    // Append the reference of the object so that we may modify this in the virtual element.
    // Thinking right now that this is not necessary.
    // element.$this = $el;

    if (element.onMounted != null && _toMount) {
        // If this render is for mounting, hook the function.
        hookOnMounted(element.onMounted());
    }

    return $el;
}

/**
 * @param {any} element
 */
const renderAny = (element) => {
    if (typeof element === 'string') {
        return document.createTextNode(element);
    } else if (typeof element === 'number' || typeof element === 'bigint') {
        return document.createTextNode(element.toString());
    } else {
        throw new Error(`Couldn't find how to render element ${JSON.stringify(element, null, 2)} \
of type ${typeof element}`);
    }
};

