import {
  FormControl,
  Skeleton,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { format } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import {
  getPaletteConfig,
  fluidCSS,
  driverParams,
} from "@jeff-aporta/camaleon";
import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export * from "./controls/DateRangeControls";

export function AutoSkeleton({ loading, w = "100%", h = "5vh", ...rest }) {
  if (loading == null || loading == undefined) {
    return <></>;
  }
  return loading ? (
    <Skeleton style={{ height: h, width: `max(100px, ${w})` }} />
  ) : (
    <div {...rest} />
  );
}

export function UserFilterControl({
  value = "",
  onChange,
  loading = false,
  placeholder = "Buscar por nombre de usuario",
  label = "Usuario",
  width = 250,
}) {
  const [searchTerm, setSearchTerm] = useState(value);
  const theme = useTheme();
  const palette_config = getPaletteConfig();

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
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <AutoSkeleton h="10vh" w={`${width}px`} loading={loading}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
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
        <IconButton onClick={handleSearch} color="primary" sx={{ ml: 1 }}>
          <SearchIcon />
        </IconButton>
        {searchTerm && (
          <IconButton onClick={handleClear} size="small" sx={{ ml: 0.5 }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </AutoSkeleton>
  );
}
