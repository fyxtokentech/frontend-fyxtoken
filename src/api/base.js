import axios from "axios";

import {
  unpackTable,
  buildUrlFromService,
  failureDefault,
  reEnvolve,
  getMessageError,
} from "./utils";

import { showSuccess, showWarning, showError } from "@templates";

export const responsePromises = {};
export const responseResults = {};
export const responseErrors = {};

function SINGLETON_EFFECT({
  url,
  successful,
  failure = failureDefault,
  mock_default,
  ...rest
}) {
  successful = reEnvolve(successful, (json) => {
    responseResults[url] = json;
  });
  failure = reEnvolve(failure, (err) => {
    responseErrors[url] = err;
  });
  if (!responsePromises[url]) {
    console.log(`NEW fetching URL: ${url}`);
    responsePromises[url] = new Promise(async (resolve, reject) => {
      try {
        const respuesta = await HTTP_REQUEST({
          method: "get",
          isTable: true,
          buildEndpoint: () => url,
          successful,
          failure,
          ...rest,
        });
        resolve(respuesta);
      } catch (err) {
        reject(err);
      }
    });
  } else {
    console.log(`CACHED URL: ${url}`);
    if (responseResults[url]) {
      console.log(`CACHED result for URL: ${url}`);
      successful(responseResults[url], {
        status: "success",
        message: "",
        url,
      });
    } else if (responseErrors[url]) {
      console.log(`CACHED error for URL: ${url}`);
      const err = responseErrors[url];
      failure(err.message || `Hubo un error en ${url}`, {
        url,
        err,
      });
    }
  }
  return responsePromises[url];
}

export const HTTP_REQUEST = async ({
  method, // post | put | path
  buildEndpoint, // Función que construye la URL de la API.
  payload = {}, // Payload para la petición.
  willStart = () => 0, // Callback antes de la petición.
  willEnd = () => 0, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  successful = () => 0, // Callback para recibir el body de la respuesta (success o error)
  failure = failureDefault,
  isTable = false, // Si es true, transforma la respuesta con table2obj
  mock_default,
}) => {
  if (!method) {
    const msg = "Method is required";
    throw new Error(msg);
  }
  const { CONTEXT } = window;
  method = method.toLowerCase();
  const METHOD = method.toUpperCase();
  const IS_GET = method == "get";

  const url = buildUrlFromService(buildEndpoint, service);

  console.log(`[request] Enviando:`, {
    service,
    payload,
    method,
    url,
  });
  const axiosConfig = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(CONTEXT !== "dev" && { withCredentials: false }),
  };
  willStart();
  try {
    const response = await axios[method](url, payload, axiosConfig);
    let { data } = response;
    if (isTable && data) {
      data = unpackTable(data);
    }
    console.log(`[request] Éxito respuesta de ${url}:`, data);
    successful(data, {
      data,
      requestUrl: url,
      response,
    });
    return data;
  } catch (err) {
    console.error(`[request] Error en ${METHOD} a ${url}:`, err);
    const { content } = mock_default ?? {};
    failure(err.response?.data, err, content);
  } finally {
    willEnd();
  }
};

export const HTTP_GET = ({
  buildEndpoint,
  setLoading,
  setApiData,
  service = "robot_backend",
  checkErrors = () => 0,
  willStart,
  willEnd,
  successful,
  failure,
  ...rest
}) => {
  successful = reEnvolve(successful, setApiData);
  failure = reEnvolve(failure, (...args) => {
    {
      // PROCEDIMIENTO DE MOCKS
      const { CONTEXT } = window;
      const [data, info, contentMockup] = args;
      const use_mockup = (() => {
        const esArray = Array.isArray(contentMockup);
        return esArray && CONTEXT === "dev";
      })();
      if (use_mockup) {
        showWarning("Mockup en uso", url);
        const fallback = unpackTable(contentMockup);
        successful(fallback, {
          status: "simulated",
          message: "Mockup en uso",
          url,
          fallback,
        });
      }
    }
  });
  if (setLoading) {
    willStart = reEnvolve(willStart, () => setLoading(true));
    willEnd = reEnvolve(willEnd, () => setLoading(false));
  }
  const error = checkErrors();
  if (error) {
    failure(error, {
      status: "error",
      message: "Se chequearon errores y se encontró inconsistencia",
      error,
    });
    return Promise.reject(error);
  }
  const url = buildUrlFromService(buildEndpoint, service);
  console.log(`[HTTP_GET] resolved URL: ${url} service: ${service}`);
  return SINGLETON_EFFECT({
    url,
    failure,
    successful,
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
