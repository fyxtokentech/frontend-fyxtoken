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

export default ({ customizeScrollbar, color_register }) => {
  Object.assign(color_register.load_scrollsbar, {
    verde_cielo(darkmode) {
      monochrome({ color: verde_cielo, darkmode });
    },
    morado(darkmode) {
      monochrome({ color: morado_enfasis, darkmode });
    },
  });

  function monochrome({ color, darkmode }) {
   if (darkmode) {
     customizeScrollbar({
       main: color.hex(),
       maindark: color.darken(0.2).hex(),
       maindarker: color.darken(0.4).hex(),
       back: color.toBlack(0.5).hex(),
     });
   } else {
     customizeScrollbar({
       main: color.hex(),
       maindark: color.darken(0.2).hex(),
       maindarker: color.darken(0.4).hex(),
       back: color.toWhite(0.9).hex(),
     });
   }
 }
};
