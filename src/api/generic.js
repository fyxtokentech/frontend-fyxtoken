import { getResponse, postRequest, putRequest, request } from "./requestTable";

export function processReturn(data) {
  return {
    result: data,
    all_ok: data && data.updated == 1 && data.status >= 400,
  };
}

export async function putGeneric({
  setError = () => 0,
  successful = () => 0,
  failure = () => 0,
  ...rest
}) {
  try {
    const putResult = await putRequest({
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
    return processReturn(putResult);
  } catch (err) {
    setError(err);
  }
}

export async function postGeneric({
  setError = () => 0,
  successful = () => 0,
  failure = () => 0,
  ...rest
}) {
  try {
    const postResult = await postRequest({
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
    return processReturn(postResult);
  } catch (err) {
    setError(err);
  }
}

export async function getGeneric({
  setLoading = () => 0,
  setError = () => 0,
  ...rest
}) {
  setLoading(true);
  try {
    await getResponse({
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
