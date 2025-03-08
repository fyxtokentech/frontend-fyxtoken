import { Paper } from "@mui/material";
import fluidCSS from "fluid-css-lng";

export {
    DivM,
    PaperP
}

function DivM(props) {
  const { m_min = 15, m_max = 30 } = props;
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX(400, 1000, {
          margin: [m_min, m_max],
        })
        .end(`DivM tw-balance ${props.className}`)}
    />
  );
}

function PaperP(props) {
  const { p_min = 10, p_max = 20 } = props;
  return (
    <Paper
      {...props}
      className={fluidCSS()
        .lerpX(400, 1000, {
          Padding: [p_min, p_max],
        })
        .end(`PaperP tw-balance ${props.className}`)}
    />
  );
}