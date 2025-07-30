import React from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { Tooltip, Chip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { showDialog } from "../PromptDialog.jsx";
import { TooltipGhost } from "./controls.jsx";
import {
  BACKSPACE,
  TAB,
  ESCAPE,
  ENTER,
  DELETE,
  END,
  HOME,
  ARROW_LEFT,
  ARROW_UP,
  ARROW_DOWN,
  ARROW_RIGHT,
} from "../../../events/events.ids.js";
import { Design, Layer } from "./containers.jsx";

export function ImageLocal(props) {
  const { src, ...rest } = props;
  const base = process.env.PUBLIC_URL || "";
  const path = src.startsWith("/") ? src : `/${src}`;
  return <Box component="img" {...rest} alt="" src={`${base}${path}`} />;
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
        {isButton ? (
          <div className={className}>
            <Button
              className={`
                  inline-flex justify-center align-center
                  text-hide-unhover-container
              `}
              variant={variant}
              color={[color, colorDisabled][+disabled]}
              onClick={handleClick}
              disabled={disabled}
              size="small"
            >
              {icon}
              <div className="text-hide-unhover">
                <span style={{ marginLeft: "5px" }}>
                  <small>Información</small>
                </span>
              </div>
            </Button>
          </div>
        ) : (
          <Typography
            color={[color, colorDisabled][+disabled]}
            className={`inline-block c-pointer ${className} ${
              ["", "pointer-not-allowed"][+disabled]
            }`}
            onClick={handleClick}
          >
            {icon}
          </Typography>
        )}
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

export function InputNumberDot({
  label,
  name,
  value = 0,
  min,
  max,
  step,
  onKeyDown,
  ...props
}) {
  const inputRef = React.useRef(null);

  return (
    <Design className="text-hide-unhover-container">
      <TextField
        {...props}
        inputRef={inputRef}
        label={label}
        type="text"
        inputMode="decimal"
        name={name}
        defaultValue={value}
        onKeyDown={(e) => {
          // Manejar teclas de flecha arriba y abajo para incrementar/decrementar
          if (onKeyDown) {
            onKeyDown(e);
          }
          if (stepMove({ event: e })) {
            return;
          }

          // Permitir otras teclas de control (backspace, delete, tab, escape, enter, home, end, arrows laterales)
          if (
            [
              BACKSPACE,
              TAB,
              ESCAPE,
              ENTER,
              DELETE,
              END,
              HOME,
              ARROW_LEFT,
              ARROW_RIGHT,
            ].includes(e.keyCode)
          ) {
            return;
          }

          // Permitir solo números, punto decimal y guión (negativo)
          if (e.key === "-" && min >= 0) {
            e.preventDefault();
            return;
          }
          if (!/[0-9.-]/.test(e.key)) {
            e.preventDefault();
            return;
          }

          // Si es un punto, verificar que no haya ya uno
          if (e.key === "." && e.target.value.includes(".")) {
            e.preventDefault();
            return;
          }

          // Si es un signo -, solo permitir al inicio
          if (
            e.key === "-" &&
            e.target.value.length > 0 &&
            e.target.selectionStart !== 0
          ) {
            e.preventDefault();
            return;
          }

          // Si ya hay un signo '-', no permitir otro
          if (e.key === "-" && /^-/.test(e.target.value)) {
            e.preventDefault();
            return;
          }
        }}
        InputProps={{
          inputProps: {
            min: min,
            max: max,
            step: step,
          },
        }}
        onBlur={(e) => {
          const val = parseFloat(e.target.value);
          if (!isNaN(val)) {
            let newVal = val;
            if (val < min) {
              newVal = min;
            }
            if (val > max) {
              newVal = max;
            }
            if (newVal !== val) {
              inputRef.current.value = newVal;
              const changeEvent = new Event("change", { bubbles: true });
              inputRef.current.dispatchEvent(changeEvent);
            }
          }
        }}
        fullWidth
      />
      <Layer right centery centralized>
        <div className="flex col-direction text-hide-opacity-unhover">
          <div
            className="backdropfilter brightnesshover-1-5 padw-5px c-pointer"
            onClick={() =>
              stepMove({
                input: inputRef.current,
                keyCode: ARROW_UP,
              })
            }
          >
            +
          </div>
          <div
            className="backdropfilter brightnesshover-1-5 padw-5px c-pointer"
            onClick={() =>
              stepMove({
                input: inputRef.current,
                keyCode: ARROW_DOWN,
              })
            }
          >
            -
          </div>
        </div>
      </Layer>
    </Design>
  );

  function stepMove({ input, event, keyCode }) {
    if (event) {
      if (!input) {
        input = event.target;
      }
      if (!keyCode) {
        keyCode = event.keyCode;
      }
    }
    if ([ARROW_UP, ARROW_DOWN].includes(keyCode)) {
      event && event.preventDefault();
      const currentValue = parseFloat(input.value) || 0;
      let newValue;

      if (keyCode === ARROW_UP) {
        newValue = Math.min(currentValue + step, max);
      } else {
        newValue = Math.max(currentValue - step, min);
      }

      // Redondear según los decimales del step para evitar problemas de precisión
      const decimals = (() => {
        if (step === 0) {
          return 0;
        }
        return Math.max(0, Math.ceil(Math.log10(1 / step)));
      })();
      const multiplier = Math.pow(10, decimals);
      newValue = Math.round(newValue * multiplier) / multiplier;
      input.value = newValue;

      // Disparar evento de cambio para actualizar el driver
      const changeEvent = new Event("change", { bubbles: true });
      input.dispatchEvent(changeEvent);
      return true;
    }
  }
}
