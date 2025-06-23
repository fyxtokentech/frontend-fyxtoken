import {
  setURLMapAPI,
  IS_LOCAL,
} from "@jeff-aporta/camaleon";

setURLMapAPI({
  getContext: () => {
    const { CONTEXT } = window;
    const RETURN = IS_LOCAL && CONTEXT === "dev" ? "local" : "web";
    return RETURN;
  },
  local: {
    robot_backend: "http://localhost:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
  web: {
    robot_backend: "http://168.231.97.207:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
});

export const httpdebug = {
  newfetch: ({ url }) => console.log(`NEW fetching URL: ${url}`),
  fetchcached: ({ url }) => console.log(`CACHED URL: ${url}`),
  willStart: (props)=>console.log(`[request] Enviando:`, props),
};

export * from "./GET.js";
export * from "./POST.js";
export * from "./PUT.js";
export * from "./PATCH.js";