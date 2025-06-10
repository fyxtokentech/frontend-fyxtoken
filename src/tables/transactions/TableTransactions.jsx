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
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/HighlightOff";
import PaidIcon from "@mui/icons-material/Paid";
import SellIcon from "@mui/icons-material/Sell";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ApiIcon from "@mui/icons-material/Api";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoIcon from "@mui/icons-material/Info";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
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

import mock_operation from "@tables/operations/mock-operation.json";
import columns_operation from "@tables/operations/columns-operation.jsx";
import dayjs from "dayjs";
import { HTTP_GET } from "@src/api/base";

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
  const { user_id } = window["currentUser"] ?? {};
  const { driverParams } = window;
  const { operationID = driverParams.get("operation-id") } =
    window["operation-row"] ?? {};
  const { IS_GITHUB_IO } = global;

  

  const [loading, setLoading] = useState(true);

  // Si no existe rowData, obtenerla desde el endpoint
  useEffect(() => {
    if (!window["operation-row"] && operationID) {
      HTTP_GET({
        setLoading: () => {},
        // Recibe el objeto ya procesado
        setApiData: (data) => {
          window["operation-row"] = data[0];
        },
        setError: () => {},
        mock_default: [],
        checkErrors: () => {},
        buildEndpoint: ({ baseUrl }) => {
          return `${baseUrl}/operations/id/${operationID}`;
        },
      });
    }
  }, [operationID]);

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

    HTTP_GET({
      setLoading,
      setApiData,
      setError,
      mock_default: IS_GITHUB_IO ? mock_transaction : [],
      checkErrors: () => {
        if (!operationID) {
          return "No hay operación seleccionada";
        }
      },
      buildEndpoint: ({ baseUrl }) => {
        return `${baseUrl}/transactions/${operationID}`;
      },
    });
  }, [operationID]);

  useEffect(() => {
    if (!operationID) {
      const t = "operations";
      setViewTable(t);
    }
  }, [operationID]);

  const content = apiData ?? (IS_GITHUB_IO ? mock_transaction : []).content;

  columns_config ??= [...columns_transaction.config];

  const { name_coin } = content.find((m) => m["name_coin"]) ?? {};

  return (
    <div className="p-relative">
      <Typography variant="caption" variant="h5" className="mt-20px">
        Transacciones
      </Typography>
      <br />
      <PrefixUseOperation />
      <br />
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
      console.log(window["operation-row"]);
      const rowData = (() => {
        if (window["operation-row"]) {
          return window["operation-row"];
        }
        if (operationTrigger) {
          return operationTrigger;
        }
        return { id_operation: operationID, name_coin };
      })();

      const startDate = dayjs(rowData.start_date_operation);
      const endDate = dayjs(rowData.end_date_operation);
      const startLabel = (() => {
        if (startDate.isValid()) {
          return startDate.format("YYYY-MM-DD HH:mm");
        }
        return "---";
      })();
      const endLabel = (() => {
        if (endDate.isValid()) {
          return endDate.format("YYYY-MM-DD HH:mm");
        }
        return "---";
      })();

      return (
        <>
          <Stack
            direction="row"
            sx={{ flexWrap: "wrap", gap: "15px" }}
            className="mb-10px"
          >
            <AutoSkeleton loading={loading} w="60%">
              <Chip
                icon={<AccountTreeIcon />}
                label={`CLUSTER: ${rowData.id_operation}`}
                size="small"
              />
            </AutoSkeleton>
            <AutoSkeleton loading={loading} w="60%">
              <Chip
                icon={<MonetizationOnIcon />}
                label={`Moneda: ${rowData.name_coin}`}
                size="small"
              />
            </AutoSkeleton>
            <Chip
              icon={<PaidIcon />}
              label={`Invertido: ${
                rowData.total_bought?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "0.00"
              } USDC`}
              size="small"
            />
            <Chip
              icon={<SellIcon />}
              label={`Vendido: ${
                rowData.total_sold?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "0.00"
              } USDC`}
              size="small"
            />
            <Chip
              icon={<CalendarTodayIcon />}
              label={`Periodo: ${startLabel} / ${endLabel}`}
              size="small"
            />
            <Chip
              icon={<ApiIcon />}
              label={`API: ${rowData.name_platform}`}
              size="small"
            />
          </Stack>
          {/* <AutoSkeleton loading={loading} w="60%">
            <Typography variant="caption" color="secondary" className="mb-10px">
              Fecha inicio: {operationTrigger["start_date_operation"]}
            </Typography>
            <br />
            <CaptionOperation>
              Fecha fin: {operationTrigger["end_date_operation"]}
            </CaptionOperation>
            <br />
            <br />
          </AutoSkeleton> */}
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
