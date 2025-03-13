function _wallet() {
  return (
    <$FMD>
      <$h1>Wallet</$h1>
      Centro de control unificado para la gestión de tus activos digitales. 
      Interfaz intuitiva que proporciona una visión clara y detallada de tu portafolio.
      {sep}
      <$CardF elevation={6} className="pad-20px">
        <div className="grid-2">
          <a href="public/img/captures/wallet.png" data-lightbox="wallet" data-title="Wallet - Tema Oscuro">
            <img src="public/img/captures/wallet.png" alt="Wallet Dark Theme" className="w-100" />
          </a>
          <a href="public/img/captures/wallet-light.png" data-lightbox="wallet" data-title="Wallet - Tema Claro">
            <img src="public/img/captures/wallet-light.png" alt="Wallet Light Theme" className="w-100" />
          </a>
        </div>
      </$CardF>
      {sep}
      <Caracteristicas />
      {sep}
      <Funcionalidades />
    </$FMD>
  );
}

function Caracteristicas() {
  return (
    <$index label="Características">
      <$CardF>
        <$CardDef title="Vista General del Portafolio" elevation={0}>
          Panel principal que muestra el resumen completo de tus activos:
          <ul>
            - Balance total en tiempo real
            - Distribución de activos
            - Rendimiento histórico
            - Gráficos interactivos
          </ul>
        </$CardDef>
        <$CardDef title="Tema Adaptativo" elevation={0}>
          Interfaz moderna con soporte para tema claro y oscuro:
          <ul>
            - Cambio automático según preferencias del sistema
            - Personalización manual del tema
            - Diseño responsivo para todos los dispositivos
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Funcionalidades() {
  return (
    <$index label="Funcionalidades">
      <Card className="pad-10px">
        <$CardDef title="Acciones Rápidas" elevation={0}>
          Acceso directo a operaciones frecuentes:
          <ul>
            - Envío de tokens
            - Recepción de activos
            - Conversión entre tokens
            - Historial de transacciones
          </ul>
        </$CardDef>
        <$CardDef title="Seguridad" elevation={0}>
          Características avanzadas de seguridad:
          <ul>
            - Autenticación de dos factores
            - Confirmación de operaciones
            - Historial de actividad
            - Alertas de seguridad
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            El wallet de FyxToken está diseñado para proporcionar una experiencia
            segura y eficiente en la gestión de tus activos digitales.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
