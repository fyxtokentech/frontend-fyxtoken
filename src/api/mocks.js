import { getGeneric, postGeneric, putGeneric } from "./generic";

const { currentUser = {} } = window;

export async function http_get_coins({
  user_id = currentUser.user_id,
  ...rest
}) {
  return await getGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) => `${baseUrl}/coins/${user_id}`,
    mock_default: {
      content: [
        ["symbol", "id"],
        ["BTC", "1"],
        ["ETH", "2"],
      ],
    },
  });
}

export async function http_put_coin_start({
  user_id = currentUser.user_id,
  id_coin,
  ...rest
}) {
  return await putGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) => {
      return `${baseUrl}/coins/start/${user_id}/${id_coin}`;
    },
  });
}

export async function http_put_coin_stop({
  user_id = currentUser.user_id,
  id_coin,
  ...rest
}) {
  return await putGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) => {
      return `${baseUrl}/coins/stop/${user_id}/${id_coin}`;
    },
  });
}

export async function http_get_coin_metrics({
  user_id = currentUser.user_id,
  id_coin,
  ...rest
}) {
  return await getGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) => {
      return `${baseUrl}/coins/metrics/${user_id}/${id_coin}`;
    },
  });
}

export async function http_get_operation_open({
  user_id = currentUser.user_id,
  id_coin,
  ...rest
}) {
  return await getGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) => {
      return `${baseUrl}/operations/open/${user_id}/${id_coin}`;
    },
  });
}

export async function http_post_exchange_operation_sell({
  id_operation,
  ...rest
}) {
  return await postGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) => {
      return `${baseUrl}/exchange/operation/${id_operation}/side/sell?forced=true`;
    },
    service: "robot_prototype",
  });
}

export async function http_put_update_investment({
  user_id = currentUser.user_id,
  coin_id,
  new_value,
  ...rest
}) {
  return await putGeneric({
    ...rest,
    buildEndpoint: ({ baseUrl }) =>
      `${baseUrl}/operations/update/investment/${user_id}/coin/${coin_id}?new_value=${new_value}`,
  });
}
