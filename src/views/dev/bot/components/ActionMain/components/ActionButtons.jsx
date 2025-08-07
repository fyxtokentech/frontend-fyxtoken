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
  showPromptDialog,
  WaitSkeleton,
  ButtonShyText,
} from "@jeff-aporta/camaleon";
import { HTTPPUT_COINS_START, HTTPPUT_COINS_STOP } from "@api";

import { driverTables } from "@tables/tables.js";
import { driverPanelRobot } from "../../../bot.driver.js";
import { driverCoinsOperating } from "./CoinsOperating.driver.js";
import { driverPanelOfProjections } from "./PanelOfProjections.driver.js";
import { driverActionButtons } from "./ActionButtons.driver.js";

export default class ActionButtons extends Component {
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
          <this.SettingButton />
        </div>
        <WaitSkeleton loading={driverPanelRobot.getLoadingCoinsToOperate()}>
          <Play_n_Stop />
          <hr />
          <div className="d-end wrap gap-10px">
            <ButtonAutoOp />
          </div>
        </WaitSkeleton>
      </div>
    );

    function Play_n_Stop() {
      return (
        <div className="d-end wrap gap-10px" style={{ minWidth: "180px" }}>
          <ButtonGroup variant="contained" size="small">
            {driverActionButtons.disableOperate() ? (
              <ButtonPauseResume />
            ) : (
              <ButtonOperate />
            )}
            <ButtonStop />
          </ButtonGroup>
        </div>
      );

      function ButtonPauseResume() {
        return (
          <ButtonShyText
            loading={loadingGeneral}
            disabled={driverActionButtons.disableStoper()}
            color={driverActionButtons.mapCasePaused("colorButtonPause")}
            tooltip={driverActionButtons.mapCasePaused("textTooltipPause")}
            onClick={async () => {
              const coinObj = driverPanelRobot.findCurrencyInCoinsToOperate();
              if (!coinObj) {
                showWarning("La moneda no está disponible");
                return;
              }
              driverCoinsOperating.setActionInProcess(true);
              if (!driverActionButtons.isPaused()) {
                await makePause(coinObj);
              } else {
                await makeResume(coinObj);
              }
              driverCoinsOperating.setActionInProcess(false);
            }}
            startIcon={driverActionButtons.mapCasePaused("iconButtonPause")}
          >
            {driverActionButtons.mapCasePaused("textButtonPause")}
          </ButtonShyText>
        );

        async function makeResume({ symbol: symbol_coin, id: id_coin }) {
          await HTTPPUT_COINS_START({
            user_id,
            id_coin,
            successful() {
              showSuccess(`Se reanudo (${symbol_coin})`);
              driverActionButtons.setPaused(false);
            },
            failure() {
              showWarning(`Algo salió mal al reanudar (${symbol_coin})`);
            },
          });
        }

        async function makePause({ symbol: symbol_coin, id: id_coin }) {
          await showPromptDialog({
            title: "¡Cuidado!",
            description: [
              "¿Está seguro de que desea pausar la operación?",
              `(${driverPanelRobot.getCurrency()})`,
            ].join(" "),
            input: "confirm",
            showCancelButton: true,
            cancelText: "No",
            confirmText: "Si, Pausar",
            async successful(value) {
              await HTTPPUT_COINS_STOP({
                user_id,
                id_coin,
                successful() {
                  showSuccess(`Se pauso (${symbol_coin})`);
                  driverActionButtons.setPaused(true);
                },
                failure() {
                  showWarning(`Algo salió mal al pausar (${symbol_coin})`);
                },
              });
            },
          });
        }
      }

      function ButtonStop() {
        return (
          <ButtonShyText
            tooltip={(() => {
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
              return `Detener la operación (${driverPanelRobot.getCurrency()})`;
            })()}
            disabled={driverActionButtons.disableStoper()}
            loading={loadingGeneral}
            color="danger"
            onClick={async (e) => {
              e.preventDefault();
              await showPromptDialog({
                title: "¡Cuidado!",
                description: [
                  "¿Está seguro de que desea detener la operación?",
                  `(${driverPanelRobot.getCurrency()})`,
                ].join(" "),
                input: "confirm",
                showCancelButton: true,
                cancelText: "No",
                confirmText: "Si, Detener",
                successful(value) {
                  driverCoinsOperating.deleteCoinFromAPI(actualCurrency);
                },
              });
            }}
            startIcon={<StopIcon fontSize="small" />}
          >
            Detener
          </ButtonShyText>
        );
      }

      function ButtonOperate() {
        return (
          <ButtonShyText
            tooltip={(() => {
              if (!driverPanelRobot.existsCurrency()) {
                return "Seleccione una moneda";
              }
              if (driverPanelRobot.isCurrencyInCoinsOperating()) {
                return "Moneda ya operando-";
              }
              if (loadingGeneral) {
                return "Espere...";
              }
              return `Empieza a operar (${driverPanelRobot.getCurrency()})`;
            })()}
            loading={loadingGeneral}
            disabled={driverActionButtons.disableOperate()}
            color="ok"
            onClick={async () => {
              const coinObj = driverPanelRobot.findCurrencyInCoinsToOperate();
              const { symbol: symbol_coin, id: id_coin } = coinObj;
              if (!coinObj) {
                return;
              }
              await showPromise(
                `Solicitando inicio de operación (${symbol_coin})`,
                (resolve) => {
                  HTTPPUT_COINS_START({
                    id_coin,
                    willStart() {
                      driverCoinsOperating.setActionInProcess(true);
                    },
                    willEnd() {
                      driverCoinsOperating.setActionInProcess(false);
                    },
                    successful(json, info) {
                      driverPanelRobot.pushCoinsOperating(coinObj);
                      resolve(`Se empieza a operar (${symbol_coin})`);
                    },
                    failure(info, reject) {
                      reject(
                        `Algo salió mal al operar en ${symbol_coin}`,
                        resolve,
                        info
                      );
                    },
                  });
                }
              );
            }}
            startIcon={<PlayArrowIcon fontSize="small" />}
          >
            Operar
          </ButtonShyText>
        );
      }
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
  }

  SettingButton() {
    return (
      <TooltipGhost title="Configurar">
        <div>
          <Button
            color="inherit"
            size="small"
            onClick={() => driverPanelRobot.setToSettingsViewBot()}
          >
            <div className="flex col-direction align-center">
              <SettingsIcon />
              <Typography variant="caption" color="secondary">
                <small>Configurar</small>
              </Typography>
            </div>
          </Button>
        </div>
      </TooltipGhost>
    );
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
                <Typography variant="caption" color="secondary">
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
