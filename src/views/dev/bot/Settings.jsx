import React, { useState, useEffect, useRef } from "react";
import { PaperP } from "@containers";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Checkbox,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApiIcon from "@mui/icons-material/Api";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from '@mui/material/Fab';
import Snackbar from "@mui/material/Snackbar";
import SellIcon from "@mui/icons-material/Sell";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import TimelineIcon from "@mui/icons-material/Timeline";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const exchanges = ["Binance", "Bitget"];
const exchanges_withdrawal = ["Kraken"];

function PasswordField({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={`toggle ${label} visibility`}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default function Settings({ setView }) {
  const views = [
    { id: "apis", label: "APIs", icon: <ApiIcon /> },
    {
      id: "criptomonedas",
      label: "Criptomonedas",
      icon: <CurrencyBitcoinIcon />,
    },
    { id: "rsi", label: "RSI", icon: <ShowChartIcon /> },
    { id: "candlestick", label: "Candlestick", icon: <CandlestickChartIcon /> },
    {
      id: "automatizacion",
      label: "Automatización",
      icon: <AutoFixHighIcon />,
    },
  ];
  const { driverParams } = global;
  const initialView = driverParams.get("view-setting") || "apis";
  const [selectedViewSetting, setSelectedViewSetting] = useState(initialView);

  useEffect(() => {
    if (!views.find((v) => v.id === initialView)) {
      driverParams.set("view-setting", "apis");
      setSelectedViewSetting("apis");
    } else {
      setSelectedViewSetting(initialView);
    }
  }, []);

  const handleSelect = (id) => {
    driverParams.set("view-setting", id);
    setSelectedViewSetting(id);
  };
  const drawerWidth = 240;

  const [apiKeys, setApiKeys] = useState(() => {
    const init = prepareToInit(exchanges, false);
    Object.assign(init, prepareToInit(exchanges_withdrawal, true));
    return init;
  });

  function prepareToInit(array, withdrawal) {
    return array.reduce((acc, ex) => {
      acc[ex.toLowerCase()] = {
        apiKey: "",
        secretKey: "",
        withdrawal,
        enabled: true,
      };
      return acc;
    }, {});
  }

  const handleInputChange = (exchange, field, value) => {
    setApiKeys((prev) => ({
      ...prev,
      [exchange.toLowerCase()]: {
        ...prev[exchange.toLowerCase()],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Add logic to save settings (e.g., send to backend or local storage)
    console.log("Guardando configuraciones:", apiKeys);
    // Optionally close after saving
    // setView("main");
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<CloseIcon />}
          onClick={() => setView("main")}
        >
          Cerrar
        </Button>
      </Box>
      <Paper>
        {isMobile && (
          <AppBar position="static" color="default">
            <Tabs
              value={selectedViewSetting}
              onChange={(e, v) => handleSelect(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {views.map((view) => (
                <Tab key={view.id} label={view.label} icon={view.icon} value={view.id} />
              ))}
            </Tabs>
          </AppBar>
        )}
        <Box sx={{ display: isMobile ? "block" : "flex" }} className="fullWidth ai-stretch">
          {!isMobile && (
            <Box sx={{ width: drawerWidth, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' }}>
              <Tabs
                orientation="vertical"
                value={selectedViewSetting}
                onChange={(e, v) => handleSelect(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ height: '100%' }}
              >
                {views.map((view) => (
                  <Tab key={view.id} label={view.label} icon={view.icon} value={view.id} />
                ))}
              </Tabs>
            </Box>
          )}
          <Box component="main" sx={{ flexGrow: 1 }}>
            {selectedViewSetting === "apis" && (
              <PaperP>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5">
                    Configuración de Exchanges
                  </Typography>
                </Box>
                <br />
                <hr />
                <br />

                <APIKeyView
                  apiKeys={apiKeys}
                  handleInputChange={handleInputChange}
                  handleSave={handleSave}
                />
              </PaperP>
            )}
            {selectedViewSetting === "criptomonedas" && <CriptomonedasView />}
            {selectedViewSetting === "rsi" && <RsiView />}
            {selectedViewSetting === "candlestick" && <CandlestickView />}
            {selectedViewSetting === "automatizacion" && (
              <AutomatizacionView />
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
}

function APIKeyView({ apiKeys, handleInputChange, handleSave }) {
  return (
    <Grid container spacing={2} alignItems="center" className="fullWidth">
      <Grid item xs={12} sm={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          Activo
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Exchange
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" fontWeight="bold">
          API Key
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" fontWeight="bold">
          Secret Key
        </Typography>
      </Grid>

      {exchanges
        .filter((e) => !e.withdrawal)
        .map((exchange) => (
          <React.Fragment key={exchange}>
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={apiKeys[exchange.toLowerCase()].enabled}
                onChange={(e) =>
                  handleInputChange(exchange, "enabled", e.target.checked)
                }
              />
            </Grid>
            <APIKeyExchange
              exchange={exchange}
              apiKeys={apiKeys}
              handleInputChange={handleInputChange}
            />
          </React.Fragment>
        ))}

      <Divider sx={{ my: 2, borderColor: "divider" }} />

      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ExitToAppIcon sx={{ mr: 1 }} />
          APIs de Retiro
        </Typography>
      </Grid>

      {exchanges_withdrawal.map((exchange) => (
        <React.Fragment key={exchange}>
          <Grid item xs={12} sm={1}>
            <Checkbox
              checked={apiKeys[exchange.toLowerCase()].enabled}
              onChange={(e) =>
                handleInputChange(exchange, "enabled", e.target.checked)
              }
            />
          </Grid>
          <APIKeyExchange
            exchange={exchange}
            apiKeys={apiKeys}
            handleInputChange={handleInputChange}
          />
        </React.Fragment>
      ))}

      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Guardar Cambios
        </Button>
      </Grid>
    </Grid>
  );
}

function APIKeyExchange({ exchange, apiKeys, handleInputChange }) {
  return (
    <>
      <Grid item xs={12} sm={3} sx={{ display: "flex", alignItems: "center" }}>
        <Typography>{exchange}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <PasswordField
          label={`${exchange} API Key`}
          value={apiKeys[exchange.toLowerCase()].apiKey}
          onChange={(e) =>
            handleInputChange(exchange, "apiKey", e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <PasswordField
          label={`${exchange} Secret Key`}
          value={apiKeys[exchange.toLowerCase()].secretKey}
          onChange={(e) =>
            handleInputChange(exchange, "secretKey", e.target.value)
          }
        />
      </Grid>
    </>
  );
}

function CriptomonedasView() {
  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleTabChange = (e, newValue) => setTab(newValue);
  const handleSaveConfig = () => setSnackbarOpen(true);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Configura tus Rutas de Trading
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Define pares y rutas para tus órdenes de venta y recompra.
      </Typography>
      <AppBar position="static" color="default" sx={{ mt: 2 }}>
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
      {tab === 0 && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <SellIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Ruta de Venta</Typography>
            <Tooltip title="Define la ruta de intercambio para ventas.">
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
              endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
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
        </Box>
      )}
      {tab === 1 && (
        <Box sx={{ p: 2 }}>
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
        </Box>
      )}
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

function RsiView() {
  const [bullRange, setBullRange] = useState([-4, -1]);
  const [bearRange, setBearRange] = useState([1, 4]);
  const [buyLevel, setBuyLevel] = useState(30);
  const [sellLevel, setSellLevel] = useState(70);
  const [midRange, setMidRange] = useState([31, 69]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handleSave = () => {
    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Vista RSI
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Ajusta los umbrales de RSI para tu estrategia de trading.
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>Tendencia Alcista</Typography>
          <Tooltip title="Define el umbral mínimo/máximo para detectar señal de tendencia.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Box>
        <Slider
          value={bullRange}
          onChange={(e, v) => setBullRange(v)}
          min={-4}
          max={-1}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>Tendencia Bajista</Typography>
          <Tooltip title="Define el umbral mínimo/máximo para detectar señal de tendencia.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Box>
        <Slider
          value={bearRange}
          onChange={(e, v) => setBearRange(v)}
          min={1}
          max={4}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>Nivel de Compra</Typography>
          <Tooltip title="Por debajo de 30 indica sobreventa, por encima de 70 indica sobrecompra.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Box>
        <Slider
          value={buyLevel}
          onChange={(e, v) => setBuyLevel(v)}
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>Nivel de Venta</Typography>
          <Tooltip title="Por debajo de 30 indica sobreventa, por encima de 70 indica sobrecompra.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Box>
        <Slider
          value={sellLevel}
          onChange={(e, v) => setSellLevel(v)}
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>Rango Intermedio</Typography>
          <Tooltip title="Define el umbral mínimo/máximo para detectar señal de tendencia.">
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        </Box>
        <Slider
          value={midRange}
          onChange={(e, v) => setMidRange(v)}
          min={31}
          max={69}
          valueLabelDisplay="auto"
        />
      </Box>
      <Button
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={handleDialogOpen}
      >
        Editar Niveles RSI
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Editar Niveles RSI</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tendencia Alcista"
            fullWidth
            value={bullRange.join(",")}
          />
          <TextField
            margin="dense"
            label="Tendencia Bajista"
            fullWidth
            value={bearRange.join(",")}
          />
          <TextField
            margin="dense"
            label="Nivel de Compra"
            fullWidth
            value={buyLevel}
          />
          <TextField
            margin="dense"
            label="Nivel de Venta"
            fullWidth
            value={sellLevel}
          />
          <TextField
            margin="dense"
            label="Rango Intermedio"
            fullWidth
            value={midRange.join(",")}
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
        message="Niveles RSI actualizados exitosamente"
      />
    </Box>
  );
}

function CandlestickView() {
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

function AutomatizacionView() {
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
  const handleChangeAcc = () => setExpanded(expanded==="intermediate"?"retro":"intermediate");
  const handleSwitch = () => setAutoOp(!autoOp);
  const handleAccordion = (panel) => () => setExpanded(expanded===panel?false:panel);
  const handleSave = () => setSnack(true);

  return (
    <Box sx={{ p:2 }}>
      <FormControlLabel
        control={<Switch checked={autoOp} onChange={handleSwitch} size="small" />}
        label={`Auto-Op: ${autoOp?"Activado":"Desactivado"}`}
      />
      <Accordion expanded={expanded==="intermediate"} onChange={handleAccordion("intermediate")}>  
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Compras Intermedias ({intermediateBuy}%)</Typography>
          <Tooltip title="Define qué porcentaje de tu saldo se usará en compras parciales."><InfoOutlinedIcon fontSize="small" /></Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <Slider value={intermediateBuy} onChange={(e,v)=>setIntermediateBuy(v)} min={1} max={100} valueLabelDisplay="auto" size="small" />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded==="retro"} onChange={handleAccordion("retro")}>  
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Recompras Automáticas ({retroBuy}%)</Typography>
          <Tooltip title="Porcentaje de caída que dispara la recompra."><InfoOutlinedIcon fontSize="small" /></Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <Slider value={retroBuy} onChange={(e,v)=>setRetroBuy(v)} min={1} max={50} valueLabelDisplay="auto" size="small" />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded==="progressive"} onChange={handleAccordion("progressive")}>  
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Acumulación Progresiva ({progressivePercent}%)</Typography>
          <Tooltip title="Porcentaje de tu compra que se reinvierte automáticamente."><InfoOutlinedIcon fontSize="small" /></Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel control={<Checkbox checked={accumulate} onChange={()=>setAccumulate(!accumulate)} size="small" />} label="Acumulación Activa" />
          <FormControl size="small" sx={{ ml:2 }}><InputLabel>Divisa</InputLabel><Select value={currency} onChange={e=>setCurrency(e.target.value)} label="Divisa"><MenuItem value="USDT">USDT</MenuItem><MenuItem value="USDC">USDC</MenuItem></Select></FormControl>
          <Slider value={progressivePercent} onChange={(e,v)=>setProgressivePercent(v)} min={1} max={100} valueLabelDisplay="auto" size="small" sx={{ mt:2 }} />
        </AccordionDetails>
      </Accordion>
      <Grid container spacing={2} sx={{ mt:2 }}>
        <Grid item xs={6}><TextField fullWidth size="small" label="Meta de Venta" value={targetSale} InputProps={{ endAdornment:<InputAdornment position="end">%</InputAdornment> }} helperText="Ganancia objetivo." /></Grid>
        <Grid item xs={6}><TextField fullWidth size="small" label="Meta de Compra" value={targetBuy} InputProps={{ endAdornment:<InputAdornment position="end">USDT</InputAdornment> }} helperText="Precio de reentrada." /></Grid>
      </Grid>
      <Fab size="small" color="primary" sx={{ position:'fixed', bottom:16, right:16 }} onClick={handleSave}><SaveIcon /></Fab>
      <Snackbar open={snack} autoHideDuration={3000} onClose={()=>setSnack(false)} message="Automatización actualizada exitosamente" />
    </Box>
  );
}
