import React, { useState, useEffect } from "react";
import { Typography, Grid, Chip, TextField, Slider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import fluidCSS from "@jeff-aporta/fluidcss";
import { TooltipIconButton, TooltipNoPointerEvents, generate_selects } from "@recurrent";
import ActionButtons from "./ActionButtons";
import { PaperP } from "@components/containers";
import { AutoSkeleton } from "@components/controls";
import CoinsOperating from "./CoinsOperating";
import { getResponse } from "@api/requestTable";
import { getThemeLuminance } from "@jeff-aporta/theme-manager";

import PanelCoinSelected from "./PanelCoinSelected";
import PanelOfInsertMoney from "./PanelOfInsertMoney";
import PanelOfProjections from "./PanelOfProjections";

export default function PanelBalance({
  currency,
  user_id,
  update_available,
  setUpdateAvailable,
  setView,
  coinsOperatingList,
  coinsToOperate,
  loadingCoinToOperate,
  coinsToDelete,
  errorCoinOperate,
  setErrorCoinOperate,
  onSellCoin,
  deletionTimers,
  setDeletionTimers,
  viewTable,
  setViewTable,
}) {
  const [actionInProcess, setActionInProcess] = useState(false);

  // price projection in state for automatic re-renders
  const [priceProjectionValue, setPriceProjectionValue] = useState(-3);
  const flatNumber = 12345;
  const roi = 0.05; // 5% ROI
  const balanceUSDT = 10000; // Example USDT balance
  const balanceCoin = 2.5; // Example coin balance

  // Estado para input y slider de dinero proyectado
  const [inputValue, setInputValue] = useState(10);
  const [sliderExp, setSliderExp] = useState(Math.log10(10));
  const marks = [
    { value: 1, label: "10" },
    { value: 2, label: "100" },
    { value: 3, label: "1.000" },
    { value: 4, label: "10.000" },
    { value: 5, label: "100.000" },
  ];
  const valuetext = (exp) => `${Math.round(10 ** exp)} USD`;

  // Helper functions
  const getPriceProjectionColor = () => {
    if (priceProjectionValue > 0) return "ok";
    if (priceProjectionValue < 0) return "error";
    return "warning";
  };

  const getPriceProjectionIcon = () => {
    if (priceProjectionValue > 0) return <TrendingUpIcon />;
    if (priceProjectionValue < 0) return <TrendingDownIcon />;
    return <TrendingFlatIcon />;
  };

  const settingIcon = () => (
    <TooltipIconButton
      title="Configurar"
      onClick={() => setView("settings")}
      icon={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SettingsIcon />
          <Typography variant="caption" color="text.secondary">
            <small>Configurar</small>
          </Typography>
        </div>
      }
    />
  );

  // Animation effect for price projection
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceProjectionValue((prev) => {
        const next = prev + 1 > 3 ? -3 : prev + 1;
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const hayMoneda = currency.current.trim() && !loadingCoinToOperate;

  return (
    <div key={currency.current}>
      <PaperP elevation={0}>
        <div>
          <div>
            <div className={`d-flex ai-center jc-space-evenly`}>
              {hayMoneda && (
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  alignItems="stretch"
                  wrap="wrap"
                  sx={{ width: "100%" }}
                >
                  <Grid item xs={12} sm={12} md={3}>
                    <PanelCoinSelected
                      {...{
                        currency,
                        coinsToOperate,
                        coinsToDelete,
                        loadingCoinToOperate,
                        errorCoinOperate,
                        setErrorCoinOperate,
                        user_id,
                        coinsOperatingList,
                        setUpdateAvailable,
                        viewTable,
                        setViewTable,
                        balanceUSDT,
                        balanceCoin,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <PanelOfProjections {...{ user_id, flatNumber }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <PanelOfInsertMoney
                      {...{
                        inputValue,
                        setInputValue,
                        setSliderExp,
                        sliderExp,
                        valuetext,
                        marks,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <ActionButtons
                      {...{
                        update_available,
                        setUpdateAvailable,
                        setView,
                        settingIcon,
                        currency,
                        coinsOperatingList,
                        coinsToOperate,
                        onSellCoin,
                        coinsToDelete,
                        setErrorCoinOperate,
                        user_id,
                        actionInProcess,
                        setActionInProcess,
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </div>
          </div>
        </div>
        {hayMoneda && (
          <>
            <br />
            <CoinsOperating
              {...{
                coinsOperatingList,
                coinsToDelete,
                deletionTimers,
                setDeletionTimers,
                onExternalDeleteRef: window.onSellCoinRef,
                user_id,
                setErrorCoinOperate,
                setUpdateAvailable,
                actionInProcess,
                setActionInProcess,
              }}
            />
          </>
        )}
      </PaperP>
    </div>
  );
}
