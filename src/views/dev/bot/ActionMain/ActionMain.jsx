import React, { useState, useEffect } from "react";

import { PaperP } from "@containers";
import { TooltipIconButton } from "@recurrent";
import UpdateIcon from "@mui/icons-material/Cached";

import TableOperations from "@test/operacion/TableOperations";
import TableTransactions from "@test/transaccion/TableTransactions";

import GraphDriver from "@components/GUI/graph/graph-driver";

import PanelBalance from "./PanelBalance";

// Uso de viewTable prop en lugar de DriverParams

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
  viewTable,
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
  // driverParams reemplazado por viewTable prop

  // Estado para la selección de monedas
  const [deletionTimers, setDeletionTimers] = useState([]);

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
        if (!window.onSellCoinRef) window.onSellCoinRef = React.createRef();
        return null;
      })()}

      <ViewTable
        {...{
          viewTable,
          setViewTable,
          user_id,
          operationTrigger,
          setOperationTrigger
        }}
      />
    </PaperP>
  );
}

function ViewTable({ viewTable, setViewTable, user_id, operationTrigger, setOperationTrigger }) {
  console.log("ActionMain [DEV] viewTable:", viewTable);
  // Load coinid from URL parameters via global.driverParams
  const { driverParams } = global;
  const coinidStr = driverParams.get("id_coin");
  const coinidFromUrl = coinidStr ? parseInt(coinidStr, 10) : undefined;

  console.log(user_id)

  switch (viewTable) {
    case "transactions":
      return (
        <TableTransactions
          {...{
            setViewTable,
            user_id,
            operationTrigger,
          }}
          pretable={<>
            <GraphDriver typeDataInput="none" />
            <br />
          </>} />
      );
    case "operations":
    default:
      return (
        <TableOperations
          {...{
            setOperationTrigger,
            setViewTable,
            user_id,
            coinid: coinidFromUrl,
            useForUser: true,
          }}
        />
      );
  }
}
