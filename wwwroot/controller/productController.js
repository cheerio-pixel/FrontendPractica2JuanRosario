import { CONFIG } from "../apiconfig.js"
import { fetcher } from "../lib/fetcher.js";
import { historyBackWFallback } from "../logic/commonLogic.js";



export const getProductConfiguration = async (/** @type {Boolean}*/ filtered = false) => {
    const url = CONFIG.API + "/products/status?filtered=" + filtered;

    const response = await fetcher(url, { method: "GET"});

    if (response.status === 403) {
        alert("No tienes acceso a esta opcion.")
        window.location.href = "/Home";
        return null;
    }
    if (response.ok) {
        return await response.json();
    }
    return null;
}

export const saveProductConfiguration = async (/** @type {any} */ productConfig) => {
    const url = CONFIG.API + "/products/status";
    const response = await fetcher(url, {
        method: "PUT",
        body: JSON.stringify(productConfig)
    });

    if (response.status === 500) {
        alert((/** @type { Array<Object> }*/ ((await response.json()).errors)).join("\n"));
        return null;
    }
    if (response.ok) {
        return await response.json();
    }
    return null;
}

export const getProductDetails = async (/** @type {string} */ clientId, /** @type {string} */ productId) => {
    const url = CONFIG.API + `/client/${clientId}/product/${productId}`;
    const response = await fetcher(url, {
        method: "GET"
    });

    if (response.status === 404) {
        /** @type {Array<Object>}*/
        const errors = (await response.json()).errors;
        alert(errors.join("\n"));
        historyBackWFallback(
            "/Home"
        );
    }
    if (response.ok) {
        return await response.json();
    }
    return null;
};

export const saveProduct = async (/** @type {string} */ clientId, /** @type {object} */ product) => {
    const url = CONFIG.API + `/client/${clientId}/product`;
    const response = await fetcher(url, {
        method: "PUT",
        body: JSON.stringify(product)
    });

    if (response.ok) {
        return (await response.json()).value;
    } else {
        alert((await response.json()).errors.join("\n"));
        return null;
    }
};

export const createProduct = async (clientId, product) => {
    const url = CONFIG.API + `/client/${clientId}/product`;
    const response = await fetcher(url, {
        method: "POST",
        body: JSON.stringify(product)
    });

    if (response.ok) {
        return (await response.json()).value;
    } else {
        alert((await response.json()).errors.join("\n"));
        return null;
    }
};

export const deleteProduct = async (clientId, productId) => {
    const url = CONFIG.API + `/client/${clientId}/product/${productId}`;
    const response = await fetcher(url, {
        method: "DELETE",
    });
    if (!response.ok) {
        alert((await response.json()).errors.join("\n"));
    }
};

export const getTemplate = async (/** @type {string} */ type) => {
    const url = CONFIG.API + `/product/${type}`;
    const response = await fetcher(url, {
        method: "GET"
    });

    if (response.ok) {
        return (await response.json());
    } else {
        alert((await response.json()).errors.join("\n"));
        return null;
    }
};