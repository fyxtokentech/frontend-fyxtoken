function _intervals() {
  return (
    <$FMD>
      <$h1>Intervalos de Tiempo</$h1>
      Sistema de configuración de intervalos temporales para análisis y 
      visualización de datos de trading.
      {sep}
      <Intervalos />
      {sep}
      <Aplicacion />
    </$FMD>
  );
}

function Intervalos() {
  return (
    <$index label="Intervalos Disponibles">
      <$CardF>
        <$CardDef title="Intervalos Cortos" elevation={0}>
          Análisis detallado:
          <ul>
            - 1 minuto (1m)
            - 5 minutos (5m)
            - 10 minutos (10m)
            - 15 minutos (15m)
          </ul>
        </$CardDef>
        <$CardDef title="Intervalos Medios y Largos" elevation={0}>
          Visión general:
          <ul>
            - 1 hora (1h)
            - 1 día (1d)
            - 1 semana (1s)
            - 2 semanas (2s)
            - 1 mes
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Aplicacion() {
  return (
    <$index label="Aplicación y Uso">
      <Card className="pad-10px">
        <$CardDef title="Uso en Gráficos" elevation={0}>
          Aplicaciones prácticas:
          <ul>
            - Análisis técnico detallado
            - Identificación de tendencias
            - Patrones de trading
            - Toma de decisiones
          </ul>
        </$CardDef>
        <$CardDef title="Personalización" elevation={0}>
          Opciones de configuración:
          <ul>
            - Intervalos favoritos
            - Configuración por defecto
            - Alertas por intervalo
            - Vista personalizada
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Los intervalos de tiempo son fundamentales para un análisis 
            efectivo y una toma de decisiones informada en el trading.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
