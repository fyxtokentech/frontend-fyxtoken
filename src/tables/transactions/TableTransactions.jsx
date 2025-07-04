import React, { Component } from "react";

import {
  Alert,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/HighlightOff";
import PaidIcon from "@mui/icons-material/Paid";
import SellIcon from "@mui/icons-material/Sell";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ApiIcon from "@mui/icons-material/Api";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoIcon from "@mui/icons-material/Info";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { AutoSkeleton } from "@components/controls";

import { DialogSimple } from "@jeff-aporta/camaleon";
import {
  DynTable,
  genAllColumns,
  rendersTemplate,
  exclude,
} from "@jeff-aporta/camaleon";

import mock_transaction from "./mock-transaction.json";
import columns_transaction from "./columns-transaction.jsx";

import dayjs from "dayjs";
import { HTTPGET_TRANSACTIONS, HTTPGET_OPERATION_ID } from "@api";
import { showError, driverParams, IS_GITHUB } from "@jeff-aporta/camaleon";
import { Button } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

import { driverTables } from "../tables.js";

let id_operation;
let rows;
let loading = false;
let SINGLETON;

let mock_default = IS_GITHUB ? mock_transaction : [];

const driverTableTransactions = {
  getRows() {
    return rows || mock_default;
  },
  setRows(newRows) {
    rows = newRows;
  },
  findNameCoin() {
    const { name_coin } =
      driverTableTransactions.getRows().find((m) => m["name_coin"]) ?? {};
    return name_coin;
  },
  getLoading() {
    return loading;
  },
  setLoading(newLoading) {
    loading = newLoading;
    driverTableTransactions.forceUpdate();
  },
  forceUpdate() {
    if (!SINGLETON) {
      setTimeout(() => driverTableTransactions.forceUpdate(), 100);
      return;
    }
    SINGLETON.forceUpdate();
  },
};

function updateIDOperation() {
  ({ id_operation = driverParams.get("id_operation")[0] } =
    driverTables.getOperationRow() || {});
}

export default driverTables.newTable({
  name_table: driverTables.TABLE_TRANSACTIONS,
  user_id_required: true,
  paramsKeys: ["id_operation"],
  init() {
    updateIDOperation();
  },
  componentDidMount() {
    SINGLETON = this;
  },
  end_fetch() {
    driverTableTransactions.setLoading(false);
  },
  start_fetch() {
    driverTableTransactions.setLoading(true);
  },
  async prefetch({ id_operation }) {
    if (!driverTables.getOperationRow() && id_operation) {
      await HTTPGET_OPERATION_ID({
        operationID: id_operation,
        successful: ([data]) => {
          driverTables.setOperationRow(data);
          updateIDOperation();
        },
      });
    }
  },
  async fetchData({ id_operation, user_id }) {
    await HTTPGET_TRANSACTIONS({
      id_operation,
      mock_default,
      successful: (data) => {
        driverTableTransactions.setRows(data);
      },
      checkErrors: () => {
        if (!user_id) {
          return toOperation("No hay usuario seleccionado");
        }
        if (!id_operation) {
          return toOperation("No hay operación seleccionada");
        }
      },
    });

    function toOperation(msg) {
      driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
      return msg;
    }
  },
  render() {
    const {
      useOperation = true,
      showDateRangeControls = false,
      pretable,
      data,
      columns_config = columns_transaction(),
      ...rest
    } = this.props;

    const content = driverTableTransactions.getRows();

    return (
      <div className="p-relative">
        <Typography variant="caption" variant="h5" className="mt-20px">
          Transacciones
        </Typography>
        <br />
        <PrefixUseOperation
          useOperation={useOperation}
          columns_config={columns_config}
        />
        <br />
        <AutoSkeleton loading={loading} h="50vh">
          {pretable}
          <DynTable {...rest} columns={columns_config} rows={content} />
        </AutoSkeleton>
      </div>
    );
  },
});

function CaptionOperation(props) {
  return (
    <Typography
      variant="caption"
      color="secondary"
      className="mb-10px"
      {...props}
    />
  );
}

function PrefixUseOperation({ useOperation, columns_config }) {
  const name_coin = driverTableTransactions.findNameCoin();

  if (!useOperation) {
    return null;
  }
  Informacion({ columns_config });

  const loading = driverTableTransactions.getLoading();

  return (
    <>
      <div
        className="p-absolute"
        style={{ right: loading * 10 + "px", top: loading * 10 + "px" }}
      >
        <Tooltip title="Volver a operaciones" placement="left">
          <Button
            variant="contained"
            color="error"
            size="small"
            endIcon={<DisabledByDefaultIcon />}
            onClick={() =>
              driverTables.setViewTable(driverTables.TABLE_OPERATIONS)
            }
          >
            Cerrar Transacciones
          </Button>
        </Tooltip>
      </div>
      <Info />
    </>
  );

  function date2Label(date) {
    if (date.isValid()) {
      return date.format("YYYY-MM-DD HH:mm");
    }
    return "---";
  }

  function Info() {
    const rowData = (() => {
      const row = driverTables.getOperationRow();
      if (row) {
        return row;
      }
      return { id_operation: id_operation, name_coin };
    })();

    const startDate = dayjs(rowData.start_date_operation);
    const endDate = dayjs(rowData.end_date_operation);
    const startLabel = date2Label(startDate);
    const endLabel = date2Label(endDate);

    return (
      <>
        <Stack
          direction="row"
          sx={{ flexWrap: "wrap", gap: "15px" }}
          className="mb-10px"
        >
          <AutoSkeleton loading={loading} w="60%">
            <Chip
              icon={<AccountTreeIcon />}
              label={`CLUSTER: ${rowData.id_operation}`}
              size="small"
            />
          </AutoSkeleton>
          <AutoSkeleton loading={loading} w="60%">
            <Chip
              icon={<MonetizationOnIcon />}
              label={`Moneda: ${rowData.name_coin}`}
              size="small"
            />
          </AutoSkeleton>
          <Chip
            icon={<PaidIcon />}
            label={`Invertido: ${
              rowData.total_bought?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "0.00"
            } USDC`}
            size="small"
          />
          <Chip
            icon={<SellIcon />}
            label={`Vendido: ${
              rowData.total_sold?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "0.00"
            } USDC`}
            size="small"
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={`Periodo: ${startLabel} / ${endLabel}`}
            size="small"
          />
          <Chip
            icon={<ApiIcon />}
            label={`API: ${rowData.name_platform}`}
            size="small"
          />
        </Stack>
      </>
    );
  }
}

function Informacion({ columns_config }) {
  columns_config.push({
    field: Math.random().toString(36).replace("0.", "opns-"),
    headerName: "Información",
    sortable: false,
    renderCell: (params) => {
      const { row } = params;
      return (
        <div style={{ textAlign: "center" }}>
          <DialogSimple
            placement="left"
            button_text="Listo"
            variant="div"
            text={
              <TableContainer component={Paper} style={{ width: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Propiedad</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exclude(columns_config).map((column, i) => {
                      const { field, headerName } = column;
                      return (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell>
                            {headerName}{" "}
                            <Typography variant="caption" color="secondary">
                              ({field})
                            </Typography>
                          </TableCell>
                          <TableCell>{row[field]}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            }
            title_text="Información"
          >
            <Tooltip placement="left" title="Información">
              <Paper
                className="circle d-center"
                style={{ width: "30px", height: "30px" }}
              >
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </Paper>
            </Tooltip>
          </DialogSimple>
        </div>
      );
    },
  });
}
