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
      pips: {
        type: Number,
        positive: true,
        label: "Pips",
        p: [0, 0],
      },
      umbral: {
        type: Number,
        min: 0,
        step: 0.01,
        label: "Umbral",
        p: [0, 1],
      },
      percent_wick: {
        type: Number,
        min: 0,
        step: 0.01,
        label: "Porcentaje de mecha (%)",
        p: [1, 0],
      },
      percent_stop_loss: {
        type: Number,
        min: 0,
        step: 0.01,
        label: "Stop Loss (%)",
        p: [1, 1],
      },
    },
    value: {
      pips: 0,
      umbral: 0,
      percent_wick: 0,
      percent_stop_loss: 0,
    },
    mapCase: {
      tooltipSaveButton: {
        true: () => "Guardar cambios",
        false: () => "No ha habido cambios para guardar",
      },
    },

    async load() {
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
          this.makeRecordConfig();
          this.setLoading(false);
        },
      });
    },

    async save() {
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
            this.makeRecordConfig();
            resolve("Guardado");
          },
          failure: (info, rejectPromise) => {
            rejectPromise("Error al guardar configuración PIP", resolve);
          },
        });
      });
    },
  },
});
