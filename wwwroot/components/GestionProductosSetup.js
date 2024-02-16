import { getProductConfiguration, saveProductConfiguration } from "../controller/productController.js";
import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";
import { capitalizeName, uid } from "../logic/commonLogic.js";

export const GestionProductosSetup = () => {
    const isEditar = ref(false);
    /** @type { import("../lib/reactivity.js").Ref<Array<{ tipo: string, isEnabled: boolean }?>> }*/
    const productConfig = ref(null);
    const refreshProductConfig = () => {
        (async () => productConfig.value = await getProductConfiguration())();
    };
    const formId = uid();
    return defineComponent({
        render() {
            if (!productConfig.value) {
                refreshProductConfig();
            }
            return div([
                !productConfig.value ? div(["Cargando"]) :
                    div([
                        el("form", {
                            id: formId,
                        }, [
                            ...[].concat(
                                ...productConfig.value.filter(pc => pc?.tipo != "Base").map(pc => {
                                    return pairStatus(
                                        capitalizeName(pc.tipo.replace(/_/g, " ")) + ": ",
                                        pc.isEnabled,
                                        pc.tipo,
                                        isEditar.value
                                    );
                                })
                            )
                        ]),
                        isEditar.value ?
                            div([
                                el("button", {
                                    click: async function (evt) {
                                        const productConfigToSend = [];
                                        for (const inputNode of document.forms[formId].querySelectorAll("input[type=checkbox]")) {
                                            productConfigToSend.push({
                                                tipo: inputNode.id,
                                                isEnabled: inputNode.checked
                                            });
                                        }
                                        saveProductConfiguration(productConfigToSend);
                                        isEditar.value = false;
                                        refreshProductConfig();
                                    }
                                }, ["Guardar cambios"]),
                                el("button", {
                                    click: function (/** @type {Event}*/evt) {
                                        document.forms[formId].reset();
                                        isEditar.value = false;
                                    }
                                }, ["Cancelar"])
                            ])
                            :
                            div([
                                el("button", {
                                    click: function (evt) {
                                        isEditar.value = true;
                                    }
                                }, ["Editar"]),
                                el("button", {
                                    click: function (evt) {
                                        refreshProductConfig();
                                    }
                                }, ["Refrescar"])
                            ])])
            ]);
        }
    });
};

const pairStatus = (/** @type {any} */ presentationName, /** @type {any} */ status, /** @type {any} */ propName, isEditar) => {
    const inputProps = { type: "checkbox", id: propName };
    if (status) {
        inputProps.checked = true;
    }
    if (!isEditar) {
        inputProps.disabled = "";
    }
    return [
        el("label", { for: propName }, [presentationName]),
        el("input", inputProps),
        el("br"),
    ];
};
