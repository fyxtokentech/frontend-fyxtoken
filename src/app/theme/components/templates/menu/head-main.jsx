import "./head-main.css";

import {
  Button,
  Link,
  Paper,
  Typography,
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

import { ImageLocal } from "@recurrent";
import fluidCSS from "@jeff-aporta/fluidcss";
import { LuminanceThemeSwitch } from "@components/templates/menu/switch";

import {
  isDark,
  controlComponents,
  getThemeName,
  href,
} from "@jeff-aporta/theme-manager";

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
      <div className="d-center">
        <Tooltip title={"Cambiar a tema " + (isDark() ? "claro" : "oscuro")}>
          <LuminanceThemeSwitch
            checked={isDark()}
            onChange={() => updateTheme(isDark() ? "light" : "dark")}
          />
        </Tooltip>
      </div>
    </div>
  );
}
function BotonInicio() {
  const themeName = getThemeName();
  return (
    <Link
      color="inherit"
      underline="none"
      href={href("/")}
      className="d-center bright-hover-1-5 gap-10px c-pointer"
    >
      <ImageLocal
        src={`img/logo-fyxtoken-${getThemeName()}-color.svg`}
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
        <Typography
          style={{
            fontFamily: "goodtimes-rg",
          }}
          color={(()=> {
            if (isDark()) {
              if (themeName == "main") {
                return "#C6E50E";
              }
              return "white";
            }else{
              if (themeName == "main") {
                return "var(--morado)";
              }
              return "black";
            }
          })()}
          className={fluidCSS()
            .lerpX([400, 1000], { fontSize: [15, 20] })
            .end()}
        >
          Fyxtoken
        </Typography>
        <Typography
          style={{
            fontFamily: "lemonmilk-rg",
            fontSize: "45%",
          }}
          color={(()=> {
            if (isDark()) {
              if (themeName == "main") {
                return "#21EBEF";
              }
            }else{
              if (themeName == "main") {
                return "var(--morado)";
              }
            }
            return themeName;
          })()}
        >
          Futuro financiero
        </Typography>
      </div>
    </Link>
  );
}
