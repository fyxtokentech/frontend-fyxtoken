import {
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Alert,
  Button,
  Badge,
} from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DynTable, driverParams } from "@jeff-aporta/camaleon";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { HTTPGET_USEROPERATION_PERIOD } from "@api";

import { AutoSkeleton, DateRangeControls } from "@components/controls";
import React, { Component } from "react";
import dayjs from "dayjs";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { showError } from "@jeff-aporta/camaleon";

const tableOperationsState = {
  tableData: [],
};

const { IS_GITHUB_IO } = global;

let _TableOperations_;

export function updateTableOperations() {
  _TableOperations_.invokeFetch();
}

export default class TableOperations extends Component {
  constructor(props) {
    super(props);
    this.delay = -1;
    this.loadingTableOperation = null;
    Object.assign(tableOperationsState, {
      filterApply: false,
    });
    this.state = tableOperationsState;
  }

  updateDatas = () => {
    let [start, end] = driverParams.gets("start_date", "end_date");
    this.updateState({
      filterApply: true,
      dateRangeInit: dayjs(start),
      dateRangeFin: dayjs(end),
    });
  };

  setFilterApply = (apply) => this.updateState({ filterApply: apply });

  updateState(state) {
    Object.assign(tableOperationsState, state);
    this.setState(tableOperationsState);
  }

  setError = (error) => {
    this.updateState({ error });
    showError(error);
  };
  setTableData = (tableData) => {
    this.updateState({ tableData });
    setTimeout(() => {
      this.forceUpdate();
    });
  };

  componentDidMount() {
    this.updateDatas();
    this.invokeFetch();
    _TableOperations_ = this;
  }

  componentDidUpdate(prevProps, prevState) {
    const { viewTable } = this.props;
    if (prevProps.viewTable !== viewTable) {
      this.invokeFetch();
    }
    // enable filterApply when date range changes, safely handle null dates
    let { dateRangeInit: prevInit, dateRangeFin: prevFin } = prevState;
    let { dateRangeInit: currInit, dateRangeFin: currFin } = this.state;
    prevInit = dayjs(prevInit);
    prevFin = dayjs(prevFin);
    currInit = dayjs(currInit);
    currFin = dayjs(currFin);
    const initChanged = (() => {
      if (prevInit && currInit) {
        return !prevInit.isSame(currInit);
      }
      return prevInit !== currInit;
    })();
    const finChanged = (() => {
      if (prevFin && currFin) {
        return !prevFin.isSame(currFin);
      }
      return prevFin !== currFin;
    })();
  }

  async fetchData({ dateRangeInit, dateRangeFin }) {
    const { user_id } = window["currentUser"];
    if (Date.now() - this.delay < 1000) {
      console.log(
        "Fetch cancelado, tiempo de espera",
        (Date.now() - this.delay) / 1000
      );
      return;
    }
    this.delay = Date.now();
    this.loadingTableOperation = true;
    const { IS_GITHUB_IO } = global;
    if (!user_id || !dateRangeInit || !dateRangeFin) {
      console.log("Fetch cancelado (faltan parámetros)", {
        user_id,
        dateRangeInit,
        dateRangeFin,
      });
      return;
    }
    try {
      await HTTPGET_USEROPERATION_PERIOD({
        start_date: dayjs(dateRangeInit).format("YYYY-MM-DD"),
        end_date: dayjs(dateRangeFin).format("YYYY-MM-DD"),
        // ---------------------
        setError: this.setError,
        setLoading: (value) => {
          this.loadingTableOperation = value;
        },
        setApiData: (data) => {
          const parsed = data;
          tableOperationsState.tableData = parsed;
          this.setTableData(tableOperationsState.tableData);
        },
        mock_default: IS_GITHUB_IO ? mock_operation : [],
        checkErrors: () => {
          if (!user_id) {
            return "No hay usuario seleccionado";
          }
          if (!dateRangeInit || !dateRangeFin) {
            return "No se ha seleccionado un rango de fechas";
          }
        },
      });
    } catch (e) {
      console.error(e);
      this.setError(e.message || e);
      showError(e.message || e);
      this.setTableData([]);
    } finally {
      this.loadingTableOperation = false;
      this.delay = Date.now();
      this.forceUpdate();
    }
  }

