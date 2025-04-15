import React from "react";
import { createRoot } from "react-dom/client";
import {RoutingManagement} from "@jeff-aporta/router";
import package_json from "@root/package.json";

const componentsContext = require.context("./views", true, /\.jsx$/);

global.configApp ??= {
  context: "dev",
  userID: "e6746a75-55dc-446a-974e-15a6b3b18aa3"
}

createRoot(document.getElementById("root")).render(
  <RoutingManagement
    {...{
      componentsContext,
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
