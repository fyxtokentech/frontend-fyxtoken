import { IconButton, Paper, Tooltip, Typography, Alert } from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DynTable, rendersTemplate } from "@components/GUI/DynTable/DynTable";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { getResponse } from "@api/requestTable";

import mock_transaction from "@test/transaccion/mock-transaction.json";

import { AutoSkeleton, DateRangeControls } from "@components/controls";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { DriverParams } from "@jeff-aporta/router";

export default TableOperations;

let apiData = null;

const lastDataApiQuery = {
  dateRangeInit: null,
  dateRangeFin: null,
  user_id: null,
  coinid: null,
  length: -1,
};

function TableOperations({
  useForUser = true, // if true, is used for user
  setOperationTrigger, // only use for user
  data,
  columns_config,
  user_id,
  setViewTable,
  coinid, // Valor por defecto 1 si no se proporciona
  ...rest
}) {
  const driverParams = DriverParams();
  const dateRangeInitParam = driverParams.get("start_date");
  const dateRangeFinParam = driverParams.get("end_date");

  const [dateRangeInit, setDateRangeInit] = useState(
    dateRangeInitParam ? dayjs(dateRangeInitParam) : null
  );
  const [dateRangeFin, setDateRangeFin] = useState(
    dateRangeFinParam ? dayjs(dateRangeFinParam) : null
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dummy state para forzar re-render
  const [, forceUpdateTableOperations] = useState({});

  // Efecto para cargar datos cuando cambia el rango de fechas o el user_id
  useEffect(() => {
    const {
      dateRangeInit: prevDateRangeInit,
      dateRangeFin: prevDateRangeFin,
      user_id: prevUserId,
      coinid: prevCoinid,
      lastTime = 0,
    } = lastDataApiQuery;

    const dateInitEq =
      dateRangeInit?.format?.("YYYY-MM-DD") === prevDateRangeInit;

    const dateFinEq = dateRangeFin?.format?.("YYYY-MM-DD") === prevDateRangeFin;

    const user_idEq = user_id === prevUserId;
    const coinidEq = coinid === prevCoinid;
    const minTime = Date.now() - lastTime > 10 * 1000;

    if ((!dateInitEq || !dateFinEq || !user_idEq || !coinidEq) && minTime) {
      console.log("Cargando datos...");
      Object.assign(lastDataApiQuery, {
        dateRangeInit: dateRangeInit?.format?.("YYYY-MM-DD"),
        dateRangeFin: dateRangeFin?.format?.("YYYY-MM-DD"),
        user_id,
        coinid,
        lastTime: Date.now(),
      });
      getResponse({
        setLoading,
        setApiData: (val) => {
          apiData = val;
          forceUpdateTableOperations({});
          console.log("zzzzzzz")
        },
        setError,
        mock_default: mock_operation,
        checkErrors: () => {
          if (!user_id) {
            return "No hay usuario seleccionado";
          }
          if (!dateRangeInit || !dateRangeFin) {
            return "No se ha seleccionado un rango de fechas";
          }
        },
        buildEndpoint: ({ baseUrl }) => {
          console.log("build URL");
          return `${baseUrl}/operations/${user_id}?
            coinid=${coinid}&
            start_date=${dateRangeInit?.format?.("YYYY-MM-DD")}&
            end_date=${dateRangeFin?.format?.("YYYY-MM-DD")}&
            page=0&limit=1000
        `;
        },
      });
    }
  }, []);

  // Determinar qué datos mostrar: API o mock
  let content = user_id
    ? apiData ?? []
    : data?.content ?? mock_operation.content;
  columns_config ??= [...columns_operation.config];

  console.log(apiData);
  console.log(content);

  content = content.map((item) => ({
    ...item,
    name_coin: item.name_coin ?? "FYX",
  }));

  if (useForUser) {
    Opciones();
  }

  return (
    <>
      <Typography variant="h5" className="mh-20px">
        Operaciones
      </Typography>
      <div className={loading ? "" : "mh-30px"}>
        <DateRangeControls
          {...{
            loading,
            dateRangeInit,
            dateRangeFin,
            setDateRangeInit,
            setDateRangeFin,
          }}
          period="month"
        />
      </div>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {user_id && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          Usuario: {user_id}
        </Typography>
      )}
      <AutoSkeleton h="auto" loading={loading}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DynTable
            {...rest}
            columns={columns_config}
            rows={content}
            getRowId={(row) =>
              row.id_operation || row.id || Math.random().toString()
            }
          />
        </div>
      </AutoSkeleton>
    </>
  );

  function Opciones() {
    columns_config.unshift({
      field: Math.random().toString(36).replace("0.", "opns-"),
      headerName: "Transacciones",
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Tooltip title="Transacciones" placement="left">
            <Paper
              className="circle d-center"
              style={{
                width: "30px",
                height: "30px",
                margin: "auto",
                marginTop: "10px",
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  const table = "transactions";
                  driverParams.set("view-table", table);
                  driverParams.set("operation-id", row.id_operation);
                  setOperationTrigger(row);
                  setViewTable(table);
                }}
              >
                <TransactionsIcon />
              </IconButton>
            </Paper>
          </Tooltip>
        );
      },
    });
  }
}
