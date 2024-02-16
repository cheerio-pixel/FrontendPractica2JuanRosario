"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarComponent = void 0;
const Components_js_1 = require("../lib/Components.js");
const Element_js_1 = require("../lib/Element.js");
const routing_js_1 = require("../lib/routing.js");
const NavbarComponent = () => {
    return (0, Components_js_1.defineComponent)({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            return (0, Element_js_1.el)("nav", {}, [
                (0, Element_js_1.el)("a", { href: "/Home",
                    click: function (/** @type {any} */ evt) {
                        evt.preventDefault();
                        (0, routing_js_1.navigateTo)("/Home");
                    } }, ["Home"]),
                (0, Element_js_1.el)("span", { style: "margin-left: 0.5em" }),
                (0, Element_js_1.el)("a", { href: "/About",
                    click: function (/** @type {any} */ evt) {
                        evt.preventDefault();
                        (0, routing_js_1.navigateTo)("/About");
                    } }, ["About"]),
                (0, Element_js_1.el)("hr"),
            ]);
        }
    });
};
exports.NavbarComponent = NavbarComponent;
// const Navbar = NavbarComponent();
// const navbarMountPoint = document.getElementById("nav-bar");
// if (navbarMountPoint == null) {
//     throw new Error("Couldn't find mount point #nav-bar");
// }
// mount(render(Navbar.render()), navbarMountPoint);
