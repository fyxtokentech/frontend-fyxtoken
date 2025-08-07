import React from "react";

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
import { mouseLeftPressed } from "../../../events/events.base.js";
import { onBlur } from "../../../events/events.listeners.js";

import { TextField, Typography } from "@mui/material";
import { Design, Layer, Reserveme } from "./containers.jsx";
import { Delayer, clamp, trunc, joinClass } from "../../../tools/index.js";
import { isNullish } from "../../../start.js";
import { EditNoteRounded } from "@mui/icons-material";

let sentence;
let timeoutId;

function removeSentence() {
  sentence = "";
  clearCall();
}

function clearCall() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

onBlur(() => {
  sentence = "";
});

export function InputNumberDot({
  label,
  name,
  value = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  positive,
  onKeyDown,
  className = "",
  onChange = () => {},
  ...props
}) {
  const inputRef = React.useRef(null);
  const delayer = Delayer(1000 / 40);

  if (step < 0) {
    step = -step;
  }

  const decimals = (() => {
    if (step === 0) {
      return 0;
    }
    return Math.max(0, Math.ceil(Math.log10(1 / step)));
  })();

  value = trunc(value, decimals);

  if (positive) {
    min = 0;
  }

  const { size } = props;

  const isSmall = size == "small";

  return (
    <Design className="text-hide-unhover-container">
      <Reserveme duplicity>
        <TextField
          variant="outlined"
          {...props}
          className={className}
          type="text"
          inputMode="decimal"
        />
      </Reserveme>
      <TextField
        variant="outlined"
        color="toBOW50"
        {...props}
        className={joinClass(className, "p-absolute", "expand")}
        onMouseLeave={removeSentence}
        inputRef={inputRef}
        label={
          isSmall ? (
            <Typography variant="caption" color="secondary">
              <small>{label}</small>
            </Typography>
          ) : (
            label
          )
        }
        InputLabelProps={{ shrink: true }}
        type="text"
        inputMode="decimal"
        name={name}
        defaultValue={clamp(value, min, max)}
        autoComplete="off"
        InputProps={{
          inputProps: {
            autoComplete: "off",
            min: min,
            max: max,
            step: step,
          },
        }}
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

          if (
            [TAB, ESCAPE, ENTER, END, HOME, ARROW_LEFT, ARROW_RIGHT].includes(
              keyCode
            )
          ) {
            // Se deja actuar con normalidad
            return;
          }

          const NEGATIVE_REQUIRED = key == "-";
          const POSITIVE_REQUIRED = key == "+";
          const DECIMAL_REQUIRED = key == ".";
          const NEWDIGIT_ISZERO = key == "0";
          const IS_LAST_INDEX = start == value.length;
          const IS_ALREADY_DECIMAL = value.includes(".");
          const [PART_INTEGER = "", PART_DECIMAL = ""] = value.split(".");
          const IS_IN_DECIMAL_PART = start > PART_INTEGER.length;

          if ([BACKSPACE, SUPR].includes(keyCode)) {
            // El usuario ha borrado
            if (
              newTypeValue({
                indexStart: {
                  [BACKSPACE]: start === end ? start - 1 : start,
                  [SUPR]: start + 1,
                }[keyCode],
              }) == ""
            ) {
              // Evita que el input quede vacío ""
              applyNewValue(0);
            }
            return;
          }

          if (!/[0-9.\+\-]/.test(key)) {
            // No es digito númerico
            e.preventDefault();
            return;
          } else {
            if (value == "0" && !DECIMAL_REQUIRED) {
              if (NEGATIVE_REQUIRED) {
                if (min < 0) {
                  e.preventDefault();
                  target.value = "-";
                  return;
                }
              } else {
                applyNewValue(+key);
              }
              return;
            }
          }

          if (NEWDIGIT_ISZERO && IS_LAST_INDEX && IS_ALREADY_DECIMAL) {
            if (PART_DECIMAL.length >= decimals - 1) {
              e.preventDefault();
            }
            return;
          }

          if (POSITIVE_REQUIRED || NEGATIVE_REQUIRED) {
            e.preventDefault();
            const nvalue_ = +value;
            const nvalue = Math.abs(+nvalue_);
            if (min < 0 && nvalue > 0 && NEGATIVE_REQUIRED) {
              applyNewValue(-nvalue);
            }
            if (max > 0 && nvalue < 0 && POSITIVE_REQUIRED) {
              applyNewValue(nvalue);
            }
            return;
          }

          if (DECIMAL_REQUIRED) {
            // Si es un punto
            if (decimals == 0) {
              // No admite decimales
              e.preventDefault();
            } else {
              if (IS_ALREADY_DECIMAL) {
                // No se permite más de un punto decimal
                e.preventDefault();
              }
            }
            return;
          }

          if (/^[0-9]$/.test(key)) {
            applyNewValue(newTypeValue({ replaceValue: key }));
            return;
          }

          function newTypeValue({ replaceValue = "", indexStart = start }) {
            const s = Math.min(indexStart, end);
            const e = Math.max(indexStart, end);
            return value.slice(0, s) + replaceValue + value.slice(e);
          }

          function applyNewValue(candidate) {
            e.preventDefault();
            if (["-", "."].includes(candidate)) {
              candidate = 0;
            }
            dispatchEvent({ event: e, target: e.target, newValue: candidate });
          }
        }}
        onChange={(e, newValue) =>
          onChange({ event: e, target: e.target, newValue: +newValue })
        }
        onBlur={(e) => {
          const raw = e.target.value.trim();
          if (!raw || ["-", "."].includes(raw)) {
            dispatchEvent({ event: e, target: e.target, newValue: 0 });
            return;
          }
          dispatchEvent({ event: e, target: e.target, newValue: raw });
        }}
      />
      {step && <Stepers />}
    </Design>
  );

  function dispatchEvent({ event, target, newValue }) {
    newValue = +newValue;
    if (!Number.isFinite(newValue)) {
      newValue = 0;
    }
    newValue = trunc(newValue, decimals);
    newValue = clamp(newValue, min, max);
    target.value = newValue;
    // Disparar evento nativo 'input' para capturar el cambio y propagarlo al formulario
    target.dispatchEvent(new Event("input", { bubbles: true }));
    onChange({ event, target, newValue });
  }

  function Stepers() {
    const exec_sentence = (value) => {
      clearCall();
      const isSentence = !sentence;
      if (!isNullish(value)) {
        sentence = value;
      }
      if (sentence) {
        timeoutId = setTimeout(() => {
          clearCall();
          exec_sentence();
        }, 25 + 500 * isSentence);
        if (mouseLeftPressed() || isSentence) {
          stepMove({
            input: inputRef.current,
            keyCode: { plus: ARROW_UP, minus: ARROW_DOWN }[sentence],
          });
        } else if (!mouseLeftPressed()) {
          removeSentence();
        }
      }
    };
    return (
      <Layer right centery centralized>
        <div
          className={[
            "flex",
            "col-direction",
            "text-hide-opacity-unhover",
            "select-none",
            isSmall ? "font-smaller" : "",
          ].join(" ")}
          onMouseLeave={removeSentence}
          style={
            isSmall
              ? {
                  scale: 0.75,
                }
              : null
          }
        >
          <div
            className="backdropfilter brightnesshover-2 padw-5px c-pointer"
            tabIndex="-1"
            onMouseDown={() => exec_sentence("plus")}
            onMouseUp={removeSentence}
            onMouseEnter={() => sentence && (sentence = "plus")}
          >
            {"+"}
          </div>
          <div
            className="backdropfilter brightnesshover-2 padw-5px c-pointer"
            tabIndex="-1"
            onMouseDown={() => exec_sentence("minus")}
            onMouseUp={removeSentence}
            onMouseEnter={() => sentence && (sentence = "minus")}
          >
            {"-"}
          </div>
        </div>
      </Layer>
    );
  }

  function stepMove({ input, event, keyCode }) {
    if (
      !event
        ? !delayer.isReady(() => stepMove({ input, event, keyCode }))
        : false
    ) {
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
        const v = +input.value;
        if (!Number.isFinite(v)) {
          return 0;
        }
        return v;
      })();
      const ds = step * [-1, 1][+(keyCode === ARROW_UP)];
      // Disparar evento de cambio para actualizar el driver
      dispatchEvent({
        event,
        target: input,
        newValue: currentValue + ds,
      });
      return true;
    }
  }
}
