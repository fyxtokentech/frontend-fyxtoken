import React, { Component } from "react";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PendingIcon from "@mui/icons-material/Pending";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Tooltip,
  Chip,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import {
  PaperP,
  HTTP_IS_ERROR,
  showPromise,
  sleep,
  showSuccess,
  showWarning,
  showError,
  TooltipGhost,
} from "@jeff-aporta/camaleon";

import { driverCoinsOperating } from "./CoinsOperating.driver.js";
import { driverPanelRobot } from "../../../bot.driver.js";

export default class CoinsOperating extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    driverCoinsOperating.addLinkActionInProcess(this);
    driverPanelRobot.addLinkCoinsOperating(this);
    driverPanelRobot.addLinkCoinsToDelete(this);
  }

  componentWillUnmount() {
    driverCoinsOperating.removeLinkActionInProcess(this);
    driverPanelRobot.removeLinkCoinsOperating(this);
    driverPanelRobot.removeLinkCoinsToDelete(this);
  }

  renderEmptyMessage() {
    return (
      <Typography variant="caption" color="secondary">
        No hay monedas en operación.
      </Typography>
    );
  }

  render() {
    const coinsOperating = driverPanelRobot.getCoinsOperating();

    return (
      <PaperP elevation={3}>
        {(() => {
          if (coinsOperating.length > 0) {
            return (
              <Typography
                variant="caption"
                color="secondary"
                component="div"
                style={{ marginTop: "-10px" }}
                className="op-50"
              >
                <small>Monedas en Operación</small>
              </Typography>
            );
          }
        })()}
        <div className="flex align-center wrap gap-5px">
          {(() => {
            if (coinsOperating.length === 0) {
              return this.renderEmptyMessage();
            }

            return coinsOperating
              .sort((a, b) =>
                driverPanelRobot
                  .getCoinKey(a)
                  .localeCompare(driverPanelRobot.getCoinKey(b))
              )
              .map((optionCurrency, index) => {
                const symbol = driverPanelRobot.getCoinKey(optionCurrency);
                const isPendingDelete =
                  driverPanelRobot.isPendingInCoinsToDelete(symbol);

                const [colorChip, textColor, deleteIcon, tooltipTitle] = [
                  "colorChip",
                  "textColor",
                  "deleteIcon",
                  "tooltipTitle",
                ].map((key) =>
                  driverPanelRobot.mapCaseCoinsToDelete(key, !isPendingDelete)
                );

                return (
                  <TooltipGhost
                    key={`tooltip-${symbol}-${index}`}
                    title={tooltipTitle}
                  >
                    <Chip
                      label={symbol}
                      onDelete={(e) => {
                        e.preventDefault();
                        driverCoinsOperating.deleteCoinFromAPI(optionCurrency);
                      }}
                      disabled={
                        isPendingDelete ||
                        driverCoinsOperating.getActionInProcess()
                      }
                      variant="elevated"
                      color={colorChip}
                      style={{ color: textColor }}
                      deleteIcon={deleteIcon}
                      sx={{ m: 0.5 }}
                    />
                  </TooltipGhost>
                );
              });
          })()}
        </div>
      </PaperP>
    );
  }
}
