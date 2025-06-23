import { MAKE_PATCH, AUTO_PARAMS } from "@jeff-aporta/camaleon";

import { httpdebug } from "./index.js";

// PATCH /api/id/{id_api_user}
export async function HTTPPATCH_USER_API({
  id_api_user,
  enabled,
  new_attributes,
  ...rest
}) {
  return await MAKE_PATCH({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["api", "third", "id", id_api_user]),
    params: { new_attributes },
  });
}

// PATCH /operations/user/{user_id}/coin/{id_coin}/strategy/{strategy}
export async function HTTPPATCH_USEROPERATION_STRATEGY({
  user_id,
  id_coin,
  strategy,
  new_config,
  ...rest
}) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_PATCH({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(
        ["operations", "user", user_id, "coin", id_coin, "strategy", strategy],
        {
          new_config: (() => {
            if (typeof new_config == "string") {
              return new_config;
            }
            // TOdos los json se pasan como cadenas
            return JSON.stringify(new_config);
          })(),
        }
      ),
  });
}
