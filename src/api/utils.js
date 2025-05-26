export const responsePromises = {};
export const responseResults = {};
export const responseErrors = {};

export const urlapi = {
  local: {
    robot_backend: "http://localhost:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
  web: {
    robot_backend: "http://168.231.97.207:8000",
    robot_prototype: "http://168.231.97.207:8001",
  },
};

/**
 * Resolve full API URL by buildEndpoint using current context.
 */
export function resolveUrl(buildEndpoint, service = "robot_backend") {
  const { IS_LOCAL, CONTEXT } = window;

  const env = IS_LOCAL && CONTEXT === "dev" ? "local" : "web";
  const base = urlapi[env][service];
  return buildEndpoint({ baseUrl: base }).replace(/\s+/g, "");
}

/**
 * Convierte tabla (array de arrays) a array de objetos usando la primera fila como cabeceras.
 * @param {Array<Array<any>>} table
 * @returns {Array<Object>}
 */
export function table2obj(table) {
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
