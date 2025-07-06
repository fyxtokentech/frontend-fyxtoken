import React, { useState, Component } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Cached";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import {
  fluidCSS,
  TooltipGhost,
  IconButtonWithTooltip,
  showSuccess,
  showWarning,
  showError,
  Design,
  Layer,
  AnimateComponent,
  showPromise,
  WaitSkeleton,
} from "@jeff-aporta/camaleon";
import { HTTPPUT_COINS_START, HTTPPUT_COINS_STOP } from "@api";
import { driverPanelRobot } from "../../../bot.jsx";

import { driverActionMain } from "../ActionMain.jsx";
import { driverTables } from "@tables/tables.js";

let SINGLETON_UPDATE_BUTTON;

export const driverActionButtons = {
  reRenderUpdateButton: () =>
    SINGLETON_UPDATE_BUTTON && SINGLETON_UPDATE_BUTTON.forceUpdate(),
};

export default function ActionButtons({
  settingIcon,
  onSellCoin,
  actionInProcess,
  setActionInProcess,
}) {
  const user_id = window.currentUser.user_id;
  const [autoOpEnabled, setAutoOpEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const monedaYaOperando = driverPanelRobot
    .getCoinsOperating()
    .some(
      (c) => driverPanelRobot.getCoinKey(c) === driverPanelRobot.getCurrency()
    );
  const monedasDisponibles = driverPanelRobot.getCoinsOperating().length === 0;
  const monedaEnBorrado = driverPanelRobot
    .getCoinsToDelete()
    .some(
      (c) => driverPanelRobot.getCoinKey(c) === driverPanelRobot.getCurrency()
    );
  const pauseDisabled = [
    !driverPanelRobot.getCurrency(),
    !monedaYaOperando,
    monedaEnBorrado,
    actionInProcess,
  ].reduce((a, b) => a || b, false);

  return (
    <div className="inline-flex align-end col-direction gap-10px">
      <div className="flex">
        <UpdateButton />
        {settingIcon()}
      </div>
      <div className="flex wrap gap-10px">
        <ButtonOperate />
        <ButtonStop />
      </div>
      <hr />
      <div className="flex wrap gap-10px">
        <ButtonAutoOp />
        <ButtonPauseResume />
      </div>
    </div>
  );

  function ButtonPauseResume() {
    return (
      <TooltipGhost title={isPaused ? "Reanudar" : "Pausar"}>
        <div>
          <Button
            variant="contained"
            color={isPaused ? "success" : "warning"}
            disabled={pauseDisabled}
            size="small"
            sx={{ width: 80 }}
            onClick={async () => {
              const coinObj = driverPanelRobot.findCurrencyInCoinsToOperate();
              if (!coinObj) {
                return;
              }
              setActionInProcess(true);
              if (!isPaused) {
                await HTTPPUT_COINS_STOP({
                  user_id,
                  id_coin: coinObj.id,
                  successful: () => {
                    showSuccess(`Se detuvo (${coinObj.symbol})`);
                  },
                  failure: () => {
                    showWarning(
                      `Algo salió mal al detener en ${coinObj.symbol}`
                    );
                  },
                });
              } else {
                await HTTPPUT_COINS_START({
                  user_id,
                  id_coin: coinObj.id,
                  successful: () => {
                    showSuccess(`Se reanudo (${coinObj.symbol})`);
                  },
                  failure: () => {
                    showWarning(
                      `Algo salió mal al reanudar en ${coinObj.symbol}`
                    );
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
      </TooltipGhost>
    );
  }

  function ButtonAutoOp() {
    return (
      <TooltipGhost title="Auto-op">
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
      </TooltipGhost>
    );
  }

  function ButtonStop() {
    return (
      <TooltipGhost
        title={(() => {
          if (!driverPanelRobot.existsCurrency()) {
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
              !driverPanelRobot.existsCurrency() ||
              monedasDisponibles ||
              !monedaYaOperando ||
              monedaEnBorrado ||
              actionInProcess ||
              driverPanelRobot.getLoadingCoinsToOperate()
            }
          />
        </div>
      </TooltipGhost>
    );
  }

  function ButtonOperate() {
    return (
      <TooltipGhost
        title={(() => {
          if (!driverPanelRobot.existsCurrency()) {
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
            disabled={
              !driverPanelRobot.existsCurrency() ||
              monedaYaOperando ||
              actionInProcess ||
              driverPanelRobot.getLoadingCoinsToOperate()
            }
          />
        </div>
      </TooltipGhost>
    );

    function Operar(props) {
      return (
        <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
          <Button
            {...props}
            variant="contained"
            color="ok"
            size="small"
            onClick={async () => {
              if (!driverPanelRobot.getCurrency()) {
                return;
              }
              const coinObj = driverPanelRobot.findCurrencyInCoinsToOperate();
              if (!coinObj) {
                return;
              }
              try {
                await showPromise(
                  `Solicitando al backend inicio de operación (${coinObj.symbol})`,
                  (resolve, reject) => {
                    HTTPPUT_COINS_START({
                      id_coin: coinObj.id,
                      willStart() {
                        setActionInProcess(true);
                      },
                      willEnd() {
                        setActionInProcess(false);
                      },
                      successful: (json, info) => {
                        driverPanelRobot.getCoinsOperating().push(coinObj);
                        resolve(`Se empieza a operar (${coinObj.symbol})`);
                      },
                      failure: (json, info, rejectPromise) => {
                        rejectPromise(
                          `Algo salió mal al operar en ${coinObj.symbol}`,
                          reject,
                          { json, info }
                        );
                      },
                    });
                  }
                );
              } catch (err) {
                showError(`Error al iniciar operaración en: ${coinObj.symbol}`);
              }
            }}
          >
            <small>Operar</small>
          </Button>
        </WaitSkeleton>
      );
    }
  }

  function Detener(props) {
    return (
      <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
        <Button
          {...props}
          variant="contained"
          color="cancel"
          size="small"
          onClick={() => {
            setActionInProcess(true);
            onSellCoin(driverPanelRobot.getCurrency());
          }}
        >
          <small>Detener</small>
        </Button>
      </WaitSkeleton>
    );
  }
}

class UpdateButton extends Component {
  componentDidMount() {
    SINGLETON_UPDATE_BUTTON = this;
    driverPanelRobot.addLinkUpdateAvailable(this);
  }
  componentWillUnmount() {
    driverPanelRobot.removeLinkUpdateAvailable(this);
  }
  render() {
    const updateAvailable = driverPanelRobot.getUpdateAvailable();
    if (!updateAvailable) {
      setTimeout(() => {
        this.forceUpdate();
      }, 1000 / 10);
    }
    return (
      <Design>
        <IconButtonWithTooltip
          title={() =>
            ["Espera para volver a actualizar", "Actualizar"][+updateAvailable]
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
          disabled={!updateAvailable}
          onClick={() => {
            driverPanelRobot.setUpdateAvailable(false);
            driverActionMain.updateViewTable();
            driverTables.refetch(true);
          }}
        />
        {!updateAvailable &&
          (() => {
            const PercentUpdateButton = class extends AnimateComponent {
              render() {
                if (driverPanelRobot.getUpdateAvailable()) {
                  driverPanelRobot.reRenderUpdateButton();
                  return <></>;
                }
                return (
                  <>
                    <Layer centercentralized ghost>
                      <CircularProgress
                        color="complement"
                        variant="determinate"
                        value={
                          100 * driverPanelRobot.getPercentToUpdateAvailable()
                        }
                      />
                    </Layer>
                    <Layer centercentralized ghost>
                      <HourglassBottomIcon
                        fontSize="small"
                        color="complement"
                      />
                    </Layer>
                  </>
                );
              }
            };

            return <PercentUpdateButton frameRate={10} />;
          })()}
      </Design>
    );
  }
}
