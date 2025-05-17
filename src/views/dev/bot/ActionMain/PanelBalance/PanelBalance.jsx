import React, { Component } from "react";
import { Typography, Grid, Chip, TextField, Slider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import fluidCSS from "@jeff-aporta/fluidcss";
import {
  TooltipIconButton,
  TooltipNoPointerEvents,
  generate_selects,
} from "@recurrent";
import ActionButtons from "./ActionButtons";
import { PaperP } from "@components/containers";
import { AutoSkeleton } from "@components/controls";
import CoinsOperating from "./CoinsOperating";
import { getResponse } from "@api/requestTable";
import { getThemeLuminance } from "@jeff-aporta/theme-manager";

import PanelCoinSelected from "./PanelCoinSelected";
import PanelOfInsertMoney from "./PanelOfInsertMoney";
import PanelOfProjections from "./PanelOfProjections";

export default class PanelBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionInProcess: false,
      priceProjectionValue: -3,
      inputValue: 10,
      sliderExp: Math.log10(10),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prev) => ({
        priceProjectionValue:
          prev.priceProjectionValue + 1 > 3
            ? -3
            : prev.priceProjectionValue + 1,
      }));
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  valuetext(exp) {
    return `${Math.round(10 ** exp)} USD`;
  }

  getPriceProjectionColor() {
    const { priceProjectionValue } = this.state;
    if (priceProjectionValue > 0) return "ok";
    if (priceProjectionValue < 0) return "error";
    return "warning";
  }

  getPriceProjectionIcon() {
    const { priceProjectionValue } = this.state;
    if (priceProjectionValue > 0) return <TrendingUpIcon />;
    if (priceProjectionValue < 0) return <TrendingDownIcon />;
    return <TrendingFlatIcon />;
  }

  settingIcon = () => (
    <TooltipIconButton
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
      user_id,
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
    const { actionInProcess, priceProjectionValue, inputValue, sliderExp } =
      this.state;
    const flatNumber = 12345;
    const roi = 0;
    const balanceUSDT = 10000; // Example USDT balance
    const balanceCoin = 2.5; // Example coin balance
    const marks = [
      { value: 1, label: "10" },
      { value: 2, label: "100" },
      { value: 3, label: "1.000" },
      { value: 4, label: "10.000" },
      { value: 5, label: "100.000" },
    ];

    const hayMoneda = currency.current.trim() && !loadingCoinToOperate;

    return (
      <div key={currency.current}>
        <PaperP elevation={0}>
          <div>
            <div>
              <div className={`d-flex ai-center jc-space-between`}>
                {hayMoneda && (
                  <Grid
                    container
                    direction="row"
                    spacing={1}
                    alignItems="stretch"
                    justifyContent="space-between"
                    wrap="wrap"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={2.6}
                      className="d-flex ai-stretch"
                    >
                      <PanelCoinSelected
                        {...{
                          currency,
                          coinsToOperate,
                          coinsToDelete,
                          loadingCoinToOperate,
                          errorCoinOperate,
                          setErrorCoinOperate,
                          user_id,
                          coinsOperatingList,
                          setUpdateAvailable,
                          viewTable,
                          setViewTable,
                          balanceUSDT,
                          balanceCoin,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <PanelOfProjections
                        {...{
                          user_id,
                          flatNumber,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <PanelOfInsertMoney
                        {...{
                          inputValue,
                          setInputValue: (value) =>
                            this.setState({ inputValue: value }),
                          setSliderExp: (exp) =>
                            this.setState({ sliderExp: exp }),
                          sliderExp,
                          valuetext: this.valuetext,
                          marks,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
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
                          user_id,
                          actionInProcess,
                          setActionInProcess: (value) =>
                            this.setState({ actionInProcess: value }),
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </div>
            </div>
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
                  user_id,
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

window.fetchMetrics = async function (props, setState = () => 0) {
  const { user_id } = props;
  const { driverParams } = global;
  const id_coin = driverParams.get("id_coin");
  if (!id_coin) return;
  setState({ loadingMetrics: true });
  try {
    await getResponse({
      setError: (err) => setState({ errorMetrics: err }),
      setLoading: (loading) => {
        setState({ loadingMetrics: loading });
      },
      setApiData: ([data]) => {
        if (!data) {
          console.log("No data received");
          return;
        }
        console.log(data);
        setState({ coinMetric: data });
      },
      buildEndpoint: ({ baseUrl }) => {
        return `${baseUrl}/coins/metrics/${user_id}/${id_coin}`;
      },
    });
  } catch (err) {
    setState({ errorMetrics: err.message });
  } finally {
    setState({ loadingMetrics: false });
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
