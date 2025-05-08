import "./head-main.css";
import React, { useState } from 'react';
import Menu from '@mui/material/Menu';

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
import LoginIcon from "@mui/icons-material/Login";

import {
  isDark,
  controlComponents,
  getThemeName,
  href,
  JS2CSS,
  getThemeLuminance,
} from "@jeff-aporta/theme-manager";
import { queryPath } from "@jeff-aporta/router";

const hideIcon = 500;
const wbrk = 600;

//-------------------------------------

export default HeadMain;

//------------ definitions ------------

function HeadMain({ updateTheme = () => 0 }) {
  const isLoginPage = queryPath().includes('/users/login');
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    window["logoutUser"]();
  };
  const user = window["currentUser"] ?? null;
  const isLogged = !!user;

  JS2CSS.insertStyle({
    id: "headmain-root",
    objJs: {
      ":root": {
        "--border-section": (() => {
          const themename = getThemeName();
          switch (themename) {
            case "blacknwhite":
              return "hsl(var(--gray-h), var(--gray-s), 40%, 0.2)";
            default:
              return "hsl(var(--verde-cielo-h), var(--verde-cielo-s), 40%, 0.2)";
          }
        })(),
      },
    },
  });

  return (
    <div
      className={fluidCSS()
        .lerpX([400, 1000], { padding: [10, 20] })
        .end("menu-top d-space-between-center")}
      style={{
        background: ["rgba(255,255,255,0.25)", "rgba(0,0,0,0.25)"][+isDark()],
      }}
    >
      <BotonInicio />
      <div className="d-center gap-10px">
        {!isLoginPage && !isLogged && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<LoginIcon />}
            href={href("/users/login")}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Inicia sesión
          </Button>
        )}
        {isLogged && (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleOpen}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {user.name}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </>
        )}
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
          filter: (() => {
            const themename = getThemeName();
            const themeluminance = getThemeLuminance();
            switch (themename) {
              case "blacknwhite":
                return themeluminance != "dark" ? "invert()" : "";
            }
          })(),
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
          color={(() => {
            if (isDark()) {
              if (themeName == "main") {
                return "#C6E50E";
              }
              return "white";
            } else {
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
          color={(() => {
            if (isDark()) {
              if (themeName == "main") {
                return "#21EBEF";
              }
            } else {
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
