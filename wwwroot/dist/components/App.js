"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const Element_js_1 = require("../lib/Element.js");
const cookies_js_1 = require("../lib/cookies.js");
const reactivity_js_1 = require("../lib/reactivity.js");
/**
 * @template T
 * @typedef { import('../lib/reactivity.js').Ref<T> } Ref<T>
 */
const App = () => {
    const quantity = (0, reactivity_js_1.ref)(Number.parseInt((0, cookies_js_1.getCookie)("quantity")) || 5);
    const columns = (0, reactivity_js_1.ref)(Number.parseInt((0, cookies_js_1.getCookie)("columns")) || 5);
    return {
        render() {
            (0, cookies_js_1.setCookie)("quantity", quantity.value, 0.0000115741 * 5);
            (0, cookies_js_1.setCookie)("columns", columns.value, 0.0000115741 * 5);
            return (0, Element_js_1.div)({ style: "display: flex;" }, [
                (0, Element_js_1.el)("button", {
                    /** @param {any} evt*/
                    click: function (evt) {
                        quantity.value += 1;
                    }
                }, ["Press here to append elements"]),
                (0, Element_js_1.div)({}, [
                    /** @param {any} evt*/
                    (0, Element_js_1.el)("button", {
                        /** @param {any} evt*/
                        click: function (evt) {
                            columns.value += 1;
                        }
                    }, ["Press here to append more columns"]),
                    (0, Element_js_1.el)("table", { style: "border: 1px solid;" }, [
                        (0, Element_js_1.el)("thead", {}, [Cols(columns.value)]),
                        (0, Element_js_1.el)("tbody", {}, range(quantity.value).map(n => Row(n, columns.value))),
                    ]),
                    (0, Element_js_1.el)("button", {
                        /** @param {any} evt*/
                        click: function (evt) {
                            if (columns.value > 1) {
                                columns.value -= 1;
                            }
                        }
                    }, ["Press here to delete columns"]),
                ]),
                (0, Element_js_1.el)("button", {
                    /** @param {any} evt*/
                    click: function (evt) {
                        if (quantity.value > 1) {
                            quantity.value -= 1;
                        }
                    }
                }, ["Press here to delete elements"])
            ]);
        }
    };
};
exports.App = App;
/**
 * @param {Number} colNumber
 */
const Cols = (colNumber) => {
    return (0, Element_js_1.el)("tr", { style: "border: 1px solid;" }, range(colNumber).map((n) => {
        let char = String.fromCharCode(97 + n).toUpperCase();
        return (0, Element_js_1.el)("th", { style: "border: 1px solid;" }, [char]);
    }));
};
/**
 * @param {Number} colNumber
 * @param {Number} rowNumber
 */
const Row = (rowNumber, colNumber) => {
    return (0, Element_js_1.el)("tr", { style: "border: 1px solid;" }, [
        (0, Element_js_1.el)("td", { style: "border: 1px solid;" }, [1, rowNumber]),
        ...range(1, colNumber).map((l) => (0, Element_js_1.el)("td", { style: "border: 1px solid;" }, [l, rowNumber]))
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
