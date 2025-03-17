import React, { useEffect, useRef, useState } from "react";

import fluidCSS from "@jeff-aporta/fluidcss";
import JS2CSS from "@jeff-aporta/js2css";

import { ThemeSwitcher, themeSwitch_listener } from "@components/templates";
import { DivM } from "@components/containers";

import { Button, Paper, Typography } from "@mui/material";
import { isDark } from "@jeff-aporta/theme-manager";

import {
  generate_inputs,
  generate_selects,
  Info,
} from "@components/repetitives";

import "./pricing.css";

function Pricing() {
  const [theme, setTheme] = useState(isDark());
  const txt = "Compara planes y características";
  document.querySelector("title").innerHTML = txt;

  useEffect(() => {
    themeSwitch_listener.push(setTheme);
  }, []);

  console.log("a", isDark());

  const subtitle_classes = isDark() ? "morado-enfasis-brillante" : "azul-agua";

  JS2CSS.insertStyle({
    id: "pricing",
    objJs: {
      ":root": {
        "--border-table": `${
          isDark() ? "hsla(81, 100%, 37%, 0.8)" : "lightgray"
        }`,
        "--border-bright-table": `${
          isDark() ? "hsla(81, 100%, 60%, 0.2)" : "transparent"
        }`,
        "--bg-table": `${
          isDark() ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)"
        }`,
      },
    },
  });

  return (
    <ThemeSwitcher h_fin="300px">
      <div className="content-view">
        <DivM>
          <Paper className="d-center" id="pricing">
            <table
              cellSpacing={0}
              cellPadding={0}
              className="bordear horizontal mix"
            >
              <tbody>
                <tr>
                  <td
                    className="bordear vertical mix"
                    colSpan={7}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      className={`goodtimes-rg ${
                        isDark() ? "verde-lima" : "verde-cielo"
                      }`}
                    >
                      {txt}
                    </Typography>
                  </td>
                </tr>
                <tr className="bordear horizontal mix">
                  <td></td>
                  <td>
                    <Plan name="Básico" price="Gratis / 7 Dias" />
                  </td>
                  <td>
                    <Plan name="Avanzado" price="$10 / Mensual" />
                  </td>
                  <td>
                    <Plan name="Pro" price="$20 / Mensual" />
                  </td>
                  <td>
                    <Plan name="Elite" price="$50 / Mensual" />
                  </td>
                  <td className="vertex vertical right">
                    <Plan name="Premium" price="$100 / Anual" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={7}>
                    <div className={`goodtimes-rg ${subtitle_classes}`}>
                      Capacidad de uso
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Paper>
        </DivM>
      </div>
    </ThemeSwitcher>
  );

  function Plan({ name, price, description }) {
    return (
      <div className="d-flex-col-center">
        <span className="nombre-plan">{name}</span>
        <span className="precio-plan">{price}</span>
        <Button variant="contained" size="small">
          Seleccionar
        </Button>
      </div>
    );
  }
}

export default Pricing;
