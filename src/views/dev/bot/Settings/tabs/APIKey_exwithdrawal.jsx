import React, { useState } from "react";
import {
  Grid,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { APIKeyExchange } from "./APIKey";

const EXCHANGES_AVAILABLE = ["KRAKEN"];

export const exchanges_withdrawal = [
  {
    name_api: "KRAKEN",
    enabled: true,
    attributes_api: {
      API_KEY: "1234",
      API_SECRET: "1234",
    },
    id_api_user: "kraken-id",
  },
];

export function ExchangeManagerWithdrawal({ handleInputChange }) {
  const [apiKeys, setApiKeys] = useState(() =>
    prepareToInit(exchanges_withdrawal, true)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exchange, setExchange] = useState(EXCHANGES_AVAILABLE[0]);
  const [loading] = useState(false);

  function prepareToInit(array, withdrawal) {
    return array.reduce((acc, ex) => {
      acc[ex.name_api.toLowerCase()] = {
        apiKey: "",
        secretKey: "",
        withdrawal,
        enabled: ex.enabled,
      };
      return acc;
    }, {});
  }

  return (
    <>
      {exchanges_withdrawal.map((ex) => {
        const { name_api, attributes_api, id_api_user, enabled } = ex;
        const { API_KEY, API_SECRET } = attributes_api;
        const general = {
          getNameExchange: () => name_api,
          getEnabled: () => enabled,
          setEnabled: (value) =>
            handleInputChange(id_api_user, "enabled", ["I", "A"][+value]),
          getAttributesApi: () => attributes_api,
          getIdApiUser: () => id_api_user,
        };
        let apiKeyInstance = {};
        switch (name_api.toUpperCase()) {
          case "KRAKEN":
            apiKeyInstance = {
              ...general,
              getApiKey: () => API_KEY,
              getSecretKey: () => API_SECRET,
              setApiKey: (value) =>
                handleInputChange(
                  id_api_user,
                  ["attributes_api", "API_KEY"],
                  value
                ),
              setSecretKey: (value) =>
                handleInputChange(
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
          <React.Fragment key={id_api_user || name_api}>
            <br />
            <APIKeyExchange apiKeyInstance={apiKeyInstance} />
          </React.Fragment>
        );
      })}
      <p align="right">
        <br />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Agregar nueva API de Retiro
        </Button>
      </p>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Agregar nueva API de Retiro</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="exchange-select-label">Exchange</InputLabel>
            <Select
              labelId="exchange-select-label"
              value={exchange}
              label="Exchange"
              onChange={(e) => setExchange(e.target.value)}
              disabled={loading}
            >
              {EXCHANGES_AVAILABLE.map((exName) => (
                <MenuItem key={exName} value={exName}>
                  {exName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
