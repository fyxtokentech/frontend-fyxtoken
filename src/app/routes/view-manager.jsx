import React from "react";

import { RouterProvider } from "react-router-dom";
import { createBrowserRouter, useParams } from "react-router-dom";
import componentsMap from "./mapfiles-jsx";

function RouteComponent() {
  const params = useParams();
  const nodes = Array.from({ length: 10 })
    .map((_, n) => params[`node${n + 1}`])
    .filter(Boolean);
  let K = nodes.join("/");
  if (!componentsMap[K]) {
    const F = (Arr) => Arr.filter(Boolean).join("/");
    const index = F([K, "index"]);
    const index2 = F([K, "index", "index"]);
    const homonim = F([K, nodes.at(-1)]);
    const homonim2 = F([K, nodes.at(-1), nodes.at(-1)]);
    K = [index, index2, homonim, homonim2].find((i) => componentsMap[i]);
  }
  if (typeof componentsMap[K] == "function") {
    return componentsMap[K]();
  }
  return componentsMap[K];
}

let pattern = "";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteComponent />,
  },
  ...Array.from({ length: 10 }).map((_, i) => {
    pattern += `/:node${i + 1}`;
    return {
      path: pattern,
      element: <RouteComponent />,
    };
  }),
]);

export default () => <RouterProvider router={router} />;
