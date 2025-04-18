import React, { useState, useEffect, useRef } from "react";
import { Typography, Grid, Button, Tooltip, Chip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/Cached";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import fluidCSS from "@jeff-aporta/fluidcss";
import { TooltipIconButton, generate_selects } from "@recurrent";
import { PaperP } from "@containers";

import { AutoSkeleton } from "@app/theme/components/controls";

import CoinsOperating from "./CoinsOperating";

const time_wait_update_available_again = 5;

export default function PanelBalance({
  currency,
  update_available,
  setUpdateAvailable,
  setView,
  coinsOperatingList,
  coinsToOperate,
  loadingCoinToOperate,
  setLoadingCoinToOperate,
  coinsToDelete,
  errorCoinOperate,
  setErrorCoinOperate,
  user_id,
  onSellCoin,
  deletionTimers,
  setDeletionTimers,
}) {
  const [, forceUpdatePanelBalance] = useState({});
  // State for price projection animation
  const priceProjection = useRef(-3);
  const flatNumber = 12345;
  const roi = 0.05; // 5% ROI
  const balanceUSDT = 10000; // Example USDT balance
  const balanceCoin = 2.5; // Example coin balance

  // Helper functions
  const getPriceProjectionColor = () => {
    if (priceProjection.current > 0) {
      return "ok";
    }
    if (priceProjection.current < 0) {
      return "error";
    }
    return "warning";
  };

  const getPriceProjectionIcon = () => {
    if (priceProjection.current > 0) {
      return <TrendingUpIcon />;
    }
    if (priceProjection.current < 0) {
      return <TrendingDownIcon />;
    }
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

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = priceProjection.current + 1;
      const finalValue = newValue > 3 ? -3 : newValue;
      priceProjection.current = finalValue;
      // Forzar renderizado si es necesario
      forceUpdatePanelBalance({});
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const hayMoneda = currency.current.trim();

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
                  forceUpdate: forceUpdatePanelBalance,
                  coinsToOperate,
                  coinsToDelete,
                  loadingCoinToOperate,
                  setLoadingCoinToOperate,
                  errorCoinOperate,
                  setErrorCoinOperate,
                  user_id,
                  coinsOperatingList,
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
                      priceProjection: priceProjection.current,
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
                forceUpdatePanelBalance,
                onSellCoin,
                coinsToDelete,
              }}
            />
          )}
        </div>
        <br />
        <CoinsOperating
          {...{
            coinsOperatingList,
            coinsToDelete,
            deletionTimers,
            setDeletionTimers,
            forceUpdatePanelBalance,
            onExternalDeleteRef: window.onSellCoinRef,
          }}
        />
      </PaperP>
    </>
  );
}

function CoinSelectionOperate({
  currency,
  forceUpdate,
  coinsToOperate,
  coinsToDelete,
  loadingCoinToOperate,
  setLoadingCoinToOperate,
  errorCoinOperate,
  setErrorCoinOperate,
  user_id,
  coinsOperatingList,
}) {
  // Solo mostrar monedas que NO están en operación actualmente
  const opns = coinsToOperate.current;

  return (
    <PaperP className="d-center" p_min="5" p_max="10">
      <AutoSkeleton loading={loadingCoinToOperate} w="200px" h="48px">
        {generate_selects([
          {
            value: currency.current,
            setter: (value) => {
              currency.current = value;
              forceUpdate({});
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
  onSellCoin,
  forceUpdatePanelBalance,
  coinsToDelete,
}) {
  const hayMoneda = currency.current.trim();
  const monedasLimiteAlcanzado = coinsOperatingList.current.length >= 3;
  const monedaYaOperando = coinsOperatingList.current.some(
    (c) => c.title === currency.current
  );
  const monedasDisponibles = coinsOperatingList.current.length === 0;
  const monedaEnBorrado = coinsToDelete.current.some(
    (c) => c.title === currency.current
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
            if (monedasLimiteAlcanzado) {
              return "Solo 3 monedas";
            }
            if (monedaYaOperando) {
              return "Moneda ya operando";
            }
            return "Comprar";
          })()}
        >
          <div>
            <Comprar
              disabled={
                !hayMoneda || monedasLimiteAlcanzado || monedaYaOperando
              }
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
            return "Vender";
          })()}
        >
          <div>
            <Vender
              disabled={
                !hayMoneda ||
                monedasDisponibles ||
                !monedaYaOperando ||
                monedaEnBorrado
              }
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );

  function Vender(props) {
    return (
      <Button
        {...props}
        variant="contained"
        color="cancel"
        size="small"
        onClick={() => {
          onSellCoin(currency.current, forceUpdatePanelBalance);
        }}
      >
        Vender
      </Button>
    );
  }

  function Comprar(props) {
    return (
      <Button
        {...props}
        variant="contained"
        color="ok"
        size="small"
        onClick={() => {
          if (!currency.current || currency.current.trim() === "") {
            return;
          }
          coinsOperatingList.current = [
            ...coinsOperatingList.current,
            { title: currency.current },
          ];
          // currency.current = "";
          forceUpdatePanelBalance({});
        }}
      >
        Comprar
      </Button>
    );
  }
}
