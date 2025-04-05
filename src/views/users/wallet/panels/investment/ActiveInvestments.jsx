import React from "react";
import { Paper, Typography } from "@mui/material";
import { Info } from "@recurrent";
import InvestmentTable from "./InvestmentTable";
import { getThemeName } from "@jeff-aporta/theme-manager";

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
