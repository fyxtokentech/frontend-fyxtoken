import { initializeThemeColors } from "./manager/palettes.polychroma";
import { readyThemeManager } from "./manager/manager";

export function initThemeCamaleon() {
  initializeThemeColors();
  readyThemeManager();
}
