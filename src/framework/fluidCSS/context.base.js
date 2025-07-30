import { JS2CSS } from "./JS2CSS/index.js";
import { actualizar_style } from "./style.js";
import { diccionario, estructuras } from "./vars.js";

export class base {
  constructor() {
    this.retorno = [];
  }

  serie(operador, name, props) {
    const struct = this.props2string(props, 0);
    const key = [struct, operador].join("-");
    const existe = diccionario[key];

    const mascara_serie = Math.random()
      .toString(36)
      .replace("0.", name + "-");

    if (!diccionario[key]) {
      diccionario[key] = mascara_serie;
    }

    this.retorno.push(diccionario[key]);

    if (existe) {
      return this; // Ya existe la propiedad
    }

    estructuras[mascara_serie] = `.${mascara_serie}${operador}{
        ${struct}
    }`;

    return this;
  }

  props2string(props, indice_estado) {
    return JS2CSS.parseCSS(this.recursiveIndexSelector(props, indice_estado));
  }

  recursiveIndexSelector(obj, index, deep = 0) {
    let r = Object.entries(obj).map(([key, val]) => {
      if (Array.isArray(val)) {
        return [key, val[index]];
      }
      if (typeof val == "object") {
        return [key, this.recursiveIndexSelector(val, index, deep + 1)];
      }
      return [key, [val][index]];
    });
    r = r.filter(([, v]) => v);
    r = r.reduce((acc, [key, obj]) => {
      acc[key] = obj;
      return acc;
    }, {});
    return r;
  }

  end(...extra_clases) {
    extra_clases = extra_clases.join(" ");
    this.retorno.push(extra_clases);
    const retorno = this.retorno.join(" ").replace(/\s+/g, " ").trim();
    setTimeout(actualizar_style);
    return retorno;
  }

  actualizarStyle() {
    actualizar_style();
  }
}
