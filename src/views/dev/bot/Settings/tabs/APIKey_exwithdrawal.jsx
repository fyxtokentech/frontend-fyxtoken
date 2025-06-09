import React, { useState } from "react";
import { Grid } from "@mui/material";
import { Checkbox } from "@mui/material";
import { APIKeyExchange } from "./APIKey";

export const exchanges_withdrawal = [
  {
    name_api: "KRAKEN",
    enabled: true,
    attributes_api: {
      API_KEY: "1234",
      API_SECRET: "1234",
    },
  },
];

export function ExchangeManagerWithdrawal({ handleInputChange }) {
  const [apiKeys, setApiKeys] = useState(() => {
    const init = prepareToInit(exchanges_withdrawal, true);
    return init;
  });

  function prepareToInit(array, withdrawal) {
    return array.reduce((acc, ex) => {
      acc[ex.name_api.toLowerCase()] = {
        apiKey: "",
        secretKey: "",
        withdrawal,
        enabled: true,
      };
      return acc;
    }, {});
  }

  return exchanges_withdrawal.map((exchange) => {
    const { name_api, attributes_api, id_api_user, enabled } = exchange;
    const { API_KEY, API_SECRET } = attributes_api;
    const general = {
      getNameExchange: () => name_api,
      getEnabled: () => enabled,
      setEnabled: (value) =>
        handleInputChange(id_api_user, "enabled", ["I", "A"][+value]),
      getAttributesApi: () => attributes_api,
      getIdApiUser: () => id_api_user,
    };
    let apiKeyInstance = {};
    switch ((name_api || "").toUpperCase()) {
      case "KRAKEN":
        apiKeyInstance = {
          ...general,
          getApiKey: () => API_KEY,
          getSecretKey: () => API_SECRET,
          setApiKey: (value) =>
            handleInputChange(
              id_api_user,
              ["attributes_api", "API_KEY"],
              value
            ),
          setSecretKey: (value) =>
            handleInputChange(
              id_api_user,
              ["attributes_api", "API_SECRET"],
              value
            ),
        };
        break;
      default:
        apiKeyInstance = {
          ...general,
          getApiKey: () => attributes_api?.API_KEY ?? "",
          getSecretKey: () => attributes_api?.API_SECRET ?? "",
          setApiKey: (value) =>
            handleInputChange(
              id_api_user,
              ["attributes_api", "API_KEY"],
              value
            ),
          setSecretKey: (value) =>
            handleInputChange(
              id_api_user,
              ["attributes_api", "API_SECRET"],
              value
            ),
        };
    }
    return (
      <React.Fragment key={id_api_user || name_api}>
        <br />
        <br />
        <APIKeyExchange apiKeyInstance={apiKeyInstance} />
      </React.Fragment>
    );
  });
}
