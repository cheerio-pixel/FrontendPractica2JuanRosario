"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patch = void 0;
const render_js_1 = require("./render.js");
const patch = (virtNew, virtOld) => {
    if (virtNew.type !== virtOld.type) {
        return parent => (0, render_js_1.render)(virtNew);
    }
};
exports.patch = patch;
