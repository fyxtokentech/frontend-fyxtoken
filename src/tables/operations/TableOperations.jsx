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

import { driverTables } from "../tables.js";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { HTTPGET_USEROPERATION_PERIOD } from "@api";

import { DateRangeControls } from "@components/controls";

import dayjs from "dayjs";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  showError,
  IS_GITHUB,
  subscribeParam,
  showInfo,
  DriverComponent,
  DynTable,
  driverParams,
  Delayer,
  WaitSkeleton,
} from "@jeff-aporta/camaleon";

let mock_default = (() => {
  if (IS_GITHUB) {
    return mock_operation;
  }
})();

export const driverTableOperations = DriverComponent({
  idDriver: "table-operation",
  tableOperations: {},
  buttonApplyFilter: {},
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

export default function (props) {
  const Table = driverTables.newTable({
    name_table: driverTables.TABLE_OPERATIONS,
    user_id_required: true,
    paramsKeys: ["start_date", "end_date"],
    allParamsRequiredToFetch: true,
    driver: driverTableOperations,
    fetchError() {
      this.getDriver().setTableData([]);
    },
    startFetch() {
      this.getDriver().setFilterApply(false);
    },
    endFetch() {
      this.getDriver().setFilterApply(false);
    },
    async fetchData({ user_id, start_date, end_date }, { driver }) {
      await HTTPGET_USEROPERATION_PERIOD({
        user_id,
        start_date,
        end_date,
        // ---------------------
        successful: (data) => {
          driver.setTableData(data);
        },
        failure() {
          driver.setTableData([]);
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

      let [start_date, end_date] = driverParams.get("start_date", "end_date");

      const base = user_id ? DRIVER.getTableData() : data?.content ?? [];

      const processedContent = Array.isArray(base)
        ? base.map((item) => ({ ...item, name_coin: item.name_coin ?? "FYX" }))
        : [];

      let finalColumns;

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
                  style={{
                    width: 30,
                    height: 30,
                    margin: "auto",
                    marginTop: 10,
                  }}
                >
                  <IconButton
                    size="small"
                    className="square w-fit"
                    onClick={() => {
                      driverTables.setOperationRow(row);
                      driverParams.set({
                        id_operation: row.id_operation,
                      });
                      driverTables.setViewTable(
                        driverTables.TABLE_TRANSACTIONS
                      );
                    }}
                  >
                    <Badge
                      badgeContent={row.number_of_transactions}
                      color="contrastPaper"
                      size="small"
                      max={99}
                      overlap="circular"
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
      } else {
        finalColumns = [...columns_config];
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
                <WaitSkeleton loading={DRIVER.getLoading()}>
                  <DateRangeControls />
                </WaitSkeleton>
                {(() => {
                  const ButtonFilter = class extends Component {
                    constructor(props) {
                      super(props);
                      subscribeParam(
                        {
                          "start_date, end_date, period": () => {
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
              <WaitSkeleton loading={DRIVER.getLoading()} h="auto">
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
              </WaitSkeleton>
            </>
          )}
        </>
      );
    },
  });
  return <Table {...props} />;
}
