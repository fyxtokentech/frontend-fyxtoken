import React, { useState, useEffect } from "react";
import { DynTable, WaitSkeleton } from "@jeff-aporta/camaleon";

import columns_deposits from "./columns-deposits.jsx";
import mock_deposits from "./mock-deposits.json";
import { Box } from "@mui/material";
import { DateRangeControls } from "@components/controls"; // Asumiendo que quieres controles
import dayjs from "dayjs";

export default function TableDeposits({
  data = mock_deposits,
  columns_config = columns_deposits,
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(
    dayjs().subtract(7, "day")
  ); // Rango por defecto
  const [dateRangeFin, setDateRangeFin] = useState(dayjs());

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Aquí podrías filtrar `data` basado en dateRangeInit y dateRangeFin si fuera necesario
      setLoading(false);
    }, 1500); // Simula un delay de red
    return () => clearTimeout(timer);
  }, [dateRangeInit, dateRangeFin, data]); // Dependencias

  return (
    <Box>
      {/* Controles de Rango de Fecha (opcional, quitar si no se necesita) */}
      <DateRangeControls
        {...{
          loading,
          dateRangeInit,
          setDateRangeInit,
          dateRangeFin,
          setDateRangeFin,
        }}
      />

      {/* Esqueleto mientras carga */}
      <WaitSkeleton loading={loading}>
        <DynTable
          rows={data} // Usar los datos (mock o pasados por props)
          columns={columns_config} // Usar la configuración de columnas
          {...rest} // Pasar otras props como filtros, etc.
        />
      </WaitSkeleton>
    </Box>
  );
}
