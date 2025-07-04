// Polyfills and environment adjustments
import utilities from "./utilities";

import { href } from "@jeff-aporta/camaleon";

let CONTEXT;

export function init() {
  if (!CONTEXT) {
    CONTEXT = localStorage.getItem("context-app") || "dev";
  }

  Object.assign(window, {
    getContext() {
      if (!CONTEXT) {
        CONTEXT = localStorage.getItem("context-app") || "dev";
      }
      return CONTEXT;
    },
    setContext(context) {
      if (!context) {
        return;
      }
      CONTEXT = context;
      localStorage.setItem("context-app", context);
    },
    initContext(context) {
      if (!localStorage.getItem("context-app")) {
        window.setContext(context);
      }
    },
    isDev() {
      return window.getContext() == "dev";
    },
    toProd() {
      window.setContext("prod");
    },
    toDev() {
      window.setContext("dev");
    },
  });

  if (["prod", "production"].includes(window.CONTEXT)) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  window["logoutUser"] = () => {
    delete window["currentUser"];
    localStorage.removeItem("user");
    window.location.href = href("@home");
  };
}
