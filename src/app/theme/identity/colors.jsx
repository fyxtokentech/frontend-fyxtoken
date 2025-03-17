import Color from "color";
import JS2CSS from "@jeff-aporta/js2css";

import { register_colors } from "@jeff-aporta/theme-manager";

Color.prototype.toWhite = function(t = 0) {
 return this.mix(Color('white'), t);
};

Color.prototype.toBlack = function(t = 0) {
 return this.mix(Color('black'), t);
};

Color.prototype.toGray = function(t = 0) {
 return this.mix(Color('gray'), t);
};

// primarios
Object.assign(global, {
 verde_cielo: Color("#1e9cde"),
 verde_lima: Color("#c6e50e"),
 azul_agua: Color("#21ebef"),
 morado: Color("#1b053d"),
 blanco: Color("white"),
 negro: Color("black"),
});

const { morado } = global;

// secundarios
Object.assign(global, {
 morado_enfasis: Color(`hsl(${morado.hue()}, 45%, 53%)`),
 morado_brillante: Color(`hsl(${morado.hue()}, 100%, 80%)`),
});

const {
 verde_cielo,
 verde_lima,
 azul_agua,
 blanco,
 negro,
 morado_enfasis,
 morado_brillante,
} = global;

register_colors({
  verde_cielo,
  verde_lima,
  azul_agua,
  blanco,
  negro,
  morado_enfasis,
  morado_brillante,
});

JS2CSS.insertStyle({
 id: "palette-theme-colors",
 objJs: {
   ":root": {
     "--verde-cielo": verde_cielo.hex(),
     "--verde-cielo-h": verde_cielo.hsl().object()["h"],
     "--verde-cielo-s": verde_cielo.hsl().object()["s"],
     "--verde-cielo-l": verde_cielo.hsl().object()["l"],

     "--verde-lima": verde_lima.hex(),
     "--verde-lima-h": verde_lima.hsl().object()["h"],
     "--verde-lima-s": verde_lima.hsl().object()["s"],
     "--verde-lima-l": verde_lima.hsl().object()["l"],

     "--azul-agua": azul_agua.hex(),
     "--azul-agua-h": azul_agua.hsl().object()["h"],
     "--azul-agua-s": azul_agua.hsl().object()["s"],
     "--azul-agua-l": azul_agua.hsl().object()["l"],

     "--morado": morado.hex(),
     "--morado-h": morado.hsl().object()["h"],
     "--morado-s": morado.hsl().object()["s"],
     "--morado-l": morado.hsl().object()["l"],
     "--morado-enfasis": morado_enfasis.hex(),
     "--morado-enfasis-brillante": morado_brillante.hex(),

     "--bg-table-dark": "rgba(0, 0, 0, 0.2)",
   },
 },
});

export default {status:"runned"};