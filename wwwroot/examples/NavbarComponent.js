import { defineComponent } from "../lib/Components.js";
import { el } from "../lib/Element.js";
import { navigateTo } from "../lib/routing.js";

export const NavbarComponent = () => {
    return defineComponent({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            return el("nav", {}, [
                el("a", { href: "/Home",
                    click: function (/** @type {any} */ evt) {
                        evt.preventDefault();
                        navigateTo("/Home");
                    }}, ["Home"]),
                el("span", { style: "margin-left: 0.5em"}),
                el("a", { href: "/About",
                    click: function (/** @type {any} */ evt) {
                        evt.preventDefault();
                        navigateTo("/About");
                    }}, ["About"]),
                el("hr"),
            ])
        }
    });
};

// const Navbar = NavbarComponent();

// const navbarMountPoint = document.getElementById("nav-bar");
// if (navbarMountPoint == null) {
//     throw new Error("Couldn't find mount point #nav-bar");
// }

// mount(render(Navbar.render()), navbarMountPoint);
