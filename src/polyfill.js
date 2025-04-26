// Polyfills and environment adjustments
export function init() {
  const { configApp } = global;
  const context = configApp?.context;
  // En producción, desactivar console.log, console.warn y console.error
  if (context === 'prod' || context === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  // Define global URL parameter helper
  global.driverParams = {
    get: (key) => new URLSearchParams(window.location.search).get(key),
    gets: (...keys) => keys.map(k => new URLSearchParams(window.location.search).get(k)),
    set: (key, value) => {
      const params = new URLSearchParams(window.location.search);
      params.set(key, value);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    },
    sets: (entries) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(entries).forEach(([k, v]) => params.set(k, v));
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    },
  };

  // Global helper para clave de moneda
  global.getCoinKey = (coin) => coin.symbol || coin.name || coin.id || "";
}