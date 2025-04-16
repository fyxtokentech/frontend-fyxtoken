import { useEffect, useState } from "react";

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
import { getResponse } from "@api/requestTable";
import { DriverParams } from "@jeff-aporta/router";

export default TableTransactions;

function TableTransactions({
  useOperation = true, // if true, is use for user
  operationTrigger, // only use for user
  setViewTable, // only use for user
  showDateRangeControls = false,
  pretable,
  data,
  columns_config,
  user_id,
  ...rest
}) {
  const driverParams = DriverParams();

  const [loading, setLoading] = useState(true);

  const dateRangeInitParam = driverParams.get("start_date");
  const dateRangeFinParam = driverParams.get("end_date");

  const [dateRangeInit, setDateRangeInit] = useState(
    dateRangeInitParam ? dayjs(dateRangeInitParam) : dayjs().subtract(14, "day")
  );
  const [dateRangeFin, setDateRangeFin] = useState(
    dateRangeFinParam ? dayjs(dateRangeFinParam) : dayjs()
  );

  const operationID = driverParams.get("operation-id");

  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id || !operationID) {
      console.log(
        "No hay usuario o operación seleccionada",
        user_id,
        operationID
      );
      return;
    }

    getResponse({
      setLoading,
      setApiData,
      setError,
      mock_default: mock_transaction,
      checkErrors: () => {
        if (!user_id) {
          return "No hay usuario seleccionado";
        }
        if (!operationID) {
          return "No hay operación seleccionada";
        }
        if (!dateRangeInit || !dateRangeFin) {
          return "No se ha seleccionado un rango de fechas";
        }
      },
      buildEndpoint: ({ baseUrl }) => {
        const retorno = `
          ${baseUrl}/transactions/${user_id}/${operationID}?
            start_date=${dateRangeInit.format("YYYY-MM-DD")}&
            end_date=${dateRangeFin.format("YYYY-MM-DD")}&
            page_number=0&limit=1000
        `;
        console.log(retorno);
        return retorno;
      },
    });
  }, [user_id, operationID, dateRangeInit, dateRangeFin]);

  useEffect(() => {
    if (!operationID) {
      const t = "operations";
      setViewTable(t);
    }
  }, [operationID]);

  const content = apiData ?? mock_transaction.content;

  columns_config ??= [...columns_transaction.config];

  console.log(operationID);
  console.log(content);

  const { name_coin } = content.find((m) => m["name_coin"]) ?? {};

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

        {error && (
          <Alert severity="error" className="mt-10px">
            {error}
          </Alert>
        )}
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
        operationTrigger = {
          id_operation: operationID,
          name_coin: name_coin,
        };
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
