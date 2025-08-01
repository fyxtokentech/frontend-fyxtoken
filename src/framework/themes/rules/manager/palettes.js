import { isDark } from "./manager.vars.js";
import { Color } from "../colors.js";
import { firstUppercase, map } from "../../../tools/index.js";
import { buildHref } from "../../router/index.js";
import { themeColors } from "../colors.js";

export const registerThemes_PaletteGeneral = {};

export class PaletteGeneral {
  constructor(packLoadPalette) {
    Object.assign(this, packLoadPalette);
    if (!this.name) {
      this.name = Math.random().toString(36).slice(2);
    }
  }

  getbgstate(darkmode, state) {
    try {
      return this[["light", "dark"][+darkmode]]["palette"][state]["color"];
    } catch (e) {
      try {
        return this.colors(darkmode)[state].color;
      } catch (e) {}
    }
  }

  getbg(darkmode) {
    if (global.nullish(darkmode, isDark())) {
      return global.nullish(this.bg_dark, "black");
    }
    return global.nullish(this.bg_light, "white");
  }

  typography() {
    return {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    };
  }

  control_components(darkmode) {
    return {
      href: function (props, prepareProps) {
        if (prepareProps) {
          props = prepareProps(props);
        }
        return buildHref(props);
      },
    };
  }

  components({ darkmode, colors }) {
    let bgtooltip = Color([["white", "black"][+darkmode]]);
    return {
      AccordionDetails: {
        root: {
          padding: 0,
        },
      },
      Paper: {
        root: {
          ...this.childs("AccordionDetails", {
            root: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }),
        },
      },
      Tooltip: {
        tooltip: {
          backgroundColor: bgtooltip.hex(),
          color: (() => {
            if (bgtooltip.isLight()) {
              return "#000000";
            } else {
              return "#FFFFFF";
            }
          })(),
        },
      },
    };
  }

  colors(darkmode) {
    const blanco = Color("white");
    const negro = Color("black");
    const color_contrast = [negro, blanco][+darkmode];
    return {
      cancel: {
        color: Color(["tomato", "crimson"][+darkmode]),
        text: blanco,
      },
      warning: {
        color: Color(["darkorange", "orange"][+darkmode]),
        text: color_contrast,
      },
      success: {
        color: Color(["lightgreen", "limegreen"][+darkmode]),
        text: color_contrast,
        inmutable: true,
      },
      ok: {
        color: Color("#29A529"),
        text: blanco,
        inmutable: true,
      },
      ...Object.entries(themeColors()).reduce((acc, [key, value]) => {
        acc[key] = {
          color: value,
          text: color_contrast,
        };
        return acc;
      }, {}),
    };
  }
}

export class PaletteMonochrome extends PaletteGeneral {
  constructor({
    whiten = {
      default: () => 0.85,
      paper: () => 0.95,
    },
    blacken = {
      default: () => 0.8,
      paper: () => 0.7,
    },
    ...rest
  } = {}) {
    super(rest);
    if (!this.panda) {
      this.panda = false;
    }
    if (!this.bg_light) {
      if (whiten.default) {
        this.bg_light = this.main_color.toWhite(whiten.default());
      } else {
        this.bg_light = this.main_color;
      }
    }
    if (!this.bg_dark) {
      if (blacken.default) {
        this.bg_dark = this.main_color.toBlack(blacken.default());
      } else {
        this.bg_dark = this.main_color;
      }
    }

    this.paper_light = this.main_bright_color.toWhite(whiten.paper()).hex();
    this.paper_dark = this.main_color.toBlack(blacken.paper()).hex();

    this.light = this.createThemePalette({
      darkmode: false,
      palette: this,
      background: {
        default: this.getbg(false),
        paper: this.paper_light,
      },
    });

    this.dark = this.createThemePalette({
      darkmode: true,
      palette: this,
      background: {
        default: this.getbg(true),
        paper: this.paper_dark,
      },
    });
  }

