import { fluidCSS } from "../../../fluidCSS/index.js";
import { JS2CSS } from "../../../fluidCSS/JS2CSS/index.js";

import { Color } from "../colors.js";
import { firstUppercase } from "../../../tools/tools.js";

import { createTheme, responsiveFontSizes } from "@mui/material";

import { customizeScrollbar } from "../scrollbar.js";
import { getSelectedPalette, isPanda } from "./manager.selected.js";
import { triggerThemeChange } from "./manager.listener.js";
import {
  getPaletteConfig,
  getMUIDefaultValues,
  getAllThemesRegistered,
  getThemeName,
  isDark,
  getThemeLuminance,
  setThemeLuminance,
} from "./manager.vars.js";
import { millis } from "../../../tools/time.js";

const paletteLoader = {
  MUIDefaultValues: getMUIDefaultValues(),
  customizeScrollbar,
  getThemeLuminance,
  getThemeName,
  isDark,
  childs,
  createThemePalette: ({ palette, background, darkmode }) => {
    const customize_components = customizeComponents({
      palette,
      components: palette.componentsMUI({ darkmode }),
      darkmode,
    });
    const colors = muiColors(palette, darkmode);
    return createTheme({
      ...customize_components,
      palette: {
        mode: ["light", "dark"][+darkmode],
        background,
        ...colors,
      },
    });
  },
};

export function getPaletteLoader() {
  return paletteLoader;
}

export function muiColors(palette, darkMode) {
  const colors = palette.colors(darkMode);
  const retorno = Object.entries(colors).reduce((acc, [key, value]) => {
    const bg = value.color;
    let color = value.text;
    if(!value.inmutable){
      if (bg.isLight() && color.isLight()) {
        color = color.invertnohue();
      }
      if (bg.isDark() && color.isDark()) {
        color = color.invertnohue();
      }
    }
    acc[key] = {
      main: bg.hex(),
      contrastText: color.hex(),
    };
    return acc;
  }, {});
  return retorno;
}

export function getColorPaperTheme() {
  const color = Color(getSelectedPalette().palette.background.paper);
  return color;
}

export function getColorBGTheme() {
  const color = Color(getSelectedPalette().palette.background.default);
  return color;
}

export function isBGDark() {
  const color = getColorBGTheme();
  return color.luminosity() < 0.5;
}

export function applyTheme() {
  const themeSelected = getPaletteConfig();
  const colorFont = ["#ffffff", "#000000"];
  themeSelected.willLoad(isDark());
  JS2CSS.insertStyle({
    id: "theme-manager-settings",
    clasesKebab: false,
    infer: false,
    ":root": {
      "--font-color-bg-opposite": colorFont[isBGDark() ? 0 : 1],
      "--font-color-bg-default": colorFont[isBGDark() ? 1 : 0],
      "--is-panda": +isPanda(),
      "--is-dark": +isDark(),
      "--bg-filter": (() => {
        const F = "invert() hue-rotate(180deg)";
        if (isPanda()) {
          if (isDark()) {
            return F;
          }
        } else {
          if (!isDark()) {
            return F;
          }
        }
        return "";
      })(),
      ".bg-filter": {
        filter: "var(--bg-filter)",
      },
      ".color-bg-opposite": {
        color: "var(--font-color-bg-opposite) !important",
      },
      ".color-bg-default": {
        color: "var(--font-color-bg-default) !important",
      },
    },
  });
  triggerThemeChange();
}

export function isRegistered(name) {
  return getAllThemesRegistered().some((x) => {
    return x.name.includes(name);
  })
    ? name
    : undefined;
}

export function customizeComponents({ palette, darkmode }) {
  return {
    typography: global.nullish(palette.typography(), {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    }),
    components: mapMui(palette),
  };

  function mapMui(palette) {
    const componentes = palette.componentsMUI({ darkmode });
    const retorno = Object.entries(componentes).reduce(
      (retorno, [component, contexts]) => {
        retorno[`Mui${component}`] = {
          styleOverrides:
            typeof contexts === "string"
              ? contexts
              : Object.entries(contexts).reduce((curr, [context, css]) => {
                  const s = Object.keys(palette.colors(isDark()))
                    .concat([
                      "primary",
                      "secondary",
                      "error",
                      "warning",
                      "info",
                      "success",
                    ])
                    .includes(context);
                  if (s) {
                    curr[`contained${firstUppercase(context)}`] = css;
                  } else {
                    curr[context] = css;
                  }
                  return curr;
                }, {}),
        };
        return retorno;
      },
      {}
    );
    return retorno;
  }
}

export function childs(component, css) {
  return Object.entries(css).reduce((acc, [context, value]) => {
    acc[`&.Mui${component}-${context}`] = value;
    return acc;
  }, {});
}

export function readyThemeManager() {
  applyTheme();
}
