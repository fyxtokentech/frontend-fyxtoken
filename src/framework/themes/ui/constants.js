import { getAllThemesRegistered } from "../rules/manager/index.js";
import { Color } from "../rules/colors.js";
import { JS2CSS } from "../../fluidCSS/index.js";

export const mapFilterTheme = {};

export const zIndex = (() => {
  const mouseFxBackall = "-1";
  const mouseFxOverall = "10";
  const MinOverMouseFx = (mouseFxOverall + 1).toString();
  const notifier = (mouseFxOverall + 2).toString();
  return {
    mouseFxBackall, //Efectos que estan por debajo
    mouseFxOverall, //Efectos que estan por encima
    MinOverMouseFx, //Elementos que no se afectan por efectos
    notifier,
  };
})();

export function init() {
  Object.assign(mapFilterTheme, {
    ...getAllThemesRegistered().reduce((acc, themeRegister) => {
      acc[themeRegister.name[0]] = (rotation) => {
        const name_color = window.themeColors[themeRegister.name_color];
        return rotation(name_color, Color("red"));
      };
      return acc;
    }, {}),
    blackNwhite: () => "grayscale(1)",
  });

  JS2CSS.insertStyle({
    id: "theme-constants",
    ":root": {
      "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
      "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
      "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
      "--z-index-minover-scroll": zIndex.MinOverscroll,
    },
    ".z-ontopfx": {
      "z-index": zIndex.mouseFxOverall,
    },
    ".z-notifier": {
      "z-index": zIndex.notifier,
    },
  });
}
