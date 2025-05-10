import React, { Component } from "react";
import { PaperP } from "@containers";
import { getResponse } from "@api/requestTable";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import Typography from "@mui/material/Typography";
import { AutoSkeleton } from "@components/controls";
import fluidCSS from "@jeff-aporta/fluidcss";
import { Chip } from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { TooltipNoPointerEvents } from "@recurrent";
import { getThemeLuminance } from "@jeff-aporta/theme-manager";

export default class PanelOfProjections extends Component {
  constructor(props) {
    super(props);
    this.state = { coinMetric: {}, loadingMetrics: false, errorMetrics: null };
    this.fetchMetrics = this.fetchMetrics.bind(this);
  }

  componentDidMount() {
    this.fetchMetrics();
    this.metricsInterval = setInterval(this.fetchMetrics, 310000);
  }

  componentWillUnmount() {
    clearInterval(this.metricsInterval);
  }

  async fetchMetrics() {
    const { user_id } = this.props;
    const { driverParams } = global;
    const id_coin = driverParams.get("id_coin");
    if (!id_coin) return;
    this.setState({ loadingMetrics: true });
    try {
      await getResponse({
        setError: (err) => this.setState({ errorMetrics: err }),
        setLoading: (loading) => this.setState({ loadingMetrics: loading }),
        setApiData: ([data]) => {
          if (!data) {
            console.log("No data received");
            return;
          }
          console.log(data);
          this.setState({ coinMetric: data });
        },
        buildEndpoint: ({ baseUrl }) =>
          `${baseUrl}/coins/metrics/${user_id}/${id_coin}`,
      });
    } catch (err) {
      this.setState({ errorMetrics: err.message });
    } finally {
      this.setState({ loadingMetrics: false });
    }
  }

