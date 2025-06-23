import { Typography } from "@mui/material";

export function TitlePanel({ children }) {
  return (
    <Typography className="flex justify-start align-center" variant="h4">
      {children}
    </Typography>
  );
}

export const custom_styles = {
  controlInput: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "5px",
  },
};
