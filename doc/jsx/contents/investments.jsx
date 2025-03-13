function _investments() {
  return (
    <$FMD>
      <$h1>Inversiones</$h1>
      Panel de inversiones que proporciona una visión completa de las oportunidades 
      de mercado y el rendimiento de tus inversiones en tiempo real.
      {sep}
      <$CardF elevation={6} className="pad-20px">
        <div className="grid-2">
          <a href="public/img/captures/investment.png" data-lightbox="investment" data-title="Inversiones - Tema Oscuro">
            <img src="public/img/captures/investment.png" alt="Investment Dark Theme" className="w-100" />
          </a>
          <a href="public/img/captures/investment-light.png" data-lightbox="investment" data-title="Inversiones - Tema Claro">
            <img src="public/img/captures/investment-light.png" alt="Investment Light Theme" className="w-100" />
          </a>
        </div>
      </$CardF>
      {sep}
      <Caracteristicas />
      {sep}
      <Analisis />
    </$FMD>
  );
}

function Caracteristicas() {
  return (
    <$index label="Características">
      <$CardF>
        <$CardDef title="Visualización de Oportunidades" elevation={0}>
          Panel interactivo que muestra:
          <ul>
            - Oportunidades de inversión actuales
            - Tendencias del mercado
            - Indicadores clave
            - Alertas personalizadas
          </ul>
        </$CardDef>
        <$CardDef title="Estadísticas Detalladas" elevation={0}>
          Información completa sobre tus inversiones:
          <ul>
            - Rendimiento histórico
            - Análisis de riesgo
            - Comparativas de mercado
            - Proyecciones futuras
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Analisis() {
  return (
    <$index label="Análisis">
      <Card className="pad-10px">
        <$CardDef title="Gráficos Interactivos" elevation={0}>
          Herramientas avanzadas de análisis:
          <ul>
            - Gráficos en tiempo real
            - Indicadores técnicos
            - Patrones de mercado
            - Análisis personalizado
          </ul>
        </$CardDef>
        <$CardDef title="Información en Tiempo Real" elevation={0}>
          Datos actualizados constantemente:
          <ul>
            - Precios en vivo
            - Volumen de trading
            - Profundidad del mercado
            - Noticias relevantes
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Colores optimizados para trading:
            - Verde para inversiones
            - Rojo para ventas
            Facilitando la rápida identificación de operaciones.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
