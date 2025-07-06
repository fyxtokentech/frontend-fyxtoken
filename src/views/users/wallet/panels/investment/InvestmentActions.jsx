import React, { Component } from "react";

import { fluidCSS } from "@jeff-aporta/camaleon";

import {
  PaperP,
  genInputsGender,
  genSelectFast,
  InfoDialog,
  isDark,
  showInfo,
  showSuccess,
  TooltipGhost,
  Layer,
  Design,
  isMedium,
  ReserveLayer,
} from "@jeff-aporta/camaleon";

import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

function InvestmentActions({
  time,
  setTime,
  rechargeType,
  setRechargeType,
  packtype,
  setPacktype,
}) {
  return (
    <div className="flex wrap gap-10px justify-space-evenly">
      <InvestmentActionRecharge {...{ rechargeType, setRechargeType }} />
      <InvestmentActionInvest {...{ packtype, setPacktype, time, setTime }} />
    </div>
  );
}

const inv = 60;
const rec = 100 - inv;
const hol = 0.5;

function InvestmentActionInvest({ packtype, setPacktype, time, setTime }) {
  return (
    <InvestmentAction
      w={`${inv - hol}%`}
      clean={() => {
        setTime("");
        setPacktype("");
      }}
      title={
        <>
          Inversión
          <InfoDialog
            placement="right"
            className="ml-20px"
            description={
              <>
                Invierte tu dinero eligiendo el paquete y el plazo que mejor se
                ajusten a tus metas financieras. Ingresa el monto, confirma la
                operación y comienza a generar rendimientos.
              </>
            }
          />
        </>
      }
      button_action={{
        tooltip_title: "Click para confirmar",
        startIcon: <MonetizationOnIcon />,
        text: "Hacer inversión",
      }}
    >
      {genInputsGender([
        {
          name: "investment_amount",
          label: "Monto de inversión",
          type: "number",
          id: "money-to-invest",
        },
      ])}
      {genSelectFast([
        {
          label: "plan",
          value: packtype,
          onChange: (e, value) => setPacktype(value),
          opns: {
            pse: "PSE",
            nequi: "Nequi",
          },
        },
        {
          label: "Intervalo",
          value: time,
          onChange: (e, value) => setTime(value),
          opns: {
            "5m": "5 minutos",
            "10m": "10 minutos",
            "15m": "15 minutos",
            "1h": "1 hora",
            "1d": "1 día",
          },
        },
      ])}
    </InvestmentAction>
  );
}

function InvestmentActionRecharge({ rechargeType, setRechargeType }) {
  return (
    <InvestmentAction
      w={`${rec - hol}%`}
      clean={() => {
        setRechargeType("");
      }}
      title={
        <>
          Recarga
          <InfoDialog
            placement="right"
            className="ml-20px"
            description={
              <>
                Añade fondos a tu cuenta de forma rápida y segura. Selecciona el
                método de recarga, ingresa el monto deseado y confirma la
                operación para disponer de tu saldo inmediatamente.
              </>
            }
          />
        </>
      }
      button_action={{
        tooltip_title: "Click para confirmar",
        startIcon: <PriceCheckIcon />,
        text: "Hacer Recarga",
      }}
    >
      {genSelectFast([
        {
          label: "Tipo",
          name: "recharge",
          value: rechargeType,
          onChange: (e, value) => setRechargeType(value),
          required: true,
          opns: {
            pse: "PSE",
            nequi: "Nequi (ejemplo)",
          },
        },
      ])}
      {genInputsGender([
        {
          label: "Monto a recargar",
          id: "money-to-recharge",
          required: true,
          type: "number",
        },
      ])}
    </InvestmentAction>
  );
}

class InvestmentAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      process_transaction: false,
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { clean, onSubmit } = this.props;
    this.setState({ process_transaction: true });

    if (onSubmit) {
      await onSubmit(e);
    } else {
      showInfo("Espera mientras se procesa tu solicitud");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      showSuccess("Muy bien");
      clean();
    }

    this.setState({ process_transaction: false });
    return true;
  };

  render() {
    const { title, children, button_action } = this.props;
    const { process_transaction } = this.state;

    return (
      <PaperP
        className={fluidCSS()
          .ltX("large", {
            maxWidth: ["100%", "50%"],
            width: ["100%", "49%"],
          })
          .end("design")}
      >
        <Typography variant="h6">{title}</Typography>
        <br />
        <Box
          component="form"
          style={{
            pointerEvents: process_transaction ? "none" : "auto",
          }}
          onSubmit={this.handleSubmit}
        >
          <div
            className="flex wrap gap-20px"
            style={{
              pointerEvents: process_transaction ? "none" : "auto",
              opacity: process_transaction ? 0.6 : 1,
            }}
          >
            {children}
          </div>
          <br />
          <ReserveLayer className="right bottom pad-10px flex justify-end">
            <br />
            <TooltipGhost title={button_action.tooltip_title}>
              <Button
                type="submit"
                variant="contained"
                size={isMedium() ? "small" : "medium"}
                startIcon={button_action.startIcon}
                disabled={process_transaction}
              >
                {button_action.text}
              </Button>
            </TooltipGhost>
          </ReserveLayer>
        </Box>
      </PaperP>
    );
  }
}

export { InvestmentActions };
