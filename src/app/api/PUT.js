import { MAKE_PUT, AUTO_PARAMS } from "@jeff-aporta/camaleon";

import { httpdebug } from "./index.js";

// http://localhost:8000/coins/start/user/{user_id}/coin/{coinid}
export async function HTTPPUT_COINS_START({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PUT({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "start", "user", user_id, "coin", id_coin]),
  });
}

// http://localhost:8000/coins/stop/user/{user_id}/coin/{coinid}
export async function HTTPPUT_COINS_STOP({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PUT({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "stop", "user", user_id, "coin", id_coin]),
  });
}

// http://localhost:8000/operations/update/default_usdt_buy/user/{user_id}/coin/{coinid}
export async function HTTPPUT_USEROPERATION_DEFAULT_USDT_BUY({
  user_id,
  coin_id,
  new_value,
  ...rest
}) {
  ({ user_id, coin_id } = AUTO_PARAMS({ user_id, coin_id }));
  return await MAKE_PUT({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(
        ["operations", "update", "default_usdt_buy", "user", user_id, "coin", coin_id],
        {
          new_value,
        }
      ),
  });
}

// http://localhost:8000/operations/update/limit/user/{user_id}/coin/{coinid}
export async function HTTPPUT_USEROPERATION_LIMIT({
  user_id,
  coin_id,
  new_limit,
  ...rest
}) {
  console.log(user_id, coin_id, new_limit);
  ({ user_id, coin_id } = AUTO_PARAMS({ user_id, coin_id }));
  return await MAKE_PUT({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["operations", "update", "limit", "user", user_id, "coin", coin_id], {
        new_limit,
      }),
  });
}
