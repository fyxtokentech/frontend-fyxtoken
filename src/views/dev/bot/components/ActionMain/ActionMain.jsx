import React, { useState, useEffect, Component } from "react";

import {
  PaperP,
  IconButtonWithTooltip,
  driverParams,
  getComponentsQuery,
  subscribeParam,
} from "@jeff-aporta/camaleon";
import UpdateIcon from "@mui/icons-material/Cached";

import TableOperations from "@tables/operations/TableOperations";
import TableTransactions from "@tables/transactions/TableTransactions";

import { MovementsGraph } from "@components/graph/graph-driver";

import { driverPanelRobot } from "../../bot.jsx";

import { driverTables } from "@tables/tables.js";
import { driverActionButtons } from "./components/ActionButtons";

let SINGLETON_VIEW_TABLE;

export { driverActionButtons };

export const driverActionMain = {
  updateViewTable() {
    SINGLETON_VIEW_TABLE.forceUpdate();
  },
};

export default function () {
  const [deletionTimers, setDeletionTimers] = useState([]);

  const { PanelBalance } = getComponentsQuery({
    STATIC: ({ subcomponent }) => subcomponent("ActionMain"),
  });

  return (
    <PaperP className="flex col-direction gap-20px">
      <PanelBalance.default
        deletionTimers={deletionTimers}
        setDeletionTimers={setDeletionTimers}
        onSellCoin={(coinTitle) => {
          if (window.onSellCoinRef && window.onSellCoinRef.current) {
            window.onSellCoinRef.current(coinTitle);
          }
        }}
      />

      {/* Ref para exponer la función de borrado externo */}
      {(() => {
        if (!window.onSellCoinRef) {
          window.onSellCoinRef = React.createRef();
        }
        return null;
      })()}

      <ViewTable />
    </PaperP>
  );
}

class ViewTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SINGLETON_VIEW_TABLE = this;
  }

  render() {
    switch (driverTables.getViewTable()) {
      case "transactions":
        return (
          <TableTransactions
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
            coinid={driverPanelRobot.getIdCoin()}
            useForUser={true}
          />
        );
    }
  }
}
