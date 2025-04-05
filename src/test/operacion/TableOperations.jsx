import { IconButton, Paper, Tooltip, Typography } from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DynTable, rendersTemplate } from "@components/GUI/DynTable/DynTable";

import mock_operation from "./mock-operation.json";
import columns_operation from "./columns-operation.jsx";

import mock_transaction from "@test/transaccion/mock-transaction.json";

import {
  AutoSkeleton,
  DateRangeControls,
} from "@views/dev/bot/controls";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default TableOperations;

function TableOperations({
  useForUser = true, // if true, is used for user
  setOperationTrigger, // only use for user
  setViewTable, // only use for user
  data,
  columns_config,
  ...rest
}) {
  const [loading, setLoading] = useState(true);
  const [dateRangeInit, setDateRangeInit] = useState(dayjs("2024-10-15T00:00"));
  const [dateRangeFin, setDateRangeFin] = useState(dayjs("2024-10-15T23:59"));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  let { content } = data ?? mock_operation;
  columns_config ??= [...columns_operation.config];

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
        />
      </div>
      <AutoSkeleton h="40vh" loading={loading}>
        <DynTable {...rest} columns={columns_config} rows={content} />
      </AutoSkeleton>
    </>
  );

  function Opciones() {
    columns_config.unshift({
      field: Math.random().toString(36).replace("0.", "opns-"),
      headerName: "Detalle",
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
                  setOperationTrigger(row);
                  setViewTable("transactions");
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
