import React from "react";
import { getModelsFormat } from "@jeff-aporta/camaleon";

// Importar iconos necesarios
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline";
import StatusPendingIcon from "@mui/icons-material/HourglassTop";
import StatusProcessingIcon from "@mui/icons-material/Sync";
import StatusErrorIcon from "@mui/icons-material/UnpublishedOutlined";

const columns_withdrawals = [
  // --- Columnas con Iconos / Formato Especial Primero ---
  {
    field: "status", // 1. Estado (más crítico para el usuario)
    headerName: "Estado",
    description: "Estado actual del retiro.",
    renderInfo: {
      label: {
        Completed: { text: "Completado", icon: <StatusOkIcon />, color: "ok" },
        Pending: {
          text: "Pendiente",
          icon: <StatusPendingIcon />,
          color: "warning",
        },
        Processing: {
          text: "Procesando",
          icon: <StatusProcessingIcon />,
          color: "info",
        },
        Failed: { text: "Fallido", icon: <StatusErrorIcon />, color: "error" },
      },
    },
  },

  // --- Otras Columnas Visibles (Ordenadas por Relevancia) ---
  {
    field: "amount", // 2. Cuánto se retiró
    headerName: "Monto",
    description: "Cantidad de moneda retirada.",
    ...getModelsFormat().currentCoin, // Formato de moneda
  },
  {
    field: "fee", // 3. Comisión por el retiro
    headerName: "Comisión",
    description: "Comisión cobrada por el retiro.",
    ...getModelsFormat().currentCoin, // Formato de moneda
  },
  {
    field: "withdrawal_date", // 4. Fecha de procesamiento
    headerName: "Fecha de Retiro",
    description: "Fecha y hora en que se procesó efectivamente el retiro.",
    ...getModelsFormat().dateTime,
  },
  {
    field: "destination_address", // 5. Dirección de destino
    headerName: "Dirección Destino",
    description: "Dirección de la billetera a la que se envió el retiro.",
    width: 280,
    renderInfo: {
      truncate: true, // Truncar el texto si es muy largo
    },
  },
  {
    field: "transaction_hash", // 6. Hash de la transacción
    headerName: "Hash de Transacción",
    description: "Identificador único de la transacción en la blockchain.",
    width: 280,
    renderInfo: {
      truncate: true, // Truncar el texto si es muy largo
    },
  },
  {
    field: "user_id", // 7. Quién lo hizo (relevante si es vista admin)
    headerName: "ID Usuario",
    description: "Identificador del usuario que realizó el retiro.",
    // No necesita formato especial, es un string
  },

  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID Retiro",
    description: "Identificador único del registro de retiro.",
    inTable: false,
  },
  {
    field: "name_coin",
    headerName: "Moneda",
    description: "Moneda retirada.",
    inTable: false,
  },
  {
    field: "id_coin",
    headerName: "ID Moneda",
    description: "Identificador interno de la moneda retirada.",
    inTable: false,
  },
  {
    field: "create_date",
    headerName: "Fecha Creación",
    description: "Fecha y hora en que se registró la solicitud de retiro.",
    inTable: false,
    ...getModelsFormat().dateTime,
  },
];

export default columns_withdrawals;
