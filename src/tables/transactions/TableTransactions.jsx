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
  ButtonShyText,
} from "@jeff-aporta/camaleon";

import { driverTables, newTable } from "../tables.js";

import mock_transaction from "./mock-transaction.json";
import columns_transaction from "./columns-transaction.jsx";

import dayjs from "dayjs";
import { Button } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

import { driverTableTransactions } from "./TableTransactions.driver.js";

export default driverTables.newTable({
  name_table: driverTables.TABLE_TRANSACTIONS,
  user_id_required: true,
  paramsKeys: ["id_operation"],
  allParamsRequiredToFetch: true,
  driver: driverTableTransactions,
  init({ driver }) {
    driver.updateIdOperation();
  },
  componentDidMount() {
    driverTables.addLinkOperationRow(this);
  },
  componentWillUnmount() {
    driverTables.removeLinkOperationRow(this);
  },
  async prefetch({ id_operation }) {
    await driverTableTransactions.loadOperation({ id_operation });
  },
  async fetchData({ id_operation, user_id }) {
    await driverTableTransactions.loadData({ id_operation, user_id });
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
        <ButtonShyText
          tooltip="Volver a operaciones"
          color="close"
          onClick={(e) => {
            driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
          }}
          startIcon={<DisabledByDefaultIcon fontSize="small" />}
        >
          Cerrar transacciones
        </ButtonShyText>
      </div>
      <Info />
    </>
  );

  function Info() {
    const RETURN = class extends React.Component {
      componentDidMount() {
        driverTables.addLinkOperationRow(this);
        driverTableTransactions.addLinkLoadingOperation(this)
      }
      componentWillUnmount() {
        driverTables.removeLinkOperationRow(this);
        driverTableTransactions.removeLinkLoadingOperation(this)
      }

      render() {
        const operationRow = driverTables.getOperationRow();
        const startLabel = driverTables.mapCaseOperationRow("label", "start")
        const endLabel = driverTables.mapCaseOperationRow("label", "end");

        let {
          id_operation = driverTables.NOT_VALUE,
          name_coin = driverTables.NOT_VALUE,
          name_platform = driverTables.NOT_VALUE,
          total_bought = 0,
          total_sold = 0,
        } = operationRow || {};
        [total_bought, total_sold] = [total_bought, total_sold].map(
          (v) =>
            v.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? "0.00"
        );

        return (
          <WaitSkeleton loading={driverTableTransactions.getLoadingOperation()}>
            <Stack
              direction="row"
              sx={{ flexWrap: "wrap", gap: "15px" }}
              className="mb-10px"
            >
              <Chip
                icon={<AccountTreeIcon />}
                label={`CLUSTER: ${id_operation}`}
                size="small"
              />
              <Chip
                icon={<MonetizationOnIcon />}
                label={`Moneda: ${name_coin}`}
                size="small"
              />
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
                label={`Periodo: ${startLabel} | ${endLabel}`}
                size="small"
              />
              <Chip
                icon={<ApiIcon />}
                label={`API: ${name_platform}`}
                size="small"
              />
            </Stack>
          </WaitSkeleton>
        );
      }
    };
    return <RETURN />;
  }
}

function findByField(columns_config, field) {
  return columns_config.find((x) => x.field == field) || {};
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
            dialogDescription={() => {
              return (
                <TableContainer component={Paper} style={{ width: "100%" }}>
                  <Table>
                    <Headers />
                    <BodyContent />
                  </Table>
                </TableContainer>
              );

              function Headers() {
                return (
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: `d1.main`,
                      }}
                    >
                      <TableCell>Propiedad</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                );
              }

              function BodyContent() {
                return (
                  <TableBody>
                    {Object.entries(row)
                      .filter(([field]) => {
                        return !findByField(columns_config, field).extra;
                      })
                      .map(([field, value], i) => {
                        const { headerName } = findByField(
                          columns_config,
                          field
                        );
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
                              {headerName || field}
                              <br />
                              <Typography variant="caption" color="secondary">
                                ({field})
                              </Typography>
                            </TableCell>
                            <TableCell>{value}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                );
              }
            }}
          />
        </div>
      );
    },
  });
}
