import React, { useState, Component } from "react";
import { DriverComponent } from "@jeff-aporta/camaleon";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { driverPanelRobot } from "../../../bot.driver.js";
import { driverCoinsOperating } from "./CoinsOperating.driver.js";

export const driverActionButtons = DriverComponent({
  idDriver: "bot-action-buttons",
  autoOpEnabled: {
    isBoolean: true,
  },
  disableToggler() {
    return (
      this.disableGeneral() || driverPanelRobot.isCurrencyInCoinsToDelete()
    );
  },
  disableOperate() {
    return (
      this.disableToggler() || driverPanelRobot.isCurrencyInCoinsOperating()
    );
  },
  disableStoper() {
    return (
      this.disableToggler() ||
      driverPanelRobot.isEmptyCoinsOperating() ||
      !driverPanelRobot.isCurrencyInCoinsOperating()
    );
  },
  disableGeneral() {
    return !driverPanelRobot.existsCurrency();
  },

  loadingGeneral() {
    const actualCurrency = driverPanelRobot.getCurrency();
    return (
      !actualCurrency ||
      driverPanelRobot.isPendingInCoinsToDelete(actualCurrency) ||
      driverCoinsOperating.getActionInProcess() ||
      driverPanelRobot.getLoadingCoinsToOperate()
    );
  },
  paused: {
    isBoolean: true,
    mapCase: {
      textButtonPause: {
        false: () => "Pausar",
        true: () => "Reanudar",
      },
      colorButtonPause: {
        false: () => "warning",
        true: () => "success",
      },
      iconButtonPause: {
        false: () => <PauseIcon fontSize="small" />,
        true: () => <PlayArrowIcon fontSize="small" />,
      },
    },
  },
});
