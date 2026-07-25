import React from "react";
import { showError, showPromise } from "@jeff-aporta/camaleon";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { APIKeyExchange, PasswordField } from "./APIKey.jsx";
import { HTTPPATCH_USER_API, HTTPPOST_USER_API } from "@api";
import { driverAPIKey } from "./APIKey_ex.driver.js";

import AddIcon from "@mui/icons-material/Add";

function fieldLabel(key) {
  return key.replace(/_/g, " ");
}

export class APIKeyViewExchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddDialog: false,
      newIdApi: "",
      newFields: {},
    };
  }

  componentDidMount() {
    driverAPIKey.addLinkKeysAPI(this);
    driverAPIKey.addLinkPlatforms(this);
    driverAPIKey.loadKeysAPI();
    driverAPIKey.loadPlatforms();
  }

  componentWillUnmount() {
    driverAPIKey.removeLinkKeysAPI(this);
    driverAPIKey.removeLinkPlatforms(this);
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
            case "MEXC":
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
          {this.buttonAddApi()}
        </p>
        {this.dialogAddApi()}
      </>
    );
  }

  handleOpenAddDialog = () => {
    const platforms = driverAPIKey.getPlatforms();
    this.setState({
      openAddDialog: true,
      newIdApi: platforms[0] ? platforms[0].idapi : "",
      newFields: {},
    });
  };

  handleCloseAddDialog = () => {
    this.setState({ openAddDialog: false });
  };

  handleChangeNewIdApi = (idapi) => {
    this.setState({ newIdApi: idapi, newFields: {} });
  };

  handleChangeNewField = (key, value) => {
    this.setState((prev) => ({
      newFields: { ...prev.newFields, [key]: value },
    }));
  };

  handleSubmitNewApi = async () => {
    const { newIdApi, newFields } = this.state;
    const platform = driverAPIKey.findByIdPlatforms(newIdApi);
    if (!platform) {
      showError("Selecciona un exchange válido");
      return;
    }
    const keys = driverAPIKey.getFieldKeysPlatforms(newIdApi);
    const missing = keys.filter((key) => !newFields[key]);
    if (missing.length > 0) {
      showError(`Completa los campos: ${missing.map(fieldLabel).join(", ")}`);
      return;
    }
    const attributes_api = {};
    keys.forEach((key) => {
      attributes_api[key] = newFields[key];
    });

    const { user_id } = window.currentUser;
    await showPromise(
      `Agregando API [${platform.name_platform}]`,
      (resolve) => {
        HTTPPOST_USER_API({
          user_id,
          id_api: platform.idapi,
          attributes_api,
          successful: () => {
            driverAPIKey.loadKeysAPI();
            this.handleCloseAddDialog();
            resolve(`API agregada (${platform.name_platform})`);
          },
          failure: (info, rejectPromise) => {
            rejectPromise(
              `No se pudo agregar la API (${platform.name_platform})`,
              resolve
            );
          },
        });
      }
    );
  };

  buttonAddApi() {
    return (
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<AddIcon />}
        onClick={this.handleOpenAddDialog}
      >
        Agregar nueva API de Operación
      </Button>
    );
  }

  dialogAddApi() {
    const { openAddDialog, newIdApi, newFields } = this.state;
    const platforms = driverAPIKey.getPlatforms();
    const keys = driverAPIKey.getFieldKeysPlatforms(newIdApi);

    return (
      <Dialog
        open={openAddDialog}
        onClose={this.handleCloseAddDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Agregar nueva API de Operación</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="new-exchange-select-label">Exchange</InputLabel>
            <Select
              labelId="new-exchange-select-label"
              value={newIdApi}
              label="Exchange"
              onChange={(e) => this.handleChangeNewIdApi(e.target.value)}
            >
              {platforms.map((platform) => (
                <MenuItem key={platform.idapi} value={platform.idapi}>
                  {platform.name_platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {keys.map((key) => (
            <PasswordField
              key={key}
              label={fieldLabel(key)}
              value={newFields[key] || ""}
              onChange={(e) => this.handleChangeNewField(key, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseAddDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={this.handleSubmitNewApi}
            color="primary"
            variant="contained"
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
