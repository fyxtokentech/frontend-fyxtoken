import React from "react";
import { Typography, TextField, Slider } from "@mui/material";
import { PaperP } from "@components/containers";

export default function PanelOfInsertMoney({
  inputValue,
  setInputValue,
  setSliderExp,
  sliderExp,
  valuetext,
  marks,
}) {
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
      </div>
    </PaperP>
  );
}