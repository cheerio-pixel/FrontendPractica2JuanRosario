

/**
 * @typedef { import('./Element.js').Element } Element
 */

import { el } from './Element.js';

/**
 * @param { any } component
 * @returns { Component }
 */
// @ts-ignore
export const defineComponent = component => Object.assign(new Component(), component);


export function Component() {
    /**
     * @type { ((props: any, children: Array<any>) => Element) | (() => Element) }
     */
    this.render = (props, children) => {
        return el("h1", {}, [
            `Error, no render function assigned for component ${JSON.stringify(this, null, 2)}`,
            el("h2", {}, [`Props: ${JSON.stringify(props, null, 2)}`]),
            el("h2", {}, [`Children: ${JSON.stringify(children, null, 2)}`]),
        ]);
    };

    /** @type {(() => Function)?}*/
    this.mounted = null;

    /** @type {Function?}*/
    this.onRender = null;
};
