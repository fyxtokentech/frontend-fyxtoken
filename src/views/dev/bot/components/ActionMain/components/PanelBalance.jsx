import React, { Component } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
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
} from "@jeff-aporta/camaleon";

import { AutoSkeleton } from "@components/controls";
import { HTTPGET_COINS_METRICS, HTTPGET_BALANCECOIN } from "@api";

import ActionButtons from "./ActionButtons";
import CoinsOperating from "./CoinsOperating";
import PanelCoinSelected from "./PanelCoinSelected";
import PanelOfInsertMoney, {
  changeValueInsertMoney,
} from "./PanelOfInsertMoney";
import PanelOfProjections from "./PanelOfProjections";

import { vars_PanelOfInsertMoney } from "./PanelOfInsertMoney";
import { panelProjectionsState } from "./PanelOfProjections";
import { driverPanelRobot } from "../../../bot.jsx";

export const driverPanelBalance = DriverComponent({
  panelBalance: {
    isComponent: true,
  },
  transactionMostRecent: {
    value: 0,
  },
});

class TimeCount extends AnimateComponent {
  render() {
    const minutos = 5;
    const segundos = minutos * 60;
    const msSteep = segundos * 1000;
    const desfaceSeconds = 10 * 1000;
    const timePercent = clamp(
      ((Date.now() - desfaceSeconds) % msSteep) / msSteep,
      0,
      1
    );
    if (this.pastPercent && this.pastPercent > timePercent) {
      setTimeout(driverPanelRobot.updatePanelRobot);
    }
    this.pastPercent = timePercent;
    return (
      <>
        <div align="right">
          <Typography variant="caption" color="contrastpaper">
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
    this.state = {};
    subscribeParam(
      { "id_coin, coin": () => driverPanelRobot.updatePanelRobot() },
      this
    );
    driverPanelBalance.setPanelBalance(this);
  }

  componentDidMount() {
    this.addParamListener();
    driverPanelRobot.addLinkLoadingCoinsToOperate(this);
  }

  componentWillUnmount() {
    this.removeParamListener();
    driverPanelRobot.removeLinkLoadingCoinsToOperate(this);
  }

  settingIcon = () => (
    <IconButtonWithTooltip
      title="Configurar"
      onClick={() => driverPanelRobot.setToSettingsViewBot()}
      icon={
        <div className="flex col-direction align-center">
          <SettingsIcon />
          <Typography variant="caption" color="text.secondary">
            <small>Configurar</small>
          </Typography>
        </div>
      }
    />
  );

  render() {
    const { onSellCoin, deletionTimers, setDeletionTimers } = this.props;
    // Usar los estados globales en vez del state local
    const { actionInProcess } = vars_PanelOfInsertMoney;
    const flatNumber = 12345;
    const roi = 0;

    const hayMoneda = [
      driverPanelRobot.existsCurrency(),
      !driverPanelRobot.getLoadingCoinsToOperate(),
    ].every(Boolean);

    return (
      <div key={driverPanelRobot.getCurrency()}>
        <TimeCount frameRate={1} />
        <PaperP elevation={0}>
          <div className={`flex wrap space-between gap-10px`}>
            <PanelCoinSelected />
            <PanelOfProjections flatNumber={flatNumber} />
            <PanelOfInsertMoney
              setInputValue={(value) => {
                vars_PanelOfInsertMoney.inputValue = value;
                driverPanelRobot.updatePanelRobot();
              }}
              setSliderExp={(exp) => {
                vars_PanelOfInsertMoney.sliderExp = exp;
                driverPanelRobot.updatePanelRobot();
              }}
            />
            <ActionButtons
              settingIcon={this.settingIcon}
              onSellCoin={onSellCoin}
              actionInProcess={actionInProcess}
              setActionInProcess={(value) =>
                this.setState({ actionInProcess: value })
              }
            />
          </div>
          {hayMoneda && (
            <>
              <br />
              <CoinsOperating
                deletionTimers={deletionTimers}
                setDeletionTimers={setDeletionTimers}
                onExternalDeleteRef={window.onSellCoinRef}
                actionInProcess={actionInProcess}
                setActionInProcess={(value) =>
                  this.setState({ actionInProcess: value })
                }
              />
            </>
          )}
        </PaperP>
      </div>
    );
  }
}

window.fetchMetrics = async function (setState = () => 0) {
  const id_coin = driverParams.get("id_coin")[0];
  if (!id_coin) return;
  await HTTPGET_COINS_METRICS({
    id_coin,
    setLoading: (loading) => setState({ loadingMetrics: loading }),
    setError: (err) => setState({ errorMetrics: err }),
    setApiData: ([data]) => {
      if (!data) {
        console.log("[fetchMetrics]: No se recibio datos", id_coin);
        return;
      }
      setState({ coinMetric: data });
      changeValueInsertMoney(data.default_usdt_buy);
    },
  });
  try {
    driverPanelBalance.setTransactionMostRecent(await HTTPGET_BALANCECOIN());
  } catch (e) {
    console.error(e);
  }
};

window.calculateTimeToUpdate = function () {
  // MInutos actuales (en el sistema local)
  const currentMinute = calculate_minute_test();

  const next5MinMultiple = (() => {
    const nextMultiple = Math.ceil(currentMinute / 5);
    return 5 * nextMultiple - 1;
  })();

  window.msToUpdate = next5MinMultiple * 60 * 1000;

  function calculate_minute_test() {
    // MInutos actuales (en el sistema local)
    const currentMinute = new Date().getMinutes();
    // Porcentaje de minutos transcurridos para el multiplo de 5
    const percentDecimalTime = (currentMinute / 5) % 1;
    const inMultiple = +(percentDecimalTime == 0);
    return currentMinute + inMultiple;
  }
};
