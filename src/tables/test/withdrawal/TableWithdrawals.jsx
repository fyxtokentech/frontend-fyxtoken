import React, { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { DynTable } from "@components/GUI/DynTable/DynTable";
import { AutoSkeleton, DateRangeControls } from "@components/controls";
import dayjs from "dayjs";
import axios from "axios";

// Importar datos mock y configuración de columnas
import mock_withdrawals from "./mock-withdrawals.json";
import columns_withdrawals from "./columns-withdrawals.jsx";

export default function TableWithdrawals({
  user_id,
  showDateRangeControls = true,
  columns_config = columns_withdrawals,
  useForUser = true,
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(null);
  const [dateRangeFin, setDateRangeFin] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la API
  const fetchWithdrawalsData = async () => {
    if (!user_id) {
      console.log("No hay usuario seleccionado");
      setApiData(mock_withdrawals);
      setLoading(false);
      return;
    }

    if (!dateRangeInit || !dateRangeFin) {
      console.log("No hay fechas seleccionadas");
      return;
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

      // Construir URL con parámetros
      const apiUrl = `${baseUrl}/withdrawals/${user_id}?start_date=${startDate}&end_date=${endDate}&page=0&limit=999999`;

      console.log("Fetching withdrawals:", apiUrl);

      // Configuración para manejar CORS
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Agregar configuración CORS solo para producción
        ...(global.configApp.context !== "dev" && { withCredentials: false }),
      };

      // Realizar la petición con manejo de errores
      try {
        const response = await axios.get(apiUrl, config);
        
        // Actualizar estado con los datos recibidos
        if (response.data && Array.isArray(response.data)) {
          setApiData(response.data);
        } else {
          console.error("Formato de respuesta inesperado:", response.data);
          setError("Error en el formato de los datos recibidos.");
          setApiData(mock_withdrawals);
        }
      } catch (error) {
        console.error("Error al obtener datos de retiros:", error);
        
        // En desarrollo, usar datos mock
        if (global.configApp.context === "dev") {
          console.log("Usando datos mock debido al error");
          setApiData(mock_withdrawals);
        } else {
          setError("Error al cargar los retiros.");
          setApiData([]);
        }
      }
    } catch (err) {
      console.error("Error general:", err);
      setError("Error al cargar los retiros.");
      setApiData(mock_withdrawals);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambia el rango de fechas o el user_id
  useEffect(() => {
    if (dateRangeInit && dateRangeFin) {
      fetchWithdrawalsData();
    }
  }, [user_id, dateRangeInit, dateRangeFin]);

  // Determinar qué datos mostrar
  const content = apiData.length > 0 ? apiData : mock_withdrawals;

  return (
    <>
      {showDateRangeControls && (
        <div style={{ marginBottom: "20px" }}>
          <DateRangeControls
            {...{
              dateRangeInit,
              dateRangeFin,
              setDateRangeInit,
              setDateRangeFin,
            }}
            period="month"
          />
        </div>
      )}
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
            columns={columns_config}
            rows={content}
            getRowId={(row) => row.id || Math.random().toString()}
          />
        </div>
      </AutoSkeleton>
    </>
  );
}
