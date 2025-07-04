import React from "react";
import { getModelsFormat } from "@jeff-aporta/camaleon";

// Importar iconos necesarios
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline";
import StatusPendingIcon from "@mui/icons-material/HourglassTop";
import StatusErrorIcon from "@mui/icons-material/UnpublishedOutlined"; // Icono de error especificado

const columns_deposits = [
  // --- Columnas con Iconos / Formato Especial Primero ---
  {
    field: "status", // 1. Estado (más crítico para el usuario)
    headerName: "Estado",
    description: "Estado actual del depósito.",
    renderInfo: {
      label: {
        Completed: { text: "Bien", icon: <StatusOkIcon />, color: "ok" },
        Pending: {
          text: "Pendiente",
          icon: <StatusPendingIcon />,
          color: "warning",
        },
        Failed: { text: "Error", icon: <StatusErrorIcon />, color: "error" },
      },
    },
  },

  // --- Otras Columnas Visibles (Ordenadas por Relevancia) ---
  {
    field: "amount", // 2. Cuánto se depositó
    headerName: "Monto",
    description: "Cantidad de moneda depositada.",
    ...getModelsFormat().currentCoin, // Formato de moneda (usando el existente como referencia)
  },
  {
    field: "deposit_date", // Nueva columna de fecha de depósito
    headerName: "Fecha de Depósito",
    description: "Fecha y hora en que se procesó efectivamente el depósito.",
    ...getModelsFormat().datetime,
  },
  {
    field: "user_id", // 3. Quién lo hizo (relevante si es vista admin)
    headerName: "ID Usuario",
    description: "Identificador del usuario que realizó el depósito.",
    // No necesita formato especial, es un string
  },

  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID Depósito",
    description: "Identificador único del registro de depósito.",
    inTable: false,
  },
  // Columna currency eliminada
  {
    field: "name_coin",
    headerName: "Moneda Depósito",
    description: "Moneda depositada.",
    inTable: false,
  },
  {
    field: "id_coin",
    headerName: "ID Moneda",
    description: "Identificador interno de la moneda depositada.",
    inTable: false,
  },
  {
    field: "create_date", // Renombrado de 'date' si existía
    headerName: "Fecha Creación",
    description:
      "Fecha y hora en que se registró el depósito (generado automáticamente).",
    inTable: false, // Oculta porque 'exclude: true'
    exclude: true, // No relevante para el usuario final
    ...getModelsFormat().datetime, // Formato de fecha y hora
  },
];

export default columns_deposits;
