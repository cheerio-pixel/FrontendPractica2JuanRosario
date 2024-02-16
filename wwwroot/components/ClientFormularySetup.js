import { defineComponent } from "../lib/Components.js";
import { div, el, nbsp } from "../lib/Element.js";
import { uid } from '../logic/commonLogic.js';
import { GCONFIG } from '../generalconfig.js';
import { createClient } from "../controller/clienteController.js";
import { navigateTo } from "../lib/routing.js";


export const ClientFormularySetup = () => {
    const fields = {
        name: uid(),
        surname: uid(),
        telefono: uid(),
        address: uid(),
        email: uid(),
        password: uid(),
    }
    const formId = uid();
    return defineComponent({
        render(_props, _children) {
            return div([
                el("form", {
                    id: formId,
                    submit: async function (/** @type {Event}*/evt) {
                        evt.preventDefault();
                        const clientToSend = {};
                        for (const [key, value] of new FormData(document.forms[formId])) {
                            clientToSend[key] = value;
                        }
                        const clientId = await createClient(clientToSend);
                        console.log(clientId);
                        if (!clientId) {
                            navigateTo("/Home/Client/" + clientId);
                        }
                    }
                }, [
                    ...formPair("Nombre: ", fields.name, "name", undefined, true),
                    el("br"),
                    ...formPair("Apellido: ", fields.surname, "surname", undefined, true),
                    el("br"),
                    ...formPair("Email: ", fields.email, "email", "email", true),
                    el("br"),
                    ...formPair("Contraseña: ", fields.password, "password", "password", true),
                    el("br"),
                    ...formPair("Telefono: ", fields.telefono, "telefono", "tel"),
                    el("br"),
                    ...formPair("Direccion: ", fields.address, "address"),
                    el("br"),
                    el("button", ["Enviar"]),
                    nbsp,
                    el("button", {
                        click: function (/** @type {Event}*/evt) {
                            evt.preventDefault();
                            document.forms[formId].reset();
                        }
                    }, ["Borrar formulario"]),
                ]),
            ]);
        }
    });
};

const formPair = (/** @type {any} */ name, /** @type {string}*/id, /** @type {String}*/ propName, type = undefined, required = false) => {
    const inputProps = { type: "text", id: id, name: propName};
    if (type != undefined) {
        inputProps.type = type;
    }
    if (required) {
        inputProps.required = "";
    }
    return [
        el("label", { for: id }, [name]),
        el("input", inputProps),
    ];
}