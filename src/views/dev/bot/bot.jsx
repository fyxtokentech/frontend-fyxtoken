import React, { useRef, useState, useEffect } from "react";

import fluidCSS from "@jeff-aporta/fluidcss";

import { ThemeSwitcher } from "@templates";
import { DivM, PaperP } from "@containers";
import { DynTable, genAllColumns } from "@components/GUI/DynTable/DynTable";

import { getResponse } from "@api/requestTable";

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

export default function PanelRobot() {
  const params = new URLSearchParams(window.location.search);

  const [viewTable, setViewTable] = useState(
    params.get("view-table") ?? "operations"
  );
  const [view, setView] = useState(params.get("action-id") ?? "main");

  console.log("PanelRobot render:", { view, viewTable });

  const [operationTrigger, setOperationTrigger] = useState(null);
  const currency = useRef("");

  const [update_available, setUpdateAvailable] = useState(true);

  // Hook para forzar renderizado
  const [, forceUpdate] = useState({}); // Fuerza el renderizado

  const coinsToOperate = useRef([]); // Lista de monedas disponibles para operar
  const coinsOperatingList = useRef([]); // Lista de monedas en operación
  const coinsToDelete = useRef([]); // Lista de monedas en proceso de eliminación

  // Efecto de carga de monedas disponibles
  const [loadingCoinToOperate, setLoadingCoinToOperate] = useState(true);
  // Error al cargar monedas disponibles
  const [errorCoinOperate, setErrorCoinOperate] = useState(null);

  const user_id = global.configApp.userID;

  // Sync view and viewTable to URL params
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (view !== p.get("action-id")) p.set("action-id", view);
    if (viewTable !== p.get("view-table")) p.set("view-table", viewTable);
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [view, viewTable]);

  useEffect(() => {
    console.log(coinsToOperate)
    if (coinsToOperate.current.length === 0) {
      setLoadingCoinToOperate(true);
      getResponse({
        setError: setErrorCoinOperate,
        checkErrors: () => null,
        setLoading: setLoadingCoinToOperate,
        setApiData: (data) => {
          coinsToOperate.current = data.map(
            (coin) => coin.symbol || coin.name || coin.id || "-"
          );
        },
        buildEndpoint: ({ baseUrl }) => `${baseUrl}/coins/active/${user_id}`,
        mock_default: {
          content: [["symbol"], ["BTC"], ["ETH"], ["BNB"], ["XRP"], ["XAI"]],
        },
      });
    }
  }, []);

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
                    update_available,
                    setUpdateAvailable,
                    setViewTable,
                    setView,
                    viewTable,
                    setOperationTrigger,
                    operationTrigger,
                    forceUpdate,
                    coinsOperatingList,
                    coinsToDelete,
                    coinsToOperate,
                    loadingCoinToOperate,
                    setLoadingCoinToOperate,
                    errorCoinOperate,
                    setErrorCoinOperate,
                    user_id,
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
