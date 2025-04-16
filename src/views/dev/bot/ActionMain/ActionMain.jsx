import React, { useState, useEffect } from "react";

import { PaperP } from "@containers";
import { TooltipIconButton } from "@recurrent";
import UpdateIcon from "@mui/icons-material/Cached";

import TableOperations from "@test/operacion/TableOperations";
import TableTransactions from "@test/transaccion/TableTransactions";

import GraphDriver from "@components/GUI/graph/graph-driver";

import PanelBalance from "./PanelBalance";
import CoinSelection from "./CoinSelection";

import { DriverParams } from "@jeff-aporta/router";

const time_wait_update_available_again = 5;

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
}) {
  const driverParams = DriverParams();

  // Estado para la selección de monedas
  const [coins, setCoins] = useState([]);

  return (
    <PaperP className="d-flex flex-column gap-20px">
      <PanelBalance
        {...{
          currency,
          setCurrency,
          update_available,
          setUpdateAvailable,
          setView,
        }}
      />

      <CoinSelection coins={coins} setCoins={setCoins} />

      {(() => {
        const viewTable = driverParams.get("view-table");
        switch (viewTable) {
          case "operations":
            return (
              <TableOperations
                {...{
                  setOperationTrigger,
                  setViewTable,
                  user_id: global.configApp.userID,
                  coinid: 24478,
                }}
              />
            );
          case "transactions":
            return (
              <TableTransactions
                {...{
                  setViewTable,
                  user_id: global.configApp.userID,
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
