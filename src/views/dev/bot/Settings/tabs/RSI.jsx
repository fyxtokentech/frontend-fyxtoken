import React, { useState, useEffect } from "react";
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
  Snackbar,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { TitleTab } from "./_repetitive";
import { ImageLocal } from "@recurrent";
import {
  HTTPGET_USEROPERATION_STRATEGY,
  HTTPPATCH_USEROPERATION_STRATEGY,
} from "@api";
import { showInfo } from "@templates";

export function RSIView() {
  // Estado agrupado para la configuración RSI
  const [config, setConfig] = useState({
    delta: { negative: 1, positive: 3 },
    period: "5 minutos",
    oversold: 30,
    overbought: 70,
  });

  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Utilidades para conversión periodo texto <-> objeto
  const periodTextToObj = (txt) => {
    // "5 minutos" → {unit: 'm', value: 5}
    if (!txt) {
      return { unit: "m", value: 5 };
    }
    if (txt.includes("minuto")) {
      return { unit: "m", value: parseInt(txt) };
    }
    if (txt.includes("hora")) {
      return { unit: "h", value: parseInt(txt) };
    }
    if (txt.includes("día")) {
      return { unit: "d", value: parseInt(txt) };
    }
    if (txt.includes("semana")) {
      return { unit: "s", value: parseInt(txt) };
    }
    if (txt.includes("mes")) {
      return { unit: "M", value: parseInt(txt) };
    }
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

  // Cargar configuración inicial
  useEffect(() => {
    const user_id = window.currentUser?.user_id;
    const id_coin = window.driverParams?.get("id_coin");
    if (!user_id || !id_coin) return;
    HTTPGET_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "rsi",
      setApiData: ([data]) => {
        // data.config debe ser el modelo backend: {delta, period, oversold, overbought}
        let loaded = data;
        setConfig({
          delta: loaded.delta || { negative: -1, positive: -1 },
          period: periodObjToText(loaded.period || { unit: "m", value: 5 }),
          oversold: loaded.oversold ?? -1,
          overbought: loaded.overbought ?? -1,
        });
      },
    });
  }, []);

  // Permite actualizar cualquier campo anidado o simple
  const handleInputChange = (path, value) => {
    if (Array.isArray(path) && path.length === 1 && path[0] === "period") {
      setConfig((prev) => ({ ...prev, period: value }));
      return;
    }
    setConfig((prev) => {
      const newConfig = { ...prev };
      let obj = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] = { ...obj[path[i]] };
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = isNaN(Number(value)) ? value : Number(value);
      return newConfig;
    });
  };

  const handleSave = async () => {
    const user_id = window.currentUser?.user_id;
    const id_coin = window.driverParams?.get("id_coin");
    if (!user_id || !id_coin) return;
    setSaving(true);
    // Prepara config para backend (period como objeto)
    const backendConfig = {
      ...config,
      period: periodTextToObj(config.period),
    };
    const result = await HTTPPATCH_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "rsi",
      new_config: JSON.stringify(backendConfig),
    });
    setSaving(false);
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  return (
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
        <ImageLocal
          src={"img/ilustration/rsi.svg"}
          alt="Ilustración RSI"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </Grid>
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
            title="Configuración RSI"
            subtitle="Ajusta los parámetros para tu estrategia de RSI."
            variant="h6"
          />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Delta negativo (-)"
                type="number"
                value={config.delta.negative}
                onChange={(e) =>
                  handleInputChange(["delta", "negative"], e.target.value)
                }
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Delta positivo (+)"
                type="number"
                value={config.delta.positive}
                onChange={(e) =>
                  handleInputChange(["delta", "positive"], e.target.value)
                }
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                select
                label="Periodo"
                value={config.period}
                onChange={(e) => handleInputChange(["period"], e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="5 minutos">5 minutos</option>
                <option value="10 minutos">10 minutos</option>
                <option value="15 minutos">15 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="1 día">1 día</option>
              </TextField>
            </Grid>
            {/* Slider gráfico para Sobreventa/Sobrecompra */}
            <Grid item xs={12}>
              <Box sx={{ width: "100%", px: 2 }}>
                <br />
                <br />
                <Slider
                  getAriaLabel={() => "Sobreventa y Sobrecompra"}
                  value={[config.oversold, config.overbought]}
                  onChange={(e, newValue) => {
                    handleInputChange(["oversold"], newValue[0]);
                    handleInputChange(["overbought"], newValue[1]);
                  }}
                  valueLabelDisplay="on"
                  step={0.01}
                  valueLabelFormat={(value, index) =>
                    index === 0
                      ? `Sobreventa: ${+value.toFixed(2)}`
                      : `Sobrecompra: ${+value.toFixed(2)}`
                  }
                  getAriaValueText={(val) => `${+val.toFixed(2)}`}
                  min={0}
                  max={100}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobreventa (oversold)"
                type="number"
                value={config.oversold}
                onChange={(e) =>
                  handleInputChange(["oversold"], e.target.value)
                }
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobrecompra (overbought)"
                type="number"
                value={config.overbought}
                onChange={(e) => {
                  handleInputChange(["overbought"], e.target.value);
                }}
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
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<TuneIcon />}
                onClick={handleSave}
                sx={{ mt: { xs: 1, sm: 2 }, py: 1.2, fontWeight: 600 }}
                fullWidth
              >
                Guardar configuración
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message="Configuración RSI actualizada exitosamente"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
