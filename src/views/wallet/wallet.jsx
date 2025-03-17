import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import DriverParams from "@routes/DriverParams";
import fluidCSS from "@jeff-aporta/fluidcss";

import { ThemeSwitcher } from "@components/templates";
import { DivM, PaperP } from "@components/containers";
import FyxCarrusel from "@components/GUI/slick-carrousel";
import { Button, ButtonGroup, Paper, Tooltip, Typography } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";

import { isDark } from "@jeff-aporta/theme-manager";

import { zIndex } from "@theme/constants";

import { Investment, Withdrawal, Movements } from "./panels/panels";
import "./wallet.css";

const wbrk = 950;

export default Wallet;

function Wallet() {
  const location = useLocation();
  const driverParams = DriverParams();

  if (!driverParams.get("action-id")) {
    driverParams.set("action-id", "investment", { reload: true });
  }

  const [actionSelected, setActionSelected] = useState(
    driverParams.get("action-id") ?? "investment"
  );

  useEffect(() => {
    setActionSelected(driverParams.get("action-id") ?? "investment");
  }, [location]);

  const refcontainer = useRef();

  return (
    <ThemeSwitcher h_init="1px" h_fin="300px">
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
              {actionSelected ? (
                <>
                  <br />
                  <br />
                  <br />
                </>
              ) : null}
              <br />
              <hr />
              <br />
              <br />
              <Typography variant="h4" className="d-flex ai-center gap-20px">
                <NewspaperIcon color="secondary" fontSize="large" />{" "}
                <span>Novedades</span>
              </Typography>
              <br />
              <br />
              <FyxCarrusel
                style={{
                  position: "relative",
                  width: "100%",
                  minHeight: "clamp(390px, 50vh, 90vw)",
                  margin: "0 auto",
                  zIndex: zIndex.MinOverMouseFx,
                }}
              />
            </>
          );
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
        style={{
          position: "sticky",
          top: "0",
          zIndex: zIndex.MinOverscroll,
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
