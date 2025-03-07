import "./head-main.css";

import { Button, Link, Paper, Typography } from "@mui/material";

import { _img } from "../../repetitives";
import fluidCSS from "fluid-css-lng";
import { ThemeSwitch } from "@components/GUI/switch.jsx";

import { theme, isDark } from "@app/theme/theme-manager.jsx";

const hideIcon = 500;
const wbrk = 600;

function Menu({ }) {
  const { pathname } = window.location;
  const inLogin = pathname.toLowerCase().endsWith("/auth/login");

  return (
    <div
      className={fluidCSS()
        .lerpX([400, 1000], { padding: [10, 20] })
        .end("menu-top d-space-between-center")}
    >
      <BotonInicio />
      <ThemeSwitch checked={isDark()}/>
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
        src="img/Fyxtoken_Negro_128x127.png"
        style={{
          filter: "invert()",
        }}
        className={fluidCSS()
          .lerpX([400, 1000], { width: [20, 30] })
          .end()}
      />
      <Typography
        className={fluidCSS()
          .lerpX([400, 1000], { fontSize: [15, 20] })
          .end()}
      >
        Fyxtoken
      </Typography>
    </Link>
  );
}


export default Menu;