import { useEffect, useState } from "react";

import {
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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { AutoSkeleton } from "@components/controls";

import FyxDialog from "@components/GUI/dialog";
import {
  DynTable,
  genAllColumns,
  rendersTemplate,
  exclude,
} from "@components/GUI/DynTable/DynTable";

import mock_transaction from "./mock-transaction.json";
import columns_transaction from "./columns-transaction.jsx";

import mock_operation from "@test/operacion/mock-operation.json";
import columns_operation from "@test/operacion/columns-operation.jsx";
import dayjs from "dayjs";
import { DateRangeControls } from "@components/controls";

export default TableTransactions;

function TableTransactions({
  useOperation = true, // if true, is use for user
  operationTrigger, // only use for user
  setViewTable, // only use for user
  showDateRangeControls = false,
  pretable,
  data,
  columns_config,
  ...rest
}) {
  const [loading, setLoading] = useState(true);

  const [dateRangeInit, setDateRangeInit] = useState(
    dayjs().subtract(14, "day")
  );
  const [dateRangeFin, setDateRangeFin] = useState(dayjs());

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  let { content } = data ?? mock_transaction;

  columns_config ??= [...columns_transaction.config];

  const { name_coin } = content.find((m) => m["name_coin"]);

  return (
    <div className="p-relative">
      <Typography variant="caption" variant="h5" className="mt-20px">
        Transacciones
      </Typography>
      <br />
      <PrefixUseOperation />
      <br />
      {showDateRangeControls && (
        <>
          <DateRangeControls
            {...{
              loading,
              dateRangeInit,
              setDateRangeInit,
              dateRangeFin,
              setDateRangeFin,
            }}
          />
          <br />
        </>
      )}
      <AutoSkeleton loading={loading} h="50vh">
        {pretable}
        <DynTable {...rest} columns={columns_config} rows={content} />
      </AutoSkeleton>
    </div>
  );

  function PrefixUseOperation() {
    if (!useOperation) {
      return null;
    }
    Informacion();
    return (
      <>
        <div
          className="p-absolute"
          style={{ right: loading * 10 + "px", top: loading * 10 + "px" }}
        >
          {(() => {
            if (loading) {
              return <Skeleton style={{ width: "30px", height: "50px" }} />;
            }
            return (
              <Tooltip title="Volver a operaciones" placement="left">
                <IconButton
                  size="small"
                  onClick={() => setViewTable("operations")}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip>
            );
          })()}
        </div>
        <Info />
      </>
    );

    function Info() {
      if (!operationTrigger) {
        operationTrigger = mock_operation.content[0];
      }

      let moneda;

      if (name_coin) {
        moneda = (
          <Typography variant="caption" color="secondary" className="mb-10px">
            Moneda: {name_coin}
          </Typography>
        );
      }
      return (
        <>
          <AutoSkeleton loading={loading} w="60%">
            <Typography variant="caption" color="secondary" className="mb-10px">
              Operación: {operationTrigger["id_operation"]}
            </Typography>
          </AutoSkeleton>
          <AutoSkeleton loading={loading} w="60%">
            {moneda}
          </AutoSkeleton>
          <AutoSkeleton loading={loading} w="60%">
            <Typography variant="caption" color="secondary" className="mb-10px">
              Fecha inicio: {operationTrigger["start_date_operation"]}
            </Typography>
            <br />
            <CaptionOperation>
              Fecha fin: {operationTrigger["end_date_operation"]}
            </CaptionOperation>
            <br />
            <br />
          </AutoSkeleton>
        </>
      );
    }
  }

  function Informacion() {
    columns_config.push({
      field: Math.random().toString(36).replace("0.", "opns-"),
      headerName: "Información",
      sortable: false,
      renderCell: (params) => {
        const { row } = params;
        return (
          <div style={{ textAlign: "center" }}>
            <FyxDialog
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
            </FyxDialog>
          </div>
        );
      },
    });
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
