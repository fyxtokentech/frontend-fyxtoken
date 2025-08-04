import {
  PaletteBaseMonochrome,
  registerThemes_PaletteGeneral,
} from "./palettes.js";
import { themeColors, registerColors } from "../colors.js";

import { Checkbox, Input } from "@mui/material";
import { getAllColors } from "../colors.js";
import { getPaletteLoader } from "./manager.js";
import {
  getCreateThemeName,
  getExcludeThemeName,
  getThemeName,
} from "./manager.vars.js";
import { scrollbarColors } from "../scrollbar.js";

export class Polychroma extends PaletteBaseMonochrome {
  constructor(props) {
    super(props);
  }

  control_components(darkmode) {
    const enfasis_input = [this.name_color, this.name_contrast][+darkmode];
    const themeComponents = super.control_components(darkmode);
    const themeHref = themeComponents.href;
    return {
      ...themeComponents,
      href: (props) => {
        return themeHref(props);
      },
      enfasis_input,
      themized: {
        Checkbox(props) {
          return <Checkbox color={enfasis_input} {...props} />;
        },
        Input(props) {
          return <Input color={enfasis_input} {...props} />;
        },
      },
    };
  }
}

export class Pandachrome extends Polychroma {
  constructor(props) {
    super(props);
  }
}

function inferPropsThemePolychroma({
  name,
  label,
  panda,
  whiten,
  blacken,
  color = {},
  contrast = {},
  scroll,
  bright_color = {},
}) {
  const keyColor = Object.keys(color)[0];
  const keyContrast = global.nullish(
    Object.keys(contrast)[0],
    keyColor + "Accent"
  );
  const keyScroll = Object.keys(scroll || color)[0];
  const keyBrightColor = global.nullish(
    Object.keys(bright_color)[0],
    keyColor + "Light"
  );
  return {
    name,
    label,
    panda,
    scrollname: global.nullish(keyScroll, keyColor),
    main_color: themeColors()[keyColor],
    name_color: keyColor,
    constrast_color: themeColors()[keyContrast],
    name_contrast: keyContrast,
    main_bright_color: themeColors()[keyBrightColor],
    name_bright_color: keyBrightColor,
    whiten,
    blacken,
    ...getPaletteLoader(),
  };
}

async function createPolychroma({ color, label, name, whiten, blacken }) {
  const createThemeInclude = getCreateThemeName();
  const excludeThemeInclude = getExcludeThemeName();

  const keyColor = Object.keys(color)[0];
  normalchrome();
  pandachrome();

  function propsConstructor({ panda = false } = {}) {
    return {
      ...inferPropsThemePolychroma({
        color,
        panda,
        label,
        name,
        whiten,
        blacken,
      }),
    };
  }

  function include() {
    const retorno = (() => {
      const checkInclude = createThemeInclude && createThemeInclude.length > 0;
      const checkExclude =
        excludeThemeInclude && excludeThemeInclude.length > 0;
      if (checkInclude) {
        return createThemeInclude.some((x) => name == x);
      }
      if (checkExclude) {
        const R = excludeThemeInclude.some((x) => name == x);
        if (R) {
          return false;
        }
      }
      return true;
    })();
    return retorno;
  }

  function pandachrome() {
    name = name + "Panda";
    label = label + " (Panda)";
    if (include()) {
      registerThemes_PaletteGeneral[name] = {
        fn: () =>
          new (class extends Pandachrome {
            constructor() {
              super(propsConstructor({ panda: true }));
            }
          })(),
        label,
        name,
        color,
      };
    }
  }

  function normalchrome() {
    name = keyColor;
    if (include()) {
      const c = propsConstructor();
      registerThemes_PaletteGeneral[name] = {
        fn: () =>
          new (class extends Polychroma {
            constructor() {
              super(c);
            }
          })(),
        name,
        label,
        color,
      };
    }
  }
}

export function initializeThemesPolychroma() {
  console.log({ registerThemes_PaletteGeneral, themeColors: themeColors() });
  const especial = {
    black: {
      label: "Carbon",
    },
    blackTheme: {
      label: "Blanco&Negro",
    },
    white: {
      label: "Pureza",
    },
    tomato: {
      label: "Tomate",
      whiten: {
        default: () => 0.85,
        paper: () => 0.93,
      },
      blacken: {
        default: () => 0.8,
        paper: () => 0.6,
      },
    },
    crimson: {
      label: "Carmín",
    },
    purple: {
      label: "Purpura",
    },
    springGreen: {
      label: "Primavera",
    },
    skyGreen: {
      label: "Cielo",
    },
    lemonGreen: {
      label: "Limón",
    },
    pink: {
      label: "Rosa",
      whiten: {
        default: () => 0.5,
        paper: () => 0.93,
      },
      blacken: {
        default: () => 0.3,
        paper: () => 0.7,
      },
    },
    navy: {
      label: "Marino",
    },
    magenta: {
      label: "Magenta",
    },
    cyan: {
      label: "Cian",
    },
    brown: {
      label: "Marrón",
    },
    violet: {
      label: "Violeta",
    },
    olive: {
      label: "Oliva",
    },
    amber: {
      label: "Ámbar",
    },
    green: {
      label: "Verde",
    },
    blue: {
      label: "Azul",
    },
    militaryGreen: {
      label: "Militar",
    },
    aquaBlue: {
      label: "Agua",
    },
    red: {
      label: "Rojo",
    },
    darkred: {
      label: "Rojo oscuro",
    },
    yellow: {
      label: "Amarillo",
      whiten: {
        default: () => 0.85,
        paper: () => 0.93,
      },
      blacken: {
        default: () => 0.9,
        paper: () => 0.85,
      },
    },
    gray: {
      label: "Gris",
    },
    orange: {
      label: "Naranja",
    },
    darkblue: {
      label: "Azul oscuro",
    },
    darkcyan: {
      label: "Cian oscuro",
    },
    darkmagenta: {
      label: "Magenta oscuro",
    },
    darkviolet: {
      label: "Violeta oscuro",
    },
    darkgray: {
      label: "Gris oscuro",
    },
  };
  Object.entries(themeColors())
    .filter(([key]) => {
      if (["Light", "Accent"].some((x) => key.endsWith(x))) {
        // No se deben fabricar temas de colores secundarios
        return;
      }
      /* if (["black", "white"].some((x) => key.startsWith(x))) {
        return;
      } */
      return true;
    })
    .filter(([key]) => {
      return !Object.values(registerThemes_PaletteGeneral).some(
        (x) => x.color[key]
      );
    })
    .forEach(([key, value]) => {
      console.log({ key, value });

      let E = especial[key];
      let Nombre;
      let whiten;
      let blacken;

      if (E) {
        Nombre = E.label;
        whiten = E.whiten;
        blacken = E.blacken;
      } else {
        Nombre = key;
      }

      createPolychroma({
        color: { [key]: themeColors()[key] },
        label: Nombre,
        whiten,
        blacken,
      });
    });
}

export function initializeThemeColors(otherColors = {}) {
  registerColors({ ...getAllColors(), ...otherColors });
  initializeThemesPolychroma();
  Object.entries(registerThemes_PaletteGeneral).forEach(([key, value]) => {
    getPaletteLoader().MUIDefaultValues[key] = value;
  });
  scrollbarColors(getPaletteLoader());
}
