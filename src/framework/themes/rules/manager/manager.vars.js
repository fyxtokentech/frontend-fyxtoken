import { isReadyThemeChange } from "./manager.listener.js";
import { applyTheme } from "./manager.js";

import { getFadeInfo } from "../../router/router.jsx";

let _name_;
let _luminance_;
let _name_force_;
let _luminance_force_;
let _main_title_;
let _main_subtitle_;
const _createThemeName_ = []; // Filtro de nombre para creación
const _excludeThemeName_ = []; // Filtro de nombre para excluir creación

const MUIDefaultValues = {
  loadScrollsbar: {},
};

export function setMainTitle(title, subtitle) {
  _main_title_ = title;
  _main_subtitle_ = subtitle;
}

export function getCreateThemeName() {
  return _createThemeName_;
}

export function addCreateThemeName(...names) {
  _createThemeName_.push(...names);
}

export function getExcludeThemeName() {
  return _excludeThemeName_;
}

export function addExcludeThemeName(...names) {
  _excludeThemeName_.push(...names);
}

export function getMUIDefaultValues() {
  return MUIDefaultValues;
}

export function setSettingsView(settingsView) {
  setTimeout(() => {
    const {
      title = _main_title_,
      subtitle = _main_subtitle_,
      theme = {},
    } = settingsView;
    const { luminance, name } = theme;
    _luminance_force_ = luminance;
    _name_force_ = name;
    const new_title = [title, subtitle]
    .filter((x) => typeof x == "string")
    .join(" | ");
    if (new_title) {
      document.title = new_title;
    }
    applyTheme();
  }, 1.5 * getFadeInfo().time);
}

export function isDark() {
  return getThemeLuminance() === "dark";
}

export function getPaletteConfig(name = getThemeName()) {
  let retorno = MUIDefaultValues[name];
  if (!retorno) {
    retorno = MUIDefaultValues["cyan"];
  }
  if(retorno.fn){
    retorno = retorno.fn();
    MUIDefaultValues[name] = retorno;
  }
  return retorno;
}

export function getAllThemesRegistered() {
  const k = Object.keys(MUIDefaultValues).filter(
    (k) => !["loadScrollsbar"].includes(k)
  );
  return k.map((k) => MUIDefaultValues[k]);
}

export function defaultThemeName(name) {
  if (localStorage.getItem("theme-name")) {
    return;
  }
  localStorage.setItem("theme-name", name);
}

export function initThemeName(name) {
  if (_name_) {
    return;
  }
  _name_ = (() => {
    if (name) {
      return name;
    }
    if (!localStorage) {
      return "cyan";
    }
    const tema_almacenado = localStorage.getItem("theme-name");
    return global.nullish(tema_almacenado, "cyan");
  })();
}

function initLuminance(luminance) {
  if (_luminance_) {
    return;
  }
  _luminance_ = (() => {
    if (luminance) {
      return luminance;
    }
    const systemLuminance = ["light", "dark"][
      +!!window.matchMedia("(prefers-color-scheme: dark)").matches
    ];
    const stored = localStorage.getItem("theme-luminance");
    return global.nullish(stored, systemLuminance);
  })();
}

export function getThemeName() {
  initThemeName();
  return _name_force_ || _name_;
}

export function getThemeLuminance() {
  initLuminance();
  return _luminance_force_ || _luminance_;
}

export function setThemeName(name) {
  if (!isReadyThemeChange()) {
    return;
  }
  _name_ = name;
  if (localStorage) {
    localStorage.setItem("theme-name", name);
  }
  applyTheme();
}

export function setThemeLuminance(luminance) {
  if (!isReadyThemeChange()) {
    return;
  }
  _luminance_ = luminance;
  if (localStorage) {
    localStorage.setItem("theme-luminance", luminance);
  }
  applyTheme();
}
