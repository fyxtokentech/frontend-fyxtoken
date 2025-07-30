import { DriverComponent } from "@jeff-aporta/camaleon";

export const driverPanelOfProjections = DriverComponent({
  idDriver: "bot-panel-of-projections",
  coinMetric: {
    isObject: true,
  },
  loading: {
    isBoolean: true,
    value: true,
  },
  priceProjection: {
    isNumber: true,
  },
});
