import Color from "color";

const {
  verde_cielo,
  verde_lima,
  azul_agua,
  blanco,
  negro,
  morado,
  morado_enfasis,
  morado_brillante,
} = global.identity.colors;

class General {
  constructor(packLoadPalette) {
    Object.assign(this, packLoadPalette);
  }

  typography() {
    return {
      fontSize: 13,
      button: {
        textTransform: "none",
      },
    };
  }

  control_components(darkmode) {
    return {
      href: function (props) {
        const stayinGit = window["location"]["href"].includes("github.io");

        return simple(props) ?? complex(props);

        function complex({ view = "/", params = {} }) {
          const root = simple(view);
          params = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

          return [root, params].filter(Boolean).join(root.startsWith("?") ? "&" : "?");
        }

        function simple(url) {
          if (typeof url == "string") {
            return stayinGit ? `?view-id=${encodeURIComponent(url)}` : url;
          }
        }
      },
    };
  }

  components({ darkmode, colors }) {
    const primary = colors.primary.color;
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
          backgroundColor: [primary.darken(0.6), primary][+darkmode].hex(),
        },
      },
    };
  }

  colors(darkmode) {
    const color_contrast = [blanco, negro][+darkmode];
    return {
      cancel: {
        color: Color(["tomato", "crimson"][+darkmode]),
        text: blanco,
      },
      warning: {
        color: Color(["darkorange", "orange"][+darkmode]),
        text: color_contrast,
      },
      ok: {
        color: Color("#29A529"),
        text: blanco,
      },
      verde_lima: {
        color: verde_lima,
        text: color_contrast,
      },
      morado: {
        color: morado,
        text: color_contrast,
      },
      verde_cielo: {
        color: verde_cielo,
        text: color_contrast,
      },
      azul_agua: {
        color: azul_agua,
        text: color_contrast,
      },
      morado_enfasis: {
        color: morado_enfasis,
        text: color_contrast,
      },
      morado_brillante: {
        color: morado_brillante,
        text: color_contrast,
      },
    };
  }

  colorsbg(props) {
    return Object.entries(props).reduce((acc, [key, value]) => {
      acc[key] = value.color;
      return acc;
    }, {});
  }
}

export default General;
