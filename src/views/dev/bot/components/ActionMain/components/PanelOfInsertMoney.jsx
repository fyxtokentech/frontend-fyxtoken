import React, { Component } from "react";
import {
  Typography,
  TextField,
  Slider,
  Button,
  Paper,
  ButtonGroup,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  PaperP,
  fluidCSS,
  showPromptDialog,
  ButtonShyText,
} from "@jeff-aporta/camaleon";
import { TooltipGhost, WaitSkeleton } from "@jeff-aporta/camaleon";

import { driverPanelBalance } from "./PanelBalance.driver.js";
import { driverPanelOfInsertMoney } from "./PanelOfInsertMoney.driver.js";
import { driverPanelOfProjections } from "./PanelOfProjections.driver.js";

const marks = [
  { value: driverPanelBalance.MIN_LOG10_VALUE_USD, label: "5" },
  { value: 2, label: "100" },
  { value: 3, label: "1k" },
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
  }

  componentDidMount() {
    driverPanelBalance.addLinkLimitUSDTBuy(this);
    driverPanelBalance.addLinkDefaultUSDTBuy(this);
    driverPanelBalance.addLinkLoadingCoinMetric(this);
  }

  componentWillUnmount() {
    driverPanelBalance.removeLinkLimitUSDTBuy(this);
    driverPanelBalance.removeLinkDefaultUSDTBuy(this);
    driverPanelBalance.removeLinkLoadingCoinMetric(this);
  }

  handleInputChange(e) {
    driverPanelBalance.setDefaultUSDTBuy(
      driverPanelBalance.clamp2DefaultUSDTBuy(+e.target.value)
    );
  }

  handleSliderChange(e, expVal) {
    if (
      !driverPanelBalance
        .getDelayerDefaultUSDTBuy()
        .isReady(() => this.handleSliderChange(e, expVal))
    ) {
      return;
    }
    console.log(Math.round(10 ** expVal));
    driverPanelBalance.setDefaultUSDTBuy(Math.round(10 ** expVal));
  }

  render() {
    const { limit, limitLog10 } = driverPanelBalance.getCurrencyLimitUSDTBuy();
    let marks_temp = JSON.parse(JSON.stringify(marks));
    let f = marks_temp.find(({ value }) => value == limitLog10);
    if (!f) {
      f = {
        value: limitLog10,
        label: (() => {
          return (
            searchFactor(1_000_000, "M") ||
            searchFactor(1_000, "k") ||
            Math.ceil(limit).toString()
          );

          function searchFactor(factor, unit) {
            console.log({ limit, factor });
            if (limit >= factor) {
              const den = limit / factor;

              const conservarDecimales = (() => {
                let decimales = den % 1;
                if (decimales > 0.5) {
                  decimales = 1 - decimales;
                }
                return decimales >= 0.1;
              })();
              if (!conservarDecimales) {
                return Math.floor(den) + unit;
              }
              return +den.toFixed(1) + unit;
            }
          }
        })(),
      };
      marks_temp.push(f);
      marks_temp = marks_temp.sort((a, b) => a.value - b.value);
    }
    marks_temp = marks_temp.filter(({ value }) => value <= f.value);
    const indexF = marks_temp.findIndex(({ value }) => value == limitLog10);
    const prev = marks_temp[indexF - 1];
    if (prev) {
      const diff = prev.value - f.value;
      console.log({ diff, prev, f });
      if (diff && Math.abs(diff) < 0.1 + limitLog10 / 22) {
        prev.label = "";
      }
    }
    return (
      <PaperP style={{ minWidth: "250px" }}>
        <WaitSkeleton loading={driverPanelBalance.getLoadingCoinMetric()}>
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
              <ButtonGroup variant="contained" size="small">
                <this.buttonAssignDefaultUSD />
                <this.buttonAssignLimitUSD />
              </ButtonGroup>
            </div>
            <div
              className="inline-flex justify-center align-center"
              style={{ width: "95%", margin: "auto" }}
            >
              <Slider
                aria-label="Custom marks"
                value={driverPanelBalance.getLog10DefaultUSDTBuy()}
                getAriaValueText={valueText}
                min={driverPanelBalance.MIN_LOG10_VALUE_USD}
                max={limitLog10}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={valueText()}
                marks={marks_temp}
                onChange={(e, n) => this.handleSliderChange(e, n)}
                sx={{
                  "& .MuiSlider-mark": { width: 4, height: 4 },
                  "& .MuiSlider-markLabel": { fontSize: "0.65rem" },
                }}
              />
            </div>
            <ProfitProjCard />
          </div>
        </WaitSkeleton>
      </PaperP>
    );
  }

  buttonAssignLimitUSD() {
    return (
      <ButtonShyText
        color="d1"
        tooltip="Configurar límite de compra"
        startIcon={<SettingsIcon fontSize="small" />}
        onClick={async () => {
          const { value } = await showPromptDialog({
            title: "Configurar límite de compra",
            description: "Ingrese el límite máximo de compra en USD",
            input: "number",
            label: "Límite (USD)",
            positive: true,
            max: driverPanelBalance.MAX_VALUE_USDT,
            value: driverPanelBalance.getLimitUSDTBuy(),
            onValidate: (value) => {
              return ["Ingrese un número válido", true][
                +Number.isFinite(+value)
              ];
            },
          });
          if (value !== undefined) {
            driverPanelOfInsertMoney.handleAssingNewLimit(value);
          }
        }}
      >
        Límite
      </ButtonShyText>
    );
  }

  buttonAssignDefaultUSD() {
    const RETURN = class extends Component {
      componentDidMount() {
        driverPanelOfInsertMoney.addLinkWaitInvestment(this);
      }
      componentWillUnmount() {
        driverPanelOfInsertMoney.removeLinkWaitInvestment(this);
      }
      render() {
        return (
          <ButtonShyText
            startIcon={<AttachMoneyIcon fontSize="small" />}
            disabled={driverPanelOfInsertMoney.getWaitInvestment()}
            onClick={() => driverPanelOfInsertMoney.handleInvest()}
          >
            Asignar
          </ButtonShyText>
        );
      }
    };
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
