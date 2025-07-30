import React, { useEffect, useRef, useState } from "react";

import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";

import { fluidCSS } from "../../../fluidCSS/index.js";
import { JS2CSS } from "../../../fluidCSS/JS2CSS/index.js";
import {
  getPrimaryColor,
  isDark,
  typographyTheme,
} from "../../rules/manager/index.js";
import { TooltipGhost } from "./controls.jsx";

/**
 * IconButtonWithTooltip - Botón con icono y tooltip informativo.
 * @param {object} props - Propiedades del componente.
 * @param {string|function} props.title - Texto o función que genera el contenido del tooltip.
 * @param {boolean|function} props.disabled - Indica si el botón está deshabilitado.
 * @param {function} props.onClick - Función que se ejecuta al hacer clic.
 * @param {ReactNode} props.icon - Icono que aparece dentro del botón.
 */
export function IconButtonWithTooltip({
  title,
  disabled,
  onClick,
  icon,
  ...rest_props
}) {
  return (
    <div {...rest_props} className={global.nullish(rest_props.className, "")}>
      <TooltipGhost
        title={typeof title === "string" ? title : title()}
        placement="left"
      >
        <span className="inline-block">
          <IconButton
            disabled={
              ["boolean", "string"].includes(typeof disabled)
                ? disabled
                : typeof disabled == "function"
                ? disabled()
                : false
            }
            onClick={onClick}
          >
            {icon}
          </IconButton>
        </span>
      </TooltipGhost>
    </div>
  );
}

/**
 * CaptionWrapper - Envuelve contenido con una etiqueta flotante animada.
 * @param {object} props - Propiedades del componente.
 * @param {ReactNode} props.children - Elementos hijos a envolver.
 * @param {object} [props.style] - Estilos CSS adicionales.
 * @param {string} [props.className] - Clases CSS adicionales.
 * @param {string} props.label - Texto de la etiqueta flotante.
 */
export function CaptionWrapper({
  children,
  style = {},
  className = "",
  label,
  ...rest
}) {
  return (
    <div className={`flex col-direction justify-space-between ${className}`}>
      <Typography variant="caption" color="secondary">
        <small>{label}</small>
      </Typography>
      <FormControl variant="standard" style={style} {...rest}>
        {children}
      </FormControl>
    </div>
  );
}

/**
 * InputList - Genera una lista de campos de entrada con su etiqueta.
 * @param {Array} array - Arreglo de configuraciones para cada campo.
 */
export function genInputsGender(array) {
  return array.map((structure, i) => {
    structure.placeholder = global.nullish(
      structure.placeholder,
      `Ingresa ${structure.fem ? "la" : "el"} ` + structure.label.toLowerCase()
    );
    return (
      <CaptionWrapper key={i} label={structure.label}>
        <InputGender {...structure} />
      </CaptionWrapper>
    );
  });
}

/**
 * LabeledInput - Campo de entrada con etiqueta y marcador de posición dinámico.
 * @param {object} props - Propiedades del componente.
 * @param {string} [props.color] - Color del componente.
 * @param {boolean} [props.required] - Indica si es obligatorio.
 * @param {string} [props.placeholder] - Texto que se muestra cuando está vacío.
 * @param {string} [props.value] - Valor actual del campo.
 * @param {boolean} [props.fem] - Género gramatical femenino.
 * @param {string} props.label - Texto de la etiqueta.
 */
