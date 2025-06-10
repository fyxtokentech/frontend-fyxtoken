import React, { Component } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import { Typography, Grid, Chip, TextField, Slider } from "@mui/material";

import fluidCSS from "@jeff-aporta/fluidcss";
import { getThemeLuminance } from "@jeff-aporta/theme-manager";

import {
  IconButtonWithTooltip,
  TooltipNoPointerEvents,
  generate_selects,
} from "@recurrent";

import { PaperP } from "@components/containers";
import { AutoSkeleton } from "@components/controls";
import { HTTPGET_COINS_METRICS } from "@api";

import ActionButtons from "./ActionButtons";
import CoinsOperating from "./CoinsOperating";
import PanelCoinSelected from "./PanelCoinSelected";
import PanelOfInsertMoney from "./PanelOfInsertMoney";
import PanelOfProjections from "./PanelOfProjections";

import { vars_PanelOfInsertMoney } from "./PanelOfInsertMoney";
import { panelProjectionsState } from "./PanelOfProjections";

export default class PanelBalance extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  settingIcon = () => (
    <IconButtonWithTooltip
      title="Configurar"
      onClick={() => this.props.setView("settings")}
      icon={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SettingsIcon />
          <Typography variant="caption" color="text.secondary">
            <small>Configurar</small>
          </Typography>
        </div>
      }
    />
  );

  render() {
    const {
      currency,
      update_available,
      setUpdateAvailable,
      setView,
      coinsOperatingList,
      coinsToOperate,
      loadingCoinToOperate,
      coinsToDelete,
      errorCoinOperate,
      setErrorCoinOperate,
      onSellCoin,
      deletionTimers,
      setDeletionTimers,
      viewTable,
      setViewTable,
    } = this.props;
    // Usar los estados globales en vez del state local
    const { actionInProcess } = vars_PanelOfInsertMoney;
    const flatNumber = 12345;
    const roi = 0;
    const balanceUSDT = 10000; // Example USDT balance
    const balanceCoin = 2.5; // Example coin balance

    const hayMoneda = currency.current.trim() && !loadingCoinToOperate;

    return (
      <div key={currency.current}>
        <PaperP elevation={0}>
          <div className={`flex wrap stretch space-between gap-10px`}>
            <PanelCoinSelected
              {...{
                currency,
                coinsToOperate,
                coinsToDelete,
                loadingCoinToOperate,
                errorCoinOperate,
                setErrorCoinOperate,
                coinsOperatingList,
                setUpdateAvailable,
                viewTable,
                setViewTable,
                balanceUSDT,
                balanceCoin,
              }}
            />
            <PanelOfProjections flatNumber={flatNumber} />
            <PanelOfInsertMoney
              setInputValue={(value) => {
                vars_PanelOfInsertMoney.inputValue = value;
                this.forceUpdate();
              }}
              setSliderExp={(exp) => {
                vars_PanelOfInsertMoney.sliderExp = exp;
                this.forceUpdate();
              }}
            />
            <ActionButtons
              {...{
                update_available,
                setUpdateAvailable,
                setView,
                settingIcon: this.settingIcon,
                currency,
                coinsOperatingList,
                coinsToOperate,
                onSellCoin,
                coinsToDelete,
                setErrorCoinOperate,
                actionInProcess,
                setActionInProcess: (value) =>
                  this.setState({ actionInProcess: value }),
              }}
            />
          </div>
          {hayMoneda && (
            <>
              <br />
              <CoinsOperating
                {...{
                  coinsOperatingList,
                  coinsToDelete,
                  deletionTimers,
                  setDeletionTimers,
                  onExternalDeleteRef: window.onSellCoinRef,
                  setErrorCoinOperate,
                  setUpdateAvailable,
                  actionInProcess,
                  setActionInProcess: (value) =>
                    this.setState({ actionInProcess: value }),
                }}
              />
            </>
          )}
        </PaperP>
      </div>
    );
  }
}

window.fetchMetrics = async function (setState = () => 0) {
  const { driverParams } = global;
  const id_coin = driverParams.get("id_coin");
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
    },
  });
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
