import React, { useState, useEffect } from "react";
import {
  showError,
  showPromptDialog,
  showPromise,
} from "@jeff-aporta/camaleon";
import {
  Grid,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { APIKeyExchange } from "./APIKey.jsx";
import { HTTPPATCH_USER_API } from "@api";
import { driverAPIKey } from "./APIKey_ex.driver.js";

import AddIcon from "@mui/icons-material/Add";
const EXCHANGES_AVAILABLE = ["BINANCE", "BITGET"];

export class APIKeyViewExchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newApiKey: "",
      newApiSecret: "",
      newPassphrase: "",
    };
  }

  componentDidMount() {
    driverAPIKey.addLinkKeysAPI(this);
    driverAPIKey.loadKeysAPI();
  }

  componentWillUnmount() {
    driverAPIKey.removeLinkKeysAPI(this);
  }

  handleInputChange = ({ id_api_user, field, value }) => {
    if (typeof field === "string") {
      field = field.split(".");
    }
    if (!Array.isArray(field)) {
      field = [field];
    }
    if (!value) {
      showError(`El valor no puede estar vacío ${field}`);
      return;
    }
    const api = driverAPIKey.findKeysAPI((x) => x.id_api_user === id_api_user);
    if (api) {
      if (field.length === 2) {
        Object.assign(api[field[0]], { [field[1]]: value });
      } else {
        Object.assign(api, { [field[0]]: value });
      }
    } else {
      showError("No se encontro la API");
    }
  };

  handleSave() {
    const { user_id } = window.currentUser;
    showPromise("Guardando APIs", async (resolve) => {
      const conteo = {
        success: 0,
        fail: 0,
      };
      for (const api of driverAPIKey.getKeysAPI()) {
        await HTTPPATCH_USER_API({
          user_id,
          id_api_user: api.id_api_user,
          enabled: api.enabled,
          new_attributes: api.attributes_api,
          failure: () => {
            conteo.fail++;
          },
          successful: () => {
            conteo.success++;
          },
        });
      }
      resolve(
        `APIs guardadas: ${(() => {
          if (conteo.fail == 0 && conteo.success > 0) {
            return "Todas";
          }
          if (conteo.fail > 0 && conteo.success == 0) {
            return "Ninguna";
          }
          return `(${conteo.success} exitosas, ${conteo.fail} fallidas)`;
        })()}`
      );
    });
  }

  
  render() {
    return (
      <>
        <br />
        <br />
        {driverAPIKey.mapKeysAPI((exchange) => {
          const { name_api, attributes_api, id_api_user, enabled } = exchange;
          const {
            API_KEY_BINANCE, //
            SECRET_KEY_BINANCE,
            API_KEY,
            API_SECRET,
          } = attributes_api;
          const general = {
            getNameExchange() {
              return name_api;
            },
            getEnabled() {
              return enabled === "A";
            },
            setEnabled: (value) => {
              this.handleInputChange({
                id_api_user,
                field: "enabled",
                value: ["I", "A"][+value],
              });
            },
            getAttributesApi() {
              return attributes_api;
            },
            getIdApiUser() {
              return id_api_user;
            },
          };
          let apiKeyInstance = {};
          switch (name_api.toUpperCase()) {
            case "BINANCE":
              apiKeyInstance = {
                ...general,
                getApiKey() {
                  return API_KEY_BINANCE;
                },
                getSecretKey() {
                  return SECRET_KEY_BINANCE;
                },
                setApiKey: (value) => {
                  this.handleInputChange({
                    id_api_user,
                    field: "attributes_api.API_KEY_BINANCE",
                    value,
                  });
                },
                setSecretKey: (value) => {
                  this.handleInputChange({
                    id_api_user,
                    field: "attributes_api.SECRET_KEY_BINANCE",
                    value,
                  });
                },
              };
              break;
            case "BITGET":
              apiKeyInstance = {
                ...general,
                getApiKey() {
                  return API_KEY;
                },
                getSecretKey() {
                  return API_SECRET;
                },
                setApiKey: (value) => {
                  this.handleInputChange({
                    id_api_user,
                    field: "attributes_api.API_KEY",
                    value,
                  });
                },
                setSecretKey: (value) => {
                  this.handleInputChange({
                    id_api_user,
                    field: "attributes_api.API_SECRET",
                    value,
                  });
                },
              };
              break;
            default:
              apiKeyInstance = general;
          }
          return (
            <APIKeyExchange
              key={id_api_user || name_api}
              apiKeyInstance={apiKeyInstance}
              onDiscard={this.componentDidMount.bind(this)}
            />
          );
        })}

        <p align="right">
          <br />
          <this.buttonAddApi />
        </p>
      </>
    );
  }

  buttonAddApi() {
    return (
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<AddIcon />}
        onClick={async () => {
          await showPromptDialog({
            title: "Agregar nueva API de Operación",
            input: (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="exchange-select-label">Exchange</InputLabel>
                  <Select
                    labelId="exchange-select-label"
                    value={driverAPIKey.getNameNewExchange()}
                    label="Exchange"
                    onChange={(e) =>
                      driverAPIKey.setNameNewExchange(e.target.value)
                    }
                  >
                    {EXCHANGES_AVAILABLE.map((ex) => (
                      <MenuItem key={ex} value={ex}>
                        {ex}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="API Key"
                  variant="outlined"
                  margin="normal"
                  value={driverAPIKey.getApiKeyNewExchange()}
                  onChange={(e) => driverAPIKey.setApiKeyNewExchange(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="API Secret"
                  variant="outlined"
                  margin="normal"
                  value={driverAPIKey.getApiSecretNewExchange()}
                  onChange={(e) => driverAPIKey.setApiSecretNewExchange(e.target.value)}
                />
                {driverAPIKey.isBitgetNewExchange() && (
                  <TextField
                    label="Passphrase"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={driverAPIKey.getPassphraseNewExchange()}
                    onChange={(e) => driverAPIKey.setPassphraseNewExchange(e.target.value)}
                  />
                )}
              </>
            ),
          });
        }}
      >
        Agregar nueva API de Operación
      </Button>
    );
  }
}
