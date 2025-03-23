import modelsFormat from "@views/lab/modelsFormat";

import SellIcon from "@mui/icons-material/FileUploadOutlined";
import BuyIcon from "@mui/icons-material/FileDownloadOutlined";
import CandleIcon from "@mui/icons-material/CandlestickChartOutlined";
import RSIIcon from "@mui/icons-material/QueryStatsOutlined";
import StatusOkIcon from "@mui/icons-material/CheckCircleOutline";
import StatusErrorIcon from "@mui/icons-material/UnpublishedOutlined";

const retorno = {
  config: [
    {
      inTable: false,
      field: "idtransaction",
      headerName: "ID Transacción",
      description: "Identificador único de la transacción.",
    },
    {
      field: "status_transaction",
      headerName: "Estado",
      description: "Resultado de la transacción (Éxito o Error).",
      renderInfo: {
        label: {
          S: { text: "Bien", icon: <StatusOkIcon />, color: "ok" },
          F: { text: "Error", icon: <StatusErrorIcon />, color: "error" },
        },
      },
    },
    {
      field: "profit",
      headerName: "Beneficio",
      description: "Ganancia obtenida.",
      ...modelsFormat.profit,
    },
    {
      field: "origin_transaction",
      headerName: "Origen",
      description: "Indicador del origen de la señal.",
      renderInfo: {
        label: {
          C: { text: "Candle", icon: <CandleIcon />, color: "secondary" },
          R: { text: "RSI", icon: <RSIIcon />, color: "secondary" },
        },
      },
    },
    {
      field: "operation",
      headerName: "Operación",
      description: "Tipo de operación realizada.",
      renderInfo: {
        label: {
          BUY: { text: "Compra", icon: <SellIcon />, color: "secondary" },
          SELL: { text: "Venta", icon: <BuyIcon />, color: "ok" },
        },
      },
    },
    {
      inTable: false,
      field: "idcoin",
      headerName: "Moneda",
      description: "Moneda usada en la transacción.",
    },
    {
      inTable: false,
      field: "name_coin",
      headerName: "Código",
      description: "Código de la moneda.",
    },
    {
      field: "price",
      headerName: "Precio",
      description: "Precio por unidad.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "rsi",
      headerName: "RSI",
      description: "Índice de Fuerza Relativa al momento de operar.",
      ...modelsFormat.numberGeneral,
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      description: "Cantidad de moneda comprada o vendida.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "total",
      headerName: "Total",
      description: "Total de la operación.",
      ...modelsFormat.currentBitcoin,
    },
    {
      inTable: false,
      field: "operation_id",
      headerName: "operation_id",
      description: "ID interno de la operación relacionada.",
    },
    {
      inTable: false,
      field: "response_binance",
      headerName: "response_binance",
      description: "Respuesta técnica de Binance (solo interno).",
    },
    {
      inTable: false,
      exclude: true,
      field: "create_time",
      headerName: "create_time",
      description: "Fecha de creación de la transacción (solo interno).",
      ...modelsFormat.datetime,
    },
    {
      field: "limit_to_buy",
      headerName: "Límite de compra",
      description: "Límite máximo para comprar en esta transacción.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "limit_to_sell",
      headerName: "Límite de venta",
      description: "Límite máximo para vender en esta transacción.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "start_date_transaction",
      headerName: "Inicio",
      description: "Fecha y hora de inicio de la transacción.",
      ...modelsFormat.datetime,
    },
    {
      field: "end_date_transaction",
      headerName: "Final",
      description: "Fecha y hora de cierre de la transacción.",
      ...modelsFormat.datetime,
    },
  ],
};

export default retorno;
