// Polyfills and environment adjustments
import { postRequest } from "@api/requestTable";
import { href as routerHref } from "@jeff-aporta/theme-manager";

import utilities from "./utilities";

export function init() {
  // --- Sección 1: Entorno ---
  const { configApp } = global;
  const context = configApp?.context;
  // En producción, desactivar console
  if (["prod", "production"].includes(context)) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  // --- Sección 2: Configuración global y flags ---
  global.configApp ??= { context: "dev" };
  const locationHref = window.location.href;
  global.IS_LOCAL = locationHref.includes("localhost");
  global.IS_GITHUB_IO = locationHref.includes(".github.io");

  // --- Sección 3: URL params helper ---
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

  // --- Sección 4: Helpers globales ---
  // Clave de moneda
  global.getCoinKey = (coin) => coin.symbol || coin.name || coin.id || "";

  // --- Sección 5: Autenticación ---
  // Carga de usuario
  window["loadUser"] = async (username, password) => {
    try {
      let user = await postRequest({

        buildEndpoint: ({ baseUrl }) =>
          `${baseUrl}/login/?username=${encodeURIComponent(
            username
          )}&password=${encodeURIComponent(password)}`,
        setError: (err) => err && console.error(err),
        isTable: true,
      });
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

  // --- Sección 6: Utilidades ---
  Object.assign(window, {
    utilities,
    format: {
      number: {
        simple: numberFormat,
        dynamic: dynamicNumberFormat,
        toCoin: numberFormatCoins,
        toCoinDifference: diffNumberFormatCoins,
      },
    },
    props: {
      "ChipSmall": {
        size: "small",
        variant: "filled",
      },
    },
    style: {
      "ChipSmall": {
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

function numberFormat(number_format, value, local, retorno) {
  if (number_format) {
    const number = Number(value);
    const numeroFormateado = new Intl.NumberFormat(
      local ?? "es-ES",
      number_format
    ).format(number);
    retorno = numeroFormateado;
  }
  return { retorno };
}

function dynamicNumberFormat({ value }) {
  const absValue = Math.abs(value);
  if (!absValue || isNaN(absValue)) {
    return { maximumFractionDigits: 2 };
  }
  const decimals = Math.min(
    8,
    Math.max(2, Math.floor(1 - Math.log10(absValue))+4)
  );
  return { maximumFractionDigits: decimals };
}

// Función global para formateo rápido de número actual
function numberFormatCoins(value, local) {
  // Genera formato dinámico según valor
  const number_format = dynamicNumberFormat({ value });
  // Aplica formato mediante processNumberFormat
  const { retorno } = numberFormat(number_format, value, local, "");
  return retorno;
}

function diffNumberFormatCoins(value1, value2, local) {
  const diff = (value1 - value2) / 10;
  const number_format = dynamicNumberFormat({ value: diff });
  const { retorno } = numberFormat(number_format, value1, local, "");
  return retorno;
}
