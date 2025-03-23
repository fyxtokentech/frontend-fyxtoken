import Color from "color";
import JS2CSS from "@jeff-aporta/js2css";

import { register_colors } from "@jeff-aporta/theme-manager";

Color.prototype.toWhite = function (t = 0) {
  return this.mix(Color("white"), t);
};

Color.prototype.toBlack = function (t = 0) {
  return this.mix(Color("black"), t);
};

Color.prototype.toGray = function (t = 0) {
  return this.mix(Color("gray"), t);
};

global.identity ??= { colors: {} };

const identity = (() => {
  const primaries = {
    verde_cielo: Color("#1e9cde"),
    verde_lima: Color("#c6e50e"),
    azul_agua: Color("#21ebef"),
    morado: Color("#1b053d"),
    blanco: Color("white"),
    negro: Color("black"),
  };

  const secundaries = {
    morado_enfasis: Color(`hsl(${primaries.morado.hue()}, 45%, 53%)`),
    morado_brillante: Color(`hsl(${primaries.morado.hue()}, 100%, 80%)`),
  };

  const all = {
    ...primaries,
    ...secundaries,
  };

  Object.assign(global.identity.colors, all);
  register_colors(all);

  return {
    primaries,
    secundaries,
  };
})();

const {
  verde_cielo,
  verde_lima,
  azul_agua,

  morado_brillante,
  morado_enfasis,
  morado,

  blanco,
  negro,
} = global.identity.colors;

function genHSL(name, color){
  return {
    [`--${name}`]: color.hex(),
    [`--${name}-h`]: color.hsl().object()["h"].toString()+"deg",
    [`--${name}-s`]: color.hsl().object()["s"].toString()+"%",
    [`--${name}-l`]: color.hsl().object()["l"].toString()+"%",
  }
}

JS2CSS.insertStyle({
  id: "palette-theme-colors",
  objJs: {
    ":root": {
      ...genHSL("verde-cielo", verde_cielo),
      ...genHSL("verde-lima", verde_lima),
      ...genHSL("azul-agua", azul_agua),
      ...genHSL("morado", morado),
      ...genHSL("morado-enfasis", morado_enfasis),
      ...genHSL("morado-brillante", morado_brillante),

      "--bg-table-dark": "rgba(0, 0, 0, 0.2)",
    },
  },
});

export default { status: "runned" };
