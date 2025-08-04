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
    lastRecord: "",
    _setup_({ makeRecord }) {
      makeRecord();
    },
    makeRecord({ setLastRecord, stringify, notifyLinks }) {
      setLastRecord(stringify());
      notifyLinks();
    },
    isChanged({ getLastRecord, stringify }) {
      return getLastRecord() == stringify();
    },
    modelForm: {
      period: {
        type: "select",
        label: "Periodo",
        options: [
          "5 minutos",
          "10 minutos",
          "15 minutos",
          "30 minutos",
          "1 hora",
          "1 día",
        ],
        p: [0, 0],
      },
      percent: {
        down: {
          type: Number,
          min: 0,
          max: 10,
          step: 0.01,
          label: "Baja (%)",
          p: [1, 0],
        },
        up: {
          type: Number,
          min: 0,
          max: 10,
          step: 0.01,
          label: "Subida (%)",
          p: [1, 1],
        },
      },
    },
    value: {
      period: { unit: "m", value: 5 },
      percent: { down: 0, up: 0 },
    },
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
    const id_coin = driverPanelRobot.getIdCoin();
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
        this.assignConfig({
          ...data,
          period: this.periodObjToText(data.period),
        });
        this.setSliderPercentDown(data.percent?.down ?? 0);
        this.setSliderPercentUp(data.percent?.up ?? 0);
        this.makeRecordConfig();
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

    const new_config = {
      ...config,
      period: this.periodTextToObj(config.period),
    };

    await showPromise("Guardando configuración de velas...", (resolve) => {
      HTTPPATCH_USEROPERATION_STRATEGY({
        user_id,
        id_coin,
        strategy: "candle",
        new_config: JSON.stringify(new_config),
        willStart: () => {
          this.setSaving(true);
        },
        willEnd: () => {
          this.setSaving(false);
        },
        successful: () => {
          this.makeRecordConfig();
          resolve("Guardado");
        },
        failure: (info, rejectPromise) => {
          rejectPromise("Error al guardar configuración de velas", resolve);
        },
      });
    });
  },

  

  updateSliderPercentDown(value) {
    // Actualizar variable del slider
    this.setSliderPercentDown(value);

    // Actualizar config
    const currentConfig = this.getConfig();
    this.assignConfig({
      ...currentConfig,
      percent: {
        ...currentConfig.percent,
        down: value,
      },
    });
  },

  updateSliderPercentUp(value) {
    // Actualizar variable del slider
    this.setSliderPercentUp(value);

    // Actualizar config
    const currentConfig = this.getConfig();
    this.assignConfig({
      ...currentConfig,
      percent: {
        ...currentConfig.percent,
        up: value,
      },
    });
  },

  // Utilidades para conversión periodo texto <-> objeto
  periodTextToObj(txt) {
    if (!txt) {
      return { unit: "m", value: 5 };
    }
    const value = parseInt(txt);
    const unitMap = {
      minuto: "m",
      hora: "h",
      día: "d",
      semana: "s",
      mes: "M",
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
