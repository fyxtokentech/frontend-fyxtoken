import fluidCSS from "@jeff-aporta/fluidcss";
import { FormControl, Skeleton, useTheme, Select, MenuItem, InputLabel, TextField, Box, IconButton } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {paletteConfig} from "@jeff-aporta/theme-manager";
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export { AutoSkeleton, DateRangeControls, UserFilterControl };

function AutoSkeleton({ loading, w = "100%", h = "5vh", ...rest }) {
  return loading ? (
    <Skeleton style={{ height: h, width: `max(300px, ${w})` }} />
  ) : (
    <div {...rest} />
  );
}

function UserFilterControl({
  value = "",
  onChange,
  loading = false,
  placeholder = "Buscar por nombre de usuario",
  label = "Usuario",
  width = 250,
}) {
  const [searchTerm, setSearchTerm] = React.useState(value);
  const theme = useTheme();
  const palette_config = paletteConfig();
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
  };
  
  const handleSearch = () => {
    if (onChange) {
      onChange(searchTerm);
    }
  };
  
  const handleClear = () => {
    setSearchTerm("");
    if (onChange) {
      onChange("");
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <AutoSkeleton h="10vh" w={`${width}px`} loading={loading}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label={label}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          sx={{
            width: width,
          }}
        />
        <IconButton 
          onClick={handleSearch} 
          color="primary" 
          sx={{ ml: 1 }}
        >
          <SearchIcon />
        </IconButton>
        {searchTerm && (
          <IconButton 
            onClick={handleClear} 
            size="small" 
            sx={{ ml: 0.5 }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </AutoSkeleton>
  );
}

function DateRangeControls({
  type = "select",
  dateRangeInit,
  dateRangeFin,
  setDateRangeInit,
  setDateRangeFin,
  loading,
}) {
  const theme = useTheme();
  const [periodValue, setPeriodValue] = React.useState("day");
  
  const handlePeriodChange = (event) => {
    const value = event.target.value;
    setPeriodValue(value);
    const now = dayjs();
    
    switch (value) {
      case "day":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'day'));
        break;
      case "week":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'week'));
        break;
      case "month":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'month'));
        break;
      case "year":
        setDateRangeFin(now);
        setDateRangeInit(now.subtract(1, 'year'));
        break;
      default:
        break;
    }
  };
  
  // Establecer el valor por defecto de "1 día" al montar el componente
  React.useEffect(() => {
    if (type !== "none") {
      const now = dayjs();
      setDateRangeFin(now);
      setDateRangeInit(now.subtract(1, 'day'));
    }
  }, [type, setDateRangeFin, setDateRangeInit]);
  
  // Si el tipo es "none", no mostrar ningún control
  if (type === "none") {
    return null;
  }
  
  // Si el tipo es "custom", mostrar los selectores de fecha personalizados
  if (type === "custom") {
    return (
      <div className="d-flex ai-stretch flex-wrap gap-20px">
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha inicio"
                defaultValue={dateRangeInit}
                onChange={(date) => setDateRangeInit(date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha Fin"
                defaultValue={dateRangeFin}
                onChange={(date) => setDateRangeFin(date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
      </div>
    );
  }
  
  // Implementación con Select (opción por defecto)
  const palette_config = paletteConfig();
  return (
    <div className="d-flex ai-stretch flex-wrap gap-20px">
      <AutoSkeleton h="10vh" w="200px" loading={loading}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="period-select-label">Período</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={periodValue}
            onChange={handlePeriodChange}
            label="Período"
          >
            <MenuItem value="day">1 día</MenuItem>
            <MenuItem value="week">1 semana</MenuItem>
            <MenuItem value="month">1 mes</MenuItem>
            <MenuItem value="year">1 año</MenuItem>
          </Select>
        </FormControl>
      </AutoSkeleton>
    </div>
  );
}
