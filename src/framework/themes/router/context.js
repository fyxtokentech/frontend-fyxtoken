const keysMain2View = ["default", "View"];

let routes = [];
let allRoutesNComponents = {};
let _componentsContext;
let _customRoutes;

export function getRoutesAvailable() {
  return routes;
}

export function _setRoutesAvailable(nRoutes) {
  routes = nRoutes;
}

export function setComponentsContext(componentsContext) {
  _componentsContext = componentsContext;
}

function getRouterComponents() {
  return _componentsContext;
}

export function getFilePath(filePath) {
  if (!filePath.startsWith("./")) {
    filePath = `./${filePath}`;
  }
  if (!filePath.endsWith(".jsx")) {
    filePath += ".jsx";
  }
  if (getAllPaths().includes(filePath)) {
    return getRouterComponents()(filePath);
  }
}

export function getAllPaths() {
  return getRouterComponents().keys();
}

function getRouterComponentsPath(filePath) {
  const name = filePath.replace("./", "").replace(/\.jsx$/, "");
  const component = getFilePath(filePath);
  const keys = Object.keys(component);
  const kmain = keys.find((k) => keysMain2View.includes(k));
  const main = component[kmain];
  const settings = component.settings;

  return {
    name,
    component,
    kmain,
    main,
  };
}

function loadRoutesComponents() {
  allRoutesNComponents = getAllPaths().reduce((map, filePath) => {
    const props = getRouterComponentsPath(filePath);
    map[props.name] = props;
    return map;
  }, {});
  return allRoutesNComponents;
}

export function setCustomRoutes(customRoutes) {
  _customRoutes = customRoutes;
}

export function getCustomRoutes() {
  return _customRoutes || {};
}

export function mapGenerateComponents() {
  return {
    ...loadRoutesComponents(),
    ...getCustomRoutes(),
  };
}
