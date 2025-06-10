import axios from "axios";

import {
  unpackTable,
  buildUrlFromService,
} from "./utils";

import { showSuccess, showWarning, showError } from "@templates";

export const responsePromises = {};
export const responseResults = {};
export const responseErrors = {};

const { CONTEXT } = window;

function SINGLETON_EFFECT({
  url,
  setLoading = () => {},
  setApiData = () => {},
  setError = () => {},
  mock_default,
}) {
  if (!responsePromises[url]) {
    console.log(`[getSingletonResponse] fetching URL: ${url}`);
    setLoading(true);
    responsePromises[url] = axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...(CONTEXT !== "dev" && { withCredentials: false }),
      })
      .then(({ data }) => {
        console.log(`[getSingletonResponse]: ${url} success:`, { data });
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        const result = unpackTable(data);
        responseResults[url] = result;
        setApiData(result);
        return result;
      })
      .catch((err) => {
        console.error(`[getSingletonResponse] error (catch): ${url}`, { err });
        if (
          CONTEXT === "dev" &&
          mock_default &&
          Array.isArray(mock_default.content)
        ) {
          const fallback = unpackTable(mock_default.content);
          setApiData(fallback);
          return fallback;
        }
        responseErrors[url] = err;
        showError(err.message || err);
        setError(err.message || err);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          delete responsePromises[url];
          delete responseResults[url];
          delete responseErrors[url];
        }, 20000);
      });
  } else {
    console.log(
      `[getSingletonResponse] promise already exists for URL: ${url}`
    );
    // Reaplicar datos previos para mantener flujo
    if (responseResults[url]) {
      console.log(`[getSingletonResponse] using cached result for URL: ${url}`);
      setApiData(responseResults[url]);
    } else if (responseErrors[url]) {
      console.log(`[getSingletonResponse] using cached error for URL: ${url}`);
      const err = responseErrors[url];
      setError(err.message || err);
    }
  }
  return responsePromises[url];
}

export const HTTP_REQUEST = async ({
  method = "post", // post | put | path
  buildEndpoint, // Función que construye la URL de la API.
  setError, // Función para manejar errores.
  payload = {}, // Payload para la petición.
  willStart = () => 0, // Callback antes de la petición.
  willEnd = () => 0, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  responseBodyReceived = () => {}, // Callback para recibir el body de la respuesta (success o error)
  isTable = false, // Si es true, transforma la respuesta con table2obj
}) => {
  setError(null);
  const requestUrl = buildUrlFromService(buildEndpoint, service);
  console.log(service);
  console.log(
    `[request] Enviando ${method.toUpperCase()} a ${requestUrl} con data:`,
    payload
  );
  const axiosConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(CONTEXT !== "dev" && { withCredentials: false }),
  };
  willStart();
  try {
    const response = await axios[method.toLowerCase()](
      requestUrl,
      payload,
      axiosConfig
    );
    let data = response.data;
    if (isTable) data = unpackTable(data);
    console.log(`[request] Éxito respuesta de ${requestUrl}:`, data);
    responseBodyReceived(data, {
      data,
      requestUrl,
      response,
    });
    return data;
  } catch (err) {
    console.error(
      `[request] Error en ${method.toUpperCase()} a ${requestUrl}:`,
      err
    );
    setError(err.message || `Error al ejecutar ${method.toUpperCase()}`);
    responseBodyReceived(err.response?.data || err);
  } finally {
    willEnd();
  }
};

export const HTTP_GET = ({
  checkErrors = () => null,
  setError = () => {},
  buildEndpoint,
  service = "robot_backend",
  ...rest
}) => {
  const error = checkErrors();
  if (error) {
    setError(error);
    return Promise.reject(error);
  }
  const url = buildUrlFromService(buildEndpoint, service);
  console.log(`[HTTP_GET] resolved URL: ${url} service: ${service}`);
  return SINGLETON_EFFECT({
    url,
    setError,
    ...rest,
  });
};


export const HTTP_POST = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "post" });
};

export const HTTP_PUT = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "put" });
};

export const HTTP_PATH = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "path" });
};

export const HTTP_PATCH = async (params) => {
  return await HTTP_REQUEST({ ...params, method: "patch" });
};
