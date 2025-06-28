import React, { Component } from "react";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import { Chip } from "@mui/material";
import Typography from "@mui/material/Typography";

import { PaperP } from "@jeff-aporta/camaleon";
import { AutoSkeleton } from "@components/controls";

import { fluidCSS } from "@jeff-aporta/camaleon";

import { TooltipGhost } from "@jeff-aporta/camaleon";
import { getThemeLuminance, modelsFormat } from "@jeff-aporta/camaleon";
import { getBalance } from "./PanelOfInsertMoney";

export const panelProjectionsState = {
  coinMetric: {},
  loadingMetrics: false,
  errorMetrics: null,
  priceProjectionValue: 0,
};

export const getCoinMetric = () => {
  return panelProjectionsState.coinMetric;
};

export function getPriceProjectionColor() {
  const { priceProjectionValue } = panelProjectionsState;
  if (priceProjectionValue > 0) {
    return "ok";
  }
  if (priceProjectionValue < 0) {
    return "error";
  }
  return "warning";
}

export function getPriceProjectionIcon(diff) {
  if (diff > 0) {
    return <TrendingUpIcon />;
  }
  if (diff < 0) {
    return <TrendingDownIcon />;
  }
  return <TrendingFlatIcon />;
}

export default class PanelOfProjections extends Component {
  constructor(props) {
    super(props);
    this.isAlive = true;
  }

  // Propiedad de clase para obtener métricas con binding de setState
  fetchMetrics = async () => {
    await window.fetchMetrics((state) => {
      Object.assign(panelProjectionsState, state);
      this.forceUpdate();
    });
  };

  componentDidMount() {
    this.recursiveUpdate();
  }

  recursiveUpdate() {
    if (!this.isAlive) {
      return;
    }
    this.fetchMetrics();
    setTimeout(this.recursiveUpdate, 310000);
  }

  componentWillUnmount() {
    this.isAlive = false;
  }

  render() {
    const { flatNumber } = this.props;

    const { coinMetric, loadingMetrics, errorMetrics } = panelProjectionsState;

    const {
      price_buy: priceBuy,
      current_price: currentPrice,
      projected_price: projectedPrice,
      total_bought: totalBought,
      total_sold: totalSold,
      total_tokens: totalTokens,
      roi_real: roiReal,
      roi_proy: roiProy,
      profit_project: profitProject,
      mensaje,
      clase = "D",
      etiqueta,
    } = coinMetric;

    // Colores semáforo
    const color = (() => {
      const diff = projectedPrice - currentPrice;
      if (diff > 0) {
        return "ok";
      }
      if (diff < 0) {
        return "error";
      }
      return "warning";
    })();
    const hasReal = !!roiReal;

    const displayedRoi = hasReal ? roiReal : roiProy;
    const diffPrice = projectedPrice - currentPrice;

    const tokensIn100usd = currentPrice > 0 ? 100 / currentPrice : 0;
    const projectedGain =
      projectedPrice != null && currentPrice > 0
        ? (projectedPrice - currentPrice) * tokensIn100usd
        : 0;

    return (
      <PaperP className="d-inline-center">
        <div className="flex col-direction gap-10px">
          <div className="flex align-center space-between gap-10px">
            <PriceProjectionCard
              priceProjection={projectedPrice}
              currentPrice={currentPrice}
              projectionColor={color}
              actualColor={color}
              loading={loadingMetrics}
            />
            <ROICard
              roi={displayedRoi}
              isReal={hasReal}
              loading={loadingMetrics}
              totalBought={totalBought}
              clase={clase}
              etiqueta={etiqueta}
            />
          </div>
          <ProfitProjCard
            currentPrice={currentPrice}
            projectedPrice={projectedPrice}
            loading={loadingMetrics}
            color={diffPrice > 0 ? "ok" : diffPrice < 0 ? "error" : "warning"}
          />
          {errorMetrics && (
            <Typography style={{ color: "red" }}>
              Error: {errorMetrics}
            </Typography>
          )}
        </div>
      </PaperP>
    );
  }
}

