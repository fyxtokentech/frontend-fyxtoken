import axios from "axios";

// TTL constant: 1 minute with 40 seconds
const TIME_LIMIT_TTL = 100_000;

const persistentRules = [`/coins/`];

// Save data to localStorage with timestamp
function saveWithTTL(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), data }));
  } catch {}
}

// Load data if not expired
function loadWithTTL(key) {
  // No debe hacer el borrado, el sweepExpiredCache lo hace
  const raw = localStorage.getItem(key);
  if (!raw) {
    return;
  }
  try {
    const { t, data } = JSON.parse(raw);
    return data;
  } catch {}
}

// Sweep expired cache entries to free memory asynchronously
async function sweepExpiredCache() {
  // iterate backwards as keys may be removed
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key.startsWith("getResponse:")) {
      continue;
    }
    // skip persistent entries (e.g. coins)
    if (persistentRules.some((rule) => key.includes(rule))) {
      continue;
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        localStorage.removeItem(key);
        continue;
      }
      const { t } = JSON.parse(raw);
      if (Date.now() - t < 10 * TIME_LIMIT_TTL) {
        continue;
      }
    } catch {}
    localStorage.removeItem(key);
  }
}

// perform cleanup on module load without blocking
setTimeout(sweepExpiredCache);

const apiBaseUrl = "http://82.29.198.89:8000";
const localApiUrl = "http://localhost:8000";

/**
 * Resolve full API URL by buildEndpoint using current context.
 */
function resolveUrl(buildEndpoint) {
  const { context } = global.configApp;
  const base = context === "dev" ? localApiUrl : apiBaseUrl;
  return buildEndpoint({ baseUrl: base }).replace(/\s+/g, "");
}

// Manual caching: responses cached in localStorage for 1 minute

export const getResponse = async ({
  setError,
  checkErrors,
  setLoading,
  setApiData,
  buildEndpoint,
  mock_default,
}) => {
  const validationError = checkErrors();
  setError(validationError);
  if (validationError) return;
  const { context } = global.configApp;
  const requestUrl = resolveUrl(buildEndpoint);
  const cacheKey = `getResponse:${requestUrl}`;
  const cached = loadWithTTL(cacheKey);
  console.log({ cacheKey, cached });
  if (cached) {
    setApiData(cached);
    setLoading(false);

    // background refresh for coins endpoint only if TTL expired
    const raw = localStorage.getItem(cacheKey);
    let cachedTime = 0;

    try {
      cachedTime = JSON.parse(raw).t;
    } catch {}

    if (
      persistentRules.some((rule) => requestUrl.includes(rule)) ||
      Date.now() - cachedTime >= TIME_LIMIT_TTL
    ) {
      (async () => {
        try {
          const { data: rawData2 } = await axios.get(requestUrl);
          let tableRows2 = [];
          if (Array.isArray(rawData2) && rawData2.length > 1) {
            const headers2 = rawData2[0];
            tableRows2 = rawData2
              .slice(1)
              .map((row) =>
                headers2.reduce((obj, h, i) => ({ ...obj, [h]: row[i] }), {})
              );
          } else if (Array.isArray(rawData2) && rawData2.length === 0) {
            tableRows2 = [];
          }
          saveWithTTL(cacheKey, tableRows2);
          setApiData(tableRows2);
        } catch {}
      })();
    }
    return;
  }
  if (context === "dev") {
    console.log(`[getResponse] [DEV] Fetching URL: ${requestUrl}`);
  }
  const axiosConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(context !== "dev" && { withCredentials: false }),
  };
  setLoading(true);
  try {
    const { data: rawData } = await axios.get(requestUrl, axiosConfig);
    if (Array.isArray(rawData) && rawData.length > 1) {
      const columnHeaders = rawData[0];
      const tableRows = rawData.slice(1).map((row) =>
        columnHeaders.reduce(
          (obj, header, index) => ({
            ...obj,
            [header]: row[index],
          }),
          {}
        )
      );
      // store successful data in cache
      saveWithTTL(cacheKey, tableRows);
      setApiData(tableRows);
    } else if (Array.isArray(rawData) && rawData.length === 0) {
      setApiData([]);
    } else {
      throw new Error("Formato de respuesta inesperado");
    }
  } catch (err) {
    if (context === "dev") {
      console.log("getResponse [DEV] - Error detected, using mock data");
    }
    console.error(err);
    if (
      context === "dev" &&
      Array.isArray(mock_default.content) &&
      mock_default.content.length > 1
    ) {
      const columnHeaders = mock_default.content[0];
      const tableRows = mock_default.content.slice(1).map((row) =>
        columnHeaders.reduce(
          (obj, header, index) => ({
            ...obj,
            [header]: row[index],
          }),
          {}
        )
      );
      setApiData(tableRows);
      console.log("[getResponse] [DEV] - Using mock data after error");
    } else {
      setError("Error al cargar las operaciones.");
      setApiData([]);
    }
  } finally {
    setLoading(false);
  }
};

export const putResponse = async ({
  buildEndpoint, // Función que construye la URL de la API.
  setError, // Función para manejar errores.
  payload = {}, // Payload para el PUT request.
  willEnd = () => 0,
}) => {
  setError(null);
  const requestUrl = resolveUrl(buildEndpoint);
  console.log(`[putResponse] Sending PUT to ${requestUrl} with data:`, payload);
  const axiosConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(global.configApp.context !== "dev" && { withCredentials: false }),
  };
  try {
    const { data: responseData } = await axios.put(
      requestUrl,
      payload,
      axiosConfig
    );
    console.log(
      `[putResponse] Success response from ${requestUrl}:`,
      responseData
    );
    willEnd();
    return responseData;
  } catch (err) {
    console.error(`[putResponse] Error on PUT to ${requestUrl}:`, err);
    setError(err.message || "Error al ejecutar PUT");
    throw err;
  }
};
