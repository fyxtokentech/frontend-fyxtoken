import BasePalette from "@identity/palettes/BasePalette";

const {
  springgreen,
  blanco,
  negro,
  morado_enfasis,
} = global.identity.colors;

class Springgreen extends BasePalette {
  constructor(props) {
    super({
      main_color: springgreen,
      name_color: "springgreen",
      constrast_color: morado_enfasis,
      name_contrast: "morado_enfasis",
      main_bright_color: springgreen,
      name_bright_color: "springgreen",
      ...props,
    });
  }
}

export default Springgreen;
