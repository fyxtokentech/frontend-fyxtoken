import fs from "fs";
import path from "path";

function replaceInFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`❌ Error leyendo ${filePath}: ${err.message}`);
      return;
    }

    const updated = data
      .replace(/(\.\/[\w\/-]+)\.jsx/g, "$1.js")
      .replace(/(\.\/[\w\/-]+)\.mjs/g, "$1.js");

    fs.writeFile(filePath, updated, "utf8", (err) => {
      if (err) {
        console.error(`❌ Error escribiendo ${filePath}: ${err.message}`);
      } else {
        console.log(`✅ Reemplazo completado en: ${filePath}`);
      }
    });
  });
}

export function processDirectory(dir) {
  console.log("==========================================")
  console.log(dir)
  console.log("==========================================")
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        processDirectory(fullPath); // Recursivo
      } else if (item.isFile() && fullPath.endsWith(".js")) {
        replaceInFile(fullPath);
      }
    }
  } catch (err) {
    console.error(`❌ Error leyendo directorio ${dir}: ${err.message}`);
  }
}
