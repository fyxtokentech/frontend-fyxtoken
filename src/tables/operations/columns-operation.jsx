import { getModelsFormat } from "@jeff-aporta/camaleon";

import StatusOpenIcon from "@mui/icons-material/HourglassTop";
import StatusCloseIcon from "@mui/icons-material/HourglassBottom";

export default () => [
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
        let { value, row } = params ?? {};
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
        if (row && !row["end_date_operation"]) {
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
    fit_content: true,
    description: "Ganancia obtenida de la operación.",
    ...getModelsFormat().profit_op,
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
    space_between: true,
    description: "Precio de compra de la moneda en USDC.",
    ...getModelsFormat().currentCoin,
  },
  {
    field: "price_sell",
    headerName: "Venta",
    description: "Precio de venta de la moneda.",
    ...getModelsFormat().currentCoin,
  },
  {
    field: "total_quantity",
    headerName: "Cantidad",
    description: "Cantidad total de la moneda en la operación.",
    ...getModelsFormat().currentCoin,
  },
  {
    field: "total_bought",
    headerName: "Comprado",
    description: "Cantidad comprada de la moneda.",
    ...getModelsFormat().currentSufix("symbolpar_buy"),
  },
  {
    field: "total_sold",
    headerName: "Vendido",
    description: "Cantidad vendida de la moneda.",
    ...getModelsFormat().currentSufix("symbolpar_sell"),
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
    ...getModelsFormat().currentCoin,
  },
  {
    field: "final_balance",
    headerName: "Balance final",
    description: "Saldo disponible después de la operación.",
    ...getModelsFormat().currentCoin,
  },
  {
    field: "start_date_operation",
    headerName: "Inicio",
    description: "Fecha y hora en que comenzó la operación.",
    ...getModelsFormat().dateFormat2,
  },
  {
    field: "end_date_operation",
    headerName: "Fin",
    description: "Fecha y hora en que finalizó la operación.",
    ...getModelsFormat().dateFormat2,
  },
  {
    inTable: false,
    exclude: true,
    field: "create_date",
    headerName: "create_date",
    description: "Fecha de creación interna de la operación.",
  },
  {
    field: "number_of_transactions",
    headerName: "Cantidad de transacciones.",
    description: "Número de transacciones realizadas.",
    inTable: false,
  },
];
