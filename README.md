# FyxToken Frontend

<div align="center">
  <img src="https://fyxtokentech.github.io/frontend-fyxtoken/img/logo-fyxtoken-main-color.svg" alt="FyxToken Logo" width="128" height="120">
</div>

<h2>
  <p align="center">
    <a href="https://fyxtokentech.github.io/frontend-fyxtoken">https://fyxtokentech.github.io/frontend-fyxtoken</a>
  </p>
</h2>

<br>

<div align="center">
  
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D14-success?logo=node.js)](https://nodejs.org/)
[![Webpack](https://img.shields.io/badge/Webpack-5-orange?logo=webpack)](https://webpack.js.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v6.4.8-purple?logo=mui)](https://mui.com/)
</div>

Proyecto frontend desarrollado en React para gestión y visualización de tokens digitales. Ofrece una interfaz intuitiva y potente para el seguimiento, análisis y gestión de activos digitales en tiempo real.

## 📋 Tabla de Contenidos
- [✨ Características](#-caracteristicas)
- [🛠️ Tecnologías](#-tecnologias)
- [💻 Instalación](#-instalacion)
- [⚙️ Configuración](#-configuracion)
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
- 📈 Gráficos interactivos con MUI X-Charts
- 💱 Conversión entre múltiples monedas
- 🤖 Panel Robot para automatización de inversiones

### Técnicas
- ⚡ Optimización de rendimiento con React 19
- 🛠️ Configuración personalizada con react-app-rewired
- 💅 Estilos con Material-UI v6 y SASS
- 🔄 Estado global eficiente
- 📦 Componentes reutilizables
- 🔍 Estructura modular para facilitar el mantenimiento
- 📱 Soporte para múltiples dispositivos con diseño adaptativo

## 🛠️ Tecnologías

### Frontend Core
- React 19.0.0
- Material-UI v6.4.8
- SASS para estilos avanzados
- React Router v7.4.0 para navegación
- MUI X-Charts v7.28.0 para visualización de datos
- MUI X-Data-Grid v7.28.1 para tablas de datos
- React Hot Toast para notificaciones

### Desarrollo
- Node.js >= 14
- react-app-rewired v2.2.1 para personalización de la configuración de Webpack
- Webpack 5 con configuración optimizada
- Babel para compatibilidad con navegadores
- ESLint y Prettier para mantener la calidad del código
- Cross-env para manejo de variables de entorno
- gh-pages para despliegue en GitHub Pages

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
   El servidor se iniciará en http://localhost:3000

## ⚙️ Configuración

### Personalización de Webpack
El proyecto utiliza `react-app-rewired` para modificar la configuración de webpack sin necesidad de hacer eject. La configuración se encuentra en:

```
├── config-overrides.js  # Configuración principal de webpack
└── .env                # Variables de entorno
```

### Temas y Estilos
La configuración de temas está ubicada en:

```
├── src/app/theme/identity/palettes.jsx  # Definición de paletas de colores
└── src/app/theme/components/            # Componentes con estilos temáticos
```

## 📁 Estructura del Proyecto

```
@root
│
├── @public             # Archivos estáticos y recursos públicos
│   ├── img             # Imágenes y recursos gráficos
│   └── ...
│
├── @src
│   ├── @app            # Núcleo de la aplicación
│   │   ├── @routes     # Configuración de rutas
│   │   ├── @theme      # Sistema de temas
│   │   │   ├── @identity   # Identidad visual (colores, tipografía)
│   │   │   └── @components # Componentes UI con estilos temáticos
│   │   │       ├── @containers  # Contenedores de alto nivel
│   │   │       ├── @templates   # Plantillas de página
│   │   │       └── @recurrent   # Componentes reutilizables
│   │   └── ...
│   │
│   ├── @views             # Componentes de vista para cada sección
│   │   ├── dashboard      # Vista principal del dashboard
│   │   ├── wallet         # Gestión de billetera digital
│   │   ├── dev            # Componentes en desarrollo
│   │   │   ├── bot        # Panel Robot para automatización
│   │   │   └── resumen    # Panel Resumen
│   │   ├── welcome    # Página de bienvenida
│   │   └── ...
│   │
│   └── index.js        # Punto de entrada de la aplicación
│
└── config-overrides.js # Configuración personalizada de webpack
```

## 📱 Vistas

- **Bienvenida**: Página principal de bienvenida. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/)
- **Precios**: Información detallada de precios. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fwelcome%2Fpricing)
- **Login**: Acceso a la plataforma. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fusers%2Flogin)
- **Wallet**: Gestión de activos digitales. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fusers%2Fwallet&action-id=investment)
- **Panel Resumen**: Visualización de datos y estadísticas. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fdev%2Fresume)
- **Panel Robot**: Automatización de inversiones. [Ver más](https://fyxtokentech.github.io/frontend-fyxtoken/?view-id=%2Fdev%2Fbot&action-id=main)

## 📄 Licencia

Este proyecto es de uso propietario. Todos los derechos reservados.

## 🛠️ Comandos Útiles

### Iniciar el servidor de desarrollo
Usa este comando para iniciar el servidor de desarrollo en http://localhost:3000.
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
