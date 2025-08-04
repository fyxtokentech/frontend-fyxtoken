import React, { Component, useEffect } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import {
  WaitSkeleton,
  TooltipGhost,
  trunc,
  InputNumberDot,
} from "@jeff-aporta/camaleon";
import { driverPIP } from "./PIP.driver.js";

const decimals = 2;
const step = 1 / Math.pow(10, decimals);

export class PIPView extends Component {
  componentDidMount() {
    driverPIP.addLinkConfig(this);
    driverPIP.addLinkLoading(this);
    driverPIP.addLinkSaving(this);

    driverPIP.loadConfig();
  }

  componentWillUnmount() {
    driverPIP.removeLinkConfig(this);
    driverPIP.removeLinkLoading(this);
    driverPIP.removeLinkSaving(this);
  }

  render() {
    const config = driverPIP.getConfig();
    const saving = driverPIP.getSaving();
    const loading = driverPIP.getLoading();
    const isChanged = driverPIP.isChangedConfig();
    return (
      <Box sx={{ p: 2 }}>
        <TitleTab
          variant="h5"
          title="Configuración Pips"
          subtitle="Configuración de puntos de interés y stop loss"
        />
        <WaitSkeleton loading={loading}>
          <form
            id="pip-form"
            onChange={() => {
              driverPIP.setFromIdFormConfig("pip-form");
            }}
          >
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <InputNumberDot
                  positive
                  label="Sobreventa"
                  max={100}
                  name="pips"
                  step={step}
                  value={trunc(config.pips, decimals)}
                  onChange={() => {
                    driverPIP.setFromIdFormConfig("pip-form");
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputNumberDot
                  positive
                  fullWidth
                  max={100}
                  step={step}
                  label="Umbral"
                  name="umbral"
                  value={trunc(config.umbral, decimals)}
                  onChange={() => {
                    driverPIP.setFromIdFormConfig("pip-form");
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <InputNumberDot
                  positive
                  fullWidth
                  max={100}
                  label="Porcentaje de mecha (%)"
                  name="percent_wick"
                  step={step}
                  value={trunc(config.percent_wick, decimals)}
                  onChange={() => {
                    driverPIP.setFromIdFormConfig("pip-form");
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputNumberDot
                  positive
                  fullWidth
                  max={100}
                  label="Stop Loss (%)"
                  name="percent_stop_loss"
                  step={step}
                  value={trunc(config.percent_stop_loss, decimals)}
                  onChange={() => {
                    driverPIP.setFromIdFormConfig("pip-form");
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <div className="flex justify-end">
                  <TooltipGhost
                    title={driverPIP.mapCaseConfig(
                      "tooltipSaveButton",
                      !isChanged
                    )}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => driverPIP.saveConfig()}
                        loading={saving}
                        disabled={isChanged || saving}
                      >
                        {driverPIP.mapCaseSaving("textButtonSave")}
                      </Button>
                    </div>
                  </TooltipGhost>
                </div>
              </Grid>
            </Grid>
          </form>
        </WaitSkeleton>
      </Box>
    );
  }
}
