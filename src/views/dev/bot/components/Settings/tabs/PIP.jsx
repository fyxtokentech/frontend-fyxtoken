import React, { Component, useEffect } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import { WaitSkeleton, TooltipGhost } from "@jeff-aporta/camaleon";
import { driverPIP } from "./PIP.driver.js";

export class PIPView extends Component {
  componentDidMount() {
    driverPIP.addLinkConfig(this);
    driverPIP.addLinkLoading(this);
    driverPIP.addLinkSaving(this);
    driverPIP.addLinkWasChanged(this);
    driverPIP.loadConfig();
  }

  componentWillUnmount() {
    driverPIP.removeLinkConfig(this);
    driverPIP.removeLinkLoading(this);
    driverPIP.removeLinkSaving(this);
    driverPIP.removeLinkWasChanged(this);
  }

  render() {
    const config = driverPIP.getConfig();
    const saving = driverPIP.getSaving();
    const loading = driverPIP.getLoading();
    const wasChanged = driverPIP.getWasChanged();
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
              driverPIP.updateFromForm();
            }}
          >
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pips"
                  type="number"
                  name="pips"
                  value={config.pips}
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Umbral"
                  type="number"
                  name="umbral"
                  value={config.umbral}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Porcentaje de mecha (%)"
                  type="number"
                  name="percent_wick"
                  value={config.percent_wick}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stop Loss (%)"
                  type="number"
                  name="percent_stop_loss"
                  value={config.percent_stop_loss}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <div className="flex justify-end">
                  <TooltipGhost
                    title={driverPIP.mapCaseWasChanged("tooltipSaveButton")}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => driverPIP.saveConfig()}
                        loading={saving}
                        disabled={!wasChanged || saving}
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
