import React from "react";

import { theme_component } from "@theme/theme-manager";

import {
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

function Info(props ) {
  return (
    <Tooltip {...props}>
      <Typography
        color="secondary"
        className="d-inline-block c-pointer"
      >
        <i className="fa-solid fa-info-circle" />
      </Typography>
    </Tooltip>
  );
}

function generate_inputs(array) {
  const { enfasis_input } = theme_component();

  return array.map(({ placeholder, label, type = "text", name, id }, i) => {
    placeholder ??= "Ingrese " + label;
    return (
      <Input
        key={i}
        placeholder={placeholder}
        color={enfasis_input}
        variant="filled"
        type={type}
        name={name}
        id={id}
        style={{
          minWidth: placeholder.length * (14 * 0.55) + 30,
        }}
        inputProps={{ min: 1 }}
      />
    );
  });
}

function generate_selects(array) {
  const { enfasis_input } = theme_component();

  return array.map(
    ({ label, name, style, onChange = () => 0, value, setter, opns }, i) => (
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
          labelId={`lbl-${name}`}
          id={`select-${name}`}
          value={value}
          label="Age"
          onChange={(event) => {
            const newvalue = event.target.value;
            setter(newvalue);
            onChange(event, newvalue);
          }}
        >
          {opns.map((o, j) => (
            <MenuItem key={j} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  );
}

export { _img, generate_inputs, generate_selects, Info };