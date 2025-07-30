import fs from "fs";
import path from "path";

const extensions = [".css", ".scss", ".json"];

export function copyFile(src, dest) {
  const srcPath = path.resolve(src);
  const destPath = path.resolve(dest);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`${srcPath} copiado en ${destPath} exitosamente.`);
  } catch (err) {
    console.error(`Error copiando ${srcPath}:`, err);
    process.exit(1);
  }
}

export function copyFolder(src, dest) {
  const srcDir = path.resolve(src);
  const destDir = path.resolve(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.readdirSync(srcDir).forEach((item) => {
    const srcItem = path.join(srcDir, item);
    const destItem = path.join(destDir, item);
    if (fs.lstatSync(srcItem).isDirectory()) {
      copyFolder(srcItem, destItem);
    } else {
      const extension = path.extname(srcItem);
      if (extensions.includes(extension)) {
        copyFile(srcItem, destItem);
      }
    }
  });
}
