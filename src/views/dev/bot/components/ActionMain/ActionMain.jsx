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

import { driverTables } from "@tables/tables.js";
import { driverPanelRobot } from "../../bot.driver.js";

import PanelBalance from "./components/PanelBalance.jsx";
import { driverCoinsOperating } from "./components/CoinsOperating.driver.js";

export default function () {
  return (
    <PaperP className="flex col-direction gap-20px">
      <PanelBalance/>
      <ViewTable />
    </PaperP>
  );
}

class ViewTable extends Component {
  constructor(props) {
    super(props);
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
