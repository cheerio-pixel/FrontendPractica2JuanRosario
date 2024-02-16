"use strict";
// https://stackoverflow.com/a/38699214
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCookie = exports.getCookie = exports.setCookie = void 0;
const setCookie = (/** @type {string} */ name, /** @type {string | number | boolean} */ value, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
};
exports.setCookie = setCookie;
const getCookie = (/** @type {string} */ name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
};
exports.getCookie = getCookie;
const deleteCookie = (/** @type {string} */ name, /** @type {string | undefined} */ path) => {
    (0, exports.setCookie)(name, '', -1, path);
};
exports.deleteCookie = deleteCookie;
