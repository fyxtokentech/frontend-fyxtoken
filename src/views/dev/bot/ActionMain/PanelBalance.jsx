import React, { useState, useEffect } from "react";
import { Typography, Grid, Button, Tooltip, Chip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/Cached";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import fluidCSS from "@jeff-aporta/fluidcss";
import { TooltipIconButton, generate_selects } from "@recurrent";
import { PaperP } from "@components/containers";

import { AutoSkeleton } from "@components/controls";

import CoinsOperating from "./CoinsOperating";
import { putResponse } from "@api/requestTable";

const time_wait_update_available_again = 5;

export default function PanelBalance({
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
  user_id,
  onSellCoin,
  deletionTimers,
  setDeletionTimers,
}) {
  const [actionInProcess, setActionInProcess] = useState(false);

  // price projection in state for automatic re-renders
  const [priceProjectionValue, setPriceProjectionValue] = useState(-3);
  const flatNumber = 12345;
  const roi = 0.05; // 5% ROI
  const balanceUSDT = 10000; // Example USDT balance
  const balanceCoin = 2.5; // Example coin balance

  // Helper functions
  const getPriceProjectionColor = () => {
    if (priceProjectionValue > 0) return "ok";
    if (priceProjectionValue < 0) return "error";
    return "warning";
  };

  const getPriceProjectionIcon = () => {
    if (priceProjectionValue > 0) return <TrendingUpIcon />;
    if (priceProjectionValue < 0) return <TrendingDownIcon />;
    return <TrendingFlatIcon />;
  };

  const settingIcon = () => (
    <TooltipIconButton
      title="Ajustar API"
      onClick={() => setView("settings")}
      icon={
        <>
          <SettingsIcon /> <span style={{ fontSize: "14px" }}>API</span>
        </>
      }
    />
  );

  // Animation effect for price projection
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceProjectionValue((prev) => {
        const next = prev + 1 > 3 ? -3 : prev + 1;
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const hayMoneda = currency.current.trim() && !loadingCoinToOperate;

  return (
    <>
      <PaperP elevation={0}>
        <div className="d-flex ai-center jc-space-between flex-wrap gap-10px">
          <div className="d-flex ai-center flex-wrap gap-10px">
            <div
              className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS()
                .ltX(480, { width: "100%" })
                .end()}`}
            >
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
                  setUpdateAvailable
                }}
              />

              {hayMoneda && (
                <>
                  <BalanceUSDTCard
                    {...{
                      balance: balanceUSDT,
                    }}
                  />
                  <BalanceCoinCard
                    {...{
                      balance: balanceCoin,
                      currency: currency.current,
                    }}
                  />
                  <PriceProjectionCard
                    {...{
                      priceProjection: priceProjectionValue,
                      getPriceProjectionColor,
                      getPriceProjectionIcon,
                    }}
                  />
                  <FlatNumberCard flatNumber={flatNumber} />
                  <ROICard roi={roi} />
                </>
              )}
            </div>
          </div>

          {hayMoneda && (
            <ActionButtons
              {...{
                update_available,
                setUpdateAvailable,
                setView,
                settingIcon,
                currency,
                coinsOperatingList,
                coinsToOperate,
                onSellCoin,
                coinsToDelete,
                setErrorCoinOperate,
                user_id,
                actionInProcess,
                setActionInProcess,
              }}
            />
          )}
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
                setActionInProcess,
              }}
            />
          </>
        )}
      </PaperP>
    </>
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
              driverParams.set("coin", value);
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

function UpdateButton({ update_available, setUpdateAvailable, ...rest_props }) {
  return (
    <TooltipIconButton
      {...rest_props}
      title={() =>
        update_available ? "Actualizar" : "Espera para volver a actualizar"
      }
      icon={<UpdateIcon />}
      disabled={!update_available}
      onClick={() => {
        setUpdateAvailable(false);
        setTimeout(() => {
          setUpdateAvailable(true);
        }, time_wait_update_available_again * 1000);
      }}
    />
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
          Balance USDT
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
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Balance {currency}
        </Typography>
        <Typography>
          {balance.toLocaleString()} {currency}
        </Typography>
      </div>
    </PaperP>
  );
}

function PriceProjectionCard({
  priceProjection,
  getPriceProjectionColor,
  getPriceProjectionIcon,
}) {
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
          Precio Proyectado
        </Typography>
        <div className="d-flex ai-center gap-5px">
          <Typography
            className="d-flex ai-center gap-5px"
            color={getPriceProjectionColor()}
          >
            {getPriceProjectionIcon()}
            {priceProjection} BTC
          </Typography>
        </div>
      </div>
    </PaperP>
  );
}

function FlatNumberCard({ flatNumber }) {
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
          Ganancia Proyectada
        </Typography>
        <Typography>{flatNumber}</Typography>
      </div>
    </PaperP>
  );
}

function ROICard({ roi }) {
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
          Porcentaje Proyectado
        </Typography>
        <div className="d-flex ai-center gap-5px">
          <CurrencyExchangeIcon />
          <span>{(roi * 100).toFixed(2)}%</span>
        </div>
      </div>
    </PaperP>
  );
}

function ActionButtons({
  update_available,
  setUpdateAvailable,
  setView,
  settingIcon,
  currency,
  coinsOperatingList,
  coinsToOperate,
  onSellCoin,
  coinsToDelete,
  setErrorCoinOperate,
  user_id,
  actionInProcess,
  setActionInProcess,
}) {
  const { getCoinKey } = global;
  const hayMoneda = currency.current.trim();
  const monedaYaOperando = coinsOperatingList.current.some(
    (c) => getCoinKey(c) === currency.current
  );
  const monedasDisponibles = coinsOperatingList.current.length === 0;
  const monedaEnBorrado = coinsToDelete.current.some(
    (c) => getCoinKey(c) === currency.current
  );

  return (
    <div
      className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS()
        .ltX(768, {
          width: "100%",
          justifyContent: "flex-end",
          marginTop: "10px",
        })
        .end()}`}
    >
      <UpdateButton {...{ update_available, setUpdateAvailable }} />
      {settingIcon()}
      <div className="d-flex gap-10px">
        <Tooltip
          title={(() => {
            if (!hayMoneda) {
              return "Seleccione una moneda";
            }
            if (monedaYaOperando) {
              return "Moneda ya operando";
            }
            if (actionInProcess) {
              return "Espere...";
            }
            return "Operar";
          })()}
        >
          <div>
            <Operar
              disabled={!hayMoneda || monedaYaOperando || actionInProcess}
            />
          </div>
        </Tooltip>
        <Tooltip
          title={(() => {
            if (!hayMoneda) {
              return "Seleccione una moneda";
            }
            if (monedasDisponibles) {
              return "No hay monedas operando";
            }
            if (!monedaYaOperando) {
              return "Moneda no operando";
            }
            if (monedaEnBorrado) {
              return "Moneda en proceso de borrado";
            }
            if (actionInProcess) {
              return "Espere...";
            }
            return "Detener";
          })()}
        >
          <div>
            <Detener
              disabled={
                !hayMoneda ||
                monedasDisponibles ||
                !monedaYaOperando ||
                monedaEnBorrado ||
                actionInProcess
              }
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );

  function Operar(props) {
    return (
      <Button
        {...props}
        variant="contained"
        color="ok"
        size="small"
        onClick={async () => {
          if (!currency.current.trim()) {
            return;
          }
          const coinObj = coinsToOperate.current.find(
            (c) => getCoinKey(c) === currency.current
          );
          if (!coinObj) {
            return;
          }
          setActionInProcess(true);

          try {
            putResponse({
              buildEndpoint: ({ baseUrl }) => {
                return `${baseUrl}/coins/start/${user_id}/${coinObj.id}`;
              },
              setError: setErrorCoinOperate,
              willEnd,
            });
            // refresh operating coins list and UI
            coinsOperatingList.current = [
              ...coinsOperatingList.current,
              coinObj,
            ];
          } catch (err) {
            console.error("Error operando moneda:", err);
            willEnd();
          }

          function willEnd() {
            setActionInProcess(false);
            setUpdateAvailable((prev) => !prev);
          }
        }}
      >
        Operar
      </Button>
    );
  }

  function Detener(props) {
    return (
      <Button
        {...props}
        variant="contained"
        color="cancel"
        size="small"
        onClick={() => {
          setActionInProcess(true);
          onSellCoin(currency.current);
        }}
      >
        Detener
      </Button>
    );
  }
}
