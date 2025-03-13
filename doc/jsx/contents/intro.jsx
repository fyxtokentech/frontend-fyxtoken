const sep = (
  <_>
    <$$h />
    <$hr />
    <$$h />
  </_>
);

function _intro() {
  return (
    <$FMD>
      <$h1>
        <img 
          src="public/img/Logo_Fyxtoken_Icono_Color_Principal.svg" 
          alt="FyxToken Logo" 
          style={{ height: "50px", marginRight: "15px" }}
        />
        Bienvenido a FyxToken
      </$h1>
      Plataforma moderna para la gestión y trading de activos digitales, 
      desarrollada con las últimas tecnologías web para ofrecer una experiencia 
      de usuario excepcional.
      {sep}
      <$CardF elevation={6} className="pad-20px">
        <div className="grid-2">
          <a href="public/img/captures/login.png" data-lightbox="login" data-title="Login - Tema Oscuro">
            <img src="public/img/captures/login.png" alt="Login Dark Theme" className="w-100" />
          </a>
          <a href="public/img/captures/login-light.png" data-lightbox="login" data-title="Login - Tema Claro">
            <img src="public/img/captures/login-light.png" alt="Login Light Theme" className="w-100" />
          </a>
        </div>
      </$CardF>
      {sep}
      {<Caracteristicas />}
      {sep}
      {/* <Tecnologias /> */}
    </$FMD>
  );

  function Caracteristicas() {
    return (
      <$index label="Características">
        <Card className="pad-10px">
          <Typography variant="h5">Core:</Typography>
          {sep}
          <$CardDef title="Sistema de Trading" elevation={0}>
            Trading en tiempo real con gráficos interactivos y análisis de mercado.
            Intervalos de tiempo personalizables:
            <ul>
              <li>1m</li>
              <li>5m</li>
              <li>10m</li>
              <li>15m</li>
              <li>1h</li>
              <li>1d</li>
              <li>1s</li>
              <li>2s</li>
              <li>1 mes</li>
            </ul>
          </$CardDef>
          <$CardDef title="Diseño Responsivo" elevation={0}>
            Interfaz 100% responsiva con tema claro/oscuro personalizable.
            Optimizado para todo tipo de dispositivos y pantallas.
          </$CardDef>
          <$CardDef title="Características Técnicas" elevation={0}>
            <ul>
              <li>Optimización de rendimiento con React</li>
              <li>Configuración personalizada con react-app-rewired</li>
              <li>Estilos con Material-UI y SASS</li>
              <li>Estado global eficiente</li>
              <li>Componentes reutilizables</li>
            </ul>
          </$CardDef>
        </Card>
      </$index>
    );
  }

  function Tecnologias() {
    return (
      <$index label="Stack Tecnológico">
        <Card className="pad-10px">
          <Typography variant="h5">Frontend Core:</Typography>
          {sep}
          <$CardDef title="Tecnologías Base" elevation={0}>
            <ul>
              <li>React 18</li>
              <li>Material-UI</li>
              <li>SASS para estilos avanzados</li>
            </ul>
          </$CardDef>
          <$CardDef title="Desarrollo" elevation={0}>
            <ul>
              <li>react-app-rewired para configuración</li>
              <li>Webpack personalizado</li>
              <li>ESLint para calidad de código</li>
            </ul>
          </$CardDef>
          <$CardDef title="Herramientas" elevation={0}>
            <ul>
              <li>Node.js ≥ 14</li>
              <li>npm para gestión de paquetes</li>
              <li>Git para control de versiones</li>
            </ul>
          </$CardDef>
        </Card>
        <$$h />
        <Card className="pad-20px" elevation={6}>
          <strong>
            Desarrollado con ❤️ por el equipo de FyxToken
          </strong>
        </Card>
      </$index>
    );
  }
}
