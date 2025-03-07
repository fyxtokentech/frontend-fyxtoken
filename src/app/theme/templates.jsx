import React, { useState } from "react";

import "./scss/main.scss";

import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Footer from "@components/GUI/menu/footer.jsx";
import MenuTopUnlog from "@components/GUI/menu/head-main.jsx";

import { theme, themename } from "./theme-manager.jsx";

import JS2CSS from "js2css-tool";

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

function ThemeSwitcher({ children }) {
  const [theme_ref, updateTheme] = useState(theme());

  if (theme_ref != theme()) {
    theme(theme_ref);
    window.localStorage.setItem("theme", JSON.stringify(themename()));
  }

  create_bgdynamic();

  return (
    <Notifier>
      <div className={`${minH} bg-dynamic`}>
        <MenuTopUnlog />
        {children}
      </div>
      <Footer />
    </Notifier>
  );
}

function create_bgdynamic(){
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
          radio({
            colores: [`rgba(255,255,255,0.1)`, "transparent"],
            radio: "max(70dvw, 600px)",
            x: "30%",
            y: "30px",
          }),
          circulo({
            color: color_circulo,
            radio: `max(${20}dvw, 80px)`,
            x: "95%",
            y: "25%",
          }),
          anillo({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "5dvw",
            y: "5dvw",
          }),
          anillo({
            color: color_anillo,
            agujero: radio_agujero,
            radio: radio_anillo,
            x: "calc(20dvw + 50px)",
            y: "calc(40dvh + 50px)",
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

function radio({ colores, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      ${colores.join(",")}
  )`;
}

function circulo({ color, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      ${color} 100%,
      transparent 100%
  )`;
}

function anillo({ color, radio, agujero, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
      transparent ${agujero}, 
      ${color} ${agujero}, 
      ${color} 100%,
      transparent 100%
  )`;
}

export { ThemeSwitcher };
