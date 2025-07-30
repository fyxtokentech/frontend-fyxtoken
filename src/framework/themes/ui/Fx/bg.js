import { Color } from "../../rules/colors.js";

import {
  colorFilterDiscriminator,
  getLightFilter,
} from "../../../tools/utils.jsx";

import {
  linearGradient,
  ringGradient,
  circleGradient,
  radialGradient,
  toViewportPercent,
  holeCircleGradient,
} from "./paint.css.js";

import {
  getAdjacentPrimaryColor,
  getContrast,
  getTriadeColors,
} from "../../rules/manager/index.js";

import { startAnimateCSSTime } from "./animate.jsx";

import { JS2CSS } from "../../../fluidCSS/JS2CSS/index.js";

export function newBackground({
  back_texture_css,
  style = ({ defaultbg, getLightFilter }) => ({
    ...defaultbg,
  }),
}) {
  JS2CSS.insertStyle({
    id: "back-texture",
    ".back-texture": backtexture_styles(),
  });

  function backtexture_styles() {
    const {
      background = [],
      backgroundImage = [],
      ...rest
    } = back_texture_css({
      colorFilterDiscriminator,
      getLightFilter,
      linearGradient,
      ringGradient,
      circleGradient,
      radialGradient,
      toViewportPercent,
      holeCircleGradient,
    });
    return {
      ...style({
        // defaultbg: colorFilterDiscriminator(getLightFilter()),
        colorFilterDiscriminator,
        getLightFilter,
      }),
      ...rest,
      background: background.join(","),
      backgroundImage: backgroundImage.join(","),
    };
  }
}

/**
 * Aplica el fondo por defecto con texturas, degradados y formas.
 */
export function bgdefault({
  color_anillo = "rgba(128, 128, 128, 0.15)",
  radio_anillo = 35,
  ...rest
} = {}) {
  const adjl = getAdjacentPrimaryColor({
    a: 15,
    n: 3,
  }).map((c) => c.rgb().array().join(","));

  const adjd = getAdjacentPrimaryColor({
    a: 10,
    n: 3,
  })
    .reverse()
    .map(
      (c, i, arr) =>
        `rgba(${c.rgb().array().join(",")}, ${
          (0.3 * (arr.length - i)) / arr.length
        })`
    );

  const color_circulo = `rgba(128, 128, 128, 0.2)`;
  let radio_agujero = (() => {
    const grosor = 7;
    return radio_anillo - grosor;
  })();
  radio_anillo = `max(${radio_anillo}dvw, 250px)`;
  radio_agujero = `max(${radio_agujero}dvw, 200px)`;

  return newBackground({
    ...rest,
    back_texture_css: ({
      linearGradient,
      ringGradient,
      circleGradient,
      radialGradient,
    }) => ({
      opacity: 0.6,
      background: [
        linearGradient({
          angle: "to bottom",
          colors: [
            "transparent 70%",
            `rgba(${adjl[0]}, 0.15)`,
            `rgba(${adjl[1]}, 0.3) 98%`,
            `rgba(${adjl[2]}, 0.5) calc(100% - 20px)`,
          ],
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "30%",
          y: "30px",
        }),
        circleGradient({
          color: color_circulo,
          radius: `max(${20}dvw, 80px)`,
          x: "95%",
          y: "25%",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "5dvw",
          y: "5dvw",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "calc(20dvw + 50px)",
          y: "calc(40dvh + 50px)",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "10%",
          y: "60%",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "100%",
          y: "100%",
        }),
        ringGradient({
          color: color_anillo,
          holeRadius: radio_agujero,
          radius: radio_anillo,
          x: "70%",
          y: "80%",
        }),
        radialGradient({
          colors: [...adjd, "transparent"],
          radius: "max(70dvw, 600px)",
          x: "70%",
          y: "600px",
        }),
      ],
    }),
  });
}

