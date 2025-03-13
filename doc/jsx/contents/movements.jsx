function _movements() {
  return (
    <$FMD>
      <$h1>Movimientos</$h1>
      Sistema de seguimiento detallado de todas las transacciones y operaciones 
      realizadas en la plataforma.
      {sep}
      <$CardF elevation={6} className="pad-20px">
        <div className="grid-2">
          <a href="public/img/captures/movements.png" data-lightbox="movements" data-title="Movimientos - Tema Oscuro">
            <img src="public/img/captures/movements.png" alt="Movements Dark Theme" className="w-100" />
          </a>
          <a href="public/img/captures/movements-light.png" data-lightbox="movements" data-title="Movimientos - Tema Claro">
            <img src="public/img/captures/movements-light.png" alt="Movements Light Theme" className="w-100" />
          </a>
        </div>
      </$CardF>
      {sep}
      <Caracteristicas />
      {sep}
      <Filtros />
    </$FMD>
  );
}

function Caracteristicas() {
  return (
    <$index label="Características">
      <$CardF>
        <$CardDef title="Historial Detallado" elevation={0}>
          Registro completo de operaciones:
          <ul>
            - Fecha y hora de transacción
            - Tipo de operación
            - Monto y token involucrado
            - Estado de la transacción
          </ul>
        </$CardDef>
        <$CardDef title="Estado de Operaciones" elevation={0}>
          Seguimiento en tiempo real:
          <ul>
            - Confirmaciones de red
            - Estado de procesamiento
            - Notificaciones automáticas
            - Detalles de comisiones
          </ul>
        </$CardDef>
      </$CardF>
    </$index>
  );
}

function Filtros() {
  return (
    <$index label="Filtros Avanzados">
      <Card className="pad-10px">
        <$CardDef title="Opciones de Filtrado" elevation={0}>
          Herramientas de búsqueda y filtrado:
          <ul>
            - Por tipo de operación
            - Por rango de fechas
            - Por monto
            - Por estado
          </ul>
        </$CardDef>
        <$CardDef title="Exportación de Datos" elevation={0}>
          Funcionalidades de exportación:
          <ul>
            - Exportar a CSV
            - Reportes personalizados
            - Resúmenes periódicos
            - Formatos compatibles
          </ul>
        </$CardDef>
        <Card className="pad-20px" elevation={6}>
          <strong>
            Colores de hover en filas para mejor visualización y seguimiento 
            de las transacciones.
          </strong>
        </Card>
      </Card>
    </$index>
  );
}
