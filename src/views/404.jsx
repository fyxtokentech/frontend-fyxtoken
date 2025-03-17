import React from "react";

import { ThemeSwitcher } from "@components/templates";
import { DivM } from "@components/containers.jsx";
import { Typography } from "@mui/material";

export default State404;

function State404() {
  return (
    <ThemeSwitcher bgtype="2" h_init="100px" h_fin="100px">
      <DivM m_max={40} className="d-center min-h-50vh">
        <Typography variant="h1">404 (Not found)</Typography>
      </DivM>
    </ThemeSwitcher>
  );
}
