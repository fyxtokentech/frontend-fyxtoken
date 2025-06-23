import { updater_cmd,  packageJson_updater_cmd } from "@jeff-aporta/camaleon";
import packageJson from "../package.json" with { type: "json" };
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

packageJson_updater_cmd(packageJson);

updater_cmd({
  publish: false,
  git: false,
  ghPages: true,
  buildProd: true,
  deleteBuild: true,
  deleteDist: true,
});
