import React, { useEffect, useRef, useState } from "react";

import "./wallet.css";

import { Main } from "@theme/main";
import { FyxCarrusel } from "@components/carrousel/slick-carrousel";

import { Button, ButtonGroup, Paper, Tooltip, Typography } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";

import {
  isDark,
  fluidCSS,
  driverParams,
  DivM,
  PaperP,
  Hm,
} from "@jeff-aporta/camaleon";

import { Investment, Withdrawal, Movements } from "./panels/panels";

export default function () {
  return <Wallet />;
}

function Wallet() {
  if (!driverParams.get("action-id")) {
    driverParams.set("action-id", "investment", { reload: 500 });
  }

  const [actionSelected, setActionSelected] = useState(
    driverParams.get("action-id") ?? "investment"
  );

  useEffect(() => {
    setActionSelected(
      actionSelected ?? driverParams.get("action-id") ?? "investment"
    );
  }, []);

  const refcontainer = useRef();

  return (
    <Main h_init="20px">
      <DivM>
        <Title />
        <br />
        <Balance />
        <br />
        <div
          ref={refcontainer}
          style={{
            position: "relative",
            padding: "10px 0",
            height: "fit-content",
          }}
        >
          <WalletActions refcontainer={refcontainer} />
          <PanelActionSelected />
        </div>
        <br />
        {(() => {
          return (
            <>
              {actionSelected ? <br /> : null}
              <br />
              <hr />
              <br />
              <br />
              <Typography variant="h4" className="flex align-center gap-20px">
                <NewspaperIcon color="contrast" fontSize="large" />{" "}
                <span className="color-bg-opposite">Novedades</span>
              </Typography>
              <br />
              <br />
              <FyxCarrusel
                className="rz-overfx"
                style={{
                  width: "100%",
                  minHeight: "clamp(390px, 50vh, 90vw)",
                  margin: "0 auto",
                }}
              />
            </>
          );
        })()}
      </DivM>
      <Hm r={10} />
    </Main>
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
        className={fluidCSS()
          .ltX(600, { fontWeight: "500" })
          .end("color-bg-opposite")}
      >
        {txt}
      </Typography>
    );
  }

  function WalletActions({ refcontainer }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <Paper
        elevation={2}
        className="z-overfx"
        style={{
          position: "sticky",
          top: "0",
          padding: "10px",
        }}
      >
        <ButtonGroup
          fullWidth
          size={windowWidth > 600 ? "medium" : "small"}
          variant="contained"
          sx={{ boxShadow: "none" }}
        >
          <WalletAction
            startIcon={<i className="fa-solid fa-money-bill-trend-up" />}
            action_id="investment"
            refcontainer={refcontainer}
          >
            Inversión
          </WalletAction>
          <WalletAction
            startIcon={<i className="fa-solid fa-money-bill-transfer" />}
            action_id="movements"
            refcontainer={refcontainer}
          >
            Movimientos
          </WalletAction>
          <WalletAction
            startIcon={<i className="fa-solid fa-wallet" />}
            action_id="withdrawal"
            refcontainer={refcontainer}
          >
            Retiros
          </WalletAction>
        </ButtonGroup>
      </Paper>
    );

    function WalletAction(props) {
      const { action_id, children, refcontainer } = props;
      return (
        <div
          className={fluidCSS()
            .ltX(550, {
              width: "100%",
            })
            .end()}
        >
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
                className={fluidCSS()
                  .ltX(550, {
                    width: "100%",
                  })
                  .end(props.className ?? "")}
                variant="contained"
                onClick={() => {
                  if (refcontainer) {
                    const elemento = refcontainer.current;
                    const offsetTop = elemento.offsetTop;
                    window.scrollTo({
                      top: offsetTop,
                      behavior: "smooth",
                    });
                  }
                  driverParams.set("action-id", action_id);
                  setActionSelected(action_id);
                }}
                disabled={actionSelected == action_id}
              />
            </div>
          </Tooltip>
        </div>
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
          .ltX("medium", { textAlign: "center" })
          .end(
            "flex space-between align-center relative wrap gap-20px min-h-150px"
          )}
      >
        <LabelPart variant="h3">Saldo disponible:</LabelPart>
        <br />
        <LabelPart variant="h4">$10.000,00 USDC</LabelPart>
      </PaperP>
    </div>
  );

  function LabelPart(props) {
    return (
      <Typography
        variant="h3"
        {...props}
        className={fluidCSS()
          .ltX("medium", { width: "100%" })
          .end(props.className ?? "")}
      />
    );
  }
}
