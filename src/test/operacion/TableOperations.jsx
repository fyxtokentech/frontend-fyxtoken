import { IconButton, Paper, Tooltip, Typography, Alert } from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DynTable, rendersTemplate } from "@components/GUI/DynTable/DynTable";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import { getResponse } from "@api/requestTable";

import { AutoSkeleton, DateRangeControls } from "@components/controls";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { DriverParams } from "@jeff-aporta/router";

export default TableOperations;

function TableOperations({
  useForUser = true, // if true, is used for user
  setOperationTrigger, // only use for user
  data,
  columns_config,
  user_id,
  setViewTable,
  coinid = 1, // Valor por defecto 1 si no se proporciona
  ...rest
}) {
  const driverParams = DriverParams();
  let dateRangeInitParam = driverParams.get("start_date");
  let dateRangeFinParam = driverParams.get("end_date");

  const [dateRangeInit, setDateRangeInit] = useState(
    dateRangeInitParam ? dayjs(dateRangeInitParam) : null
  );

  const [dateRangeFin, setDateRangeFin] = useState(
    dateRangeFinParam ? dayjs(dateRangeFinParam) : null
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user_id || !dateRangeInit || !dateRangeFin) return;
    setLoading(true);
    try {
      await getResponse({
        setError,
        setLoading,
        setApiData: (data) =>
          setTableData(Array.isArray(data) ? [...data] : data),
        mock_default: mock_operation,
        checkErrors: () => {
          if (!user_id) return "No hay usuario seleccionado";
          if (!dateRangeInit || !dateRangeFin)
            return "No se ha seleccionado un rango de fechas";
        },
        buildEndpoint: ({ baseUrl }) =>
          `${baseUrl}/operations/${user_id}?coinid=${coinid}&start_date=${dateRangeInit.format(
            "YYYY-MM-DD"
          )}&end_date=${dateRangeFin.format("YYYY-MM-DD")}&page=0&limit=1000`,
      });
    } catch (e) {
      console.error(e);
      setError(e.message || e);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [dateRangeInit, dateRangeFin, user_id, coinid, mock_operation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processedContent = useMemo(() => {
    const base = user_id ? tableData : data?.content ?? mock_operation.content;
    return Array.isArray(base)
      ? base.map((item) => ({ ...item, name_coin: item.name_coin ?? "FYX" }))
      : [];
  }, [tableData, data, mock_operation]);

  const finalColumns = useMemo(() => {
    const base = columns_config ?? [...columns_operation.config];
    if (!useForUser) return base;
    return [
      {
        field: "actions",
        headerName: "Transacciones",
        sortable: false,
        renderCell: ({ row }) => (
          <Tooltip title="Transacciones" placement="left">
            <Paper
              className="circle d-center"
              style={{ width: 30, height: 30, margin: "auto", marginTop: 10 }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  const table = "transactions";
                  // Merge both query params at once to avoid losing one
                  const params = new URLSearchParams(window.location.search);
                  params.set("operation-id", row.id_operation);
                  params.set("view-table", table);
                  window.history.replaceState(null, "", `?${params.toString()}`);
                  setOperationTrigger(row);
                  setViewTable(table);
                }}
              >
                <TransactionsIcon />
              </IconButton>
            </Paper>
          </Tooltip>
        ),
      },
      ...base,
    ];
  }, [
    columns_config,
    columns_operation.config,
    useForUser,
    setOperationTrigger,
    setViewTable,
  ]);

  return (
    <>
      {!user_id ? (
        <Typography variant="body1">
          Seleccione un usuario para ver operaciones.
        </Typography>
      ) : (
        <>
          <Typography variant="h5" className="mh-20px">
            Operaciones
          </Typography>
          <div className={loading ? "" : "mh-30px"}>
            <DateRangeControls
              loading={loading}
              dateRangeInit={dateRangeInit}
              dateRangeFin={dateRangeFin}
              setDateRangeInit={setDateRangeInit}
              setDateRangeFin={setDateRangeFin}
            />
            <br />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Usuario: {user_id}
            </Typography>
          </div>
          {error && <Typography color="error">{error}</Typography>}
          <AutoSkeleton h="auto" loading={loading}>
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
