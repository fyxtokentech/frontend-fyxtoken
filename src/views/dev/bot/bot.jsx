import React, { Component } from "react";

import { Main } from "@theme/main";
import { DivM } from "@jeff-aporta/camaleon";

import { driverTables } from "@tables/tables.js";
import { driverPanelRobot } from "./bot.driver.js";

import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { HTTPGET_TRANSACTION_MOST_RECENT } from "src/app/api";

export const settings = {
  subtitle: "Panel Robot",
};

export default function () {
  return <PanelRobot />;
}

class PanelRobot extends Component {
  componentDidMount() {
    driverPanelRobot.fetchCoinMetrics();
    driverPanelRobot.loadCoins();
    driverPanelRobot.addLinkCurrency(this);
    driverPanelRobot.addLinkViewBot(this);
    driverTables.addLinkViewTable(this);
  }

  componentWillUnmount() {
    driverPanelRobot.removeLinkCurrency(this);
    driverPanelRobot.removeLinkViewBot(this);
    driverTables.removeLinkViewTable(this);
  }

  render() {
    const ViewBotComponent = () => driverPanelRobot.mapCaseViewBot("component");
    console.log(driverPanelRobot.getViewBot());

    return (
      <Main h_init="20px" h_fin="300px">
        <DivM>
          <Typography variant="h2" className="color-bg-opposite">
            Panel Robot
          </Typography>
          <br />
          <ViewBotComponent />
        </DivM>
      </Main>
    );
  }
}
