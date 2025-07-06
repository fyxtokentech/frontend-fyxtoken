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
