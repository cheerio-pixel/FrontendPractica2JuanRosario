

/**
 * @enum {number}
 */

export const TipoProducto = {
    Base: "Base",
    Cuenta_de_Ahorro: "Cuenta_de_Ahorro",
    Cuenta_corriente: "Cuenta_corriente",
    Prestamo: "Prestamo",
    Tarjeta_de_credito: "Tarjeta_de_credito",
    Certificado: "Certificado",
};

/**
 * @typedef {Object} Producto
 * @param {string} id
 * @param {string} name
 * @param {TipoProducto} Tipo
 */
