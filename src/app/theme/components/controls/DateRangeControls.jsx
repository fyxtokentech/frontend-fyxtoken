import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { format } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import {
  getPaletteConfig,
  fluidCSS,
  driverParams,
  getContrastPaperBow,
} from "@jeff-aporta/camaleon";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AutoSkeleton } from "../controls.jsx";

let START_DATE, END_DATE, PERIOD, MONTH, WEEK;

let nWeeks;

export function DateRangeControls({
  type = "select",
  loading,
  period = "most_recent", // day, week, month
  willPeriodChange = (period) => {},
}) {
  // Inicializar parámetros de URL como driverParams
  let _period_;
  [
    START_DATE, // fecha inicio
    END_DATE, // fecha fin
    _period_, // periodo
    WEEK, // semana
    MONTH, // mes
    WEEK, // semana
  ] = driverParams.get(
    "start_date",
    "end_date",
    "period",
    "week",
    "month",
    "week"
  );
  PERIOD = _period_ || period;
  if (START_DATE) {
    const initDate = dayjs(START_DATE);
    MONTH = initDate.month();
    MONTH ??= Math.floor(initDate.date() / 7);
    WEEK ??= Math.floor(initDate.date() / 7);
  } else {
    MONTH ??= dayjs().month();
    WEEK ??= getInitWeek(dayjs().month());
  }

  // Migrar estados a useState para que los selectores sean reactivos
  const [periodValue, setPeriodValue] = useState(PERIOD);
  const [selectedDate, setSelectedDate] = useState(dayjs(START_DATE));
  const [selectedMonth, setSelectedMonth] = useState(+MONTH);
  const [selectedWeek, setSelectedWeek] = useState(+WEEK);

  // Configurar dayjs para español
  dayjs.locale(es);

  // Sincronizar parámetros de URL tras cambios en estado
  useEffect(() => {
    driverParams.set({
      month: selectedMonth,
      week: selectedWeek,
      period: periodValue,
    });
  }, [selectedMonth, selectedWeek, periodValue]);

  const handlePeriodChange = (event) => {
    const value = event?.target?.value || periodValue;
    PERIOD = value;
    driverParams.set("period", value);
    willPeriodChange(value);
    setPeriodValue(value);
    if (value == "most_recent") {
      return;
    }
    const day_value = dayjs(START_DATE);
    const month = day_value.month();
    console.log(month);
    const year = day_value.year();
    setSelectedDate(day_value);
    setSelectedMonth(month);
    let init, fin;
    switch (value) {
      case "day":
        init = day_value.format("YYYY-MM-DD");
        fin = init;
        break;
      case "week":
        const [iw] = (driverParams.get("week") || [getInitWeek(month)]).map(
          (x) => +x
        );
        setSelectedWeek(iw);
        const { start, end } = getWeekRange(iw);
        init = getYYYYMMDD(year, month, start);
        fin = getYYYYMMDD(year, month, end);
        driverParams.set("week", iw);
        break;
      case "month":
        init = getYYYYMMDD(year, month, 1);
        fin = getYYYYMMDD(year, month, daysInMonth());
        driverParams.set("month", month);
        break;
    }
    driverParams.set({
      period: value,
      start_date: init,
      end_date: fin,
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const d = dayjs(date).format("YYYY-MM-DD");
    driverParams.set({
      start_date: d,
      end_date: d,
    });
  };

  // Sync dateRange when date param changes
  useEffect(() => {
    if (periodValue === "day") {
      const d = dayjs(selectedDate).format("YYYY-MM-DD");
      driverParams.set({
        start_date: d,
        end_date: d,
      });
    }
  }, [selectedDate, periodValue]);

  function getYYYYMMDD(year, month, start) {
    return dayjs(year + "-" + (month + 1) + "-" + start).format("YYYY-MM-DD");
  }

  function daysInMonth() {
    return dayjs().month(selectedMonth).daysInMonth();
  }

  function getWeekRange(week) {
    const month = selectedMonth;
    nWeeks = [
      { start: 1, end: 7 },
      { start: 8, end: 14 },
      { start: 15, end: 21 },
      { start: 22, end: daysInMonth() },
    ];
    return nWeeks[week - 1];
  }

  const handleWeekChange = (week) => {
    if (PERIOD != "week") {
      return;
    }
    setSelectedWeek(week);
    const { start, end } = getWeekRange(week);
    const date = dayjs().month(selectedMonth).date(start);

    // Verificar si el rango está en el futuro
    const today = dayjs();
    let startDate, endDate;
    if (date.isAfter(today)) {
      // Si el inicio está en el futuro, usar la fecha actual
      startDate = today;
      endDate = today;
    } else {
      // Si está en el pasado o presente, usar el rango normal
      startDate = date;
      endDate = date.date(end);
    }
    driverParams.set({
      week: week,
      month: selectedMonth,
      start_date: startDate.format("YYYY-MM-DD"),
      end_date: endDate.format("YYYY-MM-DD"),
    });
  };

  const handleMonthChange = (month) => {
    const iw2 = getInitWeek(month);
    setSelectedMonth(month);
    if (PERIOD != "month") {
      if (PERIOD === "week") {
        handleWeekChange(iw2);
      }
      return;
    }
    setSelectedWeek(iw2);
    const date = dayjs().month(month);
    const start = date.startOf("month");
    const end = date.endOf("month");
    driverParams.set({
      month: month,
      week: iw2,
      start_date: start.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
    });
  };
  // Ejecutar handlePeriodChange al montar el componente
  useEffect(() => {
    // Solo inicializa si las fechas no están definidas
    if (driverParams.get("start_date", "end_date").some((x) => !x)) {
      const now = dayjs();
      driverParams.set({
        start_date: now.format("YYYY-MM-DD"),
        end_date: now.format("YYYY-MM-DD"),
      });
      handlePeriodChange();
    }
  }, []);

  // Si el tipo es "none", no mostrar ningún control
  if (type === "none") {
    return null;
  }

  // Si el tipo es "custom", mostrar los selectores de fecha personalizados
  if (type === "custom") {
    return (
      <div className="flex align-stretch flex-wrap gap-20px">
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha inicio"
                value={driverParams.get("start_date")[0]}
                onChange={(date) => driverParams.set("start_date", date)}
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
                value={driverParams.get("end_date")[0]}
                onChange={(date) => driverParams.set("end_date", date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
      </div>
    );
  }

  // Implementación con Select (opción por defecto)
  const palette_config = getPaletteConfig();
  return (
    <div className="flex align-stretch flex-wrap gap-20px">
      <AutoSkeleton h="10vh" w="150px" loading={loading}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
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
            <MenuItem value="most_recent">Más recientes</MenuItem>
            <MenuItem value="day">1 día</MenuItem>
            <MenuItem value="week">1 semana</MenuItem>
            <MenuItem value="month">1 mes</MenuItem>
          </Select>
        </FormControl>
      </AutoSkeleton>

      {periodValue === "day" && (
        <AutoSkeleton h="10vh" w="200px" loading={loading}>
          <div style={{ width: "200px", display: "inline-block" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Seleccionar día"
                value={selectedDate}
                onChange={handleDateChange}
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                  },
                  actionBar: {
                    actions: ["accept"],
                    sx: {
                      "& .MuiButton-root": {
                        color: (theme) => getContrastPaperBow().hex(),
                      },
                    },
                  },
                }}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </div>
        </AutoSkeleton>
      )}

      {periodValue === "week" && (
        <div
          className={`flex align-center flex-wrap gap-10px ${fluidCSS()
            .ltX(700, { width: "100%" })
            .end()}`}
        >
          <AutoSkeleton h="10vh" w="150px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(+e.target.value)}
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
          <AutoSkeleton h="10vh" w="150px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="week-select-label">Semana</InputLabel>
              <Select
                labelId="week-select-label"
                id="week-select"
                value={selectedWeek}
                onChange={(e) => handleWeekChange(+e.target.value)}
                label="Semana"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 4 }, (_, i) => {
                  const { start, end } = getWeekRange(i + 1);
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
                onChange={(e) => handleMonthChange(+e.target.value)}
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

function getInitWeek(selectedMonth) {
  const mes = dayjs().month();
  let setdayjs = dayjs([null, START_DATE][+!!START_DATE]);
  if (selectedMonth == mes) {
    if (setdayjs.month() != mes) {
      setdayjs = dayjs();
    }
    return calcsetdayjs();
  }
  if (START_DATE) {
    return calcsetdayjs();
  }
  return 1;
  function calcsetdayjs() {
    return Math.ceil(setdayjs.date() / 7);
  }
}
