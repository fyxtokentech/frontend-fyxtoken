import React, { Component } from "react";
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

import {
  DynTable,
  driverParams,
  Delayer,
  DriverComponent,
} from "@jeff-aporta/camaleon";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { HTTPGET_USEROPERATION_PERIOD } from "@api";

import { AutoSkeleton, DateRangeControls } from "@components/controls";

import dayjs from "dayjs";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  showError,
  IS_GITHUB,
  subscribeParam,
  showInfo,
} from "@jeff-aporta/camaleon";
import { driverTables } from "../tables.js";

let rows = [];

let mock_default = IS_GITHUB ? mock_operation : [];

export const driverTableOperations = DriverComponent({
  tableOperations: {
    isComponent: true,
  },
  buttonApplyFilter: {
    isComponent: true,
  },
  tableData: {
    value: mock_default,
  },
  filterApply: {
    value: false,
  },
  loading: {
    value: true,
  },
});

export default driverTables.newTable({
  name_table: driverTables.TABLE_OPERATIONS,
  user_id_required: true,
  paramsKeys: ["start_date", "end_date"],
  allParamsRequiredToFetch: true,
  driver: driverTableOperations,
  init() {},
  start_fetch() {
    this.getDriver().setFilterApply(false);
  },
  end_fetch({ error }) {
    this.getDriver().setLoading(false);
  },
  fetchError() {
    this.getDriver().setTableData([]);
  },
  async fetchData({ user_id, start_date, end_date }) {
    await HTTPGET_USEROPERATION_PERIOD({
      start_date,
      end_date,
      // ---------------------
      successful: (data) => {
        this.getDriver().setTableData(data);
      },
      mock_default,
      checkErrors: () => {
        if (!user_id) {
          return "No hay usuario seleccionado";
        }
        if (!start_date || !end_date) {
          return "No se ha seleccionado un rango de fechas";
        }
      },
    });
  },
  render() {
    const { useForUser, data, ...rest } = this.props;
    const { user_id } = window["currentUser"];

    const columns_config = columns_operation();

    const DRIVER = this.getDriver();

    console.log("loading", this.getDriver().getLoading());

    let [start_date, end_date] = driverParams.get("start_date", "end_date");

    const base = user_id ? DRIVER.getTableData() : data?.content ?? [];

    const processedContent = Array.isArray(base)
      ? base.map((item) => ({ ...item, name_coin: item.name_coin ?? "FYX" }))
      : [];

    let finalColumns = [...columns_config];

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
                    driverTables.setOperationRow(row);
                    driverParams.set({
                      id_operation: row.id_operation,
                    });
                    driverTables.setViewTable(driverTables.TABLE_TRANSACTIONS);
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
        ...columns_config,
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
                ["mh-10px", ""][+DRIVER.getLoading()]
              }`}
            >
              <DateRangeControls loading={DRIVER.getLoading()} />
              {(() => {
                const ButtonFilter = class extends Component {
                  constructor(props) {
                    super(props);
                    subscribeParam(
                      {
                        "start_date, end_date": () => {
                          DRIVER.setFilterApply(true);
                        },
                      },
                      this
                    );
                  }

                  componentDidMount() {
                    DRIVER.addLinkFilterApply(this);
                    this.addParamListener();
                  }

                  componentWillUnmount() {
                    DRIVER.removeLinkFilterApply(this);
                    this.removeParamListener();
                  }

                  render() {
                    return (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          driverTables.refetch(true);
                        }}
                        disabled={
                          DRIVER.getLoading() || !DRIVER.getFilterApply()
                        }
                        sx={{ mt: 1, mb: 1 }}
                        startIcon={<FilterAltIcon />}
                      >
                        Aplicar filtros
                      </Button>
                    );
                  }
                };
                return <ButtonFilter />;
              })()}
            </div>
            <AutoSkeleton loading={DRIVER.getLoading()} h="auto">
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
  },
});
