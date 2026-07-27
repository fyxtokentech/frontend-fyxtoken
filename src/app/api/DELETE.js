import { MAKE_DELETE } from "@jeff-aporta/camaleon";

import { httpdebug } from "./index.js";

// DELETE /api/third/id/{id_api_user}
export async function HTTPDELETE_USER_API({ id_api_user, ...rest }) {
  return await MAKE_DELETE({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["api", "third", "id", id_api_user]),
  });
}
