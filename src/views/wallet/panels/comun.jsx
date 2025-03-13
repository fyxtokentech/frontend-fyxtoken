import { Typography } from "@mui/material";

function TitlePanel({ children }) {
  return (
    <Typography className="d-flex jc-start ai-center" variant="h4">
      {children}
    </Typography>
  );
}

const custom_styles = {
  controlInput: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "5px",
  },
};

export { TitlePanel, custom_styles };