  getbg_pair() {
    if (this.panda) {
      return { bg_light: this.bg_dark, bg_dark: this.bg_light };
    }
    return { bg_light: this.bg_light, bg_dark: this.bg_dark };
  }

  getbgPaper(darkmode, hex = true) {
    const RETURN = [this.paper_light, this.paper_dark][+darkmode];
    if (hex) {
      return RETURN;
    }
    return Color(RETURN);
  }

  getbg(darkmode, hex = true) {
    const { bg_light, bg_dark } = this.getbg_pair();
    const bgs = [bg_light || Color("#FFFFFF"), bg_dark || Color("#000000")];
    let state = global.nullish(darkmode, isDark());
    const bg = bgs[+state];
    if (hex) {
      return bg.hex();
    }
    return bg;
  }

  getbg_complement(darkmode) {
    darkmode = global.nullish(darkmode, isDark());
    return this.getbg(!darkmode);
  }

  componentsMUI({ constants_color, darkmode }) {
    const colors = {
      ...constants_color,
      ...this.colors(darkmode),
    };
    return {
      ...this.components({ colors, darkmode }),
      primary: {
        color: Color("white").hex(),
        "&:hover": {
          backgroundColor: colors.primary.color.hex(),
        },
      },
      root: {
        margin: "0",
      },
    };
  }
}

function getDirectionAdjacentDark(hue) {
  return -getDirectionAdjacentLight(hue);
}

function getDirectionAdjacentLight(hue) {
  if (hue > 120 && hue < 240) {
    return -1;
  }
  return 1;
}

export class PaletteBaseMonochrome extends PaletteMonochrome {
  constructor(props) {
    super(props);
  }
  componentsMUI({ constants_color, darkmode }) {
    const colors = {
      ...constants_color,
      ...this.colors(darkmode),
      ...themeColors(),
    };

    function colorized(c) {
      const { color, text } = c;
      if (!color || !text) {
        return;
      }
      return {
        backgroundColor: [color.hex(), color.darken(0.2).hex()][+darkmode],
        color: text.hex(),
        "&:hover": {
          backgroundColor: color[["darken", "lighten"][+darkmode]](0.2).hex(),
        },
      };
    }

    return {
      ...super.componentsMUI({ colors, darkmode }),
      Button: {
        ...Object.entries(colors)
          .map(([k, v]) => {
            return {
              [k]: colorized(v),
            };
          })
          .filter(Boolean)
          .reduce((a, b) => ({ ...a, ...b }), {}),
      },
    };
  }

  adjacentFactor() {
    let hue = this.main_color.hue();
    let factor = getDirectionAdjacentLight(hue);
    const colorsConflictiveContrast = {
      red: {
        hue: 0,
        fi: 0.05,
        ff: 1,
      },
      green: {
        hue: 120,
        fi: 0.05,
        ff: 1,
      },
      orange: {
        hue: 30,
      },
      yellow: {
        hue: 60,
      },
      cyan: {
        hue: 180,
      },
      magenta: {
        hue: 300,
        fi: 0.3,
        ff: 1,
      },
    };
    const f = Object.values(colorsConflictiveContrast)
      .map((c) => ({ ...c, diff: Math.abs(c.hue - hue) }))
      .sort((a, b) => a.diff - b.diff);

    const minDiff = f[0].diff;
    const tolerance = 29;
    if (minDiff <= tolerance) {
      const { fi, ff } = f[0];
      if (fi && ff) {
        factor *= map(minDiff / tolerance, 0, 1, fi, ff);
      } else {
        factor *= minDiff / tolerance;
      }
    }
    return factor;
  }

  getAdjacentPrimaryColor({ a = 15, n = 1, light = true } = {}) {
    const factor = this.adjacentFactor() * (light ? 1 : -1);
    const colorPrimary = this.getPrimaryColor();
    return Array.from({ length: n }, (_, n) => {
      const colorRotate = colorPrimary.rotate((n + 1) * a * factor); // adjacent
      return colorRotate;
    });
  }

