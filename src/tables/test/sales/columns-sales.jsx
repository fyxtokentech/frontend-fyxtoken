import React from "react";
import { getModelsFormat } from "@jeff-aporta/camaleon";

// Importar iconos necesarios
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline"; // Para Completed
import StatusErrorIcon from "@mui/icons-material/UnpublishedOutlined"; // Para Failed (Error)
import SellIcon from "@mui/icons-material/ArrowUpward"; // Icono representativo para Venta (SELL)

const columns_sales = [
  // --- Columnas con Iconos / Formato Especial Primero ---
  {
    field: "status", // 1. Estado (Crítico saber si se completó, falló o está pendiente)
    headerName: "Estado",
    description: "Estado de la orden de venta.",
    renderInfo: {
      label: {
        Filled: { text: "Bien", icon: <StatusOkIcon />, color: "ok" },
        Canceled: { text: "Error", icon: <StatusErrorIcon />, color: "error" },
      },
    },
  },
  {
    field: "profit", // 2. Beneficio/Pérdida (Importante para el usuario)
    headerName: "Beneficio",
    description: "Ganancia o pérdida obtenida en la venta.",
    ...getModelsFormat().profit, // Formato especial para beneficio/pérdida
  },
  {
    inTable: false, // Oculto ya que siempre es Venta en esta tabla
    field: "type", // 3. Tipo de Operación (Aunque siempre es Venta aquí, podría tener icono)
    headerName: "Tipo",
    description: "Tipo de operación realizada.",
    renderInfo: {
      label: {
        SELL: { text: "Venta", icon: <SellIcon />, color: "ok" }, // Color 'error' puede representar 'venta' o 'rojo'
      },
    },
  },

  // --- Otras Columnas Visibles (Ordenadas por Relevancia) ---
  {
    field: "pair", // 4. Qué se vendió (Fundamental)
    headerName: "Par",
    description: "Par de divisas vendido (ej. BTC/USDT).",
  },
  {
    field: "amount_base", // 5. Cuánto se vendió del activo base
    headerName: "Cantidad Vendida",
    description: "Cantidad del activo base que se vendió.",
    ...getModelsFormat().numberGeneral, // Formato número general
  },
  {
    field: "amount_quote", // 6. Cuánto se recibió de la moneda cotización
    headerName: "Monto Recibido",
    description:
      "Cantidad de la moneda de cotización (USDT) recibida por la venta.",
    ...getModelsFormat().currentCoin, // Formato moneda
  },
  {
    field: "execution_price", // 7. A qué precio se ejecutó
    headerName: "Precio Venta",
    description: "Precio unitario al que se ejecutó la orden de venta.",
    ...getModelsFormat().currentCoin, // Formato moneda
  },
  {
    field: "execution_date", // 8. Cuándo se ejecutó
    headerName: "Fecha Ejecución",
    description: "Fecha y hora en que se completó la orden de venta.",
    ...getModelsFormat().datetime, // Formato fecha y hora
  },
  {
    field: "user_id", // 9. ID Usuario (Menos relevante en la vista personal)
    headerName: "ID Usuario",
    description: "Identificador del usuario que realizó la venta.",
  },

  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID Venta",
    description: "Identificador único de la orden de venta.",
    inTable: false, // No mostrar ID interno
  },
  {
    field: "create_date", // Renombrado de 'date'
    headerName: "Fecha SQL",
    description: "Fecha SQL.",
    exclude: true, // No relevante para el usuario
    inTable: false, // Asegurarse que no se muestre
    ...getModelsFormat().datetime,
  },
  {
    field: "name_coin",
    headerName: "Moneda Cotización",
    description: "Moneda de cotización utilizada.",
    inTable: false, // Implícito por ser USDT siempre
  },
  {
    field: "id_coin",
    headerName: "ID Moneda Cot.",
    description: "Identificador de la moneda de cotización.",
    inTable: false, // ID interno no relevante
  },
];

export default columns_sales;
