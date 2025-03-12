import { Typography } from "@mui/material";

function TitlePanel({ children }) {
  return (
    <Typography className="d-flex jc-start ai-center" variant="h4">
      {children}
    </Typography>
  );
}

export { TitlePanel };
