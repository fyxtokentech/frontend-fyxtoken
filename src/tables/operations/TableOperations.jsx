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

import { DynTable } from "@components/GUI/DynTable/DynTable";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { getResponse } from "@api/requestTable";

import { AutoSkeleton, DateRangeControls } from "@components/controls";
import React, { Component } from "react";
import dayjs from "dayjs";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

const tableOperationsState = {};

const { driverParams, IS_GITHUB_IO } = global;

export default class TableOperations extends Component {
  constructor(props) {
    super(props);
    this.delay = -1;
    this.loadingTableOperation = null;
    Object.assign(tableOperationsState, {
      tableData: [],
      filterApply: false,
    });
    this.state = tableOperationsState;
  }

  updateDatas = () => {
    const [start, end] = driverParams.gets("start_date", "end_date");
    this.updateState({
      dateRangeInit: [null, dayjs(start)][+!!start],
      dateRangeFin: [null, dayjs(end)][+!!end],
    });
  };

  setFilterApply = (apply) => this.updateState({ filterApply: apply });

  updateState(state) {
    Object.assign(tableOperationsState, state);
    this.setState(tableOperationsState);
  }

  setError = (error) => this.updateState({ error });
  setTableData = (tableData) => this.updateState({ tableData });
  // Forzar re-render cuando no llegan datos
  setForceUpdate = () => this.forceUpdate();

  componentDidMount() {
    this.updateDatas();
    this.invokeFetch();
  }

  componentDidUpdate(prevProps, prevState) {
    const { user_id, viewTable } = this.props;
    if (prevProps.user_id !== user_id || prevProps.viewTable !== viewTable) {
      this.invokeFetch();
    }
    // enable filterApply when date range changes, safely handle null dates
    const { dateRangeInit: prevInit, dateRangeFin: prevFin } = prevState;
    const { dateRangeInit: currInit, dateRangeFin: currFin } = this.state;
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
    if (initChanged || finChanged) {
      this.setFilterApply(true);
    }
  }

  async fetchData({
    setError,
    setTableData,
    user_id,
    dateRangeInit,
    dateRangeFin,
    setForceUpdate,
    tableData,
  }) {
    if (Date.now() - this.delay < 1000) {
      console.log(
        "Fetch cancelado, tiempo de espera",
        (Date.now() - this.delay) / 1000
      );
      return;
    }
    this.delay = Date.now();
    this.loadingTableOperation = true;
    const { driverParams, IS_GITHUB_IO } = global;
    if (!user_id || !dateRangeInit || !dateRangeFin) {
      console.log("Fetch cancelado (faltan parámetros)", {
        user_id,
        dateRangeInit,
        dateRangeFin,
      });
      return;
    }
    try {
      await getResponse({
        setError,
        setLoading: (value) => {
          this.loadingTableOperation = value;
        },
        setApiData: (data) => {
          const parsed = Array.isArray(data) ? [...data] : data;
          setTableData(parsed);
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
        buildEndpoint: ({ baseUrl }) => {
          const period = driverParams.get("period");
          const coinid = driverParams.get("id_coin");
          if (period === "most_recent") {
            return `${baseUrl}/operations/most_recent/${user_id}?coinid=${coinid}`;
          }
          return `
            ${baseUrl}/operations/${user_id}?
              coinid=${coinid}&
              start_date=${dateRangeInit.format("YYYY-MM-DD")}&
              end_date=${dateRangeFin.format("YYYY-MM-DD")}&
              page=0&limit=1000
          `;
        },
      });
    } catch (e) {
      console.error(e);
      setError(e.message || e);
      setTableData([]);
    } finally {
      this.loadingTableOperation = false;
      this.delay = Date.now();
      if (tableData.length === 0) setForceUpdate();
    }
  }

  invokeFetch() {
    const { user_id } = this.props;
    const { dateRangeInit, dateRangeFin, tableData } = this.state;
    this.fetchData({
      setError: this.setError,
      setTableData: this.setTableData,
      user_id,
      dateRangeInit,
      dateRangeFin,
      setForceUpdate: this.setForceUpdate,
      tableData,
    });
  }

  handleInitChange = (dateRangeInit) => {
    this.updateState({ dateRangeInit });
    if (dateRangeInit && typeof dateRangeInit.format === "function") {
      global.driverParams.set("start_date", dateRangeInit.format("YYYY-MM-DD"));
    }
  };

  handleFinChange = (dateRangeFin) => {
    this.updateState({ dateRangeFin });
    if (dateRangeFin && typeof dateRangeFin.format === "function") {
      global.driverParams.set("end_date", dateRangeFin.format("YYYY-MM-DD"));
    }
  };

  render() {
    const {
      useForUser,
      setOperationTrigger,
      data,
      columns_config,
      user_id,
      setViewTable,
      ...rest
    } = this.props;
    const { dateRangeInit, dateRangeFin, error, tableData, filterApply } =
      this.state;
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
                    const params = new URLSearchParams(window.location.search);
                    params.set("operation-id", row.id_operation);
                    window["operation-row"] = row;
                    params.set("view-table", table);
                    window.history.replaceState(
                      null,
                      "",
                      `?${params.toString()}`
                    );
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
              className={`d-flex ai-center jc-space-between flex-wrap gap-10px ${
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
            {error && <Typography color="error">{error}</Typography>}
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