  render() {
    const { flatNumber } = this.props;
    const { coinMetric, loadingMetrics, errorMetrics } = this.state;
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

    console.log(coinMetric);

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
    const hasReal = (() => {
      if (typeof roiReal !== "number" || isNaN(roiReal)) return false;
      return roiReal >= 0;
    })();
    const colorROI = getROIColor(roiReal, roiProy, hasReal);

    // Cálculo de ganancia proyectada basado en $100
    const tokensIn100usd = currentPrice > 0 ? 100 / currentPrice : 0;
    const projectedGain =
      projectedPrice != null && currentPrice > 0
        ? (projectedPrice - currentPrice) * tokensIn100usd
        : 0;

    const displayedRoi = hasReal ? roiReal : roiProy;
    const diffPrice = projectedPrice - currentPrice;

    return (
      <PaperP
        className="d-center"
        p_min="5"
        p_max="10"
        sx={{ width: "100%", height: "100%" }}
      >
        <div className="d-flex flex-column gap-10px" style={{ width: "100%" }}>
          <div
            className="d-flex ai-center jc-space-between gap-10px"
            style={{ width: "100%" }}
          >
            <PriceProjectionCard
              priceProjection={projectedPrice}
              currentPrice={currentPrice}
              projectionColor={color}
              actualColor={color}
              getPriceProjectionIcon={() =>
                diffPrice > 0 ? (
                  <TrendingUpIcon fontSize="small" />
                ) : diffPrice < 0 ? (
                  <TrendingDownIcon fontSize="small" />
                ) : (
                  <TrendingFlatIcon fontSize="small" />
                )
              }
              loading={loadingMetrics}
            />
            <ROICard
              roi={displayedRoi}
              isReal={hasReal}
              loading={loadingMetrics}
              totalBought={totalBought}
              clase={clase}
              etiqueta={etiqueta}
              color={colorROI}
            />
          </div>
          <ProfitProjCard
            flatNumber={projectedGain.toFixed(2)}
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
function PriceProjectionCard({
  priceProjection,
  currentPrice,
  projectionColor,
  actualColor,
  getPriceProjectionIcon,
  loading,
}) {
  if (loading) {
    return (
      <PaperP elevation={3}>
        <AutoSkeleton loading={true} w="50px" h="50px" />
      </PaperP>
    );
  }
  return (
    <PaperP elevation={3} className="p-relative">
      <div className="d-flex flex-column">
        <TooltipNoPointerEvents title="Periodo operación">
          <Chip
            size="small"
            label="5 Minutos"
            variant="filled"
            color="primary"
            className="p-absolute"
            style={{
              top: "5px",
              right: 0,
              scale: "0.7",
              color: getThemeLuminance() === "dark" ? "white" : "black",
            }}
          />
        </TooltipNoPointerEvents>
        <Typography variant="caption" color="text.secondary" className="nowrap">
          <small>Precio</small>
        </Typography>
        <div className="d-flex ai-center gap-5px">
          <PriceCard
            title="Proyectado USD"
            value={priceProjection}
            value2={currentPrice}
            icon={priceProjection && getPriceProjectionIcon()}
            color={projectionColor}
            loading={loading}
          />
          <PriceCard
            title="Actual USD"
            value={currentPrice}
            value2={priceProjection}
            icon={priceProjection && getPriceProjectionIcon()}
            color={actualColor}
            loading={loading}
          />
        </div>
      </div>
    </PaperP>
  );
}

function PriceCard({ title, value, value2, icon, color, loading }) {
  const { diffNumberFormatCurrent } = window;

  if (loading) {
    return (
      <PaperP elevation={3} p_min={2} p_max={10} className="d-flex-col">
        <AutoSkeleton loading width="100%" height="50px" />
      </PaperP>
    );
  }
  return (
    <PaperP p_min={2} p_max={10} className="d-flex-col">
      <Typography color="text.secondary" variant="caption">
        <small>{title}</small>
      </Typography>
      <Typography color={color} variant="caption">
        <small className="nowrap d-flex ai-center">
          {icon && <>{icon}&nbsp;&nbsp;</>}
          {value != null ? diffNumberFormatCurrent(value, value2) : "---"}
        </small>
      </Typography>
    </PaperP>
  );
}

function ProfitProjCard({ flatNumber: profitValue, loading, color }) {
  if (loading) {
    return (
      <PaperP
        className={`d-flex ${fluidCSS()
          .ltX(480, { width: "calc(33% - 5px)" })
          .end()}`}
        elevation={3}
        p_min="5"
        p_max="10"
      >
        <AutoSkeleton loading={true} w="100%" h="80px" />
      </PaperP>
    );
  }
  const F = +profitValue;
  return (
    <PaperP
      className={`d-flex ${fluidCSS()
        .ltX(480, { width: "calc(33% - 5px)" })
        .end()}`}
      elevation={3}
      p_min="5"
      p_max="10"
    >
      <div className="d-flex flex-column gap-5px">
        <Typography
          variant="caption"
          color="text.secondary"
          className="mb-5px nowrap"
        >
          Beneficio proyectado (100 USD)
        </Typography>
        <Typography color={color}>{["---", `${F} USD`][+!!F]}</Typography>
      </div>
    </PaperP>
  );
}

// Tarjeta de ROI
function ROICard({
  roi,
  isReal = false,
  loading,
  totalBought,
  clase,
  etiqueta,
  color,
}) {
  if (loading) {
    return (
      <PaperP
        className={`d-center ${fluidCSS()
          .ltX(480, { width: "calc(33% - 5px)" })
          .end()}`}
        elevation={3}
        p_min="5"
        p_max="10"
      >
        <AutoSkeleton loading={true} w="50px" h="50px" />
      </PaperP>
    );
  }
  const valid = !!roi && typeof roi === "number" && !isNaN(roi);
  const displayText = valid ? `${(+roi).toFixed(2)}%` : "---";
  const cardOpacity = valid ? 1 : 0.5;
  const label = "ROI " + (valid ? (isReal ? "Real" : "Proyectado") : "");
  return (
    <TooltipNoPointerEvents
      title={(() => {
        if (!totalBought) {
          return "No hay compra";
        }
        if (!valid) return "ROI no válido";
        return `${label}: ${displayText}`;
      })()}
    >
      <PaperP
        className={`d-flex p-relative ${fluidCSS()
          .ltX(480, { width: "calc(33% - 5px)" })
          .end()}`}
        elevation={3}
        p_min="5"
        p_max="10"
        sx={{ opacity: cardOpacity, minWidth: "100px" }}
      >
        <TooltipNoPointerEvents title={etiqueta}>
          <Chip
            label={<span className="metric-label">{clase}</span>}
            size="small"
            variant="filled"
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              transform: "scale(0.7)",
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
        </TooltipNoPointerEvents>
        <div className="d-flex flex-column gap-5px">
          <Typography
            variant="caption"
            color="text.secondary"
            className="mb-5px nowrap"
          >
            {label}
          </Typography>
          <div className="d-flex ai-center gap-5px">
            {valid && <CurrencyExchangeIcon />}
            <span>{displayText}</span>
          </div>
        </div>
      </PaperP>
    </TooltipNoPointerEvents>
  );
}

function getROIColor(roiReal, roiProy, hasReal) {
  if (hasReal) return roiReal >= 0 ? "ok" : "error";
  // proyección de ROI
  return roiProy >= 0 ? "warning" : "error";
}
