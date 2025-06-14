import React, { Component, useState } from "react";
import Alert from "@mui/material/Alert";
import toast, { Toaster } from "react-hot-toast";

import { ThemeSwitcher, showError } from "@templates";
import { DivM, PaperP } from "@containers";
import { isDark, controlComponents, href } from "@jeff-aporta/theme-manager";

import { HTTPPOST_TRY_LOGIN } from "@api";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import fluidCSS from "@jeff-aporta/fluidcss";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function () {
  return (
    <ThemeSwitcher bgtype="portal" h_init="100px" h_fin="100px">
      <DivM m_max={40} className="d-center min-h-50vh">
        <LoginForm />
      </DivM>
    </ThemeSwitcher>
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
    const user = await HTTPPOST_TRY_LOGIN({ username, password });

    if (window.isResponseError(user)) {
      showError("Credenciales inválidas");
      return;
    }
    const target = href({ view: "@wallet" });
    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    window.location.href = target;
  };

  const { themized } = controlComponents();

  return (
    <PaperP
      elevation={6}
      className="d-flex-col flex-wrap gap-30px min-h-150px w-fit"
    >
      <center className="pad-10px">
        <Typography variant="h4">Ingresa al Wallet</Typography>
      </center>
      <Credentials />
      <div className="d-flex-col ai-end gap-10px fullWidth">
        <div
          className="d-flex-col ai-end gap-10px"
          style={{ scale: "0.8", transformOrigin: "right center" }}
        >
          <div>
            <FormControlLabel
              color="secondary"
              className="d-flex fd-row-reverse"
              control={<themized.Checkbox id="remerber-me" defaultChecked />}
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
    const { enfasis_input } = controlComponents();

    return (
      <div className="d-flex-col gap-40px">
        <div className="d-flex-col">
          <Typography variant="caption" color="secondary">
            <small>Correo electrónico</small>
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "flex-end" }}>
            <EmailIcon sx={{ mr: 1 }} color="secondary" />
            <Input
              fullWidth
              id="username"
              placeholder="Ingresa Correo electrónico"
              color={enfasis_input}
              variant="filled"
            />
          </Box>
        </div>
        <div className="d-flex-col">
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
                color={enfasis_input}
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
