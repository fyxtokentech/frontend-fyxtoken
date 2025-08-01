import { DriverComponent, Delayer } from "@jeff-aporta/camaleon";

const MIN_VALUE_USDT = 5;
const MIN_LOG10_VALUE_USD = Math.log10(MIN_VALUE_USDT);

const MAX_VALUE_USDT = 1_000_000;
const MAX_LOG10_VALUE_USD = Math.log10(MAX_VALUE_USDT);

export const driverPanelBalance = DriverComponent({
  idDriver: "bot-panel-balance",
  MIN_VALUE_USDT,
  MIN_LOG10_VALUE_USD,
  MAX_VALUE_USDT,
  MAX_LOG10_VALUE_USD,
  loadingCoinMetric: {
    isBoolean: true,
    value: true,
  },
  balanceCoin: { isNumber: true },
  balanceUSDT: { isNumber: true },
  limitUSDTBuy: {
    isNumber: true,
  },
  getCurrencyLimitUSDTBuy({ MAX_VALUE_USDT }) {
    const limit = Math.min(this.getLimitUSDTBuy(), MAX_VALUE_USDT);
    return {
      limit,
      limitLog10: Math.log10(+limit),
    };
  },
  defaultUSDTBuy: {
    isNumber: true,
    delayer: Delayer(250),
    _getValidate_(value, { MAX_VALUE_USDT }) {
      return Math.min(value, this.getLimitUSDTBuy(), MAX_VALUE_USDT);
    },
    min({ MIN_VALUE_USDT }) {
      return MIN_VALUE_USDT;
    },
    max({ MAX_VALUE_USDT }) {
      return Math.min(this.getLimitUSDTBuy(), MAX_VALUE_USDT);
    },
    getLog10({ getValue }) {
      return Math.log10(getValue());
    },
  },
  autoFetch: { nameStorage: "bot-autofetch", isBoolean: true },
});
