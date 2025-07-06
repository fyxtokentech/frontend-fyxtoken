import React, { Component } from "react";

import {
  driverParams,
  subscribeParam,
  showError,
  sleep,
  Delayer,
  addModelFormat,
  addNumberFormat,
  getNumberFormat,
  TooltipGhost,
  JS2CSS,
} from "@jeff-aporta/camaleon";

import BenefitUplineIcon from "@mui/icons-material/TrendingUpOutlined";
import BenefitDownlineIcon from "@mui/icons-material/TrendingDownOutlined";
import BenefitConstantlineIcon from "@mui/icons-material/TrendingFlatOutlined";
import { Chip, Tooltip, Typography } from "@mui/material";

const tablesLoaded = {};
const driverTablesLoaded = {};
const delayers = {};

addNumberFormat({
  toCoin(value, local) {
    const { precision2SmallNumber, numberFormat } = getNumberFormat();
    const number_format = precision2SmallNumber({ value });
    const { retorno } = numberFormat(number_format, value, local, "");
    return retorno;
  },
  toCoinDifference(value1, value2, local) {
    const { precision2SmallNumber, numberFormat } = getNumberFormat();
    // No es necesario abs en diff, precision2SmallNumber lo infiere
    const diff = (value1 - value2) / 10;
    const number_format = precision2SmallNumber({ value: diff });
    const { retorno } = numberFormat(number_format, value1, local, "");
    return retorno;
  },
  precision2SmallNumber({ value }) {
    const absValue = Math.abs(+value);
    if (!absValue || isNaN(absValue)) {
      return { maximumFractionDigits: 2 };
    }
    const decimals = Math.min(
      8,
      Math.max(2, Math.floor(1 - Math.log10(absValue)) + 4)
    );
    return { maximumFractionDigits: decimals };
  },
});

const currentCoin = currentSufix("name_coin");

const {
  renderInfo: renderInfoNameCoin, //
  ...propsNameCoin
} = currentCoin;

