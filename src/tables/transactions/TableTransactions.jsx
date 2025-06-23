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

import mock_operation from "@tables/operations/mock-operation.json";
import columns_operation from "@tables/operations/columns-operation.jsx";
import dayjs from "dayjs";
import { HTTPGET_TRANSACTIONS, HTTPGET_OPERATION_ID } from "@api";
import { showError, driverParams } from "@jeff-aporta/camaleon";
import { Button } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

let id_operation;
let _data_;

function updateIDOperation() {
  ({ id_operation = driverParams.get("id_operation") } =
    window["operation-row"] ?? {});
}

export default class TableTransactions extends Component {
  constructor(props) {
    super(props);
    updateIDOperation();
    _data_ = null;
    this.state = {
      loading: true,
      apiData: [],
      error: null,
    };
  }

  componentDidMount() {
    const { setViewTable } = this.props;
    const { IS_GITHUB_IO } = global;
    (async () => {
      const { user_id } = window["currentUser"] ?? {};
      const failure = (error, ...rest) => {
        showError(error, ...rest);
        this.setState({ error });
      };
      if (!window["operation-row"] && id_operation) {
        await HTTPGET_OPERATION_ID({
          operationID: id_operation,
          success: ([data]) => {
            window["operation-row"] = data;
            updateIDOperation();
          },
          failure,
        });
      }

      if (!user_id || !id_operation) {
        showError("No hay usuario ni operación seleccionada");
        if (!id_operation) {
          const t = "operations";
          setTimeout(() => setViewTable(t), 2000);
        }
        return;
      }

      await HTTPGET_TRANSACTIONS({
        id_operation,
        mock_default: IS_GITHUB_IO ? mock_transaction : [],
        successful: (data) => {
          _data_ ??= data;
        },
        failure,
      });

      this.setState({ apiData: _data_ ?? this.state.apiData, loading: false });
    })();
  }

  render() {
    const {
      useOperation = true,
      operationTrigger,
      setViewTable,
      showDateRangeControls = false,
      pretable,
      data,
      columns_config: propColumns,
      ...rest
    } = this.props;
    const { loading, apiData, error } = this.state;
    const { IS_GITHUB_IO } = global;
    const content = apiData ?? (IS_GITHUB_IO ? mock_transaction : []).content;
    const columns_config = propColumns ?? [...columns_transaction.config];
    const { name_coin } = content.find((m) => m["name_coin"]) ?? {};

    return (
      <div className="p-relative">
        <Typography variant="caption" variant="h5" className="mt-20px">
          Transacciones
        </Typography>
        <br />
        <PrefixUseOperation
          useOperation={useOperation}
          setViewTable={setViewTable}
          columns_config={columns_config}
          loading={loading}
          operationTrigger={operationTrigger}
          name_coin={name_coin}
        />
        <br />
        <AutoSkeleton loading={loading} h="50vh">
          {pretable}
          <DynTable {...rest} columns={columns_config} rows={content} />

          {error && (
            <Alert severity="error" className="mt-10px">
              {error}
            </Alert>
          )}
        </AutoSkeleton>
      </div>
    );
  }
}

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

function PrefixUseOperation({
  useOperation,
  setViewTable,
  columns_config,
  loading,
  operationTrigger,
  name_coin,
}) {
  if (!useOperation) {
    return null;
  }
  Informacion({ columns_config });
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
            onClick={() => setViewTable("operations")}
          >
            Cerrar Transacciones
          </Button>
        </Tooltip>
      </div>
      <Info />
    </>
  );

  function Info() {
    const rowData = (() => {
      if (window["operation-row"]) {
        return window["operation-row"];
      }
      if (operationTrigger) {
        return operationTrigger;
      }
      return { id_operation: id_operation, name_coin };
    })();

    const startDate = dayjs(rowData.start_date_operation);
    const endDate = dayjs(rowData.end_date_operation);
    const startLabel = (() => {
      if (startDate.isValid()) {
        return startDate.format("YYYY-MM-DD HH:mm");
      }
      return "---";
    })();
    const endLabel = (() => {
      if (endDate.isValid()) {
        return endDate.format("YYYY-MM-DD HH:mm");
      }
      return "---";
    })();

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
