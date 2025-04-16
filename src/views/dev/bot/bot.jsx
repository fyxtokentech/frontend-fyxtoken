import React, { useRef, useState, useEffect } from "react";

import { DriverParams } from "@jeff-aporta/router";
import fluidCSS from "@jeff-aporta/fluidcss";

import { ThemeSwitcher } from "@templates";
import { DivM, PaperP } from "@containers";
import { DynTable, genAllColumns } from "@components/GUI/DynTable/DynTable";

import {
  Button,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import TransactionsIcon from "@mui/icons-material/PriceChange";

import FyxDialog from "@components/GUI/dialog";

import { generate_inputs, Info, Title } from "@recurrent";

import ActionMain from "./ActionMain/ActionMain";
import Settings from "./Settings";

let _currency_ = "";

export default function PanelRobot() {
  const driverParams = DriverParams();

  const [viewTable, setViewTable] = useState(
    driverParams.get("view-table") ?? "operations"
  );
  const [operationTrigger, setOperationTrigger] = useState(null);
  const [currency, setCurrency] = useState(_currency_);
  const [update_available, setUpdateAvailable] = useState(true);
  const [view, setView] = useState(driverParams.get("action-id") ?? "main");

  useEffect(() => {
    const aid = driverParams.get("action-id");
    const vt = driverParams.get("view-table");
    if (aid != view) {
      driverParams.set("action-id", view);
    }
    if (vt != viewTable) {
      driverParams.set("view-table", viewTable);
    }
  }, [view, viewTable]);

  _currency_ = currency;

  return (
    <ThemeSwitcher h_init="20px" h_fin="300px">
      <DivM>
        <Title txt="Panel Robot" />
        {(() => {
          switch (view) {
            case "main":
            default:
              return (
                <ActionMain
                  {...{
                    currency,
                    setCurrency,
                    update_available,
                    setUpdateAvailable,
                    setViewTable,
                    setView,
                    viewTable,
                    setOperationTrigger,
                    operationTrigger,
                  }}
                />
              );
            case "settings":
              return <Settings setView={setView} />;
          }
        })()}
      </DivM>
    </ThemeSwitcher>
  );
}
