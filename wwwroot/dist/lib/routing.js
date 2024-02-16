"use strict";
/** @typedef { import('./Components.js').Component } Component */
/** @typedef { import('./Element.js') } Element */
/** @typedef { { path: string, component: Component} } Route */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = exports.navigateTo = void 0;
const NotFoundSetup_js_1 = require("../components/NotFoundSetup.js");
/**
 * @param { Array<Route> } routes
 * @param { string } route
 * @returns { Component }
 */
const renderComponent = (routes, route) => {
    const routeConfig = routes.find(r => r.path === route);
    if (!routeConfig) {
        return (0, NotFoundSetup_js_1.NotFoundSetup)(route);
    }
    return routeConfig.component;
};
const navigateTo = (/** @type {string | URL | null | undefined} */ route) => {
    window.history.pushState(null, "", route);
    if (!handleNavigation) {
        throw new Error("The routing has been setup.");
    }
    handleNavigation();
};
exports.navigateTo = navigateTo;
/**
 * @type { (() => void) | undefined }
 */
let handleNavigation = undefined;
/**
 * An array of cleanup functions returned by the handleComponent function
 * @type {Array<(() => void)>}
 */
const cleanupCallbacks = [];
/**
 * @param {(component: Component) => (() => void)} handleComponent
 * @param {Route[]} routes
 */
const setupRoutes = (handleComponent, routes) => {
    if (handleNavigation) {
        throw new Error("The routing has already been configured.");
    }
    handleNavigation = () => {
        const currentRoute = window.location.pathname;
        if (cleanupCallbacks.length > 0) {
            cleanupCallbacks.forEach(c => c());
            cleanupCallbacks.length = 0;
        }
        const cleanup = handleComponent(renderComponent(routes, currentRoute));
        cleanupCallbacks.push(cleanup);
    };
    // Initial rendering based on the current route
    handleNavigation();
    // Listen for changes to the URL and handle navigation
    window.addEventListener('popstate', handleNavigation);
};
exports.setupRoutes = setupRoutes;
