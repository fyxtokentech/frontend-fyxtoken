import { setURLMapAPI, IS_LOCAL } from "@jeff-aporta/camaleon";

const runtimeContext = window.RUNTIME_CONFIG?.API_CONTEXT;

setURLMapAPI({
  getContext: () => {
    if (runtimeContext === "prov") {
      return "prov";
    }
    //Check is local
    return IS_LOCAL && window.isDev() ? "local" : "web";
  },
  local: {
    robot_backend: "http://localhost:8000",
    robot_prototype: "http://localhost:8081",
  },
  web: {
    robot_backend: "http://168.231.97.207:8000", //Cambiar a 8080 y a 8081 para el ambiente de desarrollo
    robot_prototype: "http://168.231.97.207:8001",
  },
  prov: {
    robot_backend: "http://168.231.97.207:8080",
    robot_prototype: "http://168.231.97.207:8081",
  },
});

export const httpdebug = {
  newfetch: ({ url }) => console.log(`NEW fetching URL: ${url}`),
  fetchcached: ({ url }) => console.log(`CACHED URL: ${url}`),
  willStart: (props) => console.log(`[request] Enviando:`, props),
  willEnd: ({ data, url, ...rest }) => {
    console.log(`[request] Recibido de ${url}: `, data, rest);
  },
};

export * from "./GET.js";
export * from "./POST.js";
export * from "./PUT.js";
export * from "./PATCH.js";
export * from "./DELETE.js";
