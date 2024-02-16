import { logout } from "../controller/loginController.js";



export const fetcher = async (/** @type {RequestInfo | URL} */ url, /** @type {any} */ options) => {
    const response = await fetch(url, Object.assign({
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("JwtToken") ?? ""
        },
    }, options));

    if (response.status === 401) {
        logout();
    }
    return response;
};