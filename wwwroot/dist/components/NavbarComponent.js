"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarComponent = void 0;
const Components_1 = require("../lib/Components");
const Element_1 = require("../lib/Element");
const routing_1 = require("../lib/routing");
const NavbarComponent = () => {
    return (0, Components_1.defineComponent)({
        render() {
            return (0, Element_1.el)("nav", {}, [
                (0, Element_1.el)("a", { click: function (/** @type {any} */ evt) {
                        (0, routing_1.navigateTo)("/Home");
                    } }, ["Home"])
            ]);
        }
    });
};
exports.NavbarComponent = NavbarComponent;
