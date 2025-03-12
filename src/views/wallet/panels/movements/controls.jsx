import React from "react";
import { Paper, IconButton, Tooltip } from "@mui/material";
import { ZoomIn, ZoomOut, RestartAlt } from "@mui/icons-material";
import { isDark } from "@theme/theme-manager";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import fluidCSS from "fluid-css-lng";

// Constants
const ZOOM_LIMITS = { MIN: 0.5, MAX: 2 };
const ZOOM_STEP = 0.2;

const styles = {
  datePicker: {
    background: "rgba(255,255,255,0.12)",
  },
};

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
  return (
    <div className="d-flex flex-wrap gap-10px">
      <div
        className={fluidCSS().ltX(700, { width: "100%" }).end()}
        style={styles.datePicker}
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
        style={styles.datePicker}
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
