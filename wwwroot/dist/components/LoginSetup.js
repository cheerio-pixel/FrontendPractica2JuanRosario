"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSetup = exports.getInputValue = void 0;
const Components_js_1 = require("../lib/Components.js");
const Element_js_1 = require("../lib/Element.js");
const cookies_js_1 = require("../lib/cookies.js");
const cookies_js_2 = require("../types/cookies.js");
const getInputValue = (/** @type {string} */ id) => {
    var _a;
    return (_a = ( /** @type {HTMLInputElement?}*/(document.getElementById(id)))) === null || _a === void 0 ? void 0 : _a.value;
};
exports.getInputValue = getInputValue;
const LoginSetup = () => {
    const emailId = "emailInput";
    const passwordId = "passwordInput";
    return (0, Components_js_1.defineComponent)({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            return (0, Element_js_1.div)({}, [
                (0, Element_js_1.el)("h1", ["Incio de sesion"]),
                (0, Element_js_1.el)("form", [
                    (0, Element_js_1.el)("label", { for: "emailInput" }, ["Email:"]),
                    (0, Element_js_1.el)("input", {
                        type: "email", id: emailId,
                        value: (0, cookies_js_1.getCookie)(cookies_js_2.COOKIES.LOGIN_EMAIL) || "",
                        keyup: function (/** @type {any} */ evt) {
                            (0, cookies_js_1.setCookie)(cookies_js_2.COOKIES.LOGIN_EMAIL, evt.target.value);
                        }
                    }),
                    (0, Element_js_1.el)("br"),
                    (0, Element_js_1.el)("label", { for: "passwordInput" }, ["Contraseña:"]),
                    (0, Element_js_1.el)("input", { type: "password", id: passwordId }),
                    (0, Element_js_1.el)("br"),
                    (0, Element_js_1.el)("button", {
                        click: function (/** @type {any} */ evt) {
                            const email = (0, exports.getInputValue)(emailId);
                            const password = (0, exports.getInputValue)(passwordId);
                            console.log(email, password);
                        }
                    }, ["Inciar sesion"])
                ])
            ]);
        }
    });
};
exports.LoginSetup = LoginSetup;
