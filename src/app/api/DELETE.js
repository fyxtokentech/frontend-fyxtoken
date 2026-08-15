import { MAKE_DELETE, AUTO_PARAMS} from "@jeff-aporta/camaleon";

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

// DELETE - Quitar una asignación
// http://localhost:8000/coins/assignments/{user_id}/{coin_id}
export async function HTTPDELETE_COIN_ASSIGNMENT({ user_id, coin_id, ...rest }) {
  ({ user_id, coin_id } = AUTO_PARAMS({ user_id, coin_id }));
  return await MAKE_DELETE({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) => genpath(["coins", "assignments", user_id, coin_id]),
  });
}
