import "./head.css";

import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import { Divider, ListItemButton, ListItemIcon } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

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
  Avatar,
} from "@mui/material";

import {
  fluidCSS,
  ImageLocal,
  isDark,
  controlComponents,
  getThemeName,
  JS2CSS,
  getThemeLuminance,
  setThemeLuminance,
  getQueryPath,
  PaperF,
  Hm,
  LuminanceThemeSwitch,
  NavigationLink,
} from "@jeff-aporta/camaleon";

import { SessionUser } from "./SessionUser";

const hideIcon = 500;
const wbrk = 600;

export const handleLogout = () => {
  window.logoutUser();
};

export const user = window.currentUser;

export const isLogged = !!user;

export function isLoginPage() {
  const path = getQueryPath();
  return path.includes("users/login");
}

export function HeadMain() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = () => setDrawerOpen((o) => !o);

  JS2CSS.insertStyle({
    id: "headmain-root",
    ":root": {
      "--border-section": (() => {
        const themename = getThemeName();
        switch (themename) {
          case "blackNwhite":
            return "hsl(var(--gray-h), var(--gray-s), 40%, 0.2)";
          default:
            return "hsl(var(--verde-cielo-h), var(--verde-cielo-s), 40%, 0.2)";
        }
      })(),
    },
  });

  return (
    <PaperF
      className="menu-top flex space-between align-center pad-10px"
      hm={false}
    >
      <div className="flex">
        <MenuDrawer />
        <LogoHome />
      </div>
      <div className="flex gap-10px">
        <SessionUser />
        <div
          className={fluidCSS()
            .ltX("medium", {
              display: "none",
            })
            .end()}
        >
          <ThemeSwitch />
        </div>
      </div>
    </PaperF>
  );

  function MenuDrawer() {
    return (
      <>
        <Box sx={{ display: { xs: "flex", md: "none" }, padding: "0 15px" }}>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box role="presentation">
            <List>
              <CaptionSection icon={<HomeIcon fontSize="small" />}>
                Biblioteca de Componentes React
              </CaptionSection>
              <ListItemButton>
                <NavigationLink to="/">
                  <ListItemText primary="Inicio" />
                </NavigationLink>
              </ListItemButton>
              <hr />
              <br />
              {!isLogged && !isLoginPage() && (
                <ListItemButton>
                  <NavigationLink to="/users/login">
                    <ListItemText primary="Iniciar sesión" />
                  </NavigationLink>
                </ListItemButton>
              )}
              {isLogged && (
                <>
                  <CaptionSection icon={<SettingsIcon fontSize="small" />}>
                    Configuración
                  </CaptionSection>
                  <Accordion
                    disableGutters
                    elevation={12}
                    sx={{ boxShadow: "none" }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <ListItemText
                        primary={[user.name, user.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List>
                        <ListItemButton onClick={handleLogout}>
                          <ListItemText primary="Cerrar sesión" />
                        </ListItemButton>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
              <Hm />
              <ListItem>
                <ListItemText primary="Modo: " sx={{ ml: 1 }} />
                <ThemeSwitch />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </>
    );

    function CaptionSection({ icon, children }) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            <small className="d-center gap-10px">
              {icon}
              {children}
            </small>
          </Typography>
        </Box>
      );
    }
  }
}

function ThemeSwitch() {
  return (
    <Tooltip title={"Cambiar a tema " + (isDark() ? "claro" : "oscuro")}>
      <LuminanceThemeSwitch
        checked={isDark()}
        onChange={() => setThemeLuminance(isDark() ? "light" : "dark")}
      />
    </Tooltip>
  );
}

function LogoHome() {
  return (
    <span className="bright-hover-1-5">
      <NavigationLink
        color="inherit"
        underline="none"
        to="/"
        className="d-center gap-10px c-pointer"
      >
        <ImageLocal
          src={`img/metadata/logo-main.svg`}
          width="40"
          className={fluidCSS()
            .lerpX("responsive-min", { width: [30, 40] })
            .end()}
          style={{
            width: "40px",
            objectFit: "contain",
          }}
        />
        <Box
          className={fluidCSS()
            .lerpX("responsive-min", { fontSize: [15, 20] })
            .end("flex col-direction")}
        >
          <Typography
            style={{
              fontFamily: "goodtimes-rg",
            }}
            color={(() => {
              if (isDark()) {
                return "white";
              } else {
                return "black";
              }
            })()}
            className={fluidCSS()
              .lerpX("responsive-min", { fontSize: [15, 20] })
              .end()}
          >
            Fyxtoken
          </Typography>
          <Typography
            style={{
              fontFamily: "lemonmilk-rg",
              fontSize: "45%",
            }}
            color="contrastPaper"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Futuro financiero
          </Typography>
        </Box>
      </NavigationLink>
    </span>
  );
}
