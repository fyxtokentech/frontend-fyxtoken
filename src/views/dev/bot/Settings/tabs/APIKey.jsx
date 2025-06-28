import React from "react";
import { HTTPGET_USER_API, HTTPPATCH_USER_API } from "@api";

import {
  Grid,
  Typography,
  Checkbox,
  Divider,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import CurrencyBitcoinOutlinedIcon from "@mui/icons-material/CurrencyBitcoinOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { TooltipGhost } from "@jeff-aporta/camaleon";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TitleTab } from "./_repetitive";
import { showError } from "@jeff-aporta/camaleon";

import { APIKeyViewExchange } from "./APIKey_ex";

import { ExchangeManagerWithdrawal } from "./APIKey_exwithdrawal";
import { fluidCSS, IconButtonWithTooltip } from "@jeff-aporta/camaleon";

class PasswordField extends React.Component {
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
  constructor(props) {
    super(props);
    this.state = { openSettingsDialog: false };
  }

  handleOpenSettings = () => {
    this.setState({ openSettingsDialog: true });
  };
  handleCloseSettings = () => {
    this.setState({ openSettingsDialog: false });
  };

  render() {
    const { apiKeyInstance, onSave, onDiscard } = this.props;
    const { openSettingsDialog } = this.state;

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
                onClick={onSave || (() => alert("Guardar cambios"))}
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
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Configuración de Exchange</DialogTitle>
          <DialogContent>
            {/* Aquí puedes agregar los campos de configuración que desees */}
            <Typography variant="body1">
              Aquí van los ajustes específicos del exchange:{" "}
              <b>{apiKeyInstance.getNameExchange()}</b>
            </Typography>
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
