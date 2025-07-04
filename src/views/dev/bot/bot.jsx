import React, { Component } from "react";

import { Main } from "@theme/main";
import {
  DivM,
  driverParams,
  getComponentsQuery,
  subscribeParam,
  showError,
  showInfo,
  clamp,
  DriverComponent,
} from "@jeff-aporta/camaleon";

import { HTTPGET_COINS_BY_USER } from "@api";
import { driverTables } from "@tables/tables.js";
import { driverCoinsOperating } from "./components/ActionMain/components/CoinsOperating";

import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { HTTPGET_TRANSACTION_MOST_RECENT } from "src/app/api";

let SINGLETON;
let currency;
let coinsOperatingList = [];
let coinsToDelete = [];
let update_available = true;
let loadingCoinsToOperate = true;

const ONLY_COINS_ACTIVE = (coin) => coin.status === "A";

const SECONDS_TO_UPDATE_AGAIN = 15000;

export default () => <PanelRobot />;

export const driverPanelRobot = DriverComponent({
  panelRobot: {
    isComponent: true,
  },
  timeUpdateAvailable: {
    value: -1,
  },
  updateAvailable: {
    value: true,
    getPercentTo() {
      const diff = Date.now() - this.getTimeUpdateAvailable();
      return clamp(diff / SECONDS_TO_UPDATE_AGAIN, 0, 1);
    },
    set(newValue, { setValue }) {
      if (newValue == false) {
        this.setTimeUpdateAvailable(Date.now());
        setTimeout(() => {
          if (
            Date.now() - this.getTimeUpdateAvailable() >
            SECONDS_TO_UPDATE_AGAIN
          ) {
            setValue(true);
            this.setTimeUpdateAvailable(Date.now());
          }
        }, SECONDS_TO_UPDATE_AGAIN + 10);
      }
    },
  },
  coinsToOperate: {
    value: [],
    findCurrencyIn(props, { getValue }) {
      return getValue().find(
        (c) => driverPanelRobot.getCoinKey(c) === driverPanelRobot.getCurrency()
      );
    },

    findKeyIn([symbol], { getValue }) {
      return getValue().find((c) => driverPanelRobot.getCoinKey(c) === symbol);
    },

    mapToKeys(props, { getValue }) {
      return getValue().map(driverPanelRobot.getCoinKey);
    },
  },
  coinsOperating: {
    value: [],

    filterExcludeId([id], { getValue, setValue }) {
      setValue(getValue().filter((c) => c.id !== id));
    },
  },
  coinsToDelete: {
    value: [],
    filterExcludeIdOn([id], { getValue, setValue }) {
      setValue(getValue().filter((c) => c.id !== id));
    },
    someKey([symbol], { getValue }) {
      return getValue().some((c) => driverPanelRobot.getCoinKey(c) === symbol);
    },
  },
  currency: {
    nameParam: "coin",
  },
  loadingCoinsToOperate: {
    value: true,
  },
  getCoinKey: (coin) => coin.symbol || coin.name || coin.id || "-",
  viewBot: {
    nameParam: "view_bot",
    initParam: "main",
    setToMain(props, { setValue }) {
      setValue("main");
      driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
    },
    setToSettings(props, { setValue }) {
      setValue("settings");
    },
  },
  idCoin: {
    nameParam: "id_coin",
    initParam: 1,
  },

  loadCoins: async () => {
    await HTTPGET_COINS_BY_USER({
      successful: (coinsByUser) => {
        coinsByUser = coinsByUser.sort((a, b) => a.id - b.id);
        driverPanelRobot.setCoinsToOperate(coinsByUser);
        const coinsToOperate = driverPanelRobot.getCoinsToOperate();
        const paramCoin = driverPanelRobot.getCurrency();
        if (!paramCoin && coinsToOperate.length > 0) {
          const first = coinsToOperate[0];
          const key = driverPanelRobot.getCoinKey(first);
          driverPanelRobot.setCurrency(key);
          driverPanelRobot.setIdCoin(first.id);
        } else {
          driverPanelRobot.setCurrency(paramCoin);
        }
        driverPanelRobot.setCoinsOperating(
          coinsByUser.filter(ONLY_COINS_ACTIVE)
        );
      },
    });
    driverPanelRobot.setLoadingCoinsToOperate(false);
  },
});

class PanelRobot extends Component {
  constructor(props) {
    super(props);
    subscribeParam(
      {
        view_table: () => {
          driverPanelRobot.updatePanelRobot();
        },
      },
      this
    );
    driverPanelRobot.addLinkViewBot(this);
    driverPanelRobot.setPanelRobot(this);
  }

  componentDidMount() {
    driverPanelRobot.loadCoins();
    this.addParamListener();
  }

  componentWillUnmount() {
    this.removeParamListener();
  }

  render() {
    const {
      ActionMain: { default: ActionMainComponent },
      Settings: { default: SettingsComponent },
    } = getComponentsQuery();

    return (
      <Main h_init="20px" h_fin="300px">
        <DivM>
          <Typography variant="h2" className="color-bg-opposite">
            Panel Robot
          </Typography>
          <br />
          {(() => {
            switch (driverPanelRobot.getViewBot()) {
              case "main":
              default:
                return <ActionMainComponent />;
              case "settings":
                return <SettingsComponent />;
            }
          })()}
        </DivM>
      </Main>
    );
  }
}
