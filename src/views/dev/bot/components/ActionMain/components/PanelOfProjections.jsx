import React, { Component } from "react";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import { Chip } from "@mui/material";
import Typography from "@mui/material/Typography";

import {
  getThemeLuminance,
  getNumberFormat,
  TooltipGhost,
  PaperP,
  WaitSkeleton,
} from "@jeff-aporta/camaleon";
import { driverPanelBalance } from "./PanelBalance.driver.js";
import { driverPanelOfProjections } from "./PanelOfProjections.driver.js";

function getPriceProjectionIcon(diff) {
  if (diff > 0) {
    return <TrendingUpIcon fontSize="small" />;
  }
  if (diff < 0) {
    return <TrendingDownIcon fontSize="small" />;
  }
  return <TrendingFlatIcon fontSize="small" />;
}

export default class PanelOfProjections extends Component {
  componentDidMount() {
    driverPanelOfProjections.addLinkCoinMetric(this);
    driverPanelBalance.addLinkLoadingCoinMetric(this);
  }

  componentWillUnmount() {
    driverPanelOfProjections.removeLinkCoinMetric(this);
    driverPanelBalance.removeLinkLoadingCoinMetric(this);
  }

  render() {
    const coinMetrics = driverPanelOfProjections.getCoinMetric();
    const {
      current_price: currentPrice,
      projected_price: projectedPrice,
      total_bought: totalBought,
      roi_real: roiReal,
      roi_proy: roiProy,
      clase = "D",
      etiqueta,
    } = coinMetrics;

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

    const displayedRoi = [roiProy, roiReal][+hasReal];

    return (
      <WaitSkeleton loading={driverPanelBalance.getLoadingCoinMetric()}>
        <div className="flex wrap align-center space-between gap-5px ncols-3">
          <ActualUSD />

          <ProjectUSD />

          <ROICard
            roi={displayedRoi}
            isReal={hasReal}
            totalBought={totalBought}
            clase={clase}
            etiqueta={etiqueta}
          />
        </div>
      </WaitSkeleton>
    );

    function ProjectUSD() {
      return (
            <PriceCard
              title="Proyectado USD"
              value={projectedPrice}
              value2={currentPrice}
              icon={getPriceProjectionIcon(projectedPrice - currentPrice)}
              color={color}
              tooltip={`Proyectado USD: ${getNumberFormat().toCoinDifference(
                projectedPrice,
                currentPrice
              )}`}
            />
      );
    }

    function ActualUSD() {
      return (
        <PriceCard
          title="Actual USD"
          value={currentPrice}
          value2={projectedPrice}
          color={color}
          tooltip={`Actual USD: ${getNumberFormat().toCoinDifference(
            currentPrice,
            projectedPrice
          )}`}
        />
      );
    }
  }
}

class PriceCard extends Component {
  render() {
    const { title, value, value2, icon, color, tooltip } = this.props;
    return (
      <TooltipGhost title={tooltip}>
        <PaperP pad="small" className="flex col-direction cell" elevation={3}>
          <Typography
            color="text.secondary"
            variant="caption"
            component="div"
            className="op-50"
            style={{ marginTop: "-5px" }}
          >
            <small>
              <small>
                <small>{title}</small>
              </small>
            </small>
          </Typography>
          <Typography color={color} variant="caption">
            <small className="nowrap flex align-center">
              {icon && <>{icon}&nbsp;&nbsp;</>}
              {value != null
                ? getNumberFormat().toCoinDifference(value, value2)
                : "---"}
            </small>
          </Typography>
        </PaperP>
      </TooltipGhost>
    );
  }
}

// Tarjeta de ROI
class ROICard extends Component {
  render() {
    const { roi, isReal = false, totalBought, clase, etiqueta } = this.props;
    const valid = !!roi && typeof roi === "number" && !isNaN(roi);
    const displayText = (() => {
      if (valid) {
        return `${+roi.toFixed(2)}%`;
      }
      return "---";
    })();
    const label = "ROI " + (valid ? (isReal ? "Real" : "Proyectado") : "");
    const computedColor = (() => {
      // Color según ROI proyectado (abierta) o real (cerrada)
      if (roi === 0) {
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
          pad="small"
          className="flex p-relative op-50 cell"
          elevation={5}
          sx={{ opacity: cardOpacity, minWidth: "100px" }}
        >
          <ClaseROI />
          <ContentText />
        </PaperP>
      </TooltipGhost>
    );

    function ContentText() {
      return (
        <div>
          <LabelROI />
          <div className="flex align-center gap-5px">
            <ValueROI />
          </div>
        </div>
      );

      function ValueROI() {
        return (
          <div className="flex align-center gap-5px">
            {valid && (
              <CurrencyExchangeIcon
                fontSize="small"
                style={{
                  scale: 0.75,
                }}
              />
            )}
            <Typography variant="caption" color={computedColor}>
              <small>{displayText}</small>
            </Typography>
          </div>
        );
      }

      function LabelROI() {
        return (
          <Typography
            variant="caption"
            color="text.secondary"
            className="mb-5px nowrap op-50"
            component="div"
            style={{
              marginTop: "-10px",
            }}
          >
            <small>
              <small>
                <small>{label}</small>
              </small>
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
                  right: "5px",
                  transform: "scale(0.5)",
                  transformOrigin: "right top",
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
