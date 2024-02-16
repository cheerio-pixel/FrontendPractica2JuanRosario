import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";




export const NotFoundSetup = (message = "") => {
    return defineComponent({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            return div({ class: "center-h" }, [
                div({ class: "center-v" }, [
                    el("h1", { class: "text-danger" }, ["Error 404 No se pudo encontrar."]),
                    // el("br"),
                    el("h2", { class: "text-danger" }, [message]),
                ])
            ]);
        }
    });
};
