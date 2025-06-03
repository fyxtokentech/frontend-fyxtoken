import React, { useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  Slider,
  Paper,
} from "@mui/material";
import SellIcon from "@mui/icons-material/Sell";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { TitleTab } from "./_repetitive";
import { PaperP } from "@containers";

export function CriptomonedasView() {
  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleTabChange = (e, newValue) => setTab(newValue);
  const handleSaveConfig = () => setSnackbarOpen(true);

  return (
    <Box sx={{ p: 2 }}>
      <TitleTab
        title="Configura tus Rutas de Trading"
        subtitle="Define pares y rutas para tus órdenes de venta y recompra."
      />

      <AppBar elevation={8} position="static" color="default" sx={{ mt: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Ruta Venta" />
          <Tab label="Ruta Recompra" />
        </Tabs>
      </AppBar>
      <PaperP elevation={8}>
        {tab === 0 && (
          <>
            <br />
            <Box>
              <TitleTab
                title={
                  <>
                    <SellIcon sx={{ mr: 1 }} /> Ruta de venta
                  </>
                }
                subtitle="Define la ruta de intercambio para ventas."
                variant="h6"
              />
            </Box>
            <br />
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, mb: 2 }}
              size="small"
            >
              <InputLabel>Par de Venta</InputLabel>
              <Select defaultValue="BTC/USDT" label="Par de Venta">
                <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                <MenuItem value="LTC/USDT">LTC/USDT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="number"
              label="Precio objetivo (USDT)"
              defaultValue={45000}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">USDT</InputAdornment>
                ),
              }}
              helperText="Ingresa el precio al que deseas vender."
              sx={{ mb: 2, ml: 2 }}
            />
            <TextField
              size="small"
              type="number"
              label="Cantidad de BTC"
              defaultValue={0.01}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">BTC</InputAdornment>
                ),
              }}
              helperText="Cantidad mínima: 0.0001 BTC."
              sx={{ mb: 2, ml: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Ruta: BTC → USDT
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Agregar Ruta de Venta
            </Button>
          </>
        )}
        {tab === 1 && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <SwapHorizIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Ruta de Recompra</Typography>
              <Tooltip title="Define la ruta de intercambio para recompra.">
                <IconButton>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, mb: 2 }}
              size="small"
            >
              <InputLabel>Par de Recompra</InputLabel>
              <Select defaultValue="ETH/USDT" label="Par de Recompra">
                <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                <MenuItem value="LTC/USDT">LTC/USDT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="number"
              label="Precio de recompra (USDT)"
              defaultValue={42000}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">USDT</InputAdornment>
                ),
              }}
              helperText="Precio por debajo del cual re-compra."
              sx={{ mb: 2, ml: 2 }}
            />
            <Box sx={{ width: 300, mb: 2 }}>
              <Typography gutterBottom>Porcentaje de balance (%)</Typography>
              <Slider
                defaultValue={25}
                min={1}
                max={100}
                valueLabelDisplay="auto"
                marks={[{ value: 25, label: "25%" }]}
              />
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Ruta: USDT → BTC al 25%
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
            >
              Agregar Ruta de Recompra
            </Button>
          </>
        )}
      </PaperP>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Par</TableCell>
              <TableCell>Precio Límite</TableCell>
              <TableCell>Cantidad/Porcentaje</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Venta</TableCell>
              <TableCell>BTC/USDT</TableCell>
              <TableCell>45,000 USDT</TableCell>
              <TableCell>0.01 BTC</TableCell>
              <TableCell>
                <IconButton>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Recompra</TableCell>
              <TableCell>ETH/USDT</TableCell>
              <TableCell>3,000 USDT</TableCell>
              <TableCell>25%</TableCell>
              <TableCell>
                <IconButton>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        size="small"
        color="primary"
        aria-label="save"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleSaveConfig}
      >
        <SaveIcon />
      </Fab>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Rutas guardadas exitosamente"
      />
    </Box>
  );
}
