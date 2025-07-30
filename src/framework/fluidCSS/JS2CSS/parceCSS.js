import { CSS_ATTRS_NUMBER, HTML_TAGS } from "./vars.js";

export function parseCSS({
  infer = true,
  decimalsInfer = 3,
  clasesKebab = true,
  deep = 0,
  ...objJs
}) {
  const estiloConvertido = {};

  Object.entries(objJs).forEach(([key, value]) => {
    const isHTMLDefault = HTML_TAGS.some((e) => e == key);
    const isClassCSS = typeof value == "object";

    const classSelector = key.startsWith(".");
    const idSelector = key.startsWith("#");
    const decorSelector = key.startsWith("@");
    const isVar = key.startsWith("--");

    const inferClass = [classSelector, idSelector, decorSelector, isVar].every(
      (e) => !e
    );

    if (inferClass && !key.includes(",") && !isHTMLDefault) {
      const kebab = !isClassCSS
        ? key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
        : key;
      if (clasesKebab && key != kebab) {
        if (isClassCSS) {
          key = "." + kebab;
        } else {
          key = kebab;
        }
      }
    }
    estiloConvertido[key] = (() => {
      if (isClassCSS) {
        const str = parseCSS({
          deep: deep + 1,
          infer,
          decimalsInfer,
          clasesKebab,
          ...value,
        });
        let retorno = JSON2CSS_format(str);
        return retorno;
      }

      const isNumber = typeof value == "number";
      const noIntuir = !CSS_ATTRS_NUMBER.includes(key);

      if (infer && isNumber && noIntuir) {
        return `${parseFloat(value.toFixed(decimalsInfer))}px`;
      }
      return value;
    })();
  });
  
  const str = JSON.stringify(estiloConvertido, null, 1);

  let retorno = JSON2CSS_format(str);

  if (deep == 0) {
    retorno = retorno.substring(1, retorno.length - 1);
  }

  return retorno; // Elimina las llaves que encierran al objeto.
}

function JSON2CSS_format(str) {
  let retorno = str // Convierte el objeto JSON a un string con formato de tabulación.
    .replaceAll('\\"', "$comillas$")
    .replaceAll('"', "") // Elimina las comillas dobles.
    .replace(/\}\s*,/g, "}") // Elimina las comas al final de los objetos de JSON para que no genere errores en CSS.
    .replace(/,\n/g, ";") // Reemplaza las comas al final de las líneas por punto y coma.
    .replace(/:?\s*"?\{\s*/g, "{") // Elimina los dos puntos antes de las llaves.
    .replace(/\\[nr]/g, " ") // Elimina los saltos de línea en string
    .replaceAll("$comillas$", '"') // Elimina los saltos de línea en string
    .replace(/\s+/g, " "); // Elimina espacios o saltos de línea innecesarios

  return retorno;
}
