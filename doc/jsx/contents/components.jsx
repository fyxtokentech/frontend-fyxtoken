function _components() {
  return (
    <$FMD>
      <$h1>Componentes</$h1>
      Biblioteca de componentes reutilizables diseñados para mantener consistencia 
      y eficiencia en toda la aplicación.
      {sep}
      <GUI />
      {sep}
      <Utilidades />
    </$FMD>
  );
}

function GUI() {
  return (
    <$index label="Interfaz Gráfica">
      <$CardF>
        <$CardDef title="Menús" elevation={0}>
          Componentes de navegación:
          <ul>
            - Footer consistente
            - Head-main adaptativo
            - Menús contextuales
            - Navegación intuitiva
          </ul>
        </$CardDef>
        <$CardDef title="Switches" elevation={0}>
          Controles interactivos:
          <ul>
            - Theme changer
            - Toggles personalizados
            - Botones de acción
            - Estados visuales
          </ul>
        </$CardDef>
        <$CardDef title="Plantillas" elevation={0}>
          Contenedores y layouts:
          <ul>
            - Contenedores flexibles
            - Plantillas de creación
            - Layouts responsivos
            - Grids adaptativas
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Utilidades() {
  return (
    <$index label="Utilidades y Helpers">
      <Card className="pad-10px">
        <$CardDef title="Manipulación de Colores" elevation={0}>
          Sistema de colores:
          <ul>
            - Temas dinámicos
            - Paletas personalizadas
            - Efectos visuales
            - Contraste automático
          </ul>
        </$CardDef>
        <$CardDef title="Componentes Repetitivos" elevation={0}>
          Elementos comunes:
          <ul>
            - Carga de imágenes
            - Loaders y spinners
            - Mensajes de estado
            - Notificaciones
          </ul>
        </$CardDef>
        <$CardDef title="SASS" elevation={0}>
          Estilos modulares:
          <ul>
            - Colección sin nombre
            - Manipulación de colores
            - Efectos visuales
            - Main (Resume)
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Componentes diseñados para maximizar la reutilización y mantener 
            una experiencia de usuario consistente.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
