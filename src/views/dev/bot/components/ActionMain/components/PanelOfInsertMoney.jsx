import React, { useState } from "react";
import { Typography, TextField, Slider, Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { HTTPPUT_USEROPERATION_INVESTMEN } from "@api";
import {
  showSuccess,
  showWarning,
  PaperP,
  driverParams,
} from "@jeff-aporta/camaleon";
import { TooltipGhost } from "@jeff-aporta/camaleon";

let _balance_ = 10;
const MAX_VALUE_INVERSION = 1000000;

export const getBalance = () => _balance_;

const marks = [
  { value: 1, label: "10" },
  { value: 2, label: "100" },
  { value: 3, label: "1.000" },
  { value: 4, label: "10k" },
  { value: 5, label: "100k" },
  { value: 6, label: "1M" },
];

export const vars_PanelOfInsertMoney = {
  inputValue: 100,
  sliderExp: Math.log10(100),
};

export const valueText = () => {
  return vars_PanelOfInsertMoney.inputValue + " USD";
};

let _PanelOfInsertMoney_;

export const changeValueInsertMoney = (value) => {
  if (!value) {
    return;
  }
  value = +Math.max(10, value);
  vars_PanelOfInsertMoney.inputValue = value;
  vars_PanelOfInsertMoney.sliderExp = Math.log10(value);
  _PanelOfInsertMoney_.forceUpdate();
};

export default class PanelOfInsertMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = { updating: false };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleInvest = this.handleInvest.bind(this);
    _PanelOfInsertMoney_ = this;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prev) => ({
        priceProjectionValue:
          prev.priceProjectionValue + 1 > 3
            ? -3
            : prev.priceProjectionValue + 1,
      }));
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleInputChange(e) {
    const { setInputValue, setSliderExp } = this.props;
    const v = Math.floor(Number(e.target.value));
    let b = Math.min(MAX_VALUE_INVERSION, Math.max(0, v));
    if (b) {
      b = parseInt(b);
      setInputValue(b);
    } else {
      setInputValue("");
    }
    setSliderExp(Math.log10(b));
  }

  handleSliderChange(e, expVal) {
    const { setInputValue, setSliderExp } = this.props;
    setSliderExp(expVal);
    const m = Math.round(10 ** expVal);
    setInputValue(m);
  }

  handleInvest() {
    this.setState({ updating: true });
    const coin_id = driverParams.get("id_coin")[0];
    HTTPPUT_USEROPERATION_INVESTMEN({
      coin_id,
      new_value: vars_PanelOfInsertMoney.inputValue,
      failure: (error) => {
        showWarning("Error al invertir");
        this.setState({ updating: false });
      },
      successful: (data) => {
        showSuccess("Inversión exitosa");
        this.setState({ updating: false });
      },
      willStart: () => {
        this.setState({ updating: true });
      },
      willEnd: () => {
        this.setState({ updating: false });
      },
    });
  }

  render() {
    _balance_ = +vars_PanelOfInsertMoney.inputValue;
    return (
      <PaperP style={{ minWidth: "250px" }}>
        <div className="flex col-direction gap-10px">
          <Typography variant="caption" color="secondary">
            Insertar Dinero
          </Typography>
          <TextField
            type="number"
            label="USD"
            variant="outlined"
            size="small"
            inputProps={{
              min: 0,
              max: MAX_VALUE_INVERSION,
              step: 1,
              pattern: "[0-9]*",
              inputMode: "numeric",
            }}
            value={vars_PanelOfInsertMoney.inputValue}
            onChange={this.handleInputChange}
            sx={{ mt: 1, width: "100%" }}
          />
          <div
            className="d-inline-center"
            style={{ width: "95%", margin: "auto" }}
          >
            <Slider
              aria-label="Custom marks"
              value={vars_PanelOfInsertMoney.sliderExp}
              getAriaValueText={valueText}
              min={1}
              max={Math.log10(MAX_VALUE_INVERSION)}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={valueText()}
              marks={marks}
              onChange={this.handleSliderChange}
              sx={{
                "& .MuiSlider-mark": { width: 4, height: 4 },
                "& .MuiSlider-markLabel": { fontSize: "0.65rem" },
              }}
            />
          </div>
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <TooltipGhost title="Invertir">
              <Button
                variant="contained"
                size="small"
                startIcon={<AttachMoneyIcon />}
                disabled={
                  this.state.updating || !vars_PanelOfInsertMoney.inputValue
                }
                onClick={this.handleInvest}
              >
                Invertir
              </Button>
            </TooltipGhost>
          </div>
        </div>
      </PaperP>
    );
  }
}
