function _news() {
  return (
    <$FMD>
      <$h1>Noticias</$h1>
      Centro de información actualizado con las últimas noticias y análisis 
      del mercado de activos digitales.
      {sep}
      <$CardF elevation={6} className="pad-20px">
        <div className="grid-2">
          <a href="public/img/captures/news.png" data-lightbox="news" data-title="Noticias - Tema Oscuro">
            <img src="public/img/captures/news.png" alt="News Dark Theme" className="w-100" />
          </a>
          <a href="public/img/captures/news-light.png" data-lightbox="news" data-title="Noticias - Tema Claro">
            <img src="public/img/captures/news-light.png" alt="News Light Theme" className="w-100" />
          </a>
        </div>
      </$CardF>
      {sep}
      <Contenido />
      {sep}
      <Categorias />
    </$FMD>
  );
}

function Contenido() {
  return (
    <$index label="Contenido">
      <$CardF>
        <$CardDef title="Noticias Relevantes" elevation={0}>
          Cobertura informativa:
          <ul>
            - Últimas noticias del mercado
            - Actualizaciones importantes
            - Eventos relevantes
            - Comunicados oficiales
          </ul>
        </$CardDef>
        <$CardDef title="Actualizaciones del Mercado" elevation={0}>
          Información de mercado:
          <ul>
            - Tendencias actuales
            - Movimientos significativos
            - Análisis de mercado
            - Predicciones y proyecciones
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Categorias() {
  return (
    <$index label="Categorías y Filtros">
      <Card className="pad-10px">
        <$CardDef title="Análisis y Tendencias" elevation={0}>
          Contenido especializado:
          <ul>
            - Análisis técnico
            - Análisis fundamental
            - Reportes de mercado
            - Opiniones de expertos
          </ul>
        </$CardDef>
        <$CardDef title="Filtros por Categoría" elevation={0}>
          Organización del contenido:
          <ul>
            - Por tipo de activo
            - Por región
            - Por impacto
            - Por temporalidad
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Mantente informado con las últimas actualizaciones y análisis 
            del mercado de activos digitales.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
