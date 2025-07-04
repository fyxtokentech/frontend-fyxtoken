import React, { Component } from "react";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";

import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import { PaperP, HTTP_IS_ERROR, showPromise, sleep } from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_OPEN,
  HTTPPOST_EXCHANGE_SELL,
  HTTPPUT_COINS_STOP,
} from "@api";

import { showSuccess, showWarning, showError } from "@jeff-aporta/camaleon";
import { driverPanelRobot } from "../../../bot.jsx";

let actionInProcess = false;

let SINGLETON_COINS_OPERATING;

export const driverCoinsOperating = {
  getActionInProcess: () => actionInProcess,
  setActionInProcess: (value) => {
    actionInProcess = value;
    driverCoinsOperating.forceUpdate();
  },
  forceUpdate: () => {
    if (!SINGLETON_COINS_OPERATING) {
      return setTimeout(() => driverCoinsOperating.forceUpdate(), 1000 / 10);
    }
    SINGLETON_COINS_OPERATING.forceUpdate();
  },
};

export default class CoinsOperating extends Component {
  constructor(props) {
    super(props);
    this.handleCoinDelete = this.handleCoinDelete.bind(this);
    this.deleteCoinFromAPI = this.deleteCoinFromAPI.bind(this);
  }

  componentDidMount() {
    const { onExternalDeleteRef } = this.props;
    if (onExternalDeleteRef) {
      onExternalDeleteRef.current = (coinSymbol) => {
        const coin = driverPanelRobot
          .getCoinsOperating()
          .find((c) => driverPanelRobot.getCoinKey(c) === coinSymbol);
        if (coin) this.handleCoinDelete({ preventDefault: () => {} }, coin);
      };
    }
    SINGLETON_COINS_OPERATING = this;

    driverPanelRobot.addLinkCoinsOperating(this);
    driverPanelRobot.addLinkCoinsToDelete(this);
  }

  componentWillUnmount() {
    driverPanelRobot.removeLinkCoinsOperating(this);
    driverPanelRobot.removeLinkCoinsToDelete(this);
  }

  // Handle coin deletion
  handleCoinDelete(event, coin) {
    event.preventDefault();
    driverPanelRobot.getCoinsToDelete().push(coin);
    driverCoinsOperating.setActionInProcess(true);
    driverPanelRobot.setUpdateAvailable((prev) => !prev);
    this.deleteCoinFromAPI(coin);
  }

  // Function to stop coin
  async deleteCoinFromAPI(coin) {
    const { setActionInProcess } = this.props;
    try {
      await coinStop();
      await coinSell();
      driverCoinsOperating.forceUpdate();

      async function coinSell() {
        const operationOpen = {};
        await showPromise(
          `Buscando operación abierta para cerrar (${coin.symbol})`,
          new Promise((resolve, reject) => {
            HTTPGET_USEROPERATION_OPEN({
              id_coin: coin.id,
              successful: ([data], info) => {
                Object.assign(operationOpen, data);
                resolve("Se encontró operación abierta");
              },
              failure: (json, info) => {
                const txt = `Algo salió mal al encontrar operación abierta en: ${coin.symbol}`;
                console.error(txt, { json, info });
                reject(txt);
              },
            });
          })
        );
        const { id_operation } = operationOpen;
        if (!id_operation) {
          return showWarning(
            `No se encontro la operacion abierta en ${coin.symbol}`,
            {
              operationOpen,
              id_coin: coin.id,
            }
          );
        }
        await showPromise(
          "Vendiendo por exchange",
          new Promise((resolve, reject) => {
            HTTPPOST_EXCHANGE_SELL({
              id_operation,
              willEnd,
              successful: (json, info) => {
                driverPanelRobot.filterExcludeIdCoinsOperating([coin.id]);
                resolve(`Vendido por exchange (${coin.symbol})`);
              },
              failure: (json, info) => {
                const txt = `Algo salió mal al vender por exchange con ${coin.symbol}`;
                console.error(txt, {
                  json,
                  info,
                  coin,
                });
                reject(txt);
              },
            });
          })
        );
      }

      async function coinStop() {
        await showPromise(
          "Desactivando moneda",
          new Promise((resolve, reject) => {
            HTTPPUT_COINS_STOP({
              id_coin: coin.id,
              willEnd,
              successful: (json, info) => {
                resolve(`Se desactivó (${coin.symbol})`);
              },
              failure: (json, info) => {
                const txt = `Algo salió mal al desactivar (${coin.symbol})`;
                console.error(txt, {
                  json,
                  info,
                });
                reject(txt);
              },
            });
          })
        );
      }
    } catch (err) {
      showError(`Error deteniendo ${coin.symbol}`, err);
    }

    willEnd();

    function willEnd() {
      setActionInProcess(false);
      driverPanelRobot.setUpdateAvailable((prev) => !prev);
      driverPanelRobot.filterExcludeIdOnCoinsToDelete([coin.id]);
      driverCoinsOperating.forceUpdate();
    }
  }

  render() {
    const { actionInProcess } = this.props;
    return (
      <PaperP
        elevation={3}
        sx={{
          width: "100%",
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          p: 2,
        }}
      >
        {driverPanelRobot.getCoinsOperating().length === 0 ? (
          <span style={{ color: "#888", fontSize: 14 }}>
            No hay monedas en operación.
          </span>
        ) : (
          driverPanelRobot.getCoinsOperating().map((option, index) => {
            const symbol = driverPanelRobot.getCoinKey(option);
            const isPendingDelete =
              driverPanelRobot.someKeyCoinsToDelete(symbol);
            return (
              <Tooltip
                key={`tooltip-${symbol}-${index}`}
                title={isPendingDelete ? "Pronto dejará de ser operada" : ""}
              >
                <Chip
                  label={symbol}
                  onDelete={(e) => this.handleCoinDelete(e, option)}
                  disabled={isPendingDelete || actionInProcess}
                  color={isPendingDelete ? "cancel" : "primary"}
                  style={{ color: !isPendingDelete ? "white" : undefined }}
                  deleteIcon={
                    isPendingDelete ? (
                      <CircularProgress size="20px" color="white" />
                    ) : (
                      <DoDisturbOnIcon style={{ color: "white" }} />
                    )
                  }
                  sx={{ m: 0.5 }}
                />
              </Tooltip>
            );
          })
        )}
      </PaperP>
    );
  }
}
