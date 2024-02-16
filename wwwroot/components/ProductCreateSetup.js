import { createProduct, getProductConfiguration, getTemplate } from "../controller/productController.js";
import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";
import { capitalizeName, uid } from "../logic/commonLogic.js";
import { TipoProducto } from "../models/Producto.js";
import { ProductFormSetup } from "./ProductFormSetup.js";


export const ProductCreateSetup = () => {
    /** @type {import("../lib/reactivity.js").Ref<Array<{tipo: TipoProducto, isEnabled: Boolean}>>}*/
    const enabledProductTypes = ref(null);
    const productTemplate = ref(null);
    const refreshProductTemplate = async (type) => {
        productTemplate.value = await getTemplate(type);
    };

    const productFormComponent = ProductFormSetup();
    const formId = uid();
    const selectId = uid();
    return defineComponent({
        mounted() {
            return async () => {
                const value = document.getElementById(selectId)?.value;
                productTemplate.value = await getTemplate(value ?? TipoProducto.Cuenta_de_Ahorro);
            };
        },
        render({ clientId = "" }) {
            if (enabledProductTypes.value == null) {
                (async () => {
                    enabledProductTypes.value = await getProductConfiguration(true);
                })();
            }

            if (productTemplate.value == null || enabledProductTypes.value == null) {
                return div([
                    "Cargando..."
                ]);
            }
            if (enabledProductTypes.value.length === 0) {
                return div([
                    "Se desabilito la opcion de crear productos."
                ]);
            }
            return div([
                makeOptions(
                    "Seleccione el tipo: ",
                    enabledProductTypes.value.map(pt => {
                        return { value: pt.tipo, face: capitalizeName(pt.tipo.replace(/_/g, " ")) };
                    }),
                    selectId,
                    {
                        change: function (evt) {
                            const selected = document.getElementById(selectId)?.value;
                            refreshProductTemplate(selected ?? TipoProducto.Cuenta_de_Ahorro);
                        }
                    }
                ),
                el(productFormComponent, {
                    product: productTemplate.value,
                    formId: formId,
                    isEditable: true
                }),
                el("button", {
                    click: async function (evt) {
                        const productToSend = {
                            kind: TipoProducto.Base,
                            id: productTemplate.value.id,
                        };
                        for (const [key, value] of new FormData(document.forms[formId])) {
                            productToSend[key] = value;
                        }
                        console.log(productToSend);
                        const productId = await createProduct(clientId, productToSend);
                        if (productId) {
                            alert("Se pudo crear el producto exitosamente.");
                            window.location.href = `/Home/Client/${clientId}`;
                        }
                    }
                }, ["Enviar"]),
                el("button", {
                    click: function (evt) {
                        window.location.href = `/Home/Client/${clientId}`;
                    }
                }, ["Volver al perfil de cliente"])
            ]);
        }
    });
};

const makeOptions = (/** @type {string}*/title,
    /** @type {Array<{ value: any, face: string }>}*/options, /** @type {string}*/id,
    /** @type {undefined} */ props) => {
    return div([
        el("label", { for: id }, [
            title
        ]),
        el("select", Object.assign({ id: id }, props),
            options.map((o) => {
                return el("option", { value: o.value }, [o.face])
            })
        )
    ]);
};