import Color from "color";

import { createTheme, Checkbox, Input } from "@mui/material";
import { Palette } from "@mui/icons-material";

import general from "./general";

const {
  verde_cielo,
  verde_lima,
  azul_agua,
  blanco,
  negro,
  morado,
  morado_enfasis,
  morado_brillante,
} = global;

export default (props) => {
  const {
    color_register,
    register_constants_color,
    isDark,
    childs,
    getThemeName,
    getThemeLuminance,
    createThemePalette,
    allComponents,
  } = props;

  const palette = {
    control_components(darkmode) {
      const enfasis_input = ["morado_enfasis", "verde_cielo"][Number(darkmode)];
      return {
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
    },
    typography() {
      return general.typography();
    },
    colors(darkmode) {
      const index_color = darkmode ? 0 : 1;
      const index_color2 = 1 - index_color;
      const colors_contrast = [blanco, negro];
      const color_contrast = colors_contrast[index_color];
      const color_uncontrast = colors_contrast[index_color2];

      return {
        ...general.colors(props),

        // MUI default
        primary: {
          color: morado_brillante.darken(0.2).toBlack(0.2),
          text: color_contrast,
        },
        secondary: {
          color: morado_brillante.toGray(0.5).darken(0.2),
          text: color_contrast,
        },

        // Fyxtoken custom
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
    },
    willLoad(darkmode) {
      color_register.load_scrollsbar.morado(darkmode);
    },
    componentsMUI({ constants_color, darkmode }) {
      const union_colores = {
        ...constants_color,
        ...this.colors(darkmode),
      };
      const { primary, verde_lima, cancel } = union_colores;

      return {
        ...general.components({ ...props, colors: union_colores, darkmode }),
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
    },
  };

  Object.assign(palette, {
    light: createThemePalette({
      darkmode: false,
      palette,
      background: {
        default: morado_brillante.toWhite(0.8).hex(),
        paper: morado_brillante.toWhite(0.9).hex(),
      },
    }),
    dark: createThemePalette({
      darkmode: true,
      palette,
      background: {
        default: morado.hex(),
        paper: morado.lighten(0.2).hex(),
      },
    }),
  });

  color_register["main"] = palette;

  return true;
};