  getPrimaryColor() {
    return this.primary || this.main_color;
  }

  getSecondaryColor(darkmode) {
    return this.primary
      .toLerp(Color("slategray"), 0.5)
      .toLerp(Color(["black", "white"][+darkmode]), 0.4);
  }

  getTriadeColors() {
    const primary = this.getPrimaryColor();
    const triade2 = primary.rotate(120); // right triade
    const triade3 = primary.rotate(240); // left triade
    return [primary, triade2, triade3];
  }

  getContrastPaper() {
    return this.contrastPaper;
  }

  getConstrast() {
    return this.contrast;
  }

  getContrastPaperBow() {
    return this.contrastPaperBOW;
  }

  getContrastBow() {
    return this.contrastBOW;
  }

  getComplement() {
    return this.complement;
  }

  colors(darkmode) {
    const [blanco, negro] = [Color("white"), Color("black")];
    const colors_contrast = [blanco, negro];
    const color_contrast = colors_contrast[+darkmode];
    const color_uncontrast = colors_contrast[1 - darkmode];

    const primary = this.getPrimaryColor();
    this.primary = primary;

    this.contrast = calculateContrastBG(primary, this.getbg(darkmode, false));

    this.contrastPaper = calculateContrastBG(
      primary,
      this.getbgPaper(darkmode, false)
    );

    this.contrastBOW = calculateContrastBG(
      [Color("black"), Color("white")],
      this.getbg(darkmode, false)
    );

    this.contrastPaperBOW = calculateContrastBG(
      [Color("black"), Color("white")],
      this.getbgPaper(darkmode, false)
    );

    function calculateContrastBG(colorOver, bg) {
      const isBgDark = bg.isDark();
      if (Array.isArray(colorOver)) {
        const [dark, light] = colorOver;
        return isBgDark ? light : dark;
      }
      const hue = colorOver.hue();
      const isBgLight = bg.isLight();
      const colorsroblemLight = {
        green: 120,
        yellow: 60,
        cyan: 180,
      };
      const vals = Object.values(colorsroblemLight).map((v) =>
        Math.abs(v - hue)
      );
      const minVal = Math.min(...vals);
      const ratio = 30;
      const lerpd = 0.3;
      colorOver = colorOver.toLerp(
        colorOver.invertnohue(),
        1 - Math.abs(colorOver.luminosity() - bg.luminosity())
      );
      if (minVal <= ratio) {
        const t = 1 - minVal / ratio;
        const ti = 1 - t;
        const temp = colorOver;
        colorOver = colorOver[["toWhite", "toBlack"][+isBgLight]](lerpd * t);
        colorOver = colorOver.rotate(
          getDirectionAdjacentDark(hue) * 10 * [ti, t][+isBgLight]
        );
      }
      return colorOver;
    }

    const [triade1, triade2, triade3] = this.getTriadeColors(primary);

    this.complement = primary.rotate(180);

    const [[l1, l2, l3, l4], [d1, d2, d3, d4]] = [
      this.getAdjacentPrimaryColor({ n: 5 }), // adjacents lights
      this.getAdjacentPrimaryColor({ n: 5, light: false }), // adjacents darks
    ];
    const [[l30, l60, l90, l120, l150], [d30, d60, d90, d120, d150]] = [
      this.getAdjacentPrimaryColor({ n: 6 }), // adjacents lights
      this.getAdjacentPrimaryColor({ n: 6, light: false }), // adjacents darks
    ];

    function genObjMui(props) {
      const retorno = {};
      Object.entries(props).forEach(([k, v]) => {
        retorno[k] = {
          color: v,
          text: color_contrast,
        };
      });
      return retorno;
    }

    const reds = toColorSteep25("red", this.contrast);
    const paperRed = toColorSteep25("red", this.contrastPaper, "PaperRed");

    const colorsCamaleon = {
      triade1,
      triade2,
      triade3,
      l1,
      l2,
      l3,
      l4,
      l30,
      l60,
      l90,
      l120,
      l150,
      d1,
      d2,
      d3,
      d4,
      d30,
      d60,
      d90,
      d120,
      d150,
      primary,
      white: Color("white"),
      black: Color("black"),
      gray: Color("slategray"),
      pr: primary,
      pri: primary.invert(),
      prinh: primary.invertnohue(),
      contrast: this.contrast,
      contrastBOW: this.contrastBOW,
      contrastPaper: this.contrastPaper,
      contrastPaperBOW: this.contrastPaperBOW,
      complement: this.complement,
      secondary: this.getSecondaryColor(darkmode),
      ...toColorSteep25.bind(this)("PaperBOW", primary),
      ...toColorSteep25.bind(this)("BOW", primary),
      ...toColorSteep25("gray", primary),
      ...reds,
      ...paperRed,
      ...toColorSteep25("green", primary),
      ...toColorSteep25("orange", primary),
      ...toColorSteep25("slategray", primary, "secondary"),
      ...toColorSteep25("crimson", primary, "danger"),
      ...toColorSteep25("limegreen", primary, "safety"),
      ...toColorSteep25("darkorange", primary, "caution"),
      ...toColorSteep25("deepskyblue", primary, "info"),
      close: reds.toRed50,
      closePaper: paperRed.toPaperRed50,
    };
    this.colorsCamaleonKeys = Object.keys(colorsCamaleon);

    return {
      ...super.colors(darkmode),
      ...genObjMui(colorsCamaleon),
    };

    function toColorSteep25(name_color, from, mask_name_color, color) {
      if (!mask_name_color) {
        mask_name_color = name_color;
      }
      switch (name_color.toLowerCase()) {
        case "paperbow":
          color = this.contrastPaperBOW;
          break;
        case "bow":
          color = this.contrastBOW;
          break;
      }
      return {
        [`to${firstUppercase(mask_name_color)}25`]: from.toLerp(
          color || Color(name_color.toLowerCase()),
          0.25
        ),
        [`to${firstUppercase(mask_name_color)}50`]: from.toLerp(
          color || Color(name_color.toLowerCase()),
          0.5
        ),
        [`to${firstUppercase(mask_name_color)}75`]: from.toLerp(
          color || Color(name_color.toLowerCase()),
          0.75
        ),
      };
    }
  }

