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
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ApiIcon from "@mui/icons-material/Api";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExpandIcon from "@mui/icons-material/Expand";
import PublicIcon from "@mui/icons-material/Public";

import {
  PaperP,
  driverParams,
  TooltipGhost,
  ButtonShyText,
} from "@jeff-aporta/camaleon";
import { APIKeyView } from "./tabs/APIKey";
import { RSIView } from "./tabs/RSI";
import { CriptomonedasView } from "./tabs/Cripto";
import { AutoView } from "./tabs/Auto";
import { CandlestickView } from "./tabs/Candle";
import { AutomatizacionView } from "./tabs/Auto";
import { PIPView } from "./tabs/PIP";
import { GlobalView } from "./tabs/Global";

import { driverPanelRobot } from "../../bot.driver.js";

export const driverSettings = {
  setViewSetting: (view) => driverParams.set("view_setting_bot", view),
  getViewSetting: () => driverParams.get("view_setting_bot")[0] || "apis",
};

export default function Settings() {
  const views = [
    { id: "apis", label: "APIs", icon: <ApiIcon /> },
    {
      id: "criptomonedas",
      label: "Criptomonedas",
      icon: <CurrencyBitcoinIcon />,
    },
    { id: "rsi", label: "RSI", icon: <ShowChartIcon /> },
    { id: "candlestick", label: "Candlestick", icon: <CandlestickChartIcon /> },
    { id: "pips", label: "Pips", icon: <ExpandIcon /> },
    { id: "global", label: "Global", icon: <PublicIcon /> },
  ];
  const initialView = driverSettings.getViewSetting();
  const [selectedViewSetting, setSelectedViewSetting] = useState(initialView);

  useEffect(() => {
    if (!views.find((v) => v.id === initialView)) {
      driverSettings.setViewSetting("apis");
      setSelectedViewSetting("apis");
    } else {
      setSelectedViewSetting(initialView);
    }
  }, []);

  const handleSelect = (id) => {
    driverSettings.setViewSetting(id);
    setSelectedViewSetting(id);
  };
  const drawerWidth = 240;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <ButtonShyText
          tooltip="Volver al panel principal"
          color="close"
          onClick={() => driverPanelRobot.setToMainViewBot()}
          startIcon={<DisabledByDefaultIcon fontSize="small" />}
        >
          Cerrar configuración
        </ButtonShyText>
      </Box>

      <Paper elevation={5}>
        <AppBar position="static">
          <Tabs
            value={selectedViewSetting}
            onChange={(e, v) => handleSelect(v)}
            variant="scrollable"
            scrollButtons="auto"
            visibleScrollbar
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "l3.main",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "l3.main",
              },
            }}
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
          className="fullWidth align-stretch"
        >
          <Box component="main" sx={{ flexGrow: 1 }}>
            <PaperP>
              <br />
              {selectedViewSetting === "apis" && (
                <>
                  <APIKeyView />
                </>
              )}
              {selectedViewSetting === "criptomonedas" && <CriptomonedasView />}
              {selectedViewSetting === "rsi" && <RSIView />}
              {selectedViewSetting === "candlestick" && <CandlestickView />}
              {selectedViewSetting === "pips" && <PIPView />}
              {selectedViewSetting === "global" && <GlobalView />}
            </PaperP>
          </Box>
        </Box>
      </Paper>

      <br />
      <PaperP>
        <AutomatizacionView />
      </PaperP>
    </>
  );
}
