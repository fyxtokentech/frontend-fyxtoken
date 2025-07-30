import React from "react";

import { HTTPPOST_TRY_LOGIN } from "@api";
import {
  DriverComponent,
  showError,
  href,
  IS_GITHUB,
  showPromise,
} from "@jeff-aporta/camaleon";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export const driverLogin = DriverComponent({
  idDriver: "login",
  msgAlert: {
    _willSet_(msgAlert, { getValue, setValue }) {
      if (!msgAlert) {
        return;
      }
      setTimeout(() => setValue(""), 10000);
    },
  },
  rememberMe: {
    isBoolean: true,
    value: false,
    mapCase: {
      color: {
        true: () => "l2",
        false: () => "secondary",
      },
      icon: {
        true: () => <CheckBoxIcon />,
        false: () => <CheckBoxOutlineBlankIcon />,
      },
    },
  },
  password: {
    isString: true,
    value: "",
  },
  email: {
    isString: true,
    value: "",
  },
  updateFields() {
    // {username: '', password: ''}
    const fields = Object.fromEntries(
      new FormData(document.getElementById("login-form")).entries()
    );
    this.setEmail(fields.username);
    this.setPassword(fields.password);
  },
  showPassword: {
    isBoolean: true,
    value: false,
    mapCase: {
      iconVisibility: {
        true: () => <VisibilityOff />,
        false: () => <Visibility />,
      },
      textVisibility: {
        true: () => "Ocultar contraseña",
        false: () => "Mostrar contraseña",
      },
      typeInput: {
        true: () => "text",
        false: () => "password",
      },
    },
  },

  basicRulesCredentials() {
    const username = this.getEmail();
    const password = this.getPassword();
    if (!username) {
      return "No hay usuario";
    }
    if (!password) {
      return "No hay contraseña";
    }
    if (!this.checkEmailRuleEmail(username)) {
      return "Ingresa un correo electrónico válido";
    }
    if (password.length < 4) {
      return "Contraseña muy corta";
    }
  },

  async handleLogin() {
    const username = this.getEmail();
    const password = this.getPassword();
    // Validaciones de campos
    const basic = this.basicRulesCredentials();
    if (basic) {
      return showError(basic);
    }
    let user;
    await showPromise("Verificando", (resolve) => {
      HTTPPOST_TRY_LOGIN({
        username,
        password,
        successful([user_]) {
          user = user_;
          resolve("Bienvenido");
          if (!user && IS_GITHUB) {
            user = {
              user_id: "2d35c015-5097-46ff-b50c-f89678ee59f0",
              name: "Jeffrey",
              last_name: "Agudelo",
              email: "jeffrey.alexander.agudelo.espitia@gmail.com",
            };
          }
        },
        failure(info, reject) {
          driverLogin.setMsgAlert("Credenciales no coinciden");
          reject("Credenciales no coinciden", resolve, info);
        },
      });
    });

    if (!user) {
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.currentUser = user;
    window.location.href = href("@wallet");
  },
});
