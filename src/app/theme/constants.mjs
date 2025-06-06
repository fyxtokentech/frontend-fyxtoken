import JS2CSS from "@jeff-aporta/js2css";

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
  springgreen,
} = window.identity.colors;

const mouseFxBackall = "-1",
  mouseFxOverall = "8",
  MinOverscroll = "7";

export const zIndex = {
  mouseFxBackall,
  mouseFxOverall,
  MinOverMouseFx: (Number(mouseFxOverall) + 1).toString(),
  MinOverscroll,
};

JS2CSS.insertStyle({
  id: "theme-constants",
  objJs: {
    ":root": {
      "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
      "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
      "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
      "--z-index-minover-scroll": zIndex.MinOverscroll,
    },
  },
});

export const mapFilterTheme = {
  skygreen: (rotation) => rotation(verde_cielo),
  blacknwhite: () => "grayscale(1)",
  lemongreen: (rotation) => rotation(verde_lima),
  springgreen: (rotation) => rotation(springgreen),
};

Object.assign(window, { mapFilterTheme, zIndex });
