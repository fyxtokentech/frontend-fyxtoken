import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React from "react";

export { Password, _img };

const PUBLIC_URL = process.env.PUBLIC_URL;

function _img(props) {
  const { src = "" } = props;
  return <img alt="" {...props} src={`${PUBLIC_URL}/${src}`} />;
}

function Password({ label, id, onChange }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      sx={{ overflow: "hidden" }}
      variant="filled"
      className="br-1100-10px"
      fullWidth
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <FilledInput
        fullWidth
        id={id}
        type={showPassword ? "text" : "password"}
        sx={{ fontSize: "20px" }}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
