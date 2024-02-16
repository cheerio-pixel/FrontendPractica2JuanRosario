"use strict";

import { render, setAttribute } from './render.js';
import { Element } from './Element.js';

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
            setAttribute($node, key, newProps[key], null);
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
    // if virtOldChildren.lenght < virtNewChildren.length
    const childPatches = virtOldChildren.map((virtOldChild, i) => {
        // console.log(i, diff(virtOldChild, virtNewChildren[i]));
        return diff(virtOldChild, virtNewChildren[i]);
    });

    const parentPatches = virtNewChildren.slice(virtOldChildren.length).map((additionalChild) => {
        /**
         * @param {HTMLElement} $node
         */
        return $node => {
            $node.appendChild(render(additionalChild));
            return $node;
        }
    });

    return $node => {
        // Okay mira, esto me a causado dolor, tanto que ya siento que no
        // olvidare el hecho de que childNodes es una lista activa que se
        // actualiza cada vez que se actualiza el nodo
        Array.from($node.childNodes).forEach(($child, i) => {
            // Casting at its finest
            childPatches[i](/** @type {HTMLElement} */($child));
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
export const diff = (virtOld, virtNew) => {
    if (virtNew === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        };
    }

    // If any of them are not elements.
    if (!(virtNew instanceof Element) || !(virtOld instanceof Element)) {
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
    if (virtNew.type !== virtOld.type
        // If they are of different input types, treat them as different element.
        || (virtNew.type === "input"
            && virtOld.type === "input"
            && virtOld.props?.type !== virtNew.props?.type
        )) {
        return renderReplace(virtNew);
    }

    const patchProps = diffProps(virtOld.props, virtNew.props);
    const patchChildren = diffChildren(virtOld.children, virtNew.children);

    return $node => {
        patchProps($node);
        patchChildren($node);
        return $node;
    };
}

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
        const $result = render(virtNew);
        $node.replaceWith($result);
        return $result;
    };
};