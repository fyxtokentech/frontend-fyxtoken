import { getRoutesAvailable } from "./context.js";

export const namesMainJSX = ["index", "view", "Index", "View"];

export const MAIN_FOLDER = "_main";

export function evaluateIndex(nodes) {
  return nodes.length === 0
    ? (() => {
        return trySearch([MAIN_FOLDER, "index"]) || "index";
      })()
    : null;
}

export function limpiarIgnorados(nodes, startIgnore) {
  const ignore = Array.isArray(startIgnore) ? startIgnore : [startIgnore];
  if (
    nodes[0] &&
    ignore.map((i) => i.toLowerCase()).includes(nodes[0].toLowerCase())
  ) {
    return nodes.slice(1);
  }
  return nodes;
}

export function inferirIntension(querypath, nodes) {
  if (getRoutesAvailable()[querypath]) {
    return querypath;
  }
  const prior = [
    ...namesMainJSX.map((n) => inferMainJSX(querypath, n)),
    inferMainJSX(querypath, nodes.at(-1)),
  ];
  return prior.find((key) => getRoutesAvailable()[key]) || querypath;

  function inferMainJSX(base, node) {
    const compact = (arr) => arr.filter(Boolean).join("/");
    return compact([base, node]);
  }
}

export function evaluate404(path) {
  if (getRoutesAvailable()[path]) {
    return path;
  }
  return inferMAIN_FOLDER("404");
}

export function inferMAIN_FOLDER(name) {
  return inferWrapperMAIN_FOLDER(MAIN_FOLDER) || inferWrapperMAIN_FOLDER();

  function inferWrapperMAIN_FOLDER(prefix = "") {
    return trySearch([prefix, name, name]) || trySearch([prefix, name]); // trySearch([prefix, 404, 404]) || trySearch([prefix, 404]);
  }
}

function trySearch(path) {
  path = path.filter(Boolean).join("/");
  if (getRoutesAvailable()[path]) {
    return path;
  }
}

export function evaluateFn(path) {
  const p = getRoutesAvailable()[path];
  const RETURN = typeof p == "function" ? p() : null;
  return RETURN;
}
