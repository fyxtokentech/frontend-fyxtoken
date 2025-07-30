import { insertStyle } from "./insertStyle.js";
import { parseCSS } from "./parceCSS.js";

export * from "./insertStyle.js";
export * from "./parceCSS.js";
export * from "./vars.js";

export const JS2CSS = {
  parseCSS,
  insertStyle,
};

export default {
  parseCSS,
  insertStyle,
};
