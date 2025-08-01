import { DriverComponent, IS_GITHUB } from "@jeff-aporta/camaleon";
import { driverTables } from "../tables.js";
import mock_transaction from "./mock-transaction.json";

import { HTTPGET_TRANSACTIONS, HTTPGET_OPERATION_ID } from "@api";

export const driverTableTransactions = DriverComponent({
  idDriver: "table-transactions",
  tableTransactions: {},
  tableData: {
    value: IS_GITHUB ? mock_transaction : [],
  },
  nameCoin: {
    find() {
      const { name_coin } =
        this.getTableData().find((m) => m["name_coin"]) ?? {};
      return name_coin;
    },
  },
  idOperation: {
    nameParam: "id_operation",
    update({ setValue }) {
      const {
        id_operation = this.getIdOperation(), //
      } = driverTables.getOperationRow() || {};
      setValue(id_operation);
    },
  },
  loading: {
    isBoolean: true,
    value: true,
  },
  loadingOperation: {
    isBoolean: true,
    value: false,
  },
  async loadOperation({ id_operation }) {
    if (!driverTables.getOperationRow() && id_operation) {
      this.setLoadingOperation(true);
      await HTTPGET_OPERATION_ID({
        operationID: id_operation,
        successful: ([data]) => {
          driverTables.setOperationRow(data);
          this.updateIdOperation();
          this.setLoadingOperation(false);
        },
      });
    }
  },

  async loadData({ id_operation, user_id }) {
    await HTTPGET_TRANSACTIONS({
      id_operation,
      successful: (data) => {
        console.log({ data });
        driverTableTransactions.setTableData(data);
      },
      failure() {
        driverTableTransactions.setTableData([]);
      },
      checkErrors: () => {
        if (!user_id) {
          return toOperation("No hay usuario seleccionado");
        }
        if (!id_operation) {
          return toOperation("No hay operación seleccionada");
        }
      },
    });

    function toOperation(msg) {
      driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
      return msg;
    }
  },
});
