import React, { useState } from "react";
import { PaperP } from "@containers";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const exchanges = ["Binance", "Libertex", "Coinbase"];

// Helper component for password fields
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
  // State for API keys and secrets for each exchange
  const [apiKeys, setApiKeys] = useState(() => 
    exchanges.reduce((acc, ex) => {
      acc[ex.toLowerCase()] = { apiKey: "", secretKey: "" };
      return acc;
    }, {})
  );

  const handleInputChange = (exchange, field, value) => {
    setApiKeys(prev => ({
        ...prev,
        [exchange.toLowerCase()]: {
            ...prev[exchange.toLowerCase()],
            [field]: value
        }
    }));
  };

  const handleSave = () => {
    // Add logic to save settings (e.g., send to backend or local storage)
    console.log("Guardando configuraciones:", apiKeys);
    // Optionally close after saving
    // setView("main");
  };

  return (
    <PaperP sx={{ p: 3 }}> 
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

      <Grid container spacing={3} alignItems="center" className="fullWidth">
        {/* Header Row - Optional */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" fontWeight="bold">Exchange</Typography>
        </Grid>
        <Grid item xs={5}>
           <Typography variant="subtitle1" fontWeight="bold">API Key</Typography>
        </Grid>
         <Grid item xs={4}>
           <Typography variant="subtitle1" fontWeight="bold">Secret Key</Typography>
        </Grid>

        {/* Exchange Rows */}
        {exchanges.map((exchange) => (
          <React.Fragment key={exchange}>
            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{exchange}</Typography>
            </Grid>
            <Grid item xs={5}>
              <PasswordField
                label={`${exchange} API Key`}
                value={apiKeys[exchange.toLowerCase()].apiKey}
                onChange={(e) => 
                  handleInputChange(exchange, 'apiKey', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={4}>
               <PasswordField
                label={`${exchange} Secret Key`}
                value={apiKeys[exchange.toLowerCase()].secretKey}
                 onChange={(e) => 
                  handleInputChange(exchange, 'secretKey', e.target.value)
                }
              />
            </Grid>
          </React.Fragment>
        ))}

        {/* Save Button Row */}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
    </PaperP>
  );
}