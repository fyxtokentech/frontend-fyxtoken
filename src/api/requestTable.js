import axios from "axios";

import {
  table2obj,
  responseErrors,
  responseResults,
  responsePromises,
  resolveUrl,
} from "./utils";

const { CONTEXT } = window;

export const getResponse = ({
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
  const url = resolveUrl(buildEndpoint, service);
  console.log(`[getResponse] resolved URL: ${url} service: ${service}`);
  return getSingletonResponse({
    url,
    setError,
    ...rest,
  });
};

function getSingletonResponse({
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
        const result = table2obj(data);
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
          const fallback = table2obj(mock_default.content);
          setApiData(fallback);
          return fallback;
        }
        responseErrors[url] = err;
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

export const request = async ({
  method = "post", // "post" o "put"
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
  const requestUrl = resolveUrl(buildEndpoint, service);
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
    if (isTable) data = table2obj(data);
    console.log(`[request] Éxito respuesta de ${requestUrl}:`, data);
    responseBodyReceived(data);
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

export const postRequest = async (params) => {
  return await request({ ...params, method: "post" });
};
export const putRequest = async (params) => {
  return await request({ ...params, method: "put" });
};
