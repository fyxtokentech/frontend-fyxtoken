# FyxToken Frontend · build-prod

<div align="center">
  <img src="https://fyxtokentech.github.io/frontend-fyxtoken/img/metadata/logo-main.svg" alt="FyxToken Logo" width="128" height="120">
</div>

<h2>
  <p align="center">
    Rama auxiliar de producción
  </p>
</h2>

<div align="center">

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D14-success?logo=node.js)](https://nodejs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v6.4.8-purple?logo=mui)](https://mui.com/)
[![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![MUI X](https://img.shields.io/badge/MUI--X-v7.28.0-007FFF?logo=mui)](https://mui.com/x/)
[![Camaleon UI](https://img.shields.io/badge/Camaleon%20UI->=0.0.196-4ECDC4?logoColor=white)](https://jeff-aporta.github.io/camaleon-ui/)

</div>

> **ℹ️ Nota:** Este directorio/branch `build-prod` **no** contiene código fuente.  
> Es un contenedor auxiliar que aloja **únicamente** los artefactos generados
> tras ejecutar el comando de construcción (`npm run build`).  
> El código fuente completo reside en la rama principal del proyecto
> `frontend-fyxtoken`.

## 🔰 Propósito

`build-prod` sirve como una **rama de entrega** para entornos de producción.
Los archivos aquí presentes son estáticos (HTML, CSS, JS, assets).

Esto permite:

1. Mantener el repositorio de código fuente limpio y ligero.
2. Separar el ciclo de desarrollo del de distribución.
3. Facilitar integraciones CI/CD donde la carpeta `build` es el único artefacto
   requerido para desplegar.

