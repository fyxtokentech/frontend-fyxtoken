import React from "react";
import { Paper, Typography } from "@mui/material";
import InvestmentTable from "./InvestmentTable";
import {
  getThemeName,
  InfoDialog,
  getPrimaryColor,
  getSecondaryColor,
  getColorPaperTheme,
  isDark,
  Color,
  AddSVGFilter,
} from "@jeff-aporta/camaleon";

export default () => <ActiveInvestments />;

class ActiveInvestments extends React.Component {
  render() {
    return (
      <>
        <Typography variant="h5">
          Activas{" "}
          <InfoDialog
            placement="right"
            className="ml-20px"
            isButton={true}
            description={
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
}
