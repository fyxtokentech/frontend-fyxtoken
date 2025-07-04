import React from "react";
import { getModelsFormat } from "@jeff-aporta/camaleon";

// Importar iconos necesarios
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline"; // Para Completed
import StatusPendingIcon from "@mui/icons-material/HourglassTop"; // Para Pending
import StatusErrorIcon from "@mui/icons-material/UnpublishedOutlined"; // Para Failed (según tu especificación)
import BuyIcon from "@mui/icons-material/SaveAlt";

const columns_purchases = [
  // --- Columnas con Iconos / Formato Especial Primero ---
  {
    field: "status",
    headerName: "Estado Compra",
    description:
      "Estado actual de la orden de compra (Completada, Pendiente, Fallida).",
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
  {
    field: "type",
    headerName: "Tipo",
    description: "Tipo de operación (siempre Compra en esta tabla).",
    renderInfo: {
      label: {
        BUY: { text: "Compra", icon: <BuyIcon />, color: "ok" }, // Usa DownloadIcon
      },
    },
    inTable: false, // innecesario mostrarse ya que siempre será compra
  },

  // --- Otras Columnas Visibles ---
  {
    field: "pair",
    headerName: "Par",
    description: "Par de divisas comprado.",
  },
  {
    field: "amount_base",
    headerName: "Cantidad Comprada",
    description: "Cantidad de la moneda base comprada.",
    ...getModelsFormat().numberGeneral, // Usando numberGeneral según especificación
  },
  {
    field: "price",
    headerName: "Precio Compra",
    description: "Precio por unidad de la moneda base al momento de la compra.",
    ...getModelsFormat().currentCoin,
  },
  {
    field: "amount_quote",
    headerName: "Total Pagado",
    description: "Cantidad total de la moneda cotizada pagada por la compra.",
    ...getModelsFormat().currentCoin,
  },
  {
    field: "user_id",
    headerName: "ID Usuario",
    description: "Identificador del usuario que realizó la compra.",
  },
  {
    field: "execution_date",
    headerName: "Fecha Ejecución",
    description: "Fecha y hora en que se completó o falló la compra.",
    ...getModelsFormat().datetime,
  },

  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID Compra",
    description: "Identificador único de la orden de compra.",
    inTable: false, // Oculto según especificación
  },
  {
    field: "create_date", // Renombrado de 'date' si existiera
    headerName: "Fecha SQL",
    description: "Fecha SQL.",
    exclude: true, // Excluido según especificación
    inTable: false, // Asegurarse que no se muestre
    ...getModelsFormat().datetime,
  },
  {
    field: "name_coin",
    headerName: "Moneda Cotización",
    description: "Moneda utilizada para el pago (USDT).",
    inTable: false, // Oculto según especificación
  },
  {
    field: "id_coin",
    headerName: "ID Moneda Cot.",
    description: "Identificador de la moneda de cotización (USDT).",
    inTable: false, // Oculto según especificación
  },
];

export default columns_purchases;
