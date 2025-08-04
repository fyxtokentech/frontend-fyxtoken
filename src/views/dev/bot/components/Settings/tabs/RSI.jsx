import React, { Component } from "react";
import {
  Box,
  Typography,
  Slider,
  Tooltip,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import {
  ImageLocal,
  WaitSkeleton,
  TooltipGhost,
  InputNumberDot,
  trunc,
} from "@jeff-aporta/camaleon";
import { driverRSI } from "./RSI.driver.js";

const decimals = 2;
const step = 1 / Math.pow(10, decimals);

export class RSIView extends Component {
  componentDidMount() {
    driverRSI.addLinkConfig(this);
    driverRSI.addLinkLoading(this);
    driverRSI.addLinkSaving(this);
    driverRSI.addLinkSliderOversold(this);
    driverRSI.addLinkSliderOverbought(this);
    driverRSI.loadConfig();
  }

  componentWillUnmount() {
    driverRSI.removeLinkConfig(this);
    driverRSI.removeLinkLoading(this);
    driverRSI.removeLinkSaving(this);
    driverRSI.removeLinkSliderOversold(this);
    driverRSI.removeLinkSliderOverbought(this);
  }

  render() {
    const config = driverRSI.getConfig();
    const saving = driverRSI.getSaving();
    const loading = driverRSI.getLoading();

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
            {this.ImageRSI()}
          </Grid>
          {this.FormRSI()}
        </Grid>
      </WaitSkeleton>
    );
  }

  FormRSI() {
    const config = driverRSI.getConfig();
    const saving = driverRSI.getSaving();

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
          {this.TitleTabRSI()}
          <br />
          <form
            id="rsi-form"
            onChange={() => {
              driverRSI.setFromIdFormConfig("rsi-form");
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {this.TextFieldDeltaNegative()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.TextFieldDeltaPositive()}
              </Grid>
              <Grid item xs={12} sm={12}>
                {this.TextFieldPeriod()}
              </Grid>
              <Grid item xs={12}>
                {this.CheckboxOperateIntermediate()}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Configuración de Sobreventa y Sobrecompra
                </Typography>
                <br />
                {this.SliderOversoldOverbought()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.TextFieldOversold()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.TextFieldOverbought()}
              </Grid>
              <Grid item xs={12}>
                <div className="flex justify-end">
                  <TooltipGhost
                    title={driverRSI.mapCaseConfig(
                      "tooltipSaveButton",
                      !driverRSI.isChangedConfig()
                    )}
                  >
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => driverRSI.saveConfig()}
                        loading={saving}
                        disabled={driverRSI.isChangedConfig() || saving}
                      >
                        {driverRSI.mapCaseSaving("textButtonSave")}
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

  ImageRSI() {
    return (
      <ImageLocal
        src="img/ilustration/rsi.svg"
        alt="RSI"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    );
  }

  TitleTabRSI() {
    return (
      <TitleTab
        variant="h5"
        title="Configuración RSI"
        subtitle="Configuración del indicador de fuerza relativa"
        icon={<InfoOutlinedIcon />}
      />
    );
  }

  TextFieldDeltaNegative() {
    const config = driverRSI.getConfig();
    return (
      <InputNumberDot
        positive
        label="Delta negativo"
        max={100}
        step={step}
        name="delta.negative"
        value={trunc(config.delta.negative, decimals)}
        onChange={() => {
          driverRSI.setFromIdFormConfig("rsi-form");
        }}
      />
    );
  }

  TextFieldDeltaPositive() {
    const config = driverRSI.getConfig();
    return (
      <InputNumberDot
        positive
        label="Delta positivo"
        max={100}
        step={step}
        name="delta.positive"
        value={trunc(config.delta.positive, decimals)}
        onChange={() => {
          driverRSI.setFromIdFormConfig("rsi-form");
        }}
      />
    );
  }

  TextFieldPeriod() {
    const config = driverRSI.getConfig();
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
        <option value="1 hora">1 hora</option>
        <option value="1 día">1 día</option>
      </TextField>
    );
  }

  SliderOversoldOverbought() {
    const config = driverRSI.getConfig();
    const sliderOversold = trunc(config.oversold, decimals);
    const sliderOverbought = trunc(config.overbought, decimals);

    return (
      <Slider
        value={[sliderOversold, sliderOverbought]}
        onChange={(e, newValue) => {
          driverRSI.updateSliderValues(newValue);
        }}
        valueLabelDisplay="on"
        step={step}
        valueLabelFormat={(value, index) =>
          `${[`Sobreventa`, `Sobrecompra`][index]}: ${value}`
        }
        getAriaValueText={(val) => `${val}`}
        min={0}
        max={100}
      />
    );
  }

  TextFieldOversold() {
    const config = driverRSI.getConfig();
    return (
      <InputNumberDot
        label="Sobreventa"
        min={0}
        max={100}
        step={step}
        name="oversold"
        value={trunc(config.oversold, decimals)}
        onChange={({ newVal }) => {
          driverRSI.setSliderOversold(newVal);
        }}
      />
    );
  }

  TextFieldOverbought() {
    const config = driverRSI.getConfig();
    return (
      <InputNumberDot
        label="Sobrecompra"
        min={0}
        max={100}
        step={step}
        name="overbought"
        value={trunc(config.overbought, decimals)}
        onChange={({ newVal }) => {
          driverRSI.setSliderOverbought(newVal);
        }}
      />
    );
  }

  CheckboxOperateIntermediate() {
    const config = driverRSI.getConfig();
    return (
      <FormControlLabel
        control={
          <Checkbox
            color="l3"
            name="operate_intermediate"
            checked={config.operate_intermediate}
            onChange={(e) => {
              const newConfig = {
                ...config,
                operate_intermediate: e.target.checked,
              };
              driverRSI.assignConfig(newConfig);
            }}
          />
        }
        label="Operar en niveles intermedios"
      />
    );
  }
}
