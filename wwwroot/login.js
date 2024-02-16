
import { CONFIG } from './apiconfig.js';



document.getElementById("loginForm")?.addEventListener("submit", async evt => {
    evt.preventDefault();

    const email = document.getElementById("emailId")?.value;

    const response = await fetch(CONFIG.API + "/login", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": document.getElementById("passwordId")?.value,
        })
    });
    if (response.ok) {
        const token = await response.text();
        // Provisional, because I'm running out of time.
        localStorage.setItem("JwtToken", 'Bearer ' + token);
        localStorage.setItem("userIdentity", email);
        window.location.href = '/Home';
    } else {
        const errors = await response.json();
        alert(errors.message);
    }
});