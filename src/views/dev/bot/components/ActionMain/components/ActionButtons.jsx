import React, { useState, Component } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  ButtonGroup,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Cached";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import StopIcon from "@mui/icons-material/Stop";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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

import { driverTables } from "@tables/tables.js";
import { driverPanelRobot } from "../../../bot.driver.js";
import { driverCoinsOperating } from "./CoinsOperating.driver.js";
import { driverPanelOfProjections } from "./PanelOfProjections.driver.js";
import { driverActionButtons } from "./ActionButtons.driver.js";

export default (props) => <ActionButtons {...props} />;

class ActionButtons extends Component {
  componentDidMount() {
    driverCoinsOperating.addLinkActionInProcess(this);
    driverPanelOfProjections.addLinkLoading(this);
    driverPanelRobot.addLinkCoinsToDelete(this);
    driverPanelRobot.addLinkCoinsOperating(this);
  }

  componentWillUnmount() {
    driverCoinsOperating.removeLinkActionInProcess(this);
    driverPanelOfProjections.removeLinkLoading(this);
    driverPanelRobot.removeLinkCoinsToDelete(this);
    driverPanelRobot.removeLinkCoinsOperating(this);
  }

  render() {
    const { user_id } = window.currentUser;
    const actualCurrency = driverPanelRobot.getCurrency();
    const isPendingDelete =
      driverPanelRobot.isPendingInCoinsToDelete(actualCurrency);

    const loadingGeneral = driverActionButtons.loadingGeneral();

    return (
      <div className="inline-flex align-end col-direction gap-10px">
        <div className="d-end">
          <UpdateButton frameRate={2} />
          <TooltipGhost title="Configurar">
            <div>
              <Button
                color="inherit"
                size="small"
                onClick={driverPanelRobot.setToSettingsViewBot}
              >
                <div className="flex col-direction align-center">
                  <SettingsIcon />
                  <Typography variant="caption">
                    <small>Configurar</small>
                  </Typography>
                </div>
              </Button>
            </div>
          </TooltipGhost>
        </div>
        <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
          <div className="d-end wrap gap-10px" style={{ minWidth: "180px" }}>
            <ButtonGroup variant="contained" size="small">
              <ButtonOperate />
              <ButtonStop />
              <ButtonPauseResume />
            </ButtonGroup>
          </div>
          <hr />
          <div className="d-end wrap gap-10px">
            <ButtonAutoOp />
          </div>
        </WaitSkeleton>
      </div>
    );

    function ButtonPauseResume() {
      return (
        <TooltipGhost
          title={driverActionButtons.mapCasePaused("textButtonPause")}
        >
          <span>
            <Button
              className="text-hide-unhover-container"
              variant="contained"
              color={driverActionButtons.mapCasePaused("colorButtonPause")}
              disabled={driverActionButtons.disableStoper()}
              loading={loadingGeneral}
              size="small"
              onClick={async () => {
                const coinObj = driverPanelRobot.findCurrencyInCoinsToOperate();
                const { symbol: symbol_coin, id: id_coin } = coinObj;
                if (!coinObj) {
                  return;
                }
                driverCoinsOperating.setActionInProcess(true);
                if (!driverActionButtons.isPaused()) {
                  await HTTPPUT_COINS_STOP({
                    user_id,
                    id_coin,
                    successful: () => {
                      showSuccess(`Se detuvo (${symbol_coin})`);
                    },
                    failure: () => {
                      showWarning(
                        `Algo salió mal al detener en (${symbol_coin})`
                      );
                    },
                  });
                } else {
                  await HTTPPUT_COINS_START({
                    user_id,
                    id_coin,
                    successful: () => {
                      showSuccess(`Se reanudo (${symbol_coin})`);
                    },
                    failure: () => {
                      showWarning(
                        `Algo salió mal al reanudar en (${symbol_coin})`
                      );
                    },
                  });
                }
                driverActionButtons.setPaused((x) => !x);
                driverCoinsOperating.setActionInProcess(false);
              }}
            >
              {driverActionButtons.mapCasePaused("iconButtonPause")}
              <div className="text-hide-unhover">
                <small>
                  {driverActionButtons.mapCasePaused("textButtonPause")}
                </small>
              </div>
            </Button>
          </span>
        </TooltipGhost>
      );
    }

    function ButtonAutoOp() {
      return (
        <TooltipGhost title="Auto-op">
          <span>
            <Button
              disabled={driverActionButtons.disableGeneral()}
              loading={loadingGeneral}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => driverActionButtons.setAutoOpEnabled((x) => !x)}
            >
              <small>Auto-op</small>
            </Button>
          </span>
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
            if (driverPanelRobot.isEmptyCoinsOperating()) {
              return "No hay monedas operando";
            }
            if (!driverPanelRobot.isCurrencyInCoinsOperating()) {
              return "Moneda no operando";
            }
            if (driverPanelRobot.isCurrencyInCoinsToDelete()) {
              return "Moneda en proceso de borrado";
            }
            if (driverCoinsOperating.getActionInProcess()) {
              return "Espere...";
            }
            return "Detener";
          })()}
        >
          <span>
            <Detener />
          </span>
        </TooltipGhost>
      );

      function Detener() {
        return (
          <Button
            disabled={driverActionButtons.disableStoper()}
            loading={loadingGeneral}
            className="text-hide-unhover-container"
            variant="contained"
            color="cancel"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              driverCoinsOperating.deleteCoinFromAPI(actualCurrency);
            }}
          >
            {<StopIcon fontSize="small" />}
            <div className="text-hide-unhover">
              <small>Detener</small>
            </div>
          </Button>
        );
      }
    }

    function ButtonOperate() {
      return (
        <TooltipGhost
          title={(() => {
            if (!driverPanelRobot.existsCurrency()) {
              return "Seleccione una moneda";
            }
            if (driverPanelRobot.isCurrencyInCoinsOperating()) {
              return "Moneda ya operando";
            }
            if (loadingGeneral) {
              return "Espere...";
            }
            return "Operar";
          })()}
        >
          <span>
            <Operar />
          </span>
        </TooltipGhost>
      );

      function Operar() {
        return (
          <Button
            className="text-hide-unhover-container"
            variant="contained"
            color="ok"
            size="small"
            disabled={driverActionButtons.disableOperate()}
            loading={loadingGeneral}
            onClick={async () => {
              const coinObj = driverPanelRobot.findCurrencyInCoinsToOperate();
              const { symbol: symbol_coin, id: id_coin } = coinObj;
              if (!coinObj) {
                return;
              }
              await showPromise(
                `Solicitando al backend inicio de operación (${symbol_coin})`,
                (resolve) => {
                  HTTPPUT_COINS_START({
                    id_coin,
                    willStart() {
                      driverCoinsOperating.setActionInProcess(true);
                    },
                    willEnd() {
                      driverCoinsOperating.setActionInProcess(false);
                    },
                    successful: (json, info) => {
                      driverPanelRobot.pushCoinsOperating(coinObj);
                      resolve(`Se empieza a operar (${symbol_coin})`);
                    },
                    failure: (info, rejectPromise) => {
                      rejectPromise(
                        `Algo salió mal al operar en ${symbol_coin}`,
                        resolve,
                        info
                      );
                    },
                  });
                }
              );
            }}
          >
            <PlayArrowIcon fontSize="small" />
            <div className="text-hide-unhover">
              <small>Operar</small>
            </div>
          </Button>
        );
      }
    }
  }
}

