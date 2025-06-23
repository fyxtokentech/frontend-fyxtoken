import React, { useState } from "react";
import { PaperP } from "@jeff-aporta/camaleon";
import { TitlePanel } from "../comun";

// Import modular components
import { InvestmentActions } from "./InvestmentActions";
import ActiveInvestments from "./ActiveInvestments";
import { Typography } from "@mui/material";

let _time_ = "";
let _pack_type_ = "";
let _recharge_type_ = "";

function Investment() {
  const [packtype, setPacktype] = useState(_pack_type_);
  _pack_type_ = packtype;

  const [rechargeType, setRechargeType] = useState(_recharge_type_);
  _recharge_type_ = rechargeType;

  const [time, setTime] = useState(_time_);
  _time_ = time;

  return (
    <PaperP elevation={0}>
      <TitlePanel>Paquetes de inversión</TitlePanel>

      {/* Investment description */}
      <InvestmentHeader />
      <br />

      {/* Investment actions section */}
      <InvestmentActions
        {...{
          time,
          setTime,
          rechargeType,
          setRechargeType,
          packtype,
          setPacktype,
        }}
      />

      <br />
      <hr />
      <br />

      {/* Active investments section */}
      <ActiveInvestments />
    </PaperP>
  );
}

function InvestmentHeader() {
  return (
    <div className="mh-10px">
      <Typography variant="caption" color="secondary">
        Selecciona entre diferentes paquetes de inversión diseñados para
        maximizar tus rendimientos y adaptarse a tus metas financieras. Conoce
        sus detalles, plazos y beneficios para tomar la mejor decisión de
        inversión.
      </Typography>
    </div>
  );
}

export default Investment;
