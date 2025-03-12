import React, { useRef, useState } from "react";

import DriverParams from "@routes/DriverParams";
import fluidCSS from "fluid-css-lng";

import { ThemeSwitcher } from "@components/templates";
import { DivM, PaperP } from "@components/containers";
import { Info } from "@components/repetitives";
import { Button, Paper, Tooltip, Typography } from "@mui/material";

import { isDark } from "@theme/theme-manager";

import { Investment, Withdrawal, Movements } from "./panels/00-panels";
import "./wallet.css";

const wbrk = 950;

export default Wallet;

function Wallet() {
  const driverParams = DriverParams();

  const [actionSelected, setActionSelected] = useState(
    driverParams.get("action-id") ?? ""
  );

  return (
    <ThemeSwitcher h_init="40px" h_fin="300px">
      <DivM>
        <Title />
        <br />
        <Balance />
        <br />
        <WalletActions />
        <br />
        <PanelActionSelected />
        <br />
        {(() => {
          if (!actionSelected) {
            return (
              <Paper className="min-h-300px d-center">
                Slider en construcción... 🚧
              </Paper>
            );
          }
        })()}
      </DivM>
    </ThemeSwitcher>
  );

  function PanelActionSelected() {
    switch (actionSelected) {
      case "investment":
        return <Investment />;
      case "movements":
        return <Movements />;
      case "withdrawal":
        return <Withdrawal />;
      default:
        return null;
    }
  }

  function Title() {
    const txt = "Billetera de inversión";
    document.querySelector("title").innerHTML = txt;
    return (
      <Typography
        variant="h2"
        className={fluidCSS().ltX(600, { fontWeight: "500" }).end()}
      >
        {txt}
      </Typography>
    );
  }

  function WalletActions() {
    return (
      <div
        className={fluidCSS()
          .ltX(wbrk, { justifyContent: "center" })
          .end("d-flex-wrap gap-20px padh-10px")}
      >
        <WalletAction
          startIcon={<i className="fa-solid fa-money-bill-trend-up" />}
          action_id="investment"
        >
          Inversión
        </WalletAction>
        <WalletAction
          startIcon={<i className="fa-solid fa-money-bill-transfer" />}
          action_id="movements"
        >
          Movimientos
        </WalletAction>
        <WalletAction
          startIcon={<i className="fa-solid fa-wallet" />}
          action_id="withdrawal"
        >
          Retiros
        </WalletAction>
      </div>
    );

    function WalletAction(props) {
      const { action_id, children } = props;
      return (
        <Tooltip
          title={
            (actionSelected == action_id
              ? "Visualizando panel "
              : "Visualizar panel de ") + children
          }
        >
          <div>
            <Button
              {...props}
              variant="contained"
              className={fluidCSS()
                .ltX(550, {
                  width: "100%",
                })
                .end(props.className ?? "")}
              onClick={() => {
                driverParams.set("action-id", action_id, true);
                setActionSelected(action_id);
              }}
              disabled={actionSelected == action_id}
            />
          </div>
        </Tooltip>
      );
    }
  }
}
var border_animate = true;

function Balance() {
  setTimeout(() => (border_animate = false), 5 * 1000);

  return (
    <div className="Balance">
      <div
        className={`borde ${border_animate ? "animate" : ""}`}
        style={{ filter: isDark() ? "" : "hue-rotate(130deg)" }}
      />
      <PaperP
        elevation={isDark() ? 24 : 6}
        className={fluidCSS()
          .ltX(wbrk, { textAlign: "center" })
          .end(
            "d-space-between-center p-relative flex-wrap gap-20px min-h-150px"
          )}
      >
        <Label_AvailableBalance />
        <Value_AvailableBalance />
      </PaperP>
    </div>
  );

  function Cell_Field(props) {
    return (
      <Typography
        {...props}
        variant="h3"
        className={fluidCSS()
          .ltX(wbrk, { width: "100%" })
          .end(props.className ?? "")}
      />
    );
  }

  function Value_AvailableBalance() {
    return <Cell_Field>$10.000,00 USDC</Cell_Field>;
  }

  function Label_AvailableBalance() {
    return <Cell_Field>Saldo disponible:</Cell_Field>;
  }
}
