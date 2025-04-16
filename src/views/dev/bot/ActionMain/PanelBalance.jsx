import React, { useState, useEffect } from "react";
import { Typography, Grid, Button, Tooltip, Chip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/Cached";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import fluidCSS from "@jeff-aporta/fluidcss";
import { TooltipIconButton, generate_selects } from "@recurrent";
import { PaperP } from "@containers";

const time_wait_update_available_again = 5;

export default function PanelBalance({
  currency,
  setCurrency,
  update_available,
  setUpdateAvailable,
  setView,
}) {
  // State for price projection animation
  const [priceProjection, setPriceProjection] = useState(-3);
  const flatNumber = 12345;
  const roi = 0.05; // 5% ROI
  const balanceUSDT = 10000; // Example USDT balance
  const balanceCoin = 2.5; // Example coin balance

  // Helper functions
  const getPriceProjectionColor = () => {
    if (priceProjection > 0) return "ok";
    if (priceProjection < 0) return "error";
    return "warning";
  };

  const getPriceProjectionIcon = () => {
    if (priceProjection > 0) return <TrendingUpIcon />;
    if (priceProjection < 0) return <TrendingDownIcon />;
    return <TrendingFlatIcon />;
  };

  const settingIcon = () => (
    <TooltipIconButton
      title="Ajustar API"
      onClick={() => setView("settings")}
      icon={
        <>
          <SettingsIcon /> <span style={{ fontSize: "14px" }}>API</span>
        </>
      }
    />
  );

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = priceProjection + 1;
      const finalValue = newValue > 3 ? -3 : newValue;
      setPriceProjection(finalValue);
    }, 1000);

    return () => clearInterval(interval);
  }, [priceProjection]);

  return (
    <PaperP elevation={0}>
      <div className="d-flex ai-center jc-space-between flex-wrap gap-10px">
        <div className="d-flex ai-center flex-wrap gap-10px">
          <div
            className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS()
              .ltX(480, { width: "100%" })
              .end()}`}
          >
            <PaperP className="d-center" p_min="5" p_max="10">
              {generate_selects([
                {
                  value: currency,
                  setter: setCurrency,
                  name: "currency",
                  label: "Moneda",
                  opns: ["PEPE", "BTC", "BNB", "ETH"],
                  required: true,
                  fem: true,
                },
              ])}
            </PaperP>

            <BalanceUSDTCard balance={balanceUSDT} />
            <BalanceCoinCard balance={balanceCoin} currency={currency} />
            <PriceProjectionCard
              priceProjection={priceProjection}
              getPriceProjectionColor={getPriceProjectionColor}
              getPriceProjectionIcon={getPriceProjectionIcon}
            />
            <FlatNumberCard flatNumber={flatNumber} />
            <ROICard roi={roi} />
          </div>
        </div>

        <ActionButtons
          update_available={update_available}
          setUpdateAvailable={setUpdateAvailable}
          setView={setView}
          settingIcon={settingIcon}
        />
      </div>
    </PaperP>
  );
}

function UpdateButton({ update_available, setUpdateAvailable, ...rest_props }) {
  return (
    <TooltipIconButton
      {...rest_props}
      title={() =>
        update_available ? "Actualizar" : "Espera para volver a actualizar"
      }
      icon={<UpdateIcon />}
      disabled={!update_available}
      onClick={() => {
        setUpdateAvailable(false);
        setTimeout(() => {
          setUpdateAvailable(true);
        }, time_wait_update_available_again * 1000);
      }}
    />
  );
}

function BalanceUSDTCard({ balance }) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Balance USDT
        </Typography>
        <Typography>${balance.toLocaleString()}</Typography>
      </div>
    </PaperP>
  );
}

function BalanceCoinCard({ balance, currency }) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Balance {currency}
        </Typography>
        <Typography>
          {balance.toLocaleString()} {currency}
        </Typography>
      </div>
    </PaperP>
  );
}

function PriceProjectionCard({
  priceProjection,
  getPriceProjectionColor,
  getPriceProjectionIcon,
}) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Precio Proyectado
        </Typography>
        <div className="d-flex ai-center gap-5px">
          <Typography
            className="d-flex ai-center gap-5px"
            color={getPriceProjectionColor()}
          >
            {getPriceProjectionIcon()}
            {priceProjection} BTC
          </Typography>
        </div>
      </div>
    </PaperP>
  );
}

function FlatNumberCard({ flatNumber }) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Ganancia Proyectada
        </Typography>
        <Typography>{flatNumber}</Typography>
      </div>
    </PaperP>
  );
}

function ROICard({ roi }) {
  return (
    <PaperP
      className={`d-center ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography variant="caption" color="text.secondary" className="mb-5px">
          Porcentaje Proyectado
        </Typography>
        <div className="d-flex ai-center gap-5px">
          <CurrencyExchangeIcon />
          <span>{(roi * 100).toFixed(2)}%</span>
        </div>
      </div>
    </PaperP>
  );
}

function ActionButtons({
  update_available,
  setUpdateAvailable,
  setView,
  settingIcon,
}) {
  return (
    <div
      className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS()
        .ltX(768, {
          width: "100%",
          justifyContent: "flex-end",
          marginTop: "10px",
        })
        .end()}`}
    >
      <UpdateButton {...{ update_available, setUpdateAvailable }} />
      {settingIcon()}
      <div className="d-flex gap-10px">
        <Button variant="contained" color="ok" size="small">
          Comprar
        </Button>
        <Button variant="contained" color="cancel" size="small">
          Vender
        </Button>
      </div>
    </div>
  );
}
