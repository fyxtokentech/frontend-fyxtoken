import React from "react";

import { Typography, Grid, Button, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/Cached";

import fluidCSS from "@jeff-aporta/fluidcss";
import { TooltipIconButton, generate_selects } from "@recurrent";
import { PaperP } from "@containers";

import TableOperations from "@test/operacion/TableOperations";
import TableTransactions from "@test/transaccion/TableTransactions";

const time_wait_update_available_again = 5;

function PanelBalance({
  currency,
  setCurrency,
  update_available,
  setUpdateAvailable,
  setView,
}) {
  function settingIcon() {
    return (
      <TooltipIconButton
        title="Ajustar API"
        onClick={() => setView("settings")}
        icon={
          <>
            <SettingsIcon /> <span style={{ fontSize: "14px" }}>API</span>
          </>
        }
      />
    );
  }

  const updateButton_TOP = (
    <>
      <div
        className={fluidCSS()
          .ltX(600, { display: [, "none"] })
          .end("fullWidth d-end-center gap-10px")}
      >
        <UpdateButton {...{ update_available, setUpdateAvailable }} />
        {settingIcon()}
      </div>
      <hr className="m0" />
    </>
  );

  const updateButton_TOP_RIGHT = (
    <div
      className={fluidCSS()
        .ltX(600, { display: "none" })
        .end("d-center gap-10px")}
    >
      <UpdateButton {...{ update_available, setUpdateAvailable }} />
      {settingIcon()}
    </div>
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
                value: currency,
                setter: setCurrency,
                name: "currency",
                label: "Moneda",
                opns: ["PEPE", "BTC", "BNB", "ETH"],
                required: true,
                fem: true,
              },
            ])}
          </PaperP>

          <div className="d-flex-col-center flex-wrap gap-10px">
            <PaperP className="min-w-200px" elevation={3}>Balance USDT</PaperP>
            <PaperP className="min-w-200px" elevation={3}>Balance Coin</PaperP>
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
    <TooltipIconButton
      {...rest_props}
      title={() =>
        update_available ? "Actualizar" : "Espera para volver a actualizar"
      }
      icon={<UpdateIcon />}
      disabled={!update_available}
      onClick={() => {
        setUpdateAvailable(false);
        setTimeout(() => {
          setUpdateAvailable(true);
        }, time_wait_update_available_again * 1000);
      }}
    />
  );
}

export default function ActionMain({
  currency,
  setCurrency,
  update_available,
  setUpdateAvailable,
  setView,
  setOperationTrigger,
  operationTrigger,
  setViewTable,
  viewTable,
}) {
  return (
    <PaperP>
      <br />
      <PanelBalance
        {...{
          currency,
          setCurrency,
          update_available,
          setUpdateAvailable,
          setView,
        }}
      />
      <br />
      {(() => {
        switch (viewTable) {
          case "operations":
            return (
              <TableOperations
                {...{
                  setOperationTrigger,
                  setViewTable,
                }}
              />
            );
          case "transactions":
            return (
              <TableTransactions
                {...{
                  setViewTable,
                  operationTrigger,
                }}
              />
            );
        }
      })()}
    </PaperP>
  );
}
