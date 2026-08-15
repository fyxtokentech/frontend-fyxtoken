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
  showPromptDialog,
  showPromise,
} from "@jeff-aporta/camaleon";

import { Typography } from "@mui/material";
import { HTTPDELETE_COIN_ASSIGNMENT } from "@api";
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
          <small className="underline">Monedas disponibles para operar</small>
        </Typography>
        <br />
        <div className="flex col-direction justify-space-between gap-5px">
          <CoinSelectionOperate />
          <FromCoinMetrics>
            <PanelOfProjections />
          </FromCoinMetrics>
        </div>
      </PaperP>
    );
  }
}

class FromCoinMetrics extends React.Component {
  componentDidMount() {
    driverPanelBalance.addLinkLoadingCoinMetric(this);
  }
  componentWillUnmount() {
    driverPanelBalance.removeLinkLoadingCoinMetric(this);
  }

  render() {
    return (
      <WaitSkeleton loading={driverPanelBalance.getLoadingCoinMetric()}>
        {this.props.children}
      </WaitSkeleton>
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
    const { value, label, className } = this.props;
    const tooltip = label + ": " + value;
    return (
      <TooltipGhost title={tooltip}>
        <PaperP elevation={3} pad="small" className={className}>
          <Typography
            variant="caption"
            color="text.secondary"
            className="nowrap op-50"
            style={{ marginTop: "-5px" }}
            component="div"
          >
            <small>
              <small>
                <small>{label}</small>
              </small>
            </small>
          </Typography>
          <Typography variant="caption">
            <small>{value}</small>
          </Typography>
        </PaperP>
      </TooltipGhost>
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
      <div className="flex gap-5px ncols-2">
        <div className="cell">
          <this.listOfCoinsUser opns={opns} />
        </div>
        <div className="cell">
          <this.infoCoinMetricsBalances />
        </div>
      </div>
    );
  }

  listOfCoinsUser({ opns }) {
    return (
      <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
        {genSelectFast([
          {
            variant: "outlined",
            color: "secondary",
            value: () => {
              return driverPanelRobot.getCurrency();
            },
            onChange: async (e, value) => {
              if (
                driverPanelRobot.stringifyCurrency() == JSON.stringify(value)
              ) {
                return;
              }
              // handle clear/delete (value == null)
              if (!value) {
                const prev = driverPanelRobot.getCurrency();
                if (!prev) {
                  driverPanelRobot.setCurrency(value);
                  return;
                }
                const selected = driverPanelRobot.findKeyInCoinsToOperate([
                  prev,
                ]);
                if (!selected) {
                  driverPanelRobot.setCurrency(value);
                  return;
                }

                const inOperation = driverPanelRobot.isCurrencyInCoinsOperating();

                const doDelete = async () => {
                  await showPromise(`Eliminando ${selected.symbol}`, async (resolve) => {
                    HTTPDELETE_COIN_ASSIGNMENT({
                      user_id: window.currentUser.user_id,
                      coin_id: selected.id,
                      successful: async (json) => {
                        // recargar listas y esperar a que terminen
                        await driverPanelRobot.loadCoins();
                        resolve(`Eliminada ${selected.symbol}`);
                      },
                      failure: (info, reject) => {
                        reject(`No se pudo eliminar ${selected.symbol}`, resolve, info);
                      },
                    });
                  });
                };

                if (inOperation) {
                  const { success } = await showPromptDialog({
                    title: "La moneda está en operación",
                    description: `La moneda ${prev} está en operación. ¿Desea quitarla de sus seleccionadas?`,
                    okText: "Quitar",
                    cancelText: "Cancelar",
                  });
                  if (!success) {
                    return;
                  }
                  await doDelete();
                  // after reloading, if there are coins, select the first one
                  const coins = driverPanelRobot.getCoinsToOperate();
                  if (coins && coins.length > 0) {
                    const first = coins[0];
                    const key = driverPanelRobot.getCoinKey(first);
                    driverPanelRobot.setCurrency(key);
                    driverPanelRobot.setIdCoin(first.id);
                    driverPanelBalance.setLoadingCoinMetric(true);
                    driverPanelOfProjections.setLoading(true);
                    driverPanelRobot.fetchCoinMetrics();
                  } else {
                    driverPanelRobot.setCurrency(null);
                  }
                  return;
                }

                // no está en operación: eliminar directamente
                await doDelete();
                // after reloading, if there are coins, select the first one
                const coins2 = driverPanelRobot.getCoinsToOperate();
                if (coins2 && coins2.length > 0) {
                  const first2 = coins2[0];
                  const key2 = driverPanelRobot.getCoinKey(first2);
                  driverPanelRobot.setCurrency(key2);
                  driverPanelRobot.setIdCoin(first2.id);
                  driverPanelBalance.setLoadingCoinMetric(true);
                  driverPanelOfProjections.setLoading(true);
                  driverPanelRobot.fetchCoinMetrics();
                } else {
                  driverPanelRobot.setCurrency(null);
                }
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
    );
  }

  infoCoinMetricsBalances() {
    return (
      <FromCoinMetrics>
        <div className="flex justify-space-between gap-5px ncols-2">
          <BalanceGeneral
            label="Balance (USDC)"
            value={driverPanelOfProjections.mapCaseLoading("balanceUSD")}
            className="cell"
          />
          <BalanceGeneral
            label={`Balance (${driverPanelRobot.getCurrency()})`}
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
            className="cell"
          />
        </div>
      </FromCoinMetrics>
    );
  }
}
