// Polyfills and environment adjustments
import { postRequest } from "./api/requestTable";
import { href as routerHref } from "@jeff-aporta/theme-manager";

export function init() {
  const { configApp } = global;
  const context = configApp?.context;
  // En producción, desactivar console.log, console.warn y console.error
  if (["prod", "production"].includes(context)) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  // Define global URL parameter helper
  global.driverParams = {
    get: (key) => new URLSearchParams(window.location.search).get(key),
    gets: (...keys) =>
      keys.map((k) => new URLSearchParams(window.location.search).get(k)),
    set: (key, value) => {
      const params = new URLSearchParams(window.location.search);
      params.set(key, value);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    },
    sets: (entries) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(entries).forEach(([k, v]) => params.set(k, v));
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    },
  };

  const locationHref = window.location.href;

  global.configApp ??= {
    context: "test",
  };

  global.IS_LOCAL = locationHref.includes("localhost");

  // Define helper para entorno GitHub Pages
  global.IS_GITHUB_IO = locationHref.includes(".github.io");

  // Global helper para clave de moneda
  global.getCoinKey = (coin) => coin.symbol || coin.name || coin.id || "";

  // Función para simular carga de usuario con credenciales
  window["loadUser"] = async (username, password) => {
    try {
      let user = await postRequest({
        buildEndpoint: ({ baseUrl }) =>
          `${baseUrl}/login/?username=${encodeURIComponent(
            username
          )}&password=${encodeURIComponent(password)}`,
        setError: (err) => err && console.error(err),
        isTable: true
      });
      if(Array.isArray(user)){
        user = user[0]
      }
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      console.error("Credenciales inválidas", err);
      return null;
    }
  };

  // Función global para logout de usuario
  window["logoutUser"] = () => {
    localStorage.removeItem("user");
    window.location.href = routerHref({ view: "/" });
    delete window["currentUser"];
  };
}
