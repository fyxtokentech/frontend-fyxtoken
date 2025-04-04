import React from "react";
import modelsFormat from "@components/GUI/DynTable/modelsFormat";

// No hay iconos específicos de estado para posiciones abiertas generalmente,
// pero podríamos añadir uno para el activo si fuera necesario.

const columns_investments = [
  // --- Columnas Principales (Visibles - Ordenadas por Relevancia) ---
  {
    field: "profit", // Cómo voy (ganancia/pérdida no realizada)
    headerName: "Beneficio proyectado",
    description: "Ganancia o pérdida potencial si la posición se cerrara ahora.",
    ...modelsFormat.profit, // Formato beneficio/pérdida
  },
  {
    field: "base_asset_symbol", // 1. Qué activo es
    headerName: "Activo",
    description: "Símbolo del activo base de la posición (ej. BTC).",
  },
  {
    field: "amount_base", // 2. Cuánto tengo
    headerName: "Cantidad",
    description: "Cantidad del activo base que se posee.",
    ...modelsFormat.numberGeneral,
  },
  {
    field: "position_value", // 3. Cuánto vale ahora
    headerName: "Valor Posición",
    description: "Valor total actual de la posición (Cantidad * Precio Actual).",
    ...modelsFormat.currentBitcoin, // Formato moneda
  },
  {
    field: "current_price", // 5. Precio actual de mercado
    headerName: "Precio Actual",
    description: "Precio de mercado actual del activo.",
    ...modelsFormat.currentBitcoin, // Formato moneda
  },
  {
    field: "purchase_price", // 6. A cuánto compré (promedio)
    headerName: "Precio Compra",
    description: "Precio promedio al que se adquirió el activo.",
    ...modelsFormat.currentBitcoin, // Formato moneda
  },
  {
    field: "pair", // 7. Par de trading asociado
    headerName: "Par",
    description: "Par de trading asociado a la posición (ej. BTC/USDT).",
  },
  {
    field: "create_date", // 8. Fecha relevante
    headerName: "Fecha",
    description: "Fecha relevante de la posición (ej. apertura o última modificación).",
    ...modelsFormat.datetime,
    inTable: false,
    exclude: true, // Decide si quieres excluirla o no
  },
   {
    field: "user_id", // 9. Dueño (menos relevante en vista personal)
    headerName: "ID Usuario",
    description: "Identificador del usuario propietario de la posición.",
  },


  // --- Columnas Ocultas / Internas ---
  {
    field: "id",
    headerName: "ID Posición",
    description: "Identificador único de la posición.",
    inTable: false,
  },
  {
    field: "name_coin",
    headerName: "Moneda Valoración",
    description: "Moneda en la que se valora la posición (USDT).",
    inTable: false,
  },
  {
    field: "id_coin",
    headerName: "ID Moneda Val.",
    description: "Identificador de la moneda de valoración.",
    inTable: false,
  },
];

export default columns_investments;
