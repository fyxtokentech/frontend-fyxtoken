import React from "react";

import { ThemeSwitcher } from "@app/theme/templates.jsx";
import { Button, Typography } from "@mui/material";
import fluidCSS from "fluid-css-lng";

import { DivM, PaperP } from "@app/theme/containers";

export default Movements;

function Movements() {
  return (
    <ThemeSwitcher>
      <DivM>
        <Typography variant="h2">Billetera de inversión</Typography>
        <br />
        <WalletActions />
        <br />
        <Typography variant="h4">Movimientos</Typography>
      </DivM>
    </ThemeSwitcher>
  );
}

function WalletActions() {
  return (
    <div className="d-flex flex-wrap gap-20px padh-10px">
      <WalletAction
        startIcon={<i className="fa-solid fa-money-bill-trend-up" />}
      >
        Inversión
      </WalletAction>
      <WalletAction
        startIcon={<i className="fa-solid fa-money-bill-transfer" />}
      >
        Movimientos
      </WalletAction>
      <WalletAction startIcon={<i className="fa-solid fa-wallet" />}>
        Retiros
      </WalletAction>
    </div>
  );

  function WalletAction(props) {
    return (
      <Button
        {...props}
        size="large"
        variant="contained"
        className={fluidCSS()
          .ltX(550, {
            width: "100%",
          })
          .end(props.className)}
      />
    );
  }
}