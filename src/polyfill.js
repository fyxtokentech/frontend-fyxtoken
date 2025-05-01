// Polyfills and environment adjustments
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

  const { href } = window.location;

  global.configApp ??= {
    context: "dev",
    userID: "e6746a75-55dc-446a-974e-15a6b3b18aa3",
  };

  global.IS_LOCAL = href.includes("localhost");

  // Define helper para entorno GitHub Pages
  global.IS_GITHUB_IO = href.includes(".github.io");

  // Global helper para clave de moneda
  global.getCoinKey = (coin) => coin.symbol || coin.name || coin.id || "";
}
