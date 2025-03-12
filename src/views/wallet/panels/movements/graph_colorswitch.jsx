import React from 'react';
import { useDrawingArea, useYScale } from "@mui/x-charts/hooks";

export function ColorSwitch({ threshold, color1, color2, id }) {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;
  const scale = useYScale();
  
  if (!scale) return null;

  return (
    <defs>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color1} stopOpacity={1} />
        <stop offset="100%" stopColor={color2} stopOpacity={1} />
      </linearGradient>
    </defs>
  );
}
