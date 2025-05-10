import React from "react";
import { PaperP } from "@containers";
import { AutoSkeleton } from "@components/controls";
import { generate_selects } from "@recurrent";
import fluidCSS from "@jeff-aporta/fluidcss";
import { Typography } from "@mui/material";

export default function PanelCoinSelected({
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
}) {
  return (
    <PaperP elevation={3} p_min="5" p_max="10">
      <div className="gap-10px flex-column">
        <CoinSelectionOperate
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
          }}
        />
        <div className="d-flex jc-space-evenly flex-row gap-10px">
          <BalanceUSDTCard balance={balanceUSDT} />
          <BalanceCoinCard balance={balanceCoin} currency={currency.current} />
        </div>
      </div>
    </PaperP>
  );
}

function CoinSelectionOperate({
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
}) {
  const { driverParams, getCoinKey } = global;
  // Solo mostrar símbolos de monedas que NO están en operación actualmente
  const opns = coinsToOperate.current.map(
    (coin) => coin.symbol || coin.name || coin.id || "-"
  );

  return (
    <PaperP className="d-center" p_min="5" p_max="10">
      <AutoSkeleton loading={loadingCoinToOperate} w="200px" h="48px">
        {generate_selects([
          {
            value: currency.current,
            setter: (value) => {
              currency.current = value;
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

function BalanceUSDTCard({ balance }) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Balance USDC
        </Typography>
        <Typography>${balance.toLocaleString()}</Typography>
      </div>
    </PaperP>
  );
}

function BalanceCoinCard({ balance, currency }) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography
          variant="caption"
          color="text.secondary"
          className="mb-5px nowrap"
        >
          Balance {currency}
        </Typography>
        <Typography>
          {balance.toLocaleString()} {currency}
        </Typography>
      </div>
    </PaperP>
  );
}
