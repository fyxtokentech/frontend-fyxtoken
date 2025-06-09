import React, { useState, useEffect } from "react";
import { HTTPGET_USER_API } from "src/api/mocks";
import { showError } from "@templates";
import { Grid, Checkbox } from "@mui/material";
import { APIKeyExchange } from "./APIKey";
import { HTTPPATCH_USER_API } from "@api";

export class APIKeyViewExchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiKeys: [] };
  }

  componentDidMount() {
    const { user_id } = window.currentUser;
    HTTPGET_USER_API({
      user_id,
      setApiData: (data) => {
        console.log(data);
        this.setState({ apiKeys: data }, () => {
          this.forceUpdate();
        });
      },
      setError: () => {
        showError("Error al obtener las APIs");
      },
    });
  }

  handleInputChange = (id_api_user, field, value) => {
    if (!Array.isArray(field)) {
      field = [field];
    }
    if (!value) {
      showError(`El valor no puede estar vacío ${field}`);
      return;
    }
    // Modifica el array de apiKeys en el estado
    this.setState((prevState) => ({
      apiKeys: prevState.apiKeys.map((api) => {
        if (api.id_api_user !== id_api_user) return api;
        // Clona el objeto api y actualiza el campo correspondiente
        if (field.length === 2) {
          return {
            ...api,
            [field[0]]: {
              ...api[field[0]],
              [field[1]]: value,
            },
          };
        } else {
          return {
            ...api,
            [field[0]]: value,
          };
        }
      }),
    }));
  }

  handleSave = () => {
    const { user_id } = window.currentUser;
    this.state.apiKeys.forEach(async (api) => {
      const response = await HTTPPATCH_USER_API({
        user_id,
        id_api_user: api.id_api_user,
        enabled: api.enabled,
        new_attributes: api.attributes_api,
      });
      if (response.success == "error") {
        showError(response.message);
      }
    });
  }

  render() {
    return (
      <>
        <br />
        <br />
        {this.state.apiKeys.map((exchange) => {
          const { name_api, attributes_api, id_api_user, enabled } = exchange;
          const {
            API_KEY_BINANCE,
            SECRET_KEY_BINANCE,
            API_KEY,
            API_SECRET,
          } = attributes_api;
          const general = {
            getNameExchange: () => name_api,
            getEnabled: () => enabled === "A",
            setEnabled: (value) =>
              this.handleInputChange(id_api_user, "enabled", ["I", "A"][+value]),
            getAttributesApi: () => attributes_api,
            getIdApiUser: () => id_api_user,
          };
          let apiKeyInstance = {};
          switch (name_api.toUpperCase()) {
            case "BINANCE":
              apiKeyInstance = {
                ...general,
                getApiKey: () => API_KEY_BINANCE,
                getSecretKey: () => SECRET_KEY_BINANCE,
                setApiKey: (value) =>
                  this.handleInputChange(
                    id_api_user,
                    ["attributes_api", "API_KEY_BINANCE"],
                    value
                  ),
                setSecretKey: (value) =>
                  this.handleInputChange(
                    id_api_user,
                    ["attributes_api", "SECRET_KEY_BINANCE"],
                    value
                  ),
              };
              break;
            case "BITGET":
              apiKeyInstance = {
                ...general,
                getApiKey: () => API_KEY,
                getSecretKey: () => API_SECRET,
                setApiKey: (value) =>
                  this.handleInputChange(
                    id_api_user,
                    ["attributes_api", "API_KEY"],
                    value
                  ),
                setSecretKey: (value) =>
                  this.handleInputChange(
                    id_api_user,
                    ["attributes_api", "API_SECRET"],
                    value
                  ),
              };
              break;
            default:
              apiKeyInstance = general;
          }
          return (
            <APIKeyExchange
              key={id_api_user || name_api}
              apiKeyInstance={apiKeyInstance}
              onSave={this.handleSave}
              onDiscard={this.componentDidMount.bind(this)}
            />
          );
        })}
      </>
    );
  }
}

