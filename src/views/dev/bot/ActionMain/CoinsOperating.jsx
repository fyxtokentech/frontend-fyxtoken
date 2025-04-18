import React, { useState, useEffect } from "react";
import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";
import { PaperP } from "@containers";

export default function CoinsOperating({
  coinsOperatingList,
  coinsToDelete,
  setCoinsToDelete,
  deletionTimers,
  setDeletionTimers,
  forceUpdatePanelBalance,
  onExternalDeleteRef
}) {
  // Permitir llamada externa (desde PanelBalance)
  useEffect(() => {
    if (onExternalDeleteRef) {
      onExternalDeleteRef.current = (coinTitle) => {
        const coin = coinsOperatingList.current.find((c) => c.title === coinTitle);
        if (coin) {
          handleCoinDelete({ preventDefault: () => {} }, coin);
        }
      };
    }
  }, [coinsOperatingList, onExternalDeleteRef]);

  // Handle coin deletion
  const handleCoinDelete = (event, coin) => {
    event.preventDefault();

    coinsToDelete.current = [...coinsToDelete.current, coin];

    const timer = setTimeout(() => {
      deleteCoinFromAPI(coin);
    });

    setDeletionTimers((prev) => [...prev, timer]);
  };

  // Function to simulate coin deletion
  const deleteCoinFromAPI = (coin) => {
    // Simulate API call with a delay
    setTimeout(() => {
      console.log(`Simulando eliminación de moneda ${coin.title}`);
      coinsOperatingList.current = coinsOperatingList.current.filter((c) => c.title !== coin.title);
      coinsToDelete.current = coinsToDelete.current.filter((c) => c.title !== coin.title);
      forceUpdatePanelBalance({});
    }, 5000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      deletionTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [deletionTimers]);

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
          const isPendingDelete = coinsToDelete.current.some(
            (coin) => coin.title === option.title
          );
          return (
            <Tooltip
              key={`tooltip-${option.title}-${index}`}
              title={isPendingDelete ? "Pronto dejará de ser operada" : ""}
            >
              <Chip
                label={option.title}
                onDelete={(event) => handleCoinDelete(event, option)}
                color={isPendingDelete ? "cancel" : "primary"}
                style={{
                  color: !isPendingDelete ? "white" : "inherit",
                }}
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
