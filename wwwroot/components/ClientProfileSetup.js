import { deleteProduct } from "../controller/productController.js";
import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";
import { handleDeleteOfUser, refreshProfile } from "../logic/clientLogic.js";
import { SearchTableSetup } from "./SearchTableSetup.js";


export const ClientProfileSetup = () => {
    /** @type {import("../lib/reactivity.js").Ref<import("../models/Client.js").Client?>}*/
    const client = ref(null);
    const isEditar = ref(false);
    const resetForm = () => {
        document.getElementById("clientProfileForm")?.reset();
    };
    let externalClientId = "";
    const doSearch = async (/** @type {any} */ input) => {
        // Check non null
        if (client.value) {
            return client.value.productos.filter(p => p.name.includes(input));
        }
        return [];
    };
    const products = ref([]);

    const searchProductComponent = SearchTableSetup(
        doSearch, "Buscar productos", (getCurrentSelectedId) => {
            return [
                el("button", {
                    click: function (evt) {
                        const currentId = getCurrentSelectedId();
                        if (currentId == null || externalClientId === "") {
                            alert("Debe de seleccionar algun producto");
                            return;
                        }
                        window.location.href = `/Home/Client/${externalClientId}/Producto/${currentId}`;
                    }
                }, ["Ver detalles"]),
                el("button", {
                    click: async function (evt) {
                        const currentId = getCurrentSelectedId();
                        if (currentId == null || externalClientId === "") {
                            alert("Debe de seleccionar algun producto");
                            return;
                        }
                        if (confirm("¿Quiere borrar este producto?")) {
                            await deleteProduct(externalClientId, currentId);
                            await refreshProfile(client, externalClientId);
                            if (client.value != null) {
                                products.value = client.value.productos;
                            }
                        }
                    }
                }, ["Eliminar producto"]),
                el("button", {
                    click: function (evt) {
                        window.location.href = `/Home/Client/${externalClientId}/Producto`;
                    }
                }, ["Crear nuevo"])
            ];
        },
        products
    );

    return defineComponent({
        /**
         * @param {any} _children
         */
        render({ clientId = "" }, _children) {
            if (clientId === "") {
                return div(["No se a pasado el id de un cliente."]);
            }
            if (externalClientId === "" || externalClientId != clientId) {
                externalClientId = clientId;
            }
            if (client.value == null) {
                // Hiht coupling? Indeed, but that is a problem for later.
                (async () => {
                    await refreshProfile(client, clientId);
                    if (client.value != null) {
                        products.value = client.value.productos;
                    }
                })();
            }
            /**
             * @type {any[]}
             */
            const fields = [];
            for (const prop in client.value) {
                if (prop === "id") {
                    continue;
                }
                if (client.value[prop] instanceof Array) {
                    continue;
                }
                const capitalizedName = prop.charAt(0).toUpperCase() + prop.substring(1);
                Array.prototype.push.apply(fields, formPair(capitalizedName, client.value[prop], isEditar.value));
                fields.push(el("br"));
            }

            return div([
                client.value == null ?
                    el("div", ["Cargando usuario."])
                    : div({ style: "display: flex;" }, [
                        div({ class: "box" }, [
                            el("form", { id: "clientProfileForm" }, fields),
                            el("button", {
                                click: function (evt) {
                                    isEditar.value = !isEditar.value;
                                    if (isEditar.value === false) {
                                        resetForm();
                                    }
                                }
                            }, [isEditar.value ? "Cancelar" : "Editar"]),
                            isEditar.value ? el("button",
                                {
                                    click: async function (evt) {
                                        const clientToSend = {
                                            name: document.getElementById("Name")?.value,
                                            surname: document.getElementById("Surname")?.value,
                                            telefono: document.getElementById("Telefono")?.value,
                                            address: document.getElementById("Address")?.value,
                                            email: document.getElementById("Email")?.value,
                                            password: document.getElementById("Password")?.values ?? "",
                                        };

                                        if (await saveClient(clientId, clientToSend)) {
                                            refreshProfile(clientId);
                                        } else {
                                            resetForm();
                                        }
                                        isEditar.value = false;
                                    }
                                }, ["Guardar cambios"]) :
                                el("span"),
                            el("button", {
                                class: "danger", click: async function (evt) {
                                    handleDeleteOfUser(clientId);
                                }
                            }, ["Eliminar cliente."]),
                        ]),
                        div({ class: "box" }, [el(searchProductComponent)])
                    ])
            ]);
        }
    });
};

const formPair = (/** @type {any} */ name, /** @type {any} */ field, isEdit = false) => {
    const inputProps = { id: name, value: field };
    if (!isEdit) {
        // @ts-ignore
        inputProps.readonly = "";
    }
    return [
        el("label", { for: name }, [name]),
        el("input", inputProps)
    ]
};