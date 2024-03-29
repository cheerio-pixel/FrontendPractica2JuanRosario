
// https://stackoverflow.com/a/38699214

export const setCookie = (/** @type {string} */ name, /** @type {string | number | boolean} */ value, days = 7, path = '/') => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
}

export const getCookie = (/** @type {string} */ name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

export const deleteCookie = (/** @type {string} */ name, /** @type {string | undefined} */ path) => {
  setCookie(name, '', -1, path)
}