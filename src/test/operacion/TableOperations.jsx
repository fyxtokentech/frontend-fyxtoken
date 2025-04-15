import { IconButton, Paper, Tooltip, Typography, Alert } from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DynTable, rendersTemplate } from "@components/GUI/DynTable/DynTable";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import mock_transaction from "@test/transaccion/mock-transaction.json";

import { AutoSkeleton, DateRangeControls } from "@components/controls";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

export default TableOperations;

function TableOperations({
  useForUser = true, // if true, is used for user
  setOperationTrigger, // only use for user
  setViewTable, // only use for user
  data,
  columns_config,
  user_id,
  coinid, // Valor por defecto 1 si no se proporciona
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(null);
  const [dateRangeFin, setDateRangeFin] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la API
  const fetchOperationsData = async () => {
    if (!user_id) {
      return console.log("No hay usuario seleccionado");
    }

    if (!dateRangeInit || !dateRangeFin) {
      return console.log("No hay fechas seleccionadas");
    }

    try {
      // Formatear fechas para la API
      const startDate = dateRangeInit.format("YYYY-MM-DD");
      const endDate = dateRangeFin.format("YYYY-MM-DD");

      // Determinar la base URL según la configuración global
      const apiBaseUrl = "http://82.29.198.89:8000";
      const localApiUrl = "http://localhost:8000";

      // Usar la configuración global para determinar el entorno
      const baseUrl =
        global.configApp.context === "dev" ? localApiUrl : apiBaseUrl;

      // Construir URL con parámetros incluyendo coinid en el nuevo formato
      const apiUrl = `${baseUrl}/operations/table/${user_id}?coinid=${coinid}&start_date=${startDate}&end_date=${endDate}&page=0&limit=999999`;

      // Configuración para manejar CORS
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Agregar configuración CORS solo para producción
        ...(global.configApp.context !== "dev" && { withCredentials: false }),
      };

      // Realizar la petición con manejo de errores CORS
      let response;
      try {
        response = await axios.get(apiUrl, config);
        
        // Procesar la respuesta en formato array de arrays
        if (response.data && Array.isArray(response.data) && response.data.length > 1) {
          // El primer elemento contiene los nombres de las columnas
          const headers = response.data[0];
          
          // Convertir los datos de array de arrays a array de objetos
          const processedData = response.data.slice(1).map(row => {
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
          setApiData(mock_operation.content);
        }
      } catch (error) {
        // Manejo de errores según el entorno
        if (global.configApp.context === "dev") {
          console.error("Error en entorno de desarrollo:", error.message);
          // En desarrollo, usar datos mock
          console.log("Usando datos mock debido al error");
          
          // Procesar los datos mock que ahora también están en formato array de arrays
          if (mock_operation.content && Array.isArray(mock_operation.content) && mock_operation.content.length > 1) {
            const headers = mock_operation.content[0];
            const processedMockData = mock_operation.content.slice(1).map(row => {
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
      setApiData(mock_operation.content);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambia el rango de fechas o el user_id
  useEffect(() => {
      fetchOperationsData();
  }, [user_id, dateRangeInit, dateRangeFin]);

  // Determinar qué datos mostrar: API o mock
  let content = user_id ? apiData : data?.content ?? mock_operation.content;
  columns_config ??= [...columns_operation.config];

  content = content.map((item) => ({
    ...item,
    name_coin: item.name_coin ?? "FYX",
  }));

  if (useForUser) {
    Opciones();
  }

  return (
    <>
      <Typography variant="h5" className="mh-20px">
        Operaciones
      </Typography>
      <div className={loading ? "" : "mh-30px"}>
        <DateRangeControls
          {...{
            loading,
            dateRangeInit,
            dateRangeFin,
            setDateRangeInit,
            setDateRangeFin,
          }}
          period="month"
        />
      </div>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {user_id && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          Usuario: {user_id}
        </Typography>
      )}
      <AutoSkeleton h="auto" loading={loading}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DynTable
            {...rest}
            columns={columns_config}
            rows={content}
            getRowId={(row) =>
              row.id_operation || row.id || Math.random().toString()
            }
          />
        </div>
      </AutoSkeleton>
    </>
  );

  function Opciones() {
    columns_config.unshift({
      field: Math.random().toString(36).replace("0.", "opns-"),
      headerName: "Detalle",
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Tooltip title="Transacciones" placement="left">
            <Paper
              className="circle d-center"
              style={{
                width: "30px",
                height: "30px",
                margin: "auto",
                marginTop: "10px",
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  setOperationTrigger(row);
                  setViewTable("transactions");
                }}
              >
                <TransactionsIcon />
              </IconButton>
            </Paper>
          </Tooltip>
        );
      },
    });
  }
}
