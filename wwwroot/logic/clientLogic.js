import { deleteClient, getClientDetails } from "../controller/clienteController.js";


export const refreshProfile = async (/** @type {import("../lib/reactivity.js").Ref<any>} */ clientRef, /** @type {string} */ clientId) => {
    clientRef.value = await getClientDetails(clientId);
    // That means it doesn't exists. Go back to home
    if (clientRef.value == null) {
        window.location.href = "/Home";
        alert("No se pudo encontrar un usuario con esa ID");
    }
};
export const handleDeleteOfUser = async (/** @type {string} */ clientId) => {
    if (confirm("¿Esta seguro de que quiere borrar a este cliente?")) {
        if (await deleteClient(clientId)) {
            window.location.href = "/Home/Clientes";
        } else {
            alert("Ocurrio un error al eliminar este cliente.");
        }
    }
};