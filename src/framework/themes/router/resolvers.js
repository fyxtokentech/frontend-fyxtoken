import { namesMainJSX } from "./inference.js";
import { getAssignedPath, getQueryPath } from "./router.jsx";
import { getAllPaths, getFilePath } from "./context.js";
import { MAIN_FOLDER } from "./inference.js";

const FOLDER_COMPONENTS = "components";
const FILE_COMMON = "$Common";

export function getCommonQuery({ query, STATIC } = {}) {
  return (
    getStaticQuery({ query, STATIC: FILE_COMMON }) ||
    getStaticQuery({ query, STATIC: [FOLDER_COMPONENTS, FILE_COMMON] })
  );
}

export function getCommonRoot() {
  return (
    // $Common.jsx
    getCommonQuery({ query: "/" }) ||
    // components/$Common.jsx
    getCommonQuery({ query: "/", STATIC: FOLDER_COMPONENTS }) ||
    // _main/components/$Common.jsx
    getCommonQuery({ query: MAIN_FOLDER, STATIC: FOLDER_COMPONENTS })
  );
}

function toPath({ query, STATIC }) {
  if (Array.isArray(query)) {
    query = query.join("/");
  }
  if (typeof STATIC == "function") {
    STATIC = STATIC({ FOLDER_COMPONENTS, subcomponent: (name) => [
      FOLDER_COMPONENTS,
      Array.isArray(name) ? (()=>{
        const RETURN = []
        name.forEach((n, i, arr)=>{
          RETURN.push(n)
          if(i < arr.length - 1){
            RETURN.push(FOLDER_COMPONENTS)
          }
        })
        return RETURN
      })() : name,
      FOLDER_COMPONENTS,
    ] });
  }
  if (Array.isArray(STATIC)) {
    STATIC = STATIC.join("/");
  }
  if (!query) {
    query = getAssignedPath();
  } else if (query == "/") {
    query = "";
  }
  const path = [query, STATIC].filter(Boolean).join("/");
  return { path, STATIC, query };
}

export function getStaticQuery({ query, STATIC } = {}) {
  const { path } = toPath({ query, STATIC });
  const RETURN = getFilePath(path);
  return RETURN;
}

export function getComponentsQuery({ query, STATIC = FOLDER_COMPONENTS } = {}) {
  let path;
  ({ path, STATIC, query } = toPath({ query, STATIC }));
  let RETURN = getFirstLevelFolder(path);
  if (!RETURN && !query) {
    return getComponentsQuery({
      query: MAIN_FOLDER,
      STATIC,
    });
  }
  return RETURN;
}

export function getFirstLevelFolder(folder) {
  folder = folder.replace("./", "");
  const allp = getAllPaths()
    .map((path) => path.replace("./", ""))
    .filter((path) => path.startsWith(folder));

  const RETORNO = allp
    .map((path) => {
      const lvlsF = folder.split("/").length;
      const lvlsP = path.split("/").length;
      const diffLvls = lvlsP - lvlsF;
      const nodes = path.split("/");
      const sheet = nodes.at(-1);
      if (diffLvls == 1) {
        return {
          name: sheet.replace(/\.jsx$/, ""),
          path,
        };
      }
      if (diffLvls == 2) {
        const branch = nodes.at(-2);
        if (namesMainJSX.includes(sheet.replace(/\.jsx$/, ""))) {
          return {
            name: branch,
            path,
          };
        }
        if (sheet == branch + ".jsx") {
          return {
            name: branch,
            path,
          };
        }
      }
    })
    .filter(Boolean)
    .map((p) => {
      let { name, path } = p;
      if (!path.startsWith("./")) {
        path = `./${path}`;
      }
      let file = getFilePath(path, name);
      const keys = Object.keys(file);
      const k = keys[0];
      if (keys.length == 1 && k == "default") {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        file = file.default;
      }
      return {
        [name]: file,
      };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  if (Object.keys(RETORNO).length) {
    return RETORNO;
  }
}
