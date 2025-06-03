import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  AppBar,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ApiIcon from "@mui/icons-material/Api";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import { PaperP } from "@containers";
import { APIKeyView, exchanges, exchanges_withdrawal } from "./tabs/APIKey";
import { RSIView } from "./tabs/RSI";
import { CriptomonedasView } from "./tabs/Cripto";
import { AutoView } from "./tabs/Auto";
import { CandlestickView } from "./tabs/Candle";
import { AutomatizacionView } from "./tabs/Auto";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<CloseIcon />}
          onClick={() => setView("main")}
        >
          Cerrar
        </Button>
      </Box>
      <Paper>
        <AppBar position="static" color="default">
          <Tabs
            value={selectedViewSetting}
            onChange={(e, v) => handleSelect(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {views.map((view) => (
              <Tab
                key={view.id}
                label={view.label}
                icon={view.icon}
                value={view.id}
              />
            ))}
          </Tabs>
        </AppBar>
        <Box
          sx={{ display: isMobile ? "block" : "flex" }}
          className="fullWidth ai-stretch"
        >
          <Box component="main" sx={{ flexGrow: 1 }}>
            <PaperP>
              <br />
              {selectedViewSetting === "apis" && (
                <>
                  <APIKeyView
                    apiKeys={apiKeys}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                  />
                </>
              )}
              {selectedViewSetting === "criptomonedas" && <CriptomonedasView />}
              {selectedViewSetting === "rsi" && <RSIView />}
              {selectedViewSetting === "candlestick" && <CandlestickView />}
              {selectedViewSetting === "automatizacion" && <AutomatizacionView />}
            </PaperP>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
