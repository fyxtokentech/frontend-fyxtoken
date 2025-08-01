import {
  DriverComponent,
  Delayer,
  driverParams,
  showSuccess,
  showWarning,
  showPromise,
} from "@jeff-aporta/camaleon";
import {
  HTTPPUT_USEROPERATION_DEFAULT_USDT_BUY,
  HTTPPUT_USEROPERATION_LIMIT,
} from "@api";
import { driverPanelBalance } from "./PanelBalance.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";

export const driverPanelOfInsertMoney = DriverComponent({
  idDriver: "bot-panel-of-insert-money",
  waitInvestment: {
    isBoolean: true,
    value: false,
  },
  investment: {
    delayer: Delayer(250),
  },
  async handleAssingNewLimit(limit) {
    const coin_id = driverPanelRobot.getIdCoin();
    await showPromise("Procesando inversión...", (resolve) => {
      HTTPPUT_USEROPERATION_LIMIT({
        coin_id,
        new_limit: limit,
        willStart() {
          driverPanelOfInsertMoney.setWaitInvestment(true);
        },
        willEnd() {
          driverPanelOfInsertMoney.setWaitInvestment(false);
        },
        successful(data, info) {
          driverPanelBalance.setLimitUSDTBuy(limit);
          resolve("Inversión exitosa");
        },
        failure(info, rejectPromise) {
          rejectPromise("Error al procesar la inversión", resolve, info);
        },
      });
    });
  },
  async handleInvest() {
    if (this.getWaitInvestment()) {
      return;
    }
    const delayer = this.getDelayerInvestment();
    if (!delayer.isReady()) {
      return;
    }
    const coin_id = driverPanelRobot.getIdCoin();
    await showPromise("Procesando inversión...", (resolve) => {
      HTTPPUT_USEROPERATION_DEFAULT_USDT_BUY({
        coin_id,
        new_value: driverPanelBalance.getDefaultUSDTBuy(),
        willStart() {
          driverPanelOfInsertMoney.setWaitInvestment(true);
        },
        willEnd() {
          driverPanelOfInsertMoney.setWaitInvestment(false);
        },
        successful(data, info) {
          resolve("Inversión exitosa");
        },
        failure(info, rejectPromise) {
          rejectPromise("Error al procesar la inversión", resolve, info);
        },
      });
    });
  },
});
