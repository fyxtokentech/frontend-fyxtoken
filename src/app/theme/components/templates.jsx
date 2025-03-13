import React, { useState } from "react";

import "@theme/scss/main.scss";

import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Footer from "@components/GUI/menu/footer.jsx";
import MenuTopUnlog from "@components/GUI/menu/head-main.jsx";

import { theme, themename, isDark } from "@theme/theme-manager";

import JS2CSS from "js2css-tool";
import fluidCSS from "fluid-css-lng";

const minH = "min-h-80vh";

function Notifier({ children }) {
  return (
    <Themized>
      {children}
      <Toaster />
    </Themized>
  );

  function Themized({ children }) {
    return (
      <ThemeProvider theme={theme()}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }
}

function ThemeSwitcher({ children, bgtype = "1", h_init = "0", h_fin = "0" }) {
  const [theme_ref, updateTheme] = useState(theme());

  if (theme_ref != theme()) {
    theme(theme_ref);
    window.localStorage.setItem("theme", themename());
  }

  return (
    <Notifier>
      <FirstPart />
      <Footer />
    </Notifier>
  );

  function FirstPart() {
    return (
      <div className="p-relative">
        <div
          className={(() => {
            const fluid = fluidCSS();
            switch (bgtype) {
              case "1":
                fluid.ltX(800, {
                  opacity: ["0.5", "1"],
                });
                create_bgdynamic();
                break;
              case "2":
                create_bgdynamic_portal();
                fluid
                  .btwX(550, 800, {
                    opacity: ["0", "0.5", "1"],
                  })
                  .ltX(550, {
                    display: "none",
                  });
                break;
            }
            return fluid.end(
              `expand bg-dynamic dyn-filter z-index-1 ${
                isDark() ? "" : "invert hue-rotate180deg"
              }`
            );
          })()}
        />
        <div className={`${minH}`}>
          <MenuTopUnlog updateTheme={updateTheme} />
          <div style={{ minHeight: h_init }} />
          {children}
          <div style={{ minHeight: h_fin }} />
        </div>
      </div>
    );
  }
}

function create_bgdynamic_portal() {
  JS2CSS.insertStyle({
    id: "bg-dynamic",
    objJs: {
      ".bg-dynamic": {
        background: [
          ...[
            { a: 30, r: 30, ri: 4 },
            { a: 35, r: 30, ri: 6 },
            { a: 40, r: 30, ri: 8 },
            { a: 210, r: 30, ri: 4 },
            { a: 215, r: 30, ri: 6 },
            { a: 220, r: 30, ri: 8 },
          ].map((o) => {
            const { a, r, ri } = o;
            return ring({
              color: "rgba(20,255,255,0.25)",
              agujero: ri + "px",
              radio: ri + 4 + `px`,
              ...(() => {
                return {
                  x: `calc(${percent(r)} * cos(${a}deg) + 50%)`,
                  y: `calc(${percent(r)} * sin(${a}deg) + 50%)`,
                };
              })(),
            });
          }),
          linear({
            angle: "45deg",
            colors: [
              "rgba(255,0,255,0.3)",
              "rgba(150,0,255,0.3)",
              `transparent ${percent(40)}`,
              `transparent ${percent(60)}`,
              "rgba(0, 0, 0, 0.3)",
              "rgba(0, 0, 0, 0.5)",
              "rgba(0, 0, 0, 0.7)",
              "rgba(0, 0, 0, 0.3)",
              "rgba(0,100,255,0.1)",
              "rgba(0,20,255,0.4)",
              "rgba(0,0,255,0.2)",
            ],
          }),
          circle_hole({
            color: "rgba(255, 255, 255, 0.08)",
            radio: percent(38),
            x: "center",
            y: "center",
          }),
          ring({
            color: "rgba(255, 0, 255, 0.05)",
            agujero: percent(33),
            radio: `calc(${percent(33)} + 20px)`,
            x: "center",
            y: "center",
          }),
          ring({
            color: "rgba(255, 255, 255, 0.08)",
            agujero: percent(50),
            radio: percent(51),
            x: "center",
            y: "center",
          }),
        ].join(","),
      },
    },
  });

  function percent(n) {
    return `calc(${n / 100} * max(100dvw, 100dvh))`;
  }
}
function create_bgdynamic() {
  const color_anillo = "rgba(255,255,255, 0.03)";
  const color_circulo = "rgba(186, 85, 211, 0.1)";
  let radio_anillo = 35;
  let radio_agujero = (() => {
    const grosor = 7;
    return radio_anillo - grosor;
  })();
  radio_anillo = `max(${radio_anillo}dvw, 250px)`;
  radio_agujero = `max(${radio_agujero}dvw, 200px)`;
  JS2CSS.insertStyle({
    id: "bg-dynamic",
    objJs: {
      ".bg-dynamic": {
        background: [
          linear({
            angle: "to bottom",
            colors: [
              "transparent 70%",
              "rgba(120,20,255,0.2)",
              "rgba(220,100,255,0.2) 98%",
              "rgba(220,100,255,0.3) calc(100% - 20px)",
            ],
          }),
          radio({
            colores: [`rgba(255,255,255,0.1)`, "transparent"],
            radio: "max(70dvw, 600px)",
            x: "30%",
            y: "30px",
          }),
          circle({
            color: color_circulo,
            radio: `max(${20}dvw, 80px)`,
            x: "95%",
            y: "25%",
          }),
          ring({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "5dvw",
            y: "5dvw",
          }),
          ring({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "calc(20dvw + 50px)",
            y: "calc(40dvh + 50px)",
          }),
          ring({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "10%",
            y: "60%",
          }),
          ring({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "100%",
            y: "100%",
          }),
          ring({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "70%",
            y: "80%",
          }),
          radio({
            colores: [`rgba(20, 0, 70, 1)`, "transparent"],
            radio: "max(70dvw, 600px)",
            x: "70%",
            y: "600px",
          }),
        ].join(","),
      },
    },
  });
}

function linear({ angle, colors }) {
  return `linear-gradient(${angle}, 
      ${colors.join(",")}
  )`;
}

function radio({ colores, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      ${colores.join(",")}
  )`;
}

function circle({ color, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      ${color} 100%,
      transparent 100%
  )`;
}

function circle_hole({ color, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      transparent 100%,
      ${color} 100%
  )`;
}

function ring({ color, radio, agujero, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      transparent ${agujero}, 
      ${color} ${agujero}, 
      ${color} 100%,
      transparent 100%
  )`;
}

export { ThemeSwitcher };
