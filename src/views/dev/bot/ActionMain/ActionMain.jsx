import React, { useState, useEffect } from "react";

import {
  PaperP,
  IconButtonWithTooltip,
  driverParams,
} from "@jeff-aporta/camaleon";
import UpdateIcon from "@mui/icons-material/Cached";

import TableOperations from "@tables/operations/TableOperations";
import TableTransactions from "@tables/transactions/TableTransactions";

import { MovementsGraph } from "@components/graph/graph-driver";

import PanelBalance from "./PanelBalance/PanelBalance";

// Uso de viewTable prop en lugar de DriverParams

window["SECONDS_TO_UPDATE_AGAIN"] = 5;

function UpdateButton({ update_available, setUpdateAvailable, ...rest_props }) {
  return (
    <IconButtonWithTooltip
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
        }, window["SECONDS_TO_UPDATE_AGAIN"] * 1000);
      }}
    />
  );
}

export function ActionMain({
  currency,
  update_available,
  setUpdateAvailable,
  setView,
  setOperationTrigger,
  operationTrigger,
  setViewTable,
  viewTable,
  forceUpdate,
  coinsOperatingList,
  coinsToOperate,
  coinsToDelete,
  loadingCoinToOperate,
  setLoadingCoinToOperate,
  errorCoinOperate,
  setErrorCoinOperate,
}) {
  // driverParams reemplazado por viewTable prop

  // Estado para la selección de monedas
  const [deletionTimers, setDeletionTimers] = useState([]);

  return (
    <PaperP className="flex col-direction gap-20px">
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
          viewTable,
          setViewTable,
          deletionTimers,
          setDeletionTimers,
          onSellCoin: (coinTitle) => {
            if (window.onSellCoinRef && window.onSellCoinRef.current) {
              window.onSellCoinRef.current(coinTitle);
            }
          },
        }}
      />

      {/* Ref para exponer la función de borrado externo */}
      {(() => {
        if (!window.onSellCoinRef) {
          window.onSellCoinRef = React.createRef();
        }
        return null;
      })()}

      <ViewTable
        {...{
          viewTable,
          setViewTable,
          operationTrigger,
          setOperationTrigger,
        }}
      />
    </PaperP>
  );
}

function ViewTable({
  viewTable,
  setViewTable,
  operationTrigger,
  setOperationTrigger,
}) {
  console.log("ActionMain [DEV] viewTable:", viewTable);
  // Load coinid from URL parameters via driverParams
  const coinidStr = driverParams.get("id_coin");
  const coinidFromUrl = coinidStr ? parseInt(coinidStr, 10) : undefined;

  switch (viewTable) {
    case "transactions":
      return (
        <TableTransactions
          {...{
            setViewTable,
            operationTrigger,
          }}
          pretable={
            <>
              <MovementsGraph typeDataInput="none" />
              <br />
            </>
          }
        />
      );
    case "operations":
    default:
      return (
        <TableOperations
          {...{
            setOperationTrigger,
            setViewTable,
            coinid: coinidFromUrl,
            useForUser: true,
          }}
        />
      );
  }
}
