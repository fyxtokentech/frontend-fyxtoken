import React, { useState } from "react";
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
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TitleTab } from "./_repetitive";

export const exchanges = ["Binance", "Bitget"];
export const exchanges_withdrawal = ["Kraken"];

function PasswordField({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
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

export function APIKeyView({ apiKeys, handleInputChange, handleSave }) {
  return (
    <>
      <TitleTab title="Configuración de Exchanges" />
      <Grid container spacing={2} alignItems="center" className="fullWidth">
        <Grid item xs={12} sm={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Activo
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Exchange
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            API Key
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            Secret Key
          </Typography>
        </Grid>

        {exchanges
          .filter((e) => !e.withdrawal)
          .map((exchange) => (
            <React.Fragment key={exchange}>
              <Grid item xs={12} sm={1}>
                <Checkbox
                  checked={apiKeys[exchange.toLowerCase()].enabled}
                  onChange={(e) =>
                    handleInputChange(exchange, "enabled", e.target.checked)
                  }
                />
              </Grid>
              <APIKeyExchange
                exchange={exchange}
                apiKeys={apiKeys}
                handleInputChange={handleInputChange}
              />
            </React.Fragment>
          ))}

        <Divider sx={{ my: 2, borderColor: "divider" }} />

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ExitToAppIcon sx={{ mr: 1 }} />
            APIs de Retiro
          </Typography>
        </Grid>

        {exchanges_withdrawal.map((exchange) => (
          <React.Fragment key={exchange}>
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={apiKeys[exchange.toLowerCase()].enabled}
                onChange={(e) =>
                  handleInputChange(exchange, "enabled", e.target.checked)
                }
              />
            </Grid>
            <APIKeyExchange
              exchange={exchange}
              apiKeys={apiKeys}
              handleInputChange={handleInputChange}
            />
          </React.Fragment>
        ))}

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export function APIKeyExchange({ exchange, apiKeys, handleInputChange }) {
  return (
    <>
      <Grid item xs={12} sm={3} sx={{ display: "flex", alignItems: "center" }}>
        <Typography>{exchange}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <PasswordField
          label={`${exchange} API Key`}
          value={apiKeys[exchange.toLowerCase()].apiKey}
          onChange={(e) =>
            handleInputChange(exchange, "apiKey", e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <PasswordField
          label={`${exchange} Secret Key`}
          value={apiKeys[exchange.toLowerCase()].secretKey}
          onChange={(e) =>
            handleInputChange(exchange, "secretKey", e.target.value)
          }
        />
      </Grid>
    </>
  );
}
