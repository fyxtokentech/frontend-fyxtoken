import { showError } from "@templates";
import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_PATH, HTTP_PATCH } from "./base";
import { failureDefault, reEnvolve, getMessageError } from "./utils";

const { currentUser = {}, driverParams } = window;

export function AUTO_PARAMS(props) {
  return Object.entries(props)
    .map(([k, v]) => [
      k,
      v ?? currentUser[[-1, k][+(k === "user_id")]] ?? driverParams.get(k),
    ])
    .reduce((a, [k, v]) => ((a[k] = v), a), {});
}

function PROCESS_REQUEST_HTTP(data) {
  if (!data) {
    return {
      status: "error",
      message: "No se recibió respuesta",
      result: data,
    };
  }
  const $update = data.updated && data.updated > 0;

  const $succesfully =
    data.status &&
    (data.status != "error" ||
      (typeof data.status === "number" && data.status < 400));

  const some_ok = $update || $succesfully;

  return {
    $status: some_ok ? "success" : "error",
    $message: some_ok ? "Operación exitosa" : data.message,
    $update,
    $succesfully,
    ...data,
  };
}

function processResponseReceived({
  failure = failureDefault,
  successful = () => 0,
  setError,
  nameReq = "",
  json,
  info,
}) {
  failure = reEnvolve(failure, setError);
  const hayRespuesta = json && json.status;
  const esStatusCodeError =
    hayRespuesta && typeof json.status === "number" && json.status >= 400;

  const esStringError =
    hayRespuesta &&
    typeof json.status === "string" &&
    json.status.toLowerCase() === "error";

  json.url = info.requestUrl;
  const error = hayRespuesta && (esStatusCodeError || esStringError);
  json.error = error;

  if (error) {
    json.procedure = "failure";
    const msg = json.message || `Error en operación ${nameReq}`;
    failure(json, info);
  } else {
    json.procedure = "successful";
    successful(json, info);
  }
}

export async function MAKE_PUT({
  setError,
  successful,
  failure = failureDefault,
  ...rest
}) {
  failure = reEnvolve(failure, setError);
  try {
    const putResult = await HTTP_PUT({
      failure,
      successful,
      responseBodyReceived: (json, info) => {
        processResponseReceived({
          nameReq: "PUT",
          successful,
          failure,
          json,
          info,
        });
      },
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(putResult);
  } catch (err) {
    failure(getMessageError(err, "Error try-catch en PUT"), {
      success: "error",
      err,
      message: "Error al actualizar",
    });
  }
}

export async function MAKE_PATCH({
  successful,
  failure = failureDefault,
  ...rest /*
  payload = {}, // Payload para la petición.
  willStart = () => 0, // Callback antes de la petición.
  willEnd = () => 0, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  responseBodyReceived = () => {}, // Callback para recibir el body de la respuesta (success o error)
  isTable = false, // Si es true, transforma la respuesta con table2obj
   */
}) {
  try {
    const patchResult = await HTTP_PATCH({
      successful,
      failure,
      responseBodyReceived: (json, info) => {
        processResponseReceived({
          nameReq: "PATCH",
          successful,
          failure,
          json,
          info,
        });
      },
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(patchResult);
  } catch (err) {
    failure(getMessageError(err, "Error try-catch en PATCH"), {
      success: "error",
      err,
      message: "Error al actualizar",
    });
  }
}

export async function MAKE_POST({
  setError,
  successful,
  failure = failureDefault,
  ...rest
}) {
  failure = reEnvolve(failure, setError);
  try {
    const postResult = await HTTP_POST({
      successful,
      failure,
      responseBodyReceived: (json, info) => {
        processResponseReceived({
          nameReq: "POST",
          successful,
          failure,
          json,
          info,
        });
      },
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(postResult);
  } catch (err) {
    failure(getMessageError(err, "Error try-catch en POST"), {
      success: "error",
      err,
      message: "Error al crear",
    });
  }
}

export async function MAKE_GET({
  setError,
  failure = failureDefault,
  ...rest
}) {
  failure = reEnvolve(failure, setError);
  try {
    const respuesta = await HTTP_GET({
      failure,
      ...rest,
    });
    return respuesta;
  } catch (err) {
    failure(getMessageError(err, "Error try-catch en GET"), {
      success: "error",
      err,
      message: "Error al obtener",
    });
  }
}
