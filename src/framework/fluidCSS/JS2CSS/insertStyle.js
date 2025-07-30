import { parseCSS } from "./parceCSS.js";

export function insertStyle({ style, id, clases = [], ...rest }) {
  if (!Array.isArray(clases)) {
    clases = [clases];
  }
  if (!style) {
    if (id) {
      style =
        document.querySelector(`style#${id}`) ||
        document.createElement("style");
      style.id = id;
    } else {
      style = document.createElement("style");
    }
    style.classList.add("JS2CSS", ...clases);
    return insertStyle({ style, id, clases, ...rest });
  }
  if (!document.head.contains(style)) {
    document.head.appendChild(style);
  }
  style.innerHTML = parseCSS(rest);
  return style;
}
