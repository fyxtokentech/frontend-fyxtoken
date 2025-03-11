import { Typography } from "@mui/material";

function TitlePanel({ children }) {
  return (
    <Typography className="d-flex ai-center flex-wrap" variant="h4">
      {children}
    </Typography>
  );
}

export { TitlePanel };
