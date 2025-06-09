import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_PATH,
  HTTP_PATCH,
} from "./base";

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
  const update = data.updated && data.updated > 0;

  const succesfully =
    data.status &&
    (data.status != "error" ||
      (typeof data.status === "number" && data.status < 400));

  const some_ok = update || succesfully;

  return {
    status: some_ok ? "success" : "error",
    message: some_ok ? "Operación exitosa" : data.message,
    result: data,
    update,
    succesfully,
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
      responseBodyReceived: (json) => {
        // Manejar respuesta con status >= 400
        if (json && json.status && json.status >= 400) {
          setError(json.message || "Error en operación");
          failure(json);
        } else {
          successful(json);
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
      responseBodyReceived: (json) => {
        // Manejar respuesta con status >= 400
        if (json && json.status && json.status >= 400) {
          setError(json.message || "Error en operación");
          failure(json);
        } else {
          successful(json);
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
      responseBodyReceived: (json) => {
        // Manejar respuesta con status >= 400
        if (json && json.status && json.status >= 400) {
          setError(json.message || "Error en operación");
          failure(json);
        } else {
          successful(json);
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