  willLoad(darkmode) {
    const k = this.scrollname || this.name_color;
    const kl = k.toLowerCase();
    const ls = this.MUIDefaultValues.loadScrollsbar;
    const l = ls[k] || ls[kl];
    if (!l) {
      console.error(
        "WillLoad: No se encontró la paleta seleccionada",
        this.name_color,
        this.scrollname,
        this.scrollname || this.name_color,
        Object.keys(this.MUIDefaultValues.loadScrollsbar)
      );
      return;
    }
    l(darkmode);
  }
  componentsMUI({ colors, darkmode }) {
    const {
      Button = {},
      Typography = {},
      ...s
    } = super.componentsMUI({ colors, darkmode });

    const retorno = {
      ...s,
      Typography: {
        ...Typography,
        primary: (() => {
          const { primary = {} } = Typography;
          return {
            ...primary,
            color: this.main_color.hex(),
          };
        })(),
      },
      Button: {
        ...Button,
        ...[...this.colorsCamaleonKeys, "secondary"]
          .map((state) => {
            if (!Button[state]) {
              Button[state] = {};
            }
            let color = Color("white");
            const bg = this.getbgstate(darkmode, state);
            if (bg && Color(bg).isLight()) {
              color = Color("black");
            }
            return {
              [state]: {
                ...Button[state],
                color: color.hex(),
              },
            };
          })
          .reduce((acc, r) => ({ ...acc, ...r }), {}),
      },
    };

    return retorno;
  }
}
