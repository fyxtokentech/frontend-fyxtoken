import React, { useState, useEffect } from "react";

import { createRoot } from "react-dom/client";
import package_json from "@root/package.json";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import HomeIcon from "@mui/icons-material/Home";
import {
  assignMapManagement,
  defaultUseViewId,
  RoutingManagement,
  defaultThemeName,
  setTransition,
  setMainTitle,
} from "@jeff-aporta/camaleon";
import { initStartApp } from "./app/_start/start";
import { init as initPolyfill } from "./app/_start/polyfill";
import { routeCheck } from "./app/_start/routeCheck";

setMainTitle("Fyxtoken", "Futuro financiero");

defaultUseViewId(true);
defaultThemeName("violet");
assignMapManagement({
  "@wallet": {
    view: "/users/wallet",
    params: {
      view: "investment",
    },
  },
  "@home": "/",
  "@bot": {
    view: "/dev/bot",
    params: {
      view_bot: "main",
      period: "most_recent",
      id_coin: 1,
      coin: "BTC",
      view_table: "operations",
    },
  },
});
initStartApp();
initPolyfill();
const time = 200;
setTransition({
  fade: {
    userSelect: "none",
    pointerEvents: "none",
    transition: `all ${time}ms ease-in-out`,
  },
  fadeout: {
    transform: "translateX(-100%)",
    filter: "opacity(0.6) grayscale(0.5)",
  },
  fadein: {
    transform: "translateX(0)",
    filter: "opacity(1) grayscale(0)",
  },
  time: time,
});

const componentsContext = require.context("./views", true, /\.jsx$/);

// Cargar usuario automáticamente desde localStorage en window.currentUser
window["currentUser"] = JSON.parse(localStorage.getItem("user") || "null");

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    componentsContext={componentsContext}
    routeCheck={routeCheck}
    customRoutes={{ custom: <h1>Hola desde custom</h1> }}
    startIgnore={[
      package_json.repository.url
        .replace("http://", "")
        .split("/")
        .filter(Boolean)[3],
    ]}
  />
);
