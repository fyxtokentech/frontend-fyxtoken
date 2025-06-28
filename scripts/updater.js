import { updater_cmd,  packageJson_updater_cmd } from "@jeff-aporta/camaleon/scripts";
import packageJson from "../package.json" with { type: "json" };

packageJson_updater_cmd(packageJson);

updater_cmd({
  publish: false,
  git: false,
  ghPages: true,
  buildProd: true,
  deleteBuild: true,
  deleteDist: false,
});
