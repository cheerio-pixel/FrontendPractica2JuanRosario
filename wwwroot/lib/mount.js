"use strict";


/**
 * @param {HTMLElement | Text} $node
 * @param {HTMLElement} $target
 */
export const mount = ($node, $target) => {
    /* $target.innerHTML = $node.outerHTML; */
    // $target.replaceWith($node);
    $target.textContent = '';
    $target.appendChild($node);
    // $target.parentNode?.replaceChild($node, $target);
    return $node;
}
