import { PaletteBase } from "@identity/palettes/PaletteBase";

const {
  verde_cielo,
  verde_lima,
  morado_enfasis,
  morado_brillante,
  verde_lima_brillante,
  verde_cielo_brillante,
  springgreen,
} = global.identity.colors;

class Main extends PaletteBase {
  constructor(props) {
    super({
      isMain: true,
      main_color: morado_enfasis,
      name_color: "morado_enfasis",
      scrollname: "morado",
      constrast_color: verde_lima,
      name_contrast: "verde_lima",
      main_bright_color: morado_brillante,
      name_bright_color: "morado_brillante",
      ...props,
    });
  }
}

class Lemongreen extends PaletteBase {
  constructor(props) {
    super({
      main_color: verde_lima,
      name_color: "verde_lima",
      constrast_color: morado_brillante,
      name_contrast: "morado_brillante",
      main_bright_color: verde_lima_brillante,
      name_bright_color: "verde_lima_brillante",
      ...props,
    });
  }
}

class Skygreen extends PaletteBase {
  constructor(props) {
    super({
      main_color: verde_cielo,
      name_color: "verde_cielo",
      constrast_color: verde_lima,
      name_contrast: "verde_lima",
      main_bright_color: verde_cielo_brillante,
      name_bright_color: "verde_cielo_brillante",
      ...props,
    });
  }
}

class Springgreen extends PaletteBase {
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

export { Main, Lemongreen, Skygreen, Springgreen };
