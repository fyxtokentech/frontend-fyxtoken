import {
  DriverComponent,
  showError,
  showPromise,
} from "@jeff-aporta/camaleon";
import {
  HTTPGET_USEROPERATION_STRATEGY,
  HTTPPATCH_USEROPERATION_STRATEGY,
} from "@api";
import { driverPanelRobot } from "../../../bot.driver.js";

export const driverRSI = DriverComponent({
  idDriver: "settings-rsi",
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
      delta: { negative: 1, positive: 1 },
      period: "5 minutos",
      oversold: 1,
      overbought: 99,
      operate_intermediate: false,
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
  // Variables temporales para el slider
  sliderOversold: {
    isNumber: true,
    value: 50,
  },
  sliderOverbought: {
    isNumber: true,
    value: 50,
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
      strategy: "rsi",
      failure: () => {
        showError("Error al cargar configuración RSI");
        this.setLoading(false);
      },
      successful: ([data]) => {
        // Convertir period de objeto a texto para el frontend
        const configForFrontend = {
          ...data,
          period: this.periodObjToText(data.period || { unit: "m", value: 5 }),
          operate_intermediate: data.operate_intermediate === "S",
        };
        this.assignConfig(configForFrontend);
        // Sincronizar variables del slider
        this.setSliderOversold(data.oversold);
        this.setSliderOverbought(data.overbought);
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

    // Convertir period de texto a objeto para el backend
    const config = this.getConfig();
    const new_config = {
      ...config,
      period: this.periodTextToObj(config.period),
      operate_intermediate: ["N", "S"][+config.operate_intermediate],
    };

    await showPromise("Guardando configuración RSI...", (resolve) => {
      HTTPPATCH_USEROPERATION_STRATEGY({
        user_id,
        id_coin,
        strategy: "rsi",
        new_config: JSON.stringify(new_config),
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
          rejectPromise("Error al guardar configuración RSI", resolve);
        },
      });
    });
  },

  updateFromForm() {
    const originalConfig = JSON.stringify(this.getConfig());
    this.setFromIdFormConfig("rsi-form");
    if (originalConfig !== JSON.stringify(this.getConfig())) {
      this.setWasChanged(true);
    }
  },

  updateSliderValues([oversold, overbought]) {
    const originalConfig = JSON.stringify(this.getConfig());

    // Actualizar variables del slider
    this.setSliderOversold(oversold);
    this.setSliderOverbought(overbought);

    // Actualizar config
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      oversold,
      overbought,
    };
    this.assignConfig(newConfig);

    // Detectar cambios
    if (originalConfig !== JSON.stringify(newConfig)) {
      this.setWasChanged(true);
    }
  },

  // Utilidades para conversión periodo texto <-> objeto
  periodTextToObj(txt) {
    // "5 minutos" → {unit: 'm', value: 5}
    if (!txt) {
      return { unit: "m", value: 5 };
    }
    if (txt.includes("minuto")) {
      return { unit: "m", value: parseInt(txt) };
    }
    if (txt.includes("hora")) {
      return { unit: "h", value: parseInt(txt) };
    }
    if (txt.includes("día")) {
      return { unit: "d", value: parseInt(txt) };
    }
    if (txt.includes("semana")) {
      return { unit: "s", value: parseInt(txt) };
    }
    if (txt.includes("mes")) {
      return { unit: "M", value: parseInt(txt) };
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
