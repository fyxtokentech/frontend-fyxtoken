import React, { useRef, useState, useEffect } from "react";

import fluidCSS from "@jeff-aporta/fluidcss";

import { ThemeSwitcher } from "@templates";
import { DivM, PaperP } from "@containers";
import { DynTable, genAllColumns } from "@components/GUI/DynTable/DynTable";

import { http_get_coins } from "@api/mocks";

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
import Settings from "./Settings/Settings";

export default function PanelRobot() {
  const { driverParams } = global;
  const [viewTable, setViewTable] = useState(
    driverParams.get("view-table") || "operations"
  );
  const [view, setView] = useState(driverParams.get("action-id") || "main");

  const [operationTrigger, setOperationTrigger] = useState(null);
  const currency = useRef(driverParams.get("coin") || "");

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

  const { user_id } = window["currentUser"];

  // Sync view and viewTable to URL params
  useEffect(() => {
    driverParams.set("action-id", view);
    driverParams.set("view-table", viewTable);
  }, [view, viewTable]);

  useEffect(() => {
    if (coinsToOperate.current.length === 0) {
      setLoadingCoinToOperate(true);
      http_get_coins({
        setError: setErrorCoinOperate,
        setLoading: setLoadingCoinToOperate,
        setApiData: (data) => {
          coinsToOperate.current = data;
          const paramCoin = driverParams.get("coin");
          if (!paramCoin && coinsToOperate.current.length > 0) {
            const first = coinsToOperate.current[0];
            const key = global.getCoinKey(first);
            currency.current = key;
            driverParams.set("coin", key);
            driverParams.set("id_coin", first.id);
          } else {
            currency.current = paramCoin;
          }
          coinsOperatingList.current = data.filter(
            (coin) => coin.status === "A"
          );
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
