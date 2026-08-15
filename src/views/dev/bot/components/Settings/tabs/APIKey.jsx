import React from "react";
import { 
  HTTPPATCH_USER_API, 
  HTTPGET_COINS
} from "@api";

import {
  Typography,
  Checkbox,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,   // <- nuevo
  Chip,           // <- nuevo
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import CurrencyBitcoinOutlinedIcon from "@mui/icons-material/CurrencyBitcoinOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import { TooltipGhost } from "@jeff-aporta/camaleon";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TitleTab } from "./_repetitive";
import { showError, showPromptDialog } from "@jeff-aporta/camaleon";

import { APIKeyViewExchange } from "./APIKey_ex";
import { driverCoinsOperating } from "../../ActionMain/components/CoinsOperating.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";

import { ExchangeManagerWithdrawal } from "./APIKey_exwithdrawal";
import { fluidCSS } from "@jeff-aporta/camaleon";
import { showPromise } from "src/framework";

export class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };
  }

  handleClickShowPassword = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  render() {
    const { label, value, onChange } = this.props;
    const { showPassword } = this.state;
    return (
      <TextField
        fullWidth
        label={label}
        variant="outlined"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={`toggle ${label} visibility`}
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }
}

export class APIKeyExchange extends React.Component {

  static defaultProps = {
    cryptoAssignments: {},
  };

  
  constructor(props) {
    super(props);
    this.state = {
      openSettingsDialog: false,
      availableCryptos: [],       // ← array vacío
      loadingCryptos: true,
    };
  }

  async componentDidMount() {
    try {
      const response = await HTTPGET_COINS({
          successful: (data) => {
            return data;
          }
        });
      
      console.log("Respuesta del API:", response); // ← mira esto en la consola

      // Versión segura
      const coins = Array.isArray(response) 
        ? response 
        : Array.isArray(response?.content) 
          ? response.content 
          : Array.isArray(response?.data) 
            ? response.data 
            : [];

      const availableCryptos = coins
        .filter(coin => coin?.status === "A" || coin?.status === "T")
        .map(coin => ({
          id: String(coin.id),
          symbol: coin?.symbol,
          label: coin.name 
            ? `${coin.name} (${coin.symbol})` 
            : (coin.symbol || coin.id),
          status: coin?.status,
        }));

      this.setState({
        availableCryptos,
        loadingCryptos: false,
      });
    } catch (error) {
      console.error("Error cargando monedas:", error);
      this.setState({ 
        availableCryptos: [],
        loadingCryptos: false 
      });
    }
  }

  handleOpenSettings = () => {
    this.setState({ openSettingsDialog: true });
  };
  handleCloseSettings = () => {
    this.setState({ openSettingsDialog: false });
  };

