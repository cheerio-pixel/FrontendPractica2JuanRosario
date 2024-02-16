"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.setAttribute = void 0;
const Components_js_1 = require("./Components.js");
const Element_js_1 = require("./Element.js");
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
const setAttribute = ($el, prop, value, virtElement) => {
    try {
        if (typeof value === "function") {
            const current = listeners.get($el);
            if (current) {
                if (current.toString() === value.toString()) {
                    return;
                }
                $el.removeEventListener(prop, current);
            }
            $el.addEventListener(prop, value);
            listeners.set($el, value);
        }
        else {
            $el.setAttribute(prop, value);
        }
    }
    catch ( /** @type {any}*/e) {
        if (e.name === "InvalidCharacterError") {
            throw new Error(`The property '${prop}' has an invalid name: element = ${JSON.stringify(virtElement, null, 2)}`);
        }
        else {
            throw e;
        }
    }
};
exports.setAttribute = setAttribute;
/**
 * @param {any} element
 * @returns {HTMLElement | Text}
 */
const render = (element) => {
    var _a;
    if (!(element instanceof Element_js_1.Element)) {
        return renderAny(element);
    }
    /** @type {HTMLElement}*/
    const $el = document.createElement(element.type);
    // const $el = document.createElement(element.type);
    for (const prop in element.props) {
        (0, exports.setAttribute)($el, prop, element.props[prop], element);
    }
    if (element.children == null || !(typeof element.children[Symbol.iterator] === 'function')) {
        throw new Error(`Children of element ${JSON.stringify(element, null, 2)}} are not iterable: Children: ${JSON.stringify(element.children, null, 2)}`);
    }
    for (const child of element.children) {
        /** @type {HTMLElement | Text}*/
        let $child = (0, exports.render)(child);
        $el.appendChild($child);
        if (child instanceof Element_js_1.Element) {
            const boundOnRender = (_a = child.onRender) === null || _a === void 0 ? void 0 : _a.bind(child);
            child.onRender = null;
            boundOnRender === null || boundOnRender === void 0 ? void 0 : boundOnRender($child);
        }
    }
    // Append the reference of the object so that we may modify this in the virtual element.
    element.$this = $el;
    return $el;
};
exports.render = render;
/**
 * @param {any} element
 */
const renderAny = (element) => {
    if (typeof element === 'string') {
        return document.createTextNode(element);
    }
    else if (typeof element === 'number' || typeof element === 'bigint') {
        return document.createTextNode(element.toString());
    }
    else {
        throw new Error(`Couldn't find how to render child ${JSON.stringify(element, null, 2)} \
of element ${JSON.stringify(element, null, 2)}`);
    }
};
