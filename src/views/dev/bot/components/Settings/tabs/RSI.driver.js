import { DriverComponent, showError, showPromise } from "@jeff-aporta/camaleon";
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
      delta: {
        negative: {
          type: Number,
          positive: true,
          label: "Delta negativo",
          p: [0, 0],
        },
        positive: {
          type: Number,
          positive: true,
          label: "Delta positivo",
          p: [0, 1],
        },
      },
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
        p: [1, 0],
      },
      operate_intermediate: {
        type: Boolean,
        mode: "checkbox",
        label: "Operar en niveles intermedios",
        p: [2, 0],
      },
      oversold_overbought: {
        type: "slider",
        vinculate: true,
        description: "Configuración de Sobreventa y Sobrecompra",
        step: 0.01,
        labelMin: "Sobreventa",
        labelMax: "Sobrecompra",
        v1: {
          min: 0,
          max: 100,
          p: [3, 0],
        },
        v2: {
          min: 0,
          max: 100,
          p: [3, 1],
        },
      },
      oversold: {
        type: Number,
        min: 0,
        max: 100,
        step: 0.01,
        label: "Sobreventa",
        p: [4, 0],
      },
      overbought: {
        type: Number,
        min: 0,
        max: 100,
        step: 0.01,
        label: "Sobrecompra",
        p: [4, 1],
      },
    },
    value: {
      delta: { negative: 1, positive: 1 },
      period: "5 minutos",
      oversold: 50,
      overbought: 50,
      operate_intermediate: false,
    },
    mapCase: {
      tooltipSaveButton: {
        true: () => "Guardar cambios",
        false: () => "No ha habido cambios para guardar",
      },
    },
    async load() {
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
          this.assignConfig({
            ...data,
            period: this.periodObjToText(data.period || { unit: "m", value: 5 }),
            operate_intermediate: data.operate_intermediate === "S",
          });
          // Sincronizar variables del slider
          this.setSliderOversold(data.oversold);
          this.setSliderOverbought(data.overbought);
          this.makeRecordConfig();
          this.setLoading(false);
        },
      });
    },
    async save() {
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
        operate_intermediate: ["N", "S"][+!!config.operate_intermediate],
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
            this.makeRecordConfig();
            resolve("Guardado");
          },
          failure: (info, rejectPromise) => {
            rejectPromise("Error al guardar configuración RSI", resolve);
          },
        });
      });
    },
  },
  // Variables temporales para el slider
  sliderOversold: {
    isNumber: true,
    value: 50,
    digits: 2,
    _willSet_(newValue) {
      const currentConfig = this.getConfig();
      this.assignConfig({
        ...currentConfig,
        oversold: newValue,
      });
    },
  },
  sliderOverbought: {
    isNumber: true,
    value: 50,
    digits: 2,
    _willSet_(newValue) {
      const currentConfig = this.getConfig();
      this.assignConfig({
        ...currentConfig,
        overbought: newValue,
      });
    },
  },

  updateSliderValues([oversold, overbought]) {
    // Actualizar variables del slider
    this.setSliderOversold(oversold);
    this.setSliderOverbought(overbought);
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
