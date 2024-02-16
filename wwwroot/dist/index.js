"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactivity_js_1 = require("./lib/reactivity.js");
const diff_js_1 = require("./lib/diff.js");
const routing_js_1 = require("./lib/routing.js");
const render_js_1 = require("./lib/render.js");
const mount_js_1 = require("./lib/mount.js");
const ErrorSetup_js_1 = require("./components/ErrorSetup.js");
const Element_js_1 = require("./lib/Element.js");
const LoginSetup_js_1 = require("./components/LoginSetup.js");
/**
 * @typedef { import('./lib/Element.js').Element } Element
 * @typedef { import('./lib/Components.js').Component } Component
 * @typedef { import('./lib/routing.js').Route } Route
 */
/** @type {Array<Route>}*/
const routes = [
    { path: '/', component: (0, LoginSetup_js_1.LoginSetup)() },
    { path: '/Home', component: (0, LoginSetup_js_1.LoginSetup)() },
];
/**
 * @param { Component } component
 */
const handleRootComponent = (component) => {
    const mountPoint = document.getElementById("app");
    if (mountPoint == null) {
        throw new Error("Couldn't find mount point #app");
    }
    /** @type {Element} */
    let virtApp;
    let $el = (0, mount_js_1.mount)((0, render_js_1.render)((0, Element_js_1.el)(component)), mountPoint);
    return (0, reactivity_js_1.watchEffect)(() => {
        try {
            const virtNewApp = (0, Element_js_1.el)(component);
            const patch = (0, diff_js_1.diff)(virtApp, virtNewApp);
            // @ts-ignore
            $el = patch($el);
            virtApp = virtNewApp;
        }
        catch ( /** @type {any}*/e) {
            (0, mount_js_1.mount)((0, render_js_1.render)((0, Element_js_1.el)((0, ErrorSetup_js_1.ErrorSetup)(JSON.stringify(e.message, null, 2)))), document.body);
            throw e;
        }
    });
};
(0, routing_js_1.setupRoutes)(handleRootComponent, routes);
