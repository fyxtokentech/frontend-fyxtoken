import { IconButton, Paper, Tooltip, Typography } from "@mui/material";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { exclude, rendersTemplate } from "./dyntable-temporal";
import { DynTable } from "@components/GUI/dynamic-table";

import mock_operation from "./operacion/mock-operation.json";
import mock_transaction from "./transaccion/mock-transaction.json";

import { AutoSkeleton, DateRangeControls } from "./c";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default TableOperations;

function TableOperations({
  columns_operation,
  setOperationTrigger,
  setViewTable,
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

  let { content } = mock_operation;
  let { config } = columns_operation;
  let columns_config = [...config];

  rendersTemplate(columns_config);

  Opciones();

  return (
    <>
      <AutoSkeleton loading={loading} h="10vh" w="60%">
        <Typography variant="h4" className="mh-20px">
          Operaciones
        </Typography>
      </AutoSkeleton>
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
    columns_config.push({
      field: Math.random().toString(36).replace("0.", "opns-"),
      headerName: "Opciones",
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Tooltip title="Transacciones" placement="left">
            <Paper
              className="circle d-center"
              style={{ width: "30px", height: "30px", margin: "auto" }}
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
