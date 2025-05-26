import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Cached";
import { IconButtonWithTooltip, TooltipNoPointerEvents } from "@recurrent";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import fluidCSS from "@jeff-aporta/fluidcss";
import { http_put_coin_start, http_put_coin_stop } from "@api/mocks";
import { showSuccess, showWarning } from "@templates";

export default function ActionButtons({
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
  const [autoOpEnabled, setAutoOpEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const hayMoneda = currency.current.trim();
  const monedaYaOperando = coinsOperatingList.current.some(
    (c) => getCoinKey(c) === currency.current
  );
  const monedasDisponibles = coinsOperatingList.current.length === 0;
  const monedaEnBorrado = coinsToDelete.current.some(
    (c) => getCoinKey(c) === currency.current
  );
  const pauseDisabled = [
    !hayMoneda,
    !monedaYaOperando,
    monedaEnBorrado,
    actionInProcess,
  ].reduce((a, b) => a || b, false);

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
      <div className="d-flex wrap jc-end gap-10px">
        <TooltipNoPointerEvents
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
        </TooltipNoPointerEvents>
        <TooltipNoPointerEvents
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
        </TooltipNoPointerEvents>
        <hr />
        <TooltipNoPointerEvents title="Auto-op">
          <div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setAutoOpEnabled(!autoOpEnabled)}
            >
              <small>Auto-op</small>
            </Button>
          </div>
        </TooltipNoPointerEvents>
        <TooltipNoPointerEvents title={isPaused ? "Reanudar" : "Pausar"}>
          <div>
            <Button
              variant="contained"
              color={isPaused ? "success" : "warning"}
              disabled={pauseDisabled}
              size="small"
              sx={{ width: 80 }}
              onClick={async () => {
                console.log("isPaused", isPaused);
                const coinObj = coinsToOperate.current.find(
                  (c) => getCoinKey(c) === currency.current
                );
                if (!coinObj) {
                  return;
                }
                setActionInProcess(true);
                if (!isPaused) {
                  await http_put_coin_stop({
                    user_id,
                    id_coin: coinObj.id,
                    setError: setErrorCoinOperate,
                    successful: () => {
                      showSuccess(`Se detuvo (${coinObj.symbol})`);
                    },
                    failure: () => {
                      showWarning(`Algo salió mal al detener en ${coinObj.symbol}`);
                    },
                  });
                } else {
                  await http_put_coin_start({
                    user_id,
                    id_coin: coinObj.id,
                    setError: setErrorCoinOperate,
                    successful: () => {
                      showSuccess(`Se reanudo (${coinObj.symbol})`);
                    },
                    failure: () => {
                      showWarning(`Algo salió mal al reanudar en ${coinObj.symbol}`);
                    },
                  });
                }
                setIsPaused(!isPaused);
                setActionInProcess(false);
              }}
            >
              {isPaused ? (
                <PlayArrowIcon fontSize="small" />
              ) : (
                <PauseIcon fontSize="small" />
              )}
              <small>{isPaused ? "Reanudar" : "Pausar"}</small>
            </Button>
          </div>
        </TooltipNoPointerEvents>
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
            const putResult = await http_put_coin_start({
              id_coin: coinObj.id,
              setError: setErrorCoinOperate,
              successful: () => {
                showSuccess(`Se empieza a operar (${coinObj.symbol})`);
              },
              failure: () => {
                showWarning(`Algo salió mal al operar en ${coinObj.symbol}`);
              },
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
        <small>Operar</small>
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
        <small>Detener</small>
      </Button>
    );
  }
}

function UpdateButton({ update_available, setUpdateAvailable, ...rest_props }) {
  return (
    <IconButtonWithTooltip
      {...rest_props}
      title={() =>
        update_available ? "Actualizar" : "Espera para volver a actualizar"
      }
      icon={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <UpdateIcon />
          <Typography variant="caption" color="text.secondary">
            <small>Actualizar</small>
          </Typography>
        </div>
      }
      disabled={!update_available}
      onClick={() => {
        setUpdateAvailable(false);
        setTimeout(() => {
          setUpdateAvailable(true);
        }, window["SECONDS_TO_UPDATE_AGAIN"] * 1000);
      }}
    />
  );
}
