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
import { AutoSkeleton } from "@views/lab/controls";

import FyxDialog from "@components/GUI/dialog";
import { DynTable, genAllColumns, rendersTemplate, exclude } from "@components/GUI/DynTable/DynTable";

import mock_operation from "@views/lab/action-main/operacion/mock-operation.json";
import mock_transaction from "@views/lab/action-main/transaccion/mock-transaction.json";

import columns_transaction from "@views/lab/action-main/transaccion/columns-transaction.jsx";
import columns_operation from "@views/lab/action-main/operacion/columns-operation.jsx";

export default TableTransactions;

function TableTransactions({
  operationTrigger,
  setViewTable,
  ...rest
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (!operationTrigger) {
    operationTrigger = mock_operation.content[0];
  }
  let { content } = mock_transaction;
  let { config } = columns_transaction;
  let columns_config_table = [...config];
  rendersTemplate(columns_config_table);

  Informacion();

  const { name_coin } = content.find((m) => m["name_coin"]);

  let moneda;

  if (name_coin) {
    moneda = (
      <Typography variant="caption" color="secondary" className="mb-10px">
        Moneda: {name_coin}
      </Typography>
    );
  }

  return (
    <div className="p-relative">
      <div
        className="p-absolute"
        style={{ right: loading * 10 + "px", top: loading * 10 + "px" }}
      >
        {!loading ? (
          <Tooltip title="Volver a operaciones" placement="left">
            <IconButton size="small" onClick={() => setViewTable("operations")}>
              <CloseIcon color="secondary" />
            </IconButton>
          </Tooltip>
        ) : (
          <Skeleton style={{ width: "30px", height: "50px" }} />
        )}
      </div>

      <AutoSkeleton loading={loading} w="50%" h="10vh">
        <Typography variant="caption" variant="h4" className="mt-20px">
          Transacciones
        </Typography>
        <br />
      </AutoSkeleton>
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
      <AutoSkeleton loading={loading} h="50vh">
        <DynTable {...rest} columns={columns_config_table} rows={content} />
      </AutoSkeleton>
    </div>
  );

  function Informacion() {
    columns_config_table.push({
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
                      {exclude(config).map((column, i) => {
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
