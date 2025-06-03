import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Divider,
  Button,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  InputAdornment,
  Fab,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";

export function AutomatizacionView() {
  const [autoOp, setAutoOp] = useState(true);
  const [intermediateBuy, setIntermediateBuy] = useState(5);
  const [retroBuy, setRetroBuy] = useState(3);
  const [accumulate, setAccumulate] = useState(true);
  const [currency, setCurrency] = useState("USDT");
  const [progressivePercent, setProgressivePercent] = useState(10);
  const [targetSale, setTargetSale] = useState("10%");
  const [targetBuy, setTargetBuy] = useState("40000");
  const [expanded, setExpanded] = useState("intermediate");
  const [snack, setSnack] = useState(false);
  const handleChangeAcc = () =>
    setExpanded(expanded === "intermediate" ? "retro" : "intermediate");
  const handleSwitch = () => setAutoOp(!autoOp);
  const handleAccordion = (panel) => () =>
    setExpanded(expanded === panel ? false : panel);
  const handleSave = () => setSnack(true);

  return (
    <Box sx={{ p: 2 }}>
      <TitleTab title="Configuración de Automatización" />
      <FormControlLabel
        control={
          <Switch checked={autoOp} onChange={handleSwitch} size="small" />
        }
        label={`Auto-Op: ${autoOp ? "Activado" : "Desactivado"}`}
      />
      <Accordion
        expanded={expanded === "intermediate"}
        onChange={handleAccordion("intermediate")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Compras Intermedias ({intermediateBuy}%)</Typography>
          <Tooltip title="Define qué porcentaje de tu saldo se usará en compras parciales.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={intermediateBuy}
            onChange={(e, v) => setIntermediateBuy(v)}
            min={1}
            max={100}
            valueLabelDisplay="auto"
            size="small"
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "retro"}
        onChange={handleAccordion("retro")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Recompras Automáticas ({retroBuy}%)</Typography>
          <Tooltip title="Porcentaje de caída que dispara la recompra.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={retroBuy}
            onChange={(e, v) => setRetroBuy(v)}
            min={1}
            max={50}
            valueLabelDisplay="auto"
            size="small"
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "progressive"}
        onChange={handleAccordion("progressive")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            Acumulación Progresiva ({progressivePercent}%)
          </Typography>
          <Tooltip title="Porcentaje de tu compra que se reinvierte automáticamente.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={accumulate}
                onChange={() => setAccumulate(!accumulate)}
                size="small"
              />
            }
            label="Acumulación Activa"
          />
          <FormControl size="small" sx={{ ml: 2 }}>
            <InputLabel>Divisa</InputLabel>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              label="Divisa"
            >
              <MenuItem value="USDT">USDT</MenuItem>
              <MenuItem value="USDC">USDC</MenuItem>
            </Select>
          </FormControl>
          <Slider
            value={progressivePercent}
            onChange={(e, v) => setProgressivePercent(v)}
            min={1}
            max={100}
            valueLabelDisplay="auto"
            size="small"
            sx={{ mt: 2 }}
          />
        </AccordionDetails>
      </Accordion>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label="Meta de Venta"
            value={targetSale}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText="Ganancia objetivo."
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label="Meta de Compra"
            value={targetBuy}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">USDT</InputAdornment>
              ),
            }}
            helperText="Precio de reentrada."
          />
        </Grid>
      </Grid>
      <Fab
        size="small"
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleSave}
      >
        <SaveIcon />
      </Fab>
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        message="Automatización actualizada exitosamente"
      />
    </Box>
  );
}
