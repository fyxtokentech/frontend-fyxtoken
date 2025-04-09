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
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(null);
  const [dateRangeFin, setDateRangeFin] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la API
  const fetchOperationsData = async () => {
    if (!user_id) return;

    if (!dateRangeInit || !dateRangeFin) {
      return;
    }

    setError(null);

    try {
      // Formatear fechas para la API
      const startDate = dateRangeInit.format("YYYY-MM-DD");
      const endDate = dateRangeFin.format("YYYY-MM-DD");

      // Determinar la base URL según el entorno
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";
      // En producción, intentamos usar un CORS proxy si es necesario
      const apiBaseUrl = "http://82.29.198.89:8000";
      const corsProxyUrl = "https://corsproxy.io/?";

      const baseUrl = isProduction
        ? apiBaseUrl // Primero intentamos directamente
        : ""; // URL vacía para desarrollo (usará el proxy configurado)

      // Construir URL con parámetros
      const apiUrl = `${baseUrl}/operations/${user_id}?start_date=${startDate}&end_date=${endDate}&page=1&limit=1000`;

      // Configuración para manejar CORS
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Agregar configuración CORS para peticiones cross-origin en producción
        ...(isProduction && { withCredentials: false }),
      };

      // Realizar la petición con manejo de errores CORS
      let response;
      try {
        response = await axios.get(apiUrl, config);
      } catch (corsError) {
        // Si hay un error CORS en producción, intentar con el proxy CORS
        if (
          isProduction &&
          corsError.message &&
          (corsError.message.includes("CORS") ||
            corsError.message.includes("Network Error"))
        ) {
          console.log("Intentando con CORS proxy debido a:", corsError.message);
          const proxyUrl = `${corsProxyUrl}${encodeURIComponent(
            apiBaseUrl
          )}/operations/${user_id}?start_date=${startDate}&end_date=${endDate}&page=1&limit=1000`;
          response = await axios.get(proxyUrl, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
        } else {
          // Si no es un error CORS o no estamos en producción, relanzar el error
          throw corsError;
        }
      }

      // Actualizar estado con los datos recibidos
      setApiData(response.data);
    } catch (err) {
      console.error("Error al obtener datos de operaciones:", err);
      setError(
        "Error al cargar las operaciones."
      );
      // Usar datos mock en caso de error
      setApiData(mock_operation.content);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambia el rango de fechas o el user_id
  useEffect(() => {
    if (user_id) {
      fetchOperationsData();
    } else {
      // Si no hay user_id, usar datos mock después de un tiempo para simular carga
      const timer = setTimeout(() => {
        setApiData(mock_operation.content);
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
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
