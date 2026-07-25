import { DriverComponent, showError } from "@jeff-aporta/camaleon";

import { HTTPGET_USER_API, HTTPGET_API_PLATFORMS } from "@api";

export const driverAPIKey = DriverComponent({
  idDriver: "settings-apikey",
  loading: {
    isBoolean: true,
    value: true,
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
  platforms: {
    isArray: true,
    load({ setValue }) {
      HTTPGET_API_PLATFORMS({
        successful: (data) => {
          setValue(data);
        },
        failure: () => {
          showError("Error al obtener las plataformas de API");
        },
      });
    },
    findById(idapi, { find }) {
      return find((platform) => String(platform.idapi) === String(idapi));
    },
    getFieldKeys(idapi, { findById }) {
      const platform = findById(idapi);
      if (!platform || !platform.api_conf) {
        return [];
      }
      return Object.keys(platform.api_conf).filter(
        (key) => key !== "ENV_EXCHANGE"
      );
    },
  },
});
