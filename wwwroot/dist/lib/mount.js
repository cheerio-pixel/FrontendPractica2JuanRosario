"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = void 0;
/**
 * @param {HTMLElement | Text} $node
 * @param {HTMLElement} $target
 */
const mount = ($node, $target) => {
    /* $target.innerHTML = $node.outerHTML; */
    // $target.replaceWith($node);
    $target.textContent = '';
    $target.appendChild($node);
    // $target.parentNode?.replaceChild($node, $target);
    return $node;
};
exports.mount = mount;
