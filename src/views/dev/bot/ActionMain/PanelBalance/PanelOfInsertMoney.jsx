import React, { useState } from "react";
import { Typography, TextField, Slider, Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { http_put_update_investment } from "@api/mocks";
import { showSuccess, showWarning } from "@templates";
import { PaperP } from "@components/containers";
import { TooltipNoPointerEvents } from "@recurrent";

export default function PanelOfInsertMoney({
  inputValue,
  setInputValue,
  setSliderExp,
  sliderExp,
  valuetext,
  marks,
}) {
  const [updating, setUpdating] = useState(false);
  const { driverParams } = global;

  return (
    <PaperP
      className="d-center"
      p_min="5"
      p_max="10"
      sx={{ width: "100%", height: "100%" }}
    >
      <div className="d-flex flex-column gap-5px" style={{ width: "100%" }}>
        <Typography variant="caption" color="text.secondary">
          Insertar Dinero
        </Typography>
        <TextField
          type="number"
          label="USD"
          variant="outlined"
          size="small"
          inputProps={{
            min: 10,
            max: 100000,
            step: 1,
            pattern: "[0-9]*",
            inputMode: "numeric",
          }}
          value={inputValue}
          onChange={(e) => {
            const v = Math.floor(Number(e.target.value));
            const b = Math.min(100000, Math.max(10, v));
            setInputValue(b);
            setSliderExp(Math.log10(b));
          }}
          sx={{ mt: 1, width: "100%" }}
        />
        <div className="d-center">
          <Slider
            aria-label="Custom marks"
            value={sliderExp}
            getAriaValueText={valuetext}
            min={1}
            max={5}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={valuetext}
            marks={marks}
            onChange={(e, expVal) => {
              setSliderExp(expVal);
              const m = Math.round(10 ** expVal);
              setInputValue(m);
            }}
            sx={{
              width: "80%",
              mt: 2,
              "& .MuiSlider-mark": { width: 4, height: 4 },
              "& .MuiSlider-markLabel": { fontSize: "0.65rem" },
            }}
          />
        </div>
        <div style={{ marginTop: 8, textAlign: "right" }}>
          <TooltipNoPointerEvents title="Invertir">
            <Button
              variant="contained"
              size="small"
              startIcon={<AttachMoneyIcon />}
              disabled={updating || !inputValue}
              onClick={() => {
                const coin_id = driverParams.get("id_coin");
                http_put_update_investment({
                  coin_id,
                  new_value: inputValue,
                  failure: (error) => {
                    showWarning("Error al invertir");
                  },
                  successful: (data) => {
                    showSuccess("Inversión exitosa");
                  },
                  willStart: () => {
                    setUpdating(true);
                  },
                  willEnd: () => {
                    setUpdating(false);
                  },
                });
              }}
            >
              Invertir
            </Button>
          </TooltipNoPointerEvents>
        </div>
      </div>
    </PaperP>
  );
}
