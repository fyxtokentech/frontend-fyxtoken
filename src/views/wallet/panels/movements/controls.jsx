import React, { useState } from "react";

// Ownlibs
import fluidCSS from "@jeff-aporta/fluidcss";

// FyxGUI
import {
  generate_inputs,
  generate_selects,
  Info,
} from "@components/repetitives";
import { isDark } from "@jeff-aporta/theme-manager";
import { custom_styles } from "../comun";

// MUI
import { Paper, IconButton, Tooltip } from "@mui/material";
import { ZoomIn, ZoomOut, RestartAlt } from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Constants
const ZOOM_LIMITS = { MIN: 0.5, MAX: 2 };
const ZOOM_STEP = 0.2;

let _time_ = "";

export function ZoomControls({ setZoomLevel, setPosition }) {
  const color = isDark() ? "white" : "black";

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="d-flex flex-wrap gap-10px">
      <Paper className="d-center">
        <Tooltip title="Aumentar zoom (+)">
          <IconButton
            onClick={() =>
              setZoomLevel((prev) =>
                Math.min(prev + ZOOM_STEP, ZOOM_LIMITS.MAX)
              )
            }
            color={color}
          >
            <ZoomIn />
          </IconButton>
        </Tooltip>
      </Paper>
      <Paper className="d-center">
        <Tooltip title="Reducir zoom (-)">
          <IconButton
            onClick={() =>
              setZoomLevel((prev) =>
                Math.max(prev - ZOOM_STEP, ZOOM_LIMITS.MIN)
              )
            }
            color={color}
          >
            <ZoomOut />
          </IconButton>
        </Tooltip>
      </Paper>
      <Paper className="d-center">
        <Tooltip title="Reiniciar zoom">
          <IconButton onClick={handleReset} color={color}>
            <RestartAlt />
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );
}

export function DateRangeControls({ dateRangeInit, dateRangeFin }) {
  const [time, setTime] = useState(_time_);
  _time_ = time;
  return (
    <div className="d-flex ai-stretch flex-wrap gap-10px">
      <div className="padw-10px" style={custom_styles.controlInput}>
        {generate_selects([
          {
            model: "interval",
            value: time,
            setter: setTime,
          },
        ])}
      </div>
      <div
        className={fluidCSS().ltX(700, { width: "100%" }).end()}
        style={custom_styles.controlInput}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            inert
            className="fullWidth"
            label="Fecha inicio"
            defaultValue={dateRangeInit}
          />
        </LocalizationProvider>
      </div>
      <div
        className={fluidCSS().ltX(700, { width: "100%" }).end()}
        style={custom_styles.controlInput}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            inert
            className="fullWidth"
            label="Fecha Fin"
            defaultValue={dateRangeFin}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
}
