import { getProductDetails, saveProduct } from "../controller/productController.js";
import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";
import { uid } from "../logic/commonLogic.js";
import { ProductFormSetup } from "./ProductFormSetup.js";


export const ProductProfileSetup = () => {
    const product = ref(null);
    const isEditable = ref(false);

    const formId = uid();

    const productFormComponent = ProductFormSetup();

    const refreshProduct = async (/** @type {string} */ clientId, /** @type {string} */ productId) => {
        product.value = await getProductDetails(clientId, productId);
    };

    return defineComponent({
        /**
         * @param {any} _children
         */
        render({ clientId = "", productId = "" }, _children) {
            if (clientId == null || clientId === "" || productId == null || productId === "") {
                return div(["No se a pasado el id de un cliente o producto."]);
            }

            if (product.value == null) {
                refreshProduct(clientId, productId);
                return div(["Cargando"]);
            }
            /**
             * @type {never[]}
             */

            return div([
                el(productFormComponent, {
                    product: product.value,
                    formId,
                    isEditable: isEditable.value
                }),
                el("button", {
                    click: function (evt) {
                        isEditable.value = !isEditable.value;
                        if (isEditable.value === false) {
                            document.forms[formId].reset();
                        }
                    }
                }, [isEditable.value ? "Cancelar" : "Editar"]),
                isEditable.value ?
                    el("button", {
                        click: async function (evt) {
                            const productToSend = {
                                // This has to go first.
                                kind: "Base",
                                id: productId
                            };
                            for (const [key, value] of new FormData(document.forms[formId])) {
                                if (typeof product.value[key] == "number") {
                                    productToSend[key] = Number.parseFloat(value);
                                } else {
                                    productToSend[key] = value;
                                }
                            }
                            await saveProduct(clientId, productToSend);
                            await refreshProduct(clientId, productId);
                            isEditable.value = false;
                        }
                    }, [
                        "Guardar cambios"
                    ]) : el("button", {
                        click: function (evt) {
                            refreshProduct(clientId, productId);
                        }
                    }, ["Refrescar"]),
                el("button", { click: function (evt) {
                    window.location.href = "/Home/Client/" + clientId;
                }}, ["Ver perfil de cliente"]),
            ]);
        }
    });
};