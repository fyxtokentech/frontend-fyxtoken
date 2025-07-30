import React, { Component } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import {
  Typography,
  Grid,
  Chip,
  TextField,
  Slider,
  LinearProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import {
  fluidCSS,
  getThemeLuminance,
  clamp,
  map,
  IconButtonWithTooltip,
  TooltipGhost,
  PaperP,
  driverParams,
  subscribeParam,
  AnimateComponent,
  DriverComponent,
  WaitSkeleton,
} from "@jeff-aporta/camaleon";

import ActionButtons from "./ActionButtons";
import CoinsOperating from "./CoinsOperating";
import PanelCoinSelected from "./PanelCoinSelected";
import PanelOfInsertMoney from "./PanelOfInsertMoney";

import { vars_PanelOfInsertMoney } from "./PanelOfInsertMoney";
import { panelProjectionsState } from "./PanelOfProjections";
import { driverPanelBalance } from "./PanelBalance.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";
import { driverTables } from "../../../../../../tables/tables.js";

class TimeCount extends AnimateComponent {
  handleAutoFetchChange = (e) => {
    driverPanelBalance.setAutoFetch(e.target.checked);
  };

  render() {
    const autoFetch = driverPanelBalance.getAutoFetch();
    const minutos = 5;
    const segundos = minutos * 60;
    const msSteep = segundos * 1000;
    const desfaceSeconds = 10 * 1000;
    const timePercent = clamp(
      ((Date.now() - desfaceSeconds) % msSteep) / msSteep,
      0,
      1
    );
    if (this.pastPercent > timePercent) {
      if (!document.hidden) {
        if (autoFetch) {
          console.log("🔄️ Autofetch ejecutado");
          setTimeout(() => {
            driverPanelRobot.fetchCoinMetrics();
            driverTables.refetch();
          });
        } else {
          console.log("⛔ Autofetch desactivado en Storage");
        }
      } else {
        console.log("⛔ Ventana no activa para Autofetch");
      }
    }
    this.pastPercent = timePercent;
    return (
      <>
        <div className="flex space-between align-center">
          <FormControlLabel
            control={
              <Checkbox
                color="l4"
                checked={autoFetch}
                onChange={this.handleAutoFetchChange}
                size="small"
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              />
            }
            label={
              <Typography variant="caption" color="secondary">
                Autofetch
              </Typography>
            }
          />
          <Typography variant="caption" color="contrastPaper">
            {seconds2Time(Math.floor(map(timePercent, 0, 1, 0, segundos)), {
              HH: false,
            })}{" "}
            / {seconds2Time(segundos, { HH: false })}
          </Typography>
        </div>
        <LinearProgress
          color="secondary"
          variant="determinate"
          value={timePercent * 100}
          className="sticky top z-ontop-but-under-fx"
        />
      </>
    );
  }
}

function seconds2Time(seconds, { HH = true, MM = true, SS = true } = {}) {
  if (HH) {
    HH = Math.floor(seconds / 3600);
  }
  if (MM) {
    MM = Math.floor((seconds % 3600) / 60);
  }
  if (SS) {
    SS = seconds % 60;
  }
  return [HH, MM, SS]
    .filter((v) => typeof v == "number")
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export default class PanelBalance extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    driverPanelRobot.addLinkCoinsOperating(this);
    driverPanelRobot.addLinkCoinsToDelete(this);
    driverPanelRobot.addLinkIdCoin(this);
    driverPanelRobot.addLinkCurrency(this);
  }

  componentWillUnmount() {
    driverPanelRobot.removeLinkCoinsOperating(this);
    driverPanelRobot.removeLinkCoinsToDelete(this);
    driverPanelRobot.removeLinkIdCoin(this);
    driverPanelRobot.removeLinkCurrency(this);
  }

  render() {
    const roi = 0;

    const hayMoneda = [
      driverPanelRobot.existsCurrency(),
      !driverPanelRobot.getLoadingCoinsToOperate(),
    ].every(Boolean);

    return (
      <div>
        <TimeCount frameRate={1} />
        <PaperP elevation={0}>
          <div className={`flex wrap space-between gap-5px`}>
            <div className="flex wrap gap-5px">
              <PanelCoinSelected />
              <PanelOfInsertMoney />
            </div>
            <ActionButtons />
          </div>
          {(() => {
            if (hayMoneda) {
              return (
                <>
                  <br />
                  <CoinsOperating />
                </>
              );
            }
          })()}
        </PaperP>
      </div>
    );
  }
}