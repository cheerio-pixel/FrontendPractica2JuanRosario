import { CONFIG } from "../apiconfig.js";
import { fetcher } from "../lib/fetcher.js";



export const getUserProfile = async (/** @type {String} */ email) => {
    const response = await fetcher(CONFIG.API + "/login?" + new URLSearchParams({
        email: email
    }), { method: "GET" });
    // const response = await fetch(, {
    //     method: "GET",
    //     mode: "cors",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": localStorage.getItem("JwtToken") ?? ""
    //     },
    // });
    if (response.ok) {
        return await response.json();
    } else if (response.status == 401) {
        logout();
    } else {
        return { errors: [response.json()] };
    }
};

export const logout = () => {
    localStorage.removeItem("JwtToken")
    localStorage.removeItem("userIdentity");
    window.location.href = '/Login';
};