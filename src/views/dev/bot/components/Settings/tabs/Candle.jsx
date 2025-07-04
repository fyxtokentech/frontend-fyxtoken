import React, { useState, useEffect } from "react";

import {
  Button,
  Tooltip,
  Fab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Slider,
  CircularProgress,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TimelineIcon from "@mui/icons-material/Timeline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { TitleTab } from "./_repetitive";
import { ImageLocal } from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_STRATEGY,
  HTTPPATCH_USEROPERATION_STRATEGY,
} from "@api";
import {
  showSuccess,
  showError,
  showInfo,
  driverParams,
} from "@jeff-aporta/camaleon";

export function CandlestickView() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  // Utilidades conversión periodo texto <-> objeto
  const periodTextToObj = (txt) => {
    if (!txt) return { unit: "m", value: 5 };
    if (txt.includes("minuto")) return { unit: "m", value: parseInt(txt) };
    if (txt.includes("hora")) return { unit: "h", value: parseInt(txt) };
    if (txt.includes("día")) return { unit: "d", value: parseInt(txt) };
    if (txt.includes("semana")) return { unit: "s", value: parseInt(txt) };
    if (txt.includes("mes")) return { unit: "M", value: parseInt(txt) };
    return { unit: "m", value: 5 };
  };
  const periodObjToText = ({ unit, value }) => {
    if (!unit || !value) return "5 minutos";
    switch (unit) {
      case "m":
        return `${value} minutos`;
      case "h":
        return `${value} hora${value > 1 ? "s" : ""}`;
      case "d":
        return `${value} día${value > 1 ? "s" : ""}`;
      case "s":
        return `${value} semana${value > 1 ? "s" : ""}`;
      case "M":
        return `${value} mes${value > 1 ? "es" : ""}`;
      default:
        return "5 minutos";
    }
  };

  // Carga config candle al montar
  useEffect(() => {
    (async () => {
      const { user_id } = window.currentUser;
      const id_coin = driverParams.get("id_coin")[0];
      if (!user_id || !id_coin) {
        return;
      }
      await HTTPGET_USEROPERATION_STRATEGY({
        user_id,
        id_coin,
        strategy: "candle",
        failure: () => showError("Error al cargar configuración de velas"),
        successful: ([data]) => {
          const loaded = data;
          setTimeout(() => {
            setConfig(data);
          });
        },
      });
    })();
  }, []);

  if (!config) {
    return (
      <div className="d-center gap-10px">
        <CircularProgress /> fetching...
      </div>
    );
  }

  const handlePeriodChange = (e) =>
    setConfig((prev) => ({ ...prev, period: periodTextToObj(e.target.value) }));
  const handlePercentDownChange = (e, val) =>
    setConfig((prev) => ({
      ...prev,
      percent: { down: val, up: prev.percent.up },
    }));
  const handlePercentUpChange = (e, val) =>
    setConfig((prev) => ({
      ...prev,
      percent: { down: prev.percent.down, up: val },
    }));
  const handlePercentDownInput = (e) =>
    setConfig((prev) => ({
      ...prev,
      percent: { down: Number(e.target.value), up: prev.percent.up },
    }));
  const handlePercentUpInput = (e) =>
    setConfig((prev) => ({
      ...prev,
      percent: { down: prev.percent.down, up: Number(e.target.value) },
    }));

  const handleSave = async () => {
    const { user_id } = window.currentUser;
    const id_coin = driverParams.get("id_coin")[0];
    if (!user_id || !id_coin) {
      return;
    }
    setSaving(true);
    await HTTPPATCH_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "candle",
      new_config: JSON.stringify(config),
      successful: () => showSuccess("Configuración de velas guardada"),
      failure: () => showError("Error al guardar configuración de velas"),
    });
    setSaving(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={5} className="d-center wrap">
          <ImageLocal
            src={"img/ilustration/candlesticks.svg"}
            alt="Ilustración Candle"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 2, borderRadius: 3, boxShadow: 2, width: "100%" }}>
            <TitleTab
              title="Configuración de Velas"
              subtitle="Define periodo y porcentaje para velas."
              variant="h6"
            />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  select
                  label="Periodo"
                  value={periodObjToText(config.period)}
                  onChange={handlePeriodChange}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                  Baja (%)
                </Typography>
                <br />
                <Slider
                  value={config.percent.down}
                  onChange={handlePercentDownChange}
                  valueLabelDisplay="on"
                  step={0.01}
                  valueLabelFormat={(value) => `${+value.toFixed(2)}%`}
                  getAriaValueText={(val) => `${+val.toFixed(2)}%`}
                  min={0}
                  max={10}
                />
                <TextField
                  type="number"
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
                  onChange={handlePercentDownInput}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.01 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <br />
                <Typography variant="subtitle1" gutterBottom>
                  Subida (%)
                </Typography>
                <br />
                <Slider
                  value={config.percent.up}
                  onChange={handlePercentUpChange}
                  valueLabelDisplay="on"
                  step={0.01}
                  valueLabelFormat={(value) => `${+value.toFixed(2)}%`}
                  getAriaValueText={(val) => `${+val.toFixed(2)}%`}
                  min={0}
                  max={10}
                />
                <TextField
                  type="number"
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
                  onChange={handlePercentUpInput}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.01 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
