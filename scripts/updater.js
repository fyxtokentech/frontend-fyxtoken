import { updater_cmd, setDirectory } from "@jeff-aporta/camaleon/scripts";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
setDirectory(path.resolve(__dirname, ".."));

updater_cmd({
  ghPages: true,
  buildProd: true,
  deleteBuild: true,
  deleteDist: false,
});
