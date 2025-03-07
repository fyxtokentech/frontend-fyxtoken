import { createTheme, responsiveFontSizes } from "@mui/material";

var _theme_;
var _isThemeDark_;

var _themename_ = (() => {
  const tema_almacenado = localStorage.getItem("theme");
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
          ...customizePropsMUI(),
          palette: {
            mode: "light",
            ...calculatePalette(false),
          },
        });
      case "dark":
      default:
        return createTheme({
          ...customizePropsMUI(),
          palette: {
            mode: "dark",
            background: {
              default: "#1D0A3D",
              paper: "#381E62",
            },
            ...calculatePalette(true),
          },
        });
    }
  })();

  _theme_ = responsiveFontSizes(retorno);

  return _theme_;

  function customizePropsMUI() {
    const typography = {
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    };

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

    const white = {
      main: "#fff",
      contrastText: "#000",
    };
    const black = {
      main: "#000",
      contrastText: "#fff",
    };
    const contrastText = darkmode ? "#fff" : "#000";
    const uncontrastText = darkmode ? "#000" : "#fff";
    return {
      primary: {
        main: _isThemeDark_ ? "#682BA1" : "#B0E0E6",
        contrastText,
      },
      darkprimary: {
        main: "#003366",
        contrastText,
      },
      secondary: {
        main: darkmode ? "#387FC7" : "#ccccff",
        contrastText,
      },
      success: {
        main: "#32CD32",
        contrastText,
      },
      atentionBlue: {
        main: "#00BFFF",
        contrastText: uncontrastText,
      },
      atentionGreen: {
        main: "#00FA9A",
        contrastText: uncontrastText,
      },
      white,
      black,
      contrast: darkmode ? white : black,
      uncontrast: darkmode ? black : white,
    };
  }
}

theme(_themename_);

export { themename, isDark, theme };
