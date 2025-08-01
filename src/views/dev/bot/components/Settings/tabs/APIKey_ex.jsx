import React, { useState, useEffect } from "react";
import { HTTPGET_USER_API } from "@api";
import { showError } from "@jeff-aporta/camaleon";
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
import { APIKeyExchange } from "./APIKey";
import { HTTPPATCH_USER_API } from "@api";

import AddIcon from "@mui/icons-material/Add";
const EXCHANGES_AVAILABLE = ["BINANCE", "BITGET"];

export class APIKeyViewExchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKeys: [],
      dialogOpen: false,
      newExchange: "BINANCE",
      newApiKey: "",
      newApiSecret: "",
      newPassphrase: "",
    };
  }

  componentDidMount() {
    const { user_id } = window.currentUser;
    HTTPGET_USER_API({
      user_id,
      successful: (data) => {
        console.log(data);
        this.setState({ apiKeys: data }, () => {
          this.forceUpdate();
        });
      },
      failure: () => {
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
  };

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
  };

  handleCancel = () => this.setState({ dialogOpen: false });

  render() {
    return (
      <>
        <br />
        <br />
        {this.state.apiKeys.map((exchange) => {
          const { name_api, attributes_api, id_api_user, enabled } = exchange;
          const { API_KEY_BINANCE, SECRET_KEY_BINANCE, API_KEY, API_SECRET } =
            attributes_api;
          const general = {
            getNameExchange: () => name_api,
            getEnabled: () => enabled === "A",
            setEnabled: (value) =>
              this.handleInputChange(
                id_api_user,
                "enabled",
                ["I", "A"][+value]
              ),
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

        <p align="right">
          <br />
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => this.setState({ dialogOpen: true })}
          >
            Agregar nueva API de Operación
          </Button>
        </p>

        <Dialog open={this.state.dialogOpen} onClose={this.handleCancel}>
          <DialogTitle>Agregar nueva API de Operación</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="exchange-select-label">Exchange</InputLabel>
              <Select
                labelId="exchange-select-label"
                value={this.state.newExchange}
                label="Exchange"
                onChange={(e) => this.setState({ newExchange: e.target.value })}
              >
                {EXCHANGES_AVAILABLE.map((ex) => (
                  <MenuItem key={ex} value={ex}>
                    {ex}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="API Key"
              variant="outlined"
              fullWidth
              margin="normal"
              value={this.state.newApiKey}
              onChange={(e) => this.setState({ newApiKey: e.target.value })}
            />
            <TextField
              label="API Secret"
              variant="outlined"
              fullWidth
              margin="normal"
              value={this.state.newApiSecret}
              onChange={(e) => this.setState({ newApiSecret: e.target.value })}
            />
            {this.state.newExchange === "BITGET" && (
              <TextField
                label="Passphrase"
                variant="outlined"
                fullWidth
                margin="normal"
                value={this.state.newPassphrase}
                onChange={(e) =>
                  this.setState({ newPassphrase: e.target.value })
                }
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.handleSave()}>Guardar</Button>
            <Button onClick={()=>this.handleCancel()}>Cancelar</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
