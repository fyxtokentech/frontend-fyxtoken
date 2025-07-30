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

export const driverCandle = DriverComponent({
  idDriver: "settings-candle",
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
      period: { unit: "m", value: 5 },
      percent: { down: 0, up: 0 },
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
  // Variables temporales para los sliders
  sliderPercentDown: {
    isNumber: true,
    value: 0,
  },
  sliderPercentUp: {
    isNumber: true,
    value: 0,
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
      strategy: "candle",
      failure: () => {
        showError("Error al cargar configuración de velas");
        this.setLoading(false);
      },
      successful: ([data]) => {
        this.assignConfig(data);
        // Sincronizar variables del slider
        this.setSliderPercentDown(data.percent?.down ?? 0);
        this.setSliderPercentUp(data.percent?.up ?? 0);
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

    await showPromise("Guardando configuración de velas...", (resolve) => {
      HTTPPATCH_USEROPERATION_STRATEGY({
        user_id,
        id_coin,
        strategy: "candle",
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
          rejectPromise("Error al guardar configuración de velas", resolve);
        },
      });
    });
  },

  updateFromForm() {
    const originalConfig = JSON.stringify(this.getConfig());

    // Obtener datos del formulario
    const form = document.getElementById("candle-form");
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const currentConfig = this.getConfig();

    // Crear nuevo config manteniendo la estructura anidada
    const newConfig = { ...currentConfig };

    // Manejar campos anidados
    for (const [key, value] of formData.entries()) {
      if (key.includes(".")) {
        // Campo anidado como "percent.down"
        const [parent, child] = key.split(".");
        if (!newConfig[parent]) {
          newConfig[parent] = {};
        }
        newConfig[parent][child] = inferStringData(value);
      } else {
        // Campo simple
        newConfig[key] = inferStringData(value);
      }
    }

    // Actualizar config
    this.assignConfig(newConfig);

    // Detectar si hubo cambios
    if (originalConfig !== JSON.stringify(newConfig)) {
      this.setWasChanged(true);
    }
  },

  updateSliderPercentDown(value) {
    const originalConfig = JSON.stringify(this.getConfig());

    // Actualizar variable del slider
    this.setSliderPercentDown(value);

    // Actualizar config
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      percent: {
        ...currentConfig.percent,
        down: value,
      },
    };
    this.assignConfig(newConfig);

    // Detectar cambios
    if (originalConfig !== JSON.stringify(newConfig)) {
      this.setWasChanged(true);
    }
  },

  updateSliderPercentUp(value) {
    const originalConfig = JSON.stringify(this.getConfig());

    // Actualizar variable del slider
    this.setSliderPercentUp(value);

    // Actualizar config
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      percent: {
        ...currentConfig.percent,
        up: value,
      },
    };
    this.assignConfig(newConfig);

    // Detectar cambios
    if (originalConfig !== JSON.stringify(newConfig)) {
      this.setWasChanged(true);
    }
  },

  // Utilidades para conversión periodo texto <-> objeto
  periodTextToObj(txt) {
    if (!txt) {
      return { unit: "m", value: 5 };
    }
    const value = parseInt(txt);
    const unitMap = {
      "minuto": "m",
      "hora": "h",
      "día": "d",
      "semana": "s",
      "mes": "M"
    };
    
    for (const [key, unit] of Object.entries(unitMap)) {
      if (txt.includes(key)) {
        return { unit, value };
      }
    }
    return { unit: "m", value: 5 };
  },

  periodObjToText({ unit, value }) {
    if (!unit || !value) {
      return "5 minutos";
    }
    switch (unit) {
      case "m":
        return `${value} minutos`;
      case "h":
        return `${value} hora${value > 1 ? "s" : ""}`;
      case "d":
        return `${value} día${value > 1 ? "s" : ""}`;
      case "s":
        return `${value} semana${value > 1 ? "s" : ""}`;
      case "M":
        return `${value} mes${value > 1 ? "es" : ""}`;
      default:
        return "5 minutos";
    }
  },
});