import React from "react";
import { PaperP } from "@jeff-aporta/camaleon";
import { AutoSkeleton } from "@components/controls";
import { genSelectFast, driverParams } from "@jeff-aporta/camaleon";
import { fluidCSS } from "@jeff-aporta/camaleon";
import { Typography } from "@mui/material";
import { getCoinMetric } from "./PanelOfProjections";
import { updateTableOperations } from "@tables/operations/TableOperations";

export default class extends React.Component {
  render() {
    const {
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
    } = this.props;

    class Balance extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
        this.coinSelected = getCoinSelected();
        const { total_tokens, current_price } = getCoinMetric();
        this.total_tokens = total_tokens;
        this.current_price = current_price;
        this.isAlive = true;
      }

      componentDidMount() {
        this.updateRecursive();
      }

      componentWillUnmount() {
        this.isAlive = false;
      }

      updateRecursive() {
        if (!this.isAlive) {
          return;
        }
        const { total_tokens, current_price } = getCoinMetric();
        const coinSelected = getCoinSelected();
        const propsUpdate = {
          total_tokens,
          current_price,
          coinSelected,
        };
        const someChange = Object.entries(propsUpdate).some(
          ([key, value]) => this[key] != value
        );

        if (someChange) {
          Object.entries(propsUpdate).forEach(([key, value]) => {
            this[key] = value;
          });
          this.forceUpdate();
        }

        setTimeout(() => this.updateRecursive(), 500);
      }
    }

    class BalanceUSDTCard extends Balance {
      render() {
        const { total_tokens = 0, current_price = 0 } = getCoinMetric();
        const balance = total_tokens * current_price;
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

              <Typography>{(balance ?? 0).toLocaleString()}</Typography>
            </div>
          </PaperP>
        );
      }
    }

    class BalanceCoinCard extends Balance {
      render() {
        const { currency } = this.props;
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
                Balance {currency}
              </Typography>
              <Typography>{(total_tokens ?? 0).toLocaleString()}</Typography>
            </div>
          </PaperP>
        );
      }
    }

    return (
      <PaperP elevation={3}>
        <div className="gap-10px flex col-direction justify-space-between">
          <CoinSelectionOperate
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
            }}
          />
          <div className="flex justify-space-evenly flex-row gap-10px">
            <BalanceUSDTCard balance={balanceUSDT} />
            <BalanceCoinCard
              balance={balanceCoin}
              currency={currency.current}
            />
          </div>
        </div>
      </PaperP>
    );
  }
}

const vars_PanelCoinSelected = {
  coinSelected: null,
};

function updateCoinSelected(currency) {
  vars_PanelCoinSelected.coinSelected = currency.current;
}

function getCoinSelected() {
  return vars_PanelCoinSelected.coinSelected;
}

function CoinSelectionOperate({
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
}) {
  const { getCoinKey } = window;
  // Solo mostrar símbolos de monedas que NO están en operación actualmente
  const opns = coinsToOperate.current.map(
    (coin) => coin.symbol || coin.name || coin.id || "-"
  );
  updateCoinSelected(currency);

  return (
    <PaperP className="d-center">
      <AutoSkeleton loading={loadingCoinToOperate} w="200px" h="48px">
        {genSelectFast([
          {
            value: currency.current,
            onChange: (e, value) => {
              currency.current = value;
              updateCoinSelected(currency);
              driverParams.set("view-table", "operations");
              driverParams.set("coin", value);
              setViewTable("operations");
              const selected = coinsToOperate.current.find(
                (c) => getCoinKey(c) === value
              );
              if (selected) {
                driverParams.set("id_coin", selected.id);
              }
              setUpdateAvailable((prev) => !prev);
              updateTableOperations();
            },
            name: "currency",
            label: "Moneda",
            opns,
            required: true,
            fem: true,
          },
        ])}
      </AutoSkeleton>
      {errorCoinOperate && (
        <span style={{ color: "red", fontSize: 12 }}>
          Error: {errorCoinOperate}
        </span>
      )}
    </PaperP>
  );
}
