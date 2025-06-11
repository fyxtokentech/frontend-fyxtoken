import { MAKE_GET, MAKE_POST, MAKE_PUT, MAKE_PATCH, AUTO_PARAMS } from "./generic";

export async function HTTPGET_COINS_BY_USER({ user_id, ...rest }) {
  ({ user_id } = AUTO_PARAMS({ user_id }));
  return await MAKE_GET({
    ...rest,
    buildEndpoint: ({ genpath }) => genpath(["coins", user_id]),
    mock_default: {
      content: [
        ["symbol", "id"],
        ["_BTC_", "1"],
        ["_ETH_", "2"],
      ],
    },
  });
}

export async function HTTPPUT_COINS_START({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PUT({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "start", user_id, id_coin]),
  });
}

export async function HTTPPUT_COINS_STOP({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PUT({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "stop", user_id, id_coin]),
  });
}

export async function HTTPGET_COINS_METRICS({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "metrics", user_id, id_coin]),
  });
}

export async function HTTPGET_USEROPERATION_PERIOD({
  user_id,
  id_coin,
  period,
  start_date,
  end_date,
  limit = 1000,
  ...rest
}) {
  ({ user_id, id_coin, period, start_date, end_date } = AUTO_PARAMS({
    user_id,
    id_coin,
    period,
    start_date,
    end_date,
  }));
  return await MAKE_GET({
    ...rest,
    buildEndpoint: ({ genpath }) => {
      if (period === "most_recent") {
        return genpath(["operations", "most_recent", user_id], {
          coinid: id_coin,
        });
      }
      return genpath(["operations", user_id], {
        coinid: id_coin,
        start_date,
        end_date,
        limit,
      });
    },
  });
}

export async function HTTPGET_USEROPERATION_STRATEGY({
  user_id,
  id_coin,
  strategy, // rsi | candle | roi
  ...rest
}) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["operations", "user", user_id, "coin", id_coin, "strategy", strategy]),
  });
}

export async function HTTPGET_USEROPERATION_OPEN({
  user_id,
  id_coin,
  ...rest
}) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["operations", "open", user_id, id_coin]),
  });
}

export async function HTTPPOST_EXCHANGE_SELL({ id_operation, ...rest }) {
  return await MAKE_POST({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["exchange", "operation", id_operation, "side", "sell"], {
        forced: true,
      }),
    service: "robot_prototype",
  });
}

export async function HTTPPUT_USEROPERATION_INVESTMEN({
  user_id,
  coin_id,
  new_value,
  ...rest
}) {
  ({ user_id, coin_id } = AUTO_PARAMS({ user_id, coin_id }));
  return await MAKE_PUT({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(
        ["operations", "update", "investment", user_id, "coin", coin_id],
        {
          new_value,
        }
      ),
  });
}

// GET /api/user/{user_id}
export async function HTTPGET_USER_API({ user_id, ...rest }) {
  ({ user_id } = AUTO_PARAMS({ user_id }));
  return await MAKE_GET({
    ...rest,
    buildEndpoint: ({ genpath }) => genpath(["api", "third", "user", user_id]),
  });
}

// PATCH /api/id/{id_api_user}
export async function HTTPPATCH_USER_API({ id_api_user, enabled, new_attributes, ...rest }) {
  return await MAKE_PATCH({
    ...rest,
    buildEndpoint: ({ genpath }) => genpath(["api", "third", "id", id_api_user]),
    params: { new_attributes },
  });
}

// PATCH /operations/user/{user_id}/coin/{id_coin}/strategy/{strategy}
export async function HTTPPATCH_USEROPERATION_STRATEGY({ user_id, id_coin, strategy, new_config, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PATCH({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["operations", "user", user_id, "coin", id_coin, "strategy", strategy], {
        new_config: (()=>{
          if(typeof new_config == "string"){
            return new_config;
          }
          // TOdos los json se pasan como cadenas
          return JSON.stringify(new_config);
        })(),
      }),
  });
}

export async function HTTPPOST_TRY_LOGIN({ username, password, ...rest }) {
  let user = await MAKE_POST({
    ...rest,
    buildEndpoint: ({ genpath }) =>
      genpath(["login"], {
        username,
        password,
      }),
    isTable: true,
  });
  return user;
}


