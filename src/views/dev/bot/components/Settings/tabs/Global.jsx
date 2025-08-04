import React, { Component } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import {
  showInfo,
  WaitSkeleton,
  TooltipGhost,
  trunc,
  InputNumberDot,
} from "@jeff-aporta/camaleon";
import { driverGlobal } from "./Global.driver.js";

const decimals = 2;
const step = 1 / Math.pow(10, decimals);

export class GlobalView extends Component {
  componentDidMount() {
    driverGlobal.addLinkConfig(this);
    driverGlobal.addLinkLoading(this);
    driverGlobal.addLinkSaving(this);
    driverGlobal.loadConfig();
  }

  componentWillUnmount() {
    driverGlobal.removeLinkConfig(this);
    driverGlobal.removeLinkLoading(this);
    driverGlobal.removeLinkSaving(this);
  }

  render() {
    const loading = driverGlobal.getLoading();

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
    const saving = driverGlobal.getSaving();
    const isChanged = driverGlobal.isChangedConfig();

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
                    title={driverGlobal.mapCaseConfig(
                      "tooltipSaveButton",
                      !isChanged
                    )}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => driverGlobal.saveConfig()}
                        loading={saving}
                        disabled={isChanged || saving}
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
      <InputNumberDot
        label="Porcentaje mínimo de ganancia (%)"
        positive
        fullWidth
        name="min_profit_percent"
        value={trunc(config.min_profit_percent, decimals)}
        min={0}
        step={step}
        onChange={() => driverGlobal.updateFromForm()}
      />
    );
  }

  TextFieldRsiPercentDanger() {
    const config = driverGlobal.getConfig();
    return (
      <InputNumberDot
        label="Porcentaje de peligro RSI (%)"
        positive
        fullWidth
        name="rsi_percent_danger"
        value={trunc(config.rsi_percent_danger, decimals)}
        min={0}
        max={100}
        step={step}
        onChange={() => driverGlobal.updateFromForm()}
      />
    );
  }

  TextFieldMinProfitCurrency() {
    const config = driverGlobal.getConfig();
    return (
      <InputNumberDot
        label="Ganancia mínima en moneda"
        positive
        fullWidth
        name="min_profit_currency"
        value={trunc(config.min_profit_currency, decimals)}
        min={0}
        step={step}
        onChange={() => driverGlobal.updateFromForm()}
      />
    );
  }
}
