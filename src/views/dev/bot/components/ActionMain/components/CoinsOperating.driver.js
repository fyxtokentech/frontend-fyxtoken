import { DriverComponent, showPromise } from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_OPEN,
  HTTPPOST_EXCHANGE_SELL,
  HTTPPUT_COINS_STOP,
} from "@api";

import { driverPanelRobot } from "../../../bot.driver.js";

export const driverCoinsOperating = DriverComponent({
  idDriver: "bot-coins-operating",
  actionInProcess: { isBoolean: true },

  async deleteCoinFromAPI(coin) {
    if(typeof coin == "string"){
      console.log(driverPanelRobot.getCoinsOperating())
      coin = driverPanelRobot.getCoinsOperating().find((c) => c.symbol == coin);
    }
    driverPanelRobot.pushCoinsToDelete(coin);
    this.setActionInProcess(true);

    const willEnd = () => {
      this.setActionInProcess(false);
      driverPanelRobot.filterExcludeIdOnCoinsToDelete(coin.id);
    };

    try {
      await coinStop.bind(this)();
      await coinSell.bind(this)();

      async function coinSell() {
        const operationOpen = {};
        await showPromise(
          `Buscando operación abierta para cerrar (${coin.symbol})`,
          (resolve) => {
            HTTPGET_USEROPERATION_OPEN({
              id_coin: coin.id,
              successful([data], info) {
                if (data) {
                  Object.assign(operationOpen, data);
                }
                resolve();
              },
              failure() {
                resolve({
                  type: "info",
                  message: `No hay operación abierta para ${coin.symbol}`,
                });
              },
            });
          }
        );
        const { id_operation } = operationOpen;
        if (!id_operation) {
          return console.warn(
            `No se encontro la operacion abierta en ${coin.symbol}`,
            {
              operationOpen,
              id_coin: coin.id,
            }
          );
        }
        await showPromise("Vendiendo por exchange", (resolve) => {
          HTTPPOST_EXCHANGE_SELL({
            id_operation,
            successful: (json, info) => {
              resolve(`Vendido por exchange (${coin.symbol})`);
            },
            failure: (info, rejectPromise) => {
              rejectPromise(
                `Algo salió mal al vender por exchange con ${coin.symbol}`,
                resolve,
                info
              );
            },
          });
        });
      }

      async function coinStop() {
        await showPromise(
          `Solicitando al backend fin de operación (${coin.symbol})`,
          (resolve) => {
            HTTPPUT_COINS_STOP({
              id_coin: coin.id,
              successful: (json, info) => {
                resolve(`Se desactivó (${coin.symbol})`);
                driverPanelRobot.filterExcludeIdCoinsOperating(coin.id);
              },
              failure: (info, rejectPromise) => {
                rejectPromise(
                  `Algo salió mal al desactivar (${coin.symbol})`,
                  resolve,
                  info
                );
              },
            });
          }
        );
      }
    } catch (err) {
      return console.log(`Error deteniendo ${coin.symbol}`, err);
    }

    willEnd();
  },
});
