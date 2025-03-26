import React from "react";

import { RouterProvider } from "react-router-dom";
import { createBrowserRouter, useParams } from "react-router-dom";

import DriverParams from "./DriverParams";

function loadRoot(componentsContext) {
  const rutas = componentsContext.keys().reduce((map, filePath) => {
    const componentName = filePath.replace("./", "").replace(/\.jsx$/, "");
    map[componentName] = componentsContext(filePath).default;
    return map;
  }, {});

  return rutas;
}

function componentsMap(customRoutes, componentsContext) {
  return { ...loadRoot(componentsContext), ...(customRoutes ?? {}) };
}

function RouteComponent({
  componentsContext,
  customRoutes = {},
  startIgnore = [],
}) {
  const view_id = DriverParams().get("view-id");
  const routes = componentsMap(customRoutes, componentsContext);
  const params = useParams();
  const nodes = (
    view_id
      ? view_id.split("/")
      : Array.from({ length: 10 }, (_, n) => params[`node${n + 1}`])
  ).filter(Boolean);

  let rutaCompacta = nodes.join("/");
  limpiarIgnorados();
  evaluarIndex();
  inferirIntension();
  evaluar404();

  return evaluarFn() ?? routes[rutaCompacta];

  function evaluarIndex() {
    if (nodes.length === 0) {
      rutaCompacta = "index";
    }
  }

  function limpiarIgnorados() {
    if (!Array.isArray(startIgnore)) {
      startIgnore = [startIgnore];
    }
    const [nodeStart] = nodes;
    if (
      nodeStart &&
      startIgnore.map((i) => i.toLowerCase()).includes(nodeStart.toLowerCase())
    ) {
      nodes.shift();
    }
  }

  function inferirIntension() {
    if (!routes[rutaCompacta]) {
      rutaCompacta = generarInferencias();
    }

    function generarInferencias() {
      const ordenPrioridad = [
        ...generarNiveles("index"),
        ...generarNiveles(nodes.at(-1)),
      ];

      return ordenPrioridad.find((i) => routes[i]);

      function generarNiveles(node) {
        const compactar = (Arr) => Arr.filter(Boolean).join("/");

        const primer_nivel = compactar([rutaCompacta, node]);
        const segundo_nivel = compactar([rutaCompacta, node, node]);
        return [primer_nivel, segundo_nivel];
      }
    }
  }

  function evaluarFn() {
    if (typeof routes[rutaCompacta] == "function") {
      return routes[rutaCompacta]();
    }
  }

  function evaluar404() {
    if (!routes[rutaCompacta]) {
      rutaCompacta = "404";
    }
  }
}

let pattern = "";

export default (props) => (
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "/",
        element: <RouteComponent {...props} />,
      },
      ...Array.from({ length: 10 }).map((_, i) => {
        pattern += `/:node${i + 1}`;
        return {
          path: pattern,
          element: <RouteComponent {...props} />,
        };
      }),
    ])}
  />
);
