import Color from "color";

import { Checkbox, Input } from "@mui/material";

import General from "@identity/palettes/general";

const {
  verde_cielo,
  verde_lima,
  azul_agua,
  blanco,
  negro,
  morado,
  morado_enfasis,
  morado_brillante,
  verde_cielo_brillante,
  verde_lima_brillante,
} = global.identity.colors;

class BasePalette extends General {
  constructor(props) {
    super(props);
    console.log(props);

    this.light = this.createThemePalette({
      darkmode: false,
      palette: this,
      background: {
        default: this.main_bright_color.toWhite(0.8).hex(),
        paper: this.main_bright_color.toWhite(0.9).hex(),
      },
    });

    this.dark = this.createThemePalette({
      darkmode: true,
      palette: this,
      background: {
        default: this.main_color.toBlack(this.isMain ? 0.8 : 0.9).hex(),
        paper: this.main_color.toBlack(this.isMain ? 0.8 : 0.9).hex(),
      },
    });
  }

  componentsMUI({ constants_color, darkmode }) {
    const colors = {
      ...constants_color,
      ...this.colors(darkmode),
    };
    const { primary, verde_lima, verde_cielo, cancel } = colors;

    function colorized(color){
      return {
        background: [
          color.color.hex(),
          color.color.darken(0.2).hex(),
        ][Number(darkmode)],
        "&:hover": {
          backgroundColor: color.color.hex(),
        },
      };
    }

    const verde_lima_ = colorized(verde_lima); 
    const verde_cielo_ = colorized(verde_cielo); 
    const lemongreen = verde_lima_;
    const skygreen = verde_cielo_;

    return {
      ...super.components({ colors, darkmode }),
      Button: {
        verde_lima: verde_lima_,
        verde_cielo: verde_cielo_,
        lemongreen,
        skygreen,
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

  control_components(darkmode) {
    const _THIS_ = this;
    const enfasis_input = [this.name_color, this.name_contrast][+darkmode];
    return {
      ...super.control_components(darkmode),
      enfasis_input,
      themized: {
        Checkbox(props) {
          return <Checkbox color={enfasis_input} {...props} />;
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

    let p_color = this.main_color;
    if(!this.isMain){
      p_color = p_color.darken(0.2);
    }
    if (darkmode) {
      p_color = p_color.toBlack(0.2);
    }

    return {
      ...super.colors(darkmode),
      primary: {
        color: p_color,
        text: color_contrast,
      },
      secondary: {
        color: this.main_color.toGray(0.5).darken(0.2),
        text: color_contrast,
      },
    };
  }

  willLoad(darkmode) {
    this.color_register.load_scrollsbar[this.scrollname || this.name_color](darkmode);
  }
}

export default BasePalette;
