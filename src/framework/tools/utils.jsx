import React from "react";

import { getThemeName, Color, isDark, getPaletteConfig } from "../index.js";
import { mapFilterTheme as _mapFilterTheme } from "../themes/ui/constants.js";

export function getLightFilter() {
  const rl = {
    "*": "invert() hue-rotate(180deg)",
  };
  const rb = {};
  const { panda } = getPaletteConfig();
  const a = [rb, rl];
  let retorno;
  if (isDark()) {
    retorno = a[+panda];
  } else {
    retorno = a[1 - +panda];
  }
  return retorno;
}

export function colorFilterDiscriminator(
  extraRules = {},
  mapFilterTheme = global.nullish(window.mapFilterTheme, {})
) {
  const themeName = getThemeName();
  const p = mapFilterTheme[themeName];
  return {
    filter: (() => {
      const rotationFilter = (() => {
        if (p) {
          if (typeof p == "function") {
            return p(fdhue);
          }
          return p;
        }
        return "";
      })();
      const extras = [];
      Object.entries(extraRules).forEach(([key, value]) => {
        if (key == "*") {
          return extras.push(value);
        }
        const queries = key.split(",").map((k) => k.trim());
        if (queries.includes(themeName)) {
          extras.push(value);
        }
      });
      return [rotationFilter, ...extras].filter(Boolean).join(" ");
    })(),
  };
}

export function fdhue(color, baseColor) {
  if (typeof color == "string") {
    color = Color(color);
  }
  const diff = color.hue() - baseColor.hue();
  return `hue-rotate(${parseInt(diff)}deg)`;
}
