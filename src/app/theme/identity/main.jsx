import BasePalette from "./BasePalette";

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

class Main extends BasePalette {
  constructor(props) {
    super({
      isMain: true,
      main_color: morado_enfasis,
      name_color: "morado_enfasis",
      scrollname: "morado",
      constrast_color: verde_cielo,
      name_contrast: "verde_cielo",
      main_bright_color: morado_brillante,
      name_bright_color: "morado_brillante",
      ...props,
    });
  }
}

export default Main;
