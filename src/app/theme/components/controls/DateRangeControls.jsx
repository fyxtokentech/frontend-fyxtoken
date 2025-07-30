import React, { useState, useEffect, Component } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { format } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import {
  getPaletteConfig,
  fluidCSS,
  driverParams,
  getContrastPaperBow,
  WaitSkeleton,
  DriverComponent,
  clamp,
} from "@jeff-aporta/camaleon";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

let MONTH, WEEK;

let nWeeks;

const modelDate = {
  value: dayjs().format("YYYY-MM-DD"),
  _setValidate_(value) {
    return dayjs(value).format("YYYY-MM-DD");
  },
  getDayjs({ getValue }) {
    return dayjs(getValue());
  },
};

const driverDateRangeControls = DriverComponent({
  idDriver: "date-range-control",
  startDate: {
    nameParam: "start_date",
    ...modelDate,
  },
  endDate: {
    nameParam: "end_date",
    ...modelDate,
  },
  setDates(entrie) {
    let start, end;
    if (typeof entrie == "string") {
      start = entrie;
      end = entrie;
    } else {
      ({ start, end } = entrie);
    }
    this.setStartDate(start);
    this.setEndDate(end);
  },
  period: {
    nameParam: "period",
    value: "most_recent",
    _willSet_(value) {
      if (this.isMostRecentPeriod()) {
        return;
      }
      const startDate = this.getStartDate();
      const month = this.getMonthToday();
      const year = this.getYearToday();
      let init, fin;
      switch (value) {
        case "day":
          init = this.getToday();
          fin = init;
          break;
        case "week":
          const iw = +this.getWeekToday();
          const { start, end } = this.getWeekRange(iw);
          init = getYYYYMMDD(year, month, start);
          fin = getYYYYMMDD(year, month, end);
          this.setWeek(iw);
          this.setMonth(month);
          break;
        case "month":
          init = getYYYYMMDD(year, month, 1);
          fin = getYYYYMMDD(year, month, this.getDaysInMonth());
          this.setMonth(month);
          break;
      }
      this.setDates({ start: init, end: fin });

      function getYYYYMMDD(year, month, day) {
        return [year, month + 1, day].join("-");
      }
    },
    isDay({ getValue }) {
      return getValue() == "day";
    },
    isWeek({ getValue }) {
      return getValue() == "week";
    },
    isMonth({ getValue }) {
      return getValue() == "month";
    },
    isMostRecent({ getValue }) {
      return getValue() == "most_recent";
    },
  },
  week: {
    nameParam: "week",
    isInteger: true,
    min: 1,
    max: 4,
    _setup_({ init }) {
      init(this.getWeekToday());
    },
    getInit(currentMonth = dayjs().month(), { min }) {
      let setdayjs = this.getDayjsStartDate();

      if (this.getMonth() == currentMonth) {
        if (setdayjs.month() != currentMonth) {
          setdayjs = dayjs();
        }
        return calcWeek();
      }
      if (this.getStartDate()) {
        return calcWeek();
      }
      return min;

      function calcWeek() {
        return Math.ceil(setdayjs.date() / 7);
      }
    },
  },
  month: {
    nameParam: "month",
    isInteger: true,
    _setup_({ init }) {
      init(this.getMonthToday());
    },
    getDate(start) {
      return dayjs().month(this.getMonth()).date(start);
    },
    getDaysIn({ getValue }) {
      console.log(getValue());
      return dayjs().month(getValue()).daysInMonth();
    },
  },
  getMonthDate({ month, date }) {
    if (month == null) {
      month = this.getMonth();
    }
    return dayjs().month(month).date(date);
  },
  today: {
    freeze: true,
    value: dayjs().format("YYYY-MM-DD"),
    ...modelDate,
    getWeek({ getDayjs }) {
      return Math.ceil(getDayjs().date() / 7);
    },
    getYear({ getDayjs }) {
      return getDayjs().year();
    },
    getMonth({ getDayjs }) {
      return getDayjs().month();
    },
    month(month, { getDayjs }) {
      return getDayjs().month(month);
    },
    getStartEndMonth(month) {
      const date = this.monthToday(month);
      return {
        start: date.startOf("month").format("YYYY-MM-DD"),
        end: date.endOf("month").format("YYYY-MM-DD"),
      };
    },
    dayjsPrevMonth(i) {
      return dayjs().subtract(i, "month");
    },
  },
  getWeekRange(week) {
    const month = this.getMonth();
    if (!week) {
      week = this.getWeek();
    }
    nWeeks = [
      { start: 1, end: 7 },
      { start: 8, end: 14 },
      { start: 15, end: 21 },
      { start: 22, end: this.getDaysInMonth() },
    ];
    return nWeeks[week - 1];
  },
});

