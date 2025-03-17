import React, { useRef, useState } from "react";

import DriverParams from "@routes/DriverParams";
import fluidCSS from "@jeff-aporta/fluidcss";

import { ThemeSwitcher } from "@components/templates";
import { DivM, PaperP } from "@components/containers";
import DynTable from "@components/GUI/dynamic-table";

import { Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

import {
  generate_inputs,
  generate_selects,
  Info,
} from "@components/repetitives";

let _currency_ = "";

const time_wait_update_available_again = 5;

function PanelRobot() {
  const [currency, setCurrency] = useState(_currency_);
  const [update_available, setUpdateAvailable] = useState(true);
  _currency_ = currency;

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
    <ThemeSwitcher h_init="20px" h_fin="300px">
      <DivM>
        <Title />
        <hr className="threeQuartersWidth d-inline-block" />
        <br />
        <br />
        <PaperP>
          <br />
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
                      value: currency,
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
                  <Button variant="contained" color="success">
                    Comprar
                  </Button>
                  <Button variant="contained" color="cancel">
                    Vender
                  </Button>
                </div>
              </div>
            </div>
          </PaperP>
          <br />
          <TableTransactions />
        </PaperP>
      </DivM>
    </ThemeSwitcher>
  );

  function TableTransactions(props) {
    const columns = [
      {
        field: "index",
        headerName: "Número",
        description: "...",
      },
      {
        field: "state",
        headerName: "Estado",
        description: "...",
      },
      {
        field: "quantity",
        headerName: "Cantidad",
        description: "...",
      },
      {
        field: "profit",
        headerName: "Ganancia",
        description: "...",
      },
      {
        field: "date",
        headerName: "Fecha",
        description: "...",
      },
    ];
    const rows = [
      {
        id: 0,
        index: 1,
        date: "26/10/2024",
        state: "Pendiente",
        quantity: "$150",
        profit: "$5",
      },
      {
        id: 1,
        index: 2,
        date: "26/10/2024",
        state: "Pendiente",
        quantity: "$150",
        profit: "$5",
      },
      {
        id: 2,
        index: 3,
        date: "26/10/2024",
        state: "Pendiente",
        quantity: "$150",
        profit: "$5",
      },
    ];
    return <DynTable {...props} columns={columns} rows={rows} />;
  }

  function Title() {
    const txt = "Panel robot";
    document.querySelector("title").innerHTML = txt;
    return (
      <Typography
        variant="h2"
        className={fluidCSS().ltX(600, { fontWeight: "500" }).end()}
      >
        {txt}
      </Typography>
    );
  }
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
            <CachedIcon />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
}

export default PanelRobot;
