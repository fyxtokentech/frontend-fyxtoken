import React from "react";

import modelsFormat from "@components/GUI/DynTable/modelsFormat";

// Importar iconos necesarios
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline"; // Para Filled
import StatusErrorIcon from "@mui/icons-material/CancelOutlined";      // Para Canceled (usando Cancel)
import SellIcon from "@mui/icons-material/TrendingDown";        // Para SELL type

const columns_sales_orders = [ 
  // --- Columnas con Iconos / Formato Especial Primero ---
  {
    field: "status",
    headerName: "Estado Venta", 
    description: "Estado actual de la orden de venta.", 
    renderInfo: {
      label: {
        Filled: { text: "Completada", icon: <StatusOkIcon />, color: "ok" },
        Canceled: { text: "Cancelada", icon: <StatusErrorIcon />, color: "error" },
      },
    },
  },
  {
    field: "type",
    headerName: "Tipo", 
    description: "Tipo de operación (siempre Venta en esta tabla).", 
    renderInfo: {
      label: {
        SELL: { text: "Venta", icon: <SellIcon />, color: "error" },
      },
    },
  },
  {
    field: "profit",
    headerName: "Beneficio Venta", 
    description: "Beneficio o pérdida realizado en la venta.", 
    ...modelsFormat.profit,
  },

  // --- Otras Columnas Visibles ---
  {
    field: "pair",
    headerName: "Par", 
    description: "Par de divisas vendido (ej. BTC/USDT).", 
  },
  {
    field: "amount_base",
    headerName: "Cantidad Vendida", 
    description: "Cantidad de la moneda base vendida.", 
    ...modelsFormat.numberGeneral,
  },
  {
    field: "price", 
    headerName: "Precio Venta", 
    description: "Precio al que se ejecutó o intentó ejecutar la venta.", 
    ...modelsFormat.currentBitcoin,
  },
  {
    field: "amount_quote",
    headerName: "Total Recibido", 
    description: "Cantidad total de la moneda cotizada recibida por la venta.", 
    ...modelsFormat.currentBitcoin,
  },
  {
    field: "user_id",
    headerName: "ID Usuario",
    description: "Identificador del usuario que realizó la venta.", 
  },
  {
    field: "purchase_date",
    headerName: "Fecha Compra", 
    description: "Fecha de compra original del activo vendido.", 
    ...modelsFormat.datetime,
  },
  {
    field: "execution_date",
    headerName: "Fecha Cierre", 
    description: "Fecha y hora en que se completó o canceló la venta.", 
    ...modelsFormat.datetime,
  },

  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID Orden Venta", 
    description: "Identificador único de la orden de venta.", 
    inTable: false,
  },
  {
    field: "order_date",
    headerName: "Fecha Orden Venta", 
    description: "Fecha y hora en que se creó la orden de venta.", 
    ...modelsFormat.datetime,
    inTable: false,
    exclude: true,
  },
  {
    field: "name_coin",
    headerName: "Moneda Cotización", 
    description: "Moneda en la que se expresa el precio y el beneficio.", 
    inTable: false,
  },
  {
    field: "id_coin",
    headerName: "ID Moneda Cot.", 
    description: "Identificador de la moneda de cotización.", 
    inTable: false,
  },
];

export default columns_sales_orders; 