export function InputGender({
  color,
  required = true,
  placeholder,
  value,
  fem,
  singular = true,
  placeholder_uppercase = false,
  label,
  ...rest
}) {
  placeholder = global.nullish(
    placeholder,
    `Ingresa ${(() => {
      if (singular) {
        return fem ? "la" : "el";
      }
      return fem ? "las" : "los";
    })()} ${label.toLowerCase()}`
  );
  if (placeholder_uppercase) {
    placeholder = placeholder.toUpperCase();
  }
  if (!color) {
    color = getPrimaryColor();
  }
  let {
    h: hue,
    s: saturation,
    v: luminance,
  } = color ? color.hsv().object() : {};
  let filter = [
    null,
    `
          invert(0.7)
          invert(${1 - luminance / 100})
          sepia() 
          contrast(2)
          saturate(${3 * saturation}%)
          hue-rotate(${hue - 48}deg) 
      `,
  ][+!!isDark()];

  return (
    <Input
      {...rest}
      placeholder={placeholder}
      required={required}
      variant="filled"
      inputProps={{ min: 1 }}
      value={value}
      style={{
        minWidth: typographyTheme().widthAproxString(placeholder) + 20,
      }}
      sx={{
        "& input::placeholder": {
          fontSize: `${typographyTheme().fontSize}px`,
          opacity: 0.7,
        },
        [[
          `& input[type=number]::-webkit-outer-spin-button`,
          `& input[type=number]::-webkit-inner-spin-button`,
        ].join(", ")]: {
          filter,
        },
      }}
    />
  );
}

/**
 * CustomSelectList - Genera múltiples selectores personalizados.
 * @param {Array} array - Arreglo de configuraciones para cada CustomSelect.
 */
export function genSelectFast(array) {
  return array.map((structure, i) => {
    return <SelectFast {...structure} key={i} />;
  });
}

/**
 * CustomSelect - Selector personalizado con etiqueta flotante.
 * @param {object} props - Propiedades del componente.
 * @param {function} [props.onChange] - Función al cambiar selección.
 * @param {function} [props.setter] - Setter para actualizar el valor.
 * @param {object} [props.style] - Estilos CSS adicionales.
 * @param {string} props.label - Texto de la etiqueta.
 * @param {string} [props.value] - Valor actual seleccionado.
 * @param {string} props.name - Nombre del campo.
 * @param {Array} props.opns - Opciones disponibles.
 * @param {boolean} [props.required] - Indica si es obligatorio.
 * @param {boolean} [props.fem] - Género gramatical femenino.
 * @param {string} [props.color] - Color principal.
 */
export function SelectFast(props) {
  let {
    onChange,
    style,
    label = "",
    value: value_default = "",
    name,
    opns,
    required = true,
    fem = false,
    color,
    ...rest
  } = newProps();

  const [value, setValue] = useState(value_default);

  if (!name) {
    name = Math.random().toString(36).replace("0.", "");
  }

  const lblID = `lbl-${name}`,
    selectID = `select-${name}`,
    captionizeID = `captionize-${name}`;

  const inputlbl = `Selecciona ${fem ? "la" : "el"} ` + label.toLowerCase();

  return (
    <CaptionWrapper
      id={captionizeID}
      {...{
        label,
        color,
        style,
      }}
    >
      <div className="flex align-end">
        <InputLabel id={lblID}>{value ? "" : inputlbl}</InputLabel>
        <Select
          {...rest}
          required={required}
          fullWidth
          style={{
            ...style,
            minWidth: typographyTheme().widthAproxString(inputlbl) + 30,
          }}
          name={name}
          labelId={lblID}
          id={selectID}
          value={value}
          onChange={(event) => {
            const newvalue = event.target.value;
            setValue(newvalue);
            if (onChange) {
              onChange(event, newvalue);
            }
          }}
          MenuProps={{
            disableScrollLock: true, // Evita que se bloquee el scroll
          }}
        >
          {(() => {
            if (Array.isArray(opns)) {
              return opns.map((o, j) => (
                <MenuItem key={j} value={o}>
                  {o}
                </MenuItem>
              ));
            }
            if (typeof opns === "object") {
              return Object.entries(opns).map(([k, v], j) => (
                <MenuItem key={j} value={k}>
                  {v}
                </MenuItem>
              ));
            }
          })()}
        </Select>
      </div>
    </CaptionWrapper>
  );

  function newProps() {
    const { model, ...rest } = props;
    if (!model) {
      return props;
    }
    if (window["select-config-props-defaults"]) {
      const k = model.toLowerCase();
      const props_config = window["select-config-props-defaults"][k];
      if (props_config) {
        return {
          ...props_config,
          ...rest,
        };
      }
      return "Model not recognized " + model;
    }
    return props;
  }
}
