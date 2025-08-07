import { DriverComponent, showError } from "@jeff-aporta/camaleon";

import { HTTPGET_USER_API } from "@api";

export const driverAPIKey = DriverComponent({
  idDriver: "settings-apikey",
  loading: {
    isBoolean: true,
    value: true,
  },
  newExchange: {
    name: "BINANCE",
    apiKey: "",
    apiSecret: "",
    passphrase: "",
    isBitget({ getName }) {
      return getName() === "BITGET";
    },
  },
  KeysAPI: {
    isArray: true,
    load({ setValue }) {
      const { user_id } = window.currentUser;
      HTTPGET_USER_API({
        user_id,
        successful: (data) => {
          setValue(data);
        },
        failure: () => {
          showError("Error al obtener las APIs");
        },
      });
    },
  },
});
