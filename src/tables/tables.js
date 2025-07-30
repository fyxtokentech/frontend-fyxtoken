import React, { Component } from "react";

import {
  driverParams,
  subscribeParam,
  showError,
  sleep,
  Delayer,
  getModelsFormat,
  addModelFormat,
  addNumberFormat,
  getNumberFormat,
  TooltipGhost,
  JS2CSS,
  DriverComponent,
  getSecondaryColor,
  getAdjacentPrimaryColor,
} from "@jeff-aporta/camaleon";

import BenefitUplineIcon from "@mui/icons-material/TrendingUpOutlined";
import BenefitDownlineIcon from "@mui/icons-material/TrendingDownOutlined";
import BenefitConstantlineIcon from "@mui/icons-material/TrendingFlatOutlined";
import { Chip, Tooltip, Typography } from "@mui/material";
import { BorderBottom } from "@mui/icons-material";

addNumberFormat({
  toCoin(value, local) {
    const { precision2SmallNumber, numberFormat } = getNumberFormat();
    const number_format = precision2SmallNumber({ value });
    const { texto } = numberFormat(number_format, value, local, "");
    return texto;
  },
  toCoinDifference(value1, value2, local) {
    const { precision2SmallNumber, numberFormat } = getNumberFormat();
    // No es necesario abs en diff, precision2SmallNumber lo infiere
    const diff = (value1 - value2) / 10;
    const number_format = precision2SmallNumber({ value: diff });
    const { texto } = numberFormat(number_format, value1, local, "");
    return texto;
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

const currentCoin = currentSufix("name_coin", true);

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
  dateFormat2: dateFormat2(),
  profit_op: {
    ...propsNameCoin,
    extra_width: 30,
    component: "ReserveLayer",
    className: "fill",
    renderInfo: {
      ...renderInfoNameCoin,
      className: null,
      style: null,
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

export const driverTables = DriverComponent({
  idDriver: "tables",
  TABLE_TRANSACTIONS: "transactions",
  TABLE_OPERATIONS: "operations",
  viewTable: {
    nameParam: "view_table",
    _setup_({ init, TABLE_OPERATIONS }) {
      init(TABLE_OPERATIONS);
    },
  },

  refetch(effectBool = false) {
    Object.entries(this.getTables()).forEach(([name, table]) => {
      const driver = this.getDriverTable(name);
      if (driver && driver.setLoading) {
        driver.setLoading(effectBool);
      }
      console.log({driver})
      table.fetchData && table.fetchData();
    });
  },

  operationRow: {},

  driverTable: {
    isObject: true,
  },

  tables: {
    isObject: true,
  },

  delayers: {
    isArray: true,
  },

  addTableAndDriver({name, table, driver}) {
    this.addDriverTable(name, driver);
    this.addTables(name, table);
  },

  deleteTableAndDriver(name) {
    this.deleteDriverTable(name);
    this.deleteTables(name);
  },

  newTable,
});

function newTable({
  componentDidMount = () => {},
  componentWillUnmount = () => {},
  componentDidUpdate = () => {},
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
  driver = {},
} = {}) {
  let paramsValues;
  let params;

  return class extends Component {
    constructor(props) {
      super(props);
      init.bind(this)(this.contextGeneral());
    }

    getDriver() {
      return driver;
    }

    setLoading(val) {
      driver.setLoading && driver.setLoading(val);
    }

    contextGeneral() {
      return {
        driver,
        data: driver.getTableData ? driver.getTableData() : [],
      };
    }

    endFetchEnvolve(props) {
      endFetch.bind(this)(props);
      driver.setLoading && driver.setLoading(false);
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

    componentDidUpdate(...args) {
      componentDidUpdate.bind(this)(...args);
    }

    componentDidMount() {
      componentDidMount.bind(this)();
      driverTables.addTableAndDriver({name: name_table, table: this, driver});
      driverTables.addDelayers(name_table, Delayer(1000));
      this.fetchData();
      const { addLinkLoading, addLinkTableData } = driver;
      addLinkLoading && addLinkLoading(this);
      addLinkTableData && addLinkTableData(this);
    }

    componentWillUnmount() {
      driverTables.deleteTableAndDriver(name_table);
      driverTables.deleteDelayers(name_table);
      componentWillUnmount.bind(this)();
      const { removeLinkLoading, removeLinkTableData } = driver;
      removeLinkLoading && removeLinkLoading(this);
      removeLinkTableData && removeLinkTableData(this);
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
        await sleep(1000);
      }
      if (cbErrorParams) {
        cbErrorParams();
        return false;
      } else {
        return await this.fetchData({ deep: deep + 1 });
      }
    }
    const delayer = driverTables.getDelayers(name_table);
    if (delayer && !delayer.isReady()) {
      return false;
    }
    return true;
  }
}

function dateFormat2() {
  const outenv = "layer fill padw-15px";
  const inenv = "flex justify-space-between align-center gap-10px";
  const {
    renderInfo: renderInfoDatetime, //
    ...propsDatetime
  } = getModelsFormat().datetime;
  return {
    ...propsDatetime,
    renderInfo: {
      ...renderInfoDatetime,
      className: `${outenv} ${inenv}`,
      style: {},
      styleEl2: ({ hour, minute, seconds }) => {
        const hs = +hour + minute / 60 + seconds / 3600;
        const t = hs / 24;
        const colorTop = getAdjacentPrimaryColor({
          a: 60,
          light: true,
        })[0];
        const colorBottom = getAdjacentPrimaryColor({
          a: 60,
          light: false,
        })[0];
        return {
          backgroundColor: `rgba(${colorBottom
            .mix(colorTop, t)
            .rgb()
            .array()
            .join(",")}, 0.5)`,
          fontSize: "smaller",
          borderRadius: "10px",
          padding: "0 5px",
          width: "fit-content",
          height: "fit-content",
        };
      },
    },
  };
}

function currentSufix(sufix, space_between = true) {
  const outenv = "layer fill padw-15px";
  const inenv = "flex justify-space-between align-center gap-10px";
  return {
    fit_content: true,
    renderInfo: {
      ...(space_between
        ? {
            className: `${outenv} ${inenv}`,
            styleEl2: {
              backgroundColor: `rgba(${getSecondaryColor()
                .rgb()
                .array()
                .join(",")}, 0.5)`,
              fontSize: "smaller",
              borderRadius: "10px",
              padding: "0 5px",
              width: "fit-content",
              height: "fit-content",
            },
          }
        : {}),
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
    let { real_roi } = params.row;
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
    if (real_roi) {
      real_roi = +real_roi.toFixed(2);
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
              label={`${real_roi}%`}
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
        const percent = ["", `(${real_roi}%)`][+!!real_roi];
        return `${renderString} ${percent}`;
      }
      return renderString;
    })();
    const strings = { texto, tooltip };
    return strings;
  };
}
