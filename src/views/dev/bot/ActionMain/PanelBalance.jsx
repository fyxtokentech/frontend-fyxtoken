import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  Tooltip,
  Chip,
  TextField,
  Slider,
} from "@mui/material";
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
  viewTable,
  setViewTable,
}) {
  const [actionInProcess, setActionInProcess] = useState(false);

  // price projection in state for automatic re-renders
  const [priceProjectionValue, setPriceProjectionValue] = useState(-3);
  const flatNumber = 12345;
  const roi = 0.05; // 5% ROI
  const balanceUSDT = 10000; // Example USDT balance
  const balanceCoin = 2.5; // Example coin balance

  // Estado para input y slider de dinero proyectado
  const [inputValue, setInputValue] = useState(10);
  const [sliderExp, setSliderExp] = useState(Math.log10(10));
  const marks = [
    { value: 1, label: "10" },
    { value: 2, label: "100" },
    { value: 3, label: "1.000" },
    { value: 5, label: "100.000" },
  ];
  const valuetext = (exp) => `${Math.round(10 ** exp)} USD`;

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
    <div key={currency.current}>
      <PaperP elevation={0}>
        <div>
          <div>
            <div className={`d-flex ai-center jc-space-evenly`}>
              {hayMoneda && (
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  alignItems="stretch"
                  wrap="wrap"
                  sx={{ width: "100%" }}
                >
                  <Grid item xs={12} sm={12} md={3}>
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
                          <BalanceCoinCard
                            balance={balanceCoin}
                            currency={currency.current}
                          />
                        </div>
                      </div>
                    </PaperP>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <PaperP
                      className="d-center"
                      p_min="5"
                      p_max="10"
                      sx={{ width: "100%", height: "100%" }}
                    >
                      <div
                        className="d-flex flex-column gap-10px"
                        style={{ width: "100%" }}
                      >
                        <div
                          className="d-flex ai-center jc-space-between gap-10px"
                          style={{ width: "100%" }}
                        >
                          <PriceProjectionCard
                            priceProjection={priceProjectionValue}
                            getPriceProjectionColor={getPriceProjectionColor}
                            getPriceProjectionIcon={getPriceProjectionIcon}
                          />
                          <ROICard roi={roi} />
                        </div>
                        <FlatNumberCard flatNumber={flatNumber} />
                      </div>
                    </PaperP>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <PaperP
                      className="d-center"
                      p_min="5"
                      p_max="10"
                      sx={{ width: "100%", height: "100%" }}
                    >
                      <div
                        className="d-flex flex-column gap-5px"
                        style={{ width: "100%" }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Insertar Dinero
                        </Typography>
                        <TextField
                          type="number"
                          label="USD"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            min: 10,
                            max: 100000,
                            step: 1,
                            pattern: "[0-9]*",
                            inputMode: "numeric",
                          }}
                          value={inputValue}
                          onChange={(e) => {
                            const v = Math.floor(Number(e.target.value));
                            const b = Math.min(100000, Math.max(10, v));
                            setInputValue(b);
                            setSliderExp(Math.log10(b));
                          }}
                          sx={{ mt: 1, width: "100%" }}
                        />
                        <div className="d-center">
                          <Slider
                            aria-label="Custom marks"
                            value={sliderExp}
                            getAriaValueText={valuetext}
                            min={1}
                            max={5}
                            step={0.01}
                            valueLabelDisplay="auto"
                            valueLabelFormat={valuetext}
                            marks={marks}
                            onChange={(e, expVal) => {
                              setSliderExp(expVal);
                              const m = Math.round(10 ** expVal);
                              setInputValue(m);
                            }}
                            sx={{
                              width: "80%",
                              mt: 2,
                              "& .MuiSlider-mark": { width: 4, height: 4 },
                              "& .MuiSlider-markLabel": { fontSize: "0.65rem" },
                            }}
                          />
                        </div>
                      </div>
                    </PaperP>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
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
                setActionInProcess,
              }}
            />
          </>
        )}
      </PaperP>
    </div>
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

function UpdateButton({ update_available, setUpdateAvailable, ...rest_props }) {
  console.log(update_available);
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
    <PaperP elevation={3} p_min="5" p_max="10">
      <div className="d-flex flex-column gap-5px">
        <Typography
          variant="caption"
          color="text.secondary"
          className="mb-5px nowrap"
        >
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
      className={`d-flex ${fluidCSS()
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
        <Typography
          variant="caption"
          color="text.secondary"
          className="mb-5px nowrap"
        >
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
      className={`d-flex ai-center jc-end fullWidth flex-wrap gap-10px ${fluidCSS()
        .ltX(768, {
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
