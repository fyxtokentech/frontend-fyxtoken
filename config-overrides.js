const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@root": path.resolve(__dirname),
    "@app": path.resolve(__dirname, "src/app"),
    "@views": path.resolve(__dirname, "src/views"),
    "@theme": path.resolve(__dirname, "src/app/theme"),
    "@identity": path.resolve(__dirname, "src/app/theme/identity"),
    "@components": path.resolve(__dirname, "src/app/theme/components"),
    "@containers": path.resolve(__dirname, "src/app/theme/components/containers.jsx"),
    "@templates": path.resolve(__dirname, "src/app/theme/components/templates/templates.jsx"),
    "@recurrent": path.resolve(__dirname, "src/app/theme/components/templates/recurrent.jsx"),
  }),
  (config) => {
    config.resolve.extensions = config.resolve.extensions.concat(['.js', '.jsx', '.mjs']);
    return config;
  }
);