  invokeFetch() {
    const { dateRangeInit, dateRangeFin } = this.state;
    this.fetchData({
      dateRangeInit,
      dateRangeFin,
    });
  }

  handleInitChange = (dateRangeInit) => {
    this.updateState({ dateRangeInit });
    if (dateRangeInit && typeof dateRangeInit.format === "function") {
      driverParams.set("start_date", dateRangeInit.format("YYYY-MM-DD"));
    }
  };

  handleFinChange = (dateRangeFin) => {
    this.updateState({ dateRangeFin });
    if (dateRangeFin && typeof dateRangeFin.format === "function") {
      driverParams.set("end_date", dateRangeFin.format("YYYY-MM-DD"));
    }
  };

  render() {
    const {
      useForUser,
      setOperationTrigger,
      data,
      columns_config,
      setViewTable,
      ...rest
    } = this.props;
    const { user_id } = window["currentUser"];
    const { dateRangeInit, dateRangeFin, error, filterApply } = this.state;
    const { tableData } = tableOperationsState;
    const loading = this.loadingTableOperation;

    const base = user_id ? tableData : data?.content ?? [];
    const processedContent = Array.isArray(base)
      ? base.map((item) => ({ ...item, name_coin: item.name_coin ?? "FYX" }))
      : [];

    let finalColumns = columns_config ?? [...columns_operation.config];

    if (useForUser) {
      finalColumns = [
        {
          field: "actions",
          headerName: "Transacciones",
          sortable: false,
          renderCell: ({ row }) => (
            <Tooltip
              title={`Transacciones (${row.number_of_transactions})`}
              placement="left"
            >
              <Paper
                className="circle d-center"
                style={{ width: 30, height: 30, margin: "auto", marginTop: 10 }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    const table = "transactions";
                    driverParams.set("id_operation", row.id_operation);
                    window["operation-row"] = row;
                    driverParams.set("view-table", table);
                    setOperationTrigger(row);
                    setViewTable(table);
                  }}
                >
                  <Badge
                    badgeContent={row.number_of_transactions}
                    color="primary"
                    sx={{ "& .MuiBadge-badge": { color: "#fff" } }}
                  >
                    <TransactionsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Paper>
            </Tooltip>
          ),
        },
        ...columns_operation.config,
      ];
    }

    return (
      <>
        {!user_id ? (
          <Typography variant="body1">
            Seleccione un usuario para ver operaciones.
          </Typography>
        ) : (
          <>
            <Typography variant="h5">Operaciones</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Usuario: {user_id}
            </Typography>
            <div
              className={`flex align-center justify-space-between flex-wrap gap-10px ${
                loading ? "" : "mh-10px"
              }`}
            >
              <DateRangeControls
                loading={loading}
                dateRangeInit={dateRangeInit}
                dateRangeFin={dateRangeFin}
                setDateRangeInit={this.handleInitChange}
                setDateRangeFin={this.handleFinChange}
                willPeriodChange={(period) => this.setFilterApply(true)}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  this.invokeFetch();
                  this.setFilterApply(false);
                }}
                disabled={loading || !this.state.filterApply}
                sx={{ mt: 1, mb: 1 }}
                startIcon={<FilterAltIcon />}
              >
                Aplicar filtros
              </Button>
            </div>
            <AutoSkeleton loading={loading} h="auto">
              <div style={{ width: "100%", overflowX: "auto" }}>
                <DynTable
                  {...rest}
                  columns={finalColumns}
                  rows={processedContent}
                  getRowId={(row) =>
                    row.id_operation || row.id || Math.random().toString()
                  }
                />
              </div>
            </AutoSkeleton>
          </>
        )}
      </>
    );
  }
}
