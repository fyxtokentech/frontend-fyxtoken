import { estructuras } from "./vars.js";

let permitir_actualizacion = true;

export const style = document.createElement("style");
{
  style.classList.add("fluidCSS");
  document.head.appendChild(style);
}

export function actualizar_style() {
  if (!permitir_actualizacion) {
    return;
  }
  // permitir_actualizacion = false;
  style.innerHTML = Object.values(estructuras).join("");
  permitir_actualizacion = true;
}
