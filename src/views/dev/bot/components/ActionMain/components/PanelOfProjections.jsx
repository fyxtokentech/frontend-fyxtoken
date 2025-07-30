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
        <div className="flex wrap align-center space-between gap-5px">
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
        <TooltipGhost
          title={`Proyectado USD: ${getNumberFormat().toCoinDifference(
            projectedPrice,
            currentPrice
          )}`}
        >
          <span>
            <PriceCard
              title="Proyectado USD"
              value={projectedPrice}
              value2={currentPrice}
              icon={getPriceProjectionIcon(projectedPrice - currentPrice)}
              color={color}
            />
          </span>
        </TooltipGhost>
      );
    }

    function ActualUSD() {
      return (
        <TooltipGhost
          title={`Actual USD: ${getNumberFormat().toCoinDifference(
            currentPrice,
            projectedPrice
          )}`}
        >
          <span>
            <PriceCard
              title="Actual USD"
              value={currentPrice}
              value2={projectedPrice}
              color={color}
            />
          </span>
        </TooltipGhost>
      );
    }
  }
}

class PriceCard extends Component {
  render() {
    const { title, value, value2, icon, color } = this.props;
    return (
      <PaperP pad="small" className="flex col-direction" elevation={3}>
        <Typography color="text.secondary" variant="caption">
          <small>{title}</small>
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
    );
  }
}

// Tarjeta de ROI
class ROICard extends Component {
  render() {
    const { roi, isReal = false, totalBought, clase, etiqueta } = this.props;
    const valid = !!roi && typeof roi === "number" && !isNaN(roi);
    console.log({ roi, valid });
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
          className={`flex align-stretch p-relative`}
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
          <br />
          <div className="flex align-center gap-5px">
            <ValueROI />
          </div>
        </div>
      );

      function ValueROI() {
        return (
          <div className="flex align-center gap-5px">
            {valid && <CurrencyExchangeIcon fontSize="small" />}
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
