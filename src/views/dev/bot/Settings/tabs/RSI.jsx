import React, { useState } from "react";
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

export function RSIView() {
  // Estado agrupado para la configuración RSI
  const [config, setConfig] = useState({
    delta: { negative: 1, positive: 3 },
    period: "5 minutos",
    oversold: 30,
    overbought: 70,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleSave = () => {
    // Aquí puedes enviar config a backend si lo necesitas
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
                <option value="1 semana">1 semana</option>
                <option value="2 semanas">2 semanas</option>
                <option value="1 mes">1 mes</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobreventa (oversold)"
                type="number"
                value={config.oversold}
                onChange={(e) =>
                  handleInputChange(["oversold"], e.target.value)
                }
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sobrecompra (overbought)"
                type="number"
                value={config.overbought}
                onChange={(e) =>
                  handleInputChange(["overbought"], e.target.value)
                }
                InputProps={{ inputProps: { min: 0, max: 100 } }}
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
