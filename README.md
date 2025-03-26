# FyxToken Frontend

<div align="center">
  <img src="https://fyxtokentech.github.io/frontend-fyxtoken/img/logo-fyxtoken-main-color.svg" alt="FyxToken Logo" width="128" height="120">
</div>

<br>

<div align="center">
  
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D14-success?logo=node.js)](https://nodejs.org/)

</div>

Proyecto frontend desarrollado en React para gestión y visualización de tokens digitales. Ofrece una interfaz intuitiva y potente para el seguimiento, análisis y gestión de activos digitales en tiempo real.

## 📋 Tabla de Contenidos
- [✨ Características](#-caracteristicas)
- [🛠️ Tecnologías](#-tecnologias)
- [💻 Instalación](#-instalacion)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [📱 Vistas](#-vistas)
- [📄 Licencia](#-licencia)
- [🛠️ Comandos Útiles](#-comandos-útiles)

## ✨ Características

### Core
- 📊 Sistema de trading en tiempo real
- 🎨 Tema claro/oscuro personalizable
- 📱 Diseño 100% responsivo
- 🔒 Autenticación segura
- 📈 Gráficos interactivos

### Técnicas
- ⚡ Optimización de rendimiento con React
- 🛠️ Configuración personalizada con react-app-rewired
- 💅 Estilos con Material-UI y SASS
- 🔄 Estado global eficiente
- 📦 Componentes reutilizables

## 🛠️ Tecnologías

### Frontend Core
- React 19
- Material-UI
- SASS para estilos avanzados

### Desarrollo
- Node.js >= 14
- react-app-rewired para personalización de la configuración de Webpack

## 💻 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/fyxtokentech/fyxtoken-frontend.git
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm start
   ```

## 📁 Estructura del Proyecto

```
@root
│
├── @app
│   ├── @routes
│   ├── @theme
│   │   ├── @identity
│   │   └── @components
│   │       ├── @containers
│   │       ├── @templates
│   │       └── @recurrent
│   └── ...
├── @views
└── ...
```

- `@root`: Directorio raíz del proyecto.
- `@app`: Contiene la lógica principal de la aplicación y la configuración.
- `@views`: Componentes de vista para diferentes secciones de la aplicación.
- `@routes`: Definiciones de rutas para la navegación dentro de la aplicación.
- `@theme`: Configuración de temas y estilos.
- `@identity`: Gestión de identidades visuales y paletas de colores.
- `@components`: Componentes reutilizables para la interfaz de usuario.
- `@containers`: Componentes de contenedores específicos.
- `@templates`: Plantillas de diseño para la estructura de la aplicación.
- `@recurrent`: Componentes recurrentes utilizados en múltiples partes de la aplicación.

## 📱 Vistas

- **Dashboard**: Visualización de datos y gráficos. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2F)
- **Wallet**: Gestión de activos digitales. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fwallet&action-id=investment)
- **Panel Robot**: Automatización de inversiones. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Flab%2Fpanel-robot)
- **Pricing**: Información de precios. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fpricing)

## 📄 Licencia

Este proyecto es de uso propietario. Todos los derechos reservados.

## 🛠️ Comandos Útiles

### Iniciar el servidor de desarrollo
Usa este comando para iniciar el servidor de desarrollo.
```bash
npm start
```

### Construir el proyecto
Compila el proyecto para producción.
```bash
npm run build
```

### Ejecutar prueba
Realiza una construcción y sirve el proyecto para prueba.
```bash
npm test
```

### Desplegar en producción
Despliega el proyecto en producción.
```bash
npm run deploy
```

### Desplegar en GitHub Pages
Construye y publica el proyecto en GitHub Pages.
```bash
npm run deploy-gh
```
