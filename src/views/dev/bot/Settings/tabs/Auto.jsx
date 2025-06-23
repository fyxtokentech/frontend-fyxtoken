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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  InputAdornment,
  Fab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import { TitleTab } from "./_repetitive";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { showSuccess, showError } from "@jeff-aporta/camaleon";

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
  const handleChangeAcc = () =>
    setExpanded(expanded === "intermediate" ? "retro" : "intermediate");
  const handleSwitch = () => setAutoOp(!autoOp);
  const handleAccordion = (panel) => () =>
    setExpanded(expanded === panel ? false : panel);
  const handleSave = () =>
    showSuccess("🚧 Automatización actualizada exitosamente");

  return (
    <Box sx={{ p: 2 }}>
      <TitleTab
        variant="h5"
        title={
          <>
            Configuración de Automatización <AutoFixHighIcon />
          </>
        }
      />
      <br />
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
    </Box>
  );
}
