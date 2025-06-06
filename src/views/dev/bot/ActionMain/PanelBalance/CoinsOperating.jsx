import React, { Component } from "react";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";

import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import { PaperP } from "@containers";
import {
  http_get_operation_open,
  http_post_exchange_operation_sell,
  http_put_coin_stop,
} from "@api/mocks";

import { showSuccess, showWarning, showError } from "@templates";

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
      setActionInProcess,
    } = this.props;
    coinsToDelete.current = [...coinsToDelete.current, coin];
    setActionInProcess(true);
    setUpdateAvailable((prev) => !prev);
    setTimeout(() => {
      this.deleteCoinFromAPI(coin);
    });
  }

  // Function to stop coin
  async deleteCoinFromAPI(coin) {
    const {
      user_id,
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
        await http_get_operation_open({
          id_coin: coin.id,
          setApiData: ([data]) => {
            if (!data) {
              return;
            }
            Object.assign(operationOpen, data);
          },
          setError: setErrorCoinOperate,
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
        } = await http_post_exchange_operation_sell({
          id_operation,
          setError: setErrorCoinOperate,
          willEnd,
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
        const { all_ok: all_okStop, ...rest } = await http_put_coin_stop({
          id_coin: coin.id,
          setError: setErrorCoinOperate,
          willEnd,
        });
        if (!all_okStop) {
          showWarning(`Algo salió mal al detener en ${coin.symbol}`, rest);
        }
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
