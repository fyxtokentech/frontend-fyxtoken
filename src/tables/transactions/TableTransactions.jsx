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

import {
  DynTable,
  InfoDialog,
  genAllColumns,
  rendersTemplate,
  showError,
  driverParams,
  IS_GITHUB,
  DriverComponent,
  WaitSkeleton,
  columnsExclude,
  getSecondaryColor,
} from "@jeff-aporta/camaleon";

import { driverTables, newTable } from "../tables.js";

import mock_transaction from "./mock-transaction.json";
import columns_transaction from "./columns-transaction.jsx";

import dayjs from "dayjs";
import { HTTPGET_TRANSACTIONS, HTTPGET_OPERATION_ID } from "@api";
import { Button } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

const driverTableTransactions = DriverComponent({
  idDriver: "table-transactions",
  tableTransactions: {},
  tableData: {
    value: IS_GITHUB ? mock_transaction : [],
  },
  nameCoin: {
    find() {
      const { name_coin } =
        this.getTableData().find((m) => m["name_coin"]) ?? {};
      return name_coin;
    },
  },
  idOperation: {
    nameParam: "id_operation",
    update({ setValue }) {
      const {
        id_operation = this.getIdOperation(), //
      } = driverTables.getOperationRow() || {};
      setValue(id_operation);
    },
  },
  loading: {
    value: false,
  },
});

export default driverTables.newTable({
  name_table: driverTables.TABLE_TRANSACTIONS,
  user_id_required: true,
  paramsKeys: ["id_operation"],
  allParamsRequiredToFetch: true,
  driver: driverTableTransactions,
  init({ driver }) {
    console.log(driver);
    driver.updateIdOperation();
  },
  componentDidMount() {
    driverTables.addLinkOperationRow(this);
  },
  componentWillUnmount() {
    driverTables.removeLinkOperationRow(this);
  },
  async prefetch({ id_operation }, { driver }) {
    if (!driverTables.getOperationRow() && id_operation) {
      await HTTPGET_OPERATION_ID({
        operationID: id_operation,
        successful: ([data]) => {
          driverTables.setOperationRow(data);
          driver.updateIdOperation();
        },
      });
    }
  },
  async fetchData({ id_operation, user_id }, { driver }) {
    await HTTPGET_TRANSACTIONS({
      id_operation,
      successful: (data) => {
        driver.setTableData(data);
      },
      failure() {
        driver.setTableData([]);
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
  render({ driver, data }) {
    const {
      useOperation = true,
      pretable,
      columns_config = columns_transaction(),
      ...rest
    } = this.props;

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
        <WaitSkeleton loading={driver.getLoading()}>
          {pretable}
          <DynTable {...rest} columns={columns_config} rows={data} />
        </WaitSkeleton>
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
            className="text-hide-unhover-container"
            variant="contained"
            color="toRed50"
            size="small"
            onClick={() =>
              driverTables.setViewTable(driverTables.TABLE_OPERATIONS)
            }
          >
            <DisabledByDefaultIcon fontSize="small" />
            <div className="text-hide-unhover nowrap">
              &nbsp;<small>Cerrar Transacciones</small>
            </div>
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
    const rowData = driverTables.getOperationRow();
    const startLabel = rowData
      ? date2Label(dayjs(rowData.start_date_operation))
      : "---";
    const endLabel = rowData
      ? date2Label(dayjs(rowData.end_date_operation))
      : "---";

    let {
      id_operation = "---",
      name_coin = "---",
      name_platform = "---",
      total_bought = 0,
      total_sold = 0,
    } = rowData || {};
    [total_bought, total_sold] = [total_bought, total_sold].map(
      (v) =>
        v.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? "0.00"
    );

    return (
      <>
        <Stack
          direction="row"
          sx={{ flexWrap: "wrap", gap: "15px" }}
          className="mb-10px"
        >
          <WaitSkeleton loading={driverTableTransactions.getLoading()}>
            <Chip
              icon={<AccountTreeIcon />}
              label={`CLUSTER: ${id_operation}`}
              size="small"
            />
          </WaitSkeleton>
          <WaitSkeleton loading={driverTableTransactions.getLoading()}>
            <Chip
              icon={<MonetizationOnIcon />}
              label={`Moneda: ${name_coin}`}
              size="small"
            />
          </WaitSkeleton>
          <Chip
            icon={<PaidIcon />}
            label={`Invertido: ${total_bought} USDC`}
            size="small"
          />
          <Chip
            icon={<SellIcon />}
            label={`Vendido: ${total_sold} USDC`}
            size="small"
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={`Periodo: ${startLabel} / ${endLabel}`}
            size="small"
          />
          <Chip
            icon={<ApiIcon />}
            label={`API: ${name_platform}`}
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
    extra: true,
    renderCell: (params) => {
      const { row } = params;
      return (
        <div className="layer fill d-center">
          <InfoDialog
            isButton={true}
            dialogDescription={
              <TableContainer component={Paper} style={{ width: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: `rgba(${getSecondaryColor()
                          .rgb()
                          .array()
                          .map((v) => parseInt(v))
                          .join(",")}, 0.5)`,
                      }}
                    >
                      <TableCell>Propiedad</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {columnsExclude(columns_config)
                      .filter((x) => !x.extra)
                      .map((column, i) => {
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
                              {headerName}
                              <br />
                              <Typography
                                variant="caption"
                                color="contrastPaper"
                              >
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
          />
        </div>
      );
    },
  });
}
