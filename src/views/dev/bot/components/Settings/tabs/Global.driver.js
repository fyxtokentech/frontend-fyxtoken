import {
  DriverComponent,
  showError,
  showPromise,
} from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_STRATEGY,
  HTTPPATCH_USEROPERATION_STRATEGY,
} from "@api";
import { driverPanelRobot } from "../../../bot.driver";

export const driverGlobal = DriverComponent({
  idDriver: "settings-global",
  loading: {
    isBoolean: true,
    value: true,
  },
  saving: {
    isBoolean: true,
    value: false,
    mapCase: {
      textButtonSave: {
        false: () => "Guardar cambios",
        true: () => "Guardando...",
      },
    },
  },
  config: {
    isObject: true,
    value: {
      min_profit_percent: 0,
      rsi_percent_danger: 0,
      min_profit_currency: 0,
    },
  },
  wasChanged: {
    isBoolean: true,
    value: false,
    mapCase: {
      tooltipSaveButton: {
        true: () => "Guardar cambios",
        false: () => "No ha habido cambios para guardar",
      },
    },
  },

  async loadConfig() {
    const { user_id } = window.currentUser;
    const id_coin = driverPanelRobot.getIdCoin();
    if (!user_id || !id_coin) {
      this.setLoading(false);
      return;
    }

    await HTTPGET_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "global",
      failure: () => {
        showError("Error al cargar configuración global");
        this.setLoading(false);
      },
      successful: ([data]) => {
        this.assignConfig(data);
        this.setWasChanged(false);
        this.setLoading(false);
      },
    });
  },

  async saveConfig() {
    const { user_id } = window.currentUser;
    const id_coin = driverPanelRobot.getIdCoin();
    if (!user_id || !id_coin) {
      return;
    }

    const config = this.getConfig();

    await showPromise("Guardando configuración global...", (resolve) => {
      HTTPPATCH_USEROPERATION_STRATEGY({
        user_id,
        id_coin,
        strategy: "global",
        new_config: JSON.stringify(config),
        willStart: () => {
          this.setSaving(true);
        },
        willEnd: () => {
          this.setSaving(false);
        },
        successful: () => {
          this.setWasChanged(false);
          resolve("Guardado");
        },
        failure: (info, rejectPromise) => {
          rejectPromise("Error al guardar configuración global", resolve);
        },
      });
    });
  },

  updateFromForm() {
    const originalConfig = JSON.stringify(this.getConfig());
    this.setFromIdFormConfig("global-form");
    const newConfig = JSON.stringify(this.getConfig());

    // Detectar si hubo cambios
    if (originalConfig !== newConfig) {
      this.setWasChanged(true);
    }
  },
});
