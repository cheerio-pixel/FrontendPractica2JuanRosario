"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundSetup = void 0;
const Components_js_1 = require("../lib/Components.js");
const Element_js_1 = require("../lib/Element.js");
const NotFoundSetup = (message = "") => {
    return (0, Components_js_1.defineComponent)({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            return (0, Element_js_1.div)({ class: "center-h" }, [
                (0, Element_js_1.div)({ class: "center-v" }, [
                    (0, Element_js_1.el)("h1", { class: "text-danger" }, ["Error 404 No se pudo encontrar."]),
                    // el("br"),
                    (0, Element_js_1.el)("h2", { class: "text-danger" }, [message]),
                ])
            ]);
        }
    });
};
exports.NotFoundSetup = NotFoundSetup;
