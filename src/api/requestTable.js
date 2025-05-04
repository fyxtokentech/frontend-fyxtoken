import axios from "axios";

const urlapi = {
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
function resolveUrl(buildEndpoint, service = "robot_backend") {
  const { context } = global.configApp;
  const env = global.IS_LOCAL ? "local" : "web";
  const base = urlapi[env][service];
  return buildEndpoint({ baseUrl: base }).replace(/\s+/g, "");
}

export const getResponse = async ({
  setError,
  checkErrors,
  setLoading,
  setApiData,
  buildEndpoint,
  mock_default,
  service = "robot_backend",
}) => {
  let result;
  const validationError = checkErrors();
  setError(validationError);
  if (validationError) return;
  const { context } = global.configApp;
  const requestUrl = resolveUrl(buildEndpoint, service);

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
      const tableRows = rawData.slice(1).map((rowValues) =>
        columnHeaders.reduce((rowObject, header, index) => {
          rowObject[header] = rowValues[index];
          return rowObject;
        }, {})
      );
      result = tableRows;
      setApiData(result);
      return result;
    } else if (Array.isArray(rawData) && rawData.length === 0) {
      result = [];
      setApiData(result);
      return result;
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
      const tableRows = mock_default.content.slice(1).map((rowValues) =>
        columnHeaders.reduce((rowObject, header, index) => {
          rowObject[header] = rowValues[index];
          return rowObject;
        }, {})
      );
      console.log("[getResponse] [DEV] - Using mock data after error");
      result = tableRows;
      setApiData(result);
      return result;
    } else {
      setError("Error al cargar las operaciones.");
      result = [];
      setApiData(result);
      return result;
    }
  } finally {
    setLoading(false);
  }
};

export const request = async ({
  method = "post", // "post" o "put"
  buildEndpoint, // Función que construye la URL de la API.
  setError, // Función para manejar errores.
  payload = {}, // Payload para la petición.
  willEnd = () => 0, // Callback tras éxito.
  service = "robot_backend", // Servicio en urlapi.
  responseBodyReceived = () => {}, // Callback para recibir el body de la respuesta (success o error)
}) => {
  setError(null);
  const requestUrl = resolveUrl(buildEndpoint, service);
  console.log(
    `[request] Enviando ${method.toUpperCase()} a ${requestUrl} con data:`,
    payload
  );
  const axiosConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(global.configApp.context !== "dev" && { withCredentials: false }),
  };
  try {
    const response = await axios[method.toLowerCase()](
      requestUrl,
      payload,
      axiosConfig
    );
    console.log(`[request] Éxito respuesta de ${requestUrl}:`, response.data);
    responseBodyReceived(response.data);
    willEnd();
    return response.data;
  } catch (err) {
    console.error(
      `[request] Error en ${method.toUpperCase()} a ${requestUrl}:`,
      err
    );
    setError(err.message || `Error al ejecutar ${method.toUpperCase()}`);
    responseBodyReceived(err.response?.data || err);
    throw err;
  }
};

export const postRequest = (params) => request({ ...params, method: 'post' });
export const putRequest = (params) => request({ ...params, method: 'put' });
