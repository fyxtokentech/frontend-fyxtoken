import React, { Component } from "react";
import Alert from "@mui/material/Alert";

import { DivM, PaperP, TooltipGhost } from "@jeff-aporta/camaleon";
import { Main } from "@theme/main.jsx";

import {
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Typography,
  Link,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import LockResetIcon from "@mui/icons-material/LockReset";

import { driverLogin } from "./login.driver.js";

export default function () {
  return (
    <Main bgtype="portal">
      <DivM className="d-center" style={{ minHeight: "75vh" }}>
        <LoginForm />
      </DivM>
    </Main>
  );
}

class LoginForm extends Component {
  render() {
    return (
      <div className="flex col-direction">
        <AlertError />
        <BodyForm />
      </div>
    );

    function AlertError() {
      const RETURN = class extends Component {
        componentDidMount() {
          driverLogin.addLinkMsgAlert(this);
        }
        componentWillUnmount() {
          driverLogin.removeLinkMsgAlert(this);
        }
        render() {
          const msgAlert = driverLogin.getMsgAlert();
          if (!msgAlert) {
            return;
          }
          return (
            <>
              <Alert className="titiling" variant="filled" severity="error">
                {msgAlert}
              </Alert>
              <br />
            </>
          );
        }
      };
      return <RETURN />;
    }

    function BodyForm() {
      return (
        <PaperP className="flex wrap col-direction gap-20px">
          <div className="padw-20px">
            <Title />
            <Divider />
            <br />
            <Credentials />
            <br />
            <Divider />
            <Actions />
          </div>
        </PaperP>
      );

      function Title() {
        return (
          <center className="pad-10px">
            <Typography variant="h4">Ingresa al Wallet</Typography>
          </center>
        );
      }

      function Actions() {
        return (
          <div className="flex col-direction gap-5px">
            <OptionAccount />
            <br />
            <ButtonMakeLogin />
            <br />
            <Divider />
            <SignUpNotAccount />
          </div>
        );

        function OptionAccount() {
          return (
            <div className="flex col-direction padh-10px">
              <Rememberme />
              <ForgotPass />
            </div>
          );

          function ForgotPass() {
            return (
              <Button
                size="small"
                color="secondary"
                variant="text"
                href="#"
                startIcon={<LockResetIcon fontSize="small" />}
                className="flex justify-start"
              >
                <small>¿Olvidaste tu contraseña?</small>
              </Button>
            );
          }

          function Rememberme() {
            const RETURN = class extends Component {
              componentDidMount() {
                driverLogin.addLinkRememberMe(this);
              }
              componentWillUnmount() {
                driverLogin.removeLinkRememberMe(this);
              }
              render() {
                return (
                  <Button
                    size="small"
                    color={driverLogin.mapCaseRememberMe("color")}
                    variant="text"
                    onClick={() => driverLogin.setRememberMe((x) => !x)}
                    startIcon={driverLogin.mapCaseRememberMe("icon")}
                    className="flex justify-start"
                  >
                    Recordarme
                  </Button>
                );
              }
            };
            return <RETURN />;
          }
        }

        function ButtonMakeLogin() {
          const RETURN = class extends Component {
            componentDidMount() {
              driverLogin.addLinkEmail(this);
              driverLogin.addLinkPassword(this);
            }
            componentWillUnmount() {
              driverLogin.removeLinkEmail(this);
              driverLogin.removeLinkPassword(this);
            }

            render() {
              const basic = driverLogin.basicRulesCredentials();
              return (
                <TooltipGhost title={basic || "Iniciar sesión"}>
                  <div>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={basic}
                      onClick={driverLogin.handleLogin}
                    >
                      Iniciar
                    </Button>
                  </div>
                </TooltipGhost>
              );
            }
          };
          return <RETURN />;
        }

        function SignUpNotAccount() {
          return (
            <Typography variant="caption" className="mt-20px">
              ¿No tienes una cuenta?{" "}
              <Link underline="hover" href="#">
                <b>Registrate</b>
              </Link>
            </Typography>
          );
        }
      }
    }
  }
}

class InputCredential extends Component {
  componentDidMount() {
    if (!this.props.isPassword) {
      return;
    }
    driverLogin.addLinkShowPassword(this);
  }

  componentWillUnmount() {
    if (!this.props.isPassword) {
      return;
    }
    driverLogin.removeLinkShowPassword(this);
  }

  render() {
    const { title, icon, children } = this.props;
    return (
      <div>
        <Typography variant="caption" color="secondary">
          <small>{title}</small>
        </Typography>
        <br />
        <div className="flex align-center">
          {icon}
          {children}
        </div>
      </div>
    );
  }
}

class Credentials extends Component {
  render() {
    const showPassword = driverLogin.getShowPassword();
    const propsIcon = {
      sx: { mr: 1 },
      color: "secondary",
      fontSize: "small",
    };
    return (
      <Box
        component="form"
        id="login-form"
        className="flex col-direction gap-20px"
      >
        <EMail />
        <Password />
      </Box>
    );

    function Password() {
      const RETURN = class extends Component {
        componentDidMount() {
          driverLogin.addLinkShowPassword(this);
        }

        componentWillUnmount() {
          driverLogin.removeLinkShowPassword(this);
        }

        render() {
          return (
            <InputCredential
              isPassword
              title="Contraseña"
              icon={<HttpsIcon {...propsIcon} />}
            >
              <Input
                name="password"
                defaultValue={driverLogin.getPassword()}
                onChange={() => driverLogin.updateFields()}
                type={driverLogin.mapCaseShowPassword("typeInput")}
                placeholder="Ingresa la contraseña"
                sx={{
                  "& input::placeholder": {
                    fontSize: "smaller",
                  },
                }}
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <TooltipGhost
                      title={driverLogin.mapCaseShowPassword("textVisibility")}
                    >
                      <IconButton
                        onClick={() => {
                          driverLogin.setShowPassword((x) => !x);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onMouseUp={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {driverLogin.mapCaseShowPassword("iconVisibility")}
                      </IconButton>
                    </TooltipGhost>
                  </InputAdornment>
                }
              />
            </InputCredential>
          );
        }
      };
      return <RETURN />;
    }

    function EMail() {
      return (
        <InputCredential
          title="Correo electrónico"
          icon={<EmailIcon {...propsIcon} />}
        >
          <Input
            fullWidth
            name="username"
            defaultValue={driverLogin.getEmail()}
            onChange={() => driverLogin.updateFields()}
            placeholder="Ingresa el correo electrónico"
            sx={{
              "& input::placeholder": {
                fontSize: "smaller",
              },
            }}
            color="primary"
            variant="filled"
          />
        </InputCredential>
      );
    }
  }
}
