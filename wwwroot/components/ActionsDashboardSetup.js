import { getUserProfile, logout } from "../controller/loginController.js";
import { defineComponent } from "../lib/Components.js";
import { el, div, nbsp } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";
import { navigateTo } from "../lib/routing.js";


export const ActionsDashboardSetup = () => {
    const userProfile = ref(null);
    return defineComponent({
        mounted() {
            return async () => {
                if (userProfile.value == null) {
                    userProfile.value = await getUserProfile(localStorage.getItem("userIdentity") ?? "");
                }
            };
        },
        /**
         * @param {any} _children
         * @param {any} _objects
         */
        render(_objects, _children) {
            const contentDiv = div([
                el("button", { click: function (evt) {
                    logout();
                }}, ["Cerrar sesion"]),
                nbsp
            ]);
            if (userProfile.value != null) {
                const role = userProfile.value.role;
                if (role === "Agente De Servicios") {
                    contentDiv.appendChild(GestionClientes());
                } else if (role === "Gerente") {
                    contentDiv.appendChild(GestionClientes());
                    contentDiv.appendChild(navigateButton("/Home/GestionProductos", "Gestionar productos"));
                } else {
                    contentDiv.appendChild(
                        el("label", ["No sabemos cuales acciones mostrar para el rol " + role])
                    );
                }
            } else {
                contentDiv.appendChild("Cargando");
            }

            contentDiv.appendChild(el("hr"));
            return contentDiv;
        }
    });
};

const GestionClientes = () => {
    return el("span", [
        navigateButton("/Home", "Ver perfil"),
        navigateButton("/Home/Clientes", "Ver clientes"),
        navigateButton("/Home/Client", "Agregar cliente")
    ]);
};

const navigateButton = (url, text) => {
    return el("button", {
        click: function (/** @type {Event}*/event) {
            navigateTo(url);
        },
    }, [text])
};