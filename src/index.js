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
} from "@jeff-aporta/camaleon";
import { initStartApp } from "./app/_start/start";
import { init as initPolyfill } from "./app/_start/polyfill";
import { routeCheck } from "./app/_start/routeCheck";
import { Unauthorize } from "@views/unauthorize";

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
      view_table: "operations",
    },
  },
});
defaultUseViewId(true);
initStartApp();
initPolyfill();

const componentsContext = require.context("./views", true, /\.jsx$/);

// Cargar usuario automáticamente desde localStorage en window.currentUser
window["currentUser"] = JSON.parse(localStorage.getItem("user") || "null");

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    {...{
      componentsContext,
      routeCheck, // Función verificadora de errores en ruta
      componentError: (check) => <Unauthorize message={check.message} />,
      customRoutes: { custom: <h1>Hola desde custom</h1> },
      startIgnore: [
        package_json.repository.url
          .replace("http://", "")
          .split("/")
          .filter(Boolean)[3],
      ],
    }}
  />
);
