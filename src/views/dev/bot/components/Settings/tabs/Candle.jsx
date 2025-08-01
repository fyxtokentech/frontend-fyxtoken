import React, { Component } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Slider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import {
  showInfo,
  WaitSkeleton,
  TooltipGhost,
  ImageLocal,
} from "@jeff-aporta/camaleon";
import { driverCandle } from "./Candle.driver.js";

export class CandlestickView extends Component {
  componentDidMount() {
    driverCandle.addLinkConfig(this);
    driverCandle.addLinkLoading(this);
    driverCandle.addLinkSaving(this);
    driverCandle.addLinkWasChanged(this);
    driverCandle.addLinkSliderPercentDown(this);
    driverCandle.addLinkSliderPercentUp(this);
    driverCandle.loadConfig();
  }

  componentWillUnmount() {
    driverCandle.removeLinkConfig(this);
    driverCandle.removeLinkLoading(this);
    driverCandle.removeLinkSaving(this);
    driverCandle.removeLinkWasChanged(this);
    driverCandle.removeLinkSliderPercentDown(this);
    driverCandle.removeLinkSliderPercentUp(this);
  }

  render() {
    // const config = driverCandle.getConfig(); // No utilizado actualmente
    // const saving = driverCandle.getSaving(); // No utilizado actualmente
    const loading = driverCandle.getLoading();
    // const wasChanged = driverCandle.getWasChanged(); // No utilizado actualmente

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
          <Grid item md={5} className="d-center wrap">
            {this.ImageCandle()}
          </Grid>
          {this.FormCandle()}
        </Grid>
      </WaitSkeleton>
    );
  }

  FormCandle() {
    const config = driverCandle.getConfig();
    const saving = driverCandle.getSaving();
    const wasChanged = driverCandle.getWasChanged();

    return (
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 3 },
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: { xs: 0, sm: 2 },
            width: "100%",
          }}
        >
          <TitleTab
            variant="h5"
            title="Configuración Velas"
            subtitle="Configuración de análisis de velas japonesas"
          />
          <br />

          <form
            id="candle-form"
            onChange={() => {
              driverCandle.updateFromForm();
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <this.Period config={config} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Baja (%)
                </Typography>
                <Slider
                  value={driverCandle.getSliderPercentDown()}
                  onChange={(e, value) => {
                    driverCandle.updateSliderPercentDown(value);
                  }}
                  valueLabelDisplay="on"
                  step={0.01}
                  valueLabelFormat={(value) => `${+value.toFixed(2)}%`}
                  getAriaValueText={(val) => `${+val.toFixed(2)}%`}
                  min={0}
                  max={10}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  name="percent.down"
                  value={config.percent.down}
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
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.01 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Subida (%)
                </Typography>
                <Slider
                  value={driverCandle.getSliderPercentUp()}
                  onChange={(e, value) => {
                    driverCandle.updateSliderPercentUp(value);
                  }}
                  valueLabelDisplay="on"
                  step={0.01}
                  valueLabelFormat={(value) => `${+value.toFixed(2)}%`}
                  getAriaValueText={(val) => `${+val.toFixed(2)}%`}
                  min={0}
                  max={10}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  name="percent.up"
                  value={config.percent.up}
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
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.01 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <div className="flex justify-end" style={{ marginTop: 16 }}>
                  <TooltipGhost
                    title={driverCandle.mapCaseWasChanged("tooltipSaveButton")}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => driverCandle.saveConfig()}
                        loading={saving}
                        disabled={!wasChanged || saving}
                      >
                        {driverCandle.mapCaseSaving("textButtonSave")}
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

  Period({ config }) {
    console.log(config.period);
    return (
      <TextField
        select
        label="Periodo"
        name="period"
        value={config.period}
        fullWidth
        SelectProps={{ native: true }}
      >
        <option value="5 minutos">5 minutos</option>
        <option value="10 minutos">10 minutos</option>
        <option value="15 minutos">15 minutos</option>
        <option value="30 minutos">30 minutos</option>
        <option value="1 hora">1 hora</option>
        <option value="1 día">1 día</option>
      </TextField>
    );
  }

  ImageCandle() {
    return (
      <ImageLocal
        src="img/ilustration/candlesticks.svg"
        alt="Velas japonesas"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    );
  }
}
