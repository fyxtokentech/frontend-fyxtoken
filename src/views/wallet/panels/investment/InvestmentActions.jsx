import React, { useState } from "react";

import fluidCSS from "@jeff-aporta/fluidcss";

import { PaperP } from "@components/containers";
import { BoxForm } from "@components/repetitives";
import {
  generate_inputs,
  generate_selects,
  Info,
} from "@components/repetitives";

import { isDark } from "@jeff-aporta/theme-manager";

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
    <div className="d-flex flex-wrap gap-10px jc-space-between">
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
          <Info
            placement="right"
            className="ml-20px"
            title={
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
      {generate_inputs([
        {
          name: "investment_amount",
          label: "Monto de inversión",
          type: "number",
          id: "money-to-invest",
        },
      ])}
      {generate_selects([
        {
          model: "plan",
          value: packtype,
          setter: setPacktype,
        },
        {
          model: "interval",
          value: time,
          setter: setTime,
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
          <Info
            placement="right"
            className="ml-20px"
            title={
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
      {generate_selects([
        {
          label: "Tipo",
          name: "recharge",
          value: rechargeType,
          setter: setRechargeType,
          required: true,
          opns: ["PSE", "Nequi (ejemplo)"],
        },
      ])}
      {generate_inputs([
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

function InvestmentAction({
  title,
  children,
  clean,
  button_action,
  onSubmit,
  w,
}) {
  const [process_transaction, setProcessTransaction] = useState(false);

  return (
    <PaperP
      className={fluidCSS()
        .ltX(1160, {
          width: ["100%", w],
        })
        .end()}
    >
      <Typography variant="h6">{title}</Typography>
      <br />
      <BoxForm
        component="form"
        style={{
          pointerEvents: process_transaction ? "none" : "auto",
        }}
        onSubmit={async (e, data, notify, form_reset) => {
          console.log("procesar data:", data, "invocado por:", e.target);

          setProcessTransaction(true);

          notify({
            severity: "info",
            message: "Espera mientras se procesa tu solicitud",
            icon: (
              <CircularProgress
                size="16px"
                color={isDark() ? "verde_cielo" : "white"}
              />
            ),
          });

          // Espera 5 segundos
          await new Promise((resolve) => setTimeout(resolve, 5000));

          clean();
          form_reset();

          setProcessTransaction(false);
          return {
            severity: "success",
            message: "Listo",
          };
        }}
      >
        <div
          className="d-flex flex-wrap gap-20px"
          style={{
            pointerEvents: process_transaction ? "none" : "auto",
            opacity: process_transaction ? 0.6 : 1,
          }}
        >
          {children}
        </div>
        <br />
        <Tooltip title={button_action.tooltip_title}>
          <Button
            type="submit"
            variant="contained"
            startIcon={button_action.startIcon}
            disabled={process_transaction}
          >
            {button_action.text}
          </Button>
        </Tooltip>
      </BoxForm>
    </PaperP>
  );
}

export { InvestmentActions };
