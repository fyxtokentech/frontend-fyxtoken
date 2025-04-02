import { createRoot } from "react-dom/client";
import {RoutingManagement} from "@jeff-aporta/router";
import package_json from "@root/package.json";

const componentsContext = require.context("./views", true, /\.jsx$/);

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
