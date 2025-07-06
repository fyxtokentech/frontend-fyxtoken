import React from "react";
import { PaperP } from "@jeff-aporta/camaleon";
import {
  genSelectFast,
  driverParams,
  WaitSkeleton,
  idR,
} from "@jeff-aporta/camaleon";
import { fluidCSS } from "@jeff-aporta/camaleon";
import { Typography } from "@mui/material";
import { getCoinMetric } from "./PanelOfProjections";
import { driverPanelRobot } from "../../../bot.jsx";

import { driverTables } from "@tables/tables.js";
import { driverPanelBalance } from "./PanelBalance.jsx";

let SINGLETON;
const dataMetricFreeze = {};

export const driverPanelCoinSelected = {
  getCoinSelected: () => driverPanelRobot.getCurrency(),
  getTotalTokens: () => getCoinMetric().total_tokens,
  getCurrentPrice: () => getCoinMetric().current_price,
  someChangeDataMetricFreeze: () => {
    const prevTotalTokens = dataMetricFreeze.total_tokens;
    const currentTotalTokens = driverPanelCoinSelected.getTotalTokens();
    const prevCurrentPrice = dataMetricFreeze.current_price;
    const currentCurrentPrice = driverPanelCoinSelected.getCurrentPrice();
    const prevCoinSelected = dataMetricFreeze.coinSelected;
    const currentCoinSelected = driverPanelCoinSelected.getCoinSelected();
    const prevLoading = dataMetricFreeze.loading;
    const currentLoading = driverPanelRobot.getLoadingCoinsToOperate();
    const tokensChange = prevTotalTokens != currentTotalTokens;
    const priceChange = prevCurrentPrice != currentCurrentPrice;
    const coinChange = prevCoinSelected != currentCoinSelected;
    const loadingChange = prevLoading != currentLoading;
    return tokensChange || priceChange || coinChange || loadingChange;
  },
  updateDataMetricFreeze: () =>
    Object.assign(dataMetricFreeze, {
      total_tokens: driverPanelCoinSelected.getTotalTokens(),
      current_price: driverPanelCoinSelected.getCurrentPrice(),
      coinSelected: driverPanelCoinSelected.getCoinSelected(),
      loading: driverPanelRobot.getLoadingCoinsToOperate(),
    }),
};

export default class extends React.Component {
  componentDidMount() {
    SINGLETON = this;
    this.updateRecursive();
  }

  updateRecursive() {
    if (SINGLETON != this) {
      return;
    }
    if (driverPanelCoinSelected.someChangeDataMetricFreeze()) {
      driverPanelCoinSelected.updateDataMetricFreeze();
      SINGLETON.forceUpdate();
      setTimeout(() => SINGLETON.updateRecursive(), 5000);
    } else {
      setTimeout(() => SINGLETON.updateRecursive(), 500);
    }
  }

  render() {
    return (
      <PaperP elevation={3}>
        <div className="gap-10px flex col-direction justify-space-between">
          <CoinSelectionOperate />
          <div className="flex justify-space-evenly flex-row gap-10px">
            <BalanceUSDTCard />
            <BalanceCoinCard />
          </div>
        </div>
      </PaperP>
    );
  }
}

class BalanceUSDTCard extends React.Component {
  componentDidMount() {
    driverPanelBalance.addLinkTransactionMostRecent(this);
  }

  componentWillUnmount() {
    driverPanelBalance.removeLinkTransactionMostRecent(this);
  }

  render() {
    const balance = driverPanelBalance.getTransactionMostRecent();
    return (
      <PaperP
        className={`d-center ${fluidCSS()
          .ltX(480, { width: "calc(33% - 5px)" })
          .end()}`}
        elevation={3}
        p_min="5"
        p_max="10"
      >
        <div className="flex col-direction gap-5px">
          <div className="nowrap">
            <Typography
              variant="caption"
              color="text.secondary"
              className="mb-5px"
            >
              Balance USDC
            </Typography>
          </div>

          <Typography>{balance.toLocaleString()}</Typography>
        </div>
      </PaperP>
    );
  }
}

class BalanceCoinCard extends React.Component {
  render() {
    const { total_tokens = 0 } = getCoinMetric();
    return (
      <PaperP
        className={`d-center ${fluidCSS()
          .ltX(480, { width: "calc(33% - 5px)" })
          .end()}`}
        elevation={3}
        p_min="5"
        p_max="10"
      >
        <div className="flex col-direction gap-5px">
          <Typography
            variant="caption"
            color="text.secondary"
            className="nowrap"
          >
            Balance {driverPanelRobot.getCurrency()}
          </Typography>
          <Typography>{(total_tokens ?? 0).toLocaleString()}</Typography>
        </div>
      </PaperP>
    );
  }
}

class CoinSelectionOperate extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    driverPanelRobot.addLinkCurrency(this);
    driverPanelRobot.addLinkCoinsToOperate(this);
  }

  componentWillUnmount() {
    driverPanelRobot.removeLinkCurrency(this);
    driverPanelRobot.removeLinkCoinsToOperate(this);
  }

  render() {
    const opns = driverPanelRobot.mapToKeysCoinsToOperate();

    return (
      <PaperP className="d-center">
        <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
          {genSelectFast([
            {
              value: () => {
                return driverPanelRobot.getCurrency();
              },
              onChange: (e, value) => {
                driverPanelRobot.setCurrency(value);
                driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
                const selected = driverPanelRobot.findKeyInCoinsToOperate([
                  value,
                ]);
                if (selected) {
                  driverPanelRobot.setIdCoin(selected.id);
                }
                driverTables.refetch();
              },
              name: "currency",
              label: "Moneda",
              opns,
              required: true,
              fem: true,
            },
          ])}
        </WaitSkeleton>
      </PaperP>
    );
  }
}
