import React from "react";
import {
  PaperP,
  isNullish,
  genSelectFast,
  driverParams,
  WaitSkeleton,
  idR,
  fluidCSS,
  TooltipGhost,
} from "@jeff-aporta/camaleon";

import { Typography } from "@mui/material";
import PanelOfProjections from "./PanelOfProjections.jsx";
import { driverPanelOfProjections } from "./PanelOfProjections.driver.js";
import { driverTables } from "@tables/tables.js";
import { driverPanelBalance } from "./PanelBalance.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";

export default class extends React.Component {
  componentDidMount() {
    driverPanelBalance.addLinkBalanceCoin(this);
    driverPanelRobot.addLinkLoadingCoinsToOperate(this);
    driverPanelRobot.addLinkCurrency(this);
    driverPanelOfProjections.addLinkCoinMetric(this);
    driverPanelOfProjections.addLinkLoading(this);
  }

  componentWillUnmount() {
    driverPanelBalance.removeLinkBalanceCoin(this);
    driverPanelRobot.removeLinkLoadingCoinsToOperate(this);
    driverPanelRobot.removeLinkCurrency(this);
    driverPanelOfProjections.removeLinkCoinMetric(this);
    driverPanelOfProjections.removeLinkLoading(this);
  }

  render() {
    return (
      <PaperP>
        <Typography variant="caption" color="secondary">
          <small className="underline">Moneda en operación</small>
        </Typography>
        <br />
        <div className="flex col-direction justify-space-between gap-5px">
          <CoinSelectionOperate />
          <WaitSkeleton loading={driverPanelOfProjections.getLoading()}>
            <PanelOfProjections />
          </WaitSkeleton>
        </div>
      </PaperP>
    );
  }
}

class BalanceGeneral extends React.Component {
  componentDidMount() {
    driverPanelBalance.addLinkBalanceCoin(this);
    driverPanelOfProjections.addLinkLoading(this);
    driverPanelOfProjections.addLinkCoinMetric(this);
  }

  componentWillUnmount() {
    driverPanelBalance.removeLinkBalanceCoin(this);
    driverPanelOfProjections.removeLinkLoading(this);
    driverPanelOfProjections.removeLinkCoinMetric(this);
  }

  render() {
    const { value, label } = this.props;
    const tooltip = label + ": " + value;
    return (
      <PaperP
        elevation={3}
        pad="small"
        className={`${fluidCSS().ltX(480, { width: "calc(33% - 5px)" }).end()}`}
      >
        <TooltipGhost title={tooltip}>
          <Typography
            variant="caption"
            color="text.secondary"
            className="mb-5px nowrap"
          >
            <small>{label}</small>
          </Typography>
          <br />
          <Typography variant="caption">
            <small>{value}</small>
          </Typography>
        </TooltipGhost>
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
      <div className="flex wrap gap-5px">
        <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
          {genSelectFast([
            {
              value: () => {
                return driverPanelRobot.getCurrency();
              },
              onChange: (e, value) => {
                if (
                  driverPanelRobot.stringifyCurrency() == JSON.stringify(value)
                ) {
                  return;
                }
                driverPanelRobot.setCurrency(value);
                driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
                const selected = driverPanelRobot.findKeyInCoinsToOperate([
                  value,
                ]);
                if (selected) {
                  driverPanelRobot.setIdCoin(selected.id);
                }
                driverPanelBalance.setLoadingCoinMetric(true);
                driverPanelOfProjections.setLoading(true);
                driverPanelRobot.fetchCoinMetrics();
                driverTables.refetch(true);
              },
              name: "currency",
              opns,
              required: true,
              fem: true,
            },
          ])}
        </WaitSkeleton>
        <WaitSkeleton loading={driverPanelOfProjections.getLoading()}>
          <div className="flex gap-5px">
            <BalanceGeneral
              label="Balance USDC"
              value={(() => {
                return driverPanelOfProjections.getLoading()
                  ? "---"
                  : driverPanelBalance.getBalanceCoin().toLocaleString();
              })()}
            />
            <BalanceGeneral
              label={`Balance ${driverPanelRobot.getCurrency()}`}
              value={(() => {
                let total_tokens = "---";
                if (!driverPanelOfProjections.getLoading()) {
                  ({ total_tokens } = driverPanelOfProjections.getCoinMetric());
                  if (!total_tokens) {
                    total_tokens = "N/A";
                  } else {
                    total_tokens = total_tokens.toLocaleString();
                  }
                }
                return total_tokens;
              })()}
            />
          </div>
        </WaitSkeleton>
      </div>
    );
  }
}
