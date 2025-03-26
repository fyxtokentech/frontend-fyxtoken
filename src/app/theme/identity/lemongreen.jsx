import BasePalette from "./BasePalette";

const {
  verde_lima,
  morado_brillante,
  verde_lima_brillante,
} = global.identity.colors;

class Lemongreen extends BasePalette {
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

export default Lemongreen;
