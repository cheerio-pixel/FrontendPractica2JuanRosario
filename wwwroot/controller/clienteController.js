import { CONFIG } from "../apiconfig.js";
import { fetcher } from "../lib/fetcher.js";
import { logout } from "./loginController.js";


/**
 * @returns { Promise<Array<import("../models/Client.js").Client>> }
*/
export const searchClientes = async (/** @type {string} */ input) => {
    const params = {
        name: input,
    };
    const url = CONFIG.API + "/clients/search?" + new URLSearchParams(params);

    const response = await fetcher(url, { method: "GET" });
    /** @type { Array<import("../models/Client.js").Client> | import("../models/Error.js").RequestError }*/

    if (response.ok) {
        return (/** @type {Array<import("../models/Client.js").Client>}*/(await response.json()));
    } else {
        alert((/** @type {import("../models/Error.js").RequestError}*/ (await response.json())).message);
        return [];
    }
};

export const getClientDetails = async (/** @type {string} */ clientId) => {
    const url = CONFIG.API + "/client/" + clientId;

    const response = await fetcher(url, { method: "GET" });

    if (response.ok) {
        /** @type {import("../models/Client.js").Client}*/
        return await response.json();
    } else {
        /** @type { import("../models/Error.js").RequestError }*/
        alert((await response.json()).message);
        return null;
    }
}

export const saveClient = async (/** @type {string}*/ id, /** @type { import("../models/Client.js").Client }*/ client) => {
    const url = CONFIG.API + "/client/" + id;

    const response = await fetcher(url, { method: "PUT", body: JSON.stringify(client) });

    const body = await response.json();

    if (response.ok) {
        return true;
    } else {
        alert(body.message);
        return false;
    }
};

export const deleteClient = async (/** @type {string}*/ id) => {
    const url = CONFIG.API + "/client/" + id;
    const response = await fetcher(url, { method: "DELETE"});


    if (response.ok) {
        return true;
    } else {
        alert((await response.json()).message);
        return false;
    }
}

export const createClient = async (/** @type { import("../models/Client.js").Client }*/ client) => {
    const url = CONFIG.API + "/client";
    const response = await fetcher(url, {
        method: "POST",
        body: JSON.stringify(client)
    });

    if (response.status == 409) {
        alert((/** @type { Array<Object> }*/ ((await response.json()).errors)).join("\n"));
        return null;
    }
    if (response.ok) {
        // Receiving Guid
        return await response.text();
    }
    return null;
}