export function zigZag1({ ...rest } = {}) {
  return newBackground({
    ...rest,
    back_texture_css: ({ linearGradient }) => ({
      opacity: 0.1,
      backgroundImage: [
        linearGradient({
          angle: "-45deg",
          colors: ["transparent 75%", "rgb(128, 128, 128) 0"],
        }),
        linearGradient({
          angle: "45deg",
          colors: ["transparent 75%", "rgb(128, 128, 128) 0"],
        }),
        linearGradient({
          angle: "-135deg",
          colors: ["transparent 75%", "rgb(128, 128, 128) 0"],
        }),
        linearGradient({
          angle: "135deg",
          colors: ["transparent 75%", "rgb(128, 128, 128) 0"],
        }),
      ],
      backgroundSize: "8rem 8rem",
      backgroundPosition: "4rem 0, 4rem 0, 0 0, 0 0",
    }),
  });
}

export function portal(options = {}) {
  const [l1, l2, l3, l4] = getAdjacentPrimaryColor({
    a: 15,
    n: 4,
  });
  const [d1, d2, d3, d4] = getAdjacentPrimaryColor({
    a: 15,
    n: 4,
    light: false,
  });
  const [triade0, triade120, triade240] = getTriadeColors();
  startAnimateCSSTime();
  return newBackground({
    ...options,
    back_texture_css: ({
      linearGradient,
      ringGradient,
      toViewportPercent,
      holeCircleGradient,
    }) => ({
      background: [
        ...[
          { a: 0, r: 30, ri: 4 },
          { a: 5, r: 30, ri: 6 },
          { a: 10, r: 30, ri: 8 },
          { a: 180, r: 30, ri: 4 },
          { a: 185, r: 30, ri: 6 },
          { a: 190, r: 30, ri: 8 },
        ].map(({ a, r, ri }) => {
          const dr = `3px * (sin(${2 + (a % 15)} * var(--burn-time)) + 1) / 2`;

          return ringGradient({
            color: `rgba(${triade0.rgb().array().join(",")}, 0.25)`,
            holeRadius: `calc(${ri}px + ${dr})`,
            radius: `calc(${ri + 4}px + ${dr})`,
            x: `calc(${toViewportPercent(
              0.9 * r
            )} * cos(${a}deg + 30deg * var(--burn-time)) + 50%)`,
            y: `calc(${toViewportPercent(
              0.9 * r
            )} * sin(${a}deg + 30deg * var(--burn-time)) + 50%)`,
          });
        }),
        linearGradient({
          angle: "45deg",
          colors: [
            `rgba(${l1.rgb().array().join(",")}, 0.5)`,
            `rgba(${l2.rgb().array().join(",")}, 0.30)`,
            `rgba(${l3.rgb().array().join(",")}, 0.20)`,
            `rgba(${l4.rgb().array().join(",")}, 0.10)`,
            `transparent ${toViewportPercent(40)}`,
            `transparent ${toViewportPercent(60)}`,
            "hsla(0, 0.00%, 0.00%, 0.30)",
            "hsla(0, 0.00%, 0.00%, 0.50)",
            "hsla(0, 0.00%, 0.00%, 0.70)",
            "hsla(0, 0.00%, 0.00%, 0.30)",
            `rgba(${d1.rgb().array().join(",")}, 0.10)`,
            `rgba(${d2.rgb().array().join(",")}, 0.50)`,
            `rgba(${d3.rgb().array().join(",")}, 0.20)`,
            `rgba(${d4.rgb().array().join(",")}, 0.10)`,
          ],
        }),
        holeCircleGradient({
          color: "rgba(255, 255, 255, 0.08)",
          radius: toViewportPercent(38),
          x: "center",
          y: "center",
        }),
        ringGradient({
          color: `rgba(${triade120.rgb().array().join(",")}, 0.1)`,
          holeRadius: toViewportPercent(33),
          radius: `calc(${toViewportPercent(33)} + 20px)`,
          x: "center",
          y: "center",
        }),
        ringGradient({
          color: `rgba(${triade240.rgb().array().join(",")}, 0.15)`,
          holeRadius: toViewportPercent(45),
          radius: `calc(${toViewportPercent(45)} + 20px)`,
          x: "center",
          y: "center",
        }),
      ],
    }),
  });
}
