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

import { TextField } from "@mui/material";
import { Design, Layer } from "./containers";
import { Delayer, clamp, trunc } from "../../../tools/index.js";
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
  onChange = () => {},
  ...props
}) {
  const inputRef = React.useRef(null);
  const delayer = Delayer(1000 / 40);

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

  React.useEffect(() => {
    inputRef.current && (inputRef.current.value = clamp(value, min, max));
  }, [value]);

  return (
    <Design className="text-hide-unhover-container">
      <TextField
        {...props}
        onMouseLeave={removeSentence}
        inputRef={inputRef}
        label={label}
        InputLabelProps={{ shrink: true }}
        type="text"
        inputMode="decimal"
        variant="outlined"
        color="toBOW50"
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
          if ([BACKSPACE, SUPR].includes(keyCode)) {
            applyNewValue(
              newTypeValue({
                indexStart: {
                  [BACKSPACE]: start === end ? start - 1 : start,
                  [SUPR]: start,
                }[keyCode],
              })
            );
            return;
          }

          // Permitir solo números, punto decimal y guión (negativo)
          if (key === "-") {
            e.preventDefault();
            if (min < 0) {
              applyNewValue(-value);
            }
            return;
          }

          if (!/[0-9.-]/.test(key)) {
            e.preventDefault();
            return;
          } else {
            if (value == "0") {
              applyNewValue(+key);
              return;
            }
          }

          // Si es un punto, verificar que no haya ya uno
          if (key === "." && value.includes(".")) {
            e.preventDefault();
            return;
          }

          if (/^[0-9]$/.test(key)) {
            applyNewValue(newTypeValue({ replaceValue: key }));
            return;
          }

          function newTypeValue({ replaceValue = "", indexStart = start }) {
            return value.slice(0, indexStart) + replaceValue + value.slice(end);
          }

          function applyNewValue(candidate) {
            e.preventDefault();
            const num = +candidate;
            const newVal = (() => {
              if (Number.isFinite(num)) {
                return clamp(num, min, max);
              }
              return clamp(0, min, max);
            })();
            target.value = trunc(newVal, decimals);
            onChange({ event: e, target, newVal });
            target.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }}
        onChange={(e, newValue) =>
          onChange({ event: e, target: e.target, newVal: +newValue })
        }
        onBlur={(e) => {
          const raw = e.target.value.trim();
          if (!raw) {
            const newVal = clamp(0, min, max);
            inputRef.current.value = trunc(newVal, decimals);
            const changeEvent = new Event("change", { bubbles: true });
            inputRef.current.dispatchEvent(changeEvent);
            return;
          }
          const val = parseFloat(raw);
          if (!isNaN(val)) {
            let newVal = clamp(val, min, max);
            if (newVal !== val) {
              inputRef.current.value = trunc(newVal, decimals);
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
          className="flex col-direction text-hide-opacity-unhover select-none"
          onMouseLeave={removeSentence}
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

      const multiplier = Math.pow(10, decimals);

      newValue = Math.round(newValue * multiplier) / multiplier;
      input.value = newValue;

      // Disparar evento de cambio para actualizar el driver
      const changeEvent = new Event("change", { bubbles: true });
      input.dispatchEvent(changeEvent);
      onChange({ event, target: input, newVal: newValue });
      return true;
    }
  }
}
