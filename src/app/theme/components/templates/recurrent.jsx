import React, { useEffect, useRef, useState } from "react";

import JS2CSS from "@jeff-aporta/js2css";

import fluidCSS from "@jeff-aporta/fluidcss";

import {
  isDark,
  themized,
  controlComponents,
  colorsTheme,
  typographyTheme,
} from "@jeff-aporta/theme-manager";

import FyxDialog from "@components/GUI/dialog";

import {
  Alert,
  Box,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DialogTrigger,
  IconButtonWithTooltip,
  GhostTooltip,
  FormContainer,
  TitleInfo,
  CaptionWrapper,
  InputList,
  LabeledInput,
  CustomSelectList,
  CustomSelect,
  PageTitle,
  Info,
  StyledChip,
} from "@jeff-aporta/mui-custom-components";

const PUBLIC_URL = process.env.PUBLIC_URL;

function ImageLocal(props) {
  const { src, ...rest } = props;
  const base = process.env.PUBLIC_URL || '';
  const path = src.startsWith('/') ? src : `/${src}`;
  return (
    <Box
      component="img"
      {...rest}
      alt=""
      src={`${base}${path}`}  
    />
  );
}

function TooltipNoPointerEvents({ children, ...props }) {
  return (
    <Tooltip {...props} PopperProps={{ sx: { pointerEvents: "none" } }}>
      <div style={{ display: "inline-block" }}>{children}</div>
    </Tooltip>
  );
}

function generate_inputs(array) {
  const { Input } = themized();

  return array.map((structure, i) => {
    structure.placeholder ??=
      `Ingresa ${structure.fem ? "la" : "el"} ` + structure.label.toLowerCase();
    return (
      <CaptionWrapper key={i} label={structure.label}>
        <AnInput {...structure} />
      </CaptionWrapper>
    );
  });
}

function AnInput(props) {
  const {
    color = colorsTheme().primary.color,
    required = true,
    placeholder,
    value,
    ...rest
  } = props;
  return (
    <Input
      {...rest}
      placeholder={placeholder}
      required={required}
      variant="filled"
      color="morado_enfasis"
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
          filter: isDark()
            ? `invert(0.9) sepia() hue-rotate(${color.hue()}deg)`
            : "",
        },
      }}
    />
  );
}

function generate_selects(array) {
  return array.map((structure, i) => {
    return <AnSelect {...structure} key={i} />;
  });
}

function AnSelect(props) {
  const {
    onChange,
    setter,
    style,
    label,
    value,
    name,
    opns,
    required = true,
    fem = false,
    ...rest
  } = newProps();

  const { enfasis_input } = controlComponents();

  const lblID = `lbl-${name}`,
    selectID = `select-${name}`,
    captionizeID = `captionize-${name}`;

  JS2CSS.insertStyle({
    id: `js2css-${captionizeID}`,
    objJs: {
      [`#${lblID}`]: {
        transition: "opacity 0.4s",
        [`&[data-shrink="true"]`]: {
          opacity: 0,
        },
      },
    },
  });

  const inputlbl = `Selecciona ${fem ? "la" : "el"} ` + label.toLowerCase();

  return (
    <CaptionWrapper
      id={captionizeID}
      label={label}
      color={enfasis_input}
      style={style}
    >
      <div className="d-flex ai-end">
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
            if (setter) {
              setter(newvalue);
            }
            if (onChange) {
              onChange(event, newvalue);
            }
          }}
          MenuProps={{
            disableScrollLock: true, // Evita que se bloquee el scroll
          }}
        >
          {opns.map((o, j) => (
            <MenuItem key={j} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </div>
    </CaptionWrapper>
  );

  function newProps() {
    const { model, ...rest } = props;
    if (!model) {
      return props;
    }
    switch (model.toLowerCase()) {
      case "plan":
        return {
          ...rest,
          label: "Plan",
          name: "investment_package",
          opns: ["Básico", "Avanzado", "Pro", "Élite", "Premium"],
        };
      case "interval":
        return {
          ...rest,
          label: "Intervalo",
          name: "interval_time",
          opns: [
            "5 minutos",
            "10 minutos",
            "15 minutos",
            "1 hora",
            "1 día",
            "1 semana",
            "2 semanas",
            "1 mes",
          ],
        };
      default:
        return "Model not recognized " + model;
    }
  }
}

function Title({ txt }) {
  if (!txt) return null;
  // Asegurarse que el selector del título exista antes de modificarlo
  const titleElement = document.querySelector("title");
  if (titleElement) {
    titleElement.innerHTML = txt;
  }
  return (
    <>
      <Typography
        variant="h2" // Usar h2 como en panel-robot
        className={fluidCSS().ltX(600, { fontWeight: "500" }).end()}
      >
        {txt}
      </Typography>
      <hr className="threeQuartersWidth d-inline-block" />
      <br />
      <br />
    </>
  );
}

function ChipSmall(props) {
  return (
    <Chip
      {...window["props"]["ChipSmall"]}
      sx={{
        ...window["style"]["ChipSmall"],
        ...window["style"]["Chip-right"],
      }}
      {...props}
    />
  );
}

export {
  ImageLocal,
  generate_inputs,
  generate_selects,
  TooltipNoPointerEvents,
  Info,
  FormContainer,
  TitleInfo,
  IconButtonWithTooltip,
  Title,
  ChipSmall,
  GhostTooltip
};
