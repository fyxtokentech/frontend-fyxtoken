import BasePalette from "./BasePalette";

const {
  verde_cielo,
  verde_lima,
  blanco,
  negro,
  verde_cielo_brillante,
} = global.identity.colors;

class Skygreen extends BasePalette {
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

export default Skygreen;
