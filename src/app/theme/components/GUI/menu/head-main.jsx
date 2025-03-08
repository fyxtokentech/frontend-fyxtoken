import "./head-main.css";

import { Button, Link, Paper, Typography } from "@mui/material";

import { _img } from "../../repetitives";
import fluidCSS from "fluid-css-lng";
import { ThemeSwitch } from "@components/GUI/switch.jsx";

import { theme, isDark } from "@app/theme/theme-manager.jsx";

const hideIcon = 500;
const wbrk = 600;

export default Menu;

function Menu({ updateTheme = () => 0 }) {
  const { pathname } = window.location;
  const inLogin = pathname.toLowerCase().endsWith("/auth/login");

  return (
    <div
      className={fluidCSS()
        .lerpX([400, 1000], { padding: [10, 20] })
        .end("menu-top d-space-between-center")}
    >
      <BotonInicio />
      <ThemeSwitch
        checked={isDark()}
        onChange={() => updateTheme(isDark() ? "light" : "dark")}
      />
    </div>
  );
}
function BotonInicio() {
  return (
    <Link
      color="inherit"
      underline="none"
      href="/"
      className="d-center bright-hover-1-5 gap-10px c-pointer"
    >
      <_img
        src="img/Logo_Fyxtoken_Icono_Color_Principal.svg"
        width="40"
        className={fluidCSS()
          .lerpX([450, 1000], { width: [30, 40] })
          .end()}
      />
      <div
        className={fluidCSS()
          .lerpX([400, 1000], { fontSize: [15, 20] })
          .end("d-flex-col")}
      >
        <span
          style={{
            fontFamily: "goodtimes-rg",
            color: "#C6E50E",
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
            color: "#21EBEF",
          }}
        >
          Futuro financiero
        </span>
      </div>
    </Link>
  );
}
