import {
  HTTPGET_COINS_BY_USER,
  HTTPGET_COINS_METRICS,
  HTTPGET_BALANCECOIN,
  HTTPGET_COINS_OPERATIONS_BY_USER
} from "@api";
import { driverTables } from "@tables/tables.js";
import {
  DriverComponent,
  clamp,
  Delayer,
  TooltipGhost,
} from "@jeff-aporta/camaleon";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import CircularProgress from "@mui/material/CircularProgress";

import { driverPanelOfProjections } from "./components/ActionMain/components/PanelOfProjections.driver.js";
import { driverPanelBalance } from "./components/ActionMain/components/PanelBalance.driver.js";

import ActionMain from "./components/ActionMain/ActionMain.jsx";
import Settings from "./components/Settings/Settings.jsx";
import { Typography } from "@mui/material";

export const driverPanelRobot = DriverComponent({
  idDriver: "bot",
  SECONDS_TO_UPDATE_AGAIN: 15000,
  SEARCH_COIN_KEY({ coin, currency }) {
    const coinKey = this.getCoinKey(coin);
    const coinCurrency = currency || this.getCurrency();
    return coinKey === coinCurrency;
  },
  loadingCoinMetrics: {
    isBoolean: true,
    value: true,
  },
  async fetchCoinMetrics(_) {
    driverPanelBalance.setDefaultUSDTBuy(0);
    driverPanelBalance.setLimitUSDTBuy(0);
    const id_coin = this.getIdCoin();
    if (!id_coin) {
      console.warn("[fetchCoinMetrics]: No se recibio id_coin", id_coin);
      return setTimeout(() => {
        this.fetchCoinMetrics();
      }, 200);
    }
    await HTTPGET_COINS_METRICS({
      id_coin,
      successful: ([data]) => {
        if (!data) {
          console.warn("[fetchCoinMetrics]: No se recibio datos", id_coin);
          return;
        }
        driverPanelOfProjections.assignCoinMetric(data);
        driverPanelBalance.setDefaultUSDTBuy(data.default_usdt_buy);
        driverPanelBalance.setLimitUSDTBuy(data.limit_usdt_buy);
        driverPanelBalance.setLoadingCoinMetric(false);
      },
    });
    try {
      driverPanelBalance.setBalanceCoin(await HTTPGET_BALANCECOIN());
    } catch (e) {
      console.error(e);
    }
    driverPanelOfProjections.setLoading(false);
  },
  updateAvailable: {
    isBoolean: true,
    value: true,
    time: -1,
    mapCase: {
      textButtonUpdate: {
        true: () => "Actualizar",
        false: () => "Espera para volver a actualizar",
      },
    },
    _getValidate_(value) {
      if (this.getPercentToUpdateAvailable() >= 1) {
        return true;
      }
      return value;
    },
    getTimeEllapsed({ getTime }) {
      return Date.now() - getTime();
    },
    getPercentTo({ getTimeEllapsed, SECONDS_TO_UPDATE_AGAIN }) {
      const diff = getTimeEllapsed();
      return clamp(diff / SECONDS_TO_UPDATE_AGAIN, 0, 1);
    },
    _willSet_(newValue, { setValue, SECONDS_TO_UPDATE_AGAIN, setTime }) {
      if (newValue == false) {
        setTime(Date.now());
        setTimeout(() => {
          setValue(true);
          setTime(Date.now());
        }, SECONDS_TO_UPDATE_AGAIN);
      }
    },
  },
  coinsToOperate: {
    isArray: true,
    findCurrencyIn({ find, SEARCH_COIN_KEY }) {
      return find((coin) => SEARCH_COIN_KEY({ coin }));
    },

    findKeyIn([symbol], { find, SEARCH_COIN_KEY }) {
      return find((coin) => SEARCH_COIN_KEY({ coin, currency: symbol }));
    },

    mapToKeys({ map }) {
      return map(this.getCoinKey);
    },
  },
  coinsOperating: {
    isArray: true,
    findSymbolIn(symbol, { find, SEARCH_COIN_KEY }) {
      return find((coin) => SEARCH_COIN_KEY({ coin, currency: symbol }));
    },
    isCurrencyIn({ some, SEARCH_COIN_KEY }) {
      return some((coin) => SEARCH_COIN_KEY({ coin }));
    },
    setOnlyActive(value, { setValue }) {
      setValue(
        value.filter((coin) => {
          const s = coin?.status;
          if (s === undefined || s === null) return false;
          if (typeof s === "boolean") return s === true;
          if (typeof s === "number") return s === 1;
          const str = String(s).toLowerCase();
          return (
            str === "a" ||
            str === "active" ||
            str === "enabled" ||
            str === "t" ||
            str === "trading" ||
            str === "1" ||
            str === "true" ||
            str === "on"
          );
        })
      );
    },
    filterExcludeId(id, { setValue, filter }) {
      setValue(filter((c) => c.id != id));
    },
  },
  coinsToDelete: {
    isArray: true,
    filterExcludeIdOn(id, { setValue, filter }) {
      setValue(filter((c) => c.id != id));
    },
    someKey(symbol, { some, SEARCH_COIN_KEY }) {
      return some((coin) => SEARCH_COIN_KEY({ coin, currency: symbol }));
    },
    isCurrencyIn({ some, SEARCH_COIN_KEY }) {
      return some((coin) => SEARCH_COIN_KEY({ coin }));
    },
    isPendingIn(symbol, { someKey }) {
      return someKey(symbol);
    },
    mapCase: {
      colorChip: {
        true: () => "primary",
        false: () => "close",
      },
      textColor: {
        true: () => "contrastPaperBOW",
        false: () => "secondary",
      },
      deleteIcon: {
        true: () => (
          <TooltipGhost
            title={`Dejar de operar (${driverPanelRobot.getCurrency()})`}
          >
            <DoDisturbOnIcon color="secondary" />
          </TooltipGhost>
        ),
        false: () => <CircularProgress size="20px" color="secondary" />,
      },
      tooltipTitle: {
        true: () => null,
        false: () => "Pronto dejará de ser operada",
      },
    },
  },
  currency: {
    nameParam: "coin",
  },
  loadingCoinsToOperate: {
    value: true,
  },
  getCoinKey(coin) {
    return coin.symbol || coin.name || coin.id || "-";
  },
  viewBot: {
    nameParam: "view_bot",
    initParam: "main",
    setToMain({ setValue }) {
      setValue("main");
      driverTables.setViewTable(driverTables.TABLE_OPERATIONS);
    },
    setToSettings({ setValue }) {
      setValue("settings");
    },
    mapCase: {
      component: {
        "main, default": () => <ActionMain />,
        settings: () => <Settings />,
      },
    },
  },
  idCoin: {
    nameParam: "id_coin",
    initParam: 1,
    isInteger: true,
  },

  async loadCoins() {
    await HTTPGET_COINS_BY_USER({
      useCache: false,
      successful: (response) => {
        const parsedResponse = Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
            ? response.content
            : Array.isArray(response?.data)
              ? response.data
              : [];

        const coinsByUser = parsedResponse
          .map((coin) => {
            if (Array.isArray(coin)) {
              const [id, name, symbol, status, exchangeId] = coin;
              return {
                id: id != null ? String(id) : undefined,
                name,
                symbol,
                status,
                exchange_id: exchangeId,
              };
            }

            return {
              ...coin,
              id: coin?.id ?? coin?.coin_id ?? coin?.id_coin,
              name: coin?.name ?? coin?.coin_name,
              symbol: coin?.symbol ?? coin?.coin_symbol,
              status: coin?.status ?? coin?.coin_status,
            };
          })
          .filter((coin) => coin?.id != null)
          .sort((a, b) => Number(a.id) - Number(b.id));

        // Mantener esta lista para el select "Monedas disponibles para operar"
        this.setCoinsToOperate(coinsByUser);
        const coinsToOperate = this.getCoinsToOperate();
        const currency = this.getCurrency();
        // If current currency is missing from the refreshed list, pick the first available
        const hasCurrent = currency && this.findKeyInCoinsToOperate([currency]);
        if ((!currency || !hasCurrent) && !this.isEmptyCoinsToOperate()) {
          const first = coinsToOperate[0];
          const key = this.getCoinKey(first);
          this.setCurrency(key);
          this.setIdCoin(first.id);
        }
      },
    });

    // Cargar monedas que están en operación (desde user_operations)
    await HTTPGET_COINS_OPERATIONS_BY_USER({
      useCache: false,
      successful: (response) => {
        const parsedResponse = Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
            ? response.content
            : Array.isArray(response?.data)
              ? response.data
              : [];

        console.debug("HTTPGET_COINS_OPERATIONS_BY_USER: parsedResponse", parsedResponse);

        const opsCoins = parsedResponse
          .map((coin) => {
            if (Array.isArray(coin)) {
              const [id, name, symbol, status] = coin;
              return {
                id: id != null ? String(id) : undefined,
                name,
                symbol,
                status,
              };
            }

            return {
              ...coin,
              id: coin?.id ?? coin?.coin_id ?? coin?.id_coin,
              name: coin?.name ?? coin?.coin_name,
              symbol: coin?.symbol ?? coin?.coin_symbol,
              status: coin?.status ?? coin?.coin_status,
            };
          })
          .filter((coin) => coin?.id != null)
          .sort((a, b) => Number(a.id) - Number(b.id));

        console.debug("HTTPGET_COINS_OPERATIONS_BY_USER: opsCoins count", opsCoins.length, "preview", opsCoins.slice(0,10));

        // Poblar coinsOperating solo con las activas
        this.setOnlyActiveCoinsOperating(opsCoins);
      },
      failure: () => {
        // en caso de fallo dejamos la lista como está
      },
    });
    this.setLoadingCoinsToOperate(false);
  },
});
