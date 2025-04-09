import React from "react";

import { Typography, Grid, Button, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/Cached";

import fluidCSS from "@jeff-aporta/fluidcss";
import { TooltipIconButton, generate_selects } from "@recurrent";
import { PaperP } from "@containers";

import TableOperations from "@test/operacion/TableOperations";
import TableTransactions from "@test/transaccion/TableTransactions";

import GraphDriver from "@components/GUI/graph/graph-driver";

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

  return (
    <PaperP elevation={0}>
      <div className="d-flex ai-center jc-space-between flex-wrap gap-10px">
        <div className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS().ltX(768, { width: "100%" }).end()}`}>
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

          <div className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS().ltX(480, { width: "100%" }).end()}`}>
            <PaperP 
              className={`d-center ${fluidCSS().ltX(480, { width: "calc(50% - 5px)" }).end()}`} 
              elevation={3}
            >
              Balance USDT
            </PaperP>
            <PaperP 
              className={`d-center ${fluidCSS().ltX(480, { width: "calc(50% - 5px)" }).end()}`} 
              elevation={3}
            >
              Balance Coin
            </PaperP>
          </div>
        </div>

        <div className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS().ltX(768, { width: "100%", justifyContent: "flex-end", marginTop: "10px" }).end()}`}>
          <UpdateButton {...{ update_available, setUpdateAvailable }} />
          {settingIcon()}
          <div className="d-flex gap-10px">
            <Button variant="contained" color="ok" size="small">
              Comprar
            </Button>
            <Button variant="contained" color="cancel" size="small">
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
      {(() => {
        switch (viewTable) {
          case "operations":
            return (
              <TableOperations
                {...{
                  setOperationTrigger,
                  setViewTable,
                  user_id: "b08edabb-1363-459d-9cc6-e2c326467071"
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
                pretable={
                  <>
                    <GraphDriver typeDataInput="none" />
                    <br />
                  </>
                }
              />
            );
        }
      })()}
    </PaperP>
  );
}
