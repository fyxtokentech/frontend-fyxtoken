import { DriverComponent } from "@jeff-aporta/camaleon";
import { driverPanelBalance } from "./PanelBalance.driver.js";

export const driverPanelOfProjections = DriverComponent({
  idDriver: "bot-panel-of-projections",
  NOT_VALUE: "---",
  coinMetric: {
    isObject: true,
  },
  loading: {
    isBoolean: true,
    value: true,
    mapCase: {
      balanceUSD: {
        true: ({NOT_VALUE}) => NOT_VALUE,
        false: () => driverPanelBalance.getBalanceCoin().toLocaleString(),
      },
      balanceCoin: {
        true: ({NOT_VALUE}) => NOT_VALUE,
        false: ({NOT_VALUE}) => {
          let total_tokens = NOT_VALUE;
          if (!this.getLoading()) {
            ({ total_tokens } = this.getCoinMetric());
            if (!total_tokens) {
              total_tokens = NOT_VALUE;
            } else {
              total_tokens = total_tokens.toLocaleString();
            }
          }
          return total_tokens;
        },
      },
    },
  },
  priceProjection: {
    isNumber: true,
  },
});
