import modelsFormat from "@components/GUI/DynTable/modelsFormat";

import StatusOpenIcon from '@mui/icons-material/HourglassTop';
import StatusCloseIcon from '@mui/icons-material/HourglassBottom';

const retorno = {
  config: [
    {
      inTable: false,
      field: "id_operation",
      headerName: "ID Operación",
      description: "Identificador único de la operación.",
    },
    {
      field: "status",
      headerName: "Estado",
      description: "Estado de la operación.",
      fit_content: true,
      renderInfo: {
        iconized(params, renderString) {
          let { value, row } = params;
          const strings_open = {
            texto: "Abierto",
            tooltip: "Abierto",
          };
          const strings_close = {
            texto: "Cerrado",
            tooltip: "Cerrado",
          };
          const openState = {
            ...strings_open,
            icon: <StatusOpenIcon />,
            color: "ok",
          };
          const closeState = {
            ...strings_close,
            icon: <StatusCloseIcon />,
            color: "secondary",
          };
          if (!row["end_date_operation"]) {
            return openState;
          }
          switch (value) {
            case "C":
              return closeState;
            default:
              return openState;
          }
        },
      },
    },
    {
      field: "profit",
      headerName: "Beneficio",
      description: "Ganancia obtenida de la operación.",
      ...modelsFormat.profit,
    },
    {
      inTable: false,
      field: "id_coin",
      headerName: "Moneda",
      description: "Moneda utilizada en la operación.",
    },
    {
      inTable: false,
      field: "name_coin",
      headerName: "Código",
      description: "Código de la moneda.",
    },
    {
      field: "price_buy",
      headerName: "Compra",
      description: "Precio de compra de la moneda en USDC.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "price_sell",
      headerName: "Venta",
      description: "Precio de venta de la moneda.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "total_quantity",
      headerName: "Cantidad",
      description: "Cantidad total de la moneda en la operación.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "total_bought",
      headerName: "Comprado",
      description: "Cantidad comprada de la moneda.",
      ...modelsFormat.currentUSDT,
    },
    {
      field: "total_sold",
      headerName: "Vendido",
      description: "Cantidad vendida de la moneda.",
      ...modelsFormat.currentUSDT,
    },
    {
      inTable: false,
      field: "user_id",
      headerName: "Usuario",
      description: "Identificador del usuario que realizó la operación.",
    },
    {
      field: "initial_balance",
      headerName: "Balance inicial",
      description: "Saldo disponible antes de la operación.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "final_balance",
      headerName: "Balance final",
      description: "Saldo disponible después de la operación.",
      ...modelsFormat.currentBitcoin,
    },
    {
      field: "start_date_operation",
      headerName: "Inicio",
      description: "Fecha y hora en que comenzó la operación.",
      ...modelsFormat.datetime,
    },
    {
      field: "end_date_operation",
      headerName: "Fin",
      description: "Fecha y hora en que finalizó la operación.",
      ...modelsFormat.datetime,
    },
    {
      inTable: false,
      exclude: true,
      field: "create_date",
      headerName: "create_date",
      description: "Fecha de creación interna de la operación.",
      ...modelsFormat.datetime,
    },
    {
      field: "number_of_transactions",
      headerName: "Transacciones",
      description: "Número de transacciones realizadas.",
    },
  ],
};

export default retorno;
