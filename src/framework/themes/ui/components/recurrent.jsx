import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Tooltip, Chip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { showDialog } from "../PromptDialog.jsx";
import { TooltipGhost } from "./controls.jsx";
import { joinClass } from "../../../tools/index.js";

export function ImageLocal(props) {
  const { src, alt = "", ...rest } = props;
  const base = process.env.PUBLIC_URL || "";
  const path = src.startsWith("/") ? src : `/${src}`;
  return (
    <Box
      component="img"
      loading="lazy"
      {...rest}
      alt={alt}
      src={`${base}${path}`}
    />
  );
}

export function InfoDialog({
  title = "Información",
  description = "Más información",
  dialogDescription,
  isButton = false,
  color = "contrastPaper",
  colorDisabled = "toSecondary75",
  className,
  icon = <InfoOutlinedIcon fontSize="inherit" />,
  disabled = false,
  variant = "contained",
  dialogProps = {},
  ...rest_props
}) {
  if (!dialogDescription) {
    dialogDescription = description;
  }

  function handleClick() {
    showDialog({
      title: title,
      description: dialogDescription,
      ...dialogProps,
    });
  }

  return (
    <TooltipGhost {...rest_props} title={description}>
      <div className="inline-block">
        {(() => {
          const color_ = [color, colorDisabled][+disabled];
          if (isButton) {
            return (
              <div className={className}>
                <ButtonShyText
                  className="inline-flex justify-center align-center"
                  variant={variant}
                  color={color_}
                  onClick={handleClick}
                  disabled={disabled}
                  startIcon={icon}
                >
                  Información
                </ButtonShyText>
              </div>
            );
          }
          return (
            <Typography
              color={color_}
              className={joinClass(
                "inline-block",
                className,
                ["c-pointer", "pointer-not-allowed"][+disabled]
              )}
              onClick={handleClick}
            >
              {icon}
            </Typography>
          );
        })()}
      </div>
    </TooltipGhost>
  );
}

export function TitleInfo({ title, information, variant = "h6", ...rest }) {
  return (
    <Typography variant={variant} {...rest}>
      {title}
      <InfoDialog
        placement="right"
        className="ml-20px"
        title={"Información de " + title}
        description={information}
      />
    </Typography>
  );
}

export function ButtonShyText({
  className = "",
  startIcon,
  endIcon,
  variant = "contained",
  size = "small",
  children,
  childrenClass = "text-hide-unhover",
  tooltip,
  nowrap = true,
  ...rest
}) {
  const button = (
    <Button
      {...rest}
      className={joinClass("text-hide-unhover-container", className)}
      variant={variant}
      size={size}
    >
      {startIcon}
      <div className={[childrenClass, nowrap ? "nowrap" : ""].join(" ")}>
        {startIcon && <span>&nbsp;</span>}
        <small>{children}</small>
        {endIcon && <span>&nbsp;</span>}
      </div>
      {endIcon}
    </Button>
  );
  if (tooltip) {
    return <TooltipGhost title={tooltip}>{button}</TooltipGhost>;
  }
  return button;
}