// Tarjetas de precios (proyección y actual)
class PriceProjectionCard extends Component {
  render() {
    const {
      priceProjection,
      currentPrice,
      projectionColor,
      actualColor,
      loading,
    } = this.props;
    if (loading) {
      return (
        <PaperP elevation={3}>
          <AutoSkeleton loading={true} w="50px" h="50px" />
        </PaperP>
      );
    }
    return (
      <PaperP elevation={3} className="p-relative">
        <div className="flex col-direction">
          <TooltipGhost title="Periodo operación: 5 Minutos">
            <Chip
              size="small"
              label="5 Minutos"
              variant="filled"
              color="primary"
              className="p-absolute"
              style={{
                top: "5px",
                right: 0,
                transform: "scale(0.6)",
                transformOrigin: "right top",
                color: getThemeLuminance() === "dark" ? "white" : "black",
              }}
            />
          </TooltipGhost>
          <Typography
            variant="caption"
            color="text.secondary"
            className="nowrap"
          >
            <small>Precio</small>
          </Typography>
          <div className="flex align-center gap-5px">
            <TooltipGhost
              title={`Actual USD: ${modelsFormat.format.number.toCoinDifference(
                currentPrice,
                priceProjection
              )}`}
            >
              <span>
                <PriceCard
                  title="Actual USD"
                  value={currentPrice}
                  value2={priceProjection}
                  color={actualColor}
                  loading={loading}
                />
              </span>
            </TooltipGhost>
            <TooltipGhost
              title={`Proyectado USD: ${modelsFormat.format.number.toCoinDifference(
                priceProjection,
                currentPrice
              )}`}
            >
              <span>
                <PriceCard
                  title="Proyectado USD"
                  value={priceProjection}
                  value2={currentPrice}
                  icon={getPriceProjectionIcon(priceProjection - currentPrice)}
                  color={projectionColor}
                  loading={loading}
                />
              </span>
            </TooltipGhost>
          </div>
        </div>
      </PaperP>
    );
  }
}

class PriceCard extends Component {
  render() {
    const { title, value, value2, icon, color, loading } = this.props;
    if (loading) {
      return (
        <PaperP p_min={2} p_max={10} className="flex-col">
          <AutoSkeleton loading width="100%" height="50px" />
        </PaperP>
      );
    }
    return (
      <PaperP p_min={2} p_max={10} className="flex-col">
        <Typography color="text.secondary" variant="caption">
          <small>{title}</small>
        </Typography>
        <Typography color={color} variant="caption">
          <span className="nowrap flex align-center">
            {icon && <>{icon}&nbsp;&nbsp;</>}
            {value != null
              ? modelsFormat.format.number.toCoinDifference(value, value2)
              : "---"}
          </span>
        </Typography>
      </PaperP>
    );
  }
}

class ProfitProjCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.balance = 0;
    this.isAlive = true;
  }

  componentDidMount() {
    this.updateRecursively();
  }

  componentWillUnmount() {
    this.isAlive = false;
  }

  updateRecursively() {
    if (!this.isAlive) {
      return;
    }
    const balance = getBalance();
    if (this.balance != balance) {
      this.balance = balance;
      this.forceUpdate();
    }
    setTimeout(() => this.updateRecursively(), 1000);
  }

  render() {
    const { currentPrice, projectedPrice, loading, color } = this.props;
    if (loading) {
      return (
        <PaperP
          className={`flex ${fluidCSS()
            .ltX(480, { width: "calc(33% - 5px)" })
            .end()}`}
          elevation={3}
        >
          <AutoSkeleton loading={true} w="100%" h="80px" />
        </PaperP>
      );
    }
    const projectedGainUSD = this.calculateProjectedGain(
      this.balance,
      currentPrice,
      projectedPrice
    );
    const valueProfitProjected = projectedGainUSD.toFixed(2);
    const labelTitle = "Beneficio estimado";

    return (
      <PaperP
        className={`flex ${fluidCSS()
          .ltX(480, { width: "calc(33% - 5px)" })
          .end()}`}
        elevation={3}
      >
        <div className="flex col-direction gap-10px">
          <TooltipGhost
            title={
              !!projectedGainUSD &&
              `${labelTitle}: ${valueProfitProjected} USD por cada ${this.balance} USD`
            }
          >
            <Typography
              variant="caption"
              color="text.secondary"
              className="mb-5px nowrap"
            >
              {labelTitle} ({this.balance} USD)
            </Typography>
            <Typography color={color}>
              {["---", `${valueProfitProjected} USD`][+!!projectedGainUSD]}
            </Typography>
          </TooltipGhost>
        </div>
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

// Tarjeta de ROI
class ROICard extends Component {
  render() {
    const {
      roi,
      isReal = false,
      loading,
      totalBought,
      clase,
      etiqueta,
    } = this.props;
    if (loading) {
      return (
        <PaperP
          className={`d-center ${fluidCSS()
            .ltX(480, { width: "calc(33% - 5px)" })
            .end()}`}
          elevation={3}
        >
          <AutoSkeleton loading={true} w="50px" h="50px" />
        </PaperP>
      );
    }
    const valid = !!roi && typeof roi === "number" && !isNaN(roi);
    const displayText = valid ? `${roi.toFixed(2)}%` : "---";
    const label = "ROI " + (valid ? (isReal ? "Real" : "Proyectado") : "");
    const computedColor = (() => {
      // Color según ROI proyectado (abierta) o real (cerrada)
      if (roi == 0) {
        return;
      }
      if (!isReal) {
        return roi >= 0 ? "warning" : "error";
      }
      return roi >= 0 ? "success" : "warning";
    })();
    const cardOpacity = valid ? 1 : 0.5;
    return (
      <TooltipGhost
        title={(() => {
          if (!totalBought) {
            return "No hay compra";
          }
          if (!valid) return "ROI no válido";
          return `${label}: ${displayText} (${clase})`;
        })()}
      >
        <PaperP
          className={`flex align-stretch p-relative`}
          elevation={3}
          sx={{ opacity: cardOpacity, minWidth: "100px" }}
        >
          <ClaseROI />
          <ContentText />
        </PaperP>
      </TooltipGhost>
    );

    function ContentText() {
      return (
        <div className="flex col-direction justify-space-evenly gap-5px">
          <LabelROI />
          <div className="flex align-center gap-5px">
            <ValueROI />
          </div>
        </div>
      );

      function ValueROI() {
        return (
          <>
            {valid && <CurrencyExchangeIcon fontSize="small" />}
            <Typography variant="caption" color={computedColor}>
              {displayText}
            </Typography>
          </>
        );
      }

      function LabelROI() {
        return (
          <Typography
            variant="caption"
            color="text.secondary"
            className="mb-5px nowrap"
          >
            <small>
              <small>{label}</small>
            </small>
          </Typography>
        );
      }
    }

    function ClaseROI() {
      return (
        <>
          {!!clase && (
            <TooltipGhost title={etiqueta}>
              <Chip
                label={<span className="metric-label">{clase}</span>}
                size="small"
                variant="filled"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  transform: "scale(0.5)",
                  transformOrigin: "right center",
                  color: getThemeLuminance() === "dark" ? "white" : "black",
                  fontWeight: "bold",
                  backgroundColor: (() => {
                    return (
                      {
                        A: "green",
                        B: "yellow",
                        C: "orange",
                        D: "red",
                      }[clase] ?? "red"
                    );
                  })(),
                }}
              />
            </TooltipGhost>
          )}
        </>
      );
    }
  }
}
