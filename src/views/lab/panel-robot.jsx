import React, { useRef, useState } from "react";

import DriverParams from "@routes/DriverParams";
import fluidCSS from "@jeff-aporta/fluidcss";

import { ThemeSwitcher } from "@templates";
import { DivM, PaperP } from "@containers";
import { DynTable, genAllColumns } from "@components/GUI/dynamic-table";

import {
  Button,
  Chip,
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
import UpdateIcon from "@mui/icons-material/Cached";
import InfoIcon from "@mui/icons-material/Info";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import mock_operation from "./operacion/mock-operation.json";
import mock_transaction from "./transaccion/mock-transaction.json";
import columns_operation from "./operacion/columns-operation.jsx";
import columns_transaction from "./transaccion/columns-transaction.jsx";

import { exclude, rendersTemplate } from "./dyntable-temporal";

import FyxDialog from "@components/GUI/dialog";

import { generate_inputs, generate_selects, Info } from "@recurrent";
import { useEffect } from "react";
import TableTransactions from "./TableTransactions";
import TableOperations from "./TableOperations";

exclude(columns_operation);
exclude(columns_transaction);

let _currency_ = "";

const time_wait_update_available_again = 5;

function PanelRobot() {
  const [viewTable, setViewTable] = useState("operations");
  const [operationTrigger, setOperationTrigger] = useState(null);
  const [currency, setCurrency] = useState(_currency_);
  const [update_available, setUpdateAvailable] = useState(true);
  _currency_ = currency;

  return (
    <ThemeSwitcher h_init="20px" h_fin="300px">
      <DivM>
        <Title />
        <PaperP>
          <br />
          <PanelBalance
            {...{
              currency,
              setCurrency,
              update_available,
              setUpdateAvailable,
            }}
          />
          <br />
          {(() => {
            switch (viewTable) {
              case "operations":
                return (
                  <TableOperations
                    {...{
                      columns_operation,
                      setOperationTrigger,
                      setViewTable,
                    }}
                  />
                );
              case "transactions":
                return (
                  <TableTransactions
                    {...{
                      columns_operation,
                      columns_transaction,
                      setViewTable,
                      operationTrigger,
                    }}
                  />
                );
            }
          })()}
        </PaperP>
      </DivM>
    </ThemeSwitcher>
  );

  function Title() {
    const txt = "Panel robot";
    document.querySelector("title").innerHTML = txt;
    return (
      <>
        <Typography
          variant="h2"
          className={fluidCSS().ltX(600, { fontWeight: "500" }).end()}
        >
          {txt}
        </Typography>
        <hr className="threeQuartersWidth d-inline-block" />
        <br />
        <br />
      </>
    );
  }
}

function PanelBalance({
  currency,
  setCurrency,
  update_available,
  setUpdateAvailable
}) {
  const updateButton_TOP = (
    <div
      className={fluidCSS()
        .ltX(600, { display: [, "none"] })
        .end("fullWidth")}
    >
      <UpdateButton {...{ update_available, setUpdateAvailable }} />
      <hr />
    </div>
  );

  const updateButton_TOP_RIGHT = (
    <UpdateButton
      {...{ update_available, setUpdateAvailable }}
      className={fluidCSS().ltX(600, { display: "none" }).end()}
    />
  );

  return (
    <PaperP elevation={0}>
      <div className="d-flex jc-space-between flex-wrap gap-20px">
        {updateButton_TOP}
        <div
          className={fluidCSS()
            .ltX(600, { width: "100%", justifyContent: "space-between" })
            .end("d-flex ai-stretch flex-wrap gap-10px")}
        >
          <PaperP className="d-center" p_min="5" p_max="10">
            {generate_selects([
              {
                value: "PEPE",
                setter: setCurrency,
                name: "currency",
                label: "Moneda",
                opns: ["PEPE", "BTC", "BNB", "ETH"],
                required: true,
                style: { background: "rgba(255,255,255,0.05)" },
              },
            ])}
          </PaperP>

          <div className="d-flex-col-center flex-wrap gap-10px">
            <PaperP elevation={3}>Balance USDT</PaperP>
            <PaperP elevation={3}>Balance Coin</PaperP>
          </div>
        </div>
        <div
          className={fluidCSS()
            .ltX(600, { width: "100%" })
            .end("d-flex-col ai-end gap-10px")}
        >
          {updateButton_TOP_RIGHT}
          <div className="d-inline-flex-col gap-10px fit-content">
            <Button variant="contained" color="ok">
              Comprar
            </Button>
            <Button variant="contained" color="cancel">
              Vender
            </Button>
          </div>
        </div>
      </div>
    </PaperP>
  );
}

function UpdateButton({ update_available, setUpdateAvailable, ...rest_props }) {
  return (
    <div
      {...rest_props}
      className={`d-end fullWidth ${rest_props.className ?? ""}`}
    >
      <Tooltip
        title={
          update_available ? "Actualizar" : "Espera para volver a actualizar"
        }
        placement="left"
      >
        <div className="d-inline-block">
          <IconButton
            disabled={!update_available}
            onClick={() => {
              setUpdateAvailable(false);
              setTimeout(() => {
                setUpdateAvailable(true);
              }, time_wait_update_available_again * 1000);
            }}
          >
            <UpdateIcon />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
}

export default PanelRobot;
