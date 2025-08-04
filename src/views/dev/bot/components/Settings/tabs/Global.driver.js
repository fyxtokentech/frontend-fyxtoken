import { DriverComponent, showError, showPromise } from "@jeff-aporta/camaleon";
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
      min_profit_percent: {
        type: Number,
        min: 0,
        step: 0.01,
        label: "Porcentaje mínimo de ganancia (%)",
        p: [0, 0],
      },
      rsi_percent_danger: {
        type: Number,
        min: 0,
        max: 100,
        step: 0.01,
        label: "Porcentaje de peligro RSI (%)",
        p: [0, 1],
      },
      min_profit_currency: {
        type: Number,
        min: 0,
        step: 0.01,
        label: "Ganancia mínima en moneda",
        p: [1, 0],
      },
    },
    value: {
      min_profit_percent: 0,
      rsi_percent_danger: 0,
      min_profit_currency: 0,
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
        strategy: "global",
        failure: () => {
          showError("Error al cargar configuración global");
          this.setLoading(false);
        },
        successful: ([data]) => {
          this.assignConfig(data);
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
            this.makeRecordConfig();
            resolve("Guardado");
          },
          failure: (info, rejectPromise) => {
            rejectPromise("Error al guardar configuración global", resolve);
          },
        });
      });
    },
  },

  updateFromForm() {
    this.setFromIdFormConfig("global-form");
  },
});
