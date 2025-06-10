import React, { useLayoutEffect, useRef, useState } from "react";

import "@theme/scss/main.scss";

import JS2CSS from "@jeff-aporta/js2css";
import fluidCSS from "@jeff-aporta/fluidcss";

import { assignedPath } from "@jeff-aporta/router";
import { routeCheck } from "@app/routeCheck";
import { Toaster, toast } from "react-hot-toast";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {} from "@identity/loader";
import { bgdefault, portal } from "./back-texture";

import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import CursorLight from "@components/Fx/cursor-light";
import Footer from "@components/templates/menu/footer";
import MenuTopUnlog from "@components/templates/menu/head-main";

import {
  setThemeName,
  getTheme,
  getThemeName,
  getThemeLuminance,
  setThemeLuminance,
  isDark,
  paletteSelected,
  Color,
} from "@jeff-aporta/theme-manager";

const minH = "min-h-80vh";

const themeSwitch_listener = [];

export function addThemeSwitchListener(fn) {
  themeSwitch_listener.push(fn);
}

export function removeThemeSwitchListener(fn, index) {
  if (index === undefined) {
    const idx = themeSwitch_listener.indexOf(fn);
    if (idx > -1) themeSwitch_listener.splice(idx, 1);
  } else {
    themeSwitch_listener.splice(index, 1);
  }
}

export function showSuccess(txt) {
  toast(
    (t) => (
      <div className="d-flex ai-center jc-between gap-10px">
        <Typography variant="caption">{txt}</Typography>
        <IconButton
          color="secondary"
          size="small"
          onClick={() => toast.dismiss(t.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    ),
    {
      icon: "✅",
      duration: 10000,
    }
  );
}

export function showWarning(txt, details) {
  console.warn(txt, details);
  toast(
    (t) => (
      <div className="d-flex ai-center jc-between gap-10px">
        <Typography variant="caption" color="warning">{txt}</Typography>
        <IconButton size="small" onClick={() => toast.dismiss(t.id)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    ),
    {
      icon: "⚠️",
      duration: 10000,
    }
  );
}

export function showError(txt, details) {
  console.error(txt, details);
  toast(
    (t) => (
      <div className="d-flex ai-center jc-between gap-10px">
        <Typography variant="caption" color="error">{txt}</Typography>
        <IconButton size="small" onClick={() => toast.dismiss(t.id)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    ),
    {
      icon: "⛔",
      duration: 10000,
    }
  );
}

class Notifier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.listener = () => this.setState({ theme: paletteSelected() });
    addThemeSwitchListener(this.listener);
  }

  componentWillUnmount() {
    removeThemeSwitchListener(this.listener);
  }

  render() {
    const { children } = this.props;
    const { theme = {} } = this.state;
    const { palette } = theme;
    return (
      <Themized>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "5px",
              background: palette?.background?.default,
              color: palette?.text?.primary,
              border:
                "1px solid " +
                (palette?.divider ?? "gray"),
              boxShadow: "5px 5px 5px 0px rgba(0, 0, 0, 0.1)",
              animation: "fadeIn 1s ease, fadeOut 0.3s ease 9.7s forwards",
            },
          }}
        />
        {children}
      </Themized>
    );
  }
}

function Themized({ children }) {
  const theme = getTheme();
  switch(getThemeName()){
    case "main":
      theme.palette.primary.main = Color("rebeccapurple").hex()
      break;
    case "lemongreen":
      theme.palette.primary.main = Color("yellowgreen").hex()
      break;
    case "skygreen":
      theme.palette.primary.main = Color("dodgerblue").hex()
      break;
    case "springgreen":
      theme.palette.primary.main = Color("springgreen").hex()
      break;
    case "blacknwhite":
      theme.palette.primary.main = Color("gray").hex()
      break;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

function ThemeSwitcher({
  children,
  urlShader,
  bgtype = "1",
  h_init = "0",
  h_fin = "0",
}) {
  const [theme_name, updateThemeName] = useState(getThemeName());
  const [theme_luminance, updateThemeLuminance] = useState(getThemeLuminance());

  if (theme_name != getThemeName()) {
    setThemeName(theme_name);
    window.localStorage.setItem("theme-name", theme_name);
  }

  if (theme_luminance != getThemeLuminance()) {
    setThemeLuminance(theme_luminance);
    window.localStorage.setItem("theme-luminance", theme_luminance);
  }

  useLayoutEffect(() => {
    themeSwitch_listener.forEach((fn) => fn(theme_name, theme_luminance));
  }, [theme_name, theme_luminance]);

  return (
    <Notifier>
      <FirstPart />
      <Footer updateThemeName={updateThemeName} getThemeName={getThemeName} />
      <CursorLight />
    </Notifier>
  );

  function FirstPart() {
    return (
      <div className="p-relative">
        <div
          className={(() => {
            const fluid = fluidCSS();
            switch (bgtype) {
              default:
              case "1":
                bgdefault();
                fluid.ltX(800, {
                  opacity: ["0.5", "1"],
                });
                break;
              case "2":
              case "portal":
                fluid
                  .btwX(550, 800, {
                    opacity: ["0", "0.5", "1"],
                  })
                  .ltX(550, {
                    display: "none",
                  });
                portal();
                break;
            }
            return fluid.end(`expand back-texture dyn-filter z-index-1`);
          })()}
        />
        <div className={`${minH}`}>
          <MenuTopUnlog updateTheme={updateThemeLuminance} />
          <div style={{ minHeight: h_init }} />
          {children}
          <div style={{ minHeight: h_fin }} />
        </div>
      </div>
    );
  }
}

export { ThemeSwitcher, Notifier, themeSwitch_listener };