export class DateRangeControls extends Component {
  constructor(props) {
    super(props);
    const { period } = props;
    if (period) {
      driverDateRangeControls.setPeriod(period);
    }
  }
  componentDidMount() {
    driverDateRangeControls.burnParams();
    driverDateRangeControls.addLinkStartDate(this);
    driverDateRangeControls.addLinkEndDate(this);
    driverDateRangeControls.addLinkPeriod(this);
  }
  componentWillUnmount() {
    driverDateRangeControls.removeLinkStartDate(this);
    driverDateRangeControls.removeLinkEndDate(this);
    driverDateRangeControls.removeLinkPeriod(this);
  }
  render() {
    const {
      type = "select",
      loading,
      period, // day, week, month
      willPeriodChange = () => {},
    } = this.props;

    // Configurar dayjs para español
    dayjs.locale(es);

    const handlePeriodChange = (event) => {
      driverDateRangeControls.setNullishPeriod(event?.target?.value);
    };

    const handleDateChange = (date) => {
      driverDateRangeControls.setDates(dayjs(date).format("YYYY-MM-DD"));
    };

    const handleWeekChange = (week) => {
      if (!driverDateRangeControls.isWeekPeriod()) {
        return;
      }
      driverDateRangeControls.setWeek(week);
      const { start, end } = driverDateRangeControls.getWeekRange(week);
      const s_date = driverDateRangeControls.getDateMonth(start);
      const e_date = driverDateRangeControls.getDateMonth(end);

      // Verificar si el rango está en el futuro
      const today = driverDateRangeControls.getDayjsToday();
      let startDate, endDate;
      if (s_date.isAfter(today)) {
        // Si el inicio está en el futuro, usar la fecha actual
        startDate = endDate = today.format("YYYY-MM-DD");
      } else {
        // Si está en el pasado o presente, usar el rango normal
        startDate = s_date.format("YYYY-MM-DD");
        endDate = e_date.format("YYYY-MM-DD");
      }

      driverDateRangeControls.setWeek(week);
      driverDateRangeControls.setDates({
        start: startDate,
        end: endDate,
      });
    };

    const handleMonthChange = (month) => {
      const iw2 = driverDateRangeControls.getInitWeek(month);
      driverDateRangeControls.setMonth(month);
      if (driverDateRangeControls.isWeekPeriod()) {
        handleWeekChange(iw2);
        return;
      }
      const { start, end } =
        driverDateRangeControls.getStartEndMonthToday(month);
      driverDateRangeControls.setMonth(month);
      driverDateRangeControls.setWeek(iw2);
      driverDateRangeControls.setDates({
        start: start,
        end: end,
      });
    };

    // Si el tipo es "none", no mostrar ningún control
    if (type === "none") {
      return null;
    }

    // Si el tipo es "custom", mostrar los selectores de fecha personalizados
    if (type === "custom") {
      return (
        <div className="flex align-stretch flex-wrap gap-20px">
          <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
            <WaitSkeleton loading={loading}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="fullWidth"
                  label="Fecha inicio"
                  value={driverDateRangeControls.getDayjsStartDate()}
                  onChange={(date) =>
                    driverDateRangeControls.setStartDate(date)
                  }
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </WaitSkeleton>
          </div>
          <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
            <WaitSkeleton loading={loading}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="fullWidth"
                  label="Fecha Fin"
                  value={driverDateRangeControls.getDayjsEndDate()}
                  onChange={(date) => driverDateRangeControls.setEndDate(date)}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </WaitSkeleton>
          </div>
        </div>
      );
    }

    // Implementación con Select (opción por defecto)
    const palette_config = getPaletteConfig();
    return (
      <div className="flex align-stretch flex-wrap gap-20px">
        <WaitSkeleton loading={loading}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="period-select-label">Período</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={driverDateRangeControls.getPeriod()}
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
        </WaitSkeleton>

        {driverDateRangeControls.isDayPeriod() && (
          <WaitSkeleton loading={loading}>
            <div style={{ width: "200px", display: "inline-block" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="fullWidth"
                  label="Seleccionar día"
                  value={driverDateRangeControls.getDayjsStartDate()}
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
          </WaitSkeleton>
        )}

        {driverDateRangeControls.isWeekPeriod() && (
          <div
            className={`flex align-center flex-wrap gap-10px ${fluidCSS()
              .ltX(700, { width: "100%" })
              .end()}`}
          >
            <WaitSkeleton loading={loading}>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel id="month-select-label">Mes</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={driverDateRangeControls.getMonth()}
                  onChange={(e) => handleMonthChange(+e.target.value)}
                  label="Mes"
                  MenuProps={{
                    disableScrollLock: true, // Evita que se bloquee el scroll
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = driverDateRangeControls.dayjsPrevMonthToday(i);
                    return (
                      <MenuItem
                        key={date.format("YYYY-MM")}
                        value={date.month()}
                      >
                        {format(new Date(date), "MMMM yyyy", {
                          locale: esLocale,
                        })}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </WaitSkeleton>
            <WaitSkeleton loading={loading}>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel id="week-select-label">Semana</InputLabel>
                <Select
                  labelId="week-select-label"
                  id="week-select"
                  value={driverDateRangeControls.getWeek()}
                  onChange={(e) => handleWeekChange(+e.target.value)}
                  label="Semana"
                  MenuProps={{
                    disableScrollLock: true, // Evita que se bloquee el scroll
                  }}
                >
                  {Array.from({ length: 4 }, (_, i) => {
                    const { start, end } = driverDateRangeControls.getWeekRange(
                      i + 1
                    );
                    const date = driverDateRangeControls.getMonthDate({
                      date: start,
                    });

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
            </WaitSkeleton>
          </div>
        )}

        {driverDateRangeControls.isMonthPeriod() && (
          <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
            <WaitSkeleton loading={loading}>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 200 }}
              >
                <InputLabel id="month-select-label">Mes</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={driverDateRangeControls.getMonth()}
                  onChange={(e) => handleMonthChange(+e.target.value)}
                  label="Mes"
                  MenuProps={{
                    disableScrollLock: true, // Evita que se bloquee el scroll
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = driverDateRangeControls.dayjsPrevMonthToday(i);
                    return (
                      <MenuItem
                        key={date.format("YYYY-MM")}
                        value={date.month()}
                      >
                        {format(new Date(date), "MMMM yyyy", {
                          locale: esLocale,
                        })}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </WaitSkeleton>
          </div>
        )}
      </div>
    );
  }
}
