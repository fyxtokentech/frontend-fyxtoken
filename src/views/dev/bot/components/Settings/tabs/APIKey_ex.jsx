import React from "react";
import { showError, showPromise, showPromptDialog } from "@jeff-aporta/camaleon";
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
import {
  HTTPPATCH_USER_API,
  HTTPPOST_USER_API,
  HTTPDELETE_USER_API,
  HTTPDELETE_COIN_ASSIGNMENT,
  HTTPPOST_COIN_ASSIGNMENT,
  HTTPGET_COIN_ASSIGNMENTS
} from "@api";
import { driverAPIKey } from "./APIKey_ex.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";

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
      cryptoAssignments: {}, // <- nuevo
      reloadKey: 0,
    };
  }

  componentDidMount() {
    driverAPIKey.addLinkKeysAPI(this);
    driverAPIKey.addLinkPlatforms(this);
    driverAPIKey.loadKeysAPI();
    driverAPIKey.loadPlatforms();
    this.loadCoinAssignments();
  }

  loadCoinAssignments = async () => {
    try {
      const { user_id } = window.currentUser || {};
      if (!user_id) {
        return;
      }

      const response = await HTTPGET_COIN_ASSIGNMENTS({
        user_id,
        successful: (data) => data,
      });

      const rows = Array.isArray(response)
        ? response
        : Array.isArray(response?.content)
          ? response.content
          : Array.isArray(response?.data)
            ? response.data
            : [];

      const assignments = rows.reduce((acc, row) => {
        if (Array.isArray(row)) {
          const [exchangeId, coinId] = row;
          if (exchangeId && coinId) {
            acc[String(coinId)] = String(exchangeId);
          }
          return acc;
        }

        const exchangeId = row?.exchange_id ?? row?.exchangeId ?? row?.exchange?.id;
        const coinId = row?.coin_id ?? row?.coinId ?? row?.id_coin ?? row?.idCoin;

        if (exchangeId && coinId) {
          acc[String(coinId)] = String(exchangeId);
        }

        return acc;
      }, {});

      this.setState({ cryptoAssignments: assignments });
    } catch (error) {
      console.error("Error cargando asignaciones de monedas:", error);
    }
  };

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
      this.forceUpdate();
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
          if (conteo.fail === 0 && conteo.success > 0) {
            return "Todas";
          }
          if (conteo.fail > 0 && conteo.success === 0) {
            return "Ninguna";
          }
          return `(${conteo.success} exitosas, ${conteo.fail} fallidas)`;
        })()}`
      );
    });
  }

  handleDeleteApi = async (id_api_user, name_api) => {
    const { success } = await showPromptDialog({
      title: "¡Cuidado!",
      description: `¿Está seguro de que desea eliminar la API (${name_api})? Esta acción no se puede deshacer.`,
      input: "confirm",
      showCancelButton: true,
      cancelText: "No",
      confirmText: "Sí, eliminar",
    });
    if (!success) {
      return;
    }
    await showPromise(`Eliminando API [${name_api}]`, (resolve) => {
      HTTPDELETE_USER_API({
        id_api_user,
        successful: () => {
          driverAPIKey.loadKeysAPI();
          resolve(`API eliminada (${name_api})`);
        },
        failure: (info, rejectPromise) => {
          rejectPromise(`No se pudo eliminar la API (${name_api})`, resolve);
        },
      });
    });
  };

  handleToggleCrypto = async (exchangeId, cryptoId) => {
    // Normalizamos a string para evitar problemas de tipo
    const coinId = String(cryptoId);
    const exchange = String(exchangeId);

    console.log("✅ handleToggleCrypto", { coinId, exchange });

    const current = this.state.cryptoAssignments[coinId];

    // Ya está asignada a OTRO exchange
    if (current && current !== exchange) {
      console.warn(`${coinId} ya está asignada a ${current}`);
      return;
    }

    const isRemoving = current === exchange;
    const newAssignment = isRemoving ? null : exchange;

    // Actualización optimista de la UI
    this.setState((prev) => ({
      cryptoAssignments: {
        ...prev.cryptoAssignments,
        [coinId]: newAssignment,
      },
    }));

    const { user_id } = window.currentUser;
    let opError = null;
    try {
      if (isRemoving) {
        console.log("→ Eliminando asignación");
        await HTTPDELETE_COIN_ASSIGNMENT({
          user_id,
          coin_id: coinId,
        });
      } else {
        console.log("→ Creando asignación");
        await HTTPPOST_COIN_ASSIGNMENT({
          user_id,
          exchange_id: exchange,
          coin_id: coinId,
        });
      }
    } catch (error) {
      opError = error;
      console.error("Error persistiendo asignación:", error);
      // Revertir el estado si falla el backend
      this.setState((prev) => ({
        cryptoAssignments: {
          ...prev.cryptoAssignments,
          [coinId]: current, // volvemos al valor anterior
        },
      }));
    } finally {
      try {
        console.log("Calling driverPanelRobot.loadCoins() in finally");
        await driverPanelRobot.loadCoins();
        console.log("driverPanelRobot.loadCoins() completed (finally)");
      } catch (e) {
        console.warn("No se pudo recargar monedas en el driver (finally):", e);
      }
      // Forzar recarga de los componentes hijos para que vuelvan a pedir availableCryptos
      this.setState({ reloadKey: Date.now() });
      if (opError) throw opError;
    }
  };

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
              onDelete={() => this.handleDeleteApi(id_api_user, name_api)}
              exchangeId={id_api_user}                              // <- nuevo
              cryptoAssignments={this.state.cryptoAssignments}       // <- nuevo
              onToggleCrypto={this.handleToggleCrypto}               // <- nuevo
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
