

// https://stackoverflow.com/a/53116778
export const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
}
export const capitalizeName = (name) => {
    return name.replace(/\b(\w)/g, s => s.toUpperCase());
}

// https://stackoverflow.com/a/24056766
export const historyBackWFallback = (fallbackUrl) => {
    fallbackUrl = fallbackUrl || '/';
    var prevPage = window.location.href;

    window.history.go(-1);

    setTimeout(function(){
        if (window.location.href == prevPage) {
            window.location.href = fallbackUrl;
        }
    }, 500);
}