class UpdateButton extends AnimateComponent {
  componentDidMount() {
    super.componentDidMount();
    driverPanelRobot.addLinkUpdateAvailable(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    driverPanelRobot.removeLinkUpdateAvailable(this);
  }

  smartFramerate() {
    if (driverPanelRobot.isUpdateAvailable()) {
      this.frameRate = 0.1;
    } else {
      this.frameRate = this.props.frameRate;
    }
  }

  render() {
    this.smartFramerate();

    console.log(this.frameRate);

    return (
      <Design>
        <TooltipGhost
          title={driverPanelRobot.mapCaseUpdateAvailable("textButtonUpdate")}
        >
          <div>
            <Button
              color="inherit"
              size="small"
              disabled={!driverPanelRobot.isUpdateAvailable()}
              onClick={() => {
                driverPanelRobot.setUpdateAvailable(false);
                driverTables.refetch(true);
                setTimeout(() => {
                  driverPanelRobot.setUpdateAvailable(true);
                }, driverPanelRobot.SECONDS_TO_UPDATE_AGAIN);
              }}
            >
              <div className="flex col-direction align-center">
                <UpdateIcon />
                <Typography variant="caption">
                  <small>Actualizar</small>
                </Typography>
              </div>
            </Button>
          </div>
        </TooltipGhost>
        {!driverPanelRobot.isUpdateAvailable() &&
          (() => {
            if (driverPanelRobot.isUpdateAvailable()) {
              return;
            }
            return (
              <>
                <Layer centercentralized ghost>
                  <CircularProgress
                    color="l2"
                    variant="determinate"
                    value={100 * driverPanelRobot.getPercentToUpdateAvailable()}
                  />
                </Layer>
                <Layer centercentralized ghost>
                  <HourglassBottomIcon fontSize="small" color="l2" />
                </Layer>
              </>
            );
          })()}
      </Design>
    );
  }
}
