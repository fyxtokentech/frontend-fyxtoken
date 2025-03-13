function _withdrawals() {
  return (
    <$FMD>
      <$h1>Retiros</$h1>
      Sistema simplificado para la gestión y procesamiento de retiros de activos 
      digitales de forma segura y eficiente.
      {sep}
      <$CardF elevation={6} className="pad-20px">
        <div className="grid-2">
          <a href="public/img/captures/withdrawal.png" data-lightbox="withdrawals" data-title="Retiros - Tema Oscuro">
            <img src="public/img/captures/withdrawal.png" alt="Withdrawal Dark Theme" className="w-100" />
          </a>
          <a href="public/img/captures/withdrawal-light.png" data-lightbox="withdrawals" data-title="Retiros - Tema Claro">
            <img src="public/img/captures/withdrawal-light.png" alt="Withdrawal Light Theme" className="w-100" />
          </a>
        </div>
      </$CardF>
      {sep}
      <Proceso />
      {sep}
      <Seguridad />
    </$FMD>
  );
}

function Proceso() {
  return (
    <$index label="Proceso de Retiro">
      <$CardF>
        <$CardDef title="Proceso Simplificado" elevation={0}>
          Pasos del proceso de retiro:
          <ul>
            - Selección de activo
            - Especificación de monto
            - Confirmación de dirección
            - Verificación de comisiones
          </ul>
        </$CardDef>
        <$CardDef title="Múltiples Métodos" elevation={0}>
          Opciones disponibles:
          <ul>
            - Retiro a wallet externa
            - Conversión automática
            - Retiro a cuenta bancaria
            - Procesamiento rápido
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Seguridad() {
  return (
    <$index label="Medidas de Seguridad">
      <Card className="pad-10px">
        <$CardDef title="Confirmación Segura" elevation={0}>
          Protocolos de seguridad:
          <ul>
            - Autenticación de dos factores
            - Límites de retiro
            - Verificación de dirección
            - Período de espera
          </ul>
        </$CardDef>
        <$CardDef title="Historial de Retiros" elevation={0}>
          Seguimiento detallado:
          <ul>
            - Registro de operaciones
            - Estado de procesamiento
            - Notificaciones
            - Comprobantes
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Proceso optimizado para garantizar la seguridad y rapidez 
            en cada operación de retiro.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
