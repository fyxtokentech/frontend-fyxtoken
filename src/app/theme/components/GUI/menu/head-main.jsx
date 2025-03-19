import "./head-main.css";

import { Button, Link, Paper, Typography, Tooltip } from "@mui/material";

import { ImageLocal } from "@recurrent";
import fluidCSS from "@jeff-aporta/fluidcss";
import { ThemeSwitch } from "@interface/basic/switch.jsx";

import { isDark, controlComponents, href } from "@jeff-aporta/theme-manager";

const hideIcon = 500;
const wbrk = 600;

//-------------------------------------

export default HeadMain;

//------------ definitions ------------

function HeadMain({ updateTheme = () => 0 }) {
  const { pathname } = window.location;

  return (
    <div
      className={fluidCSS()
        .lerpX([400, 1000], { padding: [10, 20] })
        .end("menu-top d-space-between-center")}
    >
      <BotonInicio />
      <Tooltip title={"Cambiar a tema " + (isDark() ? "claro" : "oscuro")}>
        <ThemeSwitch
          checked={isDark()}
          onChange={() => updateTheme(isDark() ? "light" : "dark")}
        />
      </Tooltip>
    </div>
  );
}
function BotonInicio() {
  return (
    <Link
      color="inherit"
      underline="none"
      href={href("/")}
      className="d-center bright-hover-1-5 gap-10px c-pointer"
    >
      <ImageLocal
        src="img/logo-fyxtoken-main-color.svg"
        width="40"
        className={fluidCSS()
          .lerpX([450, 1000], { width: [30, 40] })
          .end()}
        style={{
          filter: ["brightness(0.3) hue-rotate(60deg) saturate(1.5)", ""][
            +isDark()
          ],
        }}
      />
      <div
        className={fluidCSS()
          .lerpX([400, 1000], { fontSize: [15, 20] })
          .end("d-flex-col")}
      >
        <span
          style={{
            fontFamily: "goodtimes-rg",
            color: isDark() ? "#C6E50E" : "var(--morado)",
          }}
          className={fluidCSS()
            .lerpX([400, 1000], { fontSize: [15, 20] })
            .end()}
        >
          Fyxtoken
        </span>
        <span
          style={{
            fontFamily: "lemonmilk-rg",
            fontSize: "40%",
            color: isDark() ? "#21EBEF" : "var(--morado)",
          }}
        >
          Futuro financiero
        </span>
      </div>
    </Link>
  );
}
