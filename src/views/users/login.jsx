import React, { Component, useState } from "react";
import Alert from "@mui/material/Alert";

import { isDark, showError, href, DivM, PaperP, IS_GITHUB } from "@jeff-aporta/camaleon";
import { Main } from "@theme/main.jsx";

import { HTTPPOST_TRY_LOGIN } from "@api";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  Typography,
  Checkbox,
  Link,
} from "@mui/material";
import { fluidCSS, HTTP_IS_ERROR } from "@jeff-aporta/camaleon";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function () {
  return (
    <Main bgtype="portal" h_init="100px" h_fin="100px">
      <DivM m_max={40} className="d-center min-h-50vh">
        <LoginForm />
      </DivM>
    </Main>
  );
}

function LoginForm() {
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // Validaciones de campos
    if (!username && !password) {
      showError("Por favor ingresa usuario y contraseña");
      return;
    }
    if (!username) {
      showError("Por favor ingresa usuario");
      return;
    }
    if (!password) {
      showError("Por favor ingresa contraseña");
      return;
    }
    let user = await HTTPPOST_TRY_LOGIN({ username, password });

    if (!user && IS_GITHUB) {
      user = {
        user_id: "2d35c015-5097-46ff-b50c-f89678ee59f0",
        name: "Jeffrey",
        last_name: "Agudelo",
        email: "jeffrey.alexander.agudelo.espitia@gmail.com",
      };
    }

    if (HTTP_IS_ERROR(user)) {
      showError("Credenciales inválidas");
      return;
    }
    const target = href("@wallet");
    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    window.location.href = target;
  };

  return (
    <PaperP
      elevation={6}
      className="flex-col flex-wrap gap-30px min-h-150px w-fit"
    >
      <center className="pad-10px">
        <Typography variant="h4">Ingresa al Wallet</Typography>
      </center>
      <Credentials />
      <div className="flex-col align-end gap-10px fullWidth">
        <div
          className="flex-col align-end gap-10px"
          style={{ scale: "0.8", transformOrigin: "right center" }}
        >
          <div>
            <FormControlLabel
              color="secondary"
              className="flex fd-row-reverse"
              control={<Checkbox id="remerber-me" defaultChecked />}
              label={<small>Recordarme</small>}
              sx={{
                marginRight: 0,
                transition: "opacity 0.25s",
                ".MuiCheckbox-root": {
                  paddingRight: 0,
                },
                "&:has(input:not(:checked))": {
                  opacity: "0.5",
                },
              }}
            />
          </div>
          <Link
            className="d-end"
            style={{ opacity: "0.5" }}
            color="inherit"
            underline="hover"
            href="#"
          >
            <small className="d-center">
              ¿Olvidaste tu contraseña? <LockResetIcon sx={{ ml: 1 }} />
            </small>
          </Link>
        </div>

        <Button variant="contained" fullWidth onClick={handleLogin}>
          Iniciar
        </Button>

        <Typography variant="caption" className="mt-20px">
          ¿No tienes una cuenta?{" "}
          <Link
            underline="hover"
            href="#"
            style={{ color: "var(--verde-cielo)" }}
          >
            <b>Registrate</b>
          </Link>
        </Typography>
      </div>
    </PaperP>
  );
}

class Credentials extends Component {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };
  }

  handleClickShowPassword() {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  }

  static handleMouseDownPassword(e) {
    e.preventDefault();
  }

  static handleMouseUpPassword(e) {
    e.preventDefault();
  }

  render() {
    const { showPassword } = this.state;

    return (
      <div className="flex-col gap-40px">
        <div className="flex-col">
          <Typography variant="caption" color="secondary">
            <small>Correo electrónico</small>
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "flex-end" }}>
            <EmailIcon sx={{ mr: 1 }} color="secondary" />
            <Input
              fullWidth
              id="username"
              placeholder="Ingresa Correo electrónico"
              color="primary"
              variant="filled"
            />
          </Box>
        </div>
        <div className="flex-col">
          <Typography variant="caption" color="secondary">
            <small>Contraseña</small>
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "flex-end" }}>
            <HttpsIcon sx={{ mr: 1 }} color="secondary" />
            <FormControl variant="standard" fullWidth>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa Contraseña"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                      onMouseUp={this.handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </div>
      </div>
    );
  }
}
