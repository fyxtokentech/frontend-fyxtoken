import React, { Component } from "react";
import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";
import { PaperP } from "@containers";
import { putResponse } from "@api/requestTable";

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
    const { coinsToDelete, setUpdateAvailable, setActionInProcess } =
      this.props;
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
      putResponse({
        buildEndpoint: ({ baseUrl }) =>{
          return `${baseUrl}/coins/stop/${user_id}/${coin.id}`;
        },
        setError: setErrorCoinOperate,
        willEnd,
      });
      coinsOperatingList.current = coinsOperatingList.current.filter(
        (c) => c.id !== coin.id
      );
      coinsToDelete.current = coinsToDelete.current.filter(
        (c) => c.id !== coin.id
      );
    } catch (err) {
      console.error("Error deteniendo moneda:", err);
      coinsToDelete.current = coinsToDelete.current.filter(
        (c) => c.id !== coin.id
      );
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
