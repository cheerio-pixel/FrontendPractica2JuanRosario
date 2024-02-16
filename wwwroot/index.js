"use strict";

import { watchEffect } from './lib/reactivity.js';
import { diff } from './lib/diff.js';
import { setupRoutes } from './lib/routing.js';
import { render } from './lib/render.js';
import { mount } from './lib/mount.js';

import { ErrorSetup } from './components/ErrorSetup.js';
import { el } from './lib/Element.js';
import { HomeSetup } from "./components/HomeSetup.js";

import { dispatchOnMounted } from './lib/hooks.js';
import { SearchTableSetup } from './components/SearchTableSetup.js';
import { searchClientes } from './controller/clienteController.js';
import { logout } from './controller/loginController.js';
import { ClientProfileSetup } from './components/ClientProfileSetup.js';
import { handleNavbarChange, setNavbar } from './lib/navbar.js';
import { ActionsDashboardSetup } from './components/ActionsDashboardSetup.js';
import { handleDeleteOfUser } from './logic/clientLogic.js';
import { ClientFormularySetup } from "./components/ClientFormularySetup.js";
import { GestionProductosSetup } from "./components/GestionProductosSetup.js";
import { ProductProfileSetup } from './components/ProductProfileSetup.js';
import { ProductCreateSetup } from './components/ProductCreateSetup.js';

/**
 * @typedef { import('./lib/Element.js').Element } Element
 * @typedef { import('./lib/Components.js').Component } Component
 * @typedef { import('./lib/routing.js').Route } Route
 */

const home = HomeSetup();
const searchClients = SearchTableSetup(
    searchClientes, "Buscar cliente",
    (getCurrentSelecetedId) => {
        return [
            el("button", {
                click: function (/** @type {Event}*/evt) {
                    const currentId = getCurrentSelecetedId();
                    if (currentId == null) {
                        alert("Debe de tener seleccionado algun cliente.")
                        return;
                    }
                    window.location.href = `/Home/Client/${currentId}`;
                }
            }, ["Ver detalles de cliente"]),
            el("button", {
                class: "danger", click: function (evt) {
                    const currentId = getCurrentSelecetedId();
                    if (currentId == null) {
                        alert("Debe de tener seleccionado algun cliente.");
                        return;
                    }
                    handleDeleteOfUser(currentId);
                }
            }, ["Elimnar cliente"])
        ];
    }
);


/** @type {Array<Route>}*/
const routes = [
    { path: '/Home', component: home },
    { path: '/', component: home },
    { path: '/Home/Clientes', component: searchClients },
    { path: '/Home/Client/{clientId}', component: ClientProfileSetup() },
    { path: '/Home/Client', component: ClientFormularySetup() },
    { path: '/Home/GestionProductos', component: GestionProductosSetup() },
    { path: '/Home/Client/{clientId}/Producto/{productId}', component: ProductProfileSetup()},
    { path: '/Home/Client/{clientId}/Producto', component: ProductCreateSetup()},
    // { path: '/Home/Clientes/{search}', component: searchClients },
    // { path: '/Login', component:  LoginSetup()},
];

const handleMounting = (/** @type {HTMLElement} */ mountPoint, /** @type {() => import('./lib/Element.js').Element}*/elementFactory) => {
    /** @type {Element} */
    let virtApp;
    /**
     * @type {HTMLElement | Text | undefined}
     */
    let $el;

    return watchEffect(() => {
        try {
            const virtNewApp = elementFactory();
            const patch = diff(virtApp, virtNewApp);
            // @ts-ignore
            $el = patch($el);
            virtApp = virtNewApp;
        } catch (/** @type {any}*/e) {
            mount(render(el(ErrorSetup(JSON.stringify(e.message, null, 2)))), document.body);
            throw e;
        }
    }, {
        lazy: false,
        setup: () => {
            $el = mount(render(elementFactory(), true), mountPoint);

            dispatchOnMounted();
        }
    });
};

const handleNavbar = (/** @type {(() => import("./lib/Element.js").Element)?} */ element) => {
    const mountPoint = document.getElementById("nav-bar");
    if (mountPoint == null) {
        throw new Error("Couldn't find mount point #nav-bar");
    }
    if (element == null) {
        return () => {};
    }
    return handleMounting(mountPoint, element);
};

const navBar = ActionsDashboardSetup();

setNavbar(() => el(navBar));

handleNavbarChange(handleNavbar);


/**
 * @param { import('./lib/routing.js').RouteMatchResult } matchResult
 */
const handleRootComponent = (matchResult) => {
    const mountPoint = document.getElementById("app");
    if (mountPoint == null) {
        throw new Error("Couldn't find mount point #app");
    }

    return handleMounting(mountPoint, () => el(matchResult.component, matchResult.params));
};

setupRoutes(handleRootComponent, routes);

if (localStorage.getItem("JwtToken") == null) {
    logout();
}



// window.addEventListener("DOMContentLoaded", function () {
//     const mountPoint = document.getElementById("app");
//     if (mountPoint == null) {
//         throw new Error("Couldn't find mount point #app");
//     }

//     const AppComponent = App();
//     /** @type {Element} */
//     let virtApp;
//     let $el = mountPoint;

//     watchEffect(() => {
//         const virtNewApp = AppComponent.render();
//         const patch = diff(virtApp, virtNewApp);
//         // @ts-ignore
//         $el = patch($el);
//         virtApp = virtNewApp;
//     });
// }, false);

/* document.getElementById("app").innerHTML = render(element).outerHTML; */