import React, { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { DynTable, WaitSkeleton } from "@jeff-aporta/camaleon";
import { DateRangeControls } from "@components/controls";
import dayjs from "dayjs";
import { HTTPGET_WITHDRAWALS } from "@api";

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

    setLoading(true);
    const startDate = dateRangeInit.format("YYYY-MM-DD");
    const endDate = dateRangeFin.format("YYYY-MM-DD");
    const data = await HTTPGET_WITHDRAWALS({
      willStart: (props) => setLoading(true),
      willEnd: (props) => setLoading(false),
      user_id,
      start_date: startDate,
      end_date: endDate,
      mock_default: mock_withdrawals,
    });
    setApiData(data);
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
      <WaitSkeleton loading={loading}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DynTable
            columns={columns_config}
            rows={content}
            getRowId={(row) => row.id || Math.random().toString()}
          />
        </div>
      </WaitSkeleton>
    </>
  );
}
