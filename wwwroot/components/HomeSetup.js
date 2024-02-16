
import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";

import { hookOnMounted } from '../lib/hooks.js';
import { getUserProfile } from "../controller/loginController.js";
import { ActionsDashboardSetup } from "./ActionsDashboardSetup.js";
import { setNavbar } from "../lib/navbar.js";


export const HomeSetup = () => {
    const ActionsDashboard = ActionsDashboardSetup();

    /** @type {import("../lib/reactivity.js").Ref<any?>}*/
    const userProfile = ref(null);

    // hookOnMounted(async () => {
    //     if (userProfile.value == null) {
    //         userProfile.value = await getUserProfile(localStorage.getItem("userIdentity") ?? "");
    //     }
    // });

    return defineComponent({
        mounted() {
            return async () => {
                if (userProfile.value == null) {
                    userProfile.value = await getUserProfile(localStorage.getItem("userIdentity") ?? "");
                }
            }
        },
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            if (userProfile.value) {
                // if (userProfile.value.errors) {
                //     return div({}, [
                //         errors.forEach((/** @type {{ message: any; }} */ e) => el("div", [e.message]))
                //     ]);
                // }
                return div({}, [
                    Pair("Nombre de usuario: ", userProfile.value.firstName + " " + userProfile.value.lastName),
                    el("br"),
                    Pair("Email: ", userProfile.value.email),
                    el("br"),
                    Pair("Rol: ", userProfile.value.role)
                ]);
            } else {
                return div({}, [
                    "Cargando"
                ]);
            }
        }
    });
};

const Pair = (/** @type {any} */ key, /** @type {any} */ value) => {
    return div({}, [
        el("label", {}, [key]),
        el("label", {}, [value])
    ]);
};