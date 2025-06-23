import { MAKE_PUT, AUTO_PARAMS } from "@jeff-aporta/camaleon";

import { httpdebug } from "./index.js";

export async function HTTPPUT_COINS_START({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PUT({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "start", user_id, id_coin]),
  });
}

export async function HTTPPUT_COINS_STOP({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PUT({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "stop", user_id, id_coin]),
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
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(
        ["operations", "update", "investment", user_id, "coin", coin_id],
        {
          new_value,
        }
      ),
  });
}
