import Color from "color";

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

export default {
  colors({ isDark }) {
    return {
      cancel: {
        color: Color(["tomato", "crimson"][+isDark()]),
        text: blanco,
      },
      success: {
        color: Color("#29A529"),
        text: blanco,
      },
    };
  },
  components({ childs, darkmode, colors }) {
    const primary = colors.primary.color;
    return {
      AccordionDetails: {
        root: {
          padding: 0,
        },
      },
      Paper: {
        root: {
          ...childs("AccordionDetails", {
            root: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }),
        },
      },
      Tooltip: {
        tooltip: {
          backgroundColor: [primary.darken(0.6), primary][+darkmode].hex(),
        },
      },
    };
  },
  typography() {
    return {
      fontSize: 13,
      button: {
        textTransform: "none",
      },
    };
  },
  colorsbg(props) {
    return Object.entries(props).reduce((acc, [key, value]) => {
      acc[key] = value.color;
      return acc;
    }, {});
  },
};
