import { getPaletteConfig, getThemeName, isDark } from "./manager.vars.js";
import { responsiveFontSizes } from "@mui/material";
import { triggerThemeChange, isReadyThemeChange } from "./manager.listener.js";
import {
  hrefManagement,
  _setURLParams,
  driverParams,
} from "../../router/index.js";
import { useNavigate } from "react-router-dom";

export function getAdjacentPrimaryColor(props) {
  return getPaletteConfig().getAdjacentPrimaryColor(props);
}

export function getColorBackground(theme) {
  if (!theme) {
    theme = getSelectedPalette();
  }
  const { palette } = theme;
  if (palette) {
    if (palette.background) {
      let { background } = palette;
      if (background.default) {
        return background.default;
      }
    }
  }
}

export function getSecondaryColor() {
  return getPaletteConfig().getSecondaryColor();
}

export function getPrimaryColor() {
  return getPaletteConfig().getPrimaryColor();
}

export function getTriadeColors() {
  return getPaletteConfig().getTriadeColors();
}

export function getContrastPaperBow() {
  return getPaletteConfig().getContrastPaperBow();
}

export function getContrastBow() {
  return getPaletteConfig().getContrastBow();
}

export function getContrastPaper() {
  return getPaletteConfig().getContrastPaper();
}

export function getContrast() {
  return getPaletteConfig().getContrast();
}

export function getComplement() {
  return getPaletteConfig().getComplement();
}

export function isPanda() {
  return !!getPaletteConfig().panda;
}

export function getSelectedPalette({
  name = getThemeName(),
  darkmode = isDark(),
} = {}) {
  return getPaletteConfig(name)[["light", "dark"][+darkmode]];
}

export function getTheme(props) {
  return responsiveFontSizes(getSelectedPalette(props));
}

export function typographyTheme() {
  const typo = getSelectedPalette().typography;
  return {
    ...typo,
    widthAproxString,
  };

  function widthAproxString(string, { fontSize } = {}) {
    return string.length * (global.nullish(fontSize, typo.fontSize) * 0.55);
  }
}

/**
 * Indica si los componentes están tematizados.
 * @returns {boolean}
 */
export function isThemed() {
  return controlComponents().themized;
}

export function controlComponents() {
  const retorno = getPaletteConfig().control_components(isDark());
  return retorno;
}

export function href(href) {
  const control = controlComponents();
  if (control.href) {
    return control.href(hrefManagement(href));
  }
  return href;
}
