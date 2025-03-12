import React, { useState, useRef } from "react";
import dayjs from "dayjs";

import fluidCSS from "fluid-css-lng";

import { TitlePanel } from "./comun";

import { PaperP } from "@components/containers";
import { Info } from "@components/repetitives";
import { isDark, theme } from "@theme/theme-manager";

import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
import { useDrawingArea, useYScale } from "@mui/x-charts/hooks";
import { ThemeProvider } from "@mui/material/styles";
import { IconButton, Paper } from "@mui/material";
import { ZoomIn, ZoomOut, RestartAlt } from "@mui/icons-material";
import { useDrag, usePinch } from "@use-gesture/react";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function ColorSwich({ threshold, color1, color2, id }) {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  const scale = useYScale();
  if (!scale) return null;

  const y0 = scale(threshold);
  const off = y0 !== undefined ? y0 / svgHeight : 0;

  return (
    <defs>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color1} stopOpacity={1} />
        <stop offset="100%" stopColor={color2} stopOpacity={1} />
      </linearGradient>
    </defs>
  );
}

function Graph({ i, ...props }) {
  const idR = Math.random().toString(36).replace("0.", "id-");
  const { xdata, series, zoomlevel } = props;

  const overlayer = i == series.length - 1;

  const enfasis = isDark() ? "var(--morado-enfasis)" : "var(--verde-cielo)";

  return (
    <LineChart
      {...props}
      width={100 * xdata.length * zoomlevel}
      xAxis={[
        {
          data: xdata,
          scaleType: "time",
          valueFormatter: (date) =>
            overlayer
              ? date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
        },
      ]}
      yAxis={[
        {
          valueFormatter: (value) =>
            overlayer
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                }).format(value)
              : "",
        },
      ]}
      sx={{
        "& .MuiChartsLegend-root text": {
          fill: `${
            overlayer ? (isDark() ? "white" : "black") : "transparent"
          } !important`,
        },
        "& .MuiChartsAxis-line": {
          stroke: (overlayer ? enfasis : "transparent") + " !important",
        },
        "& .MuiChartsAxis-root": {
          fill: overlayer ? enfasis : "transparent",
          stroke: "transparent !important",
        },
        "& .MuiChartsAxis-tick": {
          stroke: "transparent !important",
        },

        "& .MuiChartsAxis-tickLabel": {
          fill: overlayer ? enfasis : "transparent",
          stroke: "transparent",
          fontSize: 12,
        },
        [`& .${areaElementClasses.root}`]: {
          fill: `url(#swich-color-${idR})`,
        },
      }}
    >
      <ColorSwich
        threshold={0}
        color1={
          series.find((d) => d.area)?.fillcolor ??
          series.find((d) => d.area)?.color
        }
        color2={isDark() ? "var(--morado)" : "lightcyan"}
        id={`swich-color-${idR}`}
      />
    </LineChart>
  );
}

const xData = Array.from({ length: 20 }, (_, i) =>
  dayjs(`2024-10-15T${i.toString().padStart(2, 0)}:00`).toDate()
);
const y1 = Array.from({ length: 20 }, (_, i) => Math.random() * 20 + 10);
const y2 = y1.map((y) => y + Math.random() * 10);

