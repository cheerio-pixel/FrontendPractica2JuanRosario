"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorComponent = void 0;
const Components_js_1 = require("../lib/Components.js");
const Element_js_1 = require("../lib/Element.js");
const ErrorComponent = (/** @type {any} */ exception) => {
    return (0, Components_js_1.defineComponent)({
        render() {
            return (0, Element_js_1.div)({ class: "center-h" }, [
                (0, Element_js_1.div)({ class: "center-v" }, [
                    (0, Element_js_1.el)("h1", { class: "text-danger" }, ["Exception"]),
                    (0, Element_js_1.el)("h2", { class: "text-danger" }, [exception])
                ])
            ]);
        }
    });
};
exports.ErrorComponent = ErrorComponent;
