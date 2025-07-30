import React, { Component } from "react";
import { Typography, TextField, Slider, Button, Paper } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { PaperP, fluidCSS } from "@jeff-aporta/camaleon";
import { TooltipGhost } from "@jeff-aporta/camaleon";

import { driverPanelBalance } from "./PanelBalance.driver.js";
import { driverPanelOfInsertMoney } from "./PanelOfInsertMoney.driver.js";
import { driverPanelOfProjections } from "./PanelOfProjections.driver.js";

const MAX_VALUE_INVERSION = 1000000;

const marks = [
  { value: 1, label: "10" },
  { value: 2, label: "100" },
  { value: 3, label: "1000" },
  { value: 4, label: "10k" },
  { value: 5, label: "100k" },
  { value: 6, label: "1M" },
];

export const valueText = () => {
  return driverPanelBalance.getDefaultUSDTBuy() + " USD";
};

export default class PanelOfInsertMoney extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  componentDidMount() {
    driverPanelBalance.addLinkDefaultUSDTBuy(this);
  }

  componentWillUnmount() {
    driverPanelBalance.removeLinkDefaultUSDTBuy(this);
  }

  handleInputChange(e) {
    let b = driverPanelBalance.clamp2DefaultUSDTBuy(+e.target.value);
    driverPanelBalance.setDefaultUSDTBuy(b);
  }

  handleSliderChange(e, expVal) {
    driverPanelBalance.setDefaultUSDTBuy(Math.round(10 ** expVal));
  }

  render() {
    const maxInvestLog10 = Math.log10(MAX_VALUE_INVERSION);
    const limitMaxLog10 = Math.min(
      Math.log10(driverPanelBalance.getLimitUSDTBuy()),
      maxInvestLog10
    );
    return (
      <PaperP style={{ minWidth: "250px" }}>
        <div className="flex col-direction gap-10px">
          <Typography variant="caption" color="secondary">
            <small className="underline">Inversión</small>
          </Typography>
          <div className="flex align-center gap-10px">
            <TextField
              type="number"
              label="USD"
              variant="outlined"
              size="small"
              inputProps={{
                min: driverPanelBalance.getMin2DefaultUSDTBuy(),
                max: driverPanelBalance.getMax2DefaultUSDTBuy(),
                step: 1,
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
              value={driverPanelBalance.getDefaultUSDTBuy()}
              onChange={this.handleInputChange}
              sx={{ mt: 1, width: "100%" }}
            />
            <TooltipGhost title="Invertir">
              <span>{this.buttonAssign()}</span>
            </TooltipGhost>
          </div>
          <div
            className="inline-flex justify-center align-center"
            style={{ width: "95%", margin: "auto" }}
          >
            <Slider
              aria-label="Custom marks"
              value={driverPanelBalance.getLog10DefaultUSDTBuy()}
              getAriaValueText={valueText}
              min={1}
              max={limitMaxLog10}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={valueText()}
              marks={marks.filter((mark) => {
                return mark.value <= limitMaxLog10;
              })}
              onChange={this.handleSliderChange}
              sx={{
                "& .MuiSlider-mark": { width: 4, height: 4 },
                "& .MuiSlider-markLabel": { fontSize: "0.65rem" },
              }}
            />
          </div>
          <ProfitProjCard />
        </div>
      </PaperP>
    );
  }

  buttonAssign() {
    const RETURN = class extends Component {
      componentDidMount() {
        driverPanelOfInsertMoney.addLinkWaitInvestment(this);
      }
      componentWillUnmount() {
        driverPanelOfInsertMoney.removeLinkWaitInvestment(this);
      }
      render() {
        return (
          <Button
            variant="contained"
            size="small"
            startIcon={<AttachMoneyIcon fontSize="small" />}
            disabled={driverPanelOfInsertMoney.getWaitInvestment()}
            onClick={() => driverPanelOfInsertMoney.handleInvest()}
          >
            Asignar
          </Button>
        );
      }
    }
    return <RETURN />;
  }
}

class ProfitProjCard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    driverPanelBalance.addLinkDefaultUSDTBuy(this);
    driverPanelBalance.addLinkLimitUSDTBuy(this);
  }

  componentWillUnmount() {
    driverPanelBalance.removeLinkDefaultUSDTBuy(this);
    driverPanelBalance.removeLinkLimitUSDTBuy(this);
  }

  render() {
    const {
      current_price: currentPrice, //
      projected_price: projectedPrice,
    } = driverPanelOfProjections.getCoinMetric();

    const diffPrice = projectedPrice - currentPrice;

    const color = [["warning", "error"][+(diffPrice < 0)], "ok"][
      +(diffPrice > 0)
    ];

    const projectedGainUSD = this.calculateProjectedGain(
      driverPanelBalance.getDefaultUSDTBuy(),
      currentPrice,
      projectedPrice
    );
    const valueProfitProjected = projectedGainUSD.toFixed(2);
    const labelTitle = "Beneficio estimado";

    return (
      <PaperP p_min={2} p_max={5} elevation={3}>
        <TooltipGhost
          title={
            !!projectedGainUSD &&
            `${labelTitle}: ${valueProfitProjected} USD por cada ${driverPanelBalance.getDefaultUSDTBuy()} USD`
          }
        >
          <div>
            <Typography
              variant="caption"
              color="text.secondary"
              className="mb-5px nowrap"
            >
              <small>
                {labelTitle} ({driverPanelBalance.getDefaultUSDTBuy()} USD)
              </small>
            </Typography>
            <br />
            <Typography color={color} variant="caption">
              {["---", `${valueProfitProjected} USD`][+!!projectedGainUSD]}
            </Typography>
          </div>
        </TooltipGhost>
      </PaperP>
    );
  }

  // Calcula ganancia proyectada para un monto dado (USD)
  calculateProjectedGain(amountUSD, currentPrice, projectedPrice) {
    if (!projectedPrice || currentPrice <= 0) {
      return 0;
    }
    const tokens = amountUSD / currentPrice;
    const diffProfit = projectedPrice - currentPrice;
    return diffProfit * tokens;
  }
}