function Movements() {
  const datetimeInit_string = "2024-10-15T00:00";
  const datetimeFin_string = "2024-10-15T23:59";

  const [zoomlevel, setZoomLevel] = useState(1);

  const [dateRangeInit, setDateRangeInit] = React.useState(
    dayjs(datetimeInit_string)
  );

  const [dateRangeFin, setDateRangeFin] = React.useState(
    dayjs(datetimeFin_string)
  );

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);

  let series = [
    {
      data: y1,
      label: "Invertido",
      color: isDark() ? "lime" : "SpringGreen",
      fillcolor: isDark() ? "#0F5733" : "lightgreen",
    },
    {
      data: y2,
      label: "Retirado",
      color: isDark() ? "red" : "salmon",
      fillcolor: isDark() ? "#570F36" : "pink",
    },
  ];

  usePinch(
    ({ offset: [d] }) => {
      const newZoom = 1 + d / 50;
      setZoomLevel(Math.min(Math.max(newZoom, 0.5), 2));
    },
    {
      target: containerRef,
      scaleBounds: { min: 0.5, max: 2 },
    }
  );

  useDrag(
    ({ movement: [mx, my], first, last }) => {
      if (!first && !last) {
        setPosition((pos) => ({
          x: pos.x + mx,
          y: pos.y + my,
        }));
      }
    },
    {
      target: containerRef,
      from: () => [position.x, position.y],
    }
  );

  const coords = useRef({ xini: 0, yini: 0, xfin: 0, yfin: 0 });

  const handleTouchStart = (e) => {
    coords.current.xini = e.touches[0].clientX;
    coords.current.yini = e.touches[0].clientY;
  };

  const handleTouchDrag = (e) => {
    if (e.touches.length != 1) {
      return;
    }
    coords.current.xfin = e.touches[0].clientX;
    const deltaX = coords.current.xfin - coords.current.xini;
    coords.current.xini = e.touches[0].clientX;

    if (Math.abs(deltaX) > 5) {
      containerRef.current.scrollBy({
        left: e.target.scrollLeft - deltaX,
        behavior: "smooth",
      });
    }
  };

  const color_icon_button = isDark() ? "white" : "black";

  return (
    <PaperP elevation={0}>
      <TitlePanel>
        Historial de movimientos
        <Info
          placement="right"
          className="ml-20px"
          title={
            <>
              Consulta y analiza tus transacciones pasadas para llevar un
              registro claro de depósitos, retiros y otros movimientos. Mantén
              un control detallado de tu historial financiero y toma decisiones
              informadas.
            </>
          }
        />
      </TitlePanel>
      <br />
      <div className="d-inline-flex jc-space-between flex-wrap gap-10px padb-40px">
        <div className="d-flex flex-wrap gap-10px">
          <Paper className="d-center">
            <IconButton
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 2))}
              color={color_icon_button}
            >
              <ZoomIn />
            </IconButton>
          </Paper>
          <Paper className="d-center">
            <IconButton
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))}
              color={color_icon_button}
            >
              <ZoomOut />
            </IconButton>
          </Paper>
          <Paper className="d-center">
            <IconButton
              onClick={() => {
                setZoomLevel(1);
                setPosition({ x: 0, y: 0 });
                /* setDateRange([
              new Date(2024, 9, 15, 0, 0),
              new Date(2024, 9, 15, 5, 0),
            ]); */
              }}
              color={color_icon_button}
            >
              <RestartAlt />
            </IconButton>
          </Paper>
        </div>
        <div className={fluidCSS().ltX(850, { width: "100%" }).end()} />
        <div className="d-flex flex-wrap gap-10px">
          <div
            className={fluidCSS().ltX(700, { width: "100%" }).end()}
            style={{
              background: "rgba(255,255,255,0.12)",
            }}
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
            style={{
              background: "rgba(255,255,255,0.12)",
            }}
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
      </div>
      <div
        ref={containerRef}
        onWheel={(e) => {
          if (isActive) {
            const dy = e.deltaY;
            if (dy !== 0) {
              const newZoom = zoomlevel - dy * 0.001;
              setZoomLevel(Math.min(Math.max(newZoom, 0.5), 2));
            }
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchDrag}
        onFocus={() => {
          setIsActive(true);
          document.body.style.overflow = "hidden";
        }}
        onBlur={() => {
          setIsActive(false);
          document.body.style.overflow = "auto";
        }}
        tabIndex="1"
        className="p-relative padl-20px padh-20px"
        style={{
          height: "340px",
          border: "1px solid rgba(128, 128, 128, 0.2)",
          background: `rgba(0, 0, 0, ${isDark() ? "0.2" : "0"})`,
          isolation: "isolate",
          overflow: "auto",
          touchAction: "pan-x",
          userSelect: "none",
          WebkitOverflowScrolling: "touch", // Para mejor rendimiento en iOS
          scrollbarWidth: "thin",
          scrollbarColor: isDark()
            ? "rgba(255,255,255,0.3) transparent"
            : "rgba(0,0,0,0.3) transparent",
        }}
      >
        <div
          className="p-relative"
          style={{
            minWidth: "100%",
            width: "fit-content",
            paddingBottom: "20px", // Espacio para la barra de scroll
          }}
        >
          <ThemeProvider theme={theme("dark", false)}>
            {series.map((s, i) => (
              <Graph
                xdata={xData}
                i={i}
                key={i}
                zoomlevel={zoomlevel}
                series={series.map((s, j) => {
                  if (i != j) {
                    return {
                      ...s,
                      area: true,
                    };
                  }
                  if (j == series.length - 1) {
                    return s;
                  }
                  return {
                    ...s,
                    color: "transparent",
                  };
                })}
                height={300}
                className="p-absolute"
                style={{
                  mixBlendMode: isDark() ? "lighten" : "normal",
                  transformOrigin: "right center",
                  margin: "auto",
                }}
              />
            ))}
          </ThemeProvider>
        </div>
      </div>
    </PaperP>
  );
}

export default Movements;
