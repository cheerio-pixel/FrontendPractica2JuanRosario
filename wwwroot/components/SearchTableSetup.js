import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { ref } from "../lib/reactivity.js";

/**
 * Number to be used for id;
 * @type {number}
 */
let lastId = 0;

/**
 * @param { (input: string) => Promise<Array<Object>> } searchCallback
 * @param { string } placeholder
 * @param { (getCurrentSelectedId: (() => string?)) => [import('../lib/Components.js').Element]} extraButtons
 * @param { import("../lib/reactivity.js").Ref<Array<object>>? } objects
 */
export const SearchTableSetup = (searchCallback, placeholder, extraButtons, objects = null) => {
    /** @type {import("../lib/reactivity.js").Ref<Array<any>>}*/
    if (objects == null) {
        objects = ref([]);
    }
    // /** @type {Array<Array<object>>}*/
    // const paginatedObjects = [];
    const isSearching = ref(false);
    const inputId = ++lastId + "SearchTableSetup";

    const radioButtonName = "cliente";
    const selectedClassName = "search-table-selected";

    const doSearch = async (value) => {
        isSearching.value = true;
        objects.value = await searchCallback(value ?? "");
        isSearching.value = false;
    };

    const getCurrentSelectedId = () => {
        const radioButton = document.querySelector(`tr[class=${selectedClassName}]`);
        return (/** @type {HTMLInputElement?}*/ (radioButton))?.id ?? null;
    };

    return defineComponent({
        objects,
        // Export for other components, because oh damn, i can't deal with this and the dealine is today.
        mounted() {
            return async () => {
                const input = (/** @type {HTMLInputElement}*/ (document.getElementById(inputId)))?.value;
                if (objects.value.length == 0 && (input == null || input == "")) {
                    await doSearch("");
                }
            };
        },
        /**
         * @param { any } _objects
         * @param { any } _children
         */
        render(_objects, _children) {
            return div([
                el("form", {
                    submit: async function (/** @type {Event}*/evt) {
                        evt.preventDefault();
                        const input = document.getElementById(inputId)?.value;
                        await doSearch(input);
                    }
                }, [
                    el("input", {
                        type: "search", placeholder: placeholder,
                        id: inputId
                    }),
                    el("button", ["Buscar"])
                ]),
                ...extraButtons(getCurrentSelectedId),
                el("br"),
                div([
                    isSearching.value ?
                        el("label", ["Cargando..."])
                        : objects.value.length != 0 ?
                            el("table", { class: "search-table" }, [
                                el("thead", [
                                    el("tr", createObjectHeader(objects.value))
                                ]),
                                el("tbody", createObjectRows(objects.value, radioButtonName, selectedClassName))
                            ])
                            : el("label", ["No hay resultados."])
                ]),
            ]);
        }
    });
};

/**
 * @param {Array<any>} objects
 */
const createObjectHeader = (objects) => {
    const result = [];
    const style = "height: 20px";
    for (const prop in objects[0]) {
        if (prop === "id") {
            continue;
        }
        const capitalizedName = prop.charAt(0).toUpperCase() + prop.substring(1);
        result.push(el("th", { id: prop, style: style }, [capitalizedName]));
    }
    // result.push(el("th", { id: "button", style: style }, ["Seleccion"]));
    return result;
};

/**
 * @param {Array<object>} objects
 */
const createObjectRows = (objects, name, selectedClassName) => {
    const style = "width: 25%; text-align: center; vertical-align: middle;";
    return objects.map(obj => {
        const ele = el("tr", {
            id: obj["id"], click: function (/** @type {Event}*/evt) {
                const $this = evt.target.parentNode;
                const $siblings = $this.parentNode.children;
                const input = document.getElementById(obj["id"]);
                if (!input) {
                    return;
                }
                if (input === evt.target) {
                    return
                }
                if (!input.checked) {
                    input.checked = true;
                }
                // Inneficiente, but we are not here for that.
                for (const child of $siblings) {
                    child.classList.remove(selectedClassName)
                }
                $this.classList.add(selectedClassName);
            }
        });
        for (const prop in obj) {
            if (prop == "id") {
                continue;
            }
            ele.appendChild(el("td", {
                headers: prop,
                style: style,
                // @ts-ignore
            }, [obj[prop]]));
        }
        // // @ts-ignore
        // ele.appendChild(el("input", {
        //     id: obj["id"],
        //     type: "radio",
        //     name: name,
        //     style: style,
        //     class: ""
        // }));
        return ele;
    });
};