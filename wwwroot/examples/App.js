"use strict";
import { defineComponent } from '../lib/Components.js';
import { el, div } from '../lib/Element.js';
import { getCookie, setCookie } from '../lib/cookies.js';
import { ref } from '../lib/reactivity.js';

/**
 * @template T
 * @typedef { import('../lib/reactivity.js').Ref<T> } Ref<T>
 */


export const App = () => {
    const quantity = ref(Number.parseInt(getCookie("quantity")) || 5);
    const columns = ref(Number.parseInt(getCookie("columns")) || 5);
    return defineComponent({
        /**
         * @param {any} _props
         * @param {any} _children
         */
        render(_props, _children) {
            setCookie("quantity", quantity.value, 0.0000115741 * 5);
            setCookie("columns", columns.value, 0.0000115741 * 5);
            return div({ style: "display: flex;" }, [
                el("button", {
                    class: "button",
                    /** @param {any} evt*/
                    click: function (evt) {
                        quantity.value += 1;
                    }
                }, ["Press here to append elements"]),
                div({}, [
                    /** @param {any} evt*/
                    el("button", {
                        class: "button",
                        /** @param {any} evt*/
                        click: function (evt) {
                            columns.value += 1;
                        }
                    }, ["Press here to append more columns"]
                    ),
                    el("table", { style: "border: 1px solid;" }, [
                        el("thead", {}, [Cols(columns.value)]),
                        el("tbody", {}, range(quantity.value).map(n => Row(n, columns.value))),
                    ]),
                    el("button", {
                        class: "button",
                        /** @param {any} evt*/
                        click: function (evt) {
                            if (columns.value > 1) {
                                columns.value -= 1;
                            }
                        }
                    },
                        ["Press here to delete columns"]
                    ),
                ]),
                el("button", {
                    class: "button",
                    /** @param {any} evt*/
                    click: function (evt) {
                        if (quantity.value > 1) {
                            quantity.value -= 1;
                        }
                    }
                }, ["Press here to delete elements"]
                )
            ])
        }
    });
};

/**
 * @param {Number} colNumber
 */
const Cols = (colNumber) => {
    return el("tr", { style: "border: 1px solid;" },
        range(colNumber).map((n) => {
            let char = String.fromCharCode(97 + n).toUpperCase()
            return el("th", { style: "border: 1px solid;" }, [char]);
        })
    );
}
/**
 * @param {Number} colNumber
 * @param {Number} rowNumber
 */
const Row = (rowNumber, colNumber) => {
    return el("tr", { style: "border: 1px solid;" }, [
        el("td", { style: "border: 1px solid;" }, [1, rowNumber]),
        ...range(1, colNumber).map((l) => el("td", { style: "border: 1px solid;" }, [l, rowNumber]))
    ]);
};

/**
 * @param {Number} start
 * @param {Number | undefined} stop
 * @param {Number | undefined} step
 */
const range = (start, stop = undefined, step = undefined) => {
    if (stop == null) {
        stop = start || 0;
        start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
    }

    return range;
};
