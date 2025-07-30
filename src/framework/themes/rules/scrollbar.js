import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";
import { isMobile } from "../../tools/tools.js";
import { getPrimaryColors } from "./colors.js";

/**
 * Configura los colores de la barra de desplazamiento.
 * @param {object} options - Opciones para configurar la barra de desplazamiento.
 */
export function scrollbarColors({ customizeScrollbar, MUIDefaultValues }) {
  const primaries = getPrimaryColors();
  Object.assign(
    MUIDefaultValues.loadScrollsbar,
    (() => {
      const s = {};
      Object.entries(primaries).forEach(([key, value]) => {
        s[key] = function (darkmode) {
          monochrome({ color: value, darkmode });
        };
      });
      return s;
    })()
  );

  /**
   * Configura los colores de la barra de desplazamiento en modo monocromo.
   * @param {object} options - Opciones para configurar la barra de desplazamiento.
   */
  function monochrome({ color, darkmode }) {
    if (darkmode) {
      customizeScrollbar({
        main: color.hex(),
        maindark: color.darken(0.2).hex(),
        maindarker: color.darken(0.4).hex(),
        back: color.toBlack(0.5).hex(),
      });
    } else {
      customizeScrollbar({
        main: color.hex(),
        maindark: color.darken(0.2).hex(),
        maindarker: color.darken(0.4).hex(),
        back: color.toWhite(0.9).hex(),
      });
    }
  }
}

export function customizeScrollbar({ main, maindark, maindarker, back } = {}) {
  JS2CSS.insertStyle({
    id: "scrollbar",
    "*": {
      scrollbarWidth: isMobile ? "thin" : "auto",
      scrollbarColor: `${main} ${back}`,
    },

    "::-webkit-scrollbar": {
      width: "15px",
      height: "15px",
    },

    "::-webkit-scrollbar-track": {
      background: back,
      borderRadius: "10px",
    },

    "::-webkit-scrollbar-thumb": {
      background: `linear-gradient(
          180deg,
          ${main},
          ${maindark}
        )`,
      borderRadius: "10px",
      border: `2px solid ${back}`,
    },

    "::-webkit-scrollbar-thumb:hover": {
      background: `linear-gradient(
          180deg,
          ${maindark},
          ${maindarker}
        )`,
    },

    "textarea, pre, code, div, .scrollbar-theme": {
      scrollbarWidth: "thin",
      scrollbarColor: `${main} ${back}`,
    },
  });
}
