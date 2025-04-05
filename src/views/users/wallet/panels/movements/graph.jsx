import React from "react";
import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
import { isDark } from "@jeff-aporta/theme-manager";
import { ColorSwitch } from "./graph_colorswitch";

const CHART_HEIGHT = 300;

function Graph({ i, ...props }) {
  const idR = Math.random().toString(36).replace("0.", "id-");
  const { xdata, series, zoomlevel } = props;
  const overlayer = i === series.length - 1;
  const enfasis = isDark() ? "var(--morado-enfasis)" : "var(--verde-cielo)";

  const chartStyles = {
    "& .MuiChartsLegend-root text": {
      fill: `${
        overlayer ? (isDark() ? "white" : "black") : "transparent"
      } !important`,
    },
    "& .MuiChartsAxis-line": {
      stroke: `${overlayer ? enfasis : "transparent"} !important`,
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
  };

  return (
    <LineChart
      {...props}
      width={100 * xdata.length * zoomlevel}
      height={CHART_HEIGHT}
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
      sx={chartStyles}
    >
      <ColorSwitch
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

export { Graph, CHART_HEIGHT };
