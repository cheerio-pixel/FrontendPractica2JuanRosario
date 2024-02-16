"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.div = exports.el = exports.Element = void 0;
const Components_js_1 = require("./Components.js");
/**
 * A Virtual HTML component
 * @class
 */
exports.Element = (function () {
    /**
     * @constructs Element
     * @param {String} type
     * @param {Object<String, any>} props
     * @param {Array<any>} children
     * @param {Function?} onRender - Function that runs on render
     */
    function Element(type, props, children, onRender = null) {
        /**
         * Tag name of element
         * @name Element#type
         * @type {String}
         */
        this.type = type;
        /**
         * Object of properties of current element
         * If a value is a function, it will be interpreted as an event
         * @name Element#props
         * @type {Object<string, any>}
         */
        this.props = props;
        /**
         * List of children elements.
         * This is the equivalent of putting them in the innerHTML
         * @type {Array<any>}
         */
        this.children = children;
        /**
         * Reference to the DOM element in the rendered DOM
         * @type{HTMLElement?}
         */
        this.$this = null;
        /**
         * Function that runs when the element is rendered
         * @type {Function?}
         * @param {HTMLElement?} The HTML element of the current virtual element
         */
        this.onRender = onRender;
    }
    /**
     * Append child Element into children list.
     * @param {any} child
     */
    Element.prototype.appendChild = function (child) {
        this.children.push(child);
    };
    /**
     * Add onMounted function.
     * @param {Function} onRender Function that runs when the element is rendered
     */
    Element.prototype.withOnRender = function (onRender) {
        this.onRender = onRender;
        return this;
    };
    Element.prototype.makeCopy = function () {
        // Since no two DOM elements are the same, is apt that in the copy
        // $this is null
        return new Element(this.type, this.props, this.children, this.onRender);
    };
    return Element;
})();
/**
 * Representation of a DOM element
 * @param {String | Component} type
 * @param {Object<String, any>} props
 * @param {Array<any>} children
 */
const el = (type, props = {}, children = [], onRender = null) => {
    if (props instanceof Array) {
        children = props;
        props = {};
    }
    if (type instanceof Components_js_1.Component) {
        return type.render(props, children);
    }
    else if (typeof type === 'object') {
        throw new Error(`Element type of type object is being used as a component, consider using defineComponent: ${JSON.stringify(type, null, 2)}`);
    }
    else {
        return new exports.Element(type, props, children, onRender);
    }
};
exports.el = el;
/**
 * Convenience function for creating virtual div elements.
 * @param {Object<String, any>} props
 * @param {Array<any>} children
 */
const div = (props = {}, children = [], onRender = null) => {
    return new exports.Element("div", props, children, onRender);
};
exports.div = div;
