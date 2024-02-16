
/** @typedef { import('./Components.js').Component } Component */
/** @typedef { import('./Element.js') } Element */
/** @typedef { { path: string, component: Component} } Route */

import { NotFoundSetup } from "../components/NotFoundSetup.js";

const parametersPlaceholdersRx = /\{[^{]+\}/g;

/** @typedef {{component: Component, params: Record<string, string> }} RouteMatchResult */

/**
 * @param { Array<Route> } routes
 * @param { string } route
 * @returns { RouteMatchResult }
 */
const renderComponent = (routes, route) => {
    for (const routeConfig of routes) {
        const matcher = new RegExp("^" + routeConfig.path.replace(parametersPlaceholdersRx, "([^/]+)") + "$");
        const match = matcher.exec(route);
        if (match) {
            /** @type {Record<string, string>}*/
            const params = {};
            routeConfig.path.match(parametersPlaceholdersRx)?.forEach((param, index) => {
                // Skip bracket chars. index + 1 to skip the whole string match.
                // @ts-ignore
                params[param.slice(1, -1)] = match[index + 1];
            });
            return { component: routeConfig.component, params: params };
        }
    }
    return { component: NotFoundSetup(route), params: (/** @type {Record<string, string>}*/{})};
};

export const navigateTo = (/** @type {string | URL | null | undefined} */ route) => {
    window.history.pushState(null, "", route);

    if (!handleNavigation) {
        throw new Error("The routing has been setup.");
    }

    handleNavigation();
}

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
 * @param {(matchResult: RouteMatchResult) => (() => void)} handleComponent
 * @param {Route[]} routes
 */
export const setupRoutes = (handleComponent, routes) => {
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
    }

    // Initial rendering based on the current route
    handleNavigation();

    // Listen for changes to the URL and handle navigation
    window.addEventListener('popstate', handleNavigation);
};
