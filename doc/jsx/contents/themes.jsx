function _themes() {
  return (
    <$FMD>
      <$h1>Temas</$h1>
      Sistema de tematización que permite personalizar la apariencia de la aplicación 
      manteniendo la consistencia visual y la accesibilidad.
      {sep}
      <Personalizacion />
      {sep}
      <Implementacion />
    </$FMD>
  );
}

function Personalizacion() {
  return (
    <$index label="Personalización">
      <$CardF>
        <$CardDef title="Temas Principales" elevation={0}>
          Modos disponibles:
          <ul>
            - Tema claro
            - Tema oscuro
            - Auto (basado en sistema)
            - Personalizado
          </ul>
        </$CardDef>
        <$CardDef title="Paleta de Colores" elevation={0}>
          Colores del sistema:
          <ul>
            - Verde para inversiones/ganancias
            - Rojo para ventas/pérdidas
            - Colores de hover en filas
            - Contrastes optimizados
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Implementacion() {
  return (
    <$index label="Implementación">
      <Card className="pad-10px">
        <$CardDef title="Material-UI Theme" elevation={0}>
          Configuración de temas:
          <ul>
            - ThemeProvider
            - Paletas personalizadas
            - Estilos globales
            - Componentes estilizados
          </ul>
        </$CardDef>
        <$CardDef title="SASS Variables" elevation={0}>
          Sistema de estilos:
          <ul>
            - Variables globales
            - Mixins de tema
            - Funciones de color
            - Estilos modulares
          </ul>
        </$CardDef>
        <$CardDef title="Accesibilidad" elevation={0}>
          Consideraciones:
          <ul>
            - Contraste adecuado
            - Textos legibles
            - Iconos claros
            - Estados focusables
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Sistema de temas diseñado para proporcionar una experiencia 
            visual consistente y accesible en toda la aplicación.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
