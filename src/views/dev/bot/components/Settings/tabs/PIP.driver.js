import {
  DriverComponent,
  showError,
  showPromise,
  driverParams,
} from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_STRATEGY,
  HTTPPATCH_USEROPERATION_STRATEGY,
} from "@api";

export const driverPIP = DriverComponent({
  idDriver: "settings-pip",
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
      pips: 0,
      umbral: 0,
      percent_wick: 0,
      percent_stop_loss: 0,
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
    const id_coin = driverParams.getOne("id_coin");
    if (!user_id || !id_coin) {
      return;
    }

    await HTTPGET_USEROPERATION_STRATEGY({
      user_id,
      id_coin,
      strategy: "pips",
      failure: () => {
        showError("Error al cargar configuración Pips");
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
    const id_coin = driverParams.getOne("id_coin");
    if (!user_id || !id_coin) {
      return;
    }

    await showPromise("Guardando configuración PIP...", (resolve) => {
      HTTPPATCH_USEROPERATION_STRATEGY({
        user_id,
        id_coin,
        strategy: "pips",
        new_config: this.stringifyConfig(),
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
          rejectPromise("Error al guardar configuración PIP", resolve);
        },
      });
    });
  },

  updateFromForm() {
    const originalConfig = JSON.stringify(this.getConfig());
    this.setFromIdFormConfig("pip-form");
    const newConfig = JSON.stringify(this.getConfig());

    // Detectar si hubo cambios
    if (originalConfig !== newConfig) {
      this.setWasChanged(true);
    }
  },
});
