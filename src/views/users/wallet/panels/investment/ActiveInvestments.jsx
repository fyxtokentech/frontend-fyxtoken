import React from "react";
import { Paper, Typography } from "@mui/material";
import InvestmentTable from "./InvestmentTable";
import { getThemeName, Info } from "@jeff-aporta/camaleon";

export default function ActiveInvestments() {
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
      <Paper elevation={0}>
        <InvestmentTable />
      </Paper>
    </>
  );
}
