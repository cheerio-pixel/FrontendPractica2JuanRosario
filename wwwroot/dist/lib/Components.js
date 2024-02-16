"use strict";
/**
 * @typedef { import('./Element.js').Element } Element
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.defineComponent = void 0;
const Element_js_1 = require("./Element.js");
/**
 * @param { any } component
 * @returns { Component }
 */
// @ts-ignore
const defineComponent = component => Object.assign(new Component(), component);
exports.defineComponent = defineComponent;
function Component() {
    /**
     * @type { ((props: any, children: Array<any>) => Element) | (() => Element) }
     */
    this.render = (props, children) => {
        return (0, Element_js_1.el)("h1", {}, [
            `Error, no render function assigned for component ${JSON.stringify(this, null, 2)}`,
            (0, Element_js_1.el)("h2", {}, [`Props: ${JSON.stringify(props, null, 2)}`]),
            (0, Element_js_1.el)("h2", {}, [`Children: ${JSON.stringify(children, null, 2)}`]),
        ]);
    };
}
exports.Component = Component;
;
