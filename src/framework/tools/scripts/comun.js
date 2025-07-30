import { execSync } from "child_process";
import readline from "readline";

const ENVIRONMENT_RUNTIME = {
 stdio: "inherit",
 shell: "powershell.exe",
};

export function exec_cmd(cmd){
  execSync(cmd, ENVIRONMENT_RUNTIME);
}

export async function sleep(s) {
 return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

let rlInstance = null;

export async function question(q) {
  if (!rlInstance) {
    rlInstance = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  return new Promise((resolve) => {
    rlInstance.question(q, (answer) => {
      resolve(answer);
    });
  });
}

export async function closeReadline() {
  await sleep(1);
  if (rlInstance) {
    rlInstance.close();
    rlInstance = null;
  }
}

export async function getUserInput(q, def = "", show = true) {
 if (def && show) {
   q += ` (default ${def}): `;
 }
 const answer = await question(q);
 return answer ? answer.trim().toLowerCase() : def;
};

export async function getUserConfirm(q) {
 q += " (Y|S para aceptar): ";
 const answer = await getUserInput(q, "n", false);
 const confirmacion = ["y", "s"].includes(answer);
 if (!confirmacion) {
   console.log("Cancelado 🚫");
 }
 return confirmacion;
};

export function isCancel(answer) {
 return answer === "*";
}