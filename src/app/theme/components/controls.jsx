import fluidCSS from "@jeff-aporta/fluidcss";
import { DriverParams } from "@jeff-aporta/router";
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
import { paletteConfig } from "@jeff-aporta/theme-manager";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export { AutoSkeleton, DateRangeControls, UserFilterControl };

function AutoSkeleton({ loading, w = "100%", h = "5vh", ...rest }) {
  return loading ? (
    <Skeleton style={{ height: h, width: `max(200px, ${w})` }} />
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

function DateRangeControls({
  type = "select",
  dateRangeInit,
  dateRangeFin,
  setDateRangeInit,
  setDateRangeFin,
  loading,
  period = "day", // day, week, month
}) {
  // Inicializar driverParams
  const driverParams = DriverParams();
  const theme = useTheme();
  const [periodValue, setPeriodValue] = React.useState(period);
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [selectedMonth, setSelectedMonth] = React.useState(dayjs().month());
  const [selectedWeek, setSelectedWeek] = React.useState(
    getInitWeek(selectedMonth)
  );

  function getInitWeek(selectedMonth){
    return selectedMonth == dayjs().month() ? Math.ceil(dayjs().date() / 7) : 1
  }


  // Configurar dayjs para español
  dayjs.locale(es);

  const handlePeriodChange = (event) => {
    const value = event?.target?.value || periodValue;
    setPeriodValue(value);
    setSelectedDate(dayjs());
    setSelectedMonth(dayjs().month());
    setSelectedWeek(getInitWeek(selectedMonth));

    const now = dayjs();
    setDateRangeFin(now);

    switch (value) {
      case "day":
        setDateRangeInit(now.startOf("day"));
        break;
      case "week":
        setDateRangeInit(now.startOf("week"));
        break;
      case "month":
        setDateRangeInit(now.startOf("month"));
        break;
      default:
        break;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const start = date.startOf("day");
    const end = date.endOf("day");
    setDateRangeInit(start);
    setDateRangeFin(end);
    driverParams.set("start_date", start.format("YYYY-MM-DD"));
    driverParams.set("end_date", end.format("YYYY-MM-DD"));
  };

  const getWeekRange = (month, week) => {
    const daysInMonth = dayjs().month(month).daysInMonth();

    switch (week) {
      case 1:
        return { start: 1, end: 7 };
      case 2:
        return { start: 8, end: 14 };
      case 3:
        return { start: 15, end: 21 };
      case 4:
        return { start: 22, end: daysInMonth };
      default:
        return { start: 1, end: 7 };
    }
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
    const { start, end } = getWeekRange(selectedMonth, week);
    const date = dayjs().month(selectedMonth).date(start);

    // Verificar si el rango está en el futuro
    const today = dayjs();
    let startDate, endDate;
    if (date.isAfter(today)) {
      // Si el inicio está en el futuro, usar la fecha actual
      setDateRangeInit(today);
      setDateRangeFin(today);
      startDate = today;
      endDate = today;
    } else {
      // Si está en el pasado o presente, usar el rango normal
      setDateRangeInit(date);
      setDateRangeFin(date.date(end));
      startDate = date;
      endDate = date.date(end);
    }
    driverParams.set("start_date", startDate.format("YYYY-MM-DD"));
    driverParams.set("end_date", endDate.format("YYYY-MM-DD"));

    // Actualizar el estado inicial al intervalo actual
    const currentWeek = Math.ceil(today.date() / 7);
    setSelectedWeek(currentWeek);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setSelectedWeek(getInitWeek(month));
    const date = dayjs().month(month);
    const start = date.startOf("month");
    const end = date.endOf("month");
    setDateRangeInit(start);
    setDateRangeFin(end);
    driverParams.set("start_date", start.format("YYYY-MM-DD"));
    driverParams.set("end_date", end.format("YYYY-MM-DD"));
  };

  console.log("aaaaa")

  React.useEffect(() => {
    if (type !== "none") {
      const now = dayjs();
      setDateRangeFin(now);
      setDateRangeInit(now.startOf("day"));
    }
  }, [type, setDateRangeFin, setDateRangeInit]);

  // Ejecutar handlePeriodChange al montar el componente
  React.useEffect(() => {
    handlePeriodChange();
  }, []);

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
            MenuProps={{
              disableScrollLock: true, // Evita que se bloquee el scroll
            }}
          >
            <MenuItem value="day">1 día</MenuItem>
            <MenuItem value="week">1 semana</MenuItem>
            <MenuItem value="month">1 mes</MenuItem>
          </Select>
        </FormControl>
      </AutoSkeleton>

      {periodValue === "day" && (
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Seleccionar día"
                value={selectedDate}
                onChange={handleDateChange}
                views={["year", "month", "day"]}
                slotProps={{ textField: { size: "small" } }}
                maxDate={periodValue === "day" ? dayjs() : undefined}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
      )}

      {periodValue === "week" && (
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                label="Mes"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = dayjs().subtract(i, "month");
                  return (
                    <MenuItem key={date.format("YYYY-MM")} value={date.month()}>
                      {format(new Date(date), "MMMM yyyy", {
                        locale: esLocale,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </AutoSkeleton>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="week-select-label">Semana</InputLabel>
              <Select
                labelId="week-select-label"
                id="week-select"
                value={selectedWeek}
                onChange={(e) => handleWeekChange(Number(e.target.value))}
                label="Semana"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 4 }, (_, i) => {
                  const { start, end } = getWeekRange(selectedMonth, i + 1);
                  const date = dayjs().month(selectedMonth).date(start);

                  // Solo mostrar intervalos que no estén en el futuro
                  if (date.isAfter(dayjs())) {
                    return null;
                  }

                  return (
                    <MenuItem key={i + 1} value={i + 1}>
                      {start === end
                        ? `del ${start}`
                        : `del ${start} al ${end}`}
                    </MenuItem>
                  );
                }).filter(Boolean)}
              </Select>
            </FormControl>
          </AutoSkeleton>
        </div>
      )}

      {periodValue === "month" && (
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                label="Mes"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = dayjs().subtract(i, "month");
                  return (
                    <MenuItem key={date.format("YYYY-MM")} value={date.month()}>
                      {format(new Date(date), "MMMM yyyy", {
                        locale: esLocale,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </AutoSkeleton>
        </div>
      )}
    </div>
  );
}
