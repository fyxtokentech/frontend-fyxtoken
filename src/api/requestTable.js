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
  if (error) {
    return;
  }

  const { context } = global.configApp;

  try {
    let apiUrl = buildEndpoint({
      baseUrl: context === "dev" ? localApiUrl : apiBaseUrl,
    });

    console.log(apiUrl);

    apiUrl = apiUrl.replace(/\s+/g, ""); // Eliminar espacios en blanco

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Agregar configuración CORS solo para producción
      ...(context !== "dev" && { withCredentials: false }),
    };

    // Realizar la petición con manejo de errores CORS
    let response;
    try {
      response = await axios.get(apiUrl, config);

      // Procesar la respuesta en formato array de arrays
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 1
      ) {
        // El primer elemento contiene los nombres de las columnas
        const headers = response.data[0];

        // Convertir los datos de array de arrays a array de objetos
        const processedData = response.data.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        // Actualizar estado con los datos procesados
        setApiData(processedData);
      } else {
        // Si la respuesta no tiene el formato esperado
        console.error("Formato de respuesta inesperado:", response.data);
        setError("Error en el formato de los datos recibidos.");
        // Usar datos mock en caso de error
        setApiData(mock_default.content);
      }
    } catch (error) {
      // Manejo de errores según el entorno
      if (context === "dev") {
        console.error("Error en entorno de desarrollo:", error.message);
        // En desarrollo, usar datos mock
        console.log("Usando datos mock debido al error");

        // Procesar los datos mock que ahora también están en formato array de arrays
        if (
          mock_default.content &&
          Array.isArray(mock_default.content) &&
          mock_default.content.length > 1
        ) {
          const headers = mock_default.content[0];
          const processedMockData = mock_default.content.slice(1).map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          setApiData(processedMockData);
        } else {
          setApiData([]);
        }
      } else {
        // En producción, mostrar error
        console.error("Error en entorno de producción:", error.message);
        setError("Error al cargar las operaciones.");
        setApiData([]);
      }
    } finally {
      setLoading(false);
    }
  } catch (err) {
    console.error("Error al obtener datos de operaciones:", err);
    setError("Error al cargar las operaciones.");
    // Usar datos mock en caso de error
    setApiData(mock_default.content);
  } finally {
    setLoading(false);
  }
};
