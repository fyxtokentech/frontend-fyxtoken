import React from "react";
import { Typography } from "@mui/material";
import { Info } from "@components/repetitives";
import InvestmentTable from "./InvestmentTable";

function ActiveInvestments() {
  return (
    <>
      <Typography variant="h5">
        Activas{" "}
        <Info
          placement="right"
          className="ml-20px"
          title={
            <>
              Revisa y gestiona todos tus activos de manera centralizada.
              Visualiza su estado, rendimiento y valor, y toma decisiones
              estratégicas basadas en información actualizada.
            </>
          }
        />
      </Typography>
      <br />
      <div style={{ width: "100%", minHeight: "100px" }}>
        <InvestmentTable />
      </div>
    </>
  );
}

export default ActiveInvestments;
