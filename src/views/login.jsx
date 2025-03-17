import React from "react";

import { ThemeSwitcher } from "@components/templates";
import { DivM, PaperP } from "@components/containers.jsx";
import {
  isDark,
  controlComponents,
} from "@jeff-aporta/theme-manager";


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

export default Index;

function Index() {
  return (
    <ThemeSwitcher bgtype="2" h_init="100px" h_fin="100px">
      <DivM m_max={40} className="d-center min-h-50vh">
        <LoginForm />
      </DivM>
    </ThemeSwitcher>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
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
      <Credentials
        {...{
          showPassword,
          handleClickShowPassword,
          handleMouseDownPassword,
          handleMouseUpPassword,
        }}
      />
      <div className="d-flex-col ai-end gap-10px fullWidth">
        <div
          className="d-flex-col ai-end gap-10px"
          style={{ scale: "0.8", transformOrigin: "right center" }}
        >
          <div>
            <FormControlLabel
              color="secondary"
              className="d-flex fd-row-reverse"
              control={
                <themized.Checkbox
                  id="remerber-me"
                  defaultChecked
                />
              }
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

        <Button variant="contained" fullWidth href="wallet">
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
function Credentials({
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleMouseUpPassword,
}) {
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
            id="email"
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
        <Box sx={{ display: "inline-flex", alignItems: "end" }}>
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
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
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
