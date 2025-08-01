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
  SUPR,
  END,
  HOME,
  ARROW_LEFT,
  ARROW_UP,
  ARROW_DOWN,
  ARROW_RIGHT,
} from "../../../events/events.ids.js";
import { Design, Layer } from "./containers.jsx";
import { joinClass, clamp, Delayer } from "../../../tools/index.js";

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

const delayer = Delayer(100);

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

export function InputNumberDot({
  label,
  name,
  value = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  positive,
  onKeyDown,
  onChange,
  ...props
}) {
  const inputRef = React.useRef(null);

  if (positive) {
    if (min <= 0 || !min) {
      min = 0;
    }
  }
  const applyCandidate = (candidate, e) => {
    const { target } = e;
    const num = Number(candidate);
    const newVal = Number.isFinite(num)
      ? clamp(num, min, max)
      : clamp(0, min, max);
    target.value = newVal;
    onChange && onChange(newVal);
    target.dispatchEvent(new Event("change", { bubbles: true }));
  };

  return (
    <Design className="text-hide-unhover-container">
      <TextField
        {...props}
        inputRef={inputRef}
        label={label}
        InputLabelProps={{ shrink: true }}
        type="text"
        inputMode="decimal"
        variant="outlined"
        color="toBOW50"
        name={name}
        defaultValue={clamp(value, min, max)}
        onKeyDown={(e) => {
          // Manejar teclas de flecha arriba y abajo para incrementar/decrementar
          if (onKeyDown && onKeyDown(e)) {
            return;
          }
          if (stepMove({ event: e })) {
            return;
          }

          const { key, keyCode, target } = e;
          const { value, selectionStart: start, selectionEnd: end } = target;

          // Permitir otras teclas de control
          // (delete, tab, escape, enter, home, end, arrows laterales)
          if (
            [
              TAB,
              ESCAPE,
              ENTER,
              DELETE,
              END,
              HOME,
              ARROW_LEFT,
              ARROW_RIGHT,
            ].includes(keyCode)
          ) {
            return;
          }
          // Manejar BACKSPACE y calcular nuevo valor con start/end
          if (keyCode === BACKSPACE) {
            e.preventDefault();
            const deletionStart = start === end ? start - 1 : start;
            const candidate = value.slice(0, deletionStart) + value.slice(end);
            applyCandidate(candidate, e);
            return;
          }

          // Manejar SUPR y calcular nuevo valor con start/end
          if (keyCode === SUPR) {
            e.preventDefault();
            const deletionStart = start;
            const candidate = value.slice(0, deletionStart) + value.slice(end);
            applyCandidate(candidate, e);
            return;
          }

          // Permitir solo números, punto decimal y guión (negativo)
          if (key === "-" && min >= 0) {
            e.preventDefault();
            return;
          }
          if (!/[0-9.-]/.test(key)) {
            e.preventDefault();
            return;
          }else{
            if (value == "0") {
              e.preventDefault();
              applyCandidate(+key, e);
              return;
            }
          }

          // Si es un punto, verificar que no haya ya uno
          if (key === "." && value.includes(".")) {
            e.preventDefault();
            return;
          }

          // Si es un signo -, solo permitir al inicio
          if (key === "-" && value.length > 0 && start !== 0) {
            e.preventDefault();
            return;
          }

          if (/^[0-9]$/.test(key)) {
            const candidate = value.slice(0, start) + key + value.slice(end);
            const theNumber = Number(candidate);
            if (Number.isFinite(theNumber)) {
              if (theNumber < min) {
                e.preventDefault();
                applyCandidate(min, e);
                return;
              }
              if (theNumber > max) {
                e.preventDefault();
                applyCandidate(max, e);
                return;
              }
            }
          }

          // Si ya hay un signo '-', no permitir otro
          if (key === "-" && /^-/.test(value)) {
            e.preventDefault();
            return;
          }

          onChange && onChange(e);
        }}
        onChange={onChange}
        InputProps={{
          inputProps: {
            min: min,
            max: max,
            step: step,
          },
        }}
        onBlur={(e) => {
          const raw = e.target.value.trim();
          if (!raw) {
            const newVal = clamp(0, min, max);
            inputRef.current.value = newVal;
            const changeEvent = new Event("change", { bubbles: true });
            inputRef.current.dispatchEvent(changeEvent);
            return;
          }
          const val = parseFloat(raw);
          if (!isNaN(val)) {
            let newVal = clamp(val, min, max);
            if (newVal !== val) {
              inputRef.current.value = newVal;
              const changeEvent = new Event("change", { bubbles: true });
              inputRef.current.dispatchEvent(changeEvent);
            }
          }
        }}
        fullWidth
      />
      {step && <Stepers />}
    </Design>
  );

  function Stepers() {
    return (
      <Layer right centery centralized>
        <div className="flex col-direction text-hide-opacity-unhover">
          <div
            className="backdropfilter brightnesshover-2 padw-5px c-pointer"
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
            className="backdropfilter brightnesshover-2 padw-5px c-pointer"
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
    );
  }

  function stepMove({ input, event, keyCode }) {
    if (!delayer.isReady(() => stepMove({ input, event, keyCode }))) {
      return;
    }
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
      const currentValue = (() => {
        const v = parseFloat(input.value);
        if (isNaN(v)) {
          return 0;
        }
        return v;
      })();

      let newValue = (() => {
        if (keyCode === ARROW_UP) {
          return Math.min(currentValue + step, max);
        } else {
          return Math.max(currentValue - step, min);
        }
      })();

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
      onChange && onChange(newValue);
      return true;
    }
  }
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
