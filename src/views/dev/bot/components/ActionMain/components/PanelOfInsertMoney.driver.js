import { DriverComponent, Delayer, driverParams, showSuccess, showWarning, showPromise } from "@jeff-aporta/camaleon";
import { HTTPPUT_USEROPERATION_INVESTMENT } from "@api";
import { driverPanelBalance } from "./PanelBalance.driver.js";

export const driverPanelOfInsertMoney = DriverComponent({
  idDriver: "bot-panel-of-insert-money",
  waitInvestment: {
    isBoolean: true,
    value: false,
  },
  investment:{
    delayer: Delayer(250),
  },
  async handleInvest(id = 0) {
    if (this.getWaitInvestment()) {
      return;
    }
    const delayer = this.getDelayerInvestment();
    if (!delayer.isReady((newId) => this.handleInvest(newId), id)) {
      return;
    }
    const coin_id = driverParams.getOne("id_coin");
    await showPromise(
      "Procesando inversión...",
      (resolve) => {
        HTTPPUT_USEROPERATION_INVESTMENT({
          coin_id,
          new_value: driverPanelBalance.getDefaultUSDTBuy(),
          willStart() {
            driverPanelOfInsertMoney.setWaitInvestment(true);
          },
          willEnd() {
            driverPanelOfInsertMoney.setWaitInvestment(false);
          },
          successful(data, info){
            resolve("Inversión exitosa");
          },
          failure(info, rejectPromise){
            rejectPromise(
              "Error al procesar la inversión",
              resolve,
              info
            );
          },
        });
      }
    );
  }
});
