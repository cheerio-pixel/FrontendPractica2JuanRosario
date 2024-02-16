

export const [hookOnMounted, dispatchOnMounted] = (function() {

    /**
     * @type {Array<() => void>}
     */
    const onMounted = [];

    /**
     * @param {() => void} callback
     */
    function hookOnMounted(callback) {
        onMounted.push(callback);
    }

    /**
     * Run all function that were hook to run on mounted.
     */
    function dispatchOnMounted() {
        onMounted.forEach(fun => {
            fun();
        });
        // onMounted.length = 0;
    }

    return [hookOnMounted, dispatchOnMounted];
})();