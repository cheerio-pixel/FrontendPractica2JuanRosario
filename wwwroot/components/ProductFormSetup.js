import { defineComponent } from "../lib/Components.js";
import { div, el } from "../lib/Element.js";
import { uid } from "../logic/commonLogic.js";
import { TipoProducto } from "../models/Producto.js";



export const ProductFormSetup = () => {
    return defineComponent({
        /**
         * @param {any} _children
         */
        render({ product = null, formId = "", isEditable }, _children) {
            if (product == null || formId === "") {
                return div([]);
            }
            const formElements = [
                ...formPair("Nombre: ", uid(), "name", product.name),
                el("br"),
                ...formPair("Tipo: ", uid(), "kind", product.kind),
                el("br"),
            ];

            if (product.kind === TipoProducto.Base) {
                return div(["Tipo de producto invalido"]);
            } else if (product.kind === TipoProducto.Cuenta_de_Ahorro) {
                formElements.push(
                    ...formPair("Tasa Interes: ", uid(), "tasaInteres", product.tasaInteres, isEditable, "number"),
                    el("br"),
                    ...formPair("Saldo actual: ", uid(), "saldoActual", product.saldoActual, isEditable, "number"),
                );
            } else if (product.kind === TipoProducto.Cuenta_corriente) {
                formElements.push(
                    ...formPair("Saldo actual: ", uid(), "saldoActual", product.saldoActual, isEditable, "number"),
                );
            } else if (product.kind === TipoProducto.Prestamo) {
                formElements.push(
                    ...formPair("Monto prestado: ", uid(), "montoPrestado", product.montoPrestado, isEditable, "number"),
                )
            } else if (product.kind === TipoProducto.Tarjeta_de_credito) {
                formElements.push(
                    ...formPair("Saldo: ", uid(), "saldo", product.saldo, isEditable, "number"),
                    el("br"),
                    ...formPair("Limite Credito: ", uid(), "limiteCredito", product.limiteCredito, isEditable, "number"),
                );
            } else if (product.kind === TipoProducto.Certificado) {
                formElements.push(
                    ...formPair("Fecha Vencimiento: ", uid(), "fechaVencimiento", product.fechaVencimiento, isEditable, "date"),
                    el("br"),
                    ...formPair("Precio De Maduracion: ", uid(), "precioDeMaduracion", product.precioDeMaduracion, isEditable, "number"),
                );
            }
            return el("form", { id: formId }, formElements);
        }
    });
};

const formPair = (/** @type {any} */ name, /** @type {string}*/id, /** @type {String}*/
    propName, /** @type {string}*/ value, /** @type {bool}*/isEdit = false, type = "text",
    required = true
) => {
    const inputProps = { type: type, id: id, name: propName, value: value };
    if (type === "number") {
        inputProps.min = "0";
    }
    if (!isEdit) {
        inputProps.readonly = "";
    }
    if (required) {
        inputProps.required = "";
    }
    return [
        el("label", { for: id }, [name]),
        el("input", inputProps),
    ];
}