import { getUseViewId } from "./storage.js";
import { VIEW_ID } from "../constants.js";

const mapping = {};

export function buildHref(href) {
  const stayinGit = [
    getUseViewId(),
    window.PUBLIC_URL == ".",
    window.location.host.includes(".github"),
  ].some(Boolean);

  return global.nullish(
    () => simple(href),
    () => complex(href)
  );

  function complex({ view = "/", params = {} }) {
    const root = simple(view);
    params = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return [root, params]
      .filter(Boolean)
      .join(root.startsWith("?") ? "&" : "?");
  }

  function simple(url) {
    if (typeof url == "string") {
      return stayinGit ? `?${VIEW_ID}=${encodeURIComponent(url)}` : url;
    }
  }
}

export function assignMapManagement(props) {
  Object.assign(mapping, props);
}

export function hrefManagement(props) {
  if (typeof props == "string") {
    const map = mapping[props];
    if (map) {
      props = map;
      return hrefManagement(props);
    } else {
      props = { view: props };
    }
  }

  global.assignNullish(props, { params: {} });

  decorators();

  return props;

  function decorators() {
    if (mapping[props.view]) {
      props = mapping[props.view];
    }
  }
}
