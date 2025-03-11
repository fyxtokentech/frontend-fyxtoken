import { Paper } from "@mui/material";

import { isDark } from "@theme/theme-manager.jsx";

import { DivM, PaperP } from "@components/containers.jsx";

export default Withdrawal;

function Withdrawal({ children }) {
  return (
    <PaperP elevation={0}>
      {children}
      <br />
      En construcción... 🚧
    </PaperP>
  );
}
