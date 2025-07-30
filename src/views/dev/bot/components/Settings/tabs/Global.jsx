import React, { Component } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import {
  showInfo,
  WaitSkeleton,
  TooltipGhost,
} from "@jeff-aporta/camaleon";
import { driverGlobal } from "./Global.driver.js";

export class GlobalView extends Component {
  componentDidMount() {
    driverGlobal.addLinkConfig(this);
    driverGlobal.addLinkLoading(this);
    driverGlobal.addLinkSaving(this);
    driverGlobal.addLinkWasChanged(this);
    driverGlobal.loadConfig();
  }

  componentWillUnmount() {
    driverGlobal.removeLinkConfig(this);
    driverGlobal.removeLinkLoading(this);
    driverGlobal.removeLinkSaving(this);
    driverGlobal.removeLinkWasChanged(this);
  }

  render() {
    // const config = driverGlobal.getConfig(); // No utilizado actualmente
    // const saving = driverGlobal.getSaving(); // No utilizado actualmente
    const loading = driverGlobal.getLoading();
    // const wasChanged = driverGlobal.getWasChanged(); // No utilizado actualmente

    return (
      <WaitSkeleton loading={loading}>
        <Grid
          container
          spacing={0}
          sx={{
            p: { xs: 0, sm: 2 },
            maxWidth: "100%",
            mx: "auto",
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {this.FormGlobal()}
        </Grid>
      </WaitSkeleton>
    );
  }

  FormGlobal() {
    // const config = driverGlobal.getConfig(); // No utilizado actualmente
    const saving = driverGlobal.getSaving();
    const wasChanged = driverGlobal.getWasChanged();
    
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 3 },
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: { xs: 0, sm: 2 },
            width: "100%",
          }}
        >
          {this.TitleTabGlobal()}
          <br />
          <form
            id="global-form"
            onChange={() => {
              driverGlobal.updateFromForm();
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {this.TextFieldMinProfitPercent()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.TextFieldRsiPercentDanger()}
              </Grid>
              <Grid item xs={12} sm={12}>
                {this.TextFieldMinProfitCurrency()}
              </Grid>
              <Grid item xs={12}>
                <div className="flex justify-end">
                  <TooltipGhost
                    title={driverGlobal.mapCaseWasChanged("tooltipSaveButton")}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => driverGlobal.saveConfig()}
                        loading={saving}
                        disabled={!wasChanged || saving}
                      >
                        {driverGlobal.mapCaseSaving("textButtonSave")}
                      </Button>
                    </div>
                  </TooltipGhost>
                </div>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    );
  }

  TitleTabGlobal() {
    return (
      <TitleTab
        title="Configuración Global"
        subtitle="Configuración general del sistema de trading"
        icon={<PublicIcon />}
      />
    );
  }

  TextFieldMinProfitPercent() {
    const config = driverGlobal.getConfig();
    return (
      <TextField
        label="Porcentaje mínimo de ganancia (%)"
        type="number"
        name="min_profit_percent"
        value={config.min_profit_percent}
        onKeyDown={(e) => {
          if (e.key === ".") {
            e.preventDefault();
            showInfo("La separación decimal es con coma");
          }
          if (e.key === "-") {
            e.preventDefault();
            showInfo("No se puede ingresar números negativos");
          }
        }}
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        fullWidth
      />
    );
  }

  TextFieldRsiPercentDanger() {
    const config = driverGlobal.getConfig();
    return (
      <TextField
        label="Porcentaje de peligro RSI (%)"
        type="number"
        name="rsi_percent_danger"
        value={config.rsi_percent_danger}
        onKeyDown={(e) => {
          if (e.key === ".") {
            e.preventDefault();
            showInfo("La separación decimal es con coma");
          }
          if (e.key === "-") {
            e.preventDefault();
            showInfo("No se puede ingresar números negativos");
          }
        }}
        InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
        fullWidth
      />
    );
  }

  TextFieldMinProfitCurrency() {
    const config = driverGlobal.getConfig();
    return (
      <TextField
        label="Ganancia mínima en moneda"
        type="number"
        name="min_profit_currency"
        value={config.min_profit_currency}
        onKeyDown={(e) => {
          if (e.key === ".") {
            e.preventDefault();
            showInfo("La separación decimal es con coma");
          }
          if (e.key === "-") {
            e.preventDefault();
            showInfo("No se puede ingresar números negativos");
          }
        }}
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        fullWidth
      />
    );
  }
}
