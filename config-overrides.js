const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@app": path.resolve(__dirname, "src/app"),
    "@routes": path.resolve(__dirname, "src/app/routes"),
    "@theme": path.resolve(__dirname, "src/app/theme"),
    "@identity": path.resolve(__dirname, "src/app/theme/identity"),
    "@components": path.resolve(__dirname, "src/app/theme/components"),
  }),
  (config) => {
    config.resolve.extensions = config.resolve.extensions.concat(['.js', '.jsx', '.mjs']);
    return config;
  }
);
