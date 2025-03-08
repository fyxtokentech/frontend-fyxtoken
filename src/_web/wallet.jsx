import React, { useState } from "react";

import { ThemeSwitcher } from "@components/templates.jsx";
import { DivM, PaperP } from "@components/containers.jsx";
import { Button, Typography } from "@mui/material";
import fluidCSS from "fluid-css-lng";

const wbrk = 950;

export default Wallet;

function Wallet() {
  const [actionSelected, setActionSelected] = useState("");

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

    function Investment() {
      return (
        <PaperP elevation={0}>
          <Typography variant="h3">Invierte en nuestras acciones</Typography>
          <br />
          En construcción... 🚧
        </PaperP>
      );
    }

    function Movements() {
      return (
        <PaperP elevation={0}>
          <Typography variant="h3">Historial de movimientos</Typography>
          <br />
          En construcción... 🚧
        </PaperP>
      );
    }

    function Withdrawal() {
      return (
        <PaperP elevation={0}>
          <Typography variant="h3">Retirar dinero de tu billetera</Typography>
          <br />
          En construcción... 🚧
        </PaperP>
      );
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
      const { action_id } = props;
      return (
        <Button
          {...props}
          variant="contained"
          className={fluidCSS()
            .ltX(550, {
              width: "100%",
            })
            .end(props.className)}
          onClick={() => {
            setActionSelected(action_id);
          }}
          disabled={actionSelected == action_id}
        />
      );
    }
  }
}

function Balance() {
  return (
    <PaperP
      elevation={24}
      className={fluidCSS()
        .ltX(wbrk, { textAlign: "center" })
        .end("d-space-between-center flex-wrap gap-20px min-h-150px")}
    >
      <Label_AvailableBalance />
      <Value_AvailableBalance />
    </PaperP>
  );

  function Cell_Field(props) {
    return (
      <Typography
        {...props}
        variant="h3"
        className={fluidCSS().ltX(wbrk, { width: "100%" }).end(props.className)}
      />
    );
  }

  function Value_AvailableBalance() {
    return (
      <Cell_Field>
        <b>$10.000,00</b> USDC
      </Cell_Field>
    );
  }

  function Label_AvailableBalance() {
    return <Cell_Field>Saldo disponible:</Cell_Field>;
  }
}
