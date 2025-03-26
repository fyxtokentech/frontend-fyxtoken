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
    springgreen: Color("rgb(0, 255, 127)"),
    blanco: Color("white"),
    negro: Color("black"),
  };

  const secundaries = {
    morado_enfasis: Color(`hsl(${primaries.morado.hue()}, 45%, 53%)`),
    morado_brillante: Color(`hsl(${primaries.morado.hue()}, 100%, 80%)`),
    verde_cielo_brillante: Color(`hsl(${primaries.verde_cielo.hue()}, 100%, 80%)`),
    verde_lima_brillante: Color(`hsl(${primaries.verde_lima.hue()}, 100%, 80%)`),
    lemongreen: primaries.verde_lima,
    skygreen: primaries.verde_cielo,
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
  verde_cielo_brillante,
  verde_lima_brillante,
  lemongreen,
  skygreen,
  springgreen,
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
      ...genHSL("skygreen", verde_cielo),
      ...genHSL("verde-lima", verde_lima),
      ...genHSL("lemongreen", verde_lima),
      ...genHSL("azul-agua", azul_agua),
      ...genHSL("morado", morado),
      ...genHSL("morado-enfasis", morado_enfasis),
      ...genHSL("morado-brillante", morado_brillante),
      ...genHSL("verde-cielo-brillante", verde_cielo_brillante),
      ...genHSL("verde-lima-brillante", verde_lima_brillante),
      ...genHSL("springgreen", springgreen),

      "--bg-table-dark": "rgba(0, 0, 0, 0.2)",
    },
  },
});

export default { status: "runned" };
