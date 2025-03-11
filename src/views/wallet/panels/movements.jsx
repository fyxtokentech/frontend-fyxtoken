import React from "react";

import fluidCSS  from 'fluid-css-lng';
import { PaperP } from "@components/containers";

import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
import { useDrawingArea, useYScale } from "@mui/x-charts/hooks";
import { isDark, theme } from "@theme/theme-manager";
import { ThemeProvider } from "@mui/material/styles";

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

  const { xdata, series } = props;

  const overlayer = i == series.length - 1;

  const enfasis = isDark() ? "var(--morado-enfasis)" : "var(--verde-cielo)";

  return (
    <LineChart
      {...props}
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

function Movements({ children: prev_content }) {
  const xData = Array.from(
    { length: 6 },
    (_, i) => new Date(2024, 9, 15, i, 0)
  );
  const y1 = [2, 5.5, 2, 8.5, 1.5, 5];
  const y2 = [3.1, 7, 3.5, 8.6, 2.7, 6.5];

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

  return (
    <PaperP elevation={0}>
      {prev_content}
      <br />
      <div
        className="p-relative"
        style={{
          height: "350px",
          border: "1px solid rgba(128, 128, 128, 0.2)",
          background: `rgba(0, 0, 0, ${isDark() ? "0.2" : "0"})`,
          isolation: "isolate",
          overflow: "auto",
        }}
      >
        <ThemeProvider theme={theme("dark", false)}>
          {series.map((s, i) => (
            <Graph
              xdata={xData}
              i={i}
              key={i}
              series={series.map((s, j) => {
                if (i != j) {
                  return {
                    ...s,
                    area: true,
                  };
                }
                if(j==series.length-1){
                  return s;
                }
                return {
                  ...s,
                  color: "transparent",
                };
              })}
              height={300}
              className={fluidCSS().gtX(850, {
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)"
              }).end("p-absolute")}
              style={{
                mixBlendMode: isDark() ? "lighten" : "normal",
                width: 800,
                transformOrigin: "right center",
                margin: "auto"
              }}
            />
          ))}
        </ThemeProvider>
      </div>
    </PaperP>
  );
}

export default Movements;
