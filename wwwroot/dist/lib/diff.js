"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = void 0;
const render_js_1 = require("./render.js");
const Element_js_1 = require("./Element.js");
/**
 * @typedef {import('./Element.js').Element} Element
 * @typedef { (($node: HTMLElement) => HTMLElement | Text) | (($node: HTMLElement) => undefined) } DOMPatch - A function that patches the $node element in the DOM
 */
/**
 * @param { any } oldProps
 * @param { any } newProps
 * @returns { DOMPatch }
 */
const diffProps = (oldProps, newProps) => {
    /** @type { Array<DOMPatch> }*/
    const patches = [];
    for (const key in newProps) {
        patches.push($node => {
            (0, render_js_1.setAttribute)($node, key, newProps[key], null);
            return $node;
        });
    }
    for (const k in oldProps) {
        if (!(k in newProps)) {
            patches.push($node => {
                $node.removeAttribute(k);
                return $node;
            });
        }
    }
    return $node => {
        patches.forEach(patch => patch($node));
        return $node;
    };
};
/**
 * @param { Array<any> } virtOldChildren
 * @param { Array<any> } virtNewChildren
 * @returns { DOMPatch }
 */
const diffChildren = (virtOldChildren, virtNewChildren) => {
    /**
     * @type { Array<DOMPatch> }
     */
    const childPatches = virtOldChildren.map((virtOldChild, i) => {
        return (0, exports.diff)(virtOldChild, virtNewChildren[i]);
    });
    const parentPatches = virtNewChildren.slice(virtOldChildren.length).map((additionalChild) => {
        /**
         * @param {HTMLElement} $node
         */
        return $node => {
            $node.appendChild((0, render_js_1.render)(additionalChild));
            return $node;
        };
    });
    return $node => {
        $node.childNodes.forEach(($child, i) => {
            // Casting at its finest
            childPatches[i](/** @type {HTMLElement} */ ($child));
        });
        parentPatches.forEach(patch => patch($node));
        return $node;
    };
};
/**
 * @param {any} virtNew
 * @param {any} virtOld
 * @returns { DOMPatch }
 */
const diff = (virtOld, virtNew) => {
    if (virtNew === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        };
    }
    // If any of them are not elements.
    if (!(virtNew instanceof Element_js_1.Element) || !(virtOld instanceof Element_js_1.Element)) {
        // And they are not the same.
        if (virtOld !== virtNew) {
            // Then that means that they are either:
            // 1. Of completly different types
            // 2. Just an update toa non-Element object (like a string)
            // Render takes care of both.
            return renderReplace(virtNew);
        }
        // But we know they are the same, then that means that this is a
        // non-Element object.
        return identity;
    }
    // After the previous checks, we now know that the virtual trees are Element
    // React heuristic. https://legacy.reactjs.org/docs/reconciliation.html#motivation
    if (virtNew.type !== virtOld.type) {
        return renderReplace(virtNew);
    }
    const patchProps = diffProps(virtOld.props, virtNew.props);
    const patchChildren = diffChildren(virtOld.children, virtNew.children);
    return $node => {
        patchProps($node);
        patchChildren($node);
        return $node;
    };
};
exports.diff = diff;
/**
 * @param {any} a
 */
const identity = a => a;
/**
 * Return a function that renders virtual element and replaces with
 * provided parent
 * @param { any } virtNew
 * @returns { DOMPatch }
 */
const renderReplace = (virtNew) => {
    return $node => {
        const $result = (0, render_js_1.render)(virtNew);
        $node.replaceWith($result);
        return $result;
    };
};
