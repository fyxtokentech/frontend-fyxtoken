const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

const { resolve } = path;

// ----- FOLDERS
const ROOT = __dirname;
const SRC = [ROOT, "src"];
const APP = [...SRC, "app"];
const API = [...SRC, "api"];
const VIEWS = [...SRC, "views"];
const TABLES = [...SRC, "tables"];
const TABLES_TEST = [...TABLES, "test"];
const THEME = [...APP, "theme"];
const IDENTITY = [...THEME, "identity"];
const COMPONENTS = [...THEME, "components"];
const GUI = [...COMPONENTS, "GUI"];
const _TEMPLATES = [...COMPONENTS, "templates"];
// ----- FILES
const API_BASE = [...API, "base.js"];
const API_MOCKS = [...API, "mocks.js"];
const CONTAINERS = [...COMPONENTS, "containers.jsx"];
const TEMPLATES = [..._TEMPLATES, "templates.jsx"];
const RECURRENT = [..._TEMPLATES, "recurrent.jsx"];

module.exports = override(
  addWebpackAlias({
    "@root": resolve(ROOT),
    "@src": resolve(...SRC),
    "@app": resolve(...APP),
    "@api": resolve(...API_MOCKS),
    //"@api": resolve(...API_INDEX),
    "@views": resolve(...VIEWS),
    "@tables": resolve(...TABLES),
    "@test": resolve(...TABLES_TEST),
    "@theme": resolve(...THEME),
    "@identity": resolve(...IDENTITY),
    "@components": resolve(...COMPONENTS),
    "@GUI": resolve(...GUI),
    "@containers": resolve(...CONTAINERS),
    "@templates": resolve(...TEMPLATES),
    "@recurrent": resolve(...RECURRENT),
  }),
  (config) => {
    config.resolve.extensions = config.resolve.extensions.concat([
      ".js",
      ".jsx",
      ".mjs",
    ]);
    return config;
  }
);
