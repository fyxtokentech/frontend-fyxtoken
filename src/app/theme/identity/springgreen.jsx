import BasePalette from "./BasePalette";

import General from "./general";

const {
  springgreen,
  blanco,
  negro,
} = global.identity.colors;

class Springgreen extends BasePalette {
  constructor(props) {
    super({
      main_color: springgreen,
      name_color: "springgreen",
      constrast_color: blanco,
      name_contrast: "blanco",
      main_bright_color: springgreen,
      name_bright_color: "springgreen",
      ...props,
    });
  }
}

export default Springgreen;
