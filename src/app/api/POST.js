import { MAKE_POST, AUTO_PARAMS } from "@jeff-aporta/camaleon";

import { httpdebug } from "./index.js";

export async function HTTPPOST_EXCHANGE_SELL({ id_operation, ...rest }) {
  return await MAKE_POST({
    ...rest,
    ...httpdebug,
    service: "robot_prototype",
    buildEndpoint: ({ genpath }) =>
      genpath(["exchange", "operation", id_operation, "side", "sell"], {
        forced: true,
      }),
  });
}

export async function HTTPPOST_TRY_LOGIN({ username, password, ...rest }) {
  try {
    await MAKE_POST({
      ...rest,
      ...httpdebug,
      service: "robot_backend",
      buildEndpoint: ({ genpath }) =>
        genpath(["login"], { username, password }),
      isTable: true,
    });
  } catch (error) {
  }
}

// POST /api/third/user/{user_id}
export async function HTTPPOST_USER_API({
  user_id,
  id_api,
  attributes_api,
  enabled = "A",
  ...rest
}) {
  ({ user_id } = AUTO_PARAMS({ user_id }));
  return await MAKE_POST({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["api", "third", "user", user_id], {
        id_api,
        attributes_api: (() => {
          if (typeof attributes_api == "string") {
            return attributes_api;
          }
          return JSON.stringify(attributes_api);
        })(),
        enabled,
      }),
  });
}
