const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@root": path.resolve(__dirname),
    "@src": path.resolve(__dirname, "src"),
    "@app": path.resolve(__dirname, "src/app"),
    "@api": path.resolve(__dirname, "src/app/api/index.js"),
    "@views": path.resolve(__dirname, "src/views"),
    "@theme": path.resolve(__dirname, "src/app/theme"),
    "@components": path.resolve(__dirname, "src/app/theme/components"),
    "@recurrent": path.resolve(__dirname, "src/app/theme/components/recurrent.jsx"),
    "@tables": path.resolve(__dirname, "src/tables"),
    "@test": path.resolve(__dirname, "src/tables/test"),
  }),
  (config) => {
    config.resolve.extensions = config.resolve.extensions.concat(['.js', '.jsx', '.mjs']);
    return config;
  }
);
