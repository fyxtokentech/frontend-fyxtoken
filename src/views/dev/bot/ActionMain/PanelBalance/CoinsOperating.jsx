import React, { Component } from "react";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";

import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import { PaperP } from "@containers";
import {
  HTTPGET_USEROPERATION_OPEN,
  HTTPPOST_EXCHANGE_SELL,
  HTTPPUT_COINS_STOP,
} from "@api";

import { showSuccess, showWarning, showError } from "@templates";

export const vars_CoinsOperating = {
  actionInProcess: false,
}

export default class CoinsOperating extends Component {
  constructor(props) {
    super(props);
    this.handleCoinDelete = this.handleCoinDelete.bind(this);
    this.deleteCoinFromAPI = this.deleteCoinFromAPI.bind(this);
  }

  componentDidMount() {
    const { onExternalDeleteRef, coinsOperatingList } = this.props;
    if (onExternalDeleteRef) {
      onExternalDeleteRef.current = (coinSymbol) => {
        const coin = coinsOperatingList.current.find(
          (c) => global.getCoinKey(c) === coinSymbol
        );
        if (coin) this.handleCoinDelete({ preventDefault: () => {} }, coin);
      };
    }
  }

  // Handle coin deletion
  handleCoinDelete(event, coin) {
    event.preventDefault();
    const {
      //
      coinsToDelete,
      setUpdateAvailable,
    } = this.props;
    coinsToDelete.current = [...coinsToDelete.current, coin];
    vars_CoinsOperating.actionInProcess = true;
    setUpdateAvailable((prev) => !prev);
    setTimeout(() => {
      this.deleteCoinFromAPI(coin);
    });
  }

  // Function to stop coin
  async deleteCoinFromAPI(coin) {
    const {
      setErrorCoinOperate,
      coinsOperatingList,
      coinsToDelete,
      setUpdateAvailable,
      setActionInProcess,
    } = this.props;
    try {
      await coinStop();
      await coinSell();

      async function coinSell() {
        const operationOpen = {};
        await HTTPGET_USEROPERATION_OPEN({
          id_coin: coin.id,
          setApiData: ([data]) => {
            if (!data) {
              return;
            }
            Object.assign(operationOpen, data);
          },
          setError: setErrorCoinOperate,
          successful: (json, info) => {
            console.log(json, info)
            showSuccess(`Se empezó a operar (${coin.symbol})`);
          },
          failure: (json, info) => {
            console.log(json, info)
            showWarning(`Algo salió mal al empezar a operar en ${coin.symbol}`);
          },
        });
        const { id_operation } = operationOpen;
        if (!id_operation) {
          showWarning(`No se encontro la operacion abierta en ${coin.symbol}`, {
            operationOpen,
            id_coin: coin.id,
          });
          return;
        }
        const {
          //
          all_ok: all_okSell,
          ...rest
        } = await HTTPPOST_EXCHANGE_SELL({
          id_operation,
          setError: setErrorCoinOperate,
          willEnd,
          successful: (json, info) => {
            console.log(json, info)
            showSuccess(`Se vendio (${coin.symbol})`);
          },
          failure: (json, info) => {
            console.log(json, info)
            showWarning(`Algo salió mal al vender en ${coin.symbol}`);
          },
        });
        if (all_okSell) {
          showSuccess(`Se vendio (${coin.symbol})`);
          coinsOperatingList.current = coinsOperatingList.current.filter(
            (c) => c.id !== coin.id
          );
          coinsToDelete.current = coinsToDelete.current.filter(
            (c) => c.id !== coin.id
          );
        } else {
          showWarning(`Algo salió mal al vender en ${coin.symbol}`, rest);
        }
      }

      async function coinStop() {
        await HTTPPUT_COINS_STOP({
          id_coin: coin.id,
          setError: setErrorCoinOperate,
          willEnd,
          successful: (json, info) => {
            showSuccess(`Se detuvo (${coin.symbol})`);
          },
          failure: (json, info) => {
            showWarning(`Algo salió mal al detener en ${coin.symbol}`);
          },
        });
      }
    } catch (err) {
      showError(`Error deteniendo ${coin.symbol}`, err);
      willEnd();
    }

    function willEnd() {
      setActionInProcess(false);
      setUpdateAvailable((prev) => !prev);
    }
  }

  render() {
    const { coinsOperatingList, coinsToDelete, actionInProcess } = this.props;
    return (
      <PaperP
        elevation={3}
        sx={{
          width: "100%",
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          p: 2,
        }}
      >
        {coinsOperatingList.current.length === 0 ? (
          <span style={{ color: "#888", fontSize: 14 }}>
            No hay monedas en operación.
          </span>
        ) : (
          coinsOperatingList.current.map((option, index) => {
            const symbol = global.getCoinKey(option);
            const isPendingDelete = coinsToDelete.current.some(
              (c) => global.getCoinKey(c) === symbol
            );
            return (
              <Tooltip
                key={`tooltip-${symbol}-${index}`}
                title={isPendingDelete ? "Pronto dejará de ser operada" : ""}
              >
                <Chip
                  label={symbol}
                  onDelete={(e) => this.handleCoinDelete(e, option)}
                  disabled={isPendingDelete || actionInProcess}
                  color={isPendingDelete ? "cancel" : "primary"}
                  style={{ color: !isPendingDelete ? "white" : undefined }}
                  deleteIcon={
                    isPendingDelete ? (
                      <CircularProgress size="20px" color="white" />
                    ) : (
                      <DoDisturbOnIcon style={{ color: "white" }} />
                    )
                  }
                  sx={{ m: 0.5 }}
                />
              </Tooltip>
            );
          })
        )}
      </PaperP>
    );
  }
}
