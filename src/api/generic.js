import { showError } from "@templates";
import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_PATH, HTTP_PATCH } from "./base";

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

export async function MAKE_PUT({
  setError = () => 0,
  successful = () => 0,
  failure = () => 0,
  ...rest
}) {
  try {
    const putResult = await HTTP_PUT({
      setError,
      responseBodyReceived: (json, info) => {
        // Manejar respuesta con status >= 400
        const hayRespuesta = json && json.status;
        const esStatusCodeError =
          hayRespuesta && typeof json.status === "number" && json.status >= 400;
        const esStringError =
          hayRespuesta &&
          typeof json.status === "string" &&
          json.status.toLowerCase() === "error";

        console.log({
          hayRespuesta,
          esStatusCodeError,
          esStringError,
          info,
          json,
        });
        json.url = info.requestUrl;
        const error = hayRespuesta && (esStatusCodeError || esStringError);
        json.error = error;

        console.log(json);

        if (error) {
          console.log("true");
          json.procedure = "failure";
          const msg = json.message || "Error en operación PUT";
          showError(msg);
          setError(msg);
          failure(json, info);
        } else {
          console.log("false");
          json.procedure = "successful";
          successful(json, info);
        }
      },
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(putResult);
  } catch (err) {
    setError(err);
  }
}

export async function MAKE_PATCH({
  setError = () => 0,
  successful = () => 0,
  failure = () => 0,
  ...rest
}) {
  try {
    const patchResult = await HTTP_PATCH({
      setError,
      responseBodyReceived: (json, info) => {
        // Manejar respuesta con status >= 400
        const hayRespuesta = json && json.status;
        const esStatusCodeError =
          hayRespuesta && typeof json.status === "number" && json.status >= 400;
        const esStringError =
          hayRespuesta &&
          typeof json.status === "string" &&
          json.status.toLowerCase() === "error";
        if (hayRespuesta && (esStatusCodeError || esStringError)) {
          const msg = json.message || "Error en operación PATCH";
          showError(msg);
          setError(msg);
          failure(json, info);
        } else {
          successful(json, info);
        }
      },
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(patchResult);
  } catch (err) {
    setError(err);
  }
}

export async function MAKE_POST({
  setError = () => 0,
  successful = () => 0,
  failure = () => 0,
  ...rest
}) {
  try {
    const postResult = await HTTP_POST({
      setError,
      responseBodyReceived: (json, info) => {
        // Manejar respuesta con status >= 400
        const hayRespuesta = json && json.status;
        const esStatusCodeError =
          hayRespuesta && typeof json.status === "number" && json.status >= 400;
        const esStringError =
          hayRespuesta &&
          typeof json.status === "string" &&
          json.status.toLowerCase() === "error";
        if (hayRespuesta && (esStatusCodeError || esStringError)) {
          const msg = json.message || "Error en operación POST";
          showError(msg);
          setError(msg);
          failure(json, info);
        } else {
          successful(json, info);
        }
      },
      ...rest,
    });
    return PROCESS_REQUEST_HTTP(postResult);
  } catch (err) {
    setError(err);
  }
}

export async function MAKE_GET({
  setLoading = () => 0,
  setError = () => 0,
  ...rest
}) {
  setLoading(true);
  try {
    await HTTP_GET({
      setLoading,
      setError,
      ...rest,
    });
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}
