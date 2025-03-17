import React, { useState, useRef } from "react";
import dayjs from "dayjs";
import fluidCSS from "@jeff-aporta/fluidcss";

import { PaperP } from "@components/containers";
import { TitleInfo } from "@components/repetitives";

import { isDark, getTheme, paletteConfig } from "@jeff-aporta/theme-manager";
import { ThemeProvider } from "@mui/material/styles";
import { useDrag, usePinch } from "@use-gesture/react";

import { ZoomControls, DateRangeControls } from "./controls";
import { Graph, CHART_HEIGHT } from "./graph";

import "./movements.css";

const ZOOM_LIMITS = { MIN: 0.5, MAX: 2 };

const xData = Array.from({ length: 20 }, (_, i) =>
  dayjs(`2024-10-15T${i.toString().padStart(2, 0)}:00`).toDate()
);
const investmentData = Array.from(
  { length: 20 },
  () => Math.random() * 20 + 10
);
const withdrawalData = investmentData.map((y) => y + Math.random() * 10);

function Movements() {
  const [zoomlevel, setZoomLevel] = useState(1);
  const [dateRangeInit] = useState(dayjs("2024-10-15T00:00"));
  const [dateRangeFin] = useState(dayjs("2024-10-15T23:59"));
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);
  const touchCoords = useRef({ xini: 0 });

  const series = [
    {
      data: investmentData,
      label: "Compra",
      color: isDark() ? "lime" : "SpringGreen",
      fillcolor: isDark() ? "#0F5733" : "lightgreen",
    },
    {
      data: withdrawalData,
      label: "Venta",
      color: isDark() ? "red" : "salmon",
      fillcolor: isDark() ? "#570F36" : "pink",
    },
  ];

  const handleTouchStart = (e) => {
    touchCoords.current.xini = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;

    const xfin = e.touches[0].clientX;
    const deltaX = xfin - touchCoords.current.xini;
    touchCoords.current.xini = xfin;

    if (Math.abs(deltaX) > 5) {
      containerRef.current?.scrollBy({
        left: e.target.scrollLeft - deltaX,
        behavior: "smooth",
      });
    }
  };

  usePinch(
    ({ offset: [d] }) => {
      const newZoom = 1 + d / 50;
      setZoomLevel(
        Math.min(Math.max(newZoom, ZOOM_LIMITS.MIN), ZOOM_LIMITS.MAX)
      );
    },
    {
      target: containerRef,
      scaleBounds: ZOOM_LIMITS,
    }
  );

  useDrag(
    ({ movement: [mx, my], first, last }) => {
      if (!first && !last) {
        setPosition((pos) => ({ x: pos.x + mx, y: pos.y + my }));
      }
    },
    {
      target: containerRef,
      from: () => [position.x, position.y],
    }
  );

  const handleWheel = (e) => {
    if (isActive && e.deltaY !== 0) {
      const newZoom = zoomlevel - e.deltaY * 0.001;
      setZoomLevel(
        Math.min(Math.max(newZoom, ZOOM_LIMITS.MIN), ZOOM_LIMITS.MAX)
      );
    }
  };

  return (
    <PaperP
      elevation={0}
      className={`panel movements ${isDark() ? "dark" : "light"}`}
    >
      <TitleInfo
        variant="h5"
        title="Historial de movimientos"
        information={
          <>
            Consulta y analiza tus transacciones pasadas para llevar un registro
            claro de depósitos, retiros y otros movimientos.
          </>
        }
      />
      <br />

      <div className="d-inline-flex jc-space-between flex-wrap gap-10px padb-40px">
        <ZoomControls setZoomLevel={setZoomLevel} setPosition={setPosition} />
        <div className={fluidCSS().ltX(850, { width: "100%" }).end()} />
        <DateRangeControls
          dateRangeInit={dateRangeInit}
          dateRangeFin={dateRangeFin}
        />
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onFocus={(e) => {
          setIsActive(true);
          setTimeout(() => (document.body.style.overflow = "auto"));
          setTimeout(() => (document.body.style.overflow = "hidden"));
        }}
        onBlur={() => {
          setIsActive(false);
          document.body.style.overflow = "auto";
        }}
        onMouseEnter={(e) => {
          if (isActive) {
            document.body.style.overflow = "hidden";
          }
        }}
        onMouseLeave={(e) => {
          if (isActive) {
            document.body.style.overflow = "auto";
          }
        }}
        tabIndex="1"
        className="p-relative padl-20px padh-20px container-graph"
        style={{
          height: `${CHART_HEIGHT + 40}px`,
        }}
      >
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
      </div>
    </PaperP>
  );
}

export default Movements;
