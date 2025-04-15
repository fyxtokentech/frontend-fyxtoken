import React, { useState, useEffect } from "react";
import { Tooltip, Chip, Autocomplete, TextField } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import PendingIcon from "@mui/icons-material/Pending";
import { PaperP } from "@containers";

export default function CoinSelection({ coins, setCoins }) {
  // State for deletion handling
  const [coinsToDelete, setCoinsToDelete] = useState([]);
  const [deletionTimers, setDeletionTimers] = useState([]);
  const availableCoins =
    coins.length >= 3
      ? []
      : [
          { title: "BTC", symbol: "BTC" },
          { title: "ETH", symbol: "ETH" },
          { title: "BNB", symbol: "BNB" },
          { title: "SOL", symbol: "SOL" },
          { title: "ADA", symbol: "ADA" },
          { title: "DOT", symbol: "DOT" },
        ].filter((coin) => !coins.some((c) => c.title === coin.title));

  // Actualizar cuando coins cambie desde ActionMain
  useEffect(() => {
    setCoins(coins);
  }, [coins]);

  // Handle coin deletion
  const handleCoinDelete = (event, coin) => {
    event.preventDefault();
    setCoinsToDelete((prev) => [...prev, coin]);

    const timer = setTimeout(() => {
      // Remove the coin from the list
      setCoins((prev) => {
        const index = prev.findIndex((c) => c.title === coin.title);
        if (index !== -1) {
          const newCoins = [...prev];
          newCoins.splice(index, 1);
          return newCoins;
        }
        return prev;
      });

      // Remove from deletion queue
      setCoinsToDelete((prev) => prev.filter((c) => c.title === coin.title));

      // Simulate API call and remove from available coins
      deleteCoinFromAPI(coin);
    }, 2000);

    setDeletionTimers((prev) => [...prev, timer]);
  };

  // Function to simulate coin deletion
  const deleteCoinFromAPI = (coin) => {
    // Simulate API call with a delay
    setTimeout(() => {
      console.log(`Simulando eliminación de moneda ${coin.symbol}`);

      setCoins((prev) => prev.filter((c) => c.title !== coin.title));
      setCoinsToDelete((prev) => prev.filter((c) => c.title !== coin.title));
    }, 1000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      deletionTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [deletionTimers]);

  return (
    <PaperP elevation={3} sx={{ width: "100%" }}>
      <Autocomplete
        multiple
        id="coins-selection"
        options={availableCoins}
        getOptionLabel={(option) => option.title}
        value={coins}
        limitTags={3}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Monedas en operación"
            placeholder={coins.length >= 3 ? "" : "Selecciona hasta 3 monedas"}
            onKeyPress={(e) => coins.length >= 3 && e.preventDefault()}
          />
        )}
        onChange={(event, newValue) => {
          setCoins(newValue);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const isPendingDelete = coinsToDelete.some(
              (coin) => coin.title === option.title
            );
            const props = getTagProps({ index });

            // Extract key from props
            const { key: chipKey, ...chipProps } = props;

            return (
              <Tooltip
                key={`tooltip-${option.title}-${index}`}
                title={isPendingDelete ? "Pronto dejará de ser operada" : ""}
              >
                <Chip
                  key={chipKey}
                  {...chipProps}
                  label={option.title}
                  onDelete={(event) => handleCoinDelete(event, option)}
                  color={isPendingDelete ? "cancel" : "primary"}
                  style={{
                    color: !isPendingDelete ? "white" : "inherit",
                  }}
                  deleteIcon={
                    isPendingDelete ? (
                      <PendingIcon style={{ color: "white" }} />
                    ) : (
                      <BackspaceIcon style={{ color: "white" }} />
                    )
                  }
                />
              </Tooltip>
            );
          })
        }
        key={"default"}
      />
    </PaperP>
  );
}
