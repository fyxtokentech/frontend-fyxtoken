import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_PATH,
  HTTP_PATCH,
} from "./base.js";
import { failureDefault, getMessageError } from "./utils.js";
import { driverParams } from "../themes/router/index.js";
import { rejectPromise, HTTP_IS_ERROR } from "./base.js";

export function AUTO_PARAMS(props) {
  const { currentUser = {} } = window;
  return Object.entries(props)
    .map(([k, v]) => [
      k,
      v || currentUser[[-1, k][+(k === "user_id")]] || driverParams.getOne(k),
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

export async function MAKE_PUT({ failure = failureDefault, ...rest }) {
  try {
    const putResult = await HTTP_PUT({
      failure,
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(putResult);
  } catch (err) {
    failure(
      {
        status: "error",
        err,
        message: "Error fatal try-catch al actualizar PUT",
      },
      rejectPromise
    );
  }
}

export async function MAKE_PATCH({
  failure = failureDefault,
  ...rest /*
  payload = {}, // Payload para la petición.
  willStart = () => 0, // Callback antes de la petición.
  willEnd = () => 0, // Callback al finalizar la petición.
  service = "robot_backend", // Servicio en urlapi.
  isTable = false, // Si es true, transforma la respuesta con table2obj
   */
}) {
  try {
    const patchResult = await HTTP_PATCH({
      failure,
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(patchResult);
  } catch (err) {
    failure(
      {
        status: "error",
        err,
        message: "Error fatal try-catch al actualizar PATCH",
      },
      rejectPromise
    );
  }
}

export async function MAKE_POST({ failure = failureDefault, ...rest }) {
  try {
    const postResult = await HTTP_POST({
      failure,
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(postResult);
  } catch (err) {
    failure(
      {
        status: "error",
        err,
        message: "Error fatal try-catch al crear POST",
      },
      rejectPromise
    );
  }
}

export async function MAKE_GET({ failure = failureDefault, ...rest }) {
  try {
    const respuesta = await HTTP_GET({
      failure,
      ...rest,
    });
    return respuesta;
  } catch (err) {
    failure(
      {
        status: "error",
        err,
        message: "Error fatal try-catch al obtener GET",
      },
      rejectPromise
    );
  }
}
