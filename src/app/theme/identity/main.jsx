import Color from "color";

import { createTheme, Checkbox, Input } from "@mui/material";
import { Palette } from "@mui/icons-material";

import General from "./general";

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

class Main extends General {
  constructor(props) {
    super(props);
    this.light = this.createThemePalette({
      darkmode: false,
      palette: this,
      background: {
        default: morado_brillante.toWhite(0.8).hex(),
        paper: morado_brillante.toWhite(0.9).hex(),
      },
    });
    this.dark = this.createThemePalette({
      darkmode: true,
      palette: this,
      background: {
        default: morado.hex(),
        paper: morado.lighten(0.2).hex(),
      },
    });
  }

  control_components(darkmode) {
    const enfasis_input = ["morado_enfasis", "verde_cielo"][Number(darkmode)];
    return {
      ...super.control_components(darkmode),
      enfasis_input,
      themized: {
        Checkbox(props) {
          return (
            <Checkbox
              color={["verde_cielo", "verde_lima"][Number(darkmode)]}
              {...props}
            />
          );
        },
        Input(props) {
          return <Input color={enfasis_input} {...props} />;
        },
      },
    };
  }
  colors(darkmode) {
    const colors_contrast = [blanco, negro];
    const color_contrast = colors_contrast[+darkmode];
    const color_uncontrast = colors_contrast[1 - darkmode];

    return {
      ...super.colors(darkmode),

      // MUI default
      primary: {
        color: morado_brillante.darken(0.2).toBlack(0.2),
        text: color_contrast,
      },
      secondary: {
        color: morado_brillante.toGray(0.5).darken(0.2),
        text: color_contrast,
      },
    };
  }
  willLoad(darkmode) {
    this.color_register.load_scrollsbar.morado(darkmode);
  }

  componentsMUI({ constants_color, darkmode }) {
    const colors = {
      ...constants_color,
      ...this.colors(darkmode),
    };
    const { primary, verde_lima, cancel } = colors;

    return {
      ...super.components({ colors, darkmode }),
      Button: {
        verde_lima: {
          background: [
            verde_lima.color.hex(),
            verde_lima.color.darken(0.2).hex(),
          ][Number(darkmode)],
          "&:hover": {
            backgroundColor: verde_lima.color.hex(),
          },
        },
        cancel: {
          background: darkmode
            ? cancel.color.darken(0.2).hex()
            : cancel.color.hex(),
          "&:hover": {
            backgroundColor: cancel.color.hex(),
          },
        },
        primary: {
          color: Color("white").hex(),
          "&:hover": {
            backgroundColor: primary.color.hex(),
          },
        },
        root: {
          margin: "0",
        },
      },
    };
  }
}

export default Main;
