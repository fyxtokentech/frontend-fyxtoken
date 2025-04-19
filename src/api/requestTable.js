import axios from "axios";

const apiBaseUrl = "http://82.29.198.89:8000";
const localApiUrl = "http://localhost:8000";

export const getResponse = async ({
  setError,
  checkErrors,
  setLoading,
  setApiData,
  buildEndpoint,
  mock_default,
}) => {
  const error = checkErrors();
  setError(error);
  if (error) return;
  const { context } = global.configApp;
  const apiUrl = buildEndpoint({
    baseUrl: context === "dev" ? localApiUrl : apiBaseUrl,
  }).replace(/\s+/g, "");
  if (context === "dev") {
    console.log(`getResponse [DEV] - Fetching URL: ${apiUrl}`);
  }
  const config = {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...(context !== "dev" && { withCredentials: false }),
  };
  try {
    const { data } = await axios.get(apiUrl, config);
    if (Array.isArray(data) && data.length > 1) {
      const headers = data[0];
      const processed = data
        .slice(1)
        .map((row) => headers.reduce((o, h, i) => ({ ...o, [h]: row[i] }), {}));
      setApiData(processed);
    } else if (Array.isArray(data) && data.length === 0) {
      setApiData([]);
    } else {
      throw new Error("Formato de respuesta inesperado");
    }
  } catch (err) {
    if (context === "dev") {
      console.log("getResponse [DEV] - Error detected, using mock_default");
    }
    console.error(err);
    if (
      context === "dev" &&
      Array.isArray(mock_default.content) &&
      mock_default.content.length > 1
    ) {
      const headers = mock_default.content[0];
      const processed = mock_default.content
        .slice(1)
        .map((row) => headers.reduce((o, h, i) => ({ ...o, [h]: row[i] }), {}));
      setApiData(processed);
      console.log("Usando datos mock debido al error");
    } else {
      setError("Error al cargar las operaciones.");
      setApiData([]);
    }
  } finally {
    setLoading(false);
  }
};
