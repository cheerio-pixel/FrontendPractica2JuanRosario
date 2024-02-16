import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { getCookie, setCookie } from "../lib/cookies.js";
import { COOKIES } from "../types/cookies.js";

export const getInputValue = (/** @type {string} */ id) => {
    return (/** @type {HTMLInputElement?}*/ (document.getElementById(id)))?.value;
};


export const LoginSetup = () => {
    const emailId = "emailInput";
    const passwordId = "passwordInput";

    return defineComponent({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            return div({}, [
                el("h1", ["Incio de sesion"]),
                el("form", [
                    el("label", { for: "emailInput" }, ["Email:"]),
                    el("input", {
                        type: "email", id: emailId,
                        value: getCookie(COOKIES.LOGIN_EMAIL) || "",
                        keyup: function (/** @type {any} */ evt) {
                            setCookie(COOKIES.LOGIN_EMAIL, evt.target.value);
                        }
                    }),
                    el("br"),
                    el("label", { for: "passwordInput" }, ["Contraseña:"]),
                    el("input", { type: "password", id: passwordId }),
                    el("br"),
                    el("button", {
                        click: function (/** @type {any} */ evt) {
                            const email = getInputValue(emailId);
                            const password = getInputValue(passwordId);
                        }
                    }, ["Inciar sesion"])
                ])
            ]);
        }
    });
};
