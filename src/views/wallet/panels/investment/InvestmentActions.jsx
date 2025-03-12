import React from "react";

import fluidCSS from "fluid-css-lng";

import { PaperP } from "@components/containers";
import {
  generate_inputs,
  generate_selects,
  Info,
} from "@components/repetitives";

import { Button, Typography } from "@mui/material";
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
      button_action={
        <Button variant="contained" startIcon={<MonetizationOnIcon />}>
          Hacer inversión
        </Button>
      }
    >
      {generate_inputs([
        {
          placeholder: "Ingresa el monto a invertir",
          label: "Monto inversión",
          type: "number",
          id: "money-to-invest",
        },
      ])}
      {generate_selects([
        {
          label: "Paquete",
          name: "paquete",
          value: packtype,
          setter: setPacktype,
          opns: ["Pro", "Premium"],
        },
        {
          label: "Tiempo",
          name: "tiempo",
          value: time,
          setter: setTime,
          opns: ["5 minutos", "10 minutos", "7 días", "15 días"],
        },
      ])}
    </InvestmentAction>
  );
}

function InvestmentActionRecharge({ rechargeType, setRechargeType }) {
  return (
    <InvestmentAction
      w={`${rec - hol}%`}
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
      button_action={
        <Button variant="contained" startIcon={<PriceCheckIcon />}>
          Hacer Recarga{" "}
        </Button>
      }
    >
      {generate_selects([
        {
          label: "Tipo",
          name: "recharge",
          value: rechargeType,
          setter: setRechargeType,
          opns: ["PSE", "Nequi (ejemplo)"],
        },
      ])}
      {generate_inputs([
        {
          placeholder: "Ingresa el monto a recargar",
          label: "Monto recarga",
          id: "money-to-recharge",
          type: "number",
        },
      ])}
    </InvestmentAction>
  );
}

function InvestmentAction({ title, children, button_action, w }) {
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
      <div className="d-flex flex-wrap gap-20px">{children}</div>
      <br />
      {button_action}
    </PaperP>
  );
}

export { InvestmentActions };
