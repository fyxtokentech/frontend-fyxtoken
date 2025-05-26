import { getThemeName } from "@jeff-aporta/theme-manager";

const {
  verde_cielo,
  verde_lima,
  azul_agua,
  blanco,
  negro,
  morado,
  morado_enfasis,
  morado_brillante,
  verde_cielo_brillante,
  springgreen,
} = global.identity.colors;


function discriminadorColor(
  extra = {},
  mapFilterTheme = window["mapFilterTheme"] ?? {},
  colorBase = morado_brillante
) {
  const themeName = getThemeName() ?? "main";
  return {
    filter: (() => {
      let r = mapFilterTheme[themeName] || "";
      if (typeof r == "function") {
        r = r(rotation);
      }
      const extras = [];
      Object.entries(extra).forEach(([key, value]) => {
        if (key == "*") {
          return extras.push(value);
        }
        const queries = key.split(",").map((k) => k.trim());
        if (queries.includes(themeName)) {
          extras.push(value);
        }
      });
      return [r, ...extras].filter(Boolean).join(" ");
    })(),
  };

  function rotation(color) {
    return `hue-rotate(${parseInt(
      -colorBase.hue() + color.hue()
    )}deg) grayscale(0.5)`;
  }
}

export { discriminadorColor };
