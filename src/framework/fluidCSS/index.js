import JS2CSS from "./JS2CSS/index.js";

import {
  isSmall,
  isMedium,
  isLarge,
} from "./vars.js";

import { nuevoContextoFluidCSS } from "./context.js";

export { isSmall, isMedium, isLarge, JS2CSS };

export function fluidCSS() {
  return new nuevoContextoFluidCSS();
}