  render() {
    const {
      apiKeyInstance,
      onDiscard,
      onDelete,
      exchangeId,
      cryptoAssignments = {},
      onToggleCrypto
    } = this.props;
    const { openSettingsDialog, availableCryptos = [], loadingCryptos } = this.state;

    // Monedas actualmente seleccionadas para ESTE exchange
    const selectedOptions = availableCryptos.filter(
      (crypto) => cryptoAssignments[crypto.id] === exchangeId
    );

    return (
      <div className="flex wrap justify-space-between">
        <div className="flex col-direction gap-20px">
          <div className="flex align-center gap-10px">
            <Typography variant="subtitle1" fontWeight="bold">
              Exchange
            </Typography>
            <CurrencyBitcoinOutlinedIcon fontSize="small" />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                id={`checkbox-${apiKeyInstance.getNameExchange()}`}
                checked={apiKeyInstance.getEnabled()}
                onChange={(e) => apiKeyInstance.setEnabled(e.target.checked)}
              />
            }
            label={apiKeyInstance.getNameExchange()}
            labelPlacement="end"
          />
        </div>
        <div
          className={fluidCSS()
            .ltX(900, { width: "100%" })
            .end("flex col-direction gap-20px")}
        >
          <div className="flex align-center gap-10px">
            <Typography variant="subtitle1" fontWeight="bold">
              API Key
            </Typography>
            <KeyIcon fontSize="small" />
          </div>
          <PasswordField
            label={`${apiKeyInstance.getNameExchange()} API Key`}
            value={apiKeyInstance.getApiKey()}
            onChange={(e) => apiKeyInstance.setApiKey(e.target.value)}
          />
        </div>
        <div
          className={fluidCSS()
            .ltX(900, { width: "100%" })
            .end("flex col-direction gap-20px")}
        >
          <div className="flex align-center gap-10px">
            <Typography variant="subtitle1" fontWeight="bold">
              Secret Key
            </Typography>
            <KeyIcon fontSize="small" />
          </div>
          <PasswordField
            label={`${apiKeyInstance.getNameExchange()} Secret Key`}
            value={apiKeyInstance.getSecretKey()}
            onChange={(e) => apiKeyInstance.setSecretKey(e.target.value)}
          />
        </div>
        <div
          className={fluidCSS()
            .ltX(900, { width: "100%" })
            .end("flex col-direction gap-20px")}
        >
          <div
            className={fluidCSS()
              .ltX(920, { justifyContent: ["start", "end"] })
              .end("flex align-center gap-10px")}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Acciones
            </Typography>
            <AutoFixHighIcon fontSize="small" />
          </div>
          <div
            className={fluidCSS()
              .ltX(920, { justifyContent: ["start", "end"] })
              .end("flex align-center gap-10px")}
          >
            <TooltipGhost title="Guardar cambios">
              <IconButton
                onClick={async () => {
                  await showPromise(
                    `Guardando [${apiKeyInstance.getNameExchange()}]`,
                    (resolve) => {
                      const { user_id } = window.currentUser;
                      HTTPPATCH_USER_API({
                        user_id,
                        id_api_user: apiKeyInstance.getIdApiUser(),
                        enabled: ["I", "A"][+apiKeyInstance.getEnabled()],
                        new_attributes: apiKeyInstance.getAttributesApi(),
                        successful(json, info) {
                          resolve(
                            `Se guardaron los cambios (${apiKeyInstance.getNameExchange()})`
                          );
                        },
                        failure(info, rejectPromisse) {
                          showError(
                            `Algo salió mal al guardar los cambios (${apiKeyInstance.getNameExchange()})`
                          );
                        },
                      });
                    }
                  );
                }}
                color="default"
                size="small"
                aria-label="Guardar cambios"
              >
                <SaveIcon />
              </IconButton>
            </TooltipGhost>
            <TooltipGhost title="Descartar cambios">
              <IconButton
                onClick={onDiscard || (() => alert("Descartar cambios"))}
                color="secondary"
                size="small"
                aria-label="Descartar cambios"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </TooltipGhost>
            <TooltipGhost title="Eliminar API">
              <IconButton
                onClick={onDelete}
                color="danger"
                size="small"
                aria-label="Eliminar API"
              >
                <DeleteIcon />
              </IconButton>
            </TooltipGhost>
            <TooltipGhost title="Ajustes">
              <IconButton
                onClick={this.handleOpenSettings}
                color="default"
                size="small"
                aria-label="Ajustes"
              >
                <SettingsIcon />
              </IconButton>
            </TooltipGhost>
          </div>
        </div>
        <Dialog
          open={openSettingsDialog}
          onClose={this.handleCloseSettings}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Configuración de Exchange</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Aquí van los ajustes específicos del exchange:{" "}
              <b>{apiKeyInstance.getNameExchange()}</b>
            </Typography>

            <Autocomplete
              multiple
              options={availableCryptos}
              value={selectedOptions}
              loading={loadingCryptos}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionDisabled={(option) => {
                const assignedTo = cryptoAssignments[option.id];
                return Boolean(assignedTo && assignedTo !== exchangeId);
              }}
              onChange={async (event, newValue) => {
                console.log("🔥 onChange SIMPLE disparado", newValue);

                const currentIds = selectedOptions.map(o => o.id);
                const newIds = newValue.map(o => o.id);

                // Monedas agregadas
                newValue.forEach(opt => {
                  if (!currentIds.includes(opt.id)) {
                    console.log("Agregando →", opt.id);
                    console.log("Función que voy a llamar:", onToggleCrypto); // ← importante
                    console.log("¿Es la misma función?", onToggleCrypto === this.props.onToggleCrypto);
                    
                    onToggleCrypto(exchangeId, opt.id);
                  }
                });

                // Monedas eliminadas
                for (const opt of selectedOptions) {
                  if (!newIds.includes(opt.id)) {
                    console.log("Eliminando →", opt.id);
                    // Comprobar si la moneda está realmente en operación según el driver
                    const op = (driverPanelRobot.getCoinsOperating() || []).find(
                      (c) => String(c.id) === String(opt.id)
                    );
                    const s = op?.status;
                    const isActive = (() => {
                      if (s === undefined || s === null) return false;
                      const str = String(s).toLowerCase();
                      return str === "a" || str === "t" || str === "active" || str === "trading";
                    })();

                    if (isActive) {
                      const { success } = await showPromptDialog({
                        title: "Confirmar eliminación",
                        description: `La moneda ${opt.label} está en operación (status ${s}). ¿Deseas eliminarla?`,
                        input: "confirm",
                        showCancelButton: true,
                        cancelText: "Cancelar",
                        confirmText: "Eliminar",
                      });
                      if (!success) return;
                      try {
                        await driverCoinsOperating.deleteCoinFromAPI({ id: opt.id, symbol: opt.symbol });
                      } catch (e) {
                        console.error("Error deteniendo operación:", e);
                      }
                      onToggleCrypto(exchangeId, opt.id);
                    } else {
                      onToggleCrypto(exchangeId, opt.id);
                    }
                  }
                }
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;   // ← extraemos el key
                const assignedTo = cryptoAssignments[option.id];
                const isDisabled = assignedTo && assignedTo !== exchangeId;

                return (
                  <li key={key} {...optionProps}>
                    {option.label}
                    {isDisabled ? ` — ya asignada a ${assignedTo}` : ""}
                  </li>
                );
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Buscar criptomonedas"
                  placeholder="Escribe para buscar..."
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseSettings} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export class APIKeyView extends React.Component {
  render() {
    return (
      <div className="pad-10px">
        <TitleTab title="Configuración de Exchanges" />
        <br />
        <div>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <SmartToyIcon sx={{ mr: 1 }} />
            APIs de Operación
          </Typography>
        </div>
        <APIKeyViewExchange />

        <br />
        <hr />
        <br />

        <div>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ExitToAppIcon sx={{ mr: 1 }} />
            APIs de Retiro
          </Typography>
        </div>

        <ExchangeManagerWithdrawal />
      </div>
    );
  }
}

export class APIKeysManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cryptoAssignments: {},
    };
  }

  render() {
    const { apiKeys } = this.props; // array de instancias, ej: [binanceInstance, krakenInstance, ...]

    return (
      <>
        {apiKeys.map((apiKeyInstance) => (
          <APIKeyExchange
            key={apiKeyInstance.getId()} // ajusta según tu API real
            exchangeId={apiKeyInstance.getId()}
            apiKeyInstance={apiKeyInstance}
            cryptoAssignments={this.state.cryptoAssignments}
            onToggleCrypto={this.handleToggleCrypto}
          />
        ))}
      </>
    );
  }
}
