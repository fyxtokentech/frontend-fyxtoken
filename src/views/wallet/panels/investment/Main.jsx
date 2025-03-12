import React, { useState } from "react";
import { PaperP } from "@components/containers";
import { TitlePanel } from "../comun";

// Import modular components
import { InvestmentActions } from "./InvestmentActions";
import ActiveInvestments from "./ActiveInvestments";
import { Typography } from "@mui/material";

function Investment() {
  // State management for investment actions
  const [packtype, setPacktype] = useState("");
  const [time, setTime] = useState("");
  const [rechargeType, setRechargeType] = useState("PSE");

  return (
    <PaperP elevation={0}>
      <TitlePanel>Paquetes de inversión</TitlePanel>
      
      {/* Investment description */}
      <InvestmentHeader />
      <br />
      
      {/* Investment actions section */}
      <InvestmentActions
        time={time}
        setTime={setTime}
        rechargeType={rechargeType}
        setRechargeType={setRechargeType}
        packtype={packtype}
        setPacktype={setPacktype}
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
