import { createTheme, lighten, responsiveFontSizes } from "@mui/material";
import JS2CSS from "js2css-tool";

var _theme_;
var _isThemeDark_;

var _themename_ = (() => {
  const tema_almacenado = window.localStorage.getItem("theme");
  const tema_sistema = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return tema_almacenado ?? tema_sistema ?? "dark";
})();

function themename() {
  return _themename_;
}

function isDark() {
  return _isThemeDark_;
}

function theme(name, update = true) {
  if (!name) {
    return _theme_;
  }
  if (update) {
    _themename_ = name;
  }
  const resultadoTema = (() => {
    switch (name) {
      case "light":
        generarScrollbar({
          main: "var(--verde-cielo)",
          maindark: "deepskyblue",
          maindarker: "dodgerblue",
          back: "white",
        });
        return createTheme({
          ...customizePropsMUI(false),
          palette: {
            mode: "light",
            ...calculatePalette(false),
          },
        });
      case "dark":
      default:
        generarScrollbar({
          main: "var(--morado-enfasis)",
          maindark: "RebeccaPurple",
          maindarker: "Indigo",
          back: "var(--morado)",
        });
        return createTheme({
          ...customizePropsMUI(true),
          palette: {
            mode: "dark",
            background: {
              default: "#1B053D",
              paper: "#2C0F57",
            },
            ...calculatePalette(true),
          },
        });
    }
  })();

  const r = responsiveFontSizes(resultadoTema);

  if (update) {
    _theme_ = r;
  }

  return r;

  function colors(darkmode) {
    const index_color = darkmode ? 0 : 1;
    const color_contrast = ["#FFFFFF", "#000000"];

    return {
      color_primary: ["#682BA1", "#1e9cde"][index_color],
      color_secondary: ["#B9A6CE", "#387FC7"][index_color],
      contrastText: color_contrast[index_color],
      uncontrastText: color_contrast[1 - index_color],
    };
  }

  function generarScrollbar({ main, maindark, maindarker, back } = {}) {
    if (!update) {
      return;
    }
    JS2CSS.insertStyle({
      id: "scrollbar",
      objJs: {
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${main} ${back}`,
        },

        "::-webkit-scrollbar": {
          width: "12px",
          height: "12px",
        },

        "::-webkit-scrollbar-track": {
          background: back,
          borderRadius: "10px",
        },

        "::-webkit-scrollbar-thumb": {
          background: `linear-gradient(
            180deg,
            ${main},
            ${maindark}
          )`,
          borderRadius: "10px",
          border: `2px solid ${back}`,
        },

        "::-webkit-scrollbar-thumb:hover": {
          background: `linear-gradient(
            180deg,
            ${maindark},
            ${maindarker}
          )`,
        },

        "textarea, pre, code, div": {
          scrollbarWidth: "thin",
          scrollbarColor: `${main} ${back}`,
        },
      },
    });
  }

  function customizePropsMUI(darkmode) {
    const typography = {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    };

    const { color_primary, color_secondary, contrastText, uncontrastText } =
      colors(darkmode);

    const components = {
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            "&.MuiAccordionDetails-root": {
              backgroundColor: "transparent", // Fondo transparente
              boxShadow: "none", // Opcional: elimina la sombra
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            color: "white",
            "&:hover": {
              backgroundColor: lighten(color_primary, 0.2),
            },
          },
          root: {
            margin: 0,
          },
        },
      },
    };

    return { typography, components };
  }

  function calculatePalette(darkmode) {
    if (update) {
      _isThemeDark_ = darkmode;
    }

    const { color_primary, color_secondary, contrastText, uncontrastText } =
      colors(darkmode);

    const white = {
      main: "#FFFFFF",
      contrastText: "#000000",
    };
    const black = {
      main: "#000000",
      contrastText: "#FFFFFF",
    };

    return {
      primary: {
        main: color_primary,
        contrastText,
      },
      secondary: {
        main: color_secondary,
        contrastText,
      },
      verde_cielo: {
        main: "#1E9CDE",
        contrastText,
      },
      verde_lima: {
        main: "#C6E50E",
        contrastText,
      },
      azul_agua: {
        main: "#21EBEF",
        contrastText,
      },
      morado: {
        main: "#1b053d",
        contrastText,
      },
      morado_enfasis: {
        main: "#9C51BD",
        contrastText,
      },
      morado_brillante: {
        main: "#B79FDA",
        contrastText,
      },
      success: {
        main: "#32CD32",
        contrastText,
      },
      white,
      black,
      contrast: _isThemeDark_ ? white : black,
      uncontrast: _isThemeDark_ ? black : white,
    };
  }
}

theme(_themename_);

function theme_component(){
  return {
    enfasis_input: isDark() ? "morado_enfasis" : "verde_cielo"
  }
}

export { themename, isDark, theme, theme_component };
