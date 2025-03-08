import { createTheme, lighten, responsiveFontSizes } from "@mui/material";

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

/*
  set y get del tema
*/
function theme(name) {
  if (!name) {
    return _theme_;
  }
  _themename_ = name;
  const retorno = (() => {
    switch (_themename_) {
      case "light":
        return createTheme({
          ...customizePropsMUI(false),
          palette: {
            mode: "light",
            ...calculatePalette(false),
          },
        });
      case "dark":
      default:
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

  _theme_ = responsiveFontSizes(retorno);

  return _theme_;

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

  function customizePropsMUI(darkmode) {
    const typography = {
      fontSize: 16 /* Exigencia en [CARTA DE PROTOTIPO Ⓐ] */,
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
    _isThemeDark_ = darkmode;

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

export { themename, isDark, theme };
