import { VIEW_ID } from "../constants.js";

const lastParams = {};
const paramListener = [];

Object.assign(lastParams, getAllParams());

export const driverParams = {
  get,
  getOne,
  set,
  init,
  deleteAll,
  delete: deleteParam,
};

function deleteParam(...keys) {
  const params = new URLSearchParams(window.location.search);
  keys.forEach((key) => params.delete(key));
  _setURLParams("replaceState", urlParamToString(params), {
    updateListenerParams: false,
  });
}

function deleteAll({ preserveViewId = true } = {}) {
  const currentParams = new URLSearchParams(window.location.search);
  const viewId = currentParams.get(VIEW_ID);
  const params = new URLSearchParams();
  currentParams.forEach((value, key) => params.delete(key));
  if (preserveViewId && viewId) {
    params.set(VIEW_ID, viewId);
  }
  _setURLParams("replaceState", urlParamToString(params), {
    updateListenerParams: false,
  });
}

function init(key, ...rest) {
  if (typeof key == "object") {
    Object.entries(key).forEach(([k, v]) => init(k, v));
    return Object.entries(key).reduce((a, [k, v]) => (a[k] = get(k)[0]), {});
  }
  if (typeof key != "string") {
    console.error("driverParams.init: key must be a string", key);
    return;
  }
  if (!get(key)[0]) {
    set(key, ...rest);
  }
  return get(key)[0];
}

function getOne(key) {
  return get(key)[0];
}

function get(...keys) {
  const RETURN = keys.map((k) =>
    new URLSearchParams(window.location.search).get(k)
  );
  return RETURN;
}

function set(key, value, { save = false, reload = false } = {}) {
  if (typeof key == "string") {
    key = { [key]: value };
  } else if (typeof key != "object") {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const initParams = params.toString();
  Object.entries(key).forEach(([k, v]) => {
    if (v) {
      params.set(k, v);
    } else {
      params.delete(k);
    }
  });
  if (initParams !== params.toString()) {
    _setURLParams(
      ["replaceState", "pushState"][+save],
      urlParamToString(params)
    );
    _reload(reload);
  }
}

function urlParamToString(params) {
  const queryString = params.toString();
  return [window.location.pathname, queryString].filter(Boolean).join("?");
}

function addParamListener(listener) {
  paramListener.push(listener); // {"view-id": fn}
}

function removeParamListener(listener) {
  if (typeof listener != "number") {
    listener = paramListener.indexOf(listener);
  }
  if (listener > -1) {
    paramListener.splice(listener, 1);
  }
}

export function subscribeParam(modelChange, context) {
  const handleListeners = {
    addParamListener: () => addParamListener(modelChange),
    removeParamListener: () => removeParamListener(modelChange),
  };
  if (context) {
    Object.assign(context, handleListeners);
  }
  return handleListeners;
}

function _updateListenerParams() {
  const newParams = getAllParams();
  paramListener.forEach((listener) => {
    Object.entries(listener).forEach(([listParams, callback]) => {
      for (const name of listParams.replace(/\s/g, "").split(",")) {
        if (lastParams[name] != newParams[name]) {
          callback({
            name,
            old_value: lastParams[name],
            new_value: newParams[name],
          });
          break;
        }
      }
    });
  });
  Object.assign(lastParams, newParams);
}

function getAllParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function _reload(ms_reaload) {
  if (ms_reaload == true) {
    ms_reaload = 0;
  }
  if (typeof ms_reaload == "number") {
    setTimeout(() => {
      window.location.reload();
    }, ms_reaload);
  }
}

export function _setURLParams(
  method,
  url,
  { updateListenerParams = true, state = {}, title = document.title } = {}
) {
  if (method !== "pushState" && method !== "replaceState") {
    throw new Error(`Método inválido: ${method}`);
  }
  window.history[method](state, title, url);
  if (updateListenerParams) {
    _updateListenerParams();
  }
}
