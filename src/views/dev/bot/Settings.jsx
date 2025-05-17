import React, { useState, useEffect } from "react";
import { PaperP } from "@containers";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Checkbox,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApiIcon from "@mui/icons-material/Api";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const exchanges = ["Binance", "Bitget"];
const exchanges_withdrawal = ["Kraken"];

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

export default function Settings({ setView }) {
  const views = [
    { id: "apis", label: "APIs", icon: <ApiIcon /> },
    {
      id: "criptomonedas",
      label: "Criptomonedas",
      icon: <CurrencyBitcoinIcon />,
    },
    { id: "rsi", label: "RSI", icon: <ShowChartIcon /> },
    { id: "candlestick", label: "Candlestick", icon: <CandlestickChartIcon /> },
    {
      id: "automatizacion",
      label: "Automatización",
      icon: <AutoFixHighIcon />,
    },
  ];
  const { driverParams } = global;
  const initialView = driverParams.get("view-setting") || "apis";
  const [selectedViewSetting, setSelectedViewSetting] = useState(initialView);

  useEffect(() => {
    if (!views.find((v) => v.id === initialView)) {
      driverParams.set("view-setting", "apis");
      setSelectedViewSetting("apis");
    } else {
      setSelectedViewSetting(initialView);
    }
  }, []);

  const handleSelect = (id) => {
    driverParams.set("view-setting", id);
    setSelectedViewSetting(id);
  };
  const drawerWidth = 240;

  const [apiKeys, setApiKeys] = useState(() => {
    const init = prepareToInit(exchanges, false);
    Object.assign(init, prepareToInit(exchanges_withdrawal, true));
    return init;
  });

  function prepareToInit(array, withdrawal) {
    return array.reduce((acc, ex) => {
      acc[ex.toLowerCase()] = {
        apiKey: "",
        secretKey: "",
        withdrawal,
        enabled: true,
      };
      return acc;
    }, {});
  }

  const handleInputChange = (exchange, field, value) => {
    setApiKeys((prev) => ({
      ...prev,
      [exchange.toLowerCase()]: {
        ...prev[exchange.toLowerCase()],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Add logic to save settings (e.g., send to backend or local storage)
    console.log("Guardando configuraciones:", apiKeys);
    // Optionally close after saving
    // setView("main");
  };

  return (
    <Paper>
      <Box sx={{ display: "flex" }} className="fullWidth ai-stretch">
        <Box
          component="nav"
          sx={{
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <List>
            {views.map((view) => (
              <ListItem key={view.id} disablePadding>
                <ListItemButton
                  selected={selectedViewSetting === view.id}
                  onClick={() => handleSelect(view.id)}
                >
                  <ListItemIcon>{view.icon}</ListItemIcon>
                  <ListItemText primary={view.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {selectedViewSetting === "apis" && (
            <PaperP>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">Configuración de Exchanges</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CloseIcon />}
                  onClick={() => setView("main")}
                >
                  Cerrar
                </Button>
              </Box>
              <br />
              <hr />
              <br />

              <APIKeyView
                apiKeys={apiKeys}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
              />
            </PaperP>
          )}
          {selectedViewSetting === "criptomonedas" && (
            <Typography>Vista Criptomonedas</Typography>
          )}
          {selectedViewSetting === "rsi" && <Typography>Vista RSI</Typography>}
          {selectedViewSetting === "candlestick" && (
            <Typography>Vista Candlestick</Typography>
          )}
          {selectedViewSetting === "automatizacion" && (
            <Typography>Vista Automatización</Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

function APIKeyView({ apiKeys, handleInputChange, handleSave }) {
  return (
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
        
      <Divider sx={{ my: 2, borderColor: 'divider' }} />

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
  );
}

function APIKeyExchange({ exchange, apiKeys, handleInputChange }) {
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
