
import { ref, watchEffect } from "./reactivity.js";



/** @type {import("./reactivity").Ref<(() => import("./Element.js").Element)?>}*/
let navbar = ref(null);

export const setNavbar = (/** @type {(() -> import("./Element.js").Element) | null} */ element) => {
    navbar.value = element;
}

/** @type {(() => void)?}*/
let currentHandlerEffectCleanupFunction = null;
/** @type {(() => void)?}*/
let innerCurrentHandlerEffectCleanupFunction = null;

export const handleNavbarChange = (/** @type {(elementFactory: ((() => import("./Element.js").Element)?)) => () => void} */ handler) => {
    currentHandlerEffectCleanupFunction?.();
    innerCurrentHandlerEffectCleanupFunction?.();

    currentHandlerEffectCleanupFunction = watchEffect(() => {
        innerCurrentHandlerEffectCleanupFunction = handler(navbar.value);
    });
}