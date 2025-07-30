#!/usr/bin/env node --experimental-modules
import { copyFolder } from "./copy-filesext.js";
import { processDirectory } from "./replace-jsx.js";
import path from "path";
import {
  getUserInput,
  getUserConfirm,
  isCancel,
  sleep,
  exec_cmd,
  closeReadline,
} from "../comun.js";

let packageJson = {
  version: "0.0.1",
};

let config = {};
let directory = "";

export function config_updater_cmd(conf) {
  config = conf;
}

export function setDirectory(dir) {
  directory = dir;
}

export function packageJson_updater_cmd(pack) {
  packageJson = pack;
}

export async function updater_cmd({
  publish,
  git,
  ghPages,
  buildProd,
  deleteBuild,
  deleteDist,
}) {
  if (publish && (await getUserConfirm("¿Publicar npm?"))) {
    await publishPackage(config);
    await closeReadline();
  }

  if (git && (await getUserConfirm("¿Actualizar en git?"))) {
    const branch = await getUserInput("Nombre de la rama: ", "main");
    if (isCancel(branch)) {
      console.log("Operación cancelada 🚫");
    } else {
      gitAutoPush({ name_branch: branch });
    }
    await closeReadline();
  }

  if (ghPages && (await getUserConfirm("¿Publicar gh-pages?"))) {
    deployGHPages();
    await closeReadline();
  }

  if (buildProd && (await getUserConfirm("¿Publicar rama de producción?"))) {
    const buildBranch = await getUserInput("Nombre de la rama: ", "build-prod");
    if (isCancel(buildBranch)) {
      console.log("Operación cancelada 🚫");
    } else {
      await deployBuild({ PUBLIC_URL: "/", name_branch: buildBranch });
    }
    await closeReadline();
  }

  if (
    deleteBuild &&
    (ghPages || buildProd) &&
    (await getUserConfirm("¿Eliminar build?"))
  ) {
    deleteTempDeploy("build");
    await closeReadline();
  }

  if (deleteDist && publish && (await getUserConfirm("¿Eliminar dist?"))) {
    deleteTempDeploy("dist");
    await closeReadline();
  }

  await closeReadline();
  console.log("Operación completada ✅");
}

function gitAutoPush({ name_branch = "main" }) {
  console.log("Publicando...");
  exec_cmd(`git add .`);
  exec_cmd(
    `git commit -m "Actualización, v${packageJson.version}, ${timeStamp()}"`
  );
  exec_cmd(`git push origin ${name_branch}`);
}

function build({ PUBLIC_URL = "/" }) {
  console.log("Construyendo paquete...");
  exec_cmd(`npm run build:context --public-url=${PUBLIC_URL}`);
}

async function publishPackage(props) {
  buildPackage(props);
  await sleep(2);
  publish();

  function publish() {
    console.log("Publicando paquete...");
    exec_cmd(`npm publish --access public`);
    exec_cmd(`npm version patch --no-git-tag-version --no-git-commit-hooks`);
  }

  function buildPackage({ framework, dist, sass_framework, sass_dist }) {
    console.log("Construyendo paquete...");
    exec_cmd(`npx babel ${framework} --out-dir ${dist}`);
    processDirectory(dist);
    if (sass_framework && sass_dist) {
      copyFolder(sass_framework, sass_dist);
    }
  }
}

function timeStamp() {
  const data = new Date();
  return [
    data.getFullYear(),
    data.getMonth() + 1,
    data.getDate() + "-",
    data.getHours(),
    data.getMinutes(),
    data.getSeconds(),
  ]
    .map((x) => x.toString().padStart(2, "0"))
    .join("");
}

function cleanTempDeploy() {
  try {
    console.log("Limpiando carpeta temporal...");
    exec_cmd("Remove-Item -Path .\\temp-deploy\\* -Recurse -Force");
  } catch (e) {
    console.log(
      "⚠️  Advertencia: no se pudo limpiar carpeta temp-deploy/*",
      e.message
    );
  }
}

function deleteTempDeploy(name_folder = "temp-deploy") {
  try {
    console.log("Elimiando carpeta temporal...");
    exec_cmd(`Remove-Item -Recurse -Force .\\${name_folder}`);
  } catch (e) {
    console.warn(
      "Advertencia: no se pudo eliminar carpeta temp-deploy:",
      e.message
    );
  }
}

async function deployBuild({ PUBLIC_URL = "/", name_branch = "build-prod" }) {
  console.log("Deploy de build...", { PUBLIC_URL, name_branch });
  try {
    deleteTempDeploy();

    build({ PUBLIC_URL });
    console.log("Limpiando worktrees huérfanos...");
    exec_cmd("git worktree prune");
    console.log("Agregando worktree temporal...");
    exec_cmd("git worktree add -f temp-deploy");

    cleanTempDeploy();

    console.log("Copiando build a carpeta temporal...");
    exec_cmd(
      "Copy-Item -Path build\\* -Destination temp-deploy -Recurse -Force"
    );

    console.log("Entrando en temp-deploy...");
    exec_cmd(`cd ${path.resolve(directory, "temp-deploy")}`);

    try {
      console.log("Eliminando branch build-prod si existe...");
      exec_cmd(`git branch -D ${name_branch}`);
    } catch (e) {
      console.log("Branch build-prod no existe.");
    }

    console.log("Creando rama orphan para deploy...");
    exec_cmd("git stash push -m 'Trabajo en progreso'");
    exec_cmd(`git checkout --orphan ${name_branch}`);
    await sleep(1);

    exec_cmd("git add .");
    const fecha = timeStamp();
    exec_cmd(`git commit -m "Autodeploy v${packageJson.version} ${fecha}"`);

    console.log("Push forzado a build-prod...");
    exec_cmd(`git push origin HEAD:${name_branch} --force`);

    console.log("Volviendo al directorio raíz...");
    exec_cmd(`cd ${path.resolve(directory)}`);

    exec_cmd("git switch main");
    await sleep(1);
    exec_cmd("git stash pop");
    deleteTempDeploy();

    console.log("✅ Deploy manual completado.");
  } catch (err) {
    console.error("❌ Error en deploy manual:", err.message);
    process.exit(1);
  }
  closeReadline();
}

function deployGHPages() {
  build({ PUBLIC_URL: "." });
  exec_cmd(`npm run deploy:gh-pages`);
}
