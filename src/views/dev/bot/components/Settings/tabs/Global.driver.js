import {
  DriverComponent,
  inferStringData,
  showError,
  showPromise,
  driverParams,
} from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_STRATEGY,
  HTTPPATCH_USEROPERATION_STRATEGY,
} from "@api";

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
    const id_coin = driverParams.getOne("id_coin");
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
    const id_coin = driverParams.getOne("id_coin");
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

    // Obtener datos del formulario
    const form = document.getElementById("global-form");
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const currentConfig = this.getConfig();

    // Crear nuevo config
    const newConfig = { ...currentConfig };

    // Actualizar campos
    for (const [key, value] of formData.entries()) {
      newConfig[key] = inferStringData(value);
    }

    // Actualizar config
    this.assignConfig(newConfig);

    // Detectar si hubo cambios
    if (originalConfig !== JSON.stringify(newConfig)) {
      this.setWasChanged(true);
    }
  },
});
