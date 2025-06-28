// Polyfills and environment adjustments
import utilities from "./utilities";

import { href as routerHref } from "@jeff-aporta/camaleon";

export function init() {
  window.CONTEXT ??= "dev";
  
  if (["prod", "production"].includes(window.CONTEXT)) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  window.getCoinKey = (coin) => coin.symbol || coin.name || coin.id || "";

  window.loadUser = async (username, password) => {
    try {
      let user = [
        {
          name: "Jeffrey",
          lastName: "Agudelo",
          email: "jeffrey.agudelo@recurrent.com",
        },
      ];
      if (Array.isArray(user)) {
        user = user[0];
      }
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      console.error("Credenciales inválidas", err);
      return null;
    }
  };

  // Logout de usuario
  window["logoutUser"] = () => {
    localStorage.removeItem("user");
    window.location.href = routerHref({ view: "/" });
    delete window["currentUser"];
  };

  // TO DO: BORRAR
  Object.assign(window, {
    props: {
      ChipSmall: {
        size: "small",
        variant: "filled",
      },
    },
    style: {
      ChipSmall: {
        transform: "scale(0.8)",
        fontSize: "smaller",
      },
      "Chip-right": {
        position: "absolute",
        right: "10px",
      },
    },
  });
}