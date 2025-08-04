import { MAKE_GET, AUTO_PARAMS } from "@jeff-aporta/camaleon";

import { httpdebug } from "./index.js";

// http://localhost:8000/transactions/most_recent/user/{user_id}/coin/{id_coin}
export async function HTTPGET_TRANSACTION_MOST_RECENT({
  user_id,
  id_coin,
  ...rest
}) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath([
        "transactions",
        "most_recent",
        "user",
        user_id,
        "coin",
        id_coin,
      ]),
  });
}
/*
 http://localhost:8000/transactions/most_recent/user/{user_id}/coin/{id_coin}
 return total by request
 */
export async function HTTPGET_BALANCECOIN({ user_id, id_coin, ...rest } = {}) {
  return new Promise((resolve) => {
    HTTPGET_TRANSACTION_MOST_RECENT({
      ...rest,
      user_id,
      id_coin,
      successful: ([transaction]) => {
        let { total = 0 } = transaction;
        resolve(total);
      },
      failure: () => {
        resolve(0);
      },
    });
  });
}

// http://localhost:8000/operations/id/{operationID}
export async function HTTPGET_OPERATION_ID({ operationID, ...rest }) {
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) => genpath(["operations", "id", operationID]),
  });
}

// http://localhost:8000/transactions/{id_operation}
export async function HTTPGET_TRANSACTIONS({ id_operation, ...rest }) {
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) => genpath(["transactions", id_operation]),
  });
}

// http://localhost:8000/withdrawals/user/{user_id}?start_date={start_date}&end_date={end_date}&page={page}&limit={limit}
export async function HTTPGET_WITHDRAWALS({
  user_id,
  start_date,
  end_date,
  page = 0,
  limit = 1000,
  ...rest
}) {
  // POSIBLE ERROR NOT FOUND http://82.29.198.89:8000
  ({ user_id, start_date, end_date } = AUTO_PARAMS({
    user_id,
    start_date,
    end_date,
  }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["withdrawals", user_id], { start_date, end_date, page, limit }),
  });
}

// http://localhost:8000/api/third/user/{user_id}
export async function HTTPGET_USER_API({ user_id, ...rest }) {
  ({ user_id } = AUTO_PARAMS({ user_id }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) => genpath(["api", "third", "user", user_id]),
  });
}

// http://localhost:8000/operations/open/{user_id}/{id_coin}
export async function HTTPGET_USEROPERATION_OPEN({
  user_id,
  id_coin,
  ...rest
}) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    useCache: false,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["operations", "open", user_id, id_coin]),
  });
}

// http://localhost:8000/coins/metrics/user/{user_id}/coin/{id_coin}
export async function HTTPGET_COINS_METRICS({ user_id, id_coin, ...rest }) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) =>
      genpath(["coins", "metrics", "user", user_id, "coin", id_coin]),
  });
}

/*
  Si period es "most_recent"
  http://localhost:8000/operations/{user_id}/most_recent?coinid={id_coin}
  de lo contrario
  http://localhost:8000/operations/{user_id}?coinid={id_coin}&start_date={start_date}&end_date={end_date}&limit={limit}

*/ 
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
    ...httpdebug,
    service: "robot_backend",
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

// http://localhost:8000/operations/user/{user_id}/coin/{id_coin}/strategy/{strategy}
export async function HTTPGET_USEROPERATION_STRATEGY({
  user_id,
  id_coin,
  strategy, // rsi | candle | roi | pips | global
  ...rest
}) {
  ({ user_id, id_coin } = AUTO_PARAMS({ user_id, id_coin }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    useCatch: false,
    service: "robot_backend",
    useCache: false,
    buildEndpoint: ({ genpath }) =>
      genpath([
        "operations",
        "user",
        user_id,
        "coin",
        id_coin,
        "strategy",
        strategy,
      ]),
  });
}

// http://localhost:8000/coins/user/{user_id}
export async function HTTPGET_COINS_BY_USER({ user_id, ...rest }) {
  ({ user_id } = AUTO_PARAMS({ user_id }));
  return await MAKE_GET({
    ...rest,
    ...httpdebug,
    service: "robot_backend",
    buildEndpoint: ({ genpath }) => genpath(["coins", "user", user_id]),
    mock_default: {
      content: [
        ["symbol", "id"],
        ["_BTC_", "1"],
        ["_ETH_", "2"],
      ],
    },
  });
}
