import React, { useEffect, useRef, useState } from "react";

import { isDark, theme_component } from "@theme/theme-manager";

import FyxDialog from "@components/GUI/FyxDialog";

import {
  Alert,
  Box,
  Chip,
  Collapse,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

const PUBLIC_URL = process.env.PUBLIC_URL;

function _img(props) {
  const { src = "" } = props;
  return <img alt="" {...props} src={`${PUBLIC_URL}/${src}`} />;
}

function BoxForm(props) {
  const refForm = useRef();
  const { onSubmit, ...rest_props } = props;
  const [alert, setAlert] = useState({});
  const [open, setOpen] = React.useState(false);

  function notify(response) {
    setOpen(true);
    setAlert(response);
  }

  return (
    <Box
      {...rest_props}
      ref={refForm}
      component="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (onSubmit) {
          const response = await onSubmit(e, data, notify, () => form.reset());
          if (response) {
            notify(response);
            setTimeout(() => {
              setOpen(false);
            }, 5000);
          }
        }
      }}
    >
      <Collapse in={open}>
        <Alert
          variant={isDark() ? "outlined" : "filled"}
          severity={alert.severity}
          icon={alert.icon}
        >
          {alert.message}
        </Alert>
        <br />
      </Collapse>
      {props.children}
    </Box>
  );
}

function TitleInfo(props) {
  const { title, information, variant } = props;
  return (
    <Typography variant={variant ?? "h6"}>
      {title}
      <Info
        placement="right"
        className="ml-20px"
        title_text={
          <>
            <div style={{ opacity: 0.8, fontSize: "10px" }} className="mb-20px">
              <Chip label={"Información"} />
            </div>
            {title}
          </>
        }
        title={information}
      />
    </Typography>
  );
}

function Info(props) {
  const [, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(Math.random());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { title, title_text, ...rest_props } = props;

  return (
    <FyxDialog
      {...rest_props}
      text={title}
      title_text={title_text ?? "Información"}
    >
      <Tooltip {...rest_props} title={title}>
        <Typography color="secondary" className="d-inline-block c-pointer">
          <i className="fa-solid fa-info-circle" />
        </Typography>
      </Tooltip>
    </FyxDialog>
  );
}

function generate_inputs(array) {
  const { enfasis_input } = theme_component();

  return array.map((structure, i) => {
    structure.placeholder ??= "Ingrese " + structure.label;
    return (
      <Input
        {...structure}
        key={i}
        color={enfasis_input}
        variant="filled"
        style={{
          minWidth: structure.placeholder.length * (14 * 0.55) + 30,
        }}
        inputProps={{ min: 1 }}
        sx={{
          "& input::placeholder": {
            fontSize: "14px",
            transform: "translateY(7px)",
            color: isDark() ? "white" : null,
            opacity: isDark() ? 0.74 : null,
          },
          [[
            `& input[type=number]::-webkit-outer-spin-button`,
            `& input[type=number]::-webkit-inner-spin-button`,
          ].join(", ")]: {
            filter: isDark()
              ? "invert(0.9) sepia() saturate(3) hue-rotate(210deg)"
              : "",
          },
        }}
      />
    );
  });
}

function generate_selects(array) {
  const { enfasis_input } = theme_component();

  return array
    .map((a) => {
      const { model } = a;
      if (!model) {
        return a;
      }
      switch (model) {
        case "tiempo":
          return {
            ...a,
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
    })
    .map((structure, i) => {
      const { label, name, style, onChange, setter, opns, ...rest_structure } =
        structure;
      return (
        <FormControl
          key={i}
          variant="standard"
          color={enfasis_input}
          style={{
            minWidth: label.length * (14 * 0.55) + 80,
            ...style,
          }}
        >
          <InputLabel id={`lbl-${name}`}>{label}</InputLabel>
          <Select
            {...rest_structure}
            name={name}
            labelId={`lbl-${name}`}
            id={`select-${name}`}
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
        </FormControl>
      );
    });
}

export { _img, generate_inputs, generate_selects, Info, BoxForm, TitleInfo };
