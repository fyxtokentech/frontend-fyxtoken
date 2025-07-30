import React from "react";

import { portal, bgdefault, zigZag1 } from "./bg.js";

import {
  getPaletteConfig,
  getThemeName,
  isDark,
} from "../../rules/manager/index.js";

import { colorFilterDiscriminator } from "../../../tools/utils.jsx";

import { fluidCSS, JS2CSS } from "../../../fluidCSS/index.js";

export function burnBGFluid({ bgtype = "1", theme_name, theme_luminance }) {
  const fluid = fluidCSS();
  switch (bgtype) {
    default:
    case "1":
    case "default":
      fluid.ltX("small", {
        opacity: ["0.75", "1"],
      });
      bgdefault();
      break;
    case "2":
    case "portal":
      genealFluid();
      portal();
      break;
    case "zigzag":
      genealFluid();
      zigZag1();
      break;
  }
  return fluid;

  function genealFluid() {
    fluid.btwX("responsive", {
      opacity: ["0.7", "0.85", "1"],
    });
  }
}
