import { Paper } from "@mui/material";

import DynTable from "@components/GUI/DynTable";

import { isDark } from "@theme/theme-manager.jsx";

import { DivM, PaperP } from "@components/containers.jsx";

export default Withdrawal;

function Withdrawal({children}) {
  return (
    <>
      {children}
      <br />
      En construcción... 🚧
    </>
  );
}