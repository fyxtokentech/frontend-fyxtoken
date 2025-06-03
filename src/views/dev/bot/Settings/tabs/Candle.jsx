import React, { useState, useRef } from "react";

import {
  Button,
  Snackbar,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TimelineIcon from "@mui/icons-material/Timeline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";

export function CandlestickView() {
  const [interval, setInterval] = useState("15m");
  const [patternEnabled, setPatternEnabled] = useState(true);
  const [pattern, setPattern] = useState("hammer");
  const [action, setAction] = useState("Comprar");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const canvasRef = useRef(null);
  const levels = [
    { type: "Soporte Alto", price: "44500" },
    { type: "Soporte Bajo", price: "43800" },
    { type: "Resistencia Bajo", price: "46200" },
    { type: "Resistencia Alto", price: "47000" },
  ];
  const handleInterval = (e, v) => setInterval(v);
  const handlePatternToggle = (e) => setPatternEnabled(e.target.checked);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handleSave = () => {
    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Configuración de Velas</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Define intervalos, patrones y niveles de soporte/resistencia.
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ mr: 1 }}>Intervalo de Vela</Typography>
          <Tooltip title="Intervalo de tiempo para cada vela.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Box>
        <ToggleButtonGroup
          exclusive
          value={interval}
          onChange={handleInterval}
          size="small"
        >
          {["5m", "10m", "15m", "30m", "1h"].map((val) => (
            <ToggleButton key={val} value={val}>
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={patternEnabled}
              onChange={handlePatternToggle}
              size="small"
            />
          }
          label="Programar Patrón"
        />
        {patternEnabled && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Select
              size="small"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            >
              {["hammer", "engulfing", "doji", "shooting_star"].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              label="Acción al detectar"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ mb: 2 }}>
        <TableContainer component={Paper} size="small">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Precio (USDT)</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levels.map((lvl, i) => (
                <TableRow key={i}>
                  <TableCell>{lvl.type}</TableCell>
                  <TableCell>{lvl.price}</TableCell>
                  <TableCell>
                    <IconButton>
                      <TimelineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Button variant="outlined" onClick={handleDialogOpen}>
        Editar Niveles de Vela
      </Button>
      <Fab
        size="small"
        color="primary"
        sx={{ ml: 1 }}
        onClick={() => setSnackbarOpen(true)}
      >
        <SaveIcon />
      </Fab>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md">
        <DialogTitle>Editar Soporte/Resistencia</DialogTitle>
        <DialogContent>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            style={{ border: "1px solid #ccc" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Configuración de velas guardada"
      />
    </Box>
  );
}