JS2CSS.insertStyle({
  id: "custom-tables-css",
  ".MuiDataGrid-cell": {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
});

addModelFormat({
  currentSufix,
  currentCoin,
  profit_op: {
    ...propsNameCoin,
    extra_width: 30,
    component: "ReserveLayer",
    className: "fill",
    renderInfo: {
      ...renderInfoNameCoin,
      iconized: iconized_real_roi(true),
    },
  },
  profit: {
    ...propsNameCoin,
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    renderInfo: {
      ...renderInfoNameCoin,
      iconized: iconized_real_roi(),
    },
  },
});

export const driverTables = {
  TABLE_TRANSACTIONS: "transactions",
  TABLE_OPERATIONS: "operations",

  setViewTable(newViewTable) {
    driverParams.set({ view_table: newViewTable });
  },

  getViewTable() {
    return driverParams.init("view_table", driverTables.TABLE_OPERATIONS);
  },

  refetch(cb) {
    Object.entries(tablesLoaded).forEach(([name, table]) => {
      const loadingEffect = cb === true;
      const driver = driverTables.getDriverTable(name);
      if (cb && typeof cb === "function") {
        if (driver) {
          const { loading } = cb({ name, driver, table });
          if (loading) {
            loadingEffect = loading;
          }
        }
      }
      if(driver && driver.setLoading && loadingEffect){
        driver.setLoading(!!loadingEffect)
      }
      table.fetchData && table.fetchData();
    });
  },

  getOperationRow() {
    return driverTables.operation_row;
  },

  setOperationRow(row) {
    driverTables.operation_row = row;
  },

  addTableAndDriver(name, table, driver) {
    driverTables.addDriverTable(name, driver);
    driverTables.addTable(name, table);
  },

  removeTableAndDriver(name) {
    driverTables.removeDriverTable(name);
    driverTables.removeTable(name);
  },

  getDriverTable(name) {
    return driverTablesLoaded[name];
  },

  addDriverTable(name, driver) {
    driverTablesLoaded[name] = driver;
  },

  removeDriverTable(name) {
    delete driverTablesLoaded[name];
  },

  addTable(name, table) {
    tablesLoaded[name] = table;
  },

  removeTable(name) {
    delete tablesLoaded[name];
  },
  newTable,
};

function newTable({
  componentDidMount = () => {},
  componentWillUnmount = () => {},
  fetchData = () => {},
  prefetch = () => {},
  paramsKeys = [],
  user_id_required,
  cbErrorParams,
  name_table,
  allParamsRequiredToFetch = false,
  init = () => {},
  startFetch = () => {},
  endFetch = () => {},
  fetchError = () => {},
  render,
  driver,
  ...props
} = {}) {
  delayers[name_table] ??= Delayer(1000);

  const delayerFetch = delayers[name_table];

  let paramsValues;
  let params;

  return class extends Component {
    constructor(props) {
      super(props);
      init.bind(this)(this.contextGeneral());
    }

    getDriver() {
      return driver || driverTables.getDriverTable(name_table) || {};
    }

    setLoading(val) {
      this.getDriver().setLoading && this.getDriver().setLoading(val);
    }

    contextGeneral() {
      return {
        driver: this.getDriver(),
      };
    }

    endFetchEnvolve(props) {
      endFetch.bind(this)(props);
      this.setLoading(false);
    }

    async fetchData({ deep = 0 } = {}) {
      loadParams();
      startFetch.bind(this)(this.contextGeneral());
      await prefetch.bind(this)(params, this.contextGeneral());
      if (!(await protocolFetch.bind(this)(deep))) {
        return this.endFetchEnvolve({ error: true });
      }
      try {
        await fetchData.bind(this)(params, this.contextGeneral());
      } catch (e) {
        showError(e.message || e);
        fetchError.bind(this)();
      }
      this.endFetchEnvolve({ error: false, ...this.contextGeneral() });
    }

    componentDidMount() {
      componentDidMount.bind(this)();
      driverTables.addTableAndDriver(name_table, this, driver);
      this.fetchData();
      if(driver){
        driver.addLinkLoading(this);
        driver.addLinkTableData(this);
      }
    }

    componentWillUnmount() {
      driverTables.removeTableAndDriver(name_table);
      componentWillUnmount.bind(this)();
      if(driver){
        driver.removeLinkLoading(this);
        driver.removeLinkTableData(this);
      }
    }

    render() {
      return render.bind(this)(this.contextGeneral());
    }
  };

  function loadParams() {
    paramsValues = driverParams.get(...paramsKeys);
    params = paramsValues.reduce((acc, item, index) => {
      acc[paramsKeys[index]] = item;
      return acc;
    }, {});
    if (user_id_required) {
      params.user_id = (window.currentUser || {}).user_id;
    }
  }

  async function protocolFetch(deep = 0) {
    if (allParamsRequiredToFetch && paramsValues.some((item) => !item)) {
      if (deep > 1) {
        showError("Problema al obtener datos en URLParams", params);
      }
      if (cbErrorParams) {
        cbErrorParams();
        return false;
      } else {
        // await sleep(100);
        return await this.fetchData({ deep: deep + 1 });
      }
    }
    if (!delayerFetch.isReady()) {
      console.log("Fetch cancelado, tiempo de espera");
      return false;
    }
    return true;
  }
}

function currentSufix(sufix) {
  return {
    fit_content: true,
    renderInfo: {
      local: "es-ES",
      sufix,
      type: "number",
      "number-format": getNumberFormat().precision2SmallNumber,
    },
  };
}

function iconized_real_roi(op = false) {
  return (params, renderString) => {
    if (!params) {
      return renderString;
    }
    let { value } = params;
    const { real_roi } = params.row;
    let icon, color;

    if (value == 0) {
      icon = <BenefitConstantlineIcon />;
      color = "warning";
    }
    if (value < 0) {
      icon = <BenefitDownlineIcon />;
      color = "error";
    }
    if (value > 0) {
      icon = <BenefitUplineIcon />;
      color = "ok";
    }

    const texto = (() => {
      return (
        <Typography
          component="span"
          color={color}
          variant="body2"
          className="layer fill padw-5px flex justify-space-between align-center gap-10px"
        >
          <span
            style={{
              display: "inline-flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {icon}
            {renderString}
          </span>
          {real_roi ? (
            <Chip
              label={`${real_roi.toFixed(2)}%`}
              size="small"
              variant="filled"
              sx={{
                transform: "scale(0.8)",
                fontSize: "smaller",
              }}
            />
          ) : (
            ""
          )}
        </Typography>
      );
    })();
    const tooltip = (() => {
      if (op && real_roi) {
        const percent = ["", `(${real_roi.toFixed(2)}%)`][+!!real_roi];
        return `${renderString} ${percent}`;
      }
      return renderString;
    })();
    const strings = { texto, tooltip };
    return strings;
  };
}
