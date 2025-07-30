import { showError } from "../themes/ui/Notifier.jsx";

const URL_MAP_API = {};

export function getURLMapAPI() {
  return URL_MAP_API;
}

export function setURLMapAPI(map) {
  Object.assign(URL_MAP_API, map);
}

export function getMessageError(err, defaultErr) {
  return err.response?.data || err.message || defaultErr;
}

export function reEnvolve(mainF, secondF) {
  if (secondF) {
    return (...args) => {
      secondF(...args);
      if (mainF) {
        mainF(...args);
      }
    };
  }
  if (mainF) {
    return mainF;
  }
  return () => 0;
}

export function failureDefault(info = {}) {
  let message = "ERROR 💀";
  if (typeof info === "string") {
    message = info;
  } else if (info && typeof info === "object") {
    message = info.message || JSON.stringify(info);
  }
  showError(message, info);
}

/**
 * Resolve full API URL by buildEndpoint using current context.
 */
export function buildUrlFromService(buildEndpoint, service) {
  if (!URL_MAP_API.getContext) {
    showError("Debe configurar getContext en el map api", {
      urlMapApi: URL_MAP_API,
    });
  }
  const env = URL_MAP_API.getContext();
  const BASE_SERVICE = URL_MAP_API[env][service];
  return buildEndpoint({ BASE_SERVICE, service, genpath, env });

  function genpath(path, params = {}) {
    return [
      [BASE_SERVICE, ...path].join("/"),
      Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
    ]
      .filter(Boolean)
      .join("?");
  }
}

/**
 * Convierte tabla (array de arrays) a array de objetos usando la primera fila como cabeceras.
 * @param {Array<Array<any>>} table
 * @returns {Array<Object>}
 */
export function unpackTable(table) {
  if (!table) {
    return [];
  }
  if (!Array.isArray(table)) {
    return table;
  }
  const [headers, ...rows] = table;
  return rows.map((rowValues) =>
    headers.reduce((obj, header, i) => {
      obj[header] = rowValues[i];
      return obj;
    }, {})
  );
}
