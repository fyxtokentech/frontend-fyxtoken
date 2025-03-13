function _charts() {
  return (
    <$FMD>
      <$h1>Gráficos</$h1>
      Sistema avanzado de visualización de datos para análisis técnico y 
      seguimiento de mercado en tiempo real.
      {sep}
      <Visualizacion />
      {sep}
      <Configuracion />
    </$FMD>
  );
}

function Visualizacion() {
  return (
    <$index label="Visualización">
      <$CardF>
        <$CardDef title="Gráficos en Tiempo Real" elevation={0}>
          Características principales:
          <ul>
            - Actualización en tiempo real
            - Múltiples tipos de gráficos
            - Indicadores técnicos
            - Herramientas de dibujo
          </ul>
        </$CardDef>
        <$CardDef title="Colores Optimizados" elevation={0}>
          Esquema de colores intuitivo:
          <ul>
            - Verde para inversiones/compras
            - Rojo para ventas
            - Personalización de temas
            - Contraste optimizado
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Configuracion() {
  return (
    <$index label="Configuración">
      <Card className="pad-10px">
        <$CardDef title="Intervalos de Tiempo" elevation={0}>
          Rangos disponibles:
          <ul>
            - 1 minuto (1m)
            - 5 minutos (5m)
            - 10 minutos (10m)
            - 15 minutos (15m)
            - 1 hora (1h)
            - 1 día (1d)
            - 1 semana (1s)
            - 2 semanas (2s)
            - 1 mes
          </ul>
        </$CardDef>
        <$CardDef title="Herramientas de Análisis" elevation={0}>
          Funcionalidades avanzadas:
          <ul>
            - Indicadores personalizables
            - Líneas de tendencia
            - Fibonacci
            - Patrones de velas
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Visualización profesional con herramientas completas para 
            análisis técnico y toma de decisiones.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
