import React, { useState, useEffect } from "react";

import { PaperP } from "@containers";
import { TooltipIconButton } from "@recurrent";
import UpdateIcon from "@mui/icons-material/Cached";

import TableOperations from "@test/operacion/TableOperations";
import TableTransactions from "@test/transaccion/TableTransactions";

import GraphDriver from "@components/GUI/graph/graph-driver";

import PanelBalance from "./PanelBalance";

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
  update_available,
  setUpdateAvailable,
  setView,
  setOperationTrigger,
  operationTrigger,
  setViewTable,
  forceUpdate,
  coinsOperatingList,
  coinsToOperate,
  coinsToDelete,
  loadingCoinToOperate,
  setLoadingCoinToOperate,
  errorCoinOperate,
  setErrorCoinOperate,
  user_id
}) {
  const driverParams = DriverParams();

  // Estado para la selección de monedas
  const [deletionTimers, setDeletionTimers] = useState([]);
  const [,forceUpdateActionMain] = useState({});

  return (
    <PaperP className="d-flex flex-column gap-20px">
      <PanelBalance
        {...{
          currency,
          update_available,
          setUpdateAvailable,
          setView,
          coinsOperatingList,
          forceUpdate,
          coinsToOperate,
          coinsToDelete,
          loadingCoinToOperate,
          setLoadingCoinToOperate,
          errorCoinOperate,
          setErrorCoinOperate,
          user_id,
          deletionTimers,
          setDeletionTimers,
          onSellCoin: (coinTitle, forceUpdatePanelBalance) => {
            if (window.onSellCoinRef && window.onSellCoinRef.current) {
              window.onSellCoinRef.current(coinTitle);
            }
            setTimeout(()=>forceUpdatePanelBalance({}));
          },
        }}
      />

      {/* Ref para exponer la función de borrado externo */}
      {(() => {
        if (!window.onSellCoinRef) window.onSellCoinRef = React.createRef();
        return null;
      })()}

      {(() => {
        const viewTable = driverParams.get("view-table");
        switch (viewTable) {
          case "operations":
            return (
              <TableOperations
                {...{
                  setOperationTrigger,
                  setViewTable,
                  user_id,
                  coinid: 24478,
                }}
              />
            );
          case "transactions":
            return (
              <TableTransactions
                {...{
                  setViewTable,
                  user_id,
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
