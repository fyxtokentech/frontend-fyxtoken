function _tech() {
  return (
    <$FMD>
      <$h1>Tecnologías</$h1>
      Stack tecnológico utilizado en el desarrollo de FyxToken, enfocado en 
      rendimiento, escalabilidad y experiencia de usuario.
      {sep}
      <Core />
      {sep}
      <Desarrollo />
    </$FMD>
  );
}

function Core() {
  return (
    <$index label="Frontend Core">
      <$CardF>
        <$CardDef title="React 18" elevation={0}>
          Framework principal:
          <ul>
            - Componentes reutilizables
            - Estado global eficiente
            - Renderizado optimizado
            - Virtual DOM
          </ul>
        </$CardDef>
        <$CardDef title="Material-UI" elevation={0}>
          Sistema de diseño:
          <ul>
            - Componentes predefinidos
            - Temas personalizables
            - Diseño responsivo
            - Estilos consistentes
          </ul>
        </$CardDef>
        <$CardDef title="SASS" elevation={0}>
          Estilos avanzados:
          <ul>
            - Variables y mixins
            - Anidamiento de selectores
            - Funciones de color
            - Modularización
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Desarrollo() {
  return (
    <$index label="Herramientas de Desarrollo">
      <Card className="pad-10px">
        <$CardDef title="Configuración" elevation={0}>
          Herramientas de build:
          <ul>
            - react-app-rewired
            - Webpack personalizado
            - config-overrides.js
            - ESLint
          </ul>
        </$CardDef>
        <$CardDef title="Dependencias" elevation={0}>
          Gestión de paquetes:
          <ul>
            - Node.js ≥ 14
            - npm
            - Git
            - Control de versiones
          </ul>
        </$CardDef>
        <$CardDef title="Desarrollo Local" elevation={0}>
          Entorno de desarrollo:
          <ul>
            - Puerto 3000
            - Hot reloading
            - Debugging tools
            - DevTools
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Stack tecnológico moderno y robusto para garantizar la mejor 
            experiencia de desarrollo y usuario final.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
