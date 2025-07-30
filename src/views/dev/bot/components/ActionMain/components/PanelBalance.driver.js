import { DriverComponent } from "@jeff-aporta/camaleon";

export const driverPanelBalance = DriverComponent({
  idDriver: "bot-panel-balance",
  MIN_VALUE_USDT: 10,
  loadingCoinMetric: {
    isBoolean: true,
    value: true,
  },
  balanceCoin: { isNumber: true },
  balanceUSDT: { isNumber: true },
  limitUSDTBuy: {
    isNumber: true,
    value: 1_000
  },
  defaultUSDTBuy: {
    isNumber: true,
    min({ MIN_VALUE_USDT }){
      return MIN_VALUE_USDT
    },
    max({ MIN_VALUE_USDT }) {
      const MAX_LIMIT_USDT = this.getLimitUSDTBuy();
      return Math.max(MAX_LIMIT_USDT, MIN_VALUE_USDT);
    },
    getLog10({ getValue }) {
      return Math.log10(getValue());
    },
  },
  autoFetch: { nameStorage: "bot-autofetch", isBoolean: true },
});